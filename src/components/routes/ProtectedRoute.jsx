import { Outlet } from "react-router-dom";
import { useAuthStore } from "../../stores/auth.store";
import Unauthorized from "../../pages/Unauthorized";

export default function ProtectedRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const token = useAuthStore((state) => state.token);
  const hydrated = useAuthStore((state) => state.hydrated);

  const storedToken = localStorage.getItem("token");
  const isAuthed = Boolean(isAuthenticated || token || storedToken);

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading...
      </div>
    );
  }

  if (!isAuthed) {
    return <Unauthorized />;
  }

  return <Outlet />;
}
