import { useCallback, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ProviderNavbar from "../provider-dashboard/Navbar";
import ProviderSidebar from "../dashboard/ProviderSideBar";
import Modal from "../Modal";
import Button from "../button";
import { handleLogout } from "../../api/auth";
import { useAuthStore } from "../../stores/auth.store";
import useInactivityLogout from "../../hooks/useInactivityLogout";

export default function ProviderDashboardLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768); // Open on desktop, closed on mobile
  const toggleSidebar = () => setSidebarOpen((v) => !v);

  // Close sidebar on mobile when navigating to a new page
  useEffect(() => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, [location.pathname]);

  const onTimeoutLogout = useCallback(async () => {
    try {
      await handleLogout();
      navigate("/");
    } catch (error) {
      console.error("Auto logout failed:", error);
      navigate("/");
    }
  }, [navigate]);

  const { showWarning, extendSession, logoutNow } = useInactivityLogout({
    enabled: isAuthenticated,
    onTimeout: onTimeoutLogout,
  });

  return (
    <div className="overflow-x-hidden">
      <ProviderNavbar onMenuClick={toggleSidebar} />

      <div className="flex min-h-screen bg-gray-50">
        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <ProviderSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className={`flex-1 ${sidebarOpen ? 'md:ml-64' : ''} flex flex-col w-full`}>
          <main className="flex-1 min-h-screen p-3 sm:p-6 w-full">
            <div className="max-w-7xl mx-auto w-full overflow-x-hidden">{children}</div>
          </main>
        </div>
      </div>

      <Modal
        isOpen={showWarning}
        onClose={extendSession}
        title="Are you still there?"
      >
        <p className="text-sm text-gray-600 text-center">
          You have been inactive for 10 minutes. You will be logged out soon if
          there is no activity.
        </p>
        <div className="flex items-center justify-center gap-4 mt-6">
          <Button variant="ghost" onClick={logoutNow}>
            Log out now
          </Button>
          <Button onClick={extendSession}>Stay logged in</Button>
        </div>
      </Modal>
    </div>
  );
}
