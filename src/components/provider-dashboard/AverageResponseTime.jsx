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

function AverageResponseTime() {
   const [timeRange, setTimeRange] = useState("Last 7 days");

  const weekData = [
    { day: "Mon", hours: 2.5 },
    { day: "Tue", hours: 3 },
    { day: "Wed", hours: 1.8 },
    { day: "Thu", hours: 2.8 },
    { day: "Fri", hours: 2 },
    { day: "Sat", hours: 3.2 },
    { day: "Sun", hours: 4.5 },
  ];

  const maxHours = Math.max(...weekData.map(d => d.hours));

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 w-full">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-900">Average Response Time</h3>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8BC53F] bg-white"
        >
          <option>Last 7 days</option>
          <option>Last 30 days</option>
          <option>Last 3 months</option>
        </select>
      </div>
      <p className="text-sm text-gray-500 mb-6">Track how quickly you respond to new job requests</p>

      {/* Line Chart */}
      <div className="relative w-full" style={{ height: '192px' }}>
        {/* Y-axis */}
        <div className="absolute left-0 top-0 flex flex-col justify-between text-xs text-gray-500" style={{ height: 'calc(100% - 32px)' }}>
          <span>5</span>
          <span>4</span>
          <span>3</span>
          <span>2</span>
          <span>1</span>
          <span>0</span>
        </div>

        {/* Line and area */}
        <div className="ml-8 relative" style={{ height: 'calc(100% - 32px)' }}>
          <svg className="w-full h-full" preserveAspectRatio="none" style={{ display: 'block' }}>
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#93C5FD', stopOpacity: 0.3 }} />
                <stop offset="100%" style={{ stopColor: '#93C5FD', stopOpacity: 0 }} />
              </linearGradient>
            </defs>
            {/* Area fill */}
            <path
              d={`M 0,${(1 - weekData[0].hours / maxHours) * 100}% 
                  L ${(100 / 6) * 1}%,${(1 - weekData[1].hours / maxHours) * 100}% 
                  L ${(100 / 6) * 2}%,${(1 - weekData[2].hours / maxHours) * 100}% 
                  L ${(100 / 6) * 3}%,${(1 - weekData[3].hours / maxHours) * 100}% 
                  L ${(100 / 6) * 4}%,${(1 - weekData[4].hours / maxHours) * 100}% 
                  L ${(100 / 6) * 5}%,${(1 - weekData[5].hours / maxHours) * 100}% 
                  L 100%,${(1 - weekData[6].hours / maxHours) * 100}%
                  L 100%,100% L 0,100% Z`}
              fill="url(#lineGradient)"
            />
            {/* Line */}
            <path
              d={`M 0,${(1 - weekData[0].hours / maxHours) * 100}% 
                  L ${(100 / 6) * 1}%,${(1 - weekData[1].hours / maxHours) * 100}% 
                  L ${(100 / 6) * 2}%,${(1 - weekData[2].hours / maxHours) * 100}% 
                  L ${(100 / 6) * 3}%,${(1 - weekData[3].hours / maxHours) * 100}% 
                  L ${(100 / 6) * 4}%,${(1 - weekData[4].hours / maxHours) * 100}% 
                  L ${(100 / 6) * 5}%,${(1 - weekData[5].hours / maxHours) * 100}% 
                  L 100%,${(1 - weekData[6].hours / maxHours) * 100}%`}
              stroke="#60A5FA"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          
          {/* X-axis labels */}
          <div className="flex justify-between text-xs text-gray-600 mt-2 absolute bottom-0 left-0 right-0" style={{ bottom: '-28px' }}>
            {weekData.map((d, i) => (
              <span key={i} className="flex-1 text-center">{d.day}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AverageResponseTime;