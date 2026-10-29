import { useEffect, useState } from "react";
import BusinessSidebar from "./BusinessSidebar";
import BusinessTopbar from "./BusinessTopbar";
import { mockBusinessOverview } from "../data/mockBusinessOverview";
import "./businessDashboard.css";

export default function BusinessDashboardLayout({ children, search, onSearchChange, showAvailability = true }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState("");

  useEffect(() => {
    if (!sidebarOpen) return;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setSidebarOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [sidebarOpen]);

  return (
    <div className="business-dashboard">
      <a className="business-skip-link" href="#business-main">Skip to dashboard</a>
      {sidebarOpen && <button className="business-sidebar-overlay" onClick={() => setSidebarOpen(false)} aria-label="Close navigation" />}
      <BusinessSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} wallet={mockBusinessOverview.wallet} />
      <BusinessTopbar
        sidebarOpen={sidebarOpen}
        onMenuClick={() => setSidebarOpen((value) => !value)}
        search={search ?? localSearch}
        onSearchChange={onSearchChange ?? setLocalSearch}
        showAvailability={showAvailability}
      />
      <main id="business-main" className="business-main">{children}</main>
    </div>
  );
}
