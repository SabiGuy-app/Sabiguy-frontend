import { useState } from "react";
import { Bell, Search, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const [showSearch, setShowSearch] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

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
        <button className="relative">
          <Bell className="text-gray-600" size={22} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* Profile */}
        <button
          onClick={() => navigate("/dashboard/settings")}
          className="flex items-center"
        >
          <img
            src="https://i.pravatar.cc/40"
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
    </header>
  );
}
