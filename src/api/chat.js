import api from "./axios";
import axios from "axios";
import { trackEvent } from "../services/analytics";

const publicApi = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

export const chatService = {
  // Get all chats
  getAllChats: async (page = 1, limit = 20, statusCategory = "active") => {
    const response = await api.get("/chats", {
      params: { page, limit, statusCategory },
    });
    return response.data;
  },

  // Get messages for a booking
  getMessages: async (bookingId, page = 1, limit = 50) => {
    const response = await api.get(`/chats/${bookingId}/messages`, {
      params: { page, limit },
    });
    if (page === 1) {
      trackEvent("chat_opened", { booking_id: bookingId });
    }
    return response.data;
  },

  // Send a message
  sendMessage: async (bookingId, messageData) => {
    const response = await api.post(`/chats/${bookingId}/messages`, messageData);
    trackEvent("chat_message_sent", {
      booking_id: bookingId,
      message_type: messageData?.type || "text",
    });
    return response.data;
  },

  // Mark messages as read
  markAsRead: async (bookingId) => {
    const response = await api.patch(`/chats/${bookingId}/read`);
    return response.data;
  },
};

export const supportChatbotService = {
  sendMessage: async (message, conversationHistory, bookingId) => {
    const response = await api.post("/support-chatbot/chat", {
      message,
      conversationHistory,
      ...(bookingId && bookingId.trim() !== "" ? { bookingId } : {}),
    });
    trackEvent("support_chat_message_sent", {
      booking_id: bookingId,
      has_booking_context: Boolean(bookingId),
    });
    return response;
  },

  getFAQs: (ids) =>
    api.get("/support-chatbot/faqs", {
      params: ids ? { ids } : {},
    }),

  getBookingContext: (bookingId) =>
    api.get(`/support-chatbot/booking/${bookingId}`),
};

export const publicChatbotService = {
  sendMessage: async (message, conversationHistory, _bookingId, options = {}) => {
    const response = await publicApi.post("/support-chatbot/public-chat", {
      message,
      visitorName: options.visitorName || "Website visitor",
      conversationHistory,
    });

    trackEvent("public_chat_message_sent", {
      has_conversation_history: Array.isArray(conversationHistory) && conversationHistory.length > 1,
    });

    return response;
  },
};
