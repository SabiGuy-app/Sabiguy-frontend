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

function RevenueOverview () {
    const [selectedMonth, setSelectedMonth] = useState("Month");
    const [hoveredBar, setHoveredBar] =useState(null);

     const monthlyData = [
    { month: "Jan", value: 65000, label: "Jan" },
    { month: "Feb", value: 50000, label: "Feb" },
    { month: "Mar", value: 40000, label: "Mar" },
    { month: "Apr", value: 45000, label: "Apr" },
    { month: "May", value: 60000, label: "May" },
    { month: "Jun", value: 25000, label: "Jun" },
    { month: "Jul", value: 90000, label: "Jul" },
    { month: "Aug", value: 55000, label: "Aug" },
    { month: "Sep", value: 40000, label: "Sep" },
    { month: "Oct", value: 45000, label: "Oct" },
    { month: "Nov", value: 58000, label: "Nov" },
    { month: "Dec", value: 75000, label: "Dec" },
  ];

  const maxValue = Math.max(...monthlyData.map(d => d.value));

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-6 overflow-x-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-2">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Revenue Overview</h3>
            <select
            value = {selectedMonth}
            onChange={() => setSelectedMonth(e.target.value)}
            className="px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#8BC53F]"
            >
          <option>Month</option>
          <option>Week</option>
          <option>Year</option>
         </select>
        </div>
      <div className="relative w-full" style={{ height: '200px', minWidth: '100%' }}>
            <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-xs text-gray-500" style={{ height: 'calc(100% - 24px)' }}>
             <span>100k</span>
             <span>80k</span>
             <span>60k</span>
             <span>40k</span>
             <span>20k</span>
             <span>0</span>
            </div>

            <div className="ml-8 sm:ml-12 h-full flex items-end justify-between gap-0.5 sm:gap-1 pb-6" style={{ height: 'calc(100% - 24px)' }}>
                {monthlyData.map((data, index) => (
            <div key={index} className="flex-1 flex flex-col items-center relative group h-full justify-end min-w-0">
              <div
                className="w-full rounded-t transition-all duration-300 hover:opacity-80 cursor-pointer relative"
                style={{ 
                  height: `${(data.value / maxValue) * 100}%`,
                  backgroundColor: '#005823',
                  minHeight: '2px'
                }}
                onMouseEnter={() => setHoveredBar(index)}
                onMouseLeave={() => setHoveredBar(null)}
              >
                    {hoveredBar === index && (
                        <div className="absolute -top-10 sm:-top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded text-xs whitespace-nowrap z-10">
                    Revenue: ₦{data.value.toLocaleString()}
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                  </div>

                    )
                    }
                            </div>
                   <span className="text-xs text-gray-600 mt-1 sm:mt-2 break-words">{data.label}</span>

                        </div>

                ))}
            </div>
        </div>
    </div>
  )
}

export default RevenueOverview;