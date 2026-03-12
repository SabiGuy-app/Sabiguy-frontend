export default function TabNavigation({ tabs, activeTab, onTabChange }) {
  return (
    <div className="bg-gray-100 rounded-lg p-0.5 sm:p-1 flex gap-0.5 sm:gap-1 overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`flex-1 px-2 sm:px-4 py-1.5 sm:py-2.5 text-xs sm:text-sm font-medium rounded-md transition-all whitespace-nowrap ${
            activeTab === tab
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
