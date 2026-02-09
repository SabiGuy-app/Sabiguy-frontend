import Navbar from "../../../components/dashboard/Navbar";
import Card from "../../../components/dashboard/CategoriesPageCard";
import Breadcrumbs from "../../../components/dashboard/BreadCrumbs";
import { Home } from "lucide-react";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useProviderStore } from "../../../stores/provider.store";

export default function Categories() {
  const { providers } = useProviderStore();
  const navigate = useNavigate();

  // Generate categories dynamically from providers
  const categories = useMemo(() => {
    if (!providers || providers.length === 0) {
      return [];
    }

    // Group providers by category
    const categoryMap = {};

    providers.forEach((provider) => {
      const firstJob = provider.job?.[0]; // get first job safely

      const category = firstJob?.title || "Other Services";

      if (!categoryMap[category]) {
        categoryMap[category] = {
          image: "/provider.jpg",
          title: category,
          tasks: new Set(),
        };
      }

      // Add the provider's skill/service to tasks
      if (firstJob?.service) {
        categoryMap[category].tasks.add(firstJob?.service);
      }
    });

    // Convert to array format and tasks Set to Array
    return Object.values(categoryMap).map((cat) => ({
      ...cat,
      tasks: Array.from(cat.tasks),
    }));
  }, [providers]);

  // Generate route based on task name
  const getRouteFromTask = (task) => {
    const slug = task.toLowerCase().replace(/\s+/g, "-");
    return `/dashboard/categories/${slug}`;
  };

  return (
    <>
      <Navbar />

      <div className="px-9 py-8">
        <Breadcrumbs
          paths={[
            { label: "", to: "/dashboard", icon: Home },
            { label: "Category" },
          ]}
        />

        <h1 className="font-semibold text-3xl mb-7">Explore Categories</h1>

        {categories.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No categories available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1 mt-5 mb-3">
            {categories.map((cat, idx) => (
              <Card
                key={idx}
                {...cat}
                onTaskClick={(task) => {
                  const route = getRouteFromTask(task);
                  navigate(route);
                }}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
