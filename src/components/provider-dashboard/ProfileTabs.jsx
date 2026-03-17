import { FiUser, FiCreditCard, FiLock, FiUserCheck, FiGift, FiSettings} from "react-icons/fi";

// Tab Navigation Component
export default function ProviderProfileTabs({ activeTab, onTabChange }) {
  const tabs = [
    { id: "profile", label: "Profile info", icon: FiUser },
    { id: "wallet", label: "Wallet", icon: FiCreditCard },
    { id: "password", label: "Password", icon: FiLock },
    { id: "service", label: "Service Profile", icon: FiUserCheck },
    { id: "preferences", label: "Prefrences", icon: FiSettings },
    { id: "referrals", label: "Referrals", icon: FiGift },


  ];

  return (
    <div className="border-b border-gray-200 mb-4">
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-1 md:gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center justify-center gap-2 px-2 md:px-1 py-3 text-xs sm:text-sm font-medium text-center transition-colors rounded-md relative ${
                activeTab === tab.id
                  ? "text-[#005823] bg-[#EAF5E8]"
                  : "text-gray-600 hover:text-gray-900 bg-white"
              }`}
            >
              <Icon size={18} />
              <span>{tab.label}</span>
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-10 h-0.5 bg-[#005823] rounded" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};