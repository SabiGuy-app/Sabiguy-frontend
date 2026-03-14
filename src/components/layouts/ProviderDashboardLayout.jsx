import { useState } from "react";
import ProviderNavbar from "../provider-dashboard/Navbar";
import ProviderSidebar from "../dashboard/ProviderSideBar";

export default function ProviderDashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen((v) => !v);

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
        <div className="flex-1 md:ml-64 flex flex-col w-full">
          <main className="flex-1 min-h-screen p-3 sm:p-6 w-full">
            <div className="max-w-7xl mx-auto w-full">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
