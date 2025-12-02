import DashboardLayout from "../../../components/layouts/DashboardLayout";
import DashboardCard from "../../../components/dashboard/DashboardCard";
import CategoryCard from "../../../components/dashboard/CategoryCard";
import ProviderCard from "../../../components/dashboard/ProviderCard";
import { Wallet, Bookmark, MessageSquare, } from "lucide-react";
import Button from "../../../components/dashboard/Button";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../stores/auth.store";
import { getAllProviders } from "../../../api/povider";
import { useState, useEffect } from "react";
import { useProviderStore } from "../../../stores/provider.store";


export default function DashboardHome() {
    const [loading, setLoading] = useState(false);
    const { token } = useAuthStore();
  const { providers, setProviders } = useProviderStore();
  

const user = useAuthStore((state) => state.user);
  const navigate = useNavigate()
    const categories = [
    { title: "Emergency", image: "/1dfa55619d2d73389f6ae12f9bbf64ab94447f9d.jpg" },
    { title: "Home & Repairs", image: "/home&repairs.jpg" },
    { title: "Domestic & Lifestyle", image: "/Domestic.jpg" },
    { title: "Transport & Logistics", image: "./Transport.jpg" },
  ];

//  const handleGetProviders= async () => {
//   setLoading(true);
//  try {
//   const providers = await getAllProviders();
//   useAuthStore.getState().
//  } catch (error) {
  
//  }

//  }

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
      <h2 className="text-2xl font-bold mb-3">  Welcome Back, {user.data?.fullName?.split(" ")[0]} 👋
</h2>
      <p className="mb-3 text-sm">Plan, prioritize, and accomplish  your task with ease.</p>
      </div>
  <div className="flex gap-3 mt-4 md:mt-0">
               
    <Button variant="secondary"
    onClick={() => navigate("/dashboard/categories")}>
      Browse service</Button>
        <Button variant="primary">Request service</Button>


      </div>
      </div>
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <DashboardCard 
        title="Wallet Balance" 
        amount="₦0.00" 
        button="Fund Wallet" 
        icon={<Wallet size={20} />} 
      />

      <DashboardCard 
        title="Bookings" 
        figure="2" 
        value="Active Requests" 
        icon={<Bookmark size={20} />} 
      />

      <DashboardCard 
        title="Chats" 
        figure="2" 
        value="New Messages" 
        icon={<MessageSquare size={20} />} 
      />
    </div> */}
     <div className="mb-6 mt-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">

        <h3 className="text-lg font-semibold mb-4"> Categories</h3>

        <button className="hover:text-[#005823] hover:underline"
        onClick={() =>navigate ("/dashboard/categories")}>
          View all
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat, idx) => (
          <CategoryCard key={idx} image={cat.image} title={cat.title} />
        ))}
        </div>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-4">Featured Providers</h3>
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {providers?.map((pro, idx) => (
            <ProviderCard key={idx} {...pro} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}