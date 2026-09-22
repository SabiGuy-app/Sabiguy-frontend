import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../dashboard/Sidebar";
import Navbar from "../dashboard/Navbar";
import Modal from "../Modal";
import Button from "../button";
import { handleLogout } from "../../api/auth";
import { useAuthStore } from "../../stores/auth.store";
import useInactivityLogout from "../../hooks/useInactivityLogout";
import { CallContext } from "../shared/CallContext";
import { CallModal } from "../shared/CallModal";
import { getSharedSocket, releaseSocket } from "../../services/socketManager";

export default function DashboardLayout({ children }) {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const currentUser = useAuthStore((state) => state.user);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [callOpen, setCallOpen] = useState(false);
  const [callPayload, setCallPayload] = useState(null);
  const [socket, setSocket] = useState(null);
  const toggleSidebar = () => setSidebarOpen((v) => !v);

  const onTimeoutLogout = useCallback(async () => {
    try {
      navigate("/", { replace: true });
      await handleLogout();
    } catch (error) {
      console.error("Auto logout failed:", error);
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const { showWarning, extendSession, logoutNow } = useInactivityLogout({
    enabled: isAuthenticated,
    onTimeout: onTimeoutLogout,
  });

  useEffect(() => {
    const sharedSocket = getSharedSocket();
    if (sharedSocket) setSocket(sharedSocket);
    return () => releaseSocket();
  }, []);

  const openCall = (payload) => {
    setCallPayload(payload);
    setCallOpen(true);
  };

  return (
    <CallContext.Provider value={{ openCall }}>
      <div className="min-h-screen bg-gray-50">
        <Navbar onMenuClick={toggleSidebar} />

        <div className="flex min-h-screen bg-gray-50 pt-16 sm:pt-20">
          {/* Overlay for mobile */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-30 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
          <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <div className="flex-1 md:ml-64 flex flex-col w-full">
            <main className="flex-1 min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-5rem)] p-3 sm:p-6 w-full">
              <div className="max-w-7xl mx-auto w-full">{children}</div>
            </main>
          </div>
        </div>

        <CallModal
          isOpen={callOpen}
          onClose={() => setCallOpen(false)}
          socket={socket}
          booking={callPayload?.booking}
          currentUser={currentUser}
          targetOverride={callPayload?.targetOverride}
        />

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
    </CallContext.Provider>
  );
}
