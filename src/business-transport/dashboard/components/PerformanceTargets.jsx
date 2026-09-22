const TONE_CLASSES = {
  amber: "bg-[#E7B900]",
  green: "bg-[#13A853]",
};

export default function PerformanceTargets({ targets }) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
      {targets.map((target) => {
        const current = Number(target.current) || 0;
        const goal = Number(target.target) || 0;
        const percentage = goal > 0 ? Math.min(100, Math.round((current / goal) * 100)) : 0;
        return (
          <article key={target.key} className="rounded-xl border border-[#E8E5E6] bg-white p-4">
            <div className="flex items-center justify-between text-xs text-[#777374]">
              <span>{target.label}</span>
              <span className="font-semibold text-[#3D393A]">{percentage}%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#E9E9E9]">
              <div
                className={`h-full rounded-full ${TONE_CLASSES[target.tone]}`}
                style={{ width: `${percentage}%` }}
              />
            </div>
            <p className="mt-2 text-xs font-semibold text-[#3D393A]">{target.display}</p>
          </article>
        );
      })}
    </div>
  );
}
