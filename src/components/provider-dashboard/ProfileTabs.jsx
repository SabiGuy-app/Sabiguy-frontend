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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 font-inter">
  {tabs.map((tab) => {
    const Icon = tab.icon;
    const isActive = activeTab === tab.id;

    return (
      <button
        key={tab.id}
        onClick={() => onTabChange(tab.id)}
        className={`group flex items-center justify-center gap-2 
        px-4 py-3 sm:px-5 sm:py-4 
        text-sm sm:text-[15px] font-medium 
        rounded-xl border transition-all duration-200 ease-in-out
        
        ${
          isActive
            ? "bg-[#005823] text-white border-[#005823] shadow-md scale-[1.02]"
            : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 active:scale-95"
        }`}
      >
        <Icon
          size={20}
          className={`transition-colors duration-200 ${
            isActive
              ? "text-white"
              : "text-gray-400 group-hover:text-gray-600"
          }`}
        />

        <span className="truncate">{tab.label}</span>
      </button>
    );
  })}
</div>
    </div>
  );
};