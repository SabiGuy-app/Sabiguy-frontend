import { Bell, Search, Menu, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function FleetTopbar({ onMenuClick }) {
  const navigate = useNavigate();

  return (
    <header className="fixed left-0 right-0 top-0 z-50 flex h-16 items-center justify-between gap-3 border-b border-[#DDDADB] bg-white px-3 py-3 sm:h-20 sm:px-6 xl:left-[325px] xl:px-8">
      <button
        className="p-2 text-gray-600 hover:text-gray-800 xl:hidden"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <Menu size={24} />
      </button>

      <button
        type="button"
        onClick={() => navigate("/business-provider/dashboard")}
        className="shrink-0 xl:hidden"
      >
        <img src="/logo.jpg" alt="SabiGuy Logo" className="h-6 w-auto sm:h-8" />
      </button>

      <div className="hidden h-12 w-full max-w-[515px] items-center rounded-xl border border-[#C6C3C4] bg-white px-5 xl:flex">
        <Search size={19} className="mr-3 text-[#848182]" />
        <input
          type="text"
          placeholder="Search"
          className="w-full bg-transparent text-base outline-none placeholder:text-[#BDBABB]"
        />
      </div>

      <div className="ml-auto flex items-center gap-3 sm:gap-4">
        <button
          type="button"
          className="relative p-1 text-gray-600 hover:text-gray-900"
          aria-label="Notifications"
        >
          <Bell size={24} />
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-semibold text-white">3</span>
        </button>

        <button
          type="button"
          onClick={() => navigate("/business-provider/dashboard/settings")}
          className="shrink-0"
        >
          <span className="flex h-9 w-9 items-end justify-center overflow-hidden rounded-full border border-[#26734A] bg-[#F0F2F1] text-[#7CC137] sm:h-11 sm:w-11">
            <UserRound size={30} className="translate-y-1 fill-current sm:h-[34px] sm:w-[34px]" />
          </span>
        </button>
      </div>
    </header>
  );
}
