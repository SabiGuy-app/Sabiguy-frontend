import { Link } from "react-router-dom";
import { ArrowRight } from "../icons";

export default function DashboardCard({ title, count, action, to, className = "", children }) {
  return (
    <section className={`business-card ${className}`} aria-label={title}>
      <div className="business-card-header">
        <h2>{title}{count !== undefined && <span className="business-card-count"> {count}</span>}</h2>
        {to && <Link className="business-card-link" to={to}>{action}<ArrowRight size={16} /></Link>}
      </div>
      {children}
    </section>
  );
}
