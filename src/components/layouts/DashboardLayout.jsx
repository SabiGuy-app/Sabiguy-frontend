import Sidebar from "../dashboard/Sidebar";
import Navbar from "../dashboard/Navbar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1  md:ml-65 flex flex-col">
        <Navbar />
        <main className="flex-1  min-h-screen p-3">
          {children}</main>
      </div>
    </div>
  );
}      
