import { useState, useEffect } from "react";
import { Bell, Search, Menu, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import NotificationToast from "../NotificationToast";
import notificationSoundService from "../../services/notificationSoundService";
import NotificationDrawer from "./Notification";
import { useAuthStore } from "../../stores/auth.store";
import { notificationService } from "../../api/notifications";
import { handleLogout } from "../../api/auth";
import { getSharedSocket, releaseSocket } from "../../services/socketManager";
import userLocationService from "../../services/userLocationService";

export default function Navbar({ onMenuClick }) {
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(false);
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
  // Initialize socket connection — Fix 2.4/2.5: use shared socket manager
  useEffect(() => {
    // Initialize sound service
    notificationSoundService.init();

    // Fix 2.5: Read token from Zustand store instead of localStorage
    const token = useAuthStore.getState().token;
    if (!token) return;

    // Track seen notification IDs to prevent duplicate toasts
    const seenNotifications = new Set();

    // Fix 2.4: Use shared socket instead of creating a new one
    const newSocket = getSharedSocket();
    if (!newSocket) return;

    const onConnect = () => {
      console.log("✅ User socket connected");
    };

    const onConnectError = (error) => {
      console.error("❌ Socket connection error:", error);
    };

    // Listen for new notifications via socket
    const onNewNotification = (notification) => {
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
    };

    newSocket.on("connect", onConnect);
    newSocket.on("connect_error", onConnectError);
    newSocket.on("new_notification", onNewNotification);

    setSocket(newSocket);

    // Cleanup: remove listeners and release shared socket
    return () => {
      userLocationService.stopTracking();
      newSocket.off("connect", onConnect);
      newSocket.off("connect_error", onConnectError);
      newSocket.off("new_notification", onNewNotification);
      releaseSocket();
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

  const startLocationTracking = async () => {
    if (!navigator.geolocation) {
      alert("Your browser does not support location tracking");
      return false;
    }

    try {
      // Request permission first
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
        });
      });

      console.log("✅ User location permission granted");

      // Send an immediate update on login
      if (position?.coords) {
        userLocationService.sendLocation(
          position.coords.latitude,
          position.coords.longitude,
          position.coords.accuracy,
        );
      }

      // Start continuous tracking
      userLocationService.startTracking(socket);
      setLocationEnabled(true);

      return true;
    } catch (error) {
      console.error("❌ User location permission denied:", error);

      // Show user-friendly error
      const errorMessages = {
        1: "Location permission denied. Please enable location access in your browser settings.",
        2: "Location unavailable. Please check your device settings.",
        3: "Location request timed out. Please try again.",
      };

      alert(errorMessages[error.code] || "Failed to enable location tracking");
      return false;
    }
  };

  useEffect(() => {
    startLocationTracking();

    return () => {
      userLocationService.stopTracking();
      setLocationEnabled(false);
    };
  }, []);

  useEffect(() => {
    if (!socket) return;
    userLocationService.setSocket(socket);
  }, [socket]);

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
<header className="flex items-center justify-between bg-white border-b border-gray-200 px-3 sm:px-6 py-4 sticky top-0 z-50 shadow-sm">

        {/* Mobile Menu Button (toggles sidebar) */}
        <button className="md:hidden p-2 text-gray-600 hover:text-gray-800 mr-0.5" onClick={onMenuClick}>
          <Menu size={26} className="text-gray-600" />
        </button>

        {/* Logo */}
        <button
          className="text-2xl md:text-3xl font-bold text-[#005823]"
          onClick={() => navigate("/dashboard")}
        >
          <img src="/logo.jpg" alt="SabiGuy Logo" className="h-6 sm:h-8 w-auto" />
        </button>

        {/* Desktop Search */}
        {/* <div className="hidden md:flex flex-1 items-center ml-10 max-w-sm bg-gray-100 border border-gray-300 rounded-lg px-3 py-2">
          <Search size={18} className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search providers or services..."
            className="bg-transparent w-full outline-none text-sm"
          />
        </div> */}

        {/* Mobile Search Toggle */}
        {/* <button
          onClick={() => setShowSearch(!showSearch)}
          className="md:hidden text-gray-600"
        >
          <Search size={22} />
        </button> */}

        {/* Right Icons */}
        <div className="flex items-center space-x-4">
          {/* Location Indicator (user) */}
          <div className="flex items-center gap-1.5 px-2 py-1.5 bg-gray-50 rounded-lg border border-gray-200">
            {locationEnabled ? (
              <>
                <MapPin size={12} className="text-green-500 animate-pulse" />
                <span className="text-[11px] font-semibold text-gray-700">
                  Location On
                </span>
              </>
            ) : (
              <>
                <MapPin size={12} className="text-gray-400" />
                <span className="text-[11px] font-semibold text-gray-400">
                  Location Off
                </span>
              </>
            )}
          </div>

          {/* Test Button (remove after debugging) */}
          {/* <button
            onClick={testNotification}
            className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
          >
            Test
          </button> */}

          {/* Bell */}
          <button id="notification-bell" onClick={handleNotificationClick} className="relative">
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
            {user?.data?.profilePicture && !imageError ? (
              <img
                src={user.data.profilePicture}
                alt="Profile"
                onError={() => setImageError(true)}
                className="w-8 h-8 rounded-full border"
              />
            ) : (
              <div className="w-8 h-8 rounded-full border bg-[#8BC53F] flex items-center justify-center text-white font-semibold text-sm">
                {user?.data?.fullName?.[0] || user?.data?.name?.[0] || "U"}
              </div>
            )}
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
