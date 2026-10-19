import { useEffect, useState } from "react";
import BeautySidebar from "./BeautySidebar";
import BeautyTopbar from "./BeautyTopbar";
import { mockBeautyOverview } from "../data/mockBeautyOverview";
import "./beautyDashboard.css";
import { useBeautyDashboardStore } from "../stores/beautyDashboard.store";

export default function BeautyDashboardLayout({ children, search, onSearchChange, available, onAvailabilityChange, notification, onReadNotification, showAvailability = true }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState("");
  const { session, dispatch, tick } = useBeautyDashboardStore();

  useEffect(() => {
    const update = () => tick();
    update();
    const timer = window.setInterval(update, 1000);
    document.addEventListener("visibilitychange", update);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", update);
    };
  }, [tick]);

  useEffect(() => {
    if (!sidebarOpen) return;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setSidebarOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [sidebarOpen]);

  return (
    <div className="beauty-dashboard">
      <a className="beauty-skip-link" href="#beauty-main">Skip to dashboard</a>
      {sidebarOpen && <button className="beauty-sidebar-overlay" onClick={() => setSidebarOpen(false)} aria-label="Close navigation" />}
      <BeautySidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} wallet={mockBeautyOverview.wallet} />
      <BeautyTopbar
        sidebarOpen={sidebarOpen}
        onMenuClick={() => setSidebarOpen((value) => !value)}
        search={search ?? localSearch}
        onSearchChange={onSearchChange ?? setLocalSearch}
        available={available ?? session.available}
        onAvailabilityChange={onAvailabilityChange ?? ((value) => dispatch({ type: "set_availability", available: value }))}
        notification={notification ?? session.notification}
        onReadNotification={onReadNotification ?? (() => dispatch({ type: "read_notification" }))}
        showAvailability={showAvailability}
      />
      <main id="beauty-main" className="beauty-main">{children}</main>
    </div>
  );
}
