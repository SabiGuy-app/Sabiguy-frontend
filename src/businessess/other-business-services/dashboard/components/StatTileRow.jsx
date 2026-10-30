import { Triangle } from "../icons";
import { formatNaira } from "../utils/format";

export default function StatTileRow({ stats }) {
  return (
    <section className="business-stats" aria-label="Business summary">
      {stats.map((stat) => (
        <div className="business-stat" key={stat.label}>
          <h2>{stat.label}</h2>
          <p className="business-stat-value">{stat.currency ? formatNaira(stat.value) : stat.value}</p>
          <p className="business-stat-note">{stat.trend && <Triangle size={10} className="business-trend" aria-label="Increase" />}{stat.note}</p>
        </div>
      ))}
    </section>
  );
}
