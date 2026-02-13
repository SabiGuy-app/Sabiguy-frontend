import DashboardLayout from "../../../components/layouts/DashboardLayout";
import ProviderCard from "../../../components/dashboard/ProviderCard";
import CategoryCarousel from "../../../components/dashboard/CategoryCarousel";
import Button from "../../../components/dashboard/Button";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../stores/auth.store";
import { getAllProviders } from "../../../api/provider";
import { useState, useEffect } from "react";
import { useProviderStore } from "../../../stores/provider.store";
import {
  Home,
  Wrench,
  CircleAlert,
  Truck,
  Briefcase,
  Palette,
} from "lucide-react";
import ServicesCard from "../../../components/dashboard/ServicesCard";
import family from "../../../../public/family.png";
import delivery from "../../../../public/delivery.png";
import handtool from "../../../../public/hand-tools.png";
import siren from "../../../../public/siren.png";

import Dispatch2 from "../../../../public/Dispatch2.png";
import electrician from "../../../../public/electrician.png";
import Welding from "../../../../public/Welding.jpg";
import Household from "../../../../public/Household.jpg";
import Towing from "../../../../public/Towing.jpg";
import Legal from "../../../../public/Legal.jpg";
import Plumbing from "../../../../public/Plumbing.jpg";
import Design from "../../../../public/Design.jpg";
import { sendTestNotification } from "../../../api/fcm";
import ComingSoonModal from "../../../components/dashboard/ComingSoonModal";

export default function DashboardHome() {
  const [loading, setLoading] = useState(false);
  const { token } = useAuthStore();
  const { providers, setProviders } = useProviderStore();
  const [modalOpen, setModalOpen] = useState(false);
   const [selectedService, setSelectedService] = useState(null);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const categories = [
    {
      title: "Dispatch Riders",
      description: "Your items delivered quickly and safely",
      image: Dispatch2,
      // bgColor: "#6467F24D",
    },
    {
      title: "Electrician",
      description:
        "Professional wiring, repairs, and power solutions on demand",
      image: electrician,
      bgColor: "#BF4A0B4D",
    },
    {
      title: "Welding",
      description: "Reliable welding for repairs and fabrication",
      image: Welding,
      bgColor: "#72280080",
    },
    {
      title: "Household Support",
      description: "Quick, dependable household assistance anytime.",
      image: Household,
      bgColor: "#0054AE80",
    },
    {
      title: "Towing & Roadside",
      description: "Fast help for breakdowns and emergencies",
      image: Towing,
      bgColor: "#B100004D",
    },
    {
      title: "Legal & Financial",
      description: "Expert guidance for legal and financial needs",
      image: Legal,
      bgColor: "#4800D94D",
    },
    {
      title: "Plumbing",
      description: "Fast help for breakdowns and emergencies",
      image: Plumbing,
      bgColor: "#BF4A0B4D",
    },
    {
      title: "Digital Design",
      description: "Modern designs for web, brand, and media.",
      image: Design,
      bgColor: "#A30B4B4D",
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

    const handleServiceClick = (service, isDisabled) => {
    if (isDisabled) {
      setSelectedService(service);
      setModalOpen(true);
    } else {
      // Handle active service click (navigate or other action)
      console.log("Active service clicked:", service.title);
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
      <div className="flex flex-col  md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold mb-3">
            {" "}
            Welcome Back, {user.data?.fullName?.split(" ")[0]} 👋
          </h2>
          <p className="mb-3 text-sm">What would you like to get done today?</p>
        </div>
        {/* <div className="flex gap-3 mt-4 md:mt-0">
          <Button
            variant="secondary"
            onClick={() => navigate("/dashboard/categories")}
          >
            Browse service
          </Button>
          <Button variant="primary">Request service</Button>
          <button
            onClick={async () => {
              await testSelectProvider(
                "Hello!, THis is a test notification",
                "Test notification",
              );
            }}
          >
            Send Test Notification
          </button>
        </div> */}
      </div>

      <CategoryCarousel categories={categories} />
      <div className="mb-6 mt-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
          <h3 className="text-lg font-semibold mb-4">Explore Categories</h3>
        </div>
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
