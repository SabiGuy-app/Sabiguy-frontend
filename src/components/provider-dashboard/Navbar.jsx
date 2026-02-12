import { useState, useEffect } from "react";
import { Bell, Search, Menu, X, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import NotificationDrawer from "../dashboard/Notification";
import { useAuthStore } from "../../stores/auth.store";
import locationService from "../../services/locationService";
import { io } from "socket.io-client";


export default function ProviderNavbar() {
  const [showSearch, setShowSearch] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser); 
  const [socket, setSocket] = useState(null);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [updatingAvailability, setUpdatingAvailability] = useState(false);
  const navigate = useNavigate();
  const isAvailable = user?.data?.availability?.isAvailable ?? false;

  const notifications = [
    {
      id: 1,
      type: "message",
      title: "New message from Steve",
      message: "Hey, Let me know when you are on your way",
      time: "5 min ago",
      category: "today",
      read: false,
    },
    {
      id: 2,
      type: "event",
      title: "Upcoming event",
      message: "Your scheduled plumbing service starts in 30 minutes.",
      time: "1 hours ago",
      category: "today",
      read: false,
    },
    {
      id: 3,
      type: "booking",
      title: "Bookings",
      message: 'You have been book for "House wiring" by Chioma A.',
      time: "2 hours ago",
      category: "today",
      read: false,
    },
  ];


  // Initialize socket connection
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const newSocket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:3000", {
      auth: { token },
      transports: ['websocket', 'polling']
    });

    newSocket.on("connect", () => {
      console.log("✅ Provider socket connected");
    });

    newSocket.on("connect_error", (error) => {
      console.error("❌ Socket connection error:", error);
    });

    setSocket(newSocket);

    return () => {
      locationService.stopTracking();
      newSocket.disconnect();
    };
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
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          { enableHighAccuracy: true }
        );
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
        3: "Location request timed out. Please try again."
      };
      
      alert(errorMessages[error.code] || "Failed to enable location tracking");
      return false;
    }
  };

  const handleNotificationClick = () => {
    setShowNotifications(true);
    // Mark as read when opened
    setUnreadCount(0);
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
        }
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
                isAvailable: newAvailability
              }
            }
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

        console.log(`✅ Availability ${newAvailability ? 'enabled' : 'disabled'}`);
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

  // const toggleAvailability = async () => {
  //   setUpdatingAvailability(true);
  //   const newAvailability = !isAvailable; // Toggle to opposite

  //   try {
  //     const response = await fetch(
  //       `${import.meta.env.VITE_BASE_URL}/provider/availability/toggle`,
  //       {
  //         method: "PUT",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${localStorage.getItem("token")}`,
  //         },
  //         body: JSON.stringify({ isAvailable: newAvailability }), // Send the new toggled value
  //       }
  //     );

  //     const data = await response.json();

  //     if (data.success) {
  //       // Update Zustand store with new availability
  //       if (updateUser) {
  //         updateUser({
  //           ...user,
  //           data: {
  //             ...user.data,
  //             availability: {
  //               ...user.data?.availability,
  //               isAvailable: newAvailability
  //             }
  //           }
  //         });
  //       }
  //     } else {
  //       console.error("Failed to update availability:", data.message);
  //       // Optionally show error toast
  //     }
  //   } catch (error) {
  //     console.error("Error updating availability:", error);
  //     // Optionally show error toast
  //   } finally {
  //     setUpdatingAvailability(false);
  //   }
  // }

  return (     
    <header className="flex items-center justify-between bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-40 shadow-sm">

      {/* Mobile Menu Button */}
      <button
        className="md:hidden"
        onClick={() => setShowMenu(true)}
      >
        <Menu size={26} className="text-gray-700" />
      </button>

      {/* Logo */}
      <button
    className="hidden sm:block text-xl sm:text-2xl md:text-3xl font-bold text-[#005823]"
        onClick={() => navigate("/dashboard")}
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
            {/* Location indicator */}
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
            title={isAvailable ? "Go offline and stop location" : "Go online and start location"}
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
        {/* Bell */}
       <button
              onClick={handleNotificationClick}
              className="relative text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Bell size={24} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 text-white text-xs font-semibold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
        </button>

        {/* Profile */}
        <button
          onClick={() => navigate("/dashboard/provider/settings")}
          className="flex items-center"
        >
          <img
            src={user.data?.profilePicture || "/avatar.png"}
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
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 md:hidden"
             onClick={() => setShowMenu(false)}>

          <div
            className="absolute left-0 top-0 h-full w-64 bg-white shadow-lg p-6 animate-slideIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Icon */}
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
                    isAvailable ? "translate-x-[calc(100%-1.75rem)]" : "translate-x-1"
                  }`}
                />
              </button>
            </div>


            {/* Menu Links */}
            <nav className="space-y-4 text-lg text-gray-700">
              <button onClick={() => navigate("/dashboard")} className="block">
                Dashboard
              </button>

              <button onClick={() => navigate("/dashboard/categories")} className="block">
                Categories
              </button>

              <button onClick={() => navigate("/dashboard/settings")} className="block">
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
      />
    </header>
  );
}  