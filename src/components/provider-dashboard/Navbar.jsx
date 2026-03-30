import { useState, useEffect } from "react";
import { Bell, Search, MapPin, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import NotificationDrawer from "../dashboard/Notification";
import NotificationToast from "../NotificationToast";
import { useAuthStore } from "../../stores/auth.store";
import locationService from "../../services/locationService";
import notificationSoundService from "../../services/notificationSoundService";
import { io } from "socket.io-client";
import { notificationService } from "../../api/notifications";
import { toggleAvailability as apiToggleAvailability } from "../../api/provider";

export default function ProviderNavbar({ onMenuClick }) {
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const user = useAuthStore((state) => state.user);
  const hydrated = useAuthStore((state) => state.hydrated);
  const updateUser = useAuthStore((state) => state.updateUser);
  const [socket, setSocket] = useState(null);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [updatingAvailability, setUpdatingAvailability] = useState(false);
  const navigate = useNavigate();
  const isAvailable = user?.data?.availability?.isAvailable ?? false;

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

      if (res.data.success) {
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
      if (res.data.success) {
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
      if (res.data.success) {
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
    console.log("ðŸ”” showNotificationToast called with:", notification);

    // Play sound
    console.log("ðŸ”Š Playing notification sound...");
    notificationSoundService.play();

    // Show toast
    console.log("ðŸ“¢ Displaying toast notification...");
    toast.custom(
      (t) => (
        <NotificationToast
          notification={notification}
          onClose={() => {
            console.log("ðŸ”” Toast closed");
            toast.dismiss(t.id);
          }}
          onClick={() => {
            console.log("ðŸ”” Toast clicked");
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

    const newSocket = io(
      import.meta.env.VITE_SOCKET_URL || "http://localhost:3000",
      {
        auth: { token },
        transports: ["websocket", "polling"],
      },
    );

    newSocket.on("connect", () => {
      console.log("âœ… Provider socket connected");
    });

    newSocket.on("connect_error", (error) => {
      console.error("âŒ Socket connection error:", error);
    });

    // Listen for new notifications via socket
    newSocket.on("new_notification", (notification) => {
      console.log("ðŸ“¬ New notification received:", notification);
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
      showNotificationToast(notification);
    });

    setSocket(newSocket);

    return () => {
      locationService.stopTracking();
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

  // Sync location tracking with availability
  useEffect(() => {
    if (isAvailable && socket) {
      // Start location tracking when available
      startLocationTracking();
    } else if (!isAvailable) {
      // Stop location tracking when not available
      locationService.stopTracking();
      setLocationEnabled(false);
    }
  }, [isAvailable, socket]);

  const startLocationTracking = async () => {
    if (!navigator.geolocation) {
      alert("Your browser does not support location tracking");
      return false;
    }

    try {
      // Request permission first
      await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
        });
      });

      console.log("âœ… Location permission granted");

      // Start continuous tracking
      locationService.startTracking(socket);
      setLocationEnabled(true);

      // Also notify via socket
      if (socket) {
        socket.emit("set_availability", { isAvailable: true });
      }

      return true;
    } catch (error) {
      console.error("âŒ Location permission denied:", error);

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

  const handleNotificationClick = () => {
    setShowNotifications(true);
    fetchNotifications();
  };

  const toggleAvailability = async () => {
    const newAvailability = !isAvailable;

    // If turning ON, request location permission first
    if (newAvailability) {
      const locationGranted = await startLocationTracking();
      if (!locationGranted) {
        // Don't proceed if location permission denied
        return;
      }
    }

    setUpdatingAvailability(true);

    try {
      // use the axios helper which automatically sends token/handles refresh
      const data = await apiToggleAvailability();

      if (data.success) {
        // Update Zustand store
        if (updateUser) {
          updateUser({
            ...user,
            data: {
              ...user.data,
              availability: {
                ...user.data?.availability,
                isAvailable: newAvailability,
              },
            },
          });
        }

        // If turning OFF, stop location tracking
        if (!newAvailability) {
          locationService.stopTracking();
          setLocationEnabled(false);

          // Notify socket
          if (socket) {
            socket.emit("set_availability", { isAvailable: false });
          }
        }

        console.log(
          `âœ… Availability ${newAvailability ? "enabled" : "disabled"}`,
        );
      } else {
        console.error("Failed to update availability:", data.message);
        alert("Failed to update availability. Please try again.");

        // Rollback location tracking if API failed
        if (newAvailability) {
          locationService.stopTracking();
          setLocationEnabled(false);
        }
      }
    } catch (error) {
      console.error("Error updating availability:", error);
      alert("Error updating availability. Please check your connection.");

      // Rollback location tracking on error
      if (newAvailability) {
        locationService.stopTracking();
        setLocationEnabled(false);
      }
    } finally {
      setUpdatingAvailability(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <header className="flex items-center justify-between bg-white border-b border-gray-200 px-4 sm:px-6 py-4 sticky top-0 z-40 shadow-sm">

        {/* Mobile Menu Button (toggles sidebar) */}
        <button className="p-2 text-gray-600 hover:text-gray-800" onClick={onMenuClick}>
          <Menu size={26} className="text-gray-600" />
        </button>

        {/* Logo */}
        <button
          className="block text-xl sm:text-2xl md:text-3xl font-bold text-[#005823] flex-shrink-0"
          onClick={() => navigate("/dashboard/provider")}
        >
          <img src="/logo.jpg" alt="SabiGuy Logo" className="h-6 sm:h-8 w-auto" />
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

        {/* Mobile Search Toggle - Hidden on mobile */}
        {/* <button
          onClick={() => setShowSearch(!showSearch)}
          className="md:hidden text-gray-600 p-2 hover:text-gray-800"
        >
          <Search size={20} />
        </button> */}

        {/* Right Icons */}
        <div className="flex items-center justify-center space-x-2 sm:space-x-4">
          <div className="lg:flex items-center justify-center gap-1 px-2 py-1 sm:gap-2 sm:px-3 sm:py-2 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex items-center justify-center gap-1 sm:gap-2">
              {locationEnabled && (
                <MapPin size={10} className="sm:size-3 text-green-500 animate-pulse" />
              )}
              <span
                className={`hidden sm:inline text-xs font-medium transition-colors ${isAvailable ? "text-gray-700" : "text-gray-400"
                  }`}
              >
                {isAvailable
                  ? locationEnabled
                    ? "Available • Location On"
                    : "Available"
                  : "Not Available"}
              </span>
            </div>

            <button
              onClick={toggleAvailability}
              disabled={updatingAvailability}
              className={`relative w-5 h-2 rounded-full transition-all duration-300 ${isAvailable ? "bg-green-500" : "bg-gray-300"
                } ${updatingAvailability ? "opacity-50 cursor-not-allowed" : ""}`}
              aria-label="Toggle availability and location"
              title={
                isAvailable
                  ? "Go offline and stop location"
                  : "Go online and start location"
              }
            >
              {updatingAvailability ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <div
                  className={`absolute top-0 w-2 h-2 bg-white rounded-full shadow-md transition-transform duration-300 ${isAvailable ? "translate-x-3" : "translate-x-0.5"
                    }`}
                />
              )}
            </button>
          </div>

          {/* Test Button (remove after debugging) */}
          {/* <button
            onClick={testNotification}
            className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
          >
            Test
          </button> */}

          {/* Bell */}
          <button
            onClick={handleNotificationClick}
            className="relative text-gray-600 hover:text-gray-900 transition-colors p-1"
          >
            <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[20px] h-4 bg-red-500 text-white text-xs font-semibold rounded-full flex items-center justify-center px-1">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          {/* Profile */}
          <button
            onClick={() => navigate("/dashboard/provider/settings")}
            className="flex items-center"
          >
            {user?.data?.profilePicture ? (
              <img
                src={user.data.profilePicture}
                alt="Profile"
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border"
              />
            ) : (
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border bg-[#8BC53F] flex items-center justify-center text-white font-semibold text-sm sm:text-base">
                {user?.data?.name?.charAt(0) || 'U'}
              </div>
            )}
          </button>
        </div>

        {/* Mobile Search Dropdown - Hidden since search is disabled on mobile */}
        {/* {showSearch && (
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
        )} */}


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
