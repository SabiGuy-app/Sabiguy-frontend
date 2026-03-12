import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../dashboard/Sidebar";
import Navbar from "../dashboard/Navbar";
import Modal from "../Modal";
import Button from "../button";
import { handleLogout } from "../../api/auth";
import { useAuthStore } from "../../stores/auth.store";
import useInactivityLogout from "../../hooks/useInactivityLogout";

export default function DashboardLayout({ children }) {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

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
    <div>
      <Navbar />

      <div className="flex  min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1  md:ml-65 flex flex-col">
          <main className="flex-1  min-h-screen p-3">{children}</main>
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
