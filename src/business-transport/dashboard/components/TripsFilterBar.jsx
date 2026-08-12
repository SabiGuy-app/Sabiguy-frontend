import { FleetChevronDownIcon, FleetExportIcon } from "../icons";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

export default function TripsFilterBar({
  activeFilter,
  onFilterChange,
  counts = {},
  drivers = [],
  driverFilter,
  onDriverFilterChange,
  onExport,
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        {FILTERS.map((filter) => {
          const isActive = activeFilter === filter.key;
          return (
            <button
              key={filter.key}
              type="button"
              onClick={() => onFilterChange?.(filter.key)}
              className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "border-[#005823] bg-[#005823] text-white"
                  : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              {filter.label} ({counts[filter.key] ?? 0})
            </button>
          );
        })}

        <div className="relative">
          <select
            value={driverFilter}
            onChange={(e) => onDriverFilterChange?.(e.target.value)}
            className="appearance-none rounded-lg border border-gray-200 bg-white py-2 pl-4 pr-9 text-sm font-medium text-gray-600 outline-none hover:bg-gray-50"
          >
            <option value="all">All drivers</option>
            {drivers.map((driver) => (
              <option key={driver} value={driver}>
                {driver}
              </option>
            ))}
          </select>
          <FleetChevronDownIcon
            size={14}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={onExport}
        className="flex items-center justify-center gap-1.5 rounded-lg bg-[#005823] px-4 py-2 text-sm font-semibold text-white hover:bg-[#004019]"
      >
        <FleetExportIcon size={15} />
        Export CSV
      </button>
    </div>
  );
}
