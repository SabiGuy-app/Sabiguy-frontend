import { useState } from "react";

// Demo copy of the provider Revenue Overview chart for the beauty dashboard.
const MONTHLY_DATA = [
  { month: "Jan", value: 72000, services: 32 },
  { month: "Feb", value: 52000, services: 25 },
  { month: "Mar", value: 33000, services: 18 },
  { month: "Apr", value: 40000, services: 20 },
  { month: "May", value: 57000, services: 28 },
  { month: "Jun", value: 15000, services: 8 },
  { month: "Jul", value: 90000, services: 40 },
  { month: "Aug", value: 52000, services: 26 },
  { month: "Sep", value: 43000, services: 22 },
  { month: "Oct", value: 45000, services: 23 },
  { month: "Nov", value: 57000, services: 28 },
  { month: "Dec", value: 75000, services: 35 },
];

export default function BeautyRevenueOverview() {
  const [period, setPeriod] = useState("Month");
  const [hoveredBar, setHoveredBar] = useState(null);

  const maxValue = Math.max(...MONTHLY_DATA.map((d) => d.value));

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-6 overflow-x-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-2">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">
          Revenue Overview
        </h3>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#8BC53F]"
        >
          <option>Month</option>
          <option>Week</option>
          <option>Year</option>
        </select>
      </div>

      <div className="relative w-full" style={{ height: "200px", minWidth: "100%" }}>
        <div
          className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-xs text-gray-500"
          style={{ height: "calc(100% - 24px)" }}
        >
          <span>100k</span>
          <span>80k</span>
          <span>60k</span>
          <span>40k</span>
          <span>20k</span>
          <span>0</span>
        </div>

        <div
          className="ml-8 sm:ml-12 h-full flex items-end justify-between gap-0.5 sm:gap-1 pb-6"
          style={{ height: "calc(100% - 24px)" }}
        >
          {MONTHLY_DATA.map((data, index) => (
            <div
              key={index}
              className="flex-1 flex flex-col items-center relative group h-full justify-end min-w-0"
            >
              <div
                className="w-full rounded-t transition-all duration-300 hover:opacity-80 cursor-pointer relative"
                style={{
                  height: `${(data.value / maxValue) * 100}%`,
                  backgroundColor: "#005823",
                  minHeight: "2px",
                }}
                onMouseEnter={() => setHoveredBar(index)}
                onMouseLeave={() => setHoveredBar(null)}
              >
                {hoveredBar === index && (
                  <div className="absolute -top-14 sm:-top-16 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded text-xs whitespace-nowrap z-10 text-left">
                    <p className="font-semibold">{data.month}</p>
                    <p>Revenue (₦): {data.value.toLocaleString()}</p>
                    <p className="text-[#8BC53F]">
                      Services completed: {data.services}
                    </p>
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                  </div>
                )}
              </div>
              <span className="text-xs text-gray-600 mt-1 sm:mt-2 break-words">
                {data.month}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
