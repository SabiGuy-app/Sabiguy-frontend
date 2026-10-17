import Modal from "../../../components/Modal";
import {
  FleetArrowRightIcon,
  FleetCancelIcon,
  FleetStarIcon,
  FleetSuccessIcon,
  FleetWarningIcon,
} from "../icons";
import { formatNaira } from "../utils/format";

const CANCELLATION_COPY = {
  cancelled_driver: {
    title: "Cancelled by driver",
    boxClass: "bg-red-50",
    titleClass: "text-[#E90000]",
    NoteIcon: FleetWarningIcon,
    noteClass: "text-[#E90000]",
    note: "Counts toward the driver's daily cancellation suspension policy",
  },
  cancelled_passenger: {
    title: "Cancelled by passenger",
    boxClass: "bg-amber-50",
    titleClass: "text-amber-700",
    NoteIcon: FleetSuccessIcon,
    noteClass: "text-[#28A745]",
    note: "Does not count against the driver's cancellation limit",
  },
};

const FARE_SPLIT = [
  { key: "driver", label: "Driver", pct: 63, textClass: "text-[#28A745]" },
  { key: "company", label: "Company", pct: 27, textClass: "text-purple-600" },
  { key: "platform", label: "Platform", pct: 10, textClass: "text-gray-500" },
];

function InfoRow({ label, value, valueClass = "text-gray-900" }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <span className={`font-semibold ${valueClass}`}>{value}</span>
    </div>
  );
}

function CancellationPanel({ trip }) {
  const copy = CANCELLATION_COPY[trip.status];
  const { NoteIcon } = copy;

  return (
    <div className={`rounded-xl p-4 ${copy.boxClass}`}>
      <p className={`font-semibold ${copy.titleClass}`}>{copy.title}</p>
      <p className="mt-1 text-sm text-gray-600">{trip.cancelReason}</p>
      <div className="mt-3 flex items-start gap-2">
        <NoteIcon size={15} className={`mt-0.5 shrink-0 ${copy.noteClass}`} />
        <p className={`text-xs ${copy.noteClass}`}>{copy.note}</p>
      </div>
    </div>
  );
}

function FareBreakdownPanel({ fare }) {
  return (
    <div className="rounded-xl bg-gray-50">
      <div className="border-b border-gray-200 px-4 py-2.5">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          Fare Breakdown
        </p>
      </div>
      <div className="space-y-3 px-4 py-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Total fare</span>
          <span className="text-base font-semibold text-gray-900">{formatNaira(fare)}</span>
        </div>
        {FARE_SPLIT.map((part) => (
          <div key={part.key} className="flex items-center justify-between text-sm">
            <span className={part.textClass}>
              {part.label} ({part.pct}%)
            </span>
            <span className={`font-semibold ${part.textClass}`}>
              {formatNaira(Math.round((fare * part.pct) / 100))}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TripDetailModal({ trip, onClose }) {
  if (!trip) return null;

  const isCompleted = trip.status === "completed";
  const BadgeIcon = isCompleted ? FleetSuccessIcon : FleetCancelIcon;
  const badgeBg = isCompleted ? "bg-green-100" : "bg-red-100";
  const badgeColor = isCompleted ? "text-[#28A745]" : "text-[#E90000]";

  return (
    <Modal
      isOpen
      onClose={onClose}
      panelClassName="bg-white rounded-2xl shadow-lg w-[90%] sm:w-[85%] md:w-[480px] max-h-[90vh] overflow-y-auto p-6 relative"
    >
      <div className="flex items-center gap-3">
        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${badgeBg}`}>
          <BadgeIcon size={16} className={badgeColor} />
        </span>
        <div className="flex items-center gap-1.5 text-lg font-semibold text-gray-900">
          <span>{trip.from}</span>
          <FleetArrowRightIcon size={15} className="text-gray-400" />
          <span>{trip.to}</span>
        </div>
      </div>

      <p className="mt-3 text-sm text-gray-500">
        {isCompleted ? `${trip.time} · ${trip.duration}` : trip.time}
      </p>

      <div className="mt-4 space-y-2.5">
        <InfoRow label="Driver" value={trip.driver} />
        <InfoRow label="Vehicle" value={`${trip.vehicleModel} · ${trip.vehicleReg}`} />
        <InfoRow
          label="Status"
          value={isCompleted ? "Completed" : "Cancelled"}
          valueClass={badgeColor}
        />
        {isCompleted && (
          <InfoRow
            label="Rating"
            value={
              <span className="flex items-center gap-1">
                <FleetStarIcon size={14} className="fill-amber-400 text-amber-400" />
                {trip.rating.toFixed(1)}
              </span>
            }
          />
        )}
      </div>

      <div className="mt-5">
        {isCompleted ? (
          <FareBreakdownPanel fare={trip.fare} />
        ) : (
          <CancellationPanel trip={trip} />
        )}
      </div>
    </Modal>
  );
}
