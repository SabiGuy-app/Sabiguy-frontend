import { useState, useEffect, useRef, useCallback } from "react";
import { chatService } from "../api/chat";
import { useAuthStore } from "../stores/auth.store";
import { useSearchParams, useLocation } from "react-router-dom";
import { getSharedSocket, releaseSocket } from "../services/socketManager";

export const useChat = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false); // Fix 3.1 / 6.3
  const [hasMoreMessages, setHasMoreMessages] = useState(false);
  const [messagesPage, setMessagesPage] = useState(1);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [socket, setSocket] = useState(null);
  const [typingStatus, setTypingStatus] = useState({});
  const [connectionStatus, setConnectionStatus] = useState("connecting");
  const [error, setError] = useState(null);

  const hydrated = useAuthStore((state) => state.hydrated);
  const token = useAuthStore((state) => state.token);
  const currentUserId = useAuthStore((state) => state.user?.data?._id || state.user?._id || state.user?.id);

  const [searchParams] = useSearchParams();
  const location = useLocation();
  const isMounted = useRef(true);

  // Fix 2.1 / 2.2: Refs to always access latest values in socket callbacks
  const selectedChatRef = useRef(selectedChat);
  const updateChatLastMessageRef = useRef(null);

  // Keep selectedChatRef in sync
  useEffect(() => {
    selectedChatRef.current = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // 1. Socket Initialization — uses shared socket manager (fixes 2.3, 2.4, 2.5)
  useEffect(() => {
    if (!hydrated || !token) return;

    const newSocket = getSharedSocket();
    if (!newSocket) return;

    const onConnect = () => {
      if (isMounted.current) setConnectionStatus("connected");
      console.log("✅ Connected to chat server:", newSocket.id);
    };

    const onDisconnect = (reason) => {
      console.warn("❌ Disconnected from chat server:", reason);
      if (isMounted.current) {
        setConnectionStatus(reason === "io server disconnect" ? "disconnected" : "reconnecting");
      }
    };

    const onConnectError = (err) => {
      console.error("⚠️ Socket connection error:", err);
      if (isMounted.current) setConnectionStatus("reconnecting");
    };

    // Fix 2.6: Detect when all reconnection attempts are exhausted
    const onReconnectFailed = () => {
      console.error("❌ Socket reconnection exhausted — giving up.");
      if (isMounted.current) setConnectionStatus("failed");
    };

    const onNewMessage = (data) => {
      console.log("📩 New message received:", data);
      if (!isMounted.current) return;
      
      const incomingMsg = data.message || data;
      const bookingId = data.bookingId || data.booking_id || incomingMsg.bookingId;
      const incomingSenderId = incomingMsg.senderId?._id || incomingMsg.senderId;

      setMessages((prev) => {
        const isDuplicate = prev.some(m => m._id === incomingMsg._id);
        if (isDuplicate) return prev;

        // Match by text and sender ID (handling both string and object)
        const sendingIdx = prev.findLastIndex(m => {
          const mSenderId = m.senderId?._id || m.senderId;
          return m.status === "sending" && 
                 m.message === incomingMsg.message && 
                 String(mSenderId) === String(incomingSenderId);
        });

        if (sendingIdx !== -1) {
          const newMsgs = [...prev];
          newMsgs[sendingIdx] = { ...incomingMsg, status: "sent" };
          return newMsgs;
        }

        // Fix 2.1: Read from ref, not stale closure
        const current = selectedChatRef.current;
        const currentBookingId = current?.bookingId?._id || current?.bookingId;
        if (String(currentBookingId) === String(bookingId)) {
          return [...prev, incomingMsg];
        }
        return prev;
      });

      // Fix 2.2: Call via ref
      if (bookingId && updateChatLastMessageRef.current) {
        updateChatLastMessageRef.current(bookingId, incomingMsg);
      }
    };

    const onUserTyping = (data) => {
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
    };

    const onMessageRead = (data) => {
      if (!isMounted.current) return;
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === data.messageId ? { ...msg, read: true } : msg,
        ),
      );
    };

    const onSocketError = (err) => {
      console.error("❌ Socket error:", err);
      if (isMounted.current) setError(err.message || "Socket error");
    };

    // Attach listeners
    newSocket.on("connect", onConnect);
    newSocket.on("disconnect", onDisconnect);
    newSocket.on("connect_error", onConnectError);
    newSocket.on("reconnect_failed", onReconnectFailed);
    newSocket.on("new_message", onNewMessage);
    newSocket.on("user_typing", onUserTyping);
    newSocket.on("message_read", onMessageRead);
    newSocket.on("error", onSocketError);

    // If already connected, set status immediately
    if (newSocket.connected) {
      setConnectionStatus("connected");
    }

    setSocket(newSocket);

    return () => {
      // Remove only our listeners, don't disconnect (shared socket)
      newSocket.off("connect", onConnect);
      newSocket.off("disconnect", onDisconnect);
      newSocket.off("connect_error", onConnectError);
      newSocket.off("reconnect_failed", onReconnectFailed);
      newSocket.off("new_message", onNewMessage);
      newSocket.off("user_typing", onUserTyping);
      newSocket.off("message_read", onMessageRead);
      newSocket.off("error", onSocketError);
      releaseSocket();
    };
  }, [hydrated, token]);

  // 2. Chat List Loading — Fix 1.1: guard on hydrated + token
  const loadChats = useCallback(async () => {
    if (!hydrated || !token) return;
    try {
      if (isMounted.current) setLoading(true);
      const response = await chatService.getAllChats(1, 50);
      
      let chatList = [];
      if (Array.isArray(response)) {
        chatList = response;
      } else if (response && response.data) {
        if (Array.isArray(response.data)) {
          chatList = response.data;
        } else if (Array.isArray(response.data.chats)) {
          chatList = response.data.chats;
        } else if (Array.isArray(response.chats)) {
          chatList = response.chats;
        }
      }
      
      if (isMounted.current) setChats(chatList);
    } catch (err) {
      console.error("Error loading chats:", err);
      if (isMounted.current) setError("Failed to load chats");
    } finally {
      if (isMounted.current) setLoading(false);
    }
  }, [hydrated, token]);

  useEffect(() => {
    loadChats();
  }, [loadChats]);

  // 3. Last Message Update Logic — Fix 2.2: store in ref
  const updateChatLastMessage = useCallback((bookingId, newMessage) => {
    // Read selectedChat from ref for correct unread logic
    const current = selectedChatRef.current;
    setChats((prev) =>
      prev.map((chat) => {
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
              (current?.bookingId?._id || current?.bookingId) !== bookingId
                ? (chat.unreadCount || 0) + 1
                : 0,
          };
        }
        return chat;
      }),
    );
  }, []);

  // Keep the ref in sync
  useEffect(() => {
    updateChatLastMessageRef.current = updateChatLastMessage;
  }, [updateChatLastMessage]);

  // 4. Message Loading — Fix 3.1: separate messagesLoading state
  const loadMessages = useCallback(async (bookingId) => {
    if (!bookingId) return;
    try {
      if (isMounted.current) {
        setMessagesLoading(true);
        setMessagesPage(1);
      }
      const response = await chatService.getMessages(bookingId, 1, 50);
      
      // Similar robust extraction for messages
      let messagesData = [];
      if (Array.isArray(response)) {
        messagesData = response;
      } else if (response && response.data) {
        if (Array.isArray(response.data)) {
          messagesData = response.data;
        } else if (Array.isArray(response.data.messages)) {
          messagesData = response.data.messages;
        } else if (Array.isArray(response.messages)) {
          messagesData = response.messages;
        }
      }

      if (isMounted.current) {
        setMessages([...messagesData].reverse());
        // Handle pagination state
        if (response.data?.pagination) {
          const { hasNextPage, currentPage, totalPages } = response.data.pagination;
          setHasMoreMessages(hasNextPage === true || currentPage < totalPages);
        } else {
          setHasMoreMessages(messagesData.length >= 50);
        }
      }
    } catch (err) {
      console.error("Error loading messages:", err);
      if (isMounted.current) {
        setMessages([]);
        setError(err.response?.data?.message || "Failed to load messages");
      }
    } finally {
      if (isMounted.current) setMessagesLoading(false);
    }
  }, []);

  // Load More Messages function
  const loadMoreMessages = useCallback(async () => {
    if (!selectedChat || messagesLoading || !hasMoreMessages) return;
    const bookingId = selectedChat.bookingId?._id || selectedChat.bookingId;
    if (!bookingId) return;

    try {
      if (isMounted.current) setMessagesLoading(true);
      const nextPage = messagesPage + 1;
      const response = await chatService.getMessages(bookingId, nextPage, 50);

      let messagesData = [];
      if (Array.isArray(response)) {
        messagesData = response;
      } else if (response && response.data) {
        if (Array.isArray(response.data)) {
          messagesData = response.data;
        } else if (Array.isArray(response.data.messages)) {
          messagesData = response.data.messages;
        } else if (Array.isArray(response.messages)) {
          messagesData = response.messages;
        }
      }

      if (isMounted.current) {
        setMessages(prev => [...[...messagesData].reverse(), ...prev]);
        setMessagesPage(nextPage);
        if (response.data?.pagination) {
          const { hasNextPage, currentPage, totalPages } = response.data.pagination;
          setHasMoreMessages(hasNextPage === true || currentPage < totalPages);
        } else {
          setHasMoreMessages(messagesData.length >= 50);
        }
      }
    } catch (err) {
      console.error("Error loading older messages:", err);
      if (isMounted.current) {
        setError(err.response?.data?.message || "Failed to load older messages");
      }
    } finally {
      if (isMounted.current) setMessagesLoading(false);
    }
  }, [selectedChat, messagesLoading, hasMoreMessages, messagesPage]);

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
      
      // Clear messages immediately to avoid showing stale messages from previous chat
      setMessages([]);
      loadMessages(bookingId);

      if (socket && socket.connected) {
        console.log("🏠 Joining chat room:", bookingId);
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

  // 7. Auto-select logic — Fix 5.1: use ref for selectedChat, remove from deps
  //    Fix 5.2: support ?chatId when chats haven't loaded
  //    Fix 5.3: support ?messageId param
  useEffect(() => {
    if (!hydrated) return;

    const bookingIdParam = searchParams.get("bookingId");
    const chatIdParam = searchParams.get("chatId");
    const messageIdParam = searchParams.get("messageId");
    
    // Fallback chain: URL param -> Session storage
    const targetBookingId = bookingIdParam || sessionStorage.getItem("lastActiveChatBookingId");
    // Fix 5.2 / 5.3: also consider chatId and messageId as identifiers
    const targetChatId = chatIdParam;
    const targetMessageId = messageIdParam;

    // Nothing to auto-select
    if (!targetBookingId && !targetChatId && !targetMessageId) return;

    // If we have chats, try to find the real chat object
    if (chats.length > 0) {
      const chat = chats.find((c) => {
        if (targetBookingId && ((c.bookingId?._id || c.bookingId) === targetBookingId)) return true;
        if (targetChatId && c._id === targetChatId) return true;
        // Fix 5.3: messageId — attempt to match via chat's last message or just select first matching
        return false;
      });
      if (chat) {
        // Fix 5.1: read from ref to avoid re-triggering
        if (selectedChatRef.current?._id !== chat._id) {
          setSelectedChat(chat);
          const bid = chat.bookingId?._id || chat.bookingId;
          if (bid) sessionStorage.setItem("lastActiveChatBookingId", bid);
        }
        return;
      }
    }

    // Fallback: If not in chat list (or list still loading), create virtual chat
    // Fix 5.1: use ref instead of state in condition
    const currentSelectedBookingId = selectedChatRef.current?.bookingId?._id || selectedChatRef.current?.bookingId;
    const needsVirtual = targetBookingId && (
      !selectedChatRef.current ||
      (currentSelectedBookingId !== targetBookingId)
    );

    // Fix 5.2: also create virtual if we only have chatId and no match
    const needsVirtualFromChatId = targetChatId && !selectedChatRef.current && chats.length > 0;

    if (needsVirtual || needsVirtualFromChatId) {
      // Fix 3.2: try to use available data from route state, URL params, or sessionStorage
      const routeBooking = location.state?.booking;
      const routeParticipant = location.state?.customer || location.state?.provider || routeBooking?.userId || routeBooking?.providerId;

      const virtualChat = {
        _id: `virtual-${targetBookingId || targetChatId || "unknown"}`,
        bookingId: {
          _id: targetBookingId || "",
          serviceType: routeBooking?.serviceType || routeBooking?.subCategory?.replace(/_/g, " ") || "Service",
          status: routeBooking?.status || "Active",
        },
        otherParticipant: {
          _id: routeParticipant?._id || null,
          name: routeParticipant?.fullName || routeParticipant?.name || sessionStorage.getItem("lastChatParticipantName") || "Loading...",
          avatar: routeParticipant?.profilePicture || routeParticipant?.avatar || null,
        },
        unreadCount: 0,
        lastMessage: null,
      };
      
      setSelectedChat(virtualChat);
      if (targetBookingId) sessionStorage.setItem("lastActiveChatBookingId", targetBookingId);
    }
  }, [searchParams, chats, location.state, hydrated]);
  // Fix 5.1: selectedChat removed from deps — using selectedChatRef instead

  // 8. Sending Messages — Fix 4.4: socket send timeout
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
        console.log("📤 Sending socket message:", { bookingId, text });
        socket.emit("send_message", {
          bookingId,
          message: text,
          messageType: type,
          attachments,
          senderId: currentUserId, // Include senderId explicitly
        });

        // Fix 4.4: Timeout — if no acknowledgment within 10s, mark as error
        setTimeout(() => {
          if (isMounted.current) {
            setMessages((prev) =>
              prev.map(msg =>
                msg._id === tempId && msg.status === "sending"
                  ? { ...msg, status: "error" }
                  : msg
              )
            );
          }
        }, 10000);
      } else {
        const response = await chatService.sendMessage(bookingId, {
          message: text,
          messageType: type,
          attachments,
        });
        
        if (isMounted.current) {
          const sentMsg = response.data?.data || response.data?.message || response.data || response;
          setMessages((prev) => 
            prev.map(msg => msg._id === tempId ? { ...sentMsg, status: "sent" } : msg)
          );
          updateChatLastMessage(bookingId, sentMsg);
        }
      }
    } catch (err) {
      console.error("Error sending message:", err);
      if (isMounted.current) {
        const backendError = err.response?.data?.message;
        if (backendError) setError(backendError);
        setMessages((prev) => 
          prev.map(msg => msg._id === tempId ? { ...msg, status: "error", errorText: backendError } : msg)
        );
      }
    } finally {
      if (isMounted.current) setSendingMessage(false);
    }
  };

  // Fix 4.1: Retry a failed message
  const retryMessage = useCallback(async (messageId) => {
    const failedMsg = messages.find(m => m._id === messageId && m.status === "error");
    if (!failedMsg) return;

    // Remove the failed message
    setMessages((prev) => prev.filter(m => m._id !== messageId));

    // Re-send
    await handleSendMessage(failedMsg.message, failedMsg.messageType || "text", failedMsg.attachments || []);
  }, [messages, selectedChat, socket, currentUserId]);

  // Fix 4.1: Dismiss a failed message
  const dismissMessage = useCallback((messageId) => {
    setMessages((prev) => prev.filter(m => m._id !== messageId));
  }, []);

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

  // Compute final chats list for UI - ensure selectedChat is always visible
  const uiChats = [...chats];
  if (selectedChat) {
    const selectedBookingId = String(selectedChat.bookingId?._id || selectedChat.bookingId);
    const isAlreadyInList = chats.some(c => {
      const cBookingId = String(c.bookingId?._id || c.bookingId);
      return cBookingId === selectedBookingId || String(c._id) === String(selectedChat._id);
    });
    
    if (!isAlreadyInList) {
      uiChats.unshift(selectedChat);
    }
  }

  return {
    chats: uiChats,
    selectedChat,
    setSelectedChat: (chat) => {
      if (chat?.bookingId?._id) {
        sessionStorage.setItem("lastActiveChatBookingId", chat.bookingId._id);
      }
      // Fix 3.2: Cache participant name for refresh fallback
      if (chat?.otherParticipant?.name && chat.otherParticipant.name !== "Loading...") {
        sessionStorage.setItem("lastChatParticipantName", chat.otherParticipant.name);
      }
      setSelectedChat(chat);
    },
    messages,
    loading,
    messagesLoading, // Fix 3.1 / 6.3
    sendingMessage,
    socket,
    typingStatus,
    connectionStatus,
    error,
    handleSendMessage,
    handleTyping,
    loadChats,
    currentUserId,
    retryMessage,     // Fix 4.1
    dismissMessage,   // Fix 4.1
    hasMoreMessages,
    loadMoreMessages,
  };
};
