import { useId, useState } from "react";
import DashboardCard from "./DashboardCard";
import { formatNaira, formatNairaCompact } from "../utils/format";
import { businessDashboardPath } from "../layout/businessNavLinks";

export default function EarningsBarChart({ earnings }) {
  const [selected, setSelected] = useState(earnings.days.length - 1);
  const [hovered, setHovered] = useState(null);
  const tooltipId = useId();
  const highest = Math.max(1, ...earnings.days.map((day) => day.amount));
  const selectedIndex = Math.max(0, Math.min(selected, earnings.days.length - 1));
  const activeIndex = hovered ?? selectedIndex;
  const selectedDay = earnings.days[activeIndex];
  return (
    <DashboardCard title="Earnings — last 7 days" action="Earnings & Payouts" to={`${businessDashboardPath}/earnings`} className="business-earnings-card">
      <div className="business-earnings-body">
        <div className="business-earnings-summary"><strong>{formatNaira(earnings.total)}</strong></div>
        <div className="business-chart" role="group" aria-label="Daily earnings for the last seven days">
          {earnings.days.map((day, index) => {
            const height = Math.max(0, day.amount) / highest * 100;
            const active = activeIndex === index;
            return (
              <button
                key={day.label}
                className={`business-chart-column ${active ? "is-selected" : ""}`}
                style={{ "--bar-height": `${height * 1.34}px` }}
                onClick={() => setSelected(index)}
                onFocus={() => setSelected(index)}
                onMouseEnter={() => setHovered(index)}
                onMouseLeave={() => setHovered(null)}
                aria-pressed={selectedIndex === index}
                aria-describedby={active ? tooltipId : undefined}
                aria-label={`${day.date}: ${formatNaira(day.amount)}`}
              >
                {active && (
                  <span className="business-chart-tooltip" role="tooltip" id={tooltipId}>
                    <span>{day.label}</span>
                    <strong>{formatNairaCompact(day.amount)}</strong>
                  </span>
                )}
                <span className="business-chart-bar-space"><span className="business-chart-bar" style={{ height: `${height}%` }} /></span>
                <span className="business-chart-label">{day.label}</span>
              </button>
            );
          })}
        </div>
        {selectedDay ? (
          <output className="sr-only" aria-live="polite">{selectedDay.date}: {formatNaira(selectedDay.amount)}</output>
        ) : <p className="business-empty">No earnings data yet.</p>}
      </div>
    </DashboardCard>
  );
}
