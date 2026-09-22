import { FleetTrendArrowIcon } from "../icons";

const TONE_CLASSES = {
  green: "text-[#005823]",
  amber: "text-amber-600",
  red: "text-red-600",
};

const VALUE_TONE_CLASSES = {
  default: "text-gray-900",
  green: "text-[#28A745]",
  red: "text-[#E90000]",
};

export default function StatTile({
  label,
  value,
  valueTone = "default",
  trendLabel,
  trendDirection = "up",
  trendTone = "green",
}) {
  const toneClass = TONE_CLASSES[trendTone] || TONE_CLASSES.green;
  const valueClass = VALUE_TONE_CLASSES[valueTone] || VALUE_TONE_CLASSES.default;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
        {label}
      </p>
      <p className={`mt-2 text-2xl font-semibold ${valueClass}`}>{value}</p>
      {trendLabel && (
        <p className={`mt-1 flex items-center gap-1 text-xs font-medium ${toneClass}`}>
          <FleetTrendArrowIcon size={13} direction={trendDirection} />
          {trendLabel}
        </p>
      )}
    </div>
  );
}
