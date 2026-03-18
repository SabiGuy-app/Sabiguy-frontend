import React from "react";
import { FiClock, FiCheckCircle, FiXCircle, FiTruck, FiMapPin } from "react-icons/fi";

const ProviderActivityItem = ({ activity }) => {
  const getIcon = (type) => {
    switch (type) {
      case "confirmed":
        return <FiCheckCircle className="text-green-500" size={20} />;
      case "onway":
        return <FiTruck className="text-blue-500" size={20} />;
      case "arrived":
        return <FiMapPin className="text-yellow-500" size={20} />;
      case "started":
        return <FiCheckCircle className="text-blue-500" size={20} />;
      case "completed":
        return <FiCheckCircle className="text-green-500" size={20} />;
      case "cancelled":
        return <FiXCircle className="text-red-500" size={20} />;
      case "pending":
        return <FiClock className="text-yellow-500" size={20} />;
      case "declined":
        return <FiXCircle className="text-red-500" size={20} />;
      default:
        return <FiClock className="text-gray-500" size={20} />;
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          {getIcon(activity.type)}
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-sm">{activity.title}</h3>
            <p className="text-gray-600 text-sm mt-1">{activity.description}</p>
            <p className="text-gray-400 text-xs mt-2">{activity.timestamp}</p>
          </div>
        </div>
        {activity.action && (
          <button
            onClick={activity.action.onClick}
            className="bg-[#8BC53F] text-white px-3 py-1 rounded-md text-xs font-medium hover:bg-[#7AB32F] transition-colors"
          >
            {activity.action.label}
          </button>
        )}
      </div>
    </div>
  );
};

export default ProviderActivityItem;