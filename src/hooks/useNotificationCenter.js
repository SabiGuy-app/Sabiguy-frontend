import { useCallback, useEffect, useRef, useState } from "react";
import { notificationService } from "../api/notifications";
import notificationSoundService from "../services/notificationSoundService";

const UNREAD_POLL_MS = 30000;

// Notification list, unread count and actions for a dashboard navbar.
// `socket` is the shared socket; `onNotification` sees each live notification
// after it has been added to the list.
export default function useNotificationCenter(socket, onNotification) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const onNotificationRef = useRef(onNotification);

  useEffect(() => {
    onNotificationRef.current = onNotification;
  });

  const fetchUnreadCount = useCallback(async () => {
    try {
      const res = await notificationService.fetchUnreadCount();
      if (res.success) setUnreadCount(res.data.unreadCount);
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  }, []);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await notificationService.fetchNotifications();
      if (res.success) setNotifications(res.data.notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUnreadCount();
    fetchNotifications();
    const interval = setInterval(fetchUnreadCount, UNREAD_POLL_MS);
    return () => clearInterval(interval);
  }, [fetchUnreadCount, fetchNotifications]);

  useEffect(() => {
    if (!socket) return undefined;
    const handleNotification = (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
      onNotificationRef.current?.(notification);
    };
    socket.on("new_notification", handleNotification);
    return () => socket.off("new_notification", handleNotification);
  }, [socket]);

  // Browsers block autoplay until the first interaction, so unlock sound then.
  useEffect(() => {
    notificationSoundService.init();
    const unlock = () => {
      notificationSoundService.unlock();
      document.removeEventListener("click", unlock);
      document.removeEventListener("touchstart", unlock);
    };
    document.addEventListener("click", unlock);
    document.addEventListener("touchstart", unlock);
    return () => {
      document.removeEventListener("click", unlock);
      document.removeEventListener("touchstart", unlock);
    };
  }, []);

  const markAsRead = useCallback(async (id) => {
    try {
      const res = await notificationService.markAsRead(id);
      if (res.success || res.data?.success) {
        setNotifications((prev) =>
          prev.map((item) => (item._id === id ? { ...item, isRead: true } : item)),
        );
        fetchUnreadCount();
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  }, [fetchUnreadCount]);

  const markAllAsRead = useCallback(async () => {
    try {
      const res = await notificationService.markAllAsRead();
      if (res.success || res.data?.success) {
        setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
        setUnreadCount(0);
      }
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  }, []);

  const deleteNotification = useCallback(async (id) => {
    try {
      const res = await notificationService.deleteNotification(id);
      if (res.success || res.data?.success) {
        setNotifications((prev) => prev.filter((item) => item._id !== id));
        fetchUnreadCount();
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  }, [fetchUnreadCount]);

  return {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  };
}
