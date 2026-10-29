import { Wallet, Briefcase, Star } from "lucide-react";
import ServiceDashboardLayout from "../components/layout/ServiceDashboardLayout";
import ServiceStatCard from "../components/settings/ServiceStatCard";
import ServiceRevenueOverview from "../components/settings/ServiceRevenueOverview";
import ServiceResponseTime from "../components/settings/ServiceResponseTime";
import ServiceWalletCard from "../components/settings/ServiceWalletCard";
import ServiceRevenueByService from "../components/settings/ServiceRevenueByService";
import ServicePeakHours from "../components/settings/ServicePeakHours";
import ServiceRecentTransactions from "../components/settings/ServiceRecentTransactions";

export default function ServiceOverview() {
  return (
    <ServiceDashboardLayout>
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-1">Welcome Back, Adam! 👋</h2>
        <p className="text-sm text-gray-600">
          Here's a quick look at your business performance today.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ServiceStatCard
          icon={<Wallet size={20} />}
          title="Total Revenue"
          value="₦64,000"
          trend="+12.5% from last month"
          trendTone="positive"
        />
        <ServiceStatCard
          icon={<Briefcase size={20} />}
          title="Active Jobs"
          value="8"
          trend="5 Pending jobs"
          trendTone="neutral"
        />
        <ServiceStatCard
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
          <ServiceRevenueOverview />
        </div>
        <ServiceWalletCard />
      </div>

      {/* Row 2: response time + peak hours (left), revenue by service (right) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6 items-start">
        <div className="xl:col-span-2 space-y-6">
          <ServiceResponseTime />
          <ServicePeakHours />
        </div>
        <ServiceRevenueByService />
      </div>

      {/* Row 3: recent transactions */}
      <div className="mt-6">
        <ServiceRecentTransactions />
      </div>
    </ServiceDashboardLayout>
  );
}
