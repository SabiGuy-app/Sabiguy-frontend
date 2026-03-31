import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { HelpCircle, MessageCircle, LogOut } from "lucide-react";
import {
  FaChartBar,
  FaBook,
  FaHeart,
  FaComments,
  FaClipboardList,
  FaCog,
  FaQuestionCircle,
  FaBell,
} from "react-icons/fa";
import { handleLogout } from "../../api/auth";

const links = [
  { name: "Dashboard", path: "/dashboard/provider", icon: <FaChartBar /> },
  {
    name: "Hire Alerts",
    path: "/dashboard/provider/hire-alert",
    icon: <FaBell />,
  },
  { name: "Chat", path: "/dashboard/provider/chat", icon: <MessageCircle /> },
  {
    name: "Activity",
    path: "/dashboard/provider/activity",
    icon: <FaClipboardList />,
  },
  { name: "Settings", path: "/dashboard/provider/settings", icon: <FaCog /> },
  { name: "Help", path: "/dashboard/provider/help", icon: <HelpCircle /> },
  // { name: "Logout", icon: <LogOut /> },
];

export default function ProviderSidebar({ open = false, onClose }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const onLogout = async () => {
    try {
      await handleLogout();
      if (onClose) onClose();
      // Add a small delay to ensure stores are cleared before redirect
      setTimeout(() => {
        navigate("/");
      }, 100);
    } catch (error) {
      console.error("Logout failed:", error);
      // Still redirect even if logout has errors
      if (onClose) onClose();
    }
  };

  return (
    <>
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 w-80 shadow-xl">
            <div className="flex items-center gap-3 mb-2">
              <LogOut className="text-red-500" size={22} />
              <h2 className="text-lg font-semibold text-gray-800">Log out?</h2>
            </div>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to log out of your account?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={onLogout}
                className="flex-1 px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 text-sm font-medium"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-16 sm:top-20 left-0 h-[calc(100vh-4rem)] sm:h-[calc(100vh-5rem)] bg-white flex flex-col border-r border-gray-200 z-40 w-3/4 md:w-64 p-6 transform transition-transform duration-300 shadow-xl md:shadow-none
        ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="flex-1 overflow-y-auto pb-6">
          <nav className="space-y-2">
            {links.map((link) => {
              if (link.name === "Logout") {
                return (
                  <button
                    key={link.name}
                    onClick={onLogout}
                    className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-red-100 hover:text-red-600"
                  >
                    <span>{link.icon}</span>
                    <span>{link.name}</span>
                  </button>
                );
              }

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => onClose && onClose()}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[#231F20] hover:bg-[#005823]/10 ${
                    pathname === link.path
                      ? "bg-[#005823] text-white font-medium"
                      : ""
                  }`}
                >
                  <span>{link.icon}</span>
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="mt-auto border-t pt-4">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
          >
            <span>
              <LogOut size={20} />
            </span>
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
