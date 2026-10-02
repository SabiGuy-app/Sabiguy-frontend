import { Home } from "lucide-react";
import DashboardLayout from "../../../components/layouts/DashboardLayout";
import Breadcrumbs from "../../../components/dashboard/BreadCrumbs";
import ProviderCard from "../../../components/dashboard/ProviderCard";
import { beautyProvider } from "../data/beautyProvider";

export default function BeautyServices() {
  return (
    <DashboardLayout showSidebar={true}>
      <div className="mx-auto max-w-6xl py-4">
        <Breadcrumbs paths={[{ label: "", to: "/dashboard", icon: Home }, { label: "Categories", to: "/dashboard/categories" }, { label: "Beauty & Personal Care" }]} />
        <h1 className="text-2xl font-semibold text-[#231F20] sm:text-3xl">Beauty &amp; Personal Care</h1>
        <p className="mb-8 mt-2 text-gray-500">Find hair stylists, beauty therapists, and personal care services near you.</p>
        <h2 className="mb-4 text-lg font-medium">Recommended for you</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <ProviderCard {...beautyProvider} showFavoriteButton={false} className="w-full" />
        </div>
      </div>
    </DashboardLayout>
  );
}
