// components/dashboard/Navbar.jsx
import { useState } from "react";
import { Bell, Search, ChevronDown, Menu } from "lucide-react";

export default function Navbar() {
  const [showSearch, setShowSearch] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="flex items-center justify-between bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-30 shadow-sm">
      {/* Mobile Menu Placeholder (optional toggle for sidebar, if needed) */}
      <div className="md:hidden">
        <Menu className="text-gray-600" size={24} />
      </div>

      {/* Search */}
      <div className="hidden md:flex flex-1 items-center max-w-md bg-gray-100 rounded-lg px-4 py-2">
        <Search size={18} className="text-gray-500 mr-2" />
        <input
          type="text"
          placeholder="Search providers or services..."
          className="bg-transparent w-full outline-none text-sm"
        />
      </div>

      {/* Mobile search icon */}
      <button
        onClick={() => setShowSearch(!showSearch)}
        className="md:hidden text-gray-600"
      >
        <Search size={22} />
      </button>

      {/* Mobile search bar (dropdown style) */}
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

      {/* Right side icons */}
      <div className="flex items-center space-x-4 ml-auto">
        {/* Notification Bell */}
        <button className="relative">
          <Bell className="text-gray-600" size={22} />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center space-x-2"
          >
            <img
              src="https://i.pravatar.cc/40"
              alt="Profile"
              className="w-8 h-8 rounded-full border border-gray-300"
            />
            <ChevronDown
              className={`text-gray-600 transition-transform ${
                showDropdown ? "rotate-180" : ""
              }`}
              size={20}
            />
          </button>

          {/* Dropdown menu */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 bg-white shadow-lg border border-gray-100 rounded-lg w-40 py-2 z-50">
              <a
                href="/dashboard/profile"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                My Profile
              </a>
              <a
                href="/dashboard/settings"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Settings
              </a>
              <button
                onClick={() => alert('Logging out...')}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
