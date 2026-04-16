import api from "./axios";

export const chatService = {
  // Get all chats
  getAllChats: async (page = 1, limit = 20, statusCategory = active) => {
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
    return response.data;
  },

  // Send a message
  sendMessage: async (bookingId, messageData) => {
    const response = await api.post(`/chats/${bookingId}/messages`, messageData);
    return response.data;
  },

  // Mark messages as read
  markAsRead: async (bookingId) => {
    const response = await api.patch(`/chats/${bookingId}/read`);
    return response.data;
  },
};

export const supportChatbotService = {
  sendMessage: (message, conversationHistory, bookingId) =>
    api.post("/support-chatbot/chat", {
      message,
      conversationHistory,
      ...(bookingId && bookingId.trim() !== "" ? { bookingId } : {}),
    }),

  getFAQs: (ids) =>
    api.get("/support-chatbot/faqs", {
      params: ids ? { ids } : {},
    }),

  getBookingContext: (bookingId) =>
    api.get(`/support-chatbot/booking/${bookingId}`),
};