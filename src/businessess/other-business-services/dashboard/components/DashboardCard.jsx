import { Link } from "react-router-dom";
import { ArrowRight } from "../icons";

export default function DashboardCard({ title, count, action, to, className = "", children }) {
  return (
    <section className={`beauty-card ${className}`} aria-label={title}>
      <div className="beauty-card-header">
        <h2>{title}{count !== undefined && <span className="beauty-card-count"> {count}</span>}</h2>
        {to && <Link className="beauty-card-link" to={to}>{action}<ArrowRight size={16} /></Link>}
      </div>
      {children}
    </section>
  );
}
