import { useState } from "react";

// Demo copy of the provider Average Response Time chart for the beauty
// dashboard. Values are static minutes-per-day sample data.
const WEEK_DATA = [
  { day: "Mon", hours: 1.3 },
  { day: "Tue", hours: 2.8 },
  { day: "Wed", hours: 1.2 },
  { day: "Thu", hours: 2.5 },
  { day: "Fri", hours: 1.1 },
  { day: "Sat", hours: 2.0 },
  { day: "Sun", hours: 4.6 },
];

export default function BeautyResponseTime() {
  const [timeRange, setTimeRange] = useState("Last 7 days");

  const maxHours = Math.max(...WEEK_DATA.map((d) => d.hours), 1);
  const yMax = Math.max(Math.ceil(maxHours + 0.5), 5);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 w-full">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-900">
          Average Response Time
        </h3>
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
      <p className="text-sm text-gray-500 mb-6">
        Track how quickly you respond to new job requests
      </p>

      <div className="relative w-full" style={{ height: "192px" }}>
        <div
          className="absolute left-0 top-0 flex flex-col justify-between text-xs text-gray-500"
          style={{ height: "calc(100% - 32px)" }}
        >
          <span>{yMax}</span>
          <span>{Math.ceil(yMax * 0.8)}</span>
          <span>{Math.ceil(yMax * 0.6)}</span>
          <span>{Math.ceil(yMax * 0.4)}</span>
          <span>{Math.ceil(yMax * 0.2)}</span>
          <span>0</span>
        </div>

        <div className="ml-8 relative" style={{ height: "calc(100% - 32px)" }}>
          <svg
            className="w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            style={{ display: "block", overflow: "visible" }}
          >
            <defs>
              <linearGradient id="beautyLineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: "#93C5FD", stopOpacity: 0.3 }} />
                <stop offset="100%" style={{ stopColor: "#93C5FD", stopOpacity: 0 }} />
              </linearGradient>
            </defs>
            {(() => {
              const seg = WEEK_DATA.length - 1;
              const pts = WEEK_DATA.map((d, i) => ({
                x: (100 / seg) * i,
                y: (1 - d.hours / yMax) * 100,
              }));
              const linePath = pts
                .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
                .join(" ");
              const areaPath =
                linePath +
                ` L ${pts[pts.length - 1].x} 100 L ${pts[0].x} 100 Z`;
              return (
                <>
                  <path d={areaPath} fill="url(#beautyLineGradient)" />
                  <path
                    d={linePath}
                    stroke="#60A5FA"
                    strokeWidth="2.5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                  />
                </>
              );
            })()}
          </svg>

          <div
            className="flex justify-between text-xs text-gray-600 mt-2 absolute bottom-0 left-0 right-0"
            style={{ bottom: "-28px" }}
          >
            {WEEK_DATA.map((d, i) => (
              <span key={i} className="flex-1 text-center">
                {d.day}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
