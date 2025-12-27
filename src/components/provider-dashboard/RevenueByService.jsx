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
    <div className="bg-white rounded-lg border border-gray-200 p-3 ">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Revenue by service Type</h3>

      <div className="flex items-center gap-2">
        {/* Donut Chart */}
        <div className="relative w-40 h-40 flex-shrink-0">
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
        <div className="flex-1 space-y-3">
          {services.map((service, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: service.color }}
                ></div>
                <span className="text-xs text-gray-700">{service.name}</span>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold text-gray-900">₦{service.amount.toLocaleString()}</p>
                <p className="text-xs text-gray-500">{service.percentage}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Completed Jobs */}
      <div className="mt-6 pt-6 border-t border-gray-200 flex items-center gap-2">
        <FiCheckCircle className="text-green-600" size={20} />
        <div>
          <p className="text-xs text-gray-600">Completed Jobs</p>
          <p className="text-2xl font-bold text-gray-900">47</p>
        </div>
      </div>
    </div>
  );
}