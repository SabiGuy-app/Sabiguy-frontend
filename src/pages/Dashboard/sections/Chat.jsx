import DashboardLayout from "../../../components/layouts/DashboardLayout";
import { useState } from "react";
import { FiSearch, FiBell, FiUser, FiSend, FiPaperclip, FiPhone } from "react-icons/fi";
import { BsThreeDotsVertical } from "react-icons/bs";

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

   const chats = [
    {
      id: 1,
      name: "Phil Crook",
      role: "Electrician",
      lastMessage: "I'd like to confirm your availability before booking",
      time: "11 ago",
      avatar: "PC",
      unread: 0,
      messages: [
        {
          id: 1,
          text: "I'd like to confirm your availability before booking",
          time: "4:32 AM",
          sender: "user",
        },
        {
          id: 2,
          text: "I'd like to confirm your availability before booking",
          time: "4:10 AM",
          sender: "other",
        },
        {
          id: 3,
          text: "I'd like to confirm your availability before booking",
          time: "4:32 AM",
          sender: "user",
        },
        {
          id: 4,
          text: "I'd like to confirm your availability before booking",
          time: "4:10 AM",
          sender: "other",
        },
      ],
    },
  ];

const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (message.trim()) {
      // Handle sending message
      console.log("Sending:", message);
      setMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  return (
    <DashboardLayout>
    <div className="flex h-screen bg-gray-50">
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
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8BC53F] focus:border-transparent"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {filteredChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setSelectedChat(chat)}
              className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedChat?.id === chat.id ? "bg-gray-100" : ""
              }`}
            >
              <div className="w-12 h-12 bg-[#8BC53F] rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                {chat.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-gray-800 text-sm">{chat.name}</h3>
                  <span className="text-xs text-gray-500">{chat.time}</span>
                </div>
                <p className="text-xs text-gray-500">{chat.role}</p>
              </div>
            </div>
          ))}
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
                    {selectedChat.avatar}
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-800">{selectedChat.name}</h2>
                    <p className="text-sm text-gray-500">{selectedChat.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button className="text-gray-600 hover:text-gray-800">
                    <span className="text-sm p-2 bg-[#005823]/10">View Profile</span>
                  </button>
                  <button className="text-gray-600 hover:text-gray-800">
                    <span className="text-sm  text-[#005823] border border-gray-300 p-2">Active Booking</span>
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
                {selectedChat.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className="flex items-end gap-2 max-w-md">
                      {msg.sender === "other" && (
                        <div className="w-8 h-8 bg-pink-400 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                          W
                        </div>
                      )}
                      <div>
                        <div
                          className={`px-4 py-3 rounded-2xl ${
                            msg.sender === "user"
                              ? "bg-[#8BC53F] text-white rounded-br-sm"
                              : "bg-white text-gray-800 rounded-bl-sm"
                          }`}
                        >
                          <p className="text-sm">{msg.text}</p>
                        </div>
                        <span className="text-xs text-gray-500 mt-1 block px-2">
                          {msg.time}
                        </span>
                      </div>
                      {msg.sender === "user" && (
                        <div className="w-8 h-8 bg-[#8BC53F] rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                          A
                        </div>
                      )}
                    </div>
                  </div>
                ))}
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
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BC53F] focus:border-transparent"
                />
                <button
                  onClick={handleSendMessage}
                  className="w-10 h-10 bg-[#005823] rounded-lg flex items-center justify-center text-white hover:bg-[#004019] transition-colors"
                >
                  <FiSend size={18} />
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Empty State */
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
    </DashboardLayout>
  );
}