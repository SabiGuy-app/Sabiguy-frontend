import { useState, useEffect } from "react";
import { Bell, Search, Menu, X, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import NotificationDrawer from "../dashboard/Notification";
import NotificationToast from "../NotificationToast";
import { useAuthStore } from "../../stores/auth.store";
import locationService from "../../services/locationService";
import notificationSoundService from "../../services/notificationSoundService";
import { io } from "socket.io-client";
import { notificationService } from "../../api/notifications";

export default function ProviderNavbar() {
  const [showSearch, setShowSearch] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
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
    console.log("🔔 showNotificationToast called with:", notification);

    // Play sound
    console.log("🔊 Playing notification sound...");
    notificationSoundService.play();

    // Show toast
    console.log("📢 Displaying toast notification...");
    toast.custom(
      (t) => (
        <NotificationToast
          notification={notification}
          onClose={() => {
            console.log("🔔 Toast closed");
            toast.dismiss(t.id);
          }}
          onClick={() => {
            console.log("🔔 Toast clicked");
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
      console.log("✅ Provider socket connected");
    });

    newSocket.on("connect_error", (error) => {
      console.error("❌ Socket connection error:", error);
    });

    // Listen for new notifications via socket
    newSocket.on("new_notification", (notification) => {
      console.log("📬 New notification received:", notification);
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

      console.log("✅ Location permission granted");

      // Start continuous tracking
      locationService.startTracking(socket);
      setLocationEnabled(true);

      // Also notify via socket
      if (socket) {
        socket.emit("set_availability", { isAvailable: true });
      }

      return true;
    } catch (error) {
      console.error("❌ Location permission denied:", error);

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
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/provider/availability/toggle`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ isAvailable: newAvailability }),
        },
      );

      const data = await response.json();

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
          `✅ Availability ${newAvailability ? "enabled" : "disabled"}`,
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
      <header className="flex items-center justify-between bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-40 shadow-sm">
        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setShowMenu(true)}>
          <Menu size={26} className="text-gray-700" />
        </button>

        {/* Logo */}
        <button
          className="hidden sm:block text-xl sm:text-2xl md:text-3xl font-bold text-[#005823]"
          onClick={() => navigate("/dashboard/provider")}
        >
          SabiGuy
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
          <div className="lg:flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex items-center gap-2">
              {locationEnabled && (
                <MapPin size={14} className="text-green-500 animate-pulse" />
              )}
              <span
                className={`text-xs font-medium transition-colors ${
                  isAvailable ? "text-gray-700" : "text-gray-400"
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
              className={`relative w-11 h-6 rounded-full transition-all duration-300 ${
                isAvailable ? "bg-green-500" : "bg-gray-300"
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
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <div
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${
                    isAvailable ? "translate-x-6" : "translate-x-0.5"
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
            className="relative text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Bell size={24} />
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
            <img
              src={user?.data?.profilePicture || "/avatar.png"}
              alt="Profile"
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
              <button className="mb-6" onClick={() => setShowMenu(false)}>
                <X size={26} className="text-gray-600" />
              </button>

              {/* Mobile Availability Toggle */}
              <div className="mb-6 p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-2 px-2 sm:px-3 py-1.5 bg-gray-50 rounded-xl border border-gray-200">
                  <span
                    className={`text-[10px] sm:text-xs font-medium transition-colors hidden sm:block ${
                      isAvailable ? "text-gray-700" : "text-gray-400"
                    }`}
                  >
                    {isAvailable ? "Available for Jobs" : "Not Available"}
                  </span>
                </div>
                <button
                  onClick={toggleAvailability}
                  disabled={updatingAvailability}
                  className={`relative w-full h-8 rounded-full transition-all duration-300 ${
                    isAvailable ? "bg-green-500" : "bg-gray-300"
                  } ${updatingAvailability ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <div
                    className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${
                      isAvailable
                        ? "translate-x-[calc(100%-1.75rem)]"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

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
// import { useState, useEffect, useRef } from "react";
// import { Bell, Search, Menu, X, MapPin, AlertCircle } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { io } from "socket.io-client";
// import NotificationDrawer from "../dashboard/Notification";
// import { useAuthStore } from "../../stores/auth.store";
// import locationService from "../../services/locationService";

// export default function ProviderNavbar() {
//   const [showSearch, setShowSearch] = useState(false);
//   const [showMenu, setShowMenu] = useState(false);
//   const [showNotifications, setShowNotifications] = useState(false);
//   const [unreadCount, setUnreadCount] = useState(3);
//   const [socket, setSocket] = useState(null);
//   const [locationEnabled, setLocationEnabled] = useState(false);
//   const [locationError, setLocationError] = useState(null);
//   const [updatingAvailability, setUpdatingAvailability] = useState(false);
//   const [showLocationAlert, setShowLocationAlert] = useState(false);

//   const user = useAuthStore((state) => state.user);
//   const updateUser = useAuthStore((state) => state.updateUser);
//   const navigate = useNavigate();

//   const isAvailable = user?.data?.availability?.isAvailable ?? false;
//   const locationCheckInterval = useRef(null);

//   // Initialize socket connection
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) return;

//     const newSocket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:3000", {
//       auth: { token },
//       transports: ['websocket', 'polling']
//     });

//     newSocket.on("connect", () => {
//       console.log("✅ Provider socket connected");
//     });

//     newSocket.on("connect_error", (error) => {
//       console.error("❌ Socket connection error:", error);
//     });

//     setSocket(newSocket);

//     return () => {
//       locationService.stopTracking();
//       if (locationCheckInterval.current) {
//         clearInterval(locationCheckInterval.current);
//       }
//       newSocket.disconnect();
//     };
//   }, []);

//   // Sync location tracking with availability
//   useEffect(() => {
//     if (isAvailable && socket) {
//       startLocationTracking();
//       startLocationMonitoring();
//     } else if (!isAvailable) {
//       stopLocationTracking();
//       stopLocationMonitoring();
//     }
//   }, [isAvailable, socket]);

//   // Monitor location status every 10 seconds
//   const startLocationMonitoring = () => {
//     // Clear any existing interval
//     if (locationCheckInterval.current) {
//       clearInterval(locationCheckInterval.current);
//     }

//     // Check location status every 10 seconds
//     locationCheckInterval.current = setInterval(() => {
//       checkLocationStatus();
//     }, 10000);
//   };

//   const stopLocationMonitoring = () => {
//     if (locationCheckInterval.current) {
//       clearInterval(locationCheckInterval.current);
//       locationCheckInterval.current = null;
//     }
//   };

//   const checkLocationStatus = () => {
//     if (!isAvailable) return;

//     if (!navigator.geolocation) {
//       handleLocationError("Location services not supported");
//       return;
//     }

//     // Try to get current position
//     navigator.geolocation.getCurrentPosition(
//       // Success - location is enabled
//       (position) => {
//         setLocationError(null);
//         setShowLocationAlert(false);

//         // If location was previously disabled, restart tracking
//         if (!locationEnabled) {
//           console.log("📍 Location re-enabled, restarting tracking...");
//           locationService.startTracking(socket);
//           setLocationEnabled(true);
//         }
//       },
//       // Error - location is disabled or denied
//       (error) => {
//         console.error("📍 Location check failed:", error);

//         const errorMessage = getLocationErrorMessage(error.code);
//         handleLocationError(errorMessage);

//         // If provider is still available but location failed, show alert
//         if (isAvailable) {
//           setShowLocationAlert(true);
//         }
//       },
//       {
//         enableHighAccuracy: false,
//         timeout: 5000,
//         maximumAge: 0
//       }
//     );
//   };

//   const getLocationErrorMessage = (code) => {
//     const messages = {
//       1: "Location access denied",
//       2: "Location unavailable - check device settings",
//       3: "Location request timed out"
//     };
//     return messages[code] || "Location error";
//   };

//   const handleLocationError = (message) => {
//     setLocationError(message);
//     setLocationEnabled(false);
//     locationService.stopTracking();
//   };

//   const startLocationTracking = async () => {
//     if (!navigator.geolocation) {
//       alert("Your browser does not support location tracking");
//       return false;
//     }

//     try {
//       // Request permission first
//       const position = await new Promise((resolve, reject) => {
//         navigator.geolocation.getCurrentPosition(
//           resolve,
//           reject,
//           { enableHighAccuracy: true, timeout: 10000 }
//         );
//       });

//       console.log("✅ Location permission granted");

//       // Start continuous tracking
//       locationService.startTracking(socket);
//       setLocationEnabled(true);
//       setLocationError(null);
//       setShowLocationAlert(false);

//       // Notify via socket
//       if (socket) {
//         socket.emit("set_availability", { isAvailable: true });
//       }

//       return true;
//     } catch (error) {
//       console.error("❌ Location permission error:", error);

//       const errorMessage = getLocationErrorMessage(error.code);
//       setLocationError(errorMessage);

//       // Show user-friendly error
//       if (error.code === 1) {
//         alert(
//           "Location permission denied.\n\n" +
//           "To go online, you must:\n" +
//           "1. Enable location in your browser settings\n" +
//           "2. Enable location on your device\n" +
//           "3. Try again"
//         );
//       } else if (error.code === 2) {
//         alert(
//           "Location is disabled on your device.\n\n" +
//           "Please enable location services in your device settings and try again."
//         );
//       } else {
//         alert("Failed to access location. Please try again.");
//       }

//       return false;
//     }
//   };

//   const stopLocationTracking = () => {
//     locationService.stopTracking();
//     setLocationEnabled(false);
//     setLocationError(null);
//     setShowLocationAlert(false);
//   };

//   const toggleAvailability = async () => {
//     const newAvailability = !isAvailable;

//     // If turning ON, request location permission first
//     if (newAvailability) {
//       const locationGranted = await startLocationTracking();
//       if (!locationGranted) {
//         // Don't proceed if location permission denied
//         return;
//       }
//     }

//     setUpdatingAvailability(true);

//     try {
//       const response = await fetch(
//         `${import.meta.env.VITE_BASE_URL}/provider/availability/toggle`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//           body: JSON.stringify({ isAvailable: newAvailability }),
//         }
//       );

//       const data = await response.json();

//       if (data.success) {
//         // Update Zustand store
//         if (updateUser) {
//           updateUser({
//             ...user,
//             data: {
//               ...user.data,
//               availability: {
//                 ...user.data?.availability,
//                 isAvailable: newAvailability
//               }
//             }
//           });
//         }

//         // If turning OFF, stop everything
//         if (!newAvailability) {
//           stopLocationTracking();
//           stopLocationMonitoring();

//           // Notify socket
//           if (socket) {
//             socket.emit("set_availability", { isAvailable: false });
//           }
//         } else {
//           // If turning ON, start monitoring
//           startLocationMonitoring();
//         }

//         console.log(`✅ Availability ${newAvailability ? 'enabled' : 'disabled'}`);
//       } else {
//         console.error("Failed to update availability:", data.message);
//         alert("Failed to update availability. Please try again.");

//         // Rollback
//         if (newAvailability) {
//           stopLocationTracking();
//         }
//       }
//     } catch (error) {
//       console.error("Error updating availability:", error);
//       alert("Error updating availability. Please check your connection.");

//       // Rollback
//       if (newAvailability) {
//         stopLocationTracking();
//       }
//     } finally {
//       setUpdatingAvailability(false);
//     }
//   };

//   const handleFixLocation = () => {
//     setShowLocationAlert(false);

//     // Show instructions
//     const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

//     if (isMobile) {
//       alert(
//         "📍 Enable Location on Your Device\n\n" +
//         "1. Go to your device Settings\n" +
//         "2. Find Location or Privacy settings\n" +
//         "3. Enable Location Services\n" +
//         "4. Allow location for your browser\n" +
//         "5. Refresh this page"
//       );
//     } else {
//       alert(
//         "📍 Enable Location in Your Browser\n\n" +
//         "Chrome:\n" +
//         "1. Click the lock icon in address bar\n" +
//         "2. Click 'Site settings'\n" +
//         "3. Change Location to 'Allow'\n" +
//         "4. Refresh this page\n\n" +
//         "Firefox:\n" +
//         "1. Click the 🛈 icon in address bar\n" +
//         "2. Click 'Permissions'\n" +
//         "3. Allow 'Access Your Location'\n" +
//         "4. Refresh this page"
//       );
//     }
//   };

//   const notifications = [
//     {
//       id: 1,
//       type: "message",
//       title: "New message from Steve",
//       message: "Hey, Let me know when you are on your way",
//       time: "5 min ago",
//       category: "today",
//       read: false,
//     },
//     {
//       id: 2,
//       type: "event",
//       title: "Upcoming event",
//       message: "Your scheduled plumbing service starts in 30 minutes.",
//       time: "1 hours ago",
//       category: "today",
//       read: false,
//     },
//     {
//       id: 3,
//       type: "booking",
//       title: "Bookings",
//       message: 'You have been book for "House wiring" by Chioma A.',
//       time: "2 hours ago",
//       category: "today",
//       read: false,
//     },
//   ];

//   const handleNotificationClick = () => {
//     setShowNotifications(true);
//     setUnreadCount(0);
//   };

//   return (
//     <>
//       <header className="flex items-center justify-between bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-40 shadow-sm">

//         {/* Mobile Menu Button */}
//         <button
//           className="md:hidden"
//           onClick={() => setShowMenu(true)}
//         >
//           <Menu size={26} className="text-gray-700" />
//         </button>

//         {/* Logo */}
//         <button
//           className="hidden sm:block text-xl sm:text-2xl md:text-3xl font-bold text-[#005823]"
//           onClick={() => navigate("/dashboard")}
//         >
//           SabiGuy
//         </button>

//         {/* Desktop Search */}
//         <div className="hidden md:flex flex-1 items-center ml-10 max-w-sm bg-gray-100 border border-gray-300 rounded-lg px-3 py-2">
//           <Search size={18} className="text-gray-500 mr-2" />
//           <input
//             type="text"
//             placeholder="Search providers or services..."
//             className="bg-transparent w-full outline-none text-sm"
//           />
//         </div>

//         {/* Mobile Search Toggle */}
//         <button
//           onClick={() => setShowSearch(!showSearch)}
//           className="md:hidden text-gray-600"
//         >
//           <Search size={22} />
//         </button>

//         {/* Right Icons */}
//         <div className="flex items-center space-x-4">
//           <div className="lg:flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-xl border border-gray-200">
//             <div className="flex items-center gap-2">
//               {/* Location indicator */}
//               {isAvailable && (
//                 locationEnabled ? (
//                   <MapPin size={14} className="text-green-500 animate-pulse" />
//                 ) : (
//                   <AlertCircle size={14} className="text-red-500" />
//                 )
//               )}
//               <span
//                 className={`text-xs font-medium transition-colors ${
//                   isAvailable
//                     ? locationEnabled
//                       ? "text-gray-700"
//                       : "text-red-600"
//                     : "text-gray-400"
//                 }`}
//               >
//                 {isAvailable
//                   ? locationEnabled
//                     ? "Available • Location On"
//                     : locationError || "Location Off"
//                   : "Not Available"}
//               </span>
//             </div>

//             <button
//               onClick={toggleAvailability}
//               disabled={updatingAvailability}
//               className={`relative w-11 h-6 rounded-full transition-all duration-300 ${
//                 isAvailable && locationEnabled ? "bg-green-500" :
//                 isAvailable && !locationEnabled ? "bg-red-500" :
//                 "bg-gray-300"
//               } ${updatingAvailability ? "opacity-50 cursor-not-allowed" : ""}`}
//               aria-label="Toggle availability and location"
//               title={isAvailable ? "Go offline" : "Go online and enable location"}
//             >
//               {updatingAvailability ? (
//                 <div className="absolute inset-0 flex items-center justify-center">
//                   <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                 </div>
//               ) : (
//                 <div
//                   className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${
//                     isAvailable ? "translate-x-6" : "translate-x-0.5"
//                   }`}
//                 />
//               )}
//             </button>
//           </div>

//           {/* Bell */}
//           <button
//             onClick={handleNotificationClick}
//             className="relative text-gray-600 hover:text-gray-900 transition-colors"
//           >
//             <Bell size={24} />
//             {unreadCount > 0 && (
//               <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 text-white text-xs font-semibold rounded-full flex items-center justify-center">
//                 {unreadCount}
//               </span>
//             )}
//           </button>

//           {/* Profile */}
//           <button
//             onClick={() => navigate("/dashboard/provider/settings")}
//             className="flex items-center"
//           >
//             <img
//               src={user.data?.profilePicture || "/avatar.png"}
//               className="w-8 h-8 rounded-full border"
//               alt="Profile"
//             />
//           </button>
//         </div>

//         {/* Mobile Search Dropdown */}
//         {showSearch && (
//           <div className="absolute top-16 left-0 w-full bg-white border-t border-gray-200 p-4 md:hidden">
//             <div className="flex items-center bg-gray-100 rounded-lg px-4 py-2">
//               <Search size={18} className="text-gray-500 mr-2" />
//               <input
//                 type="text"
//                 placeholder="Search providers or services..."
//                 className="bg-transparent w-full outline-none text-sm"
//               />
//             </div>
//           </div>
//         )}

//         {/* Mobile Slide-in Menu */}
//         {showMenu && (
//           <div className="fixed inset-0 bg-black bg-opacity-40 z-50 md:hidden"
//                onClick={() => setShowMenu(false)}>

//             <div
//               className="absolute left-0 top-0 h-full w-64 bg-white shadow-lg p-6 animate-slideIn"
//               onClick={(e) => e.stopPropagation()}
//             >
//               {/* Close Icon */}
//               <button className="mb-6" onClick={() => setShowMenu(false)}>
//                 <X size={26} className="text-gray-600" />
//               </button>

//               {/* Mobile Availability Toggle */}
//               <div className="mb-6 p-4 border border-gray-200 rounded-lg">
//                 <div className="flex items-center justify-between mb-3">
//                   <span className="text-sm font-medium text-gray-700">
//                     {isAvailable ? "Available for Jobs" : "Not Available"}
//                   </span>
//                   {isAvailable && (
//                     locationEnabled ? (
//                       <MapPin size={16} className="text-green-500 animate-pulse" />
//                     ) : (
//                       <AlertCircle size={16} className="text-red-500" />
//                     )
//                   )}
//                 </div>

//                 <button
//                   onClick={toggleAvailability}
//                   disabled={updatingAvailability}
//                   className={`relative w-full h-10 rounded-full transition-all duration-300 ${
//                     isAvailable && locationEnabled ? "bg-green-500" :
//                     isAvailable && !locationEnabled ? "bg-red-500" :
//                     "bg-gray-300"
//                   } ${updatingAvailability ? "opacity-50 cursor-not-allowed" : ""}`}
//                 >
//                   {updatingAvailability ? (
//                     <div className="absolute inset-0 flex items-center justify-center">
//                       <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                     </div>
//                   ) : (
//                     <div
//                       className={`absolute top-1 w-8 h-8 bg-white rounded-full shadow-md transition-transform duration-300 flex items-center justify-center ${
//                         isAvailable ? "translate-x-[calc(100%-2.25rem)]" : "translate-x-1"
//                       }`}
//                     >
//                       {locationEnabled && <MapPin size={14} className="text-green-500" />}
//                       {isAvailable && !locationEnabled && <AlertCircle size={14} className="text-red-500" />}
//                     </div>
//                   )}
//                 </button>

//                 {locationEnabled && (
//                   <p className="mt-2 text-xs text-green-600">
//                     📍 Location tracking active
//                   </p>
//                 )}

//                 {isAvailable && !locationEnabled && (
//                   <p className="mt-2 text-xs text-red-600">
//                     ⚠️ {locationError || "Location disabled"}
//                   </p>
//                 )}
//               </div>

//               {/* Menu Links */}
//               <nav className="space-y-4 text-lg text-gray-700">
//                 <button onClick={() => navigate("/dashboard")} className="block">
//                   Dashboard
//                 </button>

//                 <button onClick={() => navigate("/dashboard/categories")} className="block">
//                   Categories
//                 </button>

//                 <button onClick={() => navigate("/dashboard/settings")} className="block">
//                   Settings
//                 </button>
//               </nav>
//             </div>
//           </div>
//         )}

//         <NotificationDrawer
//           isOpen={showNotifications}
//           onClose={() => setShowNotifications(false)}
//           notifications={notifications}
//         />
//       </header>

//       {/* Location Alert Banner */}
//       {showLocationAlert && isAvailable && (
//         <div className="bg-red-50 border-b border-red-200 px-6 py-3">
//           <div className="flex items-center justify-between max-w-7xl mx-auto">
//             <div className="flex items-center gap-3">
//               <AlertCircle size={20} className="text-red-600" />
//               <div>
//                 <p className="text-sm font-semibold text-red-800">
//                   Location is disabled
//                 </p>
//                 <p className="text-xs text-red-600">
//                   You won't receive job requests until location is enabled
//                 </p>
//               </div>
//             </div>
//             <button
//               onClick={handleFixLocation}
//               className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
//             >
//               Fix Now
//             </button>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }
