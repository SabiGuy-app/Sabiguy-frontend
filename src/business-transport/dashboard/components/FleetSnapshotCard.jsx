import { useNavigate } from "react-router-dom";
import { formatNaira } from "../utils/format";
import { FleetArrowRightIcon } from "../icons";

const METRICS = [
  { key: "available", label: "Available" },
  { key: "onTrip", label: "On trip" },
  { key: "offline", label: "Offline" },
  { key: "suspended", label: "Suspended" },
  { key: "offRoad", label: "Off-road" },
];

export default function FleetSnapshotCard({ snapshot = {} }) {
  const navigate = useNavigate();

  return (
    <div className="flex h-full flex-col rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900 sm:text-lg">
          Fleet snapshot
        </h3>
        {snapshot.liveMapPath && (
          <button
            type="button"
            onClick={() => navigate(snapshot.liveMapPath)}
            className="flex items-center gap-1 text-xs font-medium text-[#005823] hover:underline sm:text-sm"
          >
            Live map
            <FleetArrowRightIcon size={13} />
          </button>
        )}
      </div>

      <div className="mt-4 grid grid-cols-5 gap-2 border-b border-gray-100 pb-4">
        {METRICS.map((metric) => (
          <div key={metric.key} className="text-center">
            <p className="text-xl font-semibold text-gray-900">
              {snapshot[metric.key] ?? 0}
            </p>
            <p className="mt-0.5 text-[10px] text-gray-500 sm:text-xs">{metric.label}</p>
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs text-gray-500 sm:text-sm">
        Today: {formatNaira(snapshot.todayEarnings)} · Completed {snapshot.completed ?? 0} ·
        Cancelled {snapshot.cancelled ?? 0} · Owed: {formatNaira(snapshot.owed)}
      </p>
    </div>
  );
}
