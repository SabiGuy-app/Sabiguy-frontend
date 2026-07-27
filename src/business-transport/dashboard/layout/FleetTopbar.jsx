import { Bell, Search, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function FleetTopbar({ onMenuClick }) {
  const navigate = useNavigate();

  return (
    <header className="fixed left-0 right-0 top-0 z-50 flex h-16 items-center justify-between gap-3 border-b border-gray-200 bg-white px-3 py-3 shadow-sm sm:h-20 sm:px-6">
      <button
        className="p-2 text-gray-600 hover:text-gray-800 md:hidden"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <Menu size={24} />
      </button>

      <button
        type="button"
        onClick={() => navigate("/business-provider/dashboard")}
        className="shrink-0"
      >
        <img src="/logo.jpg" alt="SabiGuy Logo" className="h-6 w-auto sm:h-8" />
      </button>

      <div className="hidden flex-1 items-center max-w-md rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 md:flex">
        <Search size={16} className="mr-2 text-gray-400" />
        <input
          type="text"
          placeholder="Search for anything"
          className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
        />
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <button
          type="button"
          className="relative p-1 text-gray-600 hover:text-gray-900"
          aria-label="Notifications"
        >
          <Bell size={20} />
          <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-red-500" />
        </button>

        <button
          type="button"
          onClick={() => navigate("/business-provider/dashboard/settings")}
          className="shrink-0"
        >
          <img
            src="/avatar.png"
            alt="Profile"
            className="h-7 w-7 rounded-full border sm:h-8 sm:w-8"
          />
        </button>
      </div>
    </header>
  );
}
