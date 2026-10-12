import { CalendarDays, Home } from "lucide-react";
import distanceIcon from "/distance.png";

const SERVICE_PLACE_LABELS = {
  customer_address: "Customer's Address",
  provider_address: "Provider's Address",
  walk_in: "Walk in Salon",
};

const formatScheduledDate = (booking) => {
  const dateValue = booking?.scheduleDate || booking?.startDate;
  if (!dateValue) return "";

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "";

  const dateText = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const timeText = booking?.scheduledTime ||
    date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).replace(":00", "");

  return `${dateText} - ${timeText}`;
};

const formatDistanceAndEta = (booking) => {
  const distanceValue = booking?.distance?.value ?? booking?.distanceFromPickup?.value;
  const distanceUnit = booking?.distance?.unit || "km";
  const etaValue = booking?.providerETA?.value ?? booking?.providerEta?.value;
  const parts = [];

  if (Number.isFinite(Number(distanceValue))) {
    parts.push(`${distanceValue} ${distanceUnit}`);
  }
  if (Number.isFinite(Number(etaValue))) {
    parts.push(`${etaValue} min away`);
  }

  return parts.join(" • ");
};

export default function AlertsCard({
  alert,
  onViewDetails,
  onAcceptBooking,
  onMarkAsCompleted,
  accepting = false,
  variant = "alert",
  showAction = true,
}) {
  const isJob = variant === "job";
  const booking = alert?.originalData || {};
  const pricingOption = String(
    booking?.serviceDetails?.pricingOption || booking?.pricingOption || "",
  ).toLowerCase();
  const servicePlace = SERVICE_PLACE_LABELS[pricingOption] ||
    (pricingOption ? pricingOption.replace(/_/g, " ") : "Customer's Address");
  const serviceAddress = booking?.location?.address ||
    booking?.pickupLocation?.address || alert?.location || "Address unavailable";
  const scheduledDate = formatScheduledDate(booking);
  const distanceAndEta = formatDistanceAndEta(booking);
  const bookingPrice = Number(
    booking?.agreedPrice ?? booking?.budget ?? booking?.totalAmount ?? alert?.agreedPrice ?? 0,
  );
  const rawStatus = String(booking?.status || alert?.rawStatus || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");
  const isInProgress = rawStatus === "in_progress";
  const actionLabel = !isJob
    ? "Accept Request"
    : isInProgress
      ? "Mark Completed"
      : "Open Journey";

  return (
    <article className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-3 gap-y-2">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="break-words text-base font-semibold leading-5 text-[#231F20]">
              {alert?.title || alert?.subCategory || "Service request"}
            </h3>
            {!isJob && (
              <span className="rounded-full border border-[#F4B740] bg-[#FFF8E8] px-2.5 py-1 text-[11px] font-medium text-[#E49A00]">
                Pending
              </span>
            )}
          </div>

          <div className="mt-2 space-y-1.5 text-xs text-[#6B6B6B] sm:text-sm">
            <div className="flex min-w-0 items-start gap-1.5">
              <span className="inline-flex shrink-0 items-center gap-1 rounded-sm bg-[#EAF3FF] px-1.5 py-1 text-[11px] text-[#1674E8]">
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">{servicePlace}</span>
              </span>
              <span className="min-w-0 break-words">{serviceAddress}</span>
            </div>
            {scheduledDate && (
              <div className="flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4 shrink-0 text-[#2D6A3E]" />
                <span>{scheduledDate}</span>
              </div>
            )}
            {distanceAndEta && (
              <div className="flex items-center gap-1.5">
                <img src={distanceIcon} alt="" className="h-4 w-4 object-contain" />
                <span>{distanceAndEta}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex min-w-[76px] flex-col items-end justify-between gap-4">
          <span className="rounded-full bg-[#005823] px-2 py-0.5 text-xs font-medium leading-4 text-white">
            {isJob ? alert?.status || "Active" : "New"}
          </span>
          <span className="whitespace-nowrap text-base font-bold text-[#005823] sm:text-lg">
            ₦{bookingPrice.toLocaleString("en-NG")}
          </span>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-3 border-t border-gray-200 pt-2.5">
        <button
          type="button"
          onClick={() => onViewDetails?.(alert)}
          className="inline-flex min-h-10 min-w-[182px] items-center justify-center rounded-[4px] bg-[#347D53] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#286642] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2D6A3E]"
        >
          View Details
        </button>
        {showAction && (
          <button
            type="button"
            onClick={() =>
              isInProgress
                ? onMarkAsCompleted?.(alert)
                : onAcceptBooking?.(alert)
            }
            disabled={accepting}
            className="inline-flex min-h-10 min-w-[182px] items-center justify-center rounded-[4px] border border-gray-200 bg-white px-5 py-2 text-sm font-medium text-[#555555] transition-colors hover:bg-gray-50 disabled:cursor-wait disabled:opacity-60"
          >
            {accepting ? "Accepting..." : actionLabel}
          </button>
        )}
      </div>
    </article>
  );
}
