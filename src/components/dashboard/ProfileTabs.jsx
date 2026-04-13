import { FiUser, FiCreditCard, FiLock, FiSettings, FiGift } from "react-icons/fi";

// Tab Navigation Component
export default function ProfileTabs({ activeTab, onTabChange }) {
  const tabs = [
    { id: "profile", label: "Profile info", icon: FiUser },
    { id: "wallet", label: "Wallet", icon: FiCreditCard },
    { id: "password", label: "Password", icon: FiLock },
    { id: "settings", label: "Settings & preferences", icon: FiSettings },
    // { id: "referrals", label: "Referrals", icon: FiGift },

  ];

  return (
    <div className="border-b border-gray-200 mb-4">
      <div className="flex flex-wrap gap-4 sm:gap-8">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-1.5 sm:gap-2 px-1 py-3 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors relative ${
                activeTab === tab.id
                  ? "text-[#005823]"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Icon size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span>{tab.label}</span>
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#005823]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};