import { Link, useLocation } from "react-router-dom";
import BeautyDashboardLayout from "../layout/BeautyDashboardLayout";
import { beautyDashboardPath, beautyNavGroups } from "../layout/beautyNavLinks";

export default function ComingSoonPage() {
  const { pathname } = useLocation();
  const section = beautyNavGroups.flatMap((group) => group.items).find((item) => `${beautyDashboardPath}/${item.path}` === pathname);
  return (
    <BeautyDashboardLayout>
      <div className="beauty-page-heading"><h1>{section?.name || "Page not found"}</h1></div>
      <section className="beauty-card beauty-section-placeholder">
        <p>{section ? "This section is coming soon." : "This dashboard page does not exist."}</p>
        <Link to={beautyDashboardPath} className="beauty-button beauty-button-primary">Back to overview</Link>
      </section>
    </BeautyDashboardLayout>
  );
}
