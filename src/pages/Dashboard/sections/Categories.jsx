import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BriefcaseBusiness,
  Car,
  CarFront,
  Camera,
  Flower2,
  GraduationCap,
  Hammer,
  Home,
  House,
  Shirt,
  Sparkles,
  Utensils,
  Video,
  WashingMachine,
  X,
} from "lucide-react";
import DashboardLayout from "../../../components/layouts/DashboardLayout";
import ServicesCard from "../../../components/dashboard/ServicesCard";
import Breadcrumbs from "../../../components/dashboard/BreadCrumbs";
import { useExploreCategories } from "../../../other-services/dashboard/data/exploreCategories";

const CATEGORY_ICONS = {
  transport: Car,
  beauty: Flower2,
  automotive: CarFront,
  fashion: Shirt,
  fashon: Shirt,
  "home-repair": Hammer,
  laundry: WashingMachine,
  photography: Camera,
  videography: Video,
  catering: Utensils,
  cleaning: Sparkles,
  domestic: House,
  education: GraduationCap,
};

export default function Categories() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState(null);
  const { exploreCategories, loading, error, retry } = useExploreCategories();
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
        <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-4 lg:grid-cols-4">
          {exploreCategories.map((category) => (
            <ServicesCard
              key={category.id}
              title={category.title}
              icon={CATEGORY_ICONS[category.id] || BriefcaseBusiness}
              onClick={() => setActiveCategory(category)}
            />
          ))}
        </div>
        {activeCategory && (
          <div
            className="fixed inset-0 z-[100] flex items-end justify-center bg-black/45 p-0 sm:items-center sm:p-4"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setActiveCategory(null);
            }}
          >
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="all-services-title"
              className="max-h-[85vh] w-full overflow-y-auto rounded-t-2xl bg-white p-5 shadow-xl sm:max-w-lg sm:rounded-2xl sm:p-6"
            >
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-500">All services</p>
                  <h2 id="all-services-title" className="mt-1 text-xl font-semibold text-[#231F20]">
                    {activeCategory.title}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveCategory(null)}
                  aria-label="Close services"
                  className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-800 focus-visible:outline-2 focus-visible:outline-[#005823]"
                >
                  <X size={20} aria-hidden="true" />
                </button>
              </div>
              <div className="divide-y divide-gray-100">
                {(activeCategory.serviceNames?.length
                  ? activeCategory.serviceNames
                  : activeCategory.tasks?.length
                    ? activeCategory.tasks
                    : [activeCategory.title]
                ).map((service) => (
                  <button
                    key={service}
                    type="button"
                    onClick={() => {
                      setActiveCategory(null);
                      navigate(`/dashboard/search?q=${encodeURIComponent(service)}`);
                    }}
                    className="flex w-full items-center justify-between gap-4 py-3 text-left text-sm font-medium text-[#231F20] hover:text-[#005823] focus-visible:outline-2 focus-visible:outline-[#005823]"
                  >
                    {service}
                    <ArrowRight size={17} className="shrink-0" aria-hidden="true" />
                  </button>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
