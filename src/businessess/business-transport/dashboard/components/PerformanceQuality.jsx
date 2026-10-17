import { AlertTriangle } from "lucide-react";

export default function PerformanceQuality({ quality }) {
  const distribution = Array.isArray(quality?.distribution) ? quality.distribution : [];
  const alerts = Array.isArray(quality?.alerts) ? quality.alerts : [];
  const maxCount = Math.max(...distribution.map((item) => Number(item.count) || 0), 1);

  return (
    <section className="overflow-hidden rounded-xl border border-[#DEDADB] bg-white">
      <div className="flex items-center justify-between border-b border-[#EEECEC] px-5 py-4">
        <p className="text-sm font-semibold text-[#353132]">
          Quality <span className="font-normal text-[#918D8E]">· Fleet average · live</span>
        </p>
        <span className="text-[10px] text-[#918D8E]">Based on {quality.reviewCount} recent trips</span>
      </div>

      <div className="grid gap-6 px-5 py-6 md:grid-cols-[160px_1fr] md:items-center">
        <div>
          <p className="text-5xl font-bold tracking-tight text-[#231F20]">{(Number(quality?.average) || 0).toFixed(2)}</p>
          <p className="mt-3 tracking-[0.18em] text-[#FFB800]">★ ★ ★ ★ ★</p>
        </div>
        <div className="space-y-2">
          {distribution.map((item) => (
            <div key={item.stars} className="grid grid-cols-[28px_1fr_22px] items-center gap-2 text-xs">
              <span className="text-right text-[#5F5B5C]">{item.stars}<span className="text-[#FFB800]">★</span></span>
              <div className="h-2 overflow-hidden rounded-full bg-[#E8E8E8]">
                <div
                  className={`h-full rounded-full ${item.stars >= 4 ? "bg-[#F4B900]" : "bg-[#E01515]"}`}
                  style={{ width: `${(item.count / maxCount) * 100}%` }}
                />
              </div>
              <span className="text-[#5F5B5C]">{item.count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-[#EEECEC] px-5 py-4">
        <p className="flex items-center gap-2 text-xs font-semibold text-[#C7473E]">
          <AlertTriangle size={14} className="fill-[#FFB800] text-[#D58D00]" />
          Low-rating alerts (below 4.0)
        </p>
      </div>
      <div className="divide-y divide-[#EEECEC] border-t border-[#EEECEC]">
        {alerts.map((alert) => (
          <div key={alert.id} className="flex flex-wrap items-center gap-3 px-5 py-3 text-xs">
            <span className="font-semibold text-[#E13535]">{alert.rating}★</span>
            <img src={alert.avatar} alt="" className="h-8 w-8 rounded-full" />
            <p className="min-w-0 flex-1 text-[#5E5A5B]">
              <span className="font-semibold text-[#353132]">{alert.driver}</span> · {alert.route}
            </p>
            <span className="text-[#918D8E]">{alert.time}</span>
            <button type="button" className="rounded-md border border-[#72AE8A] px-3 py-1.5 font-medium text-[#2F7D55] hover:bg-[#F3FAF5]">
              Contact Driver
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
