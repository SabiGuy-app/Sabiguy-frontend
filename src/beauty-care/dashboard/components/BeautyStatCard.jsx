import { FiTrendingUp } from "react-icons/fi";

// Top stat card (Total Revenue / Active Jobs / Average Rating).
// Presentational only — all values come from the caller as demo data.
export default function BeautyStatCard({
  icon,
  title,
  value,
  trend,
  trendTone = "positive",
}) {
  const toneClass = trendTone === "positive" ? "text-green-600" : "text-gray-500";

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-2 text-gray-700">
        <span className="text-[#005823]">{icon}</span>
        <h3 className="text-sm font-medium">{title}</h3>
      </div>
      <p className="border-b border-gray-200 mb-3" />
      <p className="text-2xl font-bold text-gray-900 mb-3">{value}</p>
      {trend && (
        <div className={`flex items-center gap-1 text-xs ${toneClass}`}>
          {trendTone === "positive" && <FiTrendingUp size={14} />}
          <span>{trend}</span>
        </div>
      )}
    </div>
  );
}
