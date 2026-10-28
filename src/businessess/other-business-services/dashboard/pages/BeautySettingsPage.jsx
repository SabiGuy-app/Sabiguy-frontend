import { createElement, useState, useEffect } from "react";
import { useAuthStore } from "../../../../stores/auth.store";
import { getBusinessByEmail } from "../../api/businessess";
import {
  CreditCard,
  LayoutGrid,
  ShieldCheck,
  SlidersHorizontal,
  UserRound,
  Users,
} from "lucide-react";
import AccountSettingsTab from "../components/tabs/AccountSettingsTab";
import AdvancedSettingsTab from "../components/tabs/AdvancedSettingsTab";
import BillingSettingsTab from "../components/tabs/BillingSettingsTab";
import BusinessSettingsTab from "../components/tabs/BusinessSettingsTab";
import OperationsSettingsTab from "../components/tabs/OperationsSettingsTab";
import TeamSettingsTab from "../components/tabs/TeamSettingsTab";
import BeautyDashboardLayout from "../layout/BeautyDashboardLayout";

const tabs = [
  {
    id: "business",
    label: "Business",
    icon: createElement(LayoutGrid, { size: 13, "aria-hidden": true }),
    Component: BusinessSettingsTab,
  },
  {
    id: "operations",
    label: "Operations",
    icon: createElement(SlidersHorizontal, { size: 13, "aria-hidden": true }),
    Component: OperationsSettingsTab,
  },
  {
    id: "team",
    label: "Team",
    icon: createElement(Users, { size: 13, "aria-hidden": true }),
    Component: TeamSettingsTab,
  },
  {
    id: "account",
    label: "Account",
    icon: createElement(UserRound, { size: 13, "aria-hidden": true }),
    Component: AccountSettingsTab,
  },
  {
    id: "billing",
    label: "Billing",
    icon: createElement(CreditCard, { size: 13, "aria-hidden": true }),
    Component: BillingSettingsTab,
  },
  {
    id: "advanced",
    label: "Advanced",
    icon: createElement(ShieldCheck, { size: 13, "aria-hidden": true }),
    Component: AdvancedSettingsTab,
  },
];

const BeautySettingsPage = () => {
  const [activeTab, setActiveTab] = useState("business");
  const ActiveTab = tabs.find((tab) => tab.id === activeTab)?.Component;

  const email = useAuthStore((s) => s.user?.data?.email);
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
  if (!email) {
    setLoading(false);
    return;
  }
  let cancelled = false;

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const result = await getBusinessByEmail(email);
      console.log("by-email result:", result); // remove after testing
      if (!cancelled) setBusiness(result);
    } catch (err) {
      if (!cancelled) {
        setError(err?.response?.data?.message || "Could not load business details.");
      }
    } finally {
      if (!cancelled) setLoading(false);
    }
  };

  load();
  return () => {
    cancelled = true;
  };
}, [email]);

  return (
    <BeautyDashboardLayout>
      <main className="min-h-[calc(100vh-8rem)] text-[#242424] xl:min-h-[calc(100vh-9rem)]">
        <header className="mb-3">
          <h1 className="text-lg font-semibold leading-6">Settings</h1>
          <p className="mt-1 text-[10px] text-[#777777]">
            Business account &amp; data
          </p>
        </header>
        <section className="overflow-hidden rounded-xl border border-[#E9E9E9] bg-white">
          <nav
            aria-label="Settings sections"
            className="flex gap-1 overflow-x-auto border-b border-[#E9E9E9] px-2 sm:px-3"
          >
            {tabs.map(({ id, label, icon }) => {
              const isActive = id === activeTab;
              return (
                <button
                  key={id}
                  type="button"
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => setActiveTab(id)}
                  className={`flex shrink-0 items-center gap-1.5 border-b-2 px-2 py-3 text-[10px] font-medium transition-colors sm:px-2.5 ${isActive ? "border-[#347B54] text-[#347B54]" : "border-transparent text-[#777777] hover:text-[#333333]"}`}
                >
                  {icon}
                  {label}
                </button>
              );
            })}
          </nav>
          {ActiveTab && <ActiveTab  business={business} loading={loading} error={error} />}
        </section>
      </main>
    </BeautyDashboardLayout>
  );
};

export default BeautySettingsPage;
