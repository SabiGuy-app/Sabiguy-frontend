import ProviderDashboardLayout from "../../../components/layouts/ProviderDashboardLayout";
import DashboardCard from "../../../components/dashboard/DashboardCard";
import { Wallet, Bookmark, Star, Wallet2Icon } from "lucide-react";
import RevenueOverview from "../../../components/provider-dashboard/RevenueOverview";
import AverageResponseTime from "../../../components/provider-dashboard/AverageResponseTime";
import PeakHourAnalysis from "../../../components/provider-dashboard/Analysis";
import BookingsByDayOfWeek from "../../../components/provider-dashboard/Bookings";
import WalletCard from "../../../components/provider-dashboard/WalletCard";
import RevenueByServiceType from "../../../components/provider-dashboard/RevenueByService";
import RecentTransactions from "../../../components/provider-dashboard/RecentTransactions";
import { useAuthStore } from "../../../stores/auth.store";
import { useState, useEffect } from "react";


export default function ProviderDashboard () {
   const user = useAuthStore((state) => state.user);

 


    return (
        <ProviderDashboardLayout>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
      <h2 className="text-lg font-semibold mb-3">Welcome Back, {user.data?.fullName?.split(" ")[0]} 👋</h2>
                    <p className="mb-3 text-sm">Here's a quick look at your business performance today.</p>
                </div>
                </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard
          title="Total Revenue"
          amount="₦0.00"
          icon={<Wallet size={20} />}
        />

        <DashboardCard
          title="Active Jobs"
          amount="2"
          icon={<Bookmark size={20} />}
        />

        <DashboardCard
          title="Average Ratings"
          amount="2"
          icon={<Star size={20} />}
        />
      </div>
      <div className="grid grid-cols-1 mt-5 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <RevenueOverview />
          <AverageResponseTime />
        </div>

        <div className="gap-10">
          <div className="w-90 ">
            {" "}
            <WalletCard />
          </div>{" "}
          <div className="mt-12 w-90">
            <RevenueByServiceType />
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 mt-10">
        <div className="w-full lg:w-[30%] space-y-6">
          <PeakHourAnalysis />
          <BookingsByDayOfWeek />
        </div>

        <div className="w-full lg:w-[70%] space-y-6">
          <RecentTransactions />
        </div>
      </div>
    </ProviderDashboardLayout>
  );
}
