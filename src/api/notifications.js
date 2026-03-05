import api from "./axios";


export const notificationService = {

  fetchUnreadCount: async () => {
    const token = localStorage.getItem("token");

    const { data } = await api.get("/notifications/unread-count", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  },

  fetchNotifications: async () => {
    const token = localStorage.getItem("token");

    const { data } = await api.get("/notifications", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  },

  markAsRead: async (id) => {
    const token = localStorage.getItem("token");

    const { data } = await api.patch(`/notifications/${id}/read`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  },

  markAllAsRead: async () => {
    const token = localStorage.getItem("token");

    const { data } = await api.patch("/notifications/read-all", {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  },

  deleteNotification: async (id) => {
    const token = localStorage.getItem("token");

    const { data } = await api.delete(`/notifications/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  },

}

