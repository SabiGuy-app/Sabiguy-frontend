export default function TabNavigation({ tabs, activeTab, onTabChange }) {
  return (
    <div className="bg-gray-100 rounded-lg p-1 flex gap-1">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-md transition-all ${
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
