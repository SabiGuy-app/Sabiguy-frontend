import { useState, useEffect } from "react";
import { Bell, Search, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import NotificationToast from "../NotificationToast";
import notificationSoundService from "../../services/notificationSoundService";
import NotificationDrawer from "./Notification";
import { useAuthStore } from "../../stores/auth.store";
import { notificationService } from "../../api/notifications";
import { io } from "socket.io-client";

export default function Navbar() {
  const [showSearch, setShowSearch] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const user = useAuthStore((state) => state.user);
  const hydrated = useAuthStore((state) => state.hydrated);
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate();

  // Don't render until store is hydrated
  if (!hydrated) {
    return (
      <nav className="bg-white border-b border-gray-200 h-20 flex items-center px-6 fixed top-0 left-0 right-0 z-30">
        <div className="flex justify-between items-center w-full">
          <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
      </nav>
    );
  }

  const fetchUnreadCount = async () => {
    try {
      const res = await notificationService.fetchUnreadCount();
      if (res.success) {
        setUnreadCount(res.data.unreadCount);
      }
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  const fetchNotifications = async () => {
    setLoadingNotifications(true);

    try {
      const res = await notificationService.fetchNotifications();

      if (res.success) {
        setNotifications(res.data.notifications);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoadingNotifications(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      const res = await notificationService.markAsRead(id);

      if (res.success) {
        // Update local state
        setNotifications((prev) =>
          prev.map((notif) =>
            notif._id === id ? { ...notif, read: true } : notif,
          ),
        );
        // Refresh unread count
        fetchUnreadCount();
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const res = await notificationService.markAllAsRead();
      if (res.success) {
        // Update local state
        setNotifications((prev) =>
          prev.map((notif) => ({ ...notif, read: true })),
        );
        setUnreadCount(0);
      }
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      const res = await notificationService.deleteNotification(id);
      if (res.success) {
        // Remove from local state
        setNotifications((prev) => prev.filter((notif) => notif._id !== id));
        // Refresh unread count
        fetchUnreadCount();
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  // Show toast notification
  const showNotificationToast = (notification) => {
    // Play sound
    notificationSoundService.play();

    // Show toast
    toast.custom(
      (t) => (
        <NotificationToast
          notification={notification}
          onClose={() => {
            toast.dismiss(t.id);
          }}
          onClick={() => {
            toast.dismiss(t.id);
            setShowNotifications(true);
          }}
        />
      ),
      {
        duration: 5000,
        position: "top-right",
      },
    );
  };
  // Initialize socket connection
  useEffect(() => {
    // Initialize sound service
    notificationSoundService.init();

    const token = localStorage.getItem("token");
    if (!token) return;

    // Track seen notification IDs to prevent duplicate toasts
    const seenNotifications = new Set();

    const newSocket = io(
      import.meta.env.VITE_SOCKET_URL || "http://localhost:3000",
      {
        auth: { token },
        transports: ["websocket", "polling"],
      },
    );

    newSocket.on("connect", () => {
      console.log("✅ User socket connected");
    });

    newSocket.on("connect_error", (error) => {
      console.error("❌ Socket connection error:", error);
    });

    // Listen for new notifications via socket
    newSocket.on("new_notification", (notification) => {
      const notifId = notification._id || notification.id;

      // Skip if we already showed a toast for this notification
      if (notifId && seenNotifications.has(notifId)) {
        return;
      }
      if (notifId) {
        seenNotifications.add(notifId);
      }

      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
      // Show toast with sound
      showNotificationToast(notification);
    });

    setSocket(newSocket);

    // Cleanup: disconnect socket on unmount to prevent duplicates
    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Fetch initial data
  useEffect(() => {
    fetchUnreadCount();
    fetchNotifications();

    // Poll for new notifications every 30 seconds (optional if socket is working)
    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleNotificationClick = () => {
    setShowNotifications(true);
    fetchNotifications();
  };

  // Test notification (remove after debugging)
  const testNotification = () => {
    const testNotif = {
      _id: Date.now().toString(),
      title: "Test Notification",
      message: "This is a test notification to verify the toast is working!",
      type: "test",
      read: false,
      createdAt: new Date(),
    };
    showNotificationToast(testNotif);
  };

  return (
    <>
      <Toaster position="top-right" />
      <header className="flex items-center justify-between bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-40 shadow-sm">
        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setShowMenu(true)}>
          <Menu size={26} className="text-gray-700" />
        </button>

        {/* Logo */}
        <button
          className="text-3xl font-bold text-[#005823]"
          onClick={() => navigate("/dashboard")}
        >
          <img src="/logo.jpg" alt="SabiGuy Logo" className="h-8 w-auto" />
        </button>

        {/* Desktop Search */}
        <div className="hidden md:flex flex-1 items-center ml-10 max-w-sm bg-gray-100 border border-gray-300 rounded-lg px-3 py-2">
          <Search size={18} className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search providers or services..."
            className="bg-transparent w-full outline-none text-sm"
          />
        </div>

        {/* Mobile Search Toggle */}
        <button
          onClick={() => setShowSearch(!showSearch)}
          className="md:hidden text-gray-600"
        >
          <Search size={22} />
        </button>

        {/* Right Icons */}
        <div className="flex items-center space-x-4">
          {/* Test Button (remove after debugging) */}
          {/* <button
            onClick={testNotification}
            className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
          >
            Test
          </button> */}

          {/* Bell */}
          <button onClick={handleNotificationClick} className="relative">
            <Bell size={24} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[20px] h-4 bg-red-500 text-white text-xs font-semibold rounded-full flex items-center justify-center px-1">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          {/* Profile */}
          <button
            onClick={() => navigate("/dashboard/settings")}
            className="flex items-center"
          >
            <img
              src={user?.data?.profilePicture || "/avatar.png"}
              className="w-8 h-8 rounded-full border"
            />
          </button>
        </div>

        {/* Mobile Search Dropdown */}
        {showSearch && (
          <div className="absolute top-16 left-0 w-full bg-white border-t border-gray-200 p-4 md:hidden">
            <div className="flex items-center bg-gray-100 rounded-lg px-4 py-2">
              <Search size={18} className="text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Search providers or services..."
                className="bg-transparent w-full outline-none text-sm"
              />
            </div>
          </div>
        )}

        {/* Mobile Slide-in Menu */}
        {showMenu && (
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-50 md:hidden"
            onClick={() => setShowMenu(false)}
          >
            <div
              className="absolute left-0 top-0 h-full w-64 bg-white shadow-lg p-6 animate-slideIn"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Icon */}
              <button className="mb-6" onClick={() => setShowMenu(false)}>
                <X size={26} className="text-gray-600" />
              </button>

              {/* Menu Links */}
              <nav className="space-y-4 text-lg text-gray-700">
                <button
                  onClick={() => navigate("/dashboard")}
                  className="block"
                >
                  Dashboard
                </button>

                <button
                  onClick={() => navigate("/dashboard/categories")}
                  className="block"
                >
                  Categories
                </button>

                <button
                  onClick={() => navigate("/dashboard/settings")}
                  className="block"
                >
                  Settings
                </button>
              </nav>
            </div>
          </div>
        )}
        <NotificationDrawer
          isOpen={showNotifications}
          onClose={() => setShowNotifications(false)}
          notifications={notifications}
          loading={loadingNotifications}
          unreadCount={unreadCount}
          onMarkAsRead={markAsRead}
          onMarkAllAsRead={markAllAsRead}
          onDelete={deleteNotification}
        />
      </header>
    </>
  );
}
