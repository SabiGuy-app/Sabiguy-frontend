import DashboardLayout from "../../../components/layouts/DashboardLayout";
import ChatView from "../../../components/shared/ChatView";

export default function ChatPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row h-screen bg-gray-50">
        {/* Sidebar - Chat List */}
        <div className="w-full md:w-80 bg-white border-b md:border-b-0 md:border-r border-gray-200 flex flex-col md:max-h-screen">
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
        <div className="w-full md:flex-1 flex flex-col md:max-h-screen">
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
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
                      <p className="text-xs text-gray-500">
                        {selectedChat.bookingId?.serviceType || "Service"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {/* <button className="text-gray-600 hover:text-gray-800">
                            <span className="text-sm p-2 bg-[#005823]/10 rounded">
                              View Profile
                            </span>
                          </button> */}
                    {/* <button className="text-gray-600 hover:text-gray-800">
                            <span className="text-sm text-[#005823] border border-gray-300 p-2 rounded">
                              {selectedChat.bookingId?.status || "Active Booking"}
                            </span>
                          </button> */}
                    {/* <button className="text-gray-600 hover:text-gray-800">
                            <FiPhone size={20} />
                          </button> */}
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

                            return (
                              <div
                                key={msg._id}
                                className={`flex ${
                                  isCurrentUser
                                    ? "justify-end"
                                    : "justify-start"
                                }`}
                              >
                                <div className="flex items-end gap-2 max-w-xs">
                                  {!isCurrentUser && (
                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                                      {getInitials(
                                        selectedChat.otherParticipant?.name,
                                      )}
                                    </div>
                                  )}
                                  <div>
                                    <div
                                      className={`px-4 py-3 rounded-2xl shadow-sm transition-all ${
                                        isCurrentUser
                                          ? "bg-[#8BC53F] text-white rounded-br-none"
                                          : "bg-white text-gray-800 rounded-bl-none border border-gray-200"
                                      }`}
                                    >
                                      <p className="text-sm break-words">
                                        {msg.message}
                                      </p>
                                    </div>
                                    <div className="flex items-center gap-1 px-2 mt-1">
                                      <span className="text-xs text-gray-500">
                                        {formatTime(msg.createdAt)}
                                      </span>
                                      {isCurrentUser && msg.read && (
                                        <span className="text-xs text-blue-500">
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
                  {typingStatus[selectedChat?.bookingId._id]?.isTyping && (
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
              <div className="bg-white border-t border-gray-200 px-3 sm:px-6 py-2 sm:py-4 shadow-lg">
                <div className="flex items-center gap-2 sm:gap-3">
                  <button className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0">
                    <FiPaperclip size={18} className="sm:w-5 sm:h-5" />
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
                    className="flex-1 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#8BC53F] focus:border-transparent disabled:bg-gray-100 transition-all"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!message.trim() || sendingMessage}
                    className="w-9 h-9 sm:w-10 sm:h-10 bg-[#8BC53F] rounded-full flex items-center justify-center text-white hover:bg-[#7ab037] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 shadow-md hover:shadow-lg"
                  >
                    {sendingMessage ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <FiSend size={16} className="sm:w-4.5 sm:h-4.5" />
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
      <ChatView
        emptyStateText="Choose a conversation from the list to start messaging with your service providers."
      />
    </DashboardLayout>
  );
}
