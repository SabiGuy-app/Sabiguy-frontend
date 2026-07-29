import { useState } from "react";
import { formatNaira, formatNairaCompact } from "../utils/format";

export default function EarningsBarChart({ data = [], summary }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-base font-semibold text-gray-900 sm:text-lg">
          Earnings — last 7 days
        </h3>
        {summary && (
          <p className="text-xs text-gray-500 sm:text-sm">
            avg {formatNaira(summary.avgPerDay)}/day · total {formatNaira(summary.total)}
          </p>
        )}
      </div>

      <div className="mt-10 flex h-48 items-end gap-1.5 sm:gap-3">
        {data.map((day, index) => {
          const isActive = hoveredIndex === index || day.isToday;
          const isLast = index === data.length - 1;
          const heightPct = Math.max((day.value / maxValue) * 100, 2);

          return (
            <div
              key={day.label}
              className="flex h-full flex-1 flex-col items-center justify-end"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="relative flex w-full flex-1 items-end justify-center">
                {isActive && (
                  <div
                    className={`absolute -top-11 z-10 whitespace-nowrap rounded-md bg-gray-900 px-2.5 py-1.5 text-center text-[11px] leading-tight text-white ${
                      isLast ? "right-0" : "left-1/2 -translate-x-1/2"
                    }`}
                  >
                    <div>{day.label}</div>
                    <div className="font-semibold">{formatNairaCompact(day.value)}</div>
                  </div>
                )}
                <div
                  className="w-full rounded-t-md transition-colors"
                  style={{
                    height: `${heightPct}%`,
                    backgroundColor: day.isToday ? "#005823" : "#005823" + "55",
                  }}
                />
              </div>
              <span className="mt-2 text-center text-[10px] text-gray-500 sm:text-xs">
                {day.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
