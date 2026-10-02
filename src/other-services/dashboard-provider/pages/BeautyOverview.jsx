import { Wallet, Briefcase, Star } from "lucide-react";
import BeautyDashboardLayout from "../components/layout/BeautyDashboardLayout";
import BeautyStatCard from "../components/settings/BeautyStatCard";
import BeautyRevenueOverview from "../components/settings/BeautyRevenueOverview";
import BeautyResponseTime from "../components/settings/BeautyResponseTime";
import BeautyWalletCard from "../components/settings/BeautyWalletCard";
import BeautyRevenueByService from "../components/settings/BeautyRevenueByService";
import BeautyPeakHours from "../components/settings/BeautyPeakHours";
import BeautyRecentTransactions from "../components/settings/BeautyRecentTransactions";

export default function BeautyOverview() {
  return (
    <BeautyDashboardLayout>
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-1">Welcome Back, Adam! 👋</h2>
        <p className="text-sm text-gray-600">
          Here's a quick look at your business performance today.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <BeautyStatCard
          icon={<Wallet size={20} />}
          title="Total Revenue"
          value="₦64,000"
          trend="+12.5% from last month"
          trendTone="positive"
        />
        <BeautyStatCard
          icon={<Briefcase size={20} />}
          title="Active Jobs"
          value="8"
          trend="5 Pending jobs"
          trendTone="neutral"
        />
        <BeautyStatCard
          icon={<Star size={20} />}
          title="Average Rating"
          value="4.8"
          trend="+0.5 from 156 reviews"
          trendTone="positive"
        />
      </div>

      {/* Row 1: revenue overview + wallet */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6 items-start">
        <div className="xl:col-span-2">
          <BeautyRevenueOverview />
        </div>
        <BeautyWalletCard />
      </div>

      {/* Row 2: response time + peak hours (left), revenue by service (right) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6 items-start">
        <div className="xl:col-span-2 space-y-6">
          <BeautyResponseTime />
          <BeautyPeakHours />
        </div>
        <BeautyRevenueByService />
      </div>

      {/* Row 3: recent transactions */}
      <div className="mt-6">
        <BeautyRecentTransactions />
      </div>
    </BeautyDashboardLayout>
  );
}
