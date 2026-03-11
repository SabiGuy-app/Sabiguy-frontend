import { useState } from "react";
import { 
  FiChevronDown, 
  FiTrendingUp, 
  FiTrendingDown,
  FiCopy,
  FiCheckCircle,
  FiArrowUpRight,
  FiArrowDownLeft
} from "react-icons/fi";
import { FaPencilAlt, FaPaperPlane } from "react-icons/fa";


export default function RevenueByServiceType() {
  const services = [
    { name: "Installation", amount: 40000, percentage: 28.5, color: "#10B981" },
    { name: "Maintenance", amount: 30000, percentage: 21.4, color: "#06B6D4" },
    { name: "Repair", amount: 28000, percentage: 20, color: "#F59E0B" },
    { name: "House Wiring", amount: 24000, percentage: 17.1, color: "#EF4444" },
    { name: "House Wiring", amount: 18000, percentage: 12.9, color: "#8B5CF6" },
  ];

  const total = services.reduce((sum, s) => sum + s.amount, 0);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-6 overflow-x-auto w-full">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6 text-center">Revenue by service Type</h3>

      <div className="flex flex-col items-center gap-6">
        {/* Donut Chart */}
        <div className="relative w-28 sm:w-40 h-28 sm:h-40 flex-shrink-0">
          <svg viewBox="0 0 100 100" className="transform -rotate-90">
            {services.map((service, index) => {
              const prevPercentages = services.slice(0, index).reduce((sum, s) => sum + s.percentage, 0);
              const circumference = 2 * Math.PI * 40;
              const offset = circumference - (service.percentage / 100) * circumference;
              const rotation = (prevPercentages / 100) * 360;

              return (
                <circle
                  key={index}
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke={service.color}
                  strokeWidth="20"
                  strokeDasharray={`${circumference}`}
                  strokeDashoffset={offset}
                  style={{ transform: `rotate(${rotation}deg)`, transformOrigin: '50% 50%' }}
                />
              );
            })}
          </svg>
        </div>

        {/* Legend */}
        <div className="w-full space-y-1.5">
          {services.map((service, index) => (
            <div key={index} className="flex items-center justify-between gap-1">
              <div className="flex items-center gap-1.5 min-w-0 flex-1">
                <div
                  className="w-2 sm:w-3 h-2 sm:h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: service.color }}
                ></div>
                <span className="text-xs sm:text-sm text-gray-700 truncate">{service.name}</span>
              </div>
              <div className="text-right flex-shrink-0 whitespace-nowrap">
                <p className="text-xs sm:text-sm font-semibold text-gray-900">₦{(service.amount / 1000).toFixed(0)}k</p>
                <p className="text-xs text-gray-500">{service.percentage}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Completed Jobs */}
      <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200 flex items-center justify-center gap-2">
        <FiCheckCircle className="text-green-600 flex-shrink-0" size={18} />
        <div>
          <p className="text-xs text-gray-600">Completed Jobs</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">47</p>
        </div>
      </div>
    </div>
  );
}