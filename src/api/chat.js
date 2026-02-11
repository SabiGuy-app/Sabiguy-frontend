import api from "./axios";

export const chatService = {
  // Get all chats
  getAllChats: async (page = 1, limit = 20) => {
    const response = await api.get('/chats', {
      params: { page, limit }
    });
    return response.data;
  },

  // Get messages for a booking
  getMessages: async (bookingId, page = 1, limit = 50) => {
    const response = await api.get(`/chats/${bookingId}/messages`, {
      params: { page, limit }
    });
    return response.data;
  },

  // Send a message
  sendMessage: async (bookingId, messageData) => {
    const response = await api.post(
      `/chats/${bookingId}/messages`,
      messageData
    );
    return response.data;
  },

  // Mark messages as read
  markAsRead: async (bookingId) => {
    const response = await api.patch(`/chats/${bookingId}/read`);
    return response.data;
  },
};