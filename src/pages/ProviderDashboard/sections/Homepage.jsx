import { useState, useEffect } from "react";
import ProviderDashboardLayout from "../../../components/layouts/ProviderDashboardLayout";
import DashboardCard from "../../../components/dashboard/DashboardCard";
import { Wallet, Bookmark, Star, CheckCircle } from "lucide-react";
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

  // ── Fetch dashboard stats ──────────────────────────────────────────────
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getDashboardStats();

        // Confirmed API shape (flat object inside data):
        // {
        //   totalEarnings, activeBookings, completedBookings,
        //   revenueOverview: { total, last7Days, last30Days },
        //   averageResponseTimeMinutes: <number>,
        //   bookingsByDayOfWeek: [{ day, dayIndex, count }],
        //   peakHourAnalysis: { peakHour, peakHourCount, buckets: [{ hour, count }] }
        // }
        const raw = response?.data || response;

        setDashboardData({
          // Stat cards
          totalEarnings:     raw?.totalEarnings     ?? 0,
          activeBookings:    raw?.activeBookings     ?? 0,
          completedBookings: raw?.completedBookings  ?? 0,

          // Revenue Overview — pass object { last7Days, last30Days, total }
          revenueData: raw?.revenueOverview
            ? {
                last7Days:  raw.revenueOverview.last7Days  || 0,
                last30Days: raw.revenueOverview.last30Days || 0,
                total:      raw.revenueOverview.total      || 0,
              }
            : null,

          // Average Response Time — raw number in minutes
          responseTimeData: raw?.averageResponseTimeMinutes ?? null,

          // Bookings by Day — normalise to { day, bookings }
          bookingsByDay: (raw?.bookingsByDayOfWeek || []).map((d) => ({
            day:      (d.day || "").slice(0, 3),
            bookings: d.count ?? d.bookings ?? 0,
          })),

          // Peak Hour Analysis — pass buckets [{ hour, count }]
          peakHoursData: (raw?.peakHourAnalysis?.buckets || []).map((b) => ({
            hour:     b.hour,
            bookings: b.count ?? b.bookings ?? 0,
          })),

          // Revenue by Service — not in API yet, shows empty state
          revenueByService: raw?.revenueByService || [],
        });
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
        setError(err.response?.data?.message || "Failed to load dashboard data");
        setDashboardData({});
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  // ── Guard: wait for zustand hydration ─────────────────────────────────
  // NOTE: this must come AFTER all hooks (useEffect above)
  if (!hydrated) {
    return (
      <ProviderDashboardLayout>
        <main className="flex-1 min-h-screen p-3 sm:p-6 pt-4 sm:pt-20 w-full">
          <div className="text-center">
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mx-auto mb-4"></div>
            <div className="h-4 w-96 bg-gray-200 rounded animate-pulse mx-auto"></div>
          </div>
        </main>
      </ProviderDashboardLayout>
    );
  }

  const Job = user?.data?.job;
  const totalRevenue  = dashboardData?.totalEarnings     || 0;
  const activeJobs    = dashboardData?.activeBookings     || 0;
  const completedJobs = dashboardData?.completedBookings  || 0;

  return (
    <ProviderDashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold mb-1">
            Welcome Back, {user?.data?.fullName?.split(" ")[0]} 👋</h2>
          <p className="mb-2 text-sm">
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
          title="Completed Jobs"
          amount={completedJobs.toString()}
          icon={<CheckCircle size={20} />}
        />
      </div>

      <div className="grid grid-cols-1 mt-5 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <div className="md:col-span-1 lg:col-span-1 xl:col-span-2 space-y-6">
          <RevenueOverview data={dashboardData?.revenueData} />
          <AverageResponseTime data={dashboardData?.responseTimeData} />
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <WalletCard data={dashboardData?.walletData} />
          </div>
          <div>
            <RevenueByServiceType data={dashboardData?.revenueByService} amount={completedJobs.toString()} />
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
