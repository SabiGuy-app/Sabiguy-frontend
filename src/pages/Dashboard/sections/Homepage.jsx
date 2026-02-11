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
import { sendTestNotification } from "../../../api/fcm";

export default function DashboardHome() {
  const [loading, setLoading] = useState(false);
  const { token } = useAuthStore();
  const { providers, setProviders } = useProviderStore();

  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const categories = [
    {
      title: "Dispatch Riders",
      description: "Your items delivered quickly and safely",
      image: "/Dispatch.jpg",
      bgColor: "#6467F24D",
    },
    {
      title: "Electrician",
      description:
        "Professional wiring, repairs, and power solutions on demand",
      image: "/electrician.png",
      bgColor: "#BF4A0B4D",
    },
    {
      title: "Welding",
      description: "Reliable welding for repairs and fabrication",
      image: "/Welding.jpg",
      bgColor: "#72280080",
    },
    {
      title: "Household Support",
      description: "Quick, dependable household assistance anytime.",
      image: "/Household.jpg",
      bgColor: "#0054AE80",
    },
    {
      title: "Towing & Roadside",
      description: "Fast help for breakdowns and emergencies",
      image: "/Towing.jpg",
      bgColor: "#B100004D",
    },
    {
      title: "Legal & Financial",
      description: "Expert guidance for legal and financial needs",
      image: "/Legal.jpg",
      bgColor: "#4800D94D",
    },
    {
      title: "Plumbing",
      description: "Fast help for breakdowns and emergencies",
      image: "/Plumbing.jpg",
      bgColor: "#BF4A0B4D",
    },
    {
      title: "Digital Design",
      description: "Modern designs for web, brand, and media.",
      image: "/1dfa55619d2d73389f6ae12f9bbf64ab94447f9d.jpg",
      bgColor: "#A30B4B4D",
    },
  ];

  const services = [
    {
      logo: (
        <CircleAlert
          size={80}
          className="bg-red-50 text-red-500 rounded-full p-5 "
        />
      ),
      title: "Emergency Services",
    },
    {
      logo: (
        <Home
          size={80}
          className="bg-blue-50 text-blue-500 rounded-full p-5 "
        />
      ),
      title: "Domestic & Lifetyle",
    },
    {
      logo: (
        <Wrench
          size={80}
          className="bg-[#FF620D]/10 text-[#FF620D] rounded-full p-5 "
        />
      ),
      title: "Home & Repair",
    },
    {
      logo: (
        <Truck
          size={80}
          className="bg-[#6467F2]/10 text-[#6467F2] rounded-full p-5 "
        />
      ),
      title: "Transport & Logistics",
    },
    {
      logo: (
        <Briefcase
          size={80}
          className="bg-purple-50 text-purple-500 rounded-full p-5 "
        />
      ),
      title: "Professional Services",
    },
    {
      logo: (
        <Palette
          size={80}
          className="bg-[#E83781]/10 text-[#E83781]  rounded-full p-5 "
        />
      ),
      title: "Freelance & Creative Services",
    },
  ];

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
               
    <Button variant="secondary"
    onClick={() => navigate("/dashboard/categories")}>
      Browse service</Button>
        <Button variant="primary">Request service</Button>
<button onClick={async () => {
  await testSelectProvider('Hello!, THis is a test notification', 'Test notification');
}}>
  Send Test Notification
</button>


      </div> */}
      </div>

      <CategoryCarousel categories={categories} />
      <div className="mb-6 mt-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
          <h3 className="text-lg font-semibold mb-4">Explore Categories</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
          {services.map((ser, idx) => (
            <ServicesCard key={idx} logo={ser.logo} title={ser.title} />
          ))}
        </div>
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
