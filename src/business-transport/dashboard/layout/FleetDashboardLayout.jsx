import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import FleetTopbar from "./FleetTopbar";
import FleetSidebar from "./FleetSidebar";
import Modal from "../../../components/Modal";
import Button from "../../../components/button";
import { handleLogout } from "../../../api/auth";
import useInactivityLogout, {
  PROVIDER_INACTIVITY_MS,
  PROVIDER_WARNING_GRACE_MS,
} from "../../../hooks/useInactivityLogout";
import { mockWallet } from "../data/mockFleetOverview";

export default function FleetDashboardLayout({ children }) {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
    enabled: true,
    inactivityMs: PROVIDER_INACTIVITY_MS,
    warningGraceMs: PROVIDER_WARNING_GRACE_MS,
    onTimeout: onTimeoutLogout,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <FleetTopbar onMenuClick={toggleSidebar} />

      <div className="flex min-h-screen bg-gray-50 pt-16 sm:pt-20">
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <FleetSidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          wallet={mockWallet}
        />
        <div className="flex w-full flex-1 flex-col md:ml-64">
          <main className="min-h-[calc(100vh-4rem)] w-full flex-1 p-3 sm:min-h-[calc(100vh-5rem)] sm:p-6">
            <div className="mx-auto w-full max-w-7xl">{children}</div>
          </main>
        </div>
      </div>

      <Modal isOpen={showWarning} onClose={extendSession} title="Are you still there?">
        <p className="text-center text-sm text-gray-600">
          You have been inactive for a while. You will be logged out soon if there is no
          activity.
        </p>
        <div className="mt-6 flex items-center justify-center gap-4">
          <Button variant="ghost" onClick={logoutNow}>
            Log out now
          </Button>
          <Button onClick={extendSession}>Stay logged in</Button>
        </div>
      </Modal>
    </div>
  );
}
