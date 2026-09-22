import FleetDashboardLayout from "../layout/FleetDashboardLayout";
import AlertBanner from "../components/AlertBanner";
import StatTileRow from "../components/StatTileRow";
import EarningsBarChart from "../components/EarningsBarChart";
import FleetSnapshotCard from "../components/FleetSnapshotCard";
import LiveActivityFeed from "../components/LiveActivityFeed";
import { mockFleetOverview } from "../data/mockFleetOverview";


export default function FleetOverview() {
  const { business, alert, stats, earnings7Day, earningsSummary, fleetSnapshot, activities } =
    mockFleetOverview;

  return (
    <FleetDashboardLayout>
      <div className="mb-5">
        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">Fleet Overview</h1>
        <p className="mt-1 text-sm text-gray-500">
          {business.name} · {business.mode} · {business.policyNote}
        </p>
      </div>

      <div className="space-y-5">
        <AlertBanner
          message={alert.message}
          actionLabel={alert.actionLabel}
          actionPath={alert.actionPath}
        />

        <StatTileRow stats={stats} />

        <EarningsBarChart data={earnings7Day} summary={earningsSummary} />

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <FleetSnapshotCard snapshot={fleetSnapshot} />
          <LiveActivityFeed activities={activities} />
        </div>
      </div>
    </FleetDashboardLayout>
  );
}
