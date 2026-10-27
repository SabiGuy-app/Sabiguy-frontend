import { useState } from "react";
//import tunde from "../assets/tunde.png";
import BeautyDashboardLayout from "../layout/BeautyDashboardLayout";

const timeRanges = ["Last 7 days", "Last 30 days", "Last 90 days"];

// One source of truth for the rating shown in the stats row and the ratings card
const overallRating = 4.7;

const metrics = [
  { label: "Jobs completed", value: "97%", note: "7% above target", tone: "green" },
  { label: "Average response time", value: "1m 32s", note: "Healthy", tone: "blue" },
  { label: "Staff on time", value: "90%", note: "Fairly healthy", tone: "green" },
  { label: "Rating", value: overallRating.toFixed(1), note: `${overallRating.toFixed(1)} / 5`, tone: "amber" },
];

const toneText = {
  green: "text-emerald-600",
  blue: "text-blue-600",
  amber: "text-amber-500",
};

const staffLeaderboard = [
  { id: "STF-002", name: "Tunde Adeyemi",   img: "/src/assets/tunde.png", jobs: 21, rating: 4.4, onTime: 95, earnings: 3273, completion: 78 },
];

const ratingBreakdown = [
  { stars: 5, percent: 75, bar: "bg-amber-400" },
  { stars: 4, percent: 18, bar: "bg-amber-400" },
  { stars: 3, percent: 5, bar: "bg-red-500" },
  { stars: 2, percent: 1, bar: "bg-red-500" },
  { stars: 1, percent: 1, bar: "bg-slate-300" },
];

const reasonBreakdown = [
  { label: "Fully booked at that time", value: 46 },
  { label: "Outside our service area", value: 27 },
  { label: "Service not offered", value: 15 },
  { label: "Customer rebooked elsewhere", value: 12 },
];

const cardClass = "rounded-xl border border-slate-200 bg-white p-5 shadow-sm";
const tableCols = "grid grid-cols-[2.2fr_1fr_1fr_1fr_1fr] items-center gap-3";

export default function PerformanceRatingPage() {
  const [activeRange, setActiveRange] = useState(timeRanges[0]);

  return (
    <BeautyDashboardLayout>
      <div className="mx-auto w-full max-w-5xl space-y-5 p-4 sm:p-6">
        {/* Heading */}
        <header>
          <h1 className="text-2xl font-semibold text-slate-900">Performance</h1>
          <p className="mt-1 text-sm text-slate-500">
            How fast you respond, how reliable staff are, how customers rate you.
          </p>
        </header>

        {/* Range + stats */}
        <section className="space-y-4">
          <div role="group" aria-label="Performance date range" className="flex flex-wrap gap-2">
            {timeRanges.map((range) => {
              const active = activeRange === range;
              return (
                <button
                  key={range}
                  type="button"
                  onClick={() => setActiveRange(range)}
                  aria-pressed={active}
                  className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 ${
                    active
                      ? "border-emerald-700 bg-emerald-700 text-white"
                      : "border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {range}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm lg:grid-cols-4">
            {metrics.map((metric, i) => (
              <article
                key={metric.label}
                className={`p-4 ${i > 0 ? "lg:border-l lg:border-slate-200" : ""} ${
                  i % 2 === 1 ? "border-l border-slate-200 lg:border-l" : ""
                } ${i > 1 ? "border-t border-slate-200 lg:border-t-0" : ""}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">{metric.label}</span>
                  <span className={`text-sm ${toneText[metric.tone]}`} aria-hidden="true">
                    {metric.tone === "amber" ? "★" : "↗"}
                  </span>
                </div>
                <div className="mt-2">
                  <strong className="block text-2xl font-semibold text-slate-900">{metric.value}</strong>
                  <span className={`text-xs ${toneText[metric.tone]}`}>{metric.note}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Staff leaderboard */}
        <section className={cardClass}>
          <h2 className="mb-4 text-sm font-semibold text-slate-900">Staff leaderboard</h2>

          <div className="overflow-x-auto">
            <div className="min-w-[560px]">
              <div className={`${tableCols} border-b border-slate-100 px-3 pb-2 text-xs text-slate-500`}>
                <span>Staff</span>
                <span>Jobs done</span>
                <span>Rating</span>
                <span>On time</span>
                <span>Earnings (₦)</span>
              </div>

              {staffLeaderboard.map((staff, index) => (
                <div
                  key={staff.id}
                  className={`${tableCols} border-b border-slate-100 px-3 py-3 text-sm text-slate-700 last:border-b-0 ${
                    index === 0 ? "bg-emerald-50" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 text-center text-xs font-medium text-slate-500">
                      {index === 0 ? "👑" : `#${index + 1}`}
                    </span>
                   {staff.img ? (
                <img
                    src={staff.img}
                    alt={staff.name}
                    className="h-8 w-8 shrink-0 rounded-full object-cover"
                />
                ) : (
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-700">
                    {staff.name.charAt(0)}
                </span>
                )}
                    <div className="leading-tight">
                      <strong className="block text-sm font-medium text-slate-900">{staff.name}</strong>
                      <small className="text-xs text-slate-500">{staff.completion}% completion</small>
                    </div>
                  </div>
                  <span>{staff.jobs}</span>
                  <span>{staff.rating.toFixed(1)}</span>
                  <span>{staff.onTime}%</span>
                  <span>₦{staff.earnings.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Customer ratings */}
        <section className={cardClass}>
          <h2 className="mb-4 text-sm font-semibold text-slate-900">Customer ratings</h2>

          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="flex flex-col items-center sm:w-40">
              <div className="text-5xl font-semibold text-slate-900">{overallRating.toFixed(2)}</div>
              <div className="mt-2 flex gap-0.5" aria-label={`${overallRating.toFixed(2)} out of 5 stars`}>
                {Array.from({ length: 5 }, (_, i) => (
                  <span
                    key={i}
                    className={`text-lg ${i < Math.round(overallRating) ? "text-amber-400" : "text-slate-300"}`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>

            <div className="flex-1 space-y-2" aria-label="Customer rating breakdown">
              {ratingBreakdown.map((item) => (
                <div key={item.stars} className="flex items-center gap-3 text-xs text-slate-600">
                  <span className="w-6 shrink-0">{item.stars}★</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                    <span className={`block h-full rounded-full ${item.bar}`} style={{ width: `${item.percent}%` }} />
                  </div>
                  <span className="w-9 shrink-0 text-right">{item.percent}%</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Declined reasons */}
        <section className={cardClass}>
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-red-600">
            <span aria-hidden="true">⚠</span>
            Why requests got declined
          </h2>

          <div className="space-y-3">
            {reasonBreakdown.map((reason) => (
              <div
                key={reason.label}
                className="grid grid-cols-[minmax(0,1.2fr)_2fr_auto] items-center gap-3 text-xs text-slate-600"
              >
                <span className="truncate">{reason.label}</span>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <span className="block h-full rounded-full bg-emerald-700" style={{ width: `${reason.value}%` }} />
                </div>
                <strong className="w-9 text-right font-medium text-slate-900">{reason.value}%</strong>
              </div>
            ))}
          </div>
        </section>
      </div>
    </BeautyDashboardLayout>
  );
}