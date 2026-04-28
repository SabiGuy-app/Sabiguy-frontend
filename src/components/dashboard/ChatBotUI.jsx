// import { Bot, Send, User } from "lucide-react";
// import { useState, useEffect, useRef } from "react";
// import { supportChatbotService } from "../../api/chat";

// export default function ChatBotUI({ userType = "user", bookingId = null }) {
//   console.log("userType:", userType);
//   const [conversationHistory, setConversationHistory] = useState([]);
//   const [faqs, setFaqs] = useState([]);
//   const [currentMessage, setCurrentMessage] = useState("");
//   const [isTyping, setIsTyping] = useState(false);
//   const [isLoadingContext, setIsLoadingContext] = useState(false);
//   const messagesEndRef = useRef(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [conversationHistory, isTyping]);

//   // Fetch FAQs on mount
//   useEffect(() => {
//     supportChatbotService
//       .getFAQs()
//       .then((res) => setFaqs(res.data))
//       .catch(() => setFaqs([]));
//   }, []);

//   // Fetch booking context only if valid bookingId exists
//   useEffect(() => {
//     if (bookingId && bookingId.trim() !== "") {
//       setIsLoadingContext(true);
//       supportChatbotService
//         .getBookingContext(bookingId)
//         .catch(() => {})
//         .finally(() => setIsLoadingContext(false));
//     }
//   }, [bookingId]);

//   const handleSendMessage = async (text) => {
//     const messageToSend = typeof text === "string" ? text : currentMessage;
//     if (!messageToSend.trim()) return;

//     const userMessage = { role: "user", content: messageToSend };
//     const updatedHistory = [...conversationHistory, userMessage];

//     setConversationHistory(updatedHistory);
//     setCurrentMessage("");
//     setIsTyping(true);

//     try {
//       const res = await supportChatbotService.sendMessage(
//         messageToSend,
//         updatedHistory,
//         bookingId && bookingId.trim() !== "" ? bookingId : null
//       );
      
//       const botReply = { 
//         role: "assistant", 
//         content: res.data.data.response 
//       };
//       setConversationHistory((prev) => [...prev, botReply]);

//       // Handle dynamic FAQ suggestions from the bot response
//       if (res.data.data.faqSuggestions?.length > 0) {
//         const ids = res.data.data.faqSuggestions.join(",");
//         supportChatbotService.getFAQs(ids)
//           .then(res => setFaqs(res.data))
//           .catch(() => {});
//       }
//     } catch (err) {
//       let errorMsg;
//       if (!err.response) {
//         errorMsg = "Network error. Please check your connection.";
//       } else if (err.response?.status === 400) {
//         errorMsg = "Please type a message before sending.";
//       } else if (err.response?.status === 401) {
//         errorMsg = "Please log in to continue.";
//       } else if (err.response?.status === 500) {
//         errorMsg = "Something went wrong. Please try again.";
//       } else {
//         errorMsg = "An unexpected error occurred. Please try again.";
//       }
//       setConversationHistory((prev) => [
//         ...prev,
//         { role: "assistant", content: errorMsg },
//       ]);
//     } finally {
//       setIsTyping(false);
//     }
//   };

//   const fallbackFAQs =
//     userType === "provider"
//       ? [
//           "How do I accept a booking?",
//           "How do I manage my availability?",
//           "How do I receive payments?",
//           "How do I cancel a booking?",
//           "How do I update my profile?",
//         ]
//       : [
//           "How do I book a service?",
//           "How does payment work?",
//           "When will my provider arrive?",
//           "How do I cancel a booking?",
//           "How do I get a refund?",
//         ];

//   // Logic to handle both array or {success, data: []} structure
//   const actualFaqArray = Array.isArray(faqs) ? faqs : (faqs?.data || []);
//   const displayFAQs =
//     actualFaqArray.length > 0 && (conversationHistory.length > 0 || userType === "user")
//       ? actualFaqArray
//       : fallbackFAQs;

//   const greeting =
//     userType === "provider"
//       ? "What do you need help with?"
//       : "How may I help you today? (Please select an option)";

//   return (
//     <div className="flex flex-col h-full w-full bg-white relative overflow-hidden">
//       {/* Chat messages */}
//       <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
//         {/* Header Context Pills (Inline) */}
//         {(isLoadingContext || (bookingId && bookingId.trim() !== "")) && (
//           <div className="flex flex-col items-center gap-1 mb-4">
//             {isLoadingContext && (
//               <div className="text-[10px] text-gray-500 italic">
//                 Loading context...
//               </div>
//             )}
//             {bookingId && bookingId.trim() !== "" && (
//               <span className="bg-blue-50 text-blue-600 text-[10px] font-medium px-2 py-1 rounded-full border border-blue-100 uppercase tracking-wider">
//                 Booking #{bookingId.slice(-6)}
//               </span>
//             )}
//           </div>
//         )}
//         {/* Bot Greeting (only shown if history is empty) */}
//         {conversationHistory.length === 0 && (
//           <div className="flex items-start gap-3">
//             <div className="bg-[#066c39]/10 p-2 rounded-full flex-shrink-0">
//               <Bot className="text-[#066c39]" size={22} />
//             </div>
//             <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-tl-none max-w-[85%]">
//               <p className="font-semibold text-sm">Hello!</p>
//               <p className="text-sm mt-1">{greeting}</p>

//               {/* Initial FAQ Chips */}
//               <div className="flex flex-wrap gap-2 mt-4">
//                 {displayFAQs.map((faq, index) => (
//                   <button
//                     key={index}
//                     onClick={() => handleSendMessage(faq.question || faq)}
//                     className="bg-white border border-[#066c39]/30 hover:bg-[#d8eecf] text-[#066c39] text-xs sm:text-sm font-medium px-4 py-2.5 rounded-xl transition-all text-left shadow-sm active:scale-95"
//                     disabled={isTyping}
//                   >
//                     {faq.question || faq}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Conversation History */}
//         {conversationHistory.map((msg, idx) => (
//           <div key={idx} className="space-y-4">
//             <div
//               className={`flex items-start gap-3 ${
//                 msg.role === "user" ? "flex-row-reverse" : ""
//               }`}
//             >
//               <div
//                 className={`p-2 rounded-full flex-shrink-0 ${
//                   msg.role === "user" ? "bg-gray-100" : "bg-[#066c39]/10"
//                 }`}
//               >
//                 {msg.role === "user" ? (
//                   <User size={18} className="text-gray-600" />
//                 ) : (
//                   <Bot size={18} className="text-[#066c39]" />
//                 )}
//               </div>
//               <div
//                 className={`px-4 py-3 rounded-2xl max-w-[85%] text-sm ${
//                   msg.role === "user"
//                     ? "bg-[#066c39] text-white rounded-tr-none"
//                     : "bg-gray-100 text-gray-800 rounded-tl-none"
//                 }`}
//               >
//                 {msg.content}
//               </div>
//             </div>

//             {/* If this is the latest bot response and we have FAQs, show them */}
//             {!isTyping && 
//              idx === conversationHistory.length - 1 && 
//              msg.role === "assistant" && 
//              actualFaqArray.length > 0 && (
//                <div className="ml-11 flex flex-wrap gap-2">
//                 {displayFAQs.map((faq, index) => (
//                   <button
//                     key={index}
//                     onClick={() => handleSendMessage(faq.question || faq)}
//                     className="bg-white border border-[#066c39]/30 hover:bg-[#d8eecf] text-[#066c39] text-xs sm:text-sm font-medium px-4 py-2.5 rounded-xl transition-all text-left shadow-sm active:scale-95"
//                   >
//                     {faq.question || faq}
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>
//         ))}

//         {/* Typing Indicator */}
//         {isTyping && (
//           <div className="flex items-start gap-3">
//             <div className="bg-[#066c39]/10 p-2 rounded-full flex-shrink-0">
//               <Bot className="text-[#066c39]" size={22} />
//             </div>
//             <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-tl-none">
//               <div className="flex gap-1">
//                 <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
//                 <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
//                 <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]" />
//               </div>
//             </div>
//           </div>
//         )}
//         <div ref={messagesEndRef} />
//       </div>

//        {/* Input Area */}
//       <div className="bg-white border-t p-3 sm:p-4 mt-auto">
//         <form
//           onSubmit={(e) => {
//             e.preventDefault();
//             handleSendMessage();
//           }}
//           className="flex items-center gap-2 sm:gap-3"
//         >
//           <input
//             type="text"
//             value={currentMessage}
//             onChange={(e) => setCurrentMessage(e.target.value)}
//             placeholder="Type your message..."
//             className="flex-1 border border-gray-200 rounded-2xl px-4 py-3 sm:py-4 outline-none focus:border-[#066c39] transition-all text-sm sm:text-base placeholder:text-gray-400"
//             disabled={isTyping}
//           />
//           <button
//             type="submit"
//             disabled={!currentMessage.trim() || isTyping}
//             className="p-3.5 sm:p-4 bg-[#066c39] text-white rounded-2xl hover:bg-[#055a30] transition-all disabled:bg-gray-200 disabled:cursor-not-allowed shadow-md active:scale-95"
//           >
//             <Send size={20} className={currentMessage.trim() ? "animate-in fade-in" : ""} />
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

import { Bot, Send, User, MessageCircle, X, Sparkles } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { supportChatbotService } from "../../api/chat";

const WHATSAPP_NUMBER = "+2349131425865"; // 👈 Replace with your actual WhatsApp Business number

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2.5">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-700 flex items-center justify-center shadow-md flex-shrink-0">
        <Bot size={15} className="text-white" />
      </div>
      <div className="bg-white border border-gray-100 shadow-sm px-4 py-3 rounded-2xl rounded-bl-sm">
        <div className="flex gap-1 items-center h-4">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
}

function WhatsAppBanner({ onDismiss }) {
  const message = encodeURIComponent("Hi, I need to speak to a human agent from SabiGuy");
  const link = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;

  return (
    <div className="mx-4 mb-3 animate-in slide-in-from-bottom-2 duration-300">
      <div className="relative bg-gradient-to-br from-[#25D366] to-[#128C7E] rounded-2xl p-4 shadow-lg overflow-hidden">
        {/* Decorative circle */}
        <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/10 rounded-full" />
        <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-white/10 rounded-full" />

        <button
          onClick={onDismiss}
          className="absolute top-2.5 right-2.5 text-white/70 hover:text-white transition-colors z-10"
        >
          <X size={15} />
        </button>

        <div className="flex items-start gap-3 relative z-10">
          <div className="bg-white/20 p-2 rounded-xl flex-shrink-0">
            <MessageCircle size={20} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm">Talk to a Human Agent</p>
            <p className="text-white/80 text-xs mt-0.5 leading-relaxed">
              Our support team is ready to help you on WhatsApp.
            </p>
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-2.5 bg-white text-[#128C7E] text-xs font-bold px-3.5 py-2 rounded-xl hover:bg-green-50 transition-all active:scale-95 shadow-sm"
            >
              <MessageCircle size={13} />
              Open WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatMessage({ msg, isLatest, isTyping, displayFAQs, actualFaqArray, onFaqClick }) {
  const isUser = msg.role === "user";

  return (
    <div className="space-y-3">
      <div className={`flex items-end gap-2.5 ${isUser ? "flex-row-reverse" : ""}`}>
        {/* Avatar */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${
          isUser
            ? "bg-gray-200"
            : "bg-gradient-to-br from-emerald-400 to-emerald-700"
        }`}>
          {isUser
            ? <User size={15} className="text-gray-600" />
            : <Bot size={15} className="text-white" />
          }
        </div>

        {/* Bubble */}
        <div className={`px-4 py-3 rounded-2xl max-w-[78%] text-sm leading-relaxed shadow-sm ${
          isUser
            ? "bg-gradient-to-br from-[#066c39] to-[#044d28] text-white rounded-br-sm"
            : "bg-white border border-gray-100 text-gray-800 rounded-bl-sm"
        }`}>
          <p className="whitespace-pre-wrap">{msg.content}</p>
        </div>
      </div>

      {/* FAQ Chips after latest bot message */}
      {!isTyping && isLatest && !isUser && actualFaqArray.length > 0 && (
        <div className="ml-11 flex flex-wrap gap-2">
          {displayFAQs.map((faq, i) => (
            <button
              key={i}
              onClick={() => onFaqClick(faq.question || faq)}
              className="bg-white border border-emerald-200 hover:bg-emerald-50 hover:border-emerald-400 text-emerald-700 text-xs font-medium px-3.5 py-2 rounded-xl transition-all text-left shadow-sm active:scale-95"
            >
              {faq.question || faq}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ChatBotUI({ userType = "user", bookingId = null }) {
  const [conversationHistory, setConversationHistory] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isLoadingContext, setIsLoadingContext] = useState(false);
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => { scrollToBottom(); }, [conversationHistory, isTyping, showWhatsApp]);

  useEffect(() => {
    supportChatbotService.getFAQs()
      .then((res) => setFaqs(res.data))
      .catch(() => setFaqs([]));
  }, []);

  useEffect(() => {
    if (bookingId && bookingId.trim() !== "") {
      setIsLoadingContext(true);
      supportChatbotService.getBookingContext(bookingId)
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
    setShowWhatsApp(false); // Reset on new message

    try {
      const res = await supportChatbotService.sendMessage(
        messageToSend,
        updatedHistory,
        bookingId && bookingId.trim() !== "" ? bookingId : null
      );

      const data = res.data.data;

      const botReply = { role: "assistant", content: data.response };
      setConversationHistory((prev) => [...prev, botReply]);

      // 👇 WhatsApp escalation trigger from backend
      if (data.escalationTriggered) {
        setTimeout(() => setShowWhatsApp(true), 500); // slight delay for UX
      }

      if (data.faqSuggestions?.length > 0) {
        const ids = data.faqSuggestions.join(",");
        supportChatbotService.getFAQs(ids)
          .then((r) => setFaqs(r.data))
          .catch(() => {});
      }
    } catch (err) {
      let errorMsg;
      if (!err.response) errorMsg = "Network error. Please check your connection.";
      else if (err.response?.status === 400) errorMsg = "Please type a message before sending.";
      else if (err.response?.status === 401) errorMsg = "Please log in to continue.";
      else if (err.response?.status === 500) errorMsg = "Something went wrong. Please try again.";
      else errorMsg = "An unexpected error occurred. Please try again.";

      setConversationHistory((prev) => [...prev, { role: "assistant", content: errorMsg }]);
    } finally {
      setIsTyping(false);
      inputRef.current?.focus();
    }
  };

  const fallbackFAQs = userType === "provider"
    ? ["How do I accept a booking?", "How do I manage my availability?", "How do I receive payments?", "How do I cancel a booking?", "How do I update my profile?"]
    : ["How do I book a service?", "How does payment work?", "When will my provider arrive?", "How do I cancel a booking?", "How do I get a refund?"];

  const actualFaqArray = Array.isArray(faqs) ? faqs : (faqs?.data || []);
  const displayFAQs = actualFaqArray.length > 0 && (conversationHistory.length > 0 || userType === "user")
    ? actualFaqArray
    : fallbackFAQs;

  const greeting = userType === "provider"
    ? "What do you need help with?"
    : "How may I help you today?";

  return (
    <div className="flex flex-col h-full w-full relative overflow-hidden" style={{ background: "#f7f9f8", fontFamily: "'DM Sans', sans-serif" }}>
      
      {/* Subtle top gradient strip */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-500 z-10" />

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 pt-6 pb-4 space-y-5">

        {/* Booking context pill */}
        {(isLoadingContext || (bookingId && bookingId.trim() !== "")) && (
          <div className="flex justify-center">
            {isLoadingContext ? (
              <span className="text-[10px] text-gray-400 italic">Loading context...</span>
            ) : (
              <span className="bg-emerald-50 text-emerald-700 text-[10px] font-semibold px-3 py-1.5 rounded-full border border-emerald-200 uppercase tracking-widest shadow-sm">
                📋 Booking #{bookingId.slice(-6)}
              </span>
            )}
          </div>
        )}

        {/* Greeting */}
        {conversationHistory.length === 0 && (
          <div className="flex items-end gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-700 flex items-center justify-center shadow-md flex-shrink-0">
              <Bot size={15} className="text-white" />
            </div>
            <div className="bg-white border border-gray-100 shadow-sm px-4 py-4 rounded-2xl rounded-bl-sm max-w-[85%]">
              <div className="flex items-center gap-1.5 mb-1">
                <Sparkles size={13} className="text-emerald-500" />
                <p className="font-bold text-sm text-gray-800">Hi there! I'm SabiBot 👋</p>
              </div>
              <p className="text-sm text-gray-500 mb-4">{greeting}</p>

              <div className="flex flex-wrap gap-2">
                {displayFAQs.map((faq, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(faq.question || faq)}
                    className="bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 hover:border-emerald-400 text-emerald-800 text-xs font-medium px-3.5 py-2 rounded-xl transition-all text-left shadow-sm active:scale-95"
                    disabled={isTyping}
                  >
                    {faq.question || faq}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Messages */}
        {conversationHistory.map((msg, idx) => (
          <ChatMessage
            key={idx}
            msg={msg}
            isLatest={idx === conversationHistory.length - 1}
            isTyping={isTyping}
            displayFAQs={displayFAQs}
            actualFaqArray={actualFaqArray}
            onFaqClick={handleSendMessage}
          />
        ))}

        {/* Typing */}
        {isTyping && <TypingIndicator />}

        <div ref={messagesEndRef} />
      </div>

      {/* WhatsApp Banner */}
      {showWhatsApp && (
        <WhatsAppBanner onDismiss={() => setShowWhatsApp(false)} />
      )}

      {/* Input */}
      <div className="bg-white border-t border-gray-100 px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
            placeholder="Type your message..."
            className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100 transition-all text-sm placeholder:text-gray-400"
            disabled={isTyping}
          />
          <button
            onClick={handleSendMessage}
            disabled={!currentMessage.trim() || isTyping}
            className="w-11 h-11 flex items-center justify-center bg-gradient-to-br from-[#066c39] to-[#044d28] text-white rounded-2xl hover:opacity-90 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-md active:scale-95 flex-shrink-0"
          >
            <Send size={17} />
          </button>
        </div>

        {/* Manual WhatsApp trigger */}
        <div className="flex justify-center mt-2.5">
          <button
            onClick={() => setShowWhatsApp((prev) => !prev)}
            className="flex items-center gap-1.5 text-[11px] text-gray-400 hover:text-[#25D366] transition-colors"
          >
            <MessageCircle size={12} />
            Speak to a human agent
          </button>
        </div>
      </div>
    </div>
  );
}
