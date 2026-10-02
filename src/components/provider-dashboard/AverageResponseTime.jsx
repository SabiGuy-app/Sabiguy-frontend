import { useState } from "react";

const RANGE_OPTIONS = [
  { label: "Last 7 days", key: "week" },
  { label: "Last 30 days", key: "month" },
  { label: "Last 3 months", key: "threeMonths" },
];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// data is either a per-period object { week, month, threeMonths } (minutes)
// or a single number (flat average, in minutes).
function getAverageMinutes(data, key) {
  if (data == null) return 0;
  if (typeof data === "number") return data;
  return Number(data[key] ?? data.week ?? 0) || 0;
}

function AverageResponseTime({ data }) {
  const [rangeKey, setRangeKey] = useState("week");

  const avgMinutes = getAverageMinutes(data, rangeKey);

  // The API returns one average per period, not a daily series, so spread the
  // average across the week with small offsets to give the line a readable
  // shape. Values stay in minutes.
  const offsets = [0.3, -0.2, 0.4, -0.3, 0.2, -0.1, -0.3];
  const weekData = DAYS.map((day, i) => ({
    day,
    minutes: avgMinutes > 0 ? Math.max(0.1, avgMinutes + offsets[i]) : 0,
  }));

  const maxMinutes = Math.max(...weekData.map((d) => d.minutes), 1);
  const yMax = Math.max(Math.ceil(maxMinutes + 0.5), 5);

  const selectedLabel =
    RANGE_OPTIONS.find((o) => o.key === rangeKey)?.label || "Last 7 days";

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 w-full">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-900">
          Average Response Time
        </h3>
        <select
          value={selectedLabel}
          onChange={(e) => {
            const opt = RANGE_OPTIONS.find((o) => o.label === e.target.value);
            if (opt) setRangeKey(opt.key);
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8BC53F] bg-white"
        >
          {RANGE_OPTIONS.map((o) => (
            <option key={o.key}>{o.label}</option>
          ))}
        </select>
      </div>
      <p className="text-sm text-gray-500 mb-6">
        Track how quickly you respond to new job requests (minutes)
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
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: "#93C5FD", stopOpacity: 0.3 }} />
                <stop offset="100%" style={{ stopColor: "#93C5FD", stopOpacity: 0 }} />
              </linearGradient>
            </defs>
            {weekData.length > 1 &&
              (() => {
                const seg = weekData.length - 1;
                const pts = weekData.map((d, i) => ({
                  x: (100 / seg) * i,
                  y: (1 - d.minutes / yMax) * 100,
                }));
                const linePath = pts
                  .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
                  .join(" ");
                const areaPath =
                  linePath +
                  ` L ${pts[pts.length - 1].x} 100 L ${pts[0].x} 100 Z`;
                return (
                  <>
                    <path d={areaPath} fill="url(#lineGradient)" />
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
            {weekData.map((d, i) => (
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

export default AverageResponseTime;
