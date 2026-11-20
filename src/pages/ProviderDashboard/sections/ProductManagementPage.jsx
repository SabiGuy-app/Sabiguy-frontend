import ProviderDashboardLayout from "../../../components/layouts/ProviderDashboardLayout";
import ProductsPricingSection from "../../../components/provider-dashboard/products/ProductsPricingSection";
import BusinessDashboardLayout from "../../../businessess/other-business-services/dashboard/layout/BusinessDashboardLayout";

export default function ProductManagementPage({ business = false }) {
  const Layout = business ? BusinessDashboardLayout : ProviderDashboardLayout;

  return (
    <Layout>
      <div className={business ? "business-card p-5 sm:p-7" : "rounded-xl bg-white p-5 shadow-sm sm:p-7"}>
        <ProductsPricingSection />
      </div>
    </Layout>
  );
}
