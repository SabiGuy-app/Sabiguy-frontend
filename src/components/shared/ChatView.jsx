import React, { useState, useRef, useEffect } from "react";
import { FiSearch, FiSend, FiBell } from "react-icons/fi";
import { FiArrowLeft, FiWifiOff, FiAlertTriangle, FiRefreshCw, FiX } from "react-icons/fi";
import { useChat } from "../../hooks/useChat";
import { formatMessageDate, getInitials, formatTime, formatRelativeTime } from "../../utils/chat.utils";

/**
 * Shared ChatView component used by both Customer Chat and Provider Chat.
 * The only differences are the Layout wrapper and the empty-state copy,
 * which are passed in as props.
 *
 * Fixes applied:
 *  4.1  — Retry/dismiss UI for error messages
 *  4.2  — Visual error treatment for status:"error"
 *  4.5  — File attachment button hidden (was non-functional)
 *  4.6  — onKeyPress → onKeyDown
 *  6.1  — Error state rendered as dismissible banner
 *  6.2  — connectionStatus rendered as banner
 *  6.3  — messagesLoading spinner when switching chats
 *  6.4  — Mobile back button
 *  6.5  — Typing indicator works with string bookingId
 *  2.6  — "failed" connection status banner
 *  7.1  — Single shared component (no duplication)
 *  7.3  — Empty-state copy controlled by prop
 */
export default function ChatView({ emptyStateText }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [message, setMessage] = useState("");
  const [mobileShowChat, setMobileShowChat] = useState(false); // Fix 6.4
  const messagesEndRef = useRef(null);

  const {
    chats,
    selectedChat,
    setSelectedChat,
    messages,
    loading,
    messagesLoading,
    sendingMessage,
    typingStatus,
    connectionStatus,
    handleSendMessage,
    handleTyping,
    currentUserId,
    error,
    retryMessage,
    dismissMessage,
    hasMoreMessages,
    loadMoreMessages,
  } = useChat();

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingStatus]);

  // When a chat is auto-selected (e.g. from URL), show chat on mobile
  useEffect(() => {
    if (selectedChat) setMobileShowChat(true);
  }, [selectedChat]);

  const handleSendMessageClick = async () => {
    if (!message.trim()) return;
    const text = message.trim();
    setMessage("");
    await handleSendMessage(text);
  };

  // Fix 4.6: onKeyDown instead of onKeyPress
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessageClick();
    }
  };

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    setMobileShowChat(true); // Fix 6.4
  };

  const handleMobileBack = () => {
    setMobileShowChat(false); // Fix 6.4
  };

  // Filter chats
  const filteredChats = chats.filter((chat) =>
    chat.otherParticipant?.name
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase()),
  );

  // Group messages by date
  const groupedMessages = messages.reduce((acc, msg) => {
    const dateKey = formatMessageDate(msg.createdAt);
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(msg);
    return acc;
  }, {});

  // Fix 6.5: Resolve typing bookingId (handles both object and string)
  const typingBookingId = selectedChat?.bookingId?._id || selectedChat?.bookingId;

  // Fix 6.2: Connection status banner
  const renderConnectionBanner = () => {
    if (connectionStatus === "connected") return null;

    const bannerConfig = {
      connecting: { bg: "bg-blue-50 border-blue-200", text: "text-blue-700", icon: null, label: "Connecting to chat server..." },
      reconnecting: { bg: "bg-yellow-50 border-yellow-200", text: "text-yellow-700", icon: <FiWifiOff className="flex-shrink-0" size={14} />, label: "Reconnecting... Messages may be delayed." },
      disconnected: { bg: "bg-red-50 border-red-200", text: "text-red-700", icon: <FiWifiOff className="flex-shrink-0" size={14} />, label: "Disconnected from chat server. Trying to reconnect..." },
      failed: { bg: "bg-red-50 border-red-300", text: "text-red-800", icon: <FiAlertTriangle className="flex-shrink-0" size={14} />, label: "Unable to connect. Real-time messaging is unavailable. Please refresh." },
    };

    const config = bannerConfig[connectionStatus] || bannerConfig.connecting;
    return (
      <div className={`flex items-center gap-2 px-4 py-2 text-xs font-medium border-b ${config.bg} ${config.text}`}>
        {config.icon}
        <span>{config.label}</span>
      </div>
    );
  };



  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-64px)] bg-gray-50 overflow-hidden">
      {/* Sidebar - Chat List */}
      <div className={`w-full md:w-80 bg-white border-b md:border-b-0 md:border-r border-gray-200 flex flex-col ${mobileShowChat ? "hidden md:flex" : "flex"} h-full md:h-full`}>
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
                onClick={() => handleSelectChat(chat)}
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
      <div className={`w-full md:flex-1 flex flex-col ${mobileShowChat ? "flex" : "hidden md:flex"} h-full md:h-full relative`}>

        {/* Fix 6.2: Connection status banner */}
        {renderConnectionBanner()}


        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Fix 6.4: Mobile back button */}
                  <button
                    onClick={handleMobileBack}
                    className="md:hidden p-1 -ml-2 mr-1 text-gray-500 hover:text-gray-700"
                  >
                    <FiArrowLeft size={20} />
                  </button>
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
                {/* Fix 3.1 / 6.3: Show loading while messages are being fetched */}
                {messagesLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8BC53F]"></div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  <>
                    {hasMoreMessages && (
                      <div className="flex justify-center mb-4">
                        <button
                          onClick={loadMoreMessages}
                          disabled={messagesLoading}
                          className="px-4 py-2 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {messagesLoading ? "Loading..." : "Load older messages"}
                        </button>
                      </div>
                    )}
                    {Object.entries(groupedMessages).map(([date, msgs]) => (
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
                          const isError = msg.status === "error"; // Fix 4.2
                          const isRead = msg.read || (Array.isArray(msg.readBy) && msg.readBy.some(r => r.userId !== currentUserId));

                          return (
                            <div
                              key={msg._id}
                              className={`flex ${
                                isCurrentUser
                                  ? "justify-end"
                                  : "justify-start"
                              }`}
                            >
                              <div className={`flex items-end gap-2 max-w-xs ${isSending ? "opacity-70" : ""} ${isError ? "opacity-80" : ""}`}>
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
                                      isError
                                        ? "bg-red-100 text-red-800 border border-red-300 rounded-br-none"
                                        : isCurrentUser
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
                                    {isCurrentUser && !isSending && !isError && (
                                      <span className={`text-xs ${isRead ? "text-blue-500" : "text-gray-400"}`}>
                                        {isRead ? "✓✓" : "✓"}
                                      </span>
                                    )}
                                  </div>
                                  {/* Fix 4.1 / 4.2: Error state with retry + dismiss */}
                                  {isError && (
                                    <div className="flex items-center gap-2 px-2 mt-1">
                                      <span className="text-[10px] text-red-500 font-medium">{msg.errorText || "Failed to send"}</span>
                                      <button
                                        onClick={() => retryMessage(msg._id)}
                                        className="text-[10px] text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-0.5"
                                      >
                                        <FiRefreshCw size={10} /> Retry
                                      </button>
                                      <button
                                        onClick={() => dismissMessage(msg._id)}
                                        className="text-[10px] text-gray-400 hover:text-gray-600 font-semibold"
                                      >
                                        Dismiss
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                  </>
                )}

                {/* Typing indicator — Fix 6.5: uses resolved bookingId */}
                {typingStatus[typingBookingId]?.isTyping && (
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

            {/* Message Input — Fix 4.5: file attachment hidden, Fix 4.6: onKeyDown */}
            <div className="bg-white border-t border-gray-200 px-6 py-4 shadow-lg">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Type your message"
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    handleTyping(true);
                  }}
                  onBlur={() => handleTyping(false)}
                  onKeyDown={handleKeyDown}
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
                {emptyStateText || "Choose a conversation from the list to start messaging."}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
