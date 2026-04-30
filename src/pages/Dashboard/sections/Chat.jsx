import DashboardLayout from "../../../components/layouts/DashboardLayout";
import { useState, useRef, useEffect } from "react";
import {
  FiSearch,
  FiBell,
  FiSend,
  FiPaperclip,
  FiWifiOff,
  FiRefreshCw,
} from "react-icons/fi";
import { useChat } from "../../../hooks/useChat";
import { formatMessageDate, getInitials } from "../../../utils/chat.utils";

export default function ChatPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const {
    chats,
    selectedChat,
    setSelectedChat,
    messages,
    loading,
    sendingMessage,
    typingStatus,
    connectionStatus,
    handleSendMessage,
    handleTyping,
    currentUserId,
  } = useChat();

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingStatus]);

  const handleSendMessageClick = async () => {
    if (!message.trim()) return;
    const text = message.trim();
    setMessage("");
    await handleSendMessage(text);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessageClick();
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // For now, we just log it as attachments are not fully implemented in API
      console.log("File selected:", file.name);
      // handleSendMessage("", "image", [file]);
    }
  };

  // Filter chats
  const filteredChats = chats.filter((chat) =>
    chat.otherParticipant?.name
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase()),
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

  // Group messages by date
  const groupedMessages = messages.reduce((acc, msg) => {
    const dateKey = formatMessageDate(msg.createdAt);
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(msg);
    return acc;
  }, {});

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row h-[calc(100vh-64px)] bg-gray-50 overflow-hidden">
        {/* Sidebar - Chat List */}
        <div className="w-full md:w-80 bg-white border-b md:border-b-0 md:border-r border-gray-200 flex flex-col h-1/3 md:h-full">
          {/* Chats Header */}
          <div className="px-4 py-3 border-b border-gray-200">
            <h2 className="font-semibold text-gray-800">Chats</h2>
          </div>

          {/* Chat List Search */}
          <div className="px-4 py-3">
            <div className="relative">
              <FiSearch
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={16}
              />
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
                    selectedChat?._id === chat._id
                      ? "bg-blue-50 border-l-4 border-[#8BC53F]"
                      : ""
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
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
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
                    <p
                      className={`text-xs truncate ${chat.unreadCount > 0 ? "font-semibold text-gray-800" : "text-gray-500"}`}
                    >
                      {chat.lastMessage?.text || "No messages yet"}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="w-full md:flex-1 flex flex-col h-2/3 md:h-full relative">
          {/* Connection Status Banner */}
          {connectionStatus !== "connected" && (
            <div className={`absolute top-0 left-0 right-0 z-10 px-4 py-1.5 text-center text-xs font-medium flex items-center justify-center gap-2 transition-all duration-300 ${
              connectionStatus === "reconnecting" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"
            }`}>
              {connectionStatus === "reconnecting" ? (
                <>
                  <FiRefreshCw className="animate-spin" size={12} />
                  Connecting to chat server...
                </>
              ) : (
                <>
                  <FiWifiOff size={12} />
                  Disconnected. Please check your internet.
                </>
              )}
            </div>
          )}

          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#8BC53F] rounded-full flex items-center justify-center text-white font-semibold">
                      {selectedChat.otherParticipant?.avatar || selectedChat.otherParticipant?.profilePicture ? (
                        <img
                          src={selectedChat.otherParticipant.profilePicture || selectedChat.otherParticipant.avatar}
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
                      <p className="text-xs text-gray-500">
                        {selectedChat.bookingId?.serviceType || "Service"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto px-6 py-4 bg-gradient-to-b from-gray-50 to-white">
                <div className="space-y-4 max-w-4xl mx-auto">
                  {messages.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <p>No messages yet. Start the conversation!</p>
                    </div>
                  ) : (
                    Object.entries(groupedMessages).map(([date, msgs]) => (
                      <div key={date}>
                        {/* Date Divider */}
                        <div className="flex items-center justify-center py-4">
                          <span className="px-4 py-1 bg-white rounded-full text-xs text-gray-500 border border-gray-200 shadow-sm">
                            {date}
                          </span>
                        </div>

                        {/* Messages for this date */}
                        <div className="space-y-3">
                          {msgs.map((msg) => {
                            const isCurrentUser =
                              msg.senderId?.toString() === currentUserId;
                            const isSending = msg.status === "sending";

                            return (
                              <div
                                key={msg._id}
                                className={`flex ${
                                  isCurrentUser
                                    ? "justify-end"
                                    : "justify-start"
                                }`}
                              >
                                <div className={`flex items-end gap-2 max-w-xs ${isSending ? "opacity-70" : ""}`}>
                                  {!isCurrentUser && (
                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                                      {getInitials(
                                        selectedChat.otherParticipant?.name,
                                      )}
                                    </div>
                                  )}
                                  <div>
                                    <div
                                      className={`px-4 py-3 rounded-2xl shadow-sm transition-all relative ${
                                        isCurrentUser
                                          ? "bg-[#8BC53F] text-white rounded-br-none"
                                          : "bg-white text-gray-800 rounded-bl-none border border-gray-200"
                                      }`}
                                    >
                                      <p className="text-sm break-words">
                                        {msg.message}
                                      </p>
                                      {isSending && (
                                        <div className="absolute -bottom-4 right-0 text-[10px] text-gray-400 italic">
                                          Sending...
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-1 px-2 mt-1">
                                      <span className="text-xs text-gray-500">
                                        {formatTime(msg.createdAt)}
                                      </span>
                                      {isCurrentUser && !isSending && (
                                        <span className={`text-xs ${msg.read ? "text-blue-500" : "text-gray-400"}`}>
                                          ✓✓
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))
                  )}

                  {/* Typing indicator */}
                  {typingStatus[selectedChat?.bookingId?._id]?.isTyping && (
                    <div className="flex items-end gap-2 justify-start">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                        {getInitials(selectedChat.otherParticipant?.name)}
                      </div>
                      <div className="bg-white text-gray-800 px-4 py-3 rounded-2xl rounded-bl-none border border-gray-200 shadow-sm">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                          <span
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></span>
                          <span
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Message Input */}
              <div className="bg-white border-t border-gray-200 px-6 py-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
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
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#8BC53F] focus:border-transparent disabled:bg-gray-100 transition-all"
                  />
                  <button
                    onClick={handleSendMessageClick}
                    disabled={!message.trim() || sendingMessage}
                    className="w-10 h-10 bg-[#8BC53F] rounded-full flex items-center justify-center text-white hover:bg-[#7ab037] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 shadow-md hover:shadow-lg"
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
            <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
              <div className="text-center">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <FiBell className="text-gray-400" size={40} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Select a chat
                </h2>
                <p className="text-gray-500 mb-6 max-w-sm">
                  Choose a conversation from the list to start messaging with
                  your clients or service users.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
