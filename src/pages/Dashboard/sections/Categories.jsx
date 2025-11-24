import Navbar from "../../../components/dashboard/Navbar";
import Card from "../../../components/dashboard/CategoriesPageCard";
import Breadcrumbs from "../../../components/dashboard/BreadCrumbs";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Categories() {

  const navigate = useNavigate();

  // 💡 Centralized task → route mapping
  const taskRoutes = {
    "Fix leaking pipes": "/dashboard/categories/services",
    "Install bathroom fittings": "/plumbing-services",
    "Water heater repair": "/plumbing-services",

    "Emergency Ambulance": "/ambulance-services",
    "Accident Response": "/ambulance-services",
  };

  const categories = [
    {
      image: "/provider.jpg",
      title: "Emergency Services",
      tasks: [
        "Fix leaking pipes",
        "Install bathroom fittings",
        "Water heater repair",
      ],
    },
    {
      image: "/provider.jpg",
      title: "Emergency Services",
      tasks: [],
    },
    {
      image: "/provider.jpg",
      title: "Emergency Services",
      tasks: [
        "Fix leaking pipes",
        "Install bathroom fittings",
        "Water heater repair",
      ],
    },
  ];

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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1 mt-5">
          {categories.map((pro, idx) => (
            <Card
              key={idx}
              {...pro}
              onTaskClick={(task) => {
                const route = taskRoutes[task];
                if (route) navigate(route);
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
}
