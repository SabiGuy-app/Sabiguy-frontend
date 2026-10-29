import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";
import DashboardLayout from "../../../components/layouts/DashboardLayout";
import ServicesCard from "../../../components/dashboard/ServicesCard";
import Breadcrumbs from "../../../components/dashboard/BreadCrumbs";
import ComingSoonModal from "../../../components/dashboard/ComingSoonModal";
import {
  getCategoryDestination,
  useExploreCategories,
} from "../../../other-services/dashboard/data/exploreCategories";

export default function Categories() {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState(null);
  const { exploreCategories, loading, error, retry } = useExploreCategories();
  const openCategory = (category, task) => {
    const destination = getCategoryDestination(category, task);
    if (destination) navigate(destination);
    else setSelectedService(category);
  };
  return (
    <DashboardLayout showSidebar={false}>
      <div className="mx-auto max-w-6xl py-4">
        <Breadcrumbs
          paths={[
            { label: "", to: "/dashboard", icon: Home },
            { label: "Categories" },
          ]}
        />
        {loading && <p className="text-sm text-gray-500">Loading categories...</p>}
        {error && (
          <p className="text-sm text-red-600">
            Couldn't load categories.{" "}
            <button type="button" onClick={retry} className="font-semibold underline">Try again</button>
          </p>
        )}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {exploreCategories.map((category) => (
            <ServicesCard
              key={category.id}
              {...category}
              onClick={() => openCategory(category)}
              onTaskClick={(task) => openCategory(category, task)}
            />
          ))}
        </div>
        <ComingSoonModal
          isOpen={Boolean(selectedService)}
          onClose={() => setSelectedService(null)}
          service={selectedService}
        />
      </div>
    </DashboardLayout>
  );
}
