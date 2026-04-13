import { FiUser, FiCreditCard, FiLock, FiUserCheck, FiGift, FiSettings} from "react-icons/fi";

// Tab Navigation Component
export default function ProviderProfileTabs({ activeTab, onTabChange }) {
  const tabs = [
    { id: "profile", label: "Profile info", icon: FiUser },
    { id: "wallet", label: "Wallet", icon: FiCreditCard },
    { id: "password", label: "Password", icon: FiLock },
    { id: "service", label: "Service Profile", icon: FiUserCheck },
    { id: "preferences", label: "Preferences", icon: FiSettings },
    // { id: "referrals", label: "Referrals", icon: FiGift },


  ];

  return (
    <div className="mb-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 font-inter">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-row items-center justify-center gap-2.5 p-4 sm:p-5 text-sm sm:text-[15px] font-semibold text-center transition-all duration-200 rounded-xl border ${
                isActive
                  ? "bg-[#005823] text-white border-[#005823] shadow-lg shadow-green-900/10 scale-[1.02]"
                  : "text-gray-500 bg-gray-50 border-gray-100 hover:bg-gray-100 hover:border-gray-200 hover:text-gray-700 active:scale-95"
              }`}
            >
              <Icon size={22} className={isActive ? "text-white" : "text-gray-400"} />
              <span className="whitespace-nowrap">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};