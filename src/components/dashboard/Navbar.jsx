import { useState } from "react";
import { Bell, Search, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import NotificationDrawer from "./Notification";
import { useAuthStore } from "../../stores/auth.store";

export default function Navbar() {
  const [showSearch, setShowSearch] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

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
 
  const handleNotificationClick = () => {
    setShowNotifications(true);
    setUnreadCount(0)
  };

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
        className="text-3xl font-bold text-[#005823]"
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
        {/* Bell */}
        <button
         onClick={handleNotificationClick}
         className="relative">
          <Bell size={24} />
          {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 text-white text-xs font-semibold rounded-full flex items-center justify-center" >
          {unreadCount}
          </span>
          )}
        </button>

        {/* Profile */}
        <button
          onClick={() => navigate("/dashboard/settings")}
          className="flex items-center"
        >
          <img
            src={user.data?.profilePicture || '/avatar.png'}
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
