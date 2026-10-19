import { Triangle } from "../icons";
import { formatNaira } from "../utils/format";

export default function StatTileRow({ stats }) {
  return (
    <section className="beauty-stats" aria-label="Business summary">
      {stats.map((stat) => (
        <div className="beauty-stat" key={stat.label}>
          <h2>{stat.label}</h2>
          <p className="beauty-stat-value">{stat.currency ? formatNaira(stat.value) : stat.value}</p>
          <p className="beauty-stat-note">{stat.trend && <Triangle size={10} className="beauty-trend" aria-label="Increase" />}{stat.note}</p>
        </div>
      ))}
    </section>
  );
}
