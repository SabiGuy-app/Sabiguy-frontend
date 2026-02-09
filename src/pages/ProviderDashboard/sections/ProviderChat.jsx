import React from "react";
import { useState, useEffect, useRef } from "react";
import ProviderDashboardLayout from "../../../components/layouts/ProviderDashboardLayout";
import {
  FiSearch,
  FiSend,
  FiPaperclip,
  FiPhone,
} from "react-icons/fi";
import { io } from "socket.io-client";
import { chatService } from "../../../api/chat";
import { useAuthStore } from "../../../stores/auth.store";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;


const ProviderChat = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);
  const currentUserId = useAuthStore((state) => state.user?.data?._id);
  const [searchQuery, setSearchQuery] = useState("");


    useEffect(() => {
    const token = useAuthStore.getState().token;
      if (!token) return;
  
      const newSocket = io(SOCKET_URL, {
        auth: { token },
        transports: ['websocket', 'polling'], // ✅ Add this
  reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      });
  
      newSocket.on("connect", () => {
        console.log("Connected to chat server");
      });
  
      newSocket.on("connected", (data) => {
        console.log(" Server confirmed connection:", data);
      });
  
      newSocket.on("new_message", (data) => {
        console.log(" New message received:", data);
        
        if (selectedChat && data.bookingId === selectedChat.bookingId._id) {
          setMessages((prev) => [...prev, data.message]);
          scrollToBottom();
        }
        
        updateChatLastMessage(data.bookingId, data.message);
      });
  
      newSocket.on("user_typing", (data) => {
        console.log("⌨️ User typing:", data);
      });
  
      newSocket.on("error", (error) => {
        console.error("❌ Socket error:", error);
      });
  
      setSocket(newSocket);
  
      return () => {
        newSocket.disconnect();
      };
    }, []);
  
    useEffect(() => {
      loadChats();
    }, []);
  
  
    useEffect(() => {
      if (selectedChat) {
        loadMessages(selectedChat.bookingId._id);
        
        if (socket) {
          socket.emit("join_chat", { bookingId: selectedChat.bookingId._id });
          markAsRead(selectedChat.bookingId._id);
        }
      }
  
      return () => {
        if (selectedChat && socket) {
          socket.emit("leave_chat", { bookingId: selectedChat.bookingId._id });
        }
      };
    }, [selectedChat, socket]);
  
    // Auto-scroll to bottom
    useEffect(() => {
      scrollToBottom();
    }, [messages]);
  
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
  
    // Load all chats
    const loadChats = async () => {
      try {
        setLoading(true);
        const response = await chatService.getAllChats();
        setChats(response.data || []);
      } catch (error) {
        console.error("Error loading chats:", error);
      } finally {
        setLoading(false);
      }
    };
  
  const loadMessages = async (bookingId) => {
      try {
        const response = await chatService.getMessages(bookingId, 1, 100);
        const messagesData = response.data.messages || [];
        setMessages(messagesData.reverse());
      } catch (error) {
        console.error("Error loading messages:", error);
        setMessages([]);
      }
    };
    // Mark messages as read
    const markAsRead = async (bookingId) => {
      try {
        await chatService.markAsRead(bookingId);
        
        setChats((prev) =>
          prev.map((chat) =>
            chat.bookingId._id === bookingId
              ? { ...chat, unreadCount: 0 }
              : chat
          )
        );
      } catch (error) {
        console.error("Error marking as read:", error);
      }
    };
  
    // Update chat list with new last message
    const updateChatLastMessage = (bookingId, newMessage) => {
      setChats((prev) =>
        prev.map((chat) => {
          if (chat.bookingId._id === bookingId) {
            return {
              ...chat,
              lastMessage: {
                text: newMessage.message,
                timestamp: newMessage.createdAt,
              },
              lastMessageTime: newMessage.createdAt,
              unreadCount:
                selectedChat?.bookingId._id !== bookingId
                  ? (chat.unreadCount || 0) + 1
                  : 0,
            };
          }
          return chat;
        })
      );
    };
  
    // Send message
    const handleSendMessage = async () => {
      if (!message.trim() || !selectedChat) return;
  
      const messageText = message.trim();
      setMessage("");
  
      try {
        setSendingMessage(true);
  
        if (socket && socket.connected) {
          socket.emit("send_message", {
            bookingId: selectedChat.bookingId._id,
            message: messageText,
            messageType: "text",
          });
        } else {
          const response = await chatService.sendMessage(
            selectedChat.bookingId._id,
            {
              message: messageText,
              messageType: "text",
            }
          );
  
          setMessages((prev) => [...prev, response.data]);
          updateChatLastMessage(selectedChat.bookingId._id, response.data);
        }
      } catch (error) {
        console.error("Error sending message:", error);
        setMessage(messageText);
      } finally {
        setSendingMessage(false);
      }
    };
  
    // Handle typing indicator
    const handleTyping = (isTyping) => {
      if (socket && selectedChat) {
        socket.emit("typing", {
          bookingId: selectedChat.bookingId._id,
          isTyping,
        });
      }
    };
  
    const handleKeyPress = (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    };
  
    // Filter chats
    const filteredChats = chats.filter((chat) =>
      chat.otherParticipant?.name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  
    // Format time
    const formatTime = (timestamp) => {
      if (!timestamp) return "";
      const date = new Date(timestamp);
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    };
  
    // Format relative time
    const formatRelativeTime = (timestamp) => {
      if (!timestamp) return "";
      const now = new Date();
      const date = new Date(timestamp);
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);
  
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      return `${diffDays}d ago`;
    };
  
    // Get initials
    const getInitials = (name) => {
      if (!name) return "?";
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    };

  return (
    <ProviderDashboardLayout> <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Chat List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}

          {/* Chats Header */}
          <div className="px-4 py-3 border-b border-gray-200">
            <h2 className="font-semibold text-gray-800">Chats</h2>
          </div>

        {/* Chat List Search */}
        <div className="px-4 py-3">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8BC53F] focus:border-transparent"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8BC53F]"></div>
            </div>
          ) : filteredChats.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No chats yet</p>
            </div>
          ) : (
          filteredChats.map((chat) => (
            <div
              key={chat._id}
              onClick={() => setSelectedChat(chat)}
              className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedChat?._id === chat._id ? "bg-gray-100" : ""
              }`}
            >
             <div className="relative">
                  <div className="w-12 h-12 bg-[#8BC53F] rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                    {chat.otherParticipant?.avatar ? (
                      <img
                        src={chat.otherParticipant.avatar}
                        alt=""
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      getInitials(chat.otherParticipant?.name)
                    )}
                  </div>
                  {chat.unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
                      {chat.unreadCount}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-800 text-sm truncate">
                      {chat.otherParticipant?.name || "Unknown User"}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {formatRelativeTime(chat.lastMessageTime)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">
                    {chat.lastMessage?.text || "No messages yet"}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#8BC53F] rounded-full flex items-center justify-center text-white font-semibold">
                    {selectedChat.otherParticipant?.avatar ? (
                      <img
                        src={selectedChat.otherParticipant.profilePicture}
                        alt=""
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      getInitials(selectedChat.otherParticipant?.name)
                    )}
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-800">
                      {selectedChat.otherParticipant?.name || "Unknown User"}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {selectedChat.bookingId?.serviceType || "Service"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button className="text-gray-600 hover:text-gray-800">
                    <span className="text-sm p-2 bg-[#005823]/10 rounded">
                      View Profile
                    </span>
                  </button>
                  <button className="text-gray-600 hover:text-gray-800">
                    <span className="text-sm text-[#005823] border border-gray-300 p-2 rounded">
                      {selectedChat.bookingId?.status || "Active Booking"}
                    </span>
                  </button>
                  <button className="text-gray-600 hover:text-gray-800">
                    <FiPhone size={20} />
                  </button>
                </div>
              </div>
            </div>

              {/* Date Divider */}
              <div className="flex items-center justify-center py-4 bg-gray-50">
                <span className="px-4 py-1 bg-white rounded-full text-sm text-gray-500 border border-gray-200">
                  Today
                </span>
              </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-6 py-4 bg-gray-50">
              <div className="space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isCurrentUser =
                      msg.senderId?.toString() === currentUserId;

                    return (
                      <div
                        key={msg._id}
                        className={`flex ${
                          isCurrentUser ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div className="flex items-end gap-2 max-w-md">
                          {!isCurrentUser && (
                            <div className="w-8 h-8 bg-pink-400 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                              {getInitials(
                                selectedChat.otherParticipant?.name
                              )}
                            </div>
                          )}
                          <div>
                            <div
                              className={`px-4 py-3 rounded-2xl ${
                                isCurrentUser
                                  ? "bg-[#8BC53F] text-white rounded-br-sm"
                                  : "bg-white text-gray-800 rounded-bl-sm"
                              }`}
                            >
                              <p className="text-sm">{msg.message}</p>
                            </div>
                            <span className="text-xs text-gray-500 mt-1 block px-2">
                              {formatTime(msg.createdAt)}
                            </span>
                          </div>
                          {isCurrentUser && (
                            <div className="w-8 h-8 bg-[#8BC53F] rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                              You
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 px-6 py-4">
              <div className="flex items-center gap-3">
                <button className="text-gray-400 hover:text-gray-600">
                  <FiPaperclip size={20} />
                </button>
                <input
                  type="text"
                  placeholder="Type your message"
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    handleTyping(true);
                  }}
                  onBlur={() => handleTyping(false)}
                  onKeyPress={handleKeyPress}
                  disabled={sendingMessage}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BC53F] focus:border-transparent disabled:bg-gray-100"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim() || sendingMessage}
                  className="w-10 h-10 bg-[#005823] rounded-lg flex items-center justify-center text-white hover:bg-[#004019] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sendingMessage ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <FiSend size={18} />
                  )}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Connect with trusted providers
              </h2>
              <p className="text-gray-500 mb-6">
                Browse services, start a chat, and get the right expert for your task.
              </p>
              <button className="px-6 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                Browse services
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
    </ProviderDashboardLayout>
  );
};

export default ProviderChat;
