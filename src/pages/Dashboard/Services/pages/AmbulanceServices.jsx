import ServicesPage from "../../../../components/dashboard/ServicesPage";
import { useNavigate } from "react-router-dom";
import { Home, ChevronRight } from "lucide-react";


export default function AmbulanceServices() {
  const navigate = useNavigate();

  const providers = [
    {
      name: "Phil Crook",
      image: "/provider.jpg",
      skill: "Electrician",
      rating: 4.3,
      reviews: 120,
      price: "₦50,000",
      location: "Lagos, Nigeria",
    },
];

    return (
        <ServicesPage
         title="Ambulance Services"
      description="Critical medical response teams available 24/7 for life-threatening emergencies."
      providers={providers}
      breadcrumbs={[
    { label: "", to: "/dashboard", icon: Home },
    { label: "Categories", to: "/dashboard/categories" },
    { label: "Fix leaking pipes" }
  ]}
    />

    )
}