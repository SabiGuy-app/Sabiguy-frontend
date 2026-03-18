import DashboardLayout from "../../../components/layouts/DashboardLayout";
import ProviderCard from "../../../components/dashboard/ProviderCard";
import CategoryCarousel from "../../../components/dashboard/CategoryCarousel";
import Button from "../../../components/dashboard/Button";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../stores/auth.store";
import { getAllProviders } from "../../../api/provider";
import { useState, useEffect } from "react";
import { useProviderStore } from "../../../stores/provider.store";
import ServicesCard from "../../../components/dashboard/ServicesCard";
import family from "/family.png";
import delivery from "/delivery.png";
import handtool from "/hand-tools.png";
import siren from "/siren.png";
import new1 from "/new1.png";
import new2 from "/new2.png";
import new3 from "/new3.png";
import { sendTestNotification } from "../../../api/fcm";
import ComingSoonModal from "../../../components/dashboard/ComingSoonModal";
import DashboardTour from "../../../components/tour/DashboardTour";

export default function DashboardHome() {
  const [loading, setLoading] = useState(false);
  const { token } = useAuthStore();
  const hydrated = useAuthStore((state) => state.hydrated);
  const { providers, setProviders } = useProviderStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  if (!hydrated) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mx-auto mb-4"></div>
            <div className="h-4 w-96 bg-gray-200 rounded animate-pulse mx-auto"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const categories = [
    {
      title: "Package Delivery",
      description: "Your items delivered quickly and safely",
      image: new1,
      comingSoon: false,
    },
    {
      title: "Book a Ride",
      description: "Reliable rides, ready whenever you are.",
      image: new2,
      // bgColor: "#BF4A0B4D",
      comingSoon: false,
    },
    {
      title: "Welding",
      description: "Reliable welding for repairs and fabrication",
      image: new3,
      // bgColor: "#72280080",
      comingSoon: true,
    },
    {
      title: "Household Support",
      description: "Quick, dependable household assistance anytime.",
      image: new1,
      bgColor: "#0054AE80",
      comingSoon: true,
    },
    {
      title: "Towing & Roadside",
      description: "Fast help for breakdowns and emergencies",
      image: new2,
      bgColor: "#B100004D",
      comingSoon: true,
    },
    {
      title: "Legal & Financial",
      description: "Expert guidance for legal and financial needs",
      image: new3,
      bgColor: "#4800D94D",
      comingSoon: true,
    },
    {
      title: "Plumbing",
      description: "Fast help for breakdowns and emergencies",
      image: new1,
      bgColor: "#BF4A0B4D",
      comingSoon: true,
    },
    {
      title: "Digital Design",
      description: "Modern designs for web, brand, and media.",
      image: new2,
      bgColor: "#A30B4B4D",
      comingSoon: true,
    },
  ];

  const services = [
    {
      // logo: (
      //   <Truck
      //     size={80}
      //     className="bg-[#6467F2]/10 text-[#6467F2] rounded-full p-5 "
      //   />
      // ),
      image: delivery,
      title: "Transport & Logistics",
    },
    {
      // logo: (
      //   <CircleAlert
      //     size={80}
      //     className="bg-red-50 text-red-500 rounded-full p-5 "
      //   />
      // ),
      image: siren,
      title: "Emergency Services",
    },
    {
      // logo: (
      //   <Home
      //     size={80}
      //     className="bg-blue-50 text-blue-500 rounded-full p-5 "
      //   />
      // ),
      image: family,
      title: "Domestic & Lifetyle",
    },
    {
      // logo: (
      //   <Wrench
      //     size={80}
      //     className="bg-[#FF620D]/10 text-[#FF620D] rounded-full p-5 "
      //   />
      // ),
      image: handtool,
      title: "Home & Repair",
    },
    {
      // logo: (
      //   <Briefcase
      //     size={80}
      //     className="bg-purple-50 text-purple-500 rounded-full p-5 "
      //   />
      // ),
      image: family,
      title: "Professional Services",
    },
    {
      // logo: (
      //   <Palette
      //     size={80}
      //     className="bg-[#E83781]/10 text-[#E83781]  rounded-full p-5 "
      //   />
      // ),
      image: family,
      title: "Freelance & Creative Services",
    },
  ];

  const categoryServiceMap = {
    "Package Delivery": "package delivery",
    "Book a Ride": "book a ride",
  };

  const handleServiceClick = (service, isDisabled) => {
    if (isDisabled) {
      setSelectedService(service);
      setModalOpen(true);
    } else {
      // navigate("/bookings");
      // console.log("Active service clicked:", service.title);
    }
  };

  const handleCategoryClick = (category) => {
    if (category.comingSoon) return;
    const serviceValue = categoryServiceMap[category.title];
    if (serviceValue) {
      navigate(`/bookings?service=${encodeURIComponent(serviceValue)}`);
    } else {
      navigate("/bookings");
    }
  };

  useEffect(() => {
    const loadProviders = async () => {
      const data = await getAllProviders(token);
      console.log("Setting providers:", data.data);
      setProviders(data.data);
    };

    loadProviders();
  }, []);

  return (
    <DashboardLayout>
      <DashboardTour />
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold mb-3">
            {" "}
            Welcome Back, {user?.data?.fullName?.split(" ")[0]} 👋
          </h2>
          <p className="mb-3 text-sm">What would you like to get done today?</p>
        </div>
      </div>

      <div id="service-cards">
        <CategoryCarousel
          categories={categories}
          onCategoryClick={handleCategoryClick}
        />
      </div>
      <div className="mb-6 mt-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
          <h3 className="text-[20px] font-semibold mb-4">Explore Categories</h3>
        </div>
        <div id="explore-categories">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((ser, idx) => {
              const isDisabled = ser.title !== "Transport & Logistics";
              return (
                <ServicesCard
                  key={idx}
                  image={ser.image}
                  logo={ser.logo}
                  title={ser.title}
                  disabled={isDisabled}
                  onClick={() => handleServiceClick(ser, isDisabled)}
                />
              );
            })}
          </div>
        </div>

        <ComingSoonModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          service={selectedService}
        />
      </div>
      {/* <div>
        <h3 className="text-xl font-semibold mb-4">Featured Providers</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {providers?.map((pro, idx) => (
            <ProviderCard key={idx} {...pro} />
          ))}
        </div>
      </div> */}
    </DashboardLayout>
  );
}
