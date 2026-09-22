import { useState } from "react";
import FleetDashboardLayout from "../layout/FleetDashboardLayout";
import PerformanceTargets from "../components/PerformanceTargets";
import PerformanceScoreboard from "../components/PerformanceScoreboard";
import PerformanceQuality from "../components/PerformanceQuality";
import EditPerformanceTargetsModal from "../components/EditPerformanceTargetsModal";
import { mockPerformance } from "../data/mockPerformance";

export default function Performance() {
  const [targets, setTargets] = useState(mockPerformance.targets);
  const [editTargetsOpen, setEditTargetsOpen] = useState(false);

  const saveTargets = (values) => {
    setTargets((current) =>
      current.map((target) => ({
        ...target,
        target: values[target.key],
        display:
          target.key === "trips"
            ? `${target.current}/${values.trips}`
            : target.key === "earnings"
              ? `₦${target.current.toLocaleString()} / ₦${values.earnings.toLocaleString()}`
              : `${target.current} / ${values.rating} ⭐`,
      })),
    );
    setEditTargetsOpen(false);
  };

  return (
    <FleetDashboardLayout>
      <header className="mb-5 sm:mb-6">
        <h1 className="text-2xl font-semibold tracking-[-0.02em] text-[#231F20] sm:text-[26px]">Performance</h1>
        <p className="mt-2 text-sm text-[#656263] sm:text-base">
          Productivity, quality, and targets — one view, updating live
        </p>
      </header>

      <div className="space-y-5">
        <section>
          <div className="mb-3 flex items-center justify-between gap-4">
            <h2 className="text-sm font-semibold text-[#353132]">Weekly fleet targets</h2>
            <button
              type="button"
              onClick={() => setEditTargetsOpen(true)}
              className="rounded-md bg-[#2F7D55] px-4 py-2 text-xs font-medium text-white hover:bg-[#256846]"
            >
              Edit Targets
            </button>
          </div>
          <PerformanceTargets targets={targets} />
        </section>

        <PerformanceScoreboard drivers={mockPerformance.drivers} />
        <PerformanceQuality quality={mockPerformance.quality} />
      </div>

      <EditPerformanceTargetsModal
        isOpen={editTargetsOpen}
        targets={targets}
        onClose={() => setEditTargetsOpen(false)}
        onSave={saveTargets}
      />
    </FleetDashboardLayout>
  );
}
