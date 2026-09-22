import { MapPin, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AlertBanner({ message, actionLabel = "View map", actionPath }) {
  const navigate = useNavigate();

  if (!message) return null;

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-[#005823]/20 bg-[#E7F6EC] px-4 py-3 sm:px-5">
      <div className="flex items-center gap-2 min-w-0">
        <MapPin size={18} className="shrink-0 text-[#005823]" />
        <p className="truncate text-sm font-medium text-[#0B3B1E] sm:whitespace-normal">
          {message}
        </p>
      </div>

      {actionPath && (
        <button
          type="button"
          onClick={() => navigate(actionPath)}
          className="flex shrink-0 items-center gap-1.5 rounded-lg bg-[#005823] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#004019] sm:text-sm"
        >
          {actionLabel}
          <ArrowRight size={14} />
        </button>
      )}
    </div>
  );
}
