import {
  MapPin,
  Clock,
  Star,
  MessageCircle,
  Copy,
  Check,
  PhoneCall,
} from "lucide-react";
import { useState } from "react";
import { canMessage, canProviderCancel } from "../../utils/chat.utils";
import { useCallContext } from "../shared/CallContext";

export default function JobsCard({
  job,
  onViewDetails,
  onMarkAsCompleted,
  onRateCustomer,
  onShowNavigation,
  onMessageCustomer,
  onCancel,
}) {
  const [copied, setCopied] = useState(false);
  const callContext = useCallContext();

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const normalizedStatus = String(job?.status || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");

  const formatDateTime = (value) => {
    if (!value) return "N/A";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "N/A";
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatTitle = (value) =>
    String(value || "Untitled job")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  const getStatusStyles = (status) => {
    const styles = {
      funds_released: "bg-green-100 text-green-700 border-green-200",
      paid_escrow: "bg-yellow-100 text-[#FFC107] border-yellow-200",
      payment_pending: "bg-orange-100 text-orange-700 border-orange-200",
      active: "bg-blue-100 text-blue-600 border-blue-200",
      in_progress: "bg-blue-100 text-blue-800 border-blue-200",
      enroute_to_pickup: "bg-blue-100 text-blue-800 border-blue-200",
      enroute_to_dropoff: "bg-blue-100 text-blue-800 border-blue-200",
      arrived_at_pickup: "bg-green-100 text-green-700 border-green-200",
      arrived_at_dropoff: "bg-green-100 text-green-700 border-green-200",
      waiting_confirmation: "bg-orange-200 text-orange-800 border-orange-200",
      awaiting_confirmation: "bg-orange-200 text-orange-800 border-orange-200",
      awaiting_payment: "bg-slate-100 text-slate-700 border-slate-200",
      completed: "bg-green-100 text-green-700 border-green-200",
      cancelled: "bg-red-100 text-red-700 border-red-200",
      pending: "bg-gray-100 text-gray-700 border-gray-200",
      expired: "bg-red-100 text-red-700 border-red-200",
    };

    const normalized = String(status || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "_");
    return styles[normalized] || styles.pending;
  };

  const pickupAddress =
    job?.pickupLocation?.address ||
    job?.originalData?.pickupLocation?.address ||
    "N/A";
  const dropoffAddress =
    job?.dropoffLocation?.address ||
    job?.originalData?.dropoffLocation?.address ||
    "N/A";
  const scheduleDate = job?.scheduleDate || job?.originalData?.scheduleDate;
  const amount = job?.BookingPrice || job?.originalData?.BookingPrice || 0;
  const platformFee =
    job?.originalData?.pricingBreakdown?.driverCommission ||
    job?.originalData?.pricingBreakdown?.originalProviderCommission ||
    0;
  const riderReceives =
    job?.RiderReceives || job?.originalData?.RiderReceives || 0;
  const shouldShowNavigation =
    normalizedStatus === "paid_escrow" ||
    normalizedStatus === "in_progress" ||
    normalizedStatus === "arrived_at_dropoff" ||
    normalizedStatus === "enroute_to_dropoff" ||
    normalizedStatus === "arrived_at_pickup" ||
    normalizedStatus === "enroute_to_pickup";
  const bookingStatus = String(job?.originalData?.status || job?.status || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");
  const shouldShowMessageButton =
    bookingStatus !== "funds_released" && canMessage(bookingStatus);
  const shouldShowCancelButton = canProviderCancel(
    job?.originalData?.status || job?.status,
  );

  const rawBooking = job?.originalData || {};
  const isBeautyJob = String(rawBooking?.serviceType || "")
    .toLowerCase()
    .includes("beauty");

  if (isBeautyJob) {
    const beautyStatus = bookingStatus;
    const serviceLocation = {
      walk_in: "Walk in Salon",
      provider_address: "Provider's Address",
      customer_address: "Customer's Address",
    }[rawBooking?.serviceDetails?.pricingOption] || "";
    const bookingLocation = rawBooking?.location?.address || job?.location || "Location unavailable";
    const scheduledAt = rawBooking?.scheduledTime
      ? `${formatDateTime(rawBooking?.scheduleDate).replace(/,?\s\d{1,2}:\d{2}\s?(AM|PM)$/i, "")} - ${rawBooking.scheduledTime}`
      : formatDateTime(rawBooking?.scheduleDate || rawBooking?.startDate || job?.scheduleDate);
    const distance = rawBooking?.distance?.value != null
      ? `${rawBooking.distance.value} ${rawBooking.distance.unit || "km"}`
      : null;
    const eta = rawBooking?.providerETA?.value != null
      ? `${rawBooking.providerETA.value} min away`
      : null;
    const cardStatus = {
      paid_escrow: "Pending",
      paid_escrow_scheduled: "Pending",
      in_progress: "In Progress",
      awaiting_confirmation: "Waiting Confirmation",
      completed: "Completed",
      funds_released: "Completed",
    }[beautyStatus] || job?.status || "Pending";
    const isInProgress = beautyStatus === "in_progress";
    const canStartJourney = ["paid_escrow", "paid_escrow_scheduled", "enroute_to_pickup", "arrived_at_pickup"].includes(beautyStatus);

    return (
      <article className="rounded-[7px] border border-gray-100 bg-white px-4 py-4 shadow-sm sm:px-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-[15px] font-semibold text-[#333]">{formatTitle(rawBooking?.serviceDetails?.serviceName || job?.title)}</h3>
              <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${getStatusStyles(job?.status)}`}>{cardStatus}</span>
            </div>
            {serviceLocation && <p className="mt-1 inline-flex rounded bg-[#E8F4EC] px-2 py-0.5 text-[10px] text-[#438B66]">{serviceLocation}</p>}
            <div className="mt-2 space-y-1 text-[11px] text-[#777]">
              <p className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-[#438B66]" />{bookingLocation}</p>
              <p className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-[#438B66]" />{scheduledAt}</p>
              {(distance || eta) && <p className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 rotate-45 text-[#438B66]" />{[distance, eta].filter(Boolean).join(" · ")}</p>}
            </div>
          </div>
          <p className="shrink-0 text-right text-[17px] font-semibold text-[#176C3A]">₦{Number(rawBooking?.agreedPrice ?? rawBooking?.serviceDetails?.price ?? amount).toLocaleString()}</p>
        </div>
        <div className="mt-3 flex flex-wrap gap-2 border-t border-gray-200 pt-2">
          <button onClick={() => onViewDetails(job)} className="min-w-[100px] rounded-[3px] bg-[#438B66] px-4 py-2 text-[11px] font-medium text-white hover:bg-[#347653]">View Details</button>
          {isInProgress ? (
            <button onClick={() => onMarkAsCompleted(job)} className="rounded-[3px] bg-[#F3F3F3] px-4 py-2 text-[11px] font-medium text-[#555] hover:bg-gray-200">Mark as Completed</button>
          ) : canStartJourney ? (
            <button onClick={() => onShowNavigation?.(job)} className="rounded-[3px] border border-gray-200 px-4 py-2 text-[11px] font-medium text-[#555] hover:bg-gray-50">{rawBooking?.serviceDetails?.pricingOption === "customer_address" ? "En Route" : "Start Service"}</button>
          ) : ["funds_released", "user_accepted_completion"].includes(beautyStatus) ? (
            <button onClick={() => onRateCustomer?.(job)} className="rounded-[3px] border border-gray-200 px-4 py-2 text-[11px] font-medium text-[#555] hover:bg-gray-50">Rate Customer</button>
          ) : null}
        </div>
        {["completed", "funds_released", "awaiting_confirmation"].includes(beautyStatus) && rawBooking?.rating?.score > 0 && (
          <div className="mt-3 border-t border-gray-100 bg-[#FAFAFA] px-3 py-2">
            <div className="flex items-center gap-0.5 text-[#F3B400]" aria-label={`${rawBooking.rating.score} out of 5 stars`}>
              {Array.from({ length: 5 }, (_, index) => <span key={index} className={index < Math.round(rawBooking.rating.score) ? "opacity-100" : "opacity-30"}>★</span>)}
              <span className="ml-1 text-[10px] font-semibold text-[#333]">{Number(rawBooking.rating.score).toFixed(1)}</span>
            </div>
            {rawBooking.rating.review && <p className="mt-0.5 line-clamp-2 text-[10px] text-[#666]">{rawBooking.rating.review}</p>}
          </div>
        )}
      </article>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-lg transition-shadow">
      <div className="flex flex-col sm:flex-row items-start gap-4">
        <div className="flex-1 w-full">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px] items-start">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-semibold text-gray-900">
                  {formatTitle(job?.title)}
                </h3>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                <span className="font-medium">
                  User: {job?.originalData?.userId?.fullName || "Customer"}
                </span>
                {job?.orderId && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-gray-500">
                      #{job.orderId}
                    </span>
                    <button
                      onClick={() => handleCopy(job.fullOrderId)}
                      className="p-1 hover:bg-gray-100 rounded transition-colors text-gray-400"
                    >
                      {copied ? (
                        <Check size={12} className="text-green-500" />
                      ) : (
                        <Copy size={12} />
                      )}
                    </button>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#2D6A3E]" />
                  <span>
                    {formatDateTime(
                      job?.createdAt || job?.originalData?.createdAt,
                    )}
                  </span>
                </div>
                <span className="inline-flex items-center rounded-full bg-[#E6EFE9] px-3 py-1 text-xs font-medium text-[#2D6A3E]">
                  Delivery:{" "}
                  {formatTitle(
                    job?.scheduleType ||
                      job?.originalData?.scheduleType ||
                      "N/A",
                  )}
                </span>
                {scheduleDate && (
                  <span className="inline-flex items-center rounded-full bg-[#E6EFE9] px-3 py-1 text-xs font-medium text-[#2D6A3E]">
                    Schedule: {formatDateTime(scheduleDate)}
                  </span>
                )}
              </div>

              <div className="relative pl-0 pt-2">
                <div className="absolute left-4 top-[16px] bottom-[16px] w-[1.5px] bg-[#00582326] z-0" />

                <div className="flex items-start gap-4 mb-4 relative z-10">
                  <div className="w-8 h-8 bg-[#E6EFE9] rounded-full flex items-center justify-center flex-shrink-0 shadow-sm border border-[#0058231A]">
                    <div className="w-2.5 h-2.5 bg-[#005823] rounded-full shadow-inner" />
                  </div>
                  <div className="flex-1 mt-0.5">
                    <span className="text-[#231F2080] text-xs font-bold uppercase tracking-wider">
                      Pickup
                    </span>
                    <p className="text-[#231F20BF] text-base sm:text-[17px] font-medium leading-snug">
                      {pickupAddress}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 relative z-10">
                  <div className="w-8 h-8 bg-[#E6EFE9] rounded-full flex items-center justify-center flex-shrink-0 shadow-sm border border-[#0058231A]">
                    <MapPin className="w-3.5 h-3.5 text-[#005823]" />
                  </div>
                  <div className="flex-1 mt-0.5">
                    <span className="text-[#231F2080] text-xs font-bold uppercase tracking-wider">
                      Dropoff
                    </span>
                    <p className="text-[#231F20BF] text-base sm:text-[17px] font-medium leading-snug">
                      {dropoffAddress}
                    </p>
                  </div>
                </div>
              </div>

              {normalizedStatus === "in_progress" && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-yellow-500" />
                  <span className="font-medium">
                    Est. Completion: {job?.est_completion || "N/A"}
                  </span>
                </div>
              )}

              {normalizedStatus === "pending" && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-yellow-500" />
                  <span className="font-medium">
                    Starts in: {job?.startsIn || "N/A"}
                  </span>
                </div>
              )}

              {(normalizedStatus === "waiting_confirmation" ||
                normalizedStatus === "completed" ||
                normalizedStatus === "awaiting_confirmation") && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-yellow-500" />
                  <span className="font-medium">
                    Job Completed On:{" "}
                    {formatDateTime(
                      job?.completedAt || job?.originalData?.completedAt,
                    )}
                  </span>
                </div>
              )}
            </div>

            <div className="w-full rounded-2xl border border-green-100 bg-gradient-to-br from-[#F8FCF9] to-white p-4 shadow-sm lg:w-1/4 lg:min-w-[260px]">
              <div className="flex flex-col gap-3 sm:text-right">
                <span
                  className={`inline-flex w-fit px-3 py-1 text-xs font-medium rounded-full border h-fit sm:ml-auto ${getStatusStyles(
                    job?.status,
                  )}`}
                >
                  {job?.status || "Pending"}
                </span>

                <div className="space-y-2">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
                    <span className="text-[11px] uppercase tracking-wide text-gray-500">
                      Booking Price
                    </span>
                    <span className="text-xl sm:text-2xl font-bold text-[#2D6A3E] leading-none">
                      ₦{Number(amount).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
                    <span className="text-[11px] uppercase tracking-wide text-gray-500">
                      Platform Fee
                    </span>
                    <span className="text-lg sm:text-xl font-semibold text-[#2D6A3E] leading-none">
                      ₦{Number(platformFee).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
                    <span className="text-[11px] uppercase tracking-wide text-gray-500">
                      Rider Receives
                    </span>
                    <span className="text-lg sm:text-xl font-semibold text-[#2D6A3E] leading-none">
                      ₦{Number(riderReceives).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-3 border-t pt-3 mt-2">
            {normalizedStatus !== "completed" && (
              <button
                onClick={() => onViewDetails(job)}
                className="flex-1 sm:flex-none px-4 py-2.5 sm:py-2 bg-[#2D6A3E] text-white rounded-lg font-semibold hover:bg-[#1f4a2a] transition-all text-sm active:scale-95"
              >
                View Details
              </button>
            )}

            {normalizedStatus === "awaiting_confirmation" && (
              <button className="flex-1 sm:flex-none px-4 py-2.5 sm:py-2 bg-gray-100 text-black rounded-lg font-semibold transition-all text-sm">
                Awaiting Review
              </button>
            )}

            {normalizedStatus === "completed" && (
              <div className="mt-3">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < (job?.originalData?.rating?.score || 0)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>

                <p className="text-gray-500 mt-1 text-sm font-medium">
                  {job?.originalData?.rating?.review || "No review available"}
                </p>
              </div>
            )}

            {normalizedStatus === "in_progress" && (
              <button
                onClick={() => onMarkAsCompleted(job)}
                className="flex-1 sm:flex-none px-4 py-2.5 sm:py-2 bg-white text-gray-700 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-all flex items-center justify-center gap-2 text-sm active:scale-95"
              >
                Mark Completed
              </button>
            )}

            {normalizedStatus === "pending" && (
              <button className="flex-1 sm:flex-none px-4 py-2.5 sm:py-2 bg-white text-gray-700 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-all flex items-center justify-center gap-2 text-sm">
                En route
              </button>
            )}

            {normalizedStatus === "waiting_confirmation" && (
              <button className="flex-1 sm:flex-none px-4 py-2.5 sm:py-2 bg-white text-gray-700 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-all flex items-center justify-center gap-2 text-sm">
                Awaiting review
              </button>
            )}

            {shouldShowNavigation && (
              <button
                onClick={() => onShowNavigation?.(job)}
                className="flex-1 sm:flex-none px-4 py-2.5 sm:py-2 bg-white text-[#2D6A3E] border border-[#2D6A3E] rounded-lg font-semibold hover:bg-[#E6EFE9] transition-all flex items-center justify-center gap-2 text-sm active:scale-95"
              >
                Navigation
              </button>
            )}

            {shouldShowMessageButton && (
              <button
                onClick={() => onMessageCustomer?.(job)}
                className="px-4 py-2.5 sm:py-2 bg-white text-gray-700 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-all flex items-center justify-center gap-2 text-sm active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                Message Customer
              </button>
            )}

            <button
              onClick={() =>
                callContext?.openCall?.({
                  booking: job?.originalData || job,
                  targetOverride: {
                    targetId:
                      job?.originalData?.userId?._id ||
                      job?.originalData?.userId ||
                      job?.userId?._id ||
                      job?.userId,
                    targetType: "buyer",
                    targetName:
                      job?.originalData?.userId?.fullName ||
                      job?.originalData?.customerName ||
                      "Customer",
                  },
                })
              }
              className="px-4 py-2.5 sm:py-2 bg-white text-gray-700 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-all flex items-center justify-center gap-2 text-sm active:scale-95"
            >
              <PhoneCall className="w-4 h-4" />
              Call Customer
            </button>

            {shouldShowCancelButton && (
              <button
                onClick={() => onCancel?.(job)}
                className="flex-1 sm:flex-none px-4 py-2.5 sm:py-2 bg-gray-50 text-[#DC2626] rounded-lg font-semibold hover:bg-gray-200 transition-all text-sm active:scale-95"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
