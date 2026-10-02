import { FiCheckCircle } from "react-icons/fi";

// Demo copy of the provider Revenue by Service donut for the beauty dashboard.
const SERVICES = [
  { name: "Installation", amount: 40000, percentage: 32.6, color: "#10B981" },
  { name: "Maintenance", amount: 30000, percentage: 26.5, color: "#06B6D4" },
  { name: "Repair", amount: 18000, percentage: 20.2, color: "#F59E0B" },
  { name: "House Wiring", amount: 15000, percentage: 12.6, color: "#EF4444" },
  { name: "House Wiring", amount: 9000, percentage: 8.1, color: "#8B5CF6" },
];

const COMPLETED_JOBS = 47;

export default function BeautyRevenueByService() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-6 overflow-x-auto w-full">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6 text-center">
        Revenue by service Type
      </h3>

      <div className="flex flex-col items-center gap-6">
        <div className="relative w-28 sm:w-40 h-28 sm:h-40 flex-shrink-0">
          <svg viewBox="0 0 100 100" className="transform -rotate-90">
            {SERVICES.map((service, index) => {
              const prevPercentages = SERVICES.slice(0, index).reduce(
                (sum, s) => sum + s.percentage,
                0,
              );
              const circumference = 2 * Math.PI * 40;
              const offset =
                circumference - (service.percentage / 100) * circumference;
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
                  style={{
                    transform: `rotate(${rotation}deg)`,
                    transformOrigin: "50% 50%",
                  }}
                />
              );
            })}
          </svg>
        </div>

        <div className="w-full space-y-1.5">
          {SERVICES.map((service, index) => (
            <div key={index} className="flex items-center justify-between gap-1">
              <div className="flex items-center gap-1.5 min-w-0 flex-1">
                <div
                  className="w-2 sm:w-3 h-2 sm:h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: service.color }}
                ></div>
                <span className="text-xs sm:text-sm text-gray-700 truncate">
                  {service.name}
                </span>
              </div>
              <div className="text-right flex-shrink-0 whitespace-nowrap">
                <p className="text-xs sm:text-sm font-semibold text-gray-900">
                  ₦{(service.amount / 1000).toFixed(0)}k
                </p>
                <p className="text-xs text-gray-500">{service.percentage}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200 flex items-center justify-center gap-2">
        <FiCheckCircle className="text-green-600 flex-shrink-0" size={18} />
        <div>
          <p className="text-xs text-gray-600">Completed Jobs</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">
            {COMPLETED_JOBS}
          </p>
        </div>
      </div>
    </div>
  );
}
