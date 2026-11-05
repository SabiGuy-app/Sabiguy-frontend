import { useEffect, useState } from "react";
import BusinessSidebar from "./BusinessSidebar";
import BusinessTopbar from "./BusinessTopbar";
import { getWalletBalance } from "../../../../api/provider";
import "./businessDashboard.css";

export default function BusinessDashboardLayout({ children, search, onSearchChange, showAvailability = true }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState("");
  const [wallet, setWallet] = useState({ balance: 0, owedToStaff: 0 });

  useEffect(() => {
    let active = true;
    getWalletBalance({ bustCache: true })
      .then((response) => {
        if (!active) return;
        const data = response?.data?.data || response?.data || response || {};
        setWallet({
          balance: data.available ?? data.balance ?? 0,
          owedToStaff: data.pending ?? data.owedToStaff ?? 0,
        });
      })
      .catch(() => {});
    return () => { active = false; };
  }, []);

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
      <BusinessSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} wallet={wallet} />
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
