import { Link, useLocation } from "react-router-dom";
import BusinessDashboardLayout from "../layout/BusinessDashboardLayout";
import { businessDashboardPath, businessNavGroups } from "../layout/businessNavLinks";

export default function ComingSoonPage() {
  const { pathname } = useLocation();
  const section = businessNavGroups.flatMap((group) => group.items).find((item) => `${businessDashboardPath}/${item.path}` === pathname);
  return (
    <BusinessDashboardLayout>
      <div className="business-page-heading"><h1>{section?.name || "Page not found"}</h1></div>
      <section className="business-card business-section-placeholder">
        <p>{section ? "This section is coming soon." : "This dashboard page does not exist."}</p>
        <Link to={businessDashboardPath} className="business-button business-button-primary">Back to overview</Link>
      </section>
    </BusinessDashboardLayout>
  );
}
