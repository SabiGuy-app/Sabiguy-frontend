import ProviderNavbar from "../provider-dashboard/Navbar";
import ProviderSidebar from "../dashboard/ProviderSideBar";

export default function ProviderDashboardLayout({ children }) {
  return (
    <div className="overflow-x-hidden">
      <ProviderNavbar />

      <div className="flex min-h-screen bg-gray-50">
        <ProviderSidebar />
        <div className="flex-1 md:ml-65 flex flex-col w-full">
          <main className="flex-1 min-h-screen p-3 sm:p-6 w-full">
            <div className="max-w-7xl mx-auto w-full">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
