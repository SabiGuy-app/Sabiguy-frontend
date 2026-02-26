import { useState, useEffect } from "react";
import ProviderDashboardLayout from "../../../components/layouts/ProviderDashboardLayout";
import DashboardCard from "../../../components/dashboard/DashboardCard";
import { Wallet, Bookmark, Star } from "lucide-react";
import RevenueOverview from "../../../components/provider-dashboard/RevenueOverview";
import AverageResponseTime from "../../../components/provider-dashboard/AverageResponseTime";
import PeakHourAnalysis from "../../../components/provider-dashboard/Analysis";
import BookingsByDayOfWeek from "../../../components/provider-dashboard/Bookings";
import WalletCard from "../../../components/provider-dashboard/WalletCard";
import RevenueByServiceType from "../../../components/provider-dashboard/RevenueByService";
import RecentTransactions from "../../../components/provider-dashboard/RecentTransactions";
import { getDashboardStats, formatCurrency } from "../../../api/provider";
import { useAuthStore } from "../../../stores/auth.store";
import { runLocationDiagnostics } from "../../../services/location";


export default function ProviderDashboard() {
  const user = useAuthStore((state) => state.user);
  const hydrated = useAuthStore((state) => state.hydrated);
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Don't render until store is hydrated
  if (!hydrated) {
    return (
      <ProviderDashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mx-auto mb-4"></div>
            <div className="h-4 w-96 bg-gray-200 rounded animate-pulse mx-auto"></div>
          </div>
        </div>
      </ProviderDashboardLayout>
    );
  }
const Job = user?.data?.job
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getDashboardStats();
        setDashboardData(response.data || response);
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
        setError(
          err.response?.data?.message || "Failed to load dashboard data",
        );
        // Set default data on error so dashboard still renders
        setDashboardData({});
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const totalRevenue = dashboardData?.totalEarnings || 0;
  const activeJobs = dashboardData?.activeBookings || 0;
  const averageRating = dashboardData?.averageRating || 0;
  return (
    <ProviderDashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold mb-3">  {" "}
            Welcome Back, {user?.data?.fullName?.split(" ")[0]} 👋</h2>
          <p className="mb-3 text-sm">
            Here's a quick look at your business performance today.
          </p>
          {/* <button 
  onClick={runLocationDiagnostics}
  className="px-4 py-2 bg-blue-500 text-white rounded"
>
  🔍 Test Location
</button> */}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard
          title="Total Revenue"
          amount={formatCurrency(totalRevenue)}
          icon={<Wallet size={20} />}
        />

        <DashboardCard
          title="Active Jobs"
          amount={activeJobs.toString()}
          icon={<Bookmark size={20} />}
        />

        <DashboardCard
          title="Average Ratings"
          amount={averageRating.toFixed(1)}
          icon={<Star size={20} />}
        />
      </div>

      <div className="grid grid-cols-1 mt-5 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <RevenueOverview data={dashboardData?.revenueData} />
          <AverageResponseTime data={dashboardData?.responseTimeData} />
        </div>

        <div className="gap-10">
          <div className="w-90">
            <WalletCard data={dashboardData?.walletData} />
          </div>
          <div className="mt-12 w-90">
            <RevenueByServiceType data={dashboardData?.revenueByService} />
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 mt-10">
        <div className="w-full lg:w-[30%] space-y-6">
          <PeakHourAnalysis data={dashboardData?.peakHoursData} />
          <BookingsByDayOfWeek data={dashboardData?.bookingsByDay} />
        </div>

        <div className="w-full lg:w-[70%] space-y-6">
          <RecentTransactions data={dashboardData?.transactions} />
        </div>
      </div>
    </ProviderDashboardLayout>
  );
}
