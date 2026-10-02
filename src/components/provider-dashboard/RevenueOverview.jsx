import { useMemo, useState } from "react";

const PERIOD_OPTIONS = [
  { label: "Week", key: "week" },
  { label: "Month", key: "month" },
  { label: "Year", key: "year" },
];

// period is "YYYY-MM-DD" for week/month, "YYYY-MM" for year.
function formatPeriodLabel(period, key) {
  if (!period) return "";
  if (key === "year") {
    const [y, m] = period.split("-");
    const d = new Date(Number(y), Number(m) - 1, 1);
    return Number.isNaN(d.getTime())
      ? period
      : d.toLocaleDateString("en-US", { month: "short" });
  }
  const d = new Date(period);
  if (Number.isNaN(d.getTime())) return period;
  if (key === "week") return d.toLocaleDateString("en-US", { weekday: "short" });
  return String(d.getDate()); // month: day of month
}

function formatAxisValue(value) {
  if (value >= 1000) {
    const k = value / 1000;
    return `${Number.isInteger(k) ? k : k.toFixed(1)}k`;
  }
  return String(Math.round(value));
}

// Round up to a clean 1/2/5 × 10ⁿ ceiling so the y-axis ticks read nicely.
function niceCeil(value) {
  if (value <= 0) return 5;
  const pow = Math.pow(10, Math.floor(Math.log10(value)));
  const n = value / pow;
  const nice = n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10;
  return nice * pow;
}

export default function RevenueOverview({ data }) {
  const defaultKey = PERIOD_OPTIONS.some((o) => o.key === data?.period)
    ? data.period
    : "week";
  const [periodKey, setPeriodKey] = useState(defaultKey);
  const [hoveredBar, setHoveredBar] = useState(null);

  const chartData = useMemo(() => {
    const byPeriod = data?.byPeriod || {};
    const series = Array.isArray(byPeriod[periodKey])
      ? byPeriod[periodKey]
      : Array.isArray(data?.chart)
        ? data.chart
        : [];
    return series.map((item) => ({
      label: formatPeriodLabel(item.period, periodKey),
      value: Number(item.amount) || 0,
      rawPeriod: item.period,
    }));
  }, [data, periodKey]);

  const maxValue = Math.max(...chartData.map((d) => d.value), 0);
  const yMax = niceCeil(maxValue);
  const yTicks = [1, 0.8, 0.6, 0.4, 0.2, 0].map((f) => Math.round(yMax * f));

  // With many bars (month ≈ 30), thin out the x-axis labels so they fit.
  const labelInterval =
    chartData.length > 12 ? Math.ceil(chartData.length / 8) : 1;

  const selectedLabel =
    PERIOD_OPTIONS.find((o) => o.key === periodKey)?.label || "Week";

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-6 overflow-x-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-2">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">
          Revenue Overview
        </h3>
        <select
          value={selectedLabel}
          onChange={(e) => {
            const opt = PERIOD_OPTIONS.find((o) => o.label === e.target.value);
            if (opt) setPeriodKey(opt.key);
          }}
          className="px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#8BC53F]"
        >
          {PERIOD_OPTIONS.map((o) => (
            <option key={o.key}>{o.label}</option>
          ))}
        </select>
      </div>

      <div className="relative w-full" style={{ height: "200px", minWidth: "100%" }}>
        <div
          className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-xs text-gray-500"
          style={{ height: "calc(100% - 24px)" }}
        >
          {yTicks.map((v, i) => (
            <span key={i}>{formatAxisValue(v)}</span>
          ))}
        </div>

        <div
          className="ml-8 sm:ml-12 h-full flex items-end justify-between gap-0.5 sm:gap-1 pb-6"
          style={{ height: "calc(100% - 24px)" }}
        >
          {chartData.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-sm text-gray-400">
              No revenue data for this period.
            </div>
          ) : (
            chartData.map((item, index) => (
              <div
                key={index}
                className="flex-1 flex flex-col items-center relative group h-full justify-end min-w-0"
              >
                <div
                  className="w-full rounded-t transition-all duration-300 hover:opacity-80 cursor-pointer relative"
                  style={{
                    height: `${(item.value / yMax) * 100}%`,
                    backgroundColor: "#005823",
                    minHeight: item.value > 0 ? "2px" : "0px",
                  }}
                  onMouseEnter={() => setHoveredBar(index)}
                  onMouseLeave={() => setHoveredBar(null)}
                >
                  {hoveredBar === index && (
                    <div className="absolute -top-10 sm:-top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded text-xs whitespace-nowrap z-10">
                      Revenue: ₦{item.value.toLocaleString()}
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                    </div>
                  )}
                </div>
                <span className="text-xs text-gray-600 mt-1 sm:mt-2 break-words h-4">
                  {index % labelInterval === 0 ? item.label : ""}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
