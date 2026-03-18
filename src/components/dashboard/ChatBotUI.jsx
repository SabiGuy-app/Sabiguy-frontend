import { Bot, Send, User } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { supportChatbotService } from "../../api/chat";

export default function ChatBotUI({ userType = "user", bookingId = null }) {
  console.log("userType:", userType);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isLoadingContext, setIsLoadingContext] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversationHistory, isTyping]);

  // Fetch FAQs on mount
  useEffect(() => {
    supportChatbotService
      .getFAQs()
      .then((res) => setFaqs(res.data))
      .catch(() => setFaqs([]));
  }, []);

  // Fetch booking context only if valid bookingId exists
  useEffect(() => {
    if (bookingId && bookingId.trim() !== "") {
      setIsLoadingContext(true);
      supportChatbotService
        .getBookingContext(bookingId)
        .catch(() => {})
        .finally(() => setIsLoadingContext(false));
    }
  }, [bookingId]);

  const handleSendMessage = async (text) => {
    const messageToSend = typeof text === "string" ? text : currentMessage;
    if (!messageToSend.trim()) return;

    const userMessage = { role: "user", content: messageToSend };
    const updatedHistory = [...conversationHistory, userMessage];

    setConversationHistory(updatedHistory);
    setCurrentMessage("");
    setIsTyping(true);

    try {
      const res = await supportChatbotService.sendMessage(
        messageToSend,
        updatedHistory,
        bookingId && bookingId.trim() !== "" ? bookingId : null
      );
      
      const botReply = { 
        role: "assistant", 
        content: res.data.data.response 
      };
      setConversationHistory((prev) => [...prev, botReply]);

      // Handle dynamic FAQ suggestions from the bot response
      if (res.data.data.faqSuggestions?.length > 0) {
        const ids = res.data.data.faqSuggestions.join(",");
        supportChatbotService.getFAQs(ids)
          .then(res => setFaqs(res.data))
          .catch(() => {});
      }
    } catch (err) {
      let errorMsg;
      if (!err.response) {
        errorMsg = "Network error. Please check your connection.";
      } else if (err.response?.status === 400) {
        errorMsg = "Please type a message before sending.";
      } else if (err.response?.status === 401) {
        errorMsg = "Please log in to continue.";
      } else if (err.response?.status === 500) {
        errorMsg = "Something went wrong. Please try again.";
      } else {
        errorMsg = "An unexpected error occurred. Please try again.";
      }
      setConversationHistory((prev) => [
        ...prev,
        { role: "assistant", content: errorMsg },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const fallbackFAQs =
    userType === "provider"
      ? [
          "How do I accept a booking?",
          "How do I manage my availability?",
          "How do I receive payments?",
          "How do I cancel a booking?",
          "How do I update my profile?",
        ]
      : [
          "How do I book a service?",
          "How does payment work?",
          "When will my provider arrive?",
          "How do I cancel a booking?",
          "How do I get a refund?",
        ];

  // Logic to handle both array or {success, data: []} structure
  const actualFaqArray = Array.isArray(faqs) ? faqs : (faqs?.data || []);
  const displayFAQs =
    actualFaqArray.length > 0 && (conversationHistory.length > 0 || userType === "user")
      ? actualFaqArray
      : fallbackFAQs;

  const greeting =
    userType === "provider"
      ? "What do you need help with?"
      : "How may I help you today? (Please select an option)";

  return (
    <div className="flex flex-col h-[600px] w-full bg-white relative">
      {/* Header Context Pills */}
      <div className="flex flex-col gap-1 p-2 absolute top-0 left-0 right-0 z-10 bg-white/80 backdrop-blur-sm">
        {isLoadingContext && (
          <div className="text-[10px] text-gray-500 italic px-2">
            Loading context...
          </div>
        )}
        {bookingId && bookingId.trim() !== "" && (
          <div className="self-center">
            <span className="bg-blue-50 text-blue-600 text-[10px] font-medium px-2 py-0.5 rounded-full border border-blue-100">
              Discussing Booking #{bookingId.slice(-6)}
            </span>
          </div>
        )}
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6 pt-12">
        {/* Bot Greeting (only shown if history is empty) */}
        {conversationHistory.length === 0 && (
          <div className="flex items-start gap-3">
            <div className="bg-[#066c39]/10 p-2 rounded-full flex-shrink-0">
              <Bot className="text-[#066c39]" size={22} />
            </div>
            <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-tl-none max-w-[85%]">
              <p className="font-semibold text-sm">Hello!</p>
              <p className="text-sm mt-1">{greeting}</p>

              {/* Initial FAQ Chips */}
              <div className="flex flex-wrap gap-2 mt-4">
                {displayFAQs.map((faq, index) => (
                  <button
                    key={index}
                    onClick={() => handleSendMessage(faq.question || faq)}
                    className="bg-[#d8eecf] hover:bg-[#c5e4b8] text-[#066c39] text-xs px-3 py-2 rounded-full transition-colors text-left"
                    disabled={isTyping}
                  >
                    {faq.question || faq}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Conversation History */}
        {conversationHistory.map((msg, idx) => (
          <div key={idx} className="space-y-4">
            <div
              className={`flex items-start gap-3 ${
                msg.role === "user" ? "flex-row-reverse" : ""
              }`}
            >
              <div
                className={`p-2 rounded-full flex-shrink-0 ${
                  msg.role === "user" ? "bg-gray-100" : "bg-[#066c39]/10"
                }`}
              >
                {msg.role === "user" ? (
                  <User size={18} className="text-gray-600" />
                ) : (
                  <Bot size={18} className="text-[#066c39]" />
                )}
              </div>
              <div
                className={`px-4 py-3 rounded-2xl max-w-[85%] text-sm ${
                  msg.role === "user"
                    ? "bg-[#066c39] text-white rounded-tr-none"
                    : "bg-gray-100 text-gray-800 rounded-tl-none"
                }`}
              >
                {msg.content}
              </div>
            </div>

            {/* If this is the latest bot response and we have FAQs, show them */}
            {!isTyping && 
             idx === conversationHistory.length - 1 && 
             msg.role === "assistant" && 
             actualFaqArray.length > 0 && (
              <div className="ml-11 flex flex-wrap gap-2">
                {displayFAQs.map((faq, index) => (
                  <button
                    key={index}
                    onClick={() => handleSendMessage(faq.question || faq)}
                    className="bg-[#d8eecf] hover:bg-[#c5e4b8] text-[#066c39] text-xs px-3 py-2 rounded-full transition-colors text-left"
                  >
                    {faq.question || faq}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex items-start gap-3">
            <div className="bg-[#066c39]/10 p-2 rounded-full flex-shrink-0">
              <Bot className="text-[#066c39]" size={22} />
            </div>
            <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-tl-none">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="border-t p-3 flex items-center gap-3"
      >
        <input
          type="text"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          placeholder="Type your message"
          className="flex-1 border rounded-xl px-4 py-2 outline-none focus:border-[#066c39] transition-colors"
          disabled={isTyping}
        />
        <button
          type="submit"
          disabled={!currentMessage.trim() || isTyping}
          className="p-3 bg-[#066c39] text-white rounded-xl hover:bg-[#055a30] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}
