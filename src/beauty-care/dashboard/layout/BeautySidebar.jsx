import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LogOut,
  Home,
  Book,
  MessageCircle,
  ClipboardList,
  Cog,
  HelpCircle,
} from "lucide-react";
// import { formatNaira } from "../utils/format";

const links = [
  { name: "Dashboard", path: "/beauty-provider/dashboard", icon: <Home size={18} /> },
  { name: "Hire Alerts", path: "/beauty-provider/dashboard/bookings", icon: <Book size={18} /> },
  { name: "Chat", path: "/beauty-provider/dashboard/chat", icon: <MessageCircle size={18} /> },
  { name: "Activity", path: "/beauty-provider/dashboard/activity", icon: <ClipboardList size={18} /> },
  { name: "Settings", path: "/beauty-provider/dashboard/settings", icon: <Cog size={18} /> },
  { name: "Help", path: "/beauty-provider/dashboard/help", icon: <HelpCircle size={18} /> },
];

export default function BeautySidebar({ open = false, onClose, wallet = {} }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const onLogout = () => {
    setShowLogoutConfirm(false);
    onClose?.();
    navigate("/login");
  };

  return (
    <>
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-80 rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-2 flex items-center gap-3">
              <LogOut className="text-red-500" size={22} />
              <h2 className="text-lg font-semibold text-gray-800">Log out?</h2>
            </div>
            <p className="mb-6 text-sm text-gray-500">
              Are you sure you want to log out of your account?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={onLogout}
                className="flex-1 rounded-xl bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}

      <aside
        className={`fixed left-0 top-16 z-40 flex h-[calc(100vh-4rem)] w-[min(86vw,325px)] transform flex-col border-r border-[#DDDADB] bg-white p-4 shadow-xl transition-transform duration-300 sm:top-20 sm:h-[calc(100vh-5rem)] sm:p-6 xl:top-0 xl:h-screen xl:w-[325px] xl:px-10 xl:py-8 xl:shadow-none ${
          open ? "translate-x-0" : "-translate-x-full xl:translate-x-0"
        }`}
      >
        <button
          type="button"
          onClick={() => navigate("/business-provider/dashboard")}
          className="mb-9 hidden w-fit xl:block"
        >
          <img src="/logo.jpg" alt="SabiGuy Logo" className="h-10 w-auto" />
        </button>

        <nav className="mt-7 flex-1 space-y-1.5 overflow-y-auto">
          {links.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => onClose?.()}
                className={`flex items-center gap-4 rounded-lg px-4 py-3 text-base text-[#5F5C5D] hover:text-white hover:bg-[#005823]/80 ${
                  isActive ? "bg-[#005823] font-medium text-white" : ""
                }`}
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t pt-4">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-red-600 transition-colors hover:bg-red-50"
          >
            <LogOut size={18} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}