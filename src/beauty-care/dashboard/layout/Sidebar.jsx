import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Book,
  ClipboardList,
  Cog,
  Gift,
  HelpCircle,
  Home,
  LogOut,
  MessageCircle,
} from "lucide-react";

const links = [
  { name: "Home", path: "/dashboard", icon: <Home size={18} /> },
  { name: "My Bookings", path: "/beauty-care/bookings", icon: <Book size={18} /> },
  { name: "Chat", path: "/dashboard/chat", icon: <MessageCircle size={18} /> },
  { name: "Activity", path: "/dashboard/activity", icon: <ClipboardList size={18} /> },
  { name: "Referrals", path: null, icon: <Gift size={18} /> },
  { name: "Settings", path: "/dashboard/settings", icon: <Cog size={18} /> },
  { name: "Help", path: "/dashboard/help", icon: <HelpCircle size={18} /> },
];

export default function Sidebar({ open, onClose }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const onLogout = async () => {
    try {
      onClose?.();
      setShowLogoutConfirm(false);
      setTimeout(() => navigate("/login"), 100);
    } catch (error) {
      console.error("Logout failed:", error);
      onClose?.();
      navigate("/login");
    }
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
        id="sidebar"
        className={`fixed left-0 top-16 z-40 flex h-[calc(100vh-4rem)] w-[min(86vw,230px)] flex-col border-r border-[#e5e7eb] bg-white p-4 shadow-sm transition-transform duration-300 lg:top-0 lg:h-screen lg:w-[230px] lg:px-4 lg:py-6 ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="mb-8 hidden w-fit lg:block">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            aria-label="Go to dashboard"
          >
            <img src="/logo.jpg" alt="SabiGuy Logo" className="h-9 w-auto" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pb-6">
          <nav className="space-y-2">
            {links.map((link) => {
              const isActive =
                pathname === link.path ||
                (link.path === "/beauty-care/bookings" &&
                  pathname.startsWith("/beauty-care/bookings"));

              const className = `flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[#005823] text-white shadow-sm"
                  : "text-[#5f5c5d] hover:bg-[#005823]/10 hover:text-[#005823]"
              }`;

              return link.path ? (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => onClose?.()}
                  className={className}
                >
                  <span>{link.icon}</span>
                  <span>{link.name}</span>
                </Link>
              ) : (
                <div key={link.name} className={className}>
                  <span>{link.icon}</span>
                  <span>{link.name}</span>
                </div>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto pt-4">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[#5f5c5d] transition-colors hover:bg-gray-50"
          >
            <span>
              <LogOut size={18} />
            </span>
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
