import { useSearchParams } from "react-router-dom";
import BeautyDashboardLayout from "../layout/BeautyDashboardLayout";
import LiveMapFilters from "../components/LiveMapFilters";
import { liveMapFilterOptions } from "../data/liveMapFilters";
import { mockBeautyLiveMapCounts } from "../data/mockBeautyLiveMap";

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
    <BeautyDashboardLayout showAvailability={false}>
      <header className="beauty-live-map-header">
        <div className="beauty-page-heading">
          <h1>Live map</h1>
          <p>Where your staff are and how each active job is going</p>
        </div>
        <LiveMapFilters
          counts={mockBeautyLiveMapCounts}
          selected={selected}
          onChange={handleFilterChange}
        />
      </header>
    </BeautyDashboardLayout>
  );
}
