import { useMemo, useState } from "react";
import { Crown, ListFilter, MoreHorizontal } from "lucide-react";
import { formatNaira } from "../utils/format";

const FILTERS = [
  { key: "trips", label: "Trips" },
  { key: "earnings", label: "Earnings" },
  { key: "rating", label: "Ratings" },
];

export default function PerformanceScoreboard({ drivers }) {
  const [sortBy, setSortBy] = useState("trips");
  const [filterOpen, setFilterOpen] = useState(false);
  const sortedDrivers = useMemo(
    () => [...drivers].sort((a, b) => (Number(b?.[sortBy]) || 0) - (Number(a?.[sortBy]) || 0)),
    [drivers, sortBy],
  );

  return (
    <section className="overflow-visible rounded-xl border border-[#DEDADB] bg-white">
      <div className="flex items-start justify-between gap-4 px-5 py-4">
        <p className="text-sm font-semibold text-[#353132]">
          Scoreboard
          <span className="ml-2 font-normal text-[#918D8E]">
            · tap a driver for detail · min 20 trips to rank · arrows = movement
          </span>
        </p>
        <div className="relative shrink-0" data-performance-filter>
          <button
            type="button"
            onClick={() => setFilterOpen((open) => !open)}
            aria-label="Sort scoreboard"
            className="rounded-md border border-[#D6D2D3] p-2 text-[#777374] hover:bg-gray-50"
          >
            <ListFilter size={16} />
          </button>
          {filterOpen && (
            <div className="absolute right-0 top-10 z-20 w-28 rounded-md border border-[#DDDADB] bg-white py-1 shadow-lg">
              {FILTERS.map((filter) => (
                <button
                  key={filter.key}
                  type="button"
                  onClick={() => {
                    setSortBy(filter.key);
                    setFilterOpen(false);
                  }}
                  className={`block w-full px-3 py-2 text-left text-xs hover:bg-gray-50 ${
                    sortBy === filter.key ? "font-semibold text-[#2F7D55]" : "text-[#5E5A5B]"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="hidden md:block">
        <table className="w-full table-fixed text-left text-xs">
          <thead className="border-y border-[#ECEAEA] text-[#6F6B6C]">
            <tr>
              <th className="w-[36%] px-5 py-3 font-medium">Driver</th>
              <th className="w-[17%] px-3 py-3 font-medium">Trips</th>
              <th className="w-[18%] px-3 py-3 font-medium">Ratings</th>
              <th className="w-[19%] px-3 py-3 font-medium">Earnings (wk)</th>
              <th className="w-[10%] px-5 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedDrivers.map((driver, index) => (
              <tr
                key={driver.id}
                className={`border-b border-[#EEECEC] ${index === 0 ? "bg-[#F3FAF5]" : ""}`}
              >
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <span className="w-5 shrink-0 text-[#7B7778]">
                      {index === 0 ? <Crown size={16} className="fill-[#FFBF00] text-[#FFBF00]" /> : `#${index + 1}`}
                    </span>
                    <img src={driver.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="truncate font-semibold text-[#353132]">{driver.name}</span>
                        {driver.suspended && (
                          <span className="rounded-full bg-[#FFE0E0] px-2 py-0.5 text-[9px] text-[#D93025]">Suspended</span>
                        )}
                      </div>
                      <p className="text-[10px] text-[#777374]">{driver.completion}% completion</p>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3">{driver.trips}</td>
                <td className="px-3 py-3">{(Number(driver.rating) || 0).toFixed(1)}</td>
                <td className="px-3 py-3 font-semibold">{formatNaira(driver.earnings)}</td>
                <td className="px-5 py-3 text-right"><MoreHorizontal size={17} className="ml-auto" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="divide-y divide-[#EEECEC] md:hidden">
        {sortedDrivers.map((driver, index) => (
          <article key={driver.id} className={`p-4 ${index === 0 ? "bg-[#F3FAF5]" : ""}`}>
            <div className="flex items-center gap-3">
              <span className="w-5 text-xs text-[#777374]">{index === 0 ? "👑" : `#${index + 1}`}</span>
              <img src={driver.avatar} alt="" className="h-9 w-9 rounded-full" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-[#353132]">{driver.name}</p>
                <p className="text-xs text-[#777374]">{driver.completion}% completion</p>
              </div>
              <MoreHorizontal size={18} />
            </div>
            <dl className="mt-3 grid grid-cols-3 gap-3 text-xs">
              <div><dt className="text-[#918D8E]">Trips</dt><dd className="mt-1 font-semibold">{driver.trips}</dd></div>
              <div><dt className="text-[#918D8E]">Rating</dt><dd className="mt-1 font-semibold">{(Number(driver.rating) || 0).toFixed(1)}</dd></div>
              <div><dt className="text-[#918D8E]">Earnings</dt><dd className="mt-1 font-semibold">{formatNaira(driver.earnings)}</dd></div>
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}
