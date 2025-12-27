import ProviderNavbar from "../provider-dashboard/Navbar";
import ProviderSidebar from "../dashboard/ProviderSideBar";

export default function ProviderDashboardLayout({ children }) {
  return (
    <div>
        <ProviderNavbar />

    <div className="flex  min-h-screen bg-gray-50">
      <ProviderSidebar />
      <div className="flex-1  md:ml-65 flex flex-col">
        <main className="flex-1  min-h-screen p-3">
          {children}</main>
      </div>
      </div>
    </div>
  );
}      
