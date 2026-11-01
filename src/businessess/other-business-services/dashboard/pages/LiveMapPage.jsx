import { useSearchParams } from "react-router-dom";
import BusinessDashboardLayout from "../layout/BusinessDashboardLayout";
import LiveMapFilters from "../components/LiveMapFilters";
import { liveMapFilterOptions } from "../data/liveMapFilters";
import { mockBusinessLiveMapCounts } from "../data/mockBusinessLiveMap";

export default function LiveMapPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const status = searchParams.get("status");
  const selected = liveMapFilterOptions.some((filter) => filter.value === status) ? status : "all";

  const handleFilterChange = (value) => {
    setSearchParams((previous) => {
      const next = new URLSearchParams(previous);
      if (value === "all") next.delete("status");
      else next.set("status", value);
      return next;
    });
  };

  return (
    <BusinessDashboardLayout showAvailability={false}>
      <header className="business-live-map-header">
        <div className="business-page-heading">
          <h1>Live map</h1>
          <p>Where your staff are and how each active job is going</p>
        </div>
        <LiveMapFilters
          counts={mockBusinessLiveMapCounts}
          selected={selected}
          onChange={handleFilterChange}
        />
      </header>
    </BusinessDashboardLayout>
  );
}
