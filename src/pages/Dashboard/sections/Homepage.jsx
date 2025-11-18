import DashboardLayout from "../../../components/layouts/DashboardLayout";
import DashboardCard from "../../../components/dashboard/DashboardCard";
import CategoryCard from "../../../components/dashboard/CategoryCard";
import ProviderCard from "../../../components/dashboard/ProviderCard";
import { Wallet, Bookmark, MessageSquare, } from "lucide-react";
import Button from "../../../components/dashboard/Button";

export default function DashboardHome() {
    const categories = [
    { title: "Emergency", image: "/1dfa55619d2d73389f6ae12f9bbf64ab94447f9d.jpg" },
    { title: "Home & Repairs", image: "/home&repairs.jpg" },
    { title: "Domestic & Lifestyle", image: "/Domestic.jpg" },
    { title: "Transport & Logistics", image: "./Transport.jpg" },
  ];

   const providers = [
  {
    image: "./provider.jpg",
    name: "John Doe",
    skill: "Plumber",
    rating: "4.7",
    reviews: "102",
    price: "5,000",
    location: "Ikeja, Lagos",
  },
  {
    image: "/provider.jpg",
    name: "Mary Okafor",
    skill: "Electrician",
    rating: "4.5",
    reviews: "85",
    price: "7,000",
    location: "Lekki, Lagos",
  },
  {
    image: "/provider.jpg",
    name: "James Musa",
    skill: "Driver",
    rating: "4.6",
    reviews: "98",
    price: "4,000",
    location: "Yaba, Lagos",
  },
];
  
  return (
    <DashboardLayout>
<div className="flex flex-col  md:flex-row md:items-center md:justify-between mb-6">
    <div>
      <h2 className="text-2xl font-bold mb-3">Welcome Back, Adam 👋</h2>
      <p className="mb-3 text-sm">Plan, prioritize, and accomplish  your task with ease.</p>
      </div>
  <div className="flex gap-3 mt-4 md:mt-0">
               
    <Button variant="secondary">Browse service</Button>
        <Button variant="primary">Request service</Button>


      </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <DashboardCard 
        title="Wallet Balance" 
        value="₦0.00" 
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
    </div>
     <div className="mb-6 mt-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">

        <h3 className="text-lg font-semibold mb-4"> Categories</h3>

        <button className="hover:text-[#005823] hover:underline">View all</button>
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
          {providers.map((pro, idx) => (
            <ProviderCard key={idx} {...pro} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}