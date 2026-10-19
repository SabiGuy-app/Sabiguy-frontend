import Button from "../../../../components/button";
import { liveMapFilterOptions } from "../data/liveMapFilters";

export default function LiveMapFilters({ counts, selected, onChange }) {
  return (
    <div className="beauty-live-map-filters" role="group" aria-label="Filter staff by status">
      {liveMapFilterOptions.map((filter) => (
        <Button
          key={filter.value}
          type="button"
          variant="outline"
          size="sm"
          className="beauty-live-map-filter"
          aria-pressed={selected === filter.value}
          onClick={() => onChange(filter.value)}
        >
          {filter.label} ({counts[filter.value] ?? 0})
        </Button>
      ))}
    </div>
  );
}
