import { useState, useEffect, useRef, useCallback } from "react";
import { io } from "socket.io-client";
import { chatService } from "../api/chat";
import { useAuthStore } from "../stores/auth.store";
import { useSearchParams, useLocation } from "react-router-dom";

const SOCKET_URL = import.meta.env.VITE_WS_URL;
const CHAT_STATUS_CATEGORY = "active";

export const useChat = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [socket, setSocket] = useState(null);
  const [typingStatus, setTypingStatus] = useState({});
  const [connectionStatus, setConnectionStatus] = useState("connecting");
  const [error, setError] = useState(null);

  const hydrated = useAuthStore((state) => state.hydrated);
  const token = useAuthStore((state) => state.token);
  const currentUserId = useAuthStore((state) => state.user?.data?._id);

  const [searchParams] = useSearchParams();
  const location = useLocation();
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // 1. Socket Initialization
  useEffect(() => {
    if (!hydrated || !token) return;

    const newSocket = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10,
    });

    newSocket.on("connect", () => {
      if (isMounted.current) setConnectionStatus("connected");
      console.log("✅ Connected to chat server");
    });

    newSocket.on("disconnect", (reason) => {
      if (isMounted.current) {
        setConnectionStatus(reason === "io server disconnect" ? "disconnected" : "reconnecting");
      }
    });

    newSocket.on("connect_error", () => {
      if (isMounted.current) setConnectionStatus("reconnecting");
    });

    newSocket.on("new_message", (data) => {
      if (!isMounted.current) return;
      
      // Update messages if this message belongs to the current chat
      if (selectedChat?.bookingId?._id && data.bookingId === selectedChat.bookingId._id) {
        setMessages((prev) => [...prev, data.message]);
      }

      // Update chat list last message
      updateChatLastMessage(data.bookingId, data.message);
    });

    newSocket.on("user_typing", (data) => {
      if (!isMounted.current) return;
      
      setTypingStatus((prev) => ({
        ...prev,
        [data.bookingId]: {
          isTyping: data.isTyping,
          username: data.username,
        },
      }));

      // Clear typing status after 3 seconds
      if (data.isTyping) {
        setTimeout(() => {
          if (isMounted.current) {
            setTypingStatus((prev) => ({
              ...prev,
              [data.bookingId]: { isTyping: false },
            }));
          }
        }, 3000);
      }
    });

    newSocket.on("message_read", (data) => {
      if (!isMounted.current) return;
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === data.messageId ? { ...msg, read: true } : msg,
        ),
      );
    });

    newSocket.on("error", (err) => {
      console.error("❌ Socket error:", err);
      if (isMounted.current) setError(err.message || "Socket error");
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [hydrated, token, selectedChat?.bookingId?._id]);

  // 2. Chat List Loading
  const loadChats = useCallback(async () => {
    try {
      if (isMounted.current) setLoading(true);
      const response = await chatService.getAllChats(1, 50, CHAT_STATUS_CATEGORY);
      if (isMounted.current) setChats(response.data || []);
    } catch (err) {
      console.error("Error loading chats:", err);
      if (isMounted.current) setError("Failed to load chats");
    } finally {
      if (isMounted.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadChats();
  }, [loadChats]);

  // 3. Last Message Update Logic
  const updateChatLastMessage = useCallback((bookingId, newMessage) => {
    setChats((prev) =>
      prev.map((chat) => {
        // Handle both object and string bookingId
        const chatBookingId = chat.bookingId?._id || chat.bookingId;
        if (chatBookingId === bookingId) {
          return {
            ...chat,
            lastMessage: {
              text: newMessage.message,
              timestamp: newMessage.createdAt,
            },
            lastMessageTime: newMessage.createdAt,
            unreadCount:
              selectedChat?.bookingId?._id !== bookingId
                ? (chat.unreadCount || 0) + 1
                : 0,
          };
        }
        return chat;
      }),
    );
  }, [selectedChat?.bookingId?._id]);

  // 4. Message Loading
  const loadMessages = useCallback(async (bookingId) => {
    try {
      const response = await chatService.getMessages(bookingId, 1, 100);
      const messagesData = response.data.messages || [];
      if (isMounted.current) setMessages(messagesData.reverse());
    } catch (err) {
      console.error("Error loading messages:", err);
      if (isMounted.current) {
        setMessages([]);
        setError("Failed to load messages");
      }
    }
  }, []);

  // 5. Mark as Read
  const markAsRead = useCallback(async (bookingId) => {
    try {
      await chatService.markAsRead(bookingId);
      if (isMounted.current) {
        setChats((prev) =>
          prev.map((chat) => {
            const chatBookingId = chat.bookingId?._id || chat.bookingId;
            return chatBookingId === bookingId ? { ...chat, unreadCount: 0 } : chat;
          }),
        );
      }
    } catch (err) {
      console.error("Error marking as read:", err);
    }
  }, []);

  // 6. Selected Chat Logic
  useEffect(() => {
    if (selectedChat) {
      const bookingId = selectedChat.bookingId?._id || selectedChat.bookingId;
      if (!bookingId) return;
      
      loadMessages(bookingId);

      if (socket && socket.connected) {
        socket.emit("join_chat", { bookingId });
        markAsRead(bookingId);
      }
    }

    return () => {
      if (selectedChat && socket) {
        const bookingId = selectedChat.bookingId?._id || selectedChat.bookingId;
        socket.emit("leave_chat", { bookingId });
      }
    };
  }, [selectedChat, socket, loadMessages, markAsRead]);

  // 7. Auto-select logic (Improved)
  useEffect(() => {
    const bookingIdParam = searchParams.get("bookingId");
    const chatIdParam = searchParams.get("chatId");
    
    // Check if we have it in session storage to handle refresh better
    const lastBookingId = sessionStorage.getItem("lastActiveChatBookingId");
    const targetBookingId = bookingIdParam || lastBookingId;

    const routeBooking = location.state?.booking || null;
    const routeOtherParticipant =
      location.state?.customer ||
      location.state?.provider ||
      routeBooking?.userId ||
      routeBooking?.providerId ||
      null;
    const routeBookingId = routeBooking?._id || routeBooking?.id || null;

    if (targetBookingId && chats.length > 0) {
      const chat = chats.find(
        (c) => (c.bookingId?._id || c.bookingId) === targetBookingId || c._id === chatIdParam,
      );
      if (chat) {
        setSelectedChat(chat);
        sessionStorage.setItem("lastActiveChatBookingId", targetBookingId);
        return;
      }
    }

    // Fallback to route state if no chat found in list yet
    if (routeBookingId && !selectedChat) {
      const virtualChat = {
        _id: `virtual-${routeBookingId}`,
        bookingId: {
          _id: routeBookingId,
          serviceType: routeBooking?.serviceType || routeBooking?.subCategory || "Service",
          status: routeBooking?.status || "Active Booking",
        },
        otherParticipant: {
          _id: routeOtherParticipant?._id || null,
          name: routeOtherParticipant?.fullName || routeOtherParticipant?.name || "User",
          avatar: routeOtherParticipant?.profilePicture || routeOtherParticipant?.avatar || null,
          profilePicture: routeOtherParticipant?.profilePicture || routeOtherParticipant?.avatar || null,
        },
        unreadCount: 0,
        lastMessage: null,
        lastMessageTime: routeBooking?.updatedAt || routeBooking?.createdAt || null,
      };
      setSelectedChat(virtualChat);
      sessionStorage.setItem("lastActiveChatBookingId", routeBookingId);
    }
  }, [searchParams, chats, location.state, selectedChat]);

  // 8. Sending Messages
  const handleSendMessage = async (text, type = "text", attachments = []) => {
    if ((!text.trim() && attachments.length === 0) || !selectedChat) return;

    const bookingId = selectedChat.bookingId?._id || selectedChat.bookingId;
    const tempId = `temp-${Date.now()}`;
    
    // Optimistic update with "sending" state
    const optimisticMessage = {
      _id: tempId,
      senderId: currentUserId,
      message: text,
      messageType: type,
      attachments,
      createdAt: new Date().toISOString(),
      status: "sending",
    };

    if (isMounted.current) setMessages((prev) => [...prev, optimisticMessage]);

    try {
      if (isMounted.current) setSendingMessage(true);

      if (socket && socket.connected) {
        socket.emit("send_message", {
          bookingId,
          message: text,
          messageType: type,
          attachments,
        });
        // Socket messages will come back via "new_message" and replace optimistic one
        // We filter out the temp message when real one arrives or just let it be
      } else {
        const response = await chatService.sendMessage(bookingId, {
          message: text,
          messageType: type,
          attachments,
        });
        
        if (isMounted.current) {
          setMessages((prev) => 
            prev.map(msg => msg._id === tempId ? { ...response.data, status: "sent" } : msg)
          );
          updateChatLastMessage(bookingId, response.data);
        }
      }
    } catch (err) {
      console.error("Error sending message:", err);
      if (isMounted.current) {
        setMessages((prev) => 
          prev.map(msg => msg._id === tempId ? { ...msg, status: "error" } : msg)
        );
      }
    } finally {
      if (isMounted.current) setSendingMessage(false);
    }
  };

  // 9. Typing Indicators
  const handleTyping = (isTyping) => {
    if (socket && selectedChat) {
      const bookingId = selectedChat.bookingId?._id || selectedChat.bookingId;
      socket.emit("typing", {
        bookingId,
        isTyping,
      });
    }
  };

  return {
    chats,
    selectedChat,
    setSelectedChat: (chat) => {
      if (chat?.bookingId?._id) {
        sessionStorage.setItem("lastActiveChatBookingId", chat.bookingId._id);
      }
      setSelectedChat(chat);
    },
    messages,
    loading,
    sendingMessage,
    socket,
    typingStatus,
    connectionStatus,
    error,
    handleSendMessage,
    handleTyping,
    loadChats,
    currentUserId,
  };
};
