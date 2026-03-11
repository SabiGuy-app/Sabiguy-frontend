import { FiSearch } from "react-icons/fi";
import { 
  FiCheckCircle, 
  FiTruck, 
  FiMapPin, 
  FiTool, 
  FiXCircle, 
  FiClock 
} from "react-icons/fi";

export default function Activities({ activity }) {
  const getIconConfig = (type) => {
    const configs = {
      confirmed: { icon: FiCheckCircle, bgColor: "bg-blue-500", textColor: "text-blue-500" },
      onway: { icon: FiTruck, bgColor: "bg-yellow-500", textColor: "text-yellow-500" },
      arrived: { icon: FiMapPin, bgColor: "bg-green-500", textColor: "text-green-500" },
      started: { icon: FiCheckCircle, bgColor: "bg-blue-500", textColor: "text-blue-500" },
      completed: { icon: FiCheckCircle, bgColor: "bg-green-500", textColor: "text-green-500" },
      cancelled: { icon: FiXCircle, bgColor: "bg-red-500", textColor: "text-red-500" },
      pending: { icon: FiClock, bgColor: "bg-yellow-500", textColor: "text-yellow-500" },
      declined: { icon: FiXCircle, bgColor: "bg-red-500", textColor: "text-red-500" },
    };
    return configs[type] || configs.confirmed;
  };

  const { icon: Icon, bgColor } = getIconConfig(activity.type);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-2 sm:p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`w-8 sm:w-10 h-8 sm:h-10 ${bgColor} rounded-full flex items-center justify-center flex-shrink-0`}>
          <Icon className="text-white" size={16} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1 text-xs sm:text-sm break-words">
                {activity.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-2 break-words">
                {activity.description}
              </p>
              <span className="text-xs text-gray-500 break-words">
                {activity.timestamp}
              </span>
            </div>

            {/* Action Button */}
            {activity.action && (
              <button
                onClick={activity.action.onClick}
                className="px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium text-[#005823] hover:bg-[#8BC53FBF] border border-gray-300 rounded-lg transition-colors whitespace-nowrap"
              >
                {activity.action.label}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

;
}