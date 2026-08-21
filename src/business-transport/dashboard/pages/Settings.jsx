import { useState } from "react";
import { LayoutGrid, SlidersHorizontal, Users, User, CreditCard, ShieldCheck } from "lucide-react";
import FleetDashboardLayout from "../layout/FleetDashboardLayout";
import BusinessSettingsTab from "../components/BusinessSettingsTab";
import OperationsSettingsTab from "../components/OperationsSettingsTab";
import TeamSettingsTab from "../components/TeamSettingsTab";
import AccountSettingsTab from "../components/AccountSettingsTab";
import BillingSettingsTab from "../components/BillingSettingsTab";
import AdvancedSettingsTab from "../components/AdvancedSettingsTab";
import DangerZoneCard from "../components/DangerZoneCard";

const TABS = [
  { key: "business", label: "Business", icon: LayoutGrid, Component: BusinessSettingsTab },
  { key: "operations", label: "Operations", icon: SlidersHorizontal, Component: OperationsSettingsTab },
  { key: "team", label: "Team", icon: Users, Component: TeamSettingsTab },
  { key: "account", label: "Account", icon: User, Component: AccountSettingsTab },
  { key: "billing", label: "Billing", icon: CreditCard, Component: BillingSettingsTab },
  { key: "advanced", label: "Advanced", icon: ShieldCheck, Component: AdvancedSettingsTab },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState("business");
  const ActiveTabContent = TABS.find((tab) => tab.key === activeTab)?.Component;

  return (
    <FleetDashboardLayout>
      <header className="mb-5 sm:mb-6">
        <h1 className="text-2xl font-semibold tracking-[-0.02em] text-[#231F20] sm:text-[26px]">
          Settings
        </h1>
        <p className="mt-2 text-sm text-[#656263] sm:text-base">Business account & data</p>
      </header>

      <div className="rounded-xl border border-[#E8E5E6] bg-white">
        <div className="flex gap-1 overflow-x-auto border-b border-[#E8E5E6] px-3 sm:px-4">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = tab.key === activeTab;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`flex shrink-0 items-center gap-2 border-b-2 px-3 py-4 text-sm font-medium transition-colors sm:px-4 ${
                  isActive
                    ? "border-[#2F7D55] text-[#2F7D55]"
                    : "border-transparent text-[#656263] hover:text-[#3D393A]"
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {ActiveTabContent && <ActiveTabContent />}
      </div>

      {activeTab === "advanced" && <DangerZoneCard />}
    </FleetDashboardLayout>
  );
}
