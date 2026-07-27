import { TrendArrowIcon } from "../icons/FleetIcons";

const TONE_CLASSES = {
  green: "text-[#005823]",
  amber: "text-amber-600",
  red: "text-red-600",
};

export default function StatTile({ label, value, trendLabel, trendDirection = "up", trendTone = "green" }) {
  const toneClass = TONE_CLASSES[trendTone] || TONE_CLASSES.green;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-gray-900">{value}</p>
      {trendLabel && (
        <p className={`mt-1 flex items-center gap-1 text-xs font-medium ${toneClass}`}>
          <TrendArrowIcon size={13} direction={trendDirection} />
          {trendLabel}
        </p>
      )}
    </div>
  );
}
