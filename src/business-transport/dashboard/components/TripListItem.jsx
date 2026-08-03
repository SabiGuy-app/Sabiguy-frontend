import {
  FleetArrowRightIcon,
  FleetCancelIcon,
  FleetLiveTripIcon,
  FleetStarIcon,
  FleetSuccessIcon,
} from "../icons";
import { formatNaira } from "../utils/format";

const STATUS_CONFIG = {
  completed: {
    badgeBg: "bg-green-100",
    iconColor: "text-[#28A745]",
    Icon: FleetSuccessIcon,
    rowBg: "hover:bg-gray-50",
  },
  live: {
    badgeBg: "bg-blue-100",
    iconColor: "text-[#007BFF]",
    Icon: FleetLiveTripIcon,
    rowBg: "hover:bg-gray-50",
  },
  cancelled_driver: {
    badgeBg: "bg-red-100",
    iconColor: "text-[#E90000]",
    Icon: FleetCancelIcon,
    rowBg: "bg-red-50/60 hover:bg-red-50",
  },
  cancelled_passenger: {
    badgeBg: "bg-amber-100",
    iconColor: "text-amber-600",
    Icon: FleetCancelIcon,
    rowBg: "bg-amber-50/60 hover:bg-amber-50",
  },
};

const STATUS_PILL = {
  cancelled_driver: { label: "Driver Cancelled", className: "bg-red-100 text-[#E90000]" },
  cancelled_passenger: { label: "Passenger Cancelled", className: "bg-amber-100 text-amber-700" },
};

export default function TripListItem({ trip, onClick }) {
  const config = STATUS_CONFIG[trip.status] || STATUS_CONFIG.completed;
  const { Icon } = config;
  const pill = STATUS_PILL[trip.status];

  return (
    <button
      type="button"
      onClick={() => onClick?.(trip)}
      className={`flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left transition-colors sm:px-5 ${config.rowBg}`}
    >
      <div className="flex min-w-0 items-center gap-3">
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${config.badgeBg}`}
        >
          <Icon size={16} className={config.iconColor} />
        </span>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-sm font-medium text-gray-900">
            <span>{trip.from}</span>
            <FleetArrowRightIcon size={13} className="text-gray-400" />
            <span>{trip.to}</span>
          </div>
          <p className="mt-0.5 truncate text-xs text-gray-500">
            {[trip.driver, trip.vehicleReg, trip.time, trip.duration].filter(Boolean).join(" · ")}
          </p>
        </div>
      </div>

      <div className="shrink-0 text-right">
        {pill ? (
          <span className={`rounded-full px-3 py-1 text-xs font-medium ${pill.className}`}>
            {pill.label}
          </span>
        ) : (
          <>
            {trip.fare != null && (
              <p className="text-base font-semibold text-[#28A745]">{formatNaira(trip.fare)}</p>
            )}
            {trip.rating != null && (
              <p className="mt-0.5 flex items-center justify-end gap-1 text-xs text-gray-500">
                <FleetStarIcon size={12} className="fill-amber-400 text-amber-400" />
                {trip.rating.toFixed(1)}
              </p>
            )}
          </>
        )}
      </div>
    </button>
  );
}
