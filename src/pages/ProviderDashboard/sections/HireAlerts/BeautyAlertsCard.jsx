import { CalendarDays, MapPin, Store } from "lucide-react";
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

export default function AlertsCard({ alert, onViewDetails }) {
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

  return (
    <article className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-3 gap-y-2">
        <div className="min-w-0">
          <h3 className="break-words text-base font-semibold leading-5 text-[#231F20]">
            {alert?.title || alert?.subCategory || "Service request"}
          </h3>
          <span className="mt-1.5 inline-flex max-w-full items-center gap-1 rounded-sm bg-[#E6EFE9] px-2 py-1 text-[11px] leading-4 text-[#2D6A3E]">
            <Store className="h-3 w-3 shrink-0" />
            <span className="truncate">{servicePlace}</span>
          </span>

          <div className="mt-2 space-y-1.5 text-xs text-[#6B6B6B] sm:text-sm">
            <div className="flex min-w-0 items-start gap-1.5">
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#2D6A3E]" />
              <span className="min-w-0 break-words">{serviceAddress}</span>
            </div>
            {scheduledDate && (
              <div className="flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5 shrink-0 text-[#2D6A3E]" />
                <span>{scheduledDate}</span>
              </div>
            )}
            {distanceAndEta && (
              <div className="flex items-center gap-1.5">
                <img src={distanceIcon} alt="" className="h-3.5 w-3.5 object-contain" />
                <span>{distanceAndEta}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex min-w-[76px] flex-col items-end justify-between gap-4">
          <span className="rounded-full bg-[#005823] px-2 py-0.5 text-[10px] font-medium leading-4 text-white">
            New
          </span>
          <span className="whitespace-nowrap text-base font-bold text-[#005823] sm:text-lg">
            ₦{bookingPrice.toLocaleString("en-NG")}
          </span>
        </div>
      </div>

      <div className="mt-3 border-t border-gray-200 pt-2.5">
        <button
          type="button"
          onClick={() => onViewDetails?.(alert)}
          className="inline-flex min-h-8 items-center justify-center rounded-[4px] bg-[#2D6A3E] px-5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[#1f4a2a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2D6A3E]"
        >
          View Details
        </button>
      </div>
    </article>
  );
}
