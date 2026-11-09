import {
  Calendar,
  MapPin,
  ChevronLeft,
  Star,
  MessageCircle,
  Settings,
  PhoneCall,
  Verified,
  Wrench,
  Copy,
  Check,
} from "lucide-react";
import { useState } from "react";
import { canMessage } from "../../../../utils/chat.utils";
import { useCallContext } from "../../../../components/shared/CallContext";
import CancelBookingButton from "../../../../components/CancelBookingButton";

export default function JobDetailsModal({
  isOpen,
  onClose,
  job,
  onMessageCustomer,
  onShowNavigation,
  onStartService,
  onArrive,
  onMarkAsCompleted,
  onCancel,
}) {
  const [copied, setCopied] = useState(false);
  const callContext = useCallContext();

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const formatTitle = (value) =>
    String(value || "Untitled job")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  const getLocationAddress = (location, fallback = "N/A") => {
    if (typeof location === "string") return location || fallback;
    return location?.address || location?.formattedAddress || fallback;
  };
  const pickupAddress = getLocationAddress(
    job?.pickupLocation || job?.originalData?.pickupLocation,
    getLocationAddress(
      job?.originalData?.providerId?.currentLocation,
      "Provider's current location",
    ),
  );
  const dropoffAddress = getLocationAddress(
    job?.dropoffLocation || job?.originalData?.dropoffLocation,
    getLocationAddress(job?.originalData?.location),
  );
  const serviceTitle =
    job?.title ||
    job?.originalData?.serviceDetails?.serviceName ||
    job?.originalData?.serviceType;
  const ratingValue =
    typeof job?.ratings === "object"
      ? job.ratings?.score ?? job.ratings?.average
      : job?.ratings;
  const normalizedStatus = String(
    job?.originalData?.status || job?.status || "",
  )
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");
  const pricingOption = String(
    job?.originalData?.serviceDetails?.pricingOption ||
      job?.originalData?.pricingOption ||
      "customer_address",
  )
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_");
  const needsTravel = pricingOption === "customer_address";
  const actionLabel =
    normalizedStatus === "in_progress"
      ? "Mark as Completed"
      : normalizedStatus === "arrived_at_pickup" || !needsTravel
        ? "Start Service"
        : "Arrived at Destination";
  const handleAction = () => {
    if (normalizedStatus === "in_progress") {
      onMarkAsCompleted?.(job);
    } else if (normalizedStatus === "arrived_at_pickup" || !needsTravel) {
      onStartService?.(job);
    } else if (onArrive) {
      onArrive(job);
    } else {
      onShowNavigation?.(job);
    }
  };
  if (!isOpen) return null;

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
  console.log(job);

  const bookingStatus = String(job?.originalData?.status || job?.status || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");

  const ShowCallBtn = ![
    "cancelled",
    "expired",
    "booking_expired",
    "funds_released",
    "no_provider_available",
  ].includes(bookingStatus);

  const ShowMessageBtn = ![
    "cancelled",
    "expired",
    "booking_expired",
    "funds_released",
    "no_provider_available",
  ].includes(bookingStatus);

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
      no_provider_available: "bg-red-50 text-red-700 border-red-200",
    };

    const normalized = String(status || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "_");

    return styles[normalized] || styles.pending;
  };

  return (
    <div>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-50/50 p-3 sm:p-4">
        <div className="max-h-[95vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-xl sm:p-5">
          {/* Header */}
          <div className="top-0 flex items-center justify-between border-b border-gray-200 bg-white px-3 py-3 sm:px-6 sm:py-4">
            <div className="flex min-w-0 items-center gap-3">
              <button
                onClick={onClose}
                className="rounded-full p-1 transition-colors hover:bg-gray-100"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <h2 className="text-xl font-semibold">Service Details</h2>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6 p-4 sm:p-6">
            {/* Service Title */}
            <div>
              <h3 className="mb-4 break-words text-base font-semibold sm:text-lg">
                {formatTitle(serviceTitle)}
              </h3>

              {/* Provider Info */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex min-w-0 items-center gap-3">
                  <img
                    src={
                      job?.originalData?.userId?.profilePicture || "/avatar.png"
                    }
                    alt="Customer"
                    className="h-14 w-14 rounded-full object-cover"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="break-words text-sm font-semibold sm:text-[16px]">
                        {job?.originalData?.userId?.fullName || "Customer"}
                      </span>
                      <Verified className="h-4 w-4 shrink-0 text-[#2D6A3E]" />
                    </div>
                    <div>
                      {ratingValue != null && (
                        <div className="flex items-center gap-1 text-xs sm:text-sm">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">
                            {typeof job.ratings === "object"
                              ? job.ratings.score
                              : job.ratings}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-xs sm:text-sm">
                      <MapPin className="h-4 w-4 shrink-0" />
                      <span className="break-words font-medium">
                        {getLocationAddress(
                          job?.location || job?.originalData?.location,
                          "Location unavailable",
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <span
                  className={`inline-flex h-fit w-fit self-start rounded-full border px-3 py-1 text-xs font-medium sm:ml-auto ${getStatusStyles(
                    bookingStatus,
                  )}`}
                >
                  {job?.status || "Pending"}
                </span>
              </div>

              <div className="mt-3 flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap">
                {ShowCallBtn && (
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
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 sm:flex-1 sm:min-w-0"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <PhoneCall className="h-4 w-4" />
                      Call
                    </span>
                  </button>
                )}

                {ShowMessageBtn &&
                  canMessage(job?.status || job?.originalData?.status) && (
                    <button
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 sm:flex-1 sm:min-w-0"
                      onClick={() => onMessageCustomer?.(job)}
                    >
                      <span className="flex items-center justify-center gap-2">
                        <MessageCircle className="h-4 w-4" />
                        Message
                      </span>
                    </button>
                  )}

                <CancelBookingButton
                  bookingId={
                    job?.originalData?._id ||
                    job?.originalData?.id ||
                    job?.fullBookingId ||
                    job?.bookingId
                  }
                  className="w-full rounded-lg border border-red-300 bg-white px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 sm:flex-1 sm:min-w-0"
                  role="provider"
                  status={job?.originalData?.status || job?.status}
                  paymentStatus={
                    job?.originalData?.payment?.status ||
                    job?.originalData?.paymentStatus
                  }
                  onSuccess={() => {
                    onClose?.();
                  }}
                />
              </div>
            </div>

            {/* Booking Information */}
            <div className="border-t border-gray-200">
              <h4 className="mb-3 mt-2 text-sm font-semibold sm:text-base">Booking Information</h4>
              <div className="space-y-3">
                {/* Booking ID */}
                {job?.orderId && (
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-[#E6EFE9] rounded-full flex items-center justify-center shrink-0">
                      <span className="text-[#005823] text-[10px] font-bold">
                        #
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-xs font-medium text-gray-700 sm:text-sm">
                        Booking ID
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold uppercase text-gray-600 transition-all duration-300 sm:text-sm">
                          {job.orderId}
                        </p>
                        <button
                          onClick={() => handleCopy(job.fullOrderId)}
                          className="p-1 hover:bg-gray-100 rounded transition-colors text-gray-400"
                          title="Copy Full Booking ID"
                        >
                          {copied ? (
                            <Check size={14} className="text-green-500" />
                          ) : (
                            <Copy size={14} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                {/* Start Date & Time */}
                <div className="flex items-start gap-3">
                  <Wrench className="w-5 h-5 text-[#2D6A3E] mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-gray-700 sm:text-sm">
                      Service Type
                    </p>
                    <p className="text-xs text-gray-600 sm:text-sm">
                      {formatTitle(serviceTitle)}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-[#2D6A3E] mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-gray-700 sm:text-sm">
                      Created At:
                    </p>
                    <p className="text-xs text-gray-600 sm:text-sm">
                      {formatDateTime(
                        job?.createdAt || job?.originalData?.createdAt,
                      )}
                    </p>
                  </div>
                </div>
                {(job?.scheduleType === "scheduled" ||
                  job?.originalData?.scheduleType === "scheduled") && (
                  <>
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-[#2D6A3E] mt-0.5" />
                      <div>
                        <p className="text-xs font-medium text-gray-700 sm:text-sm">
                          Scheduled Date
                        </p>
                        <p className="text-xs text-gray-600 sm:text-sm">
                          {formatDateTime(
                            job?.scheduleDate ||
                              job?.originalData?.scheduleDate,
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-[#2D6A3E] mt-0.5" />
                      <div>
                        <p className="text-xs font-medium text-gray-700 sm:text-sm">
                          Scheduled Time
                        </p>
                        <p className="text-xs text-gray-600 sm:text-sm">
                          {job?.scheduleTime ||
                            job?.originalData?.scheduleTime ||
                            "N/A"}
                        </p>
                      </div>
                    </div>
                  </>
                )}

                {/* Location */}
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-[#E6EFE9] rounded-full flex items-center justify-center shrink-0">
                    <div className="w-2 h-2 bg-[#005823] rounded-full" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-700 sm:text-sm">
                      Pickup Location
                    </p>
                    <p className="text-xs text-gray-600 sm:text-sm">
                      {pickupAddress}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#2D6A3E] mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-gray-700 sm:text-sm">
                      Dropoff Location
                    </p>
                    <p className="text-xs text-gray-600 sm:text-sm">
                      {dropoffAddress}
                    </p>
                  </div>
                </div>

                {/* Service Cost */}
                <div className="flex items-start  gap-3 border-b border-gray-200">
                  <svg
                    className="w-5 h-5 text-[#2D6A3E] mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <p className="text-xs font-medium text-gray-700 sm:text-sm">
                      Service Cost
                    </p>
                    <p className="mb-3 text-xs text-gray-600 sm:text-sm">
                      ₦{(job.agreedPrice || 0).toLocaleString()}
                    </p>
                  </div>
                  <div></div>
                </div>
              </div>
            </div>

            {/* Additional Notes */}
            <div>
              <h4 className="mb-3 text-sm font-semibold sm:text-base">Additional notes</h4>
              <div className="rounded-lg border border-gray-200 bg-blue-50 p-4">
                <p className="text-xs italic text-gray-600 sm:text-sm">
                  {job?.originalData?.pickupNote ||
                    "No additional notes provided by the customer."}
                </p>
              </div>
            </div>

            <p className="mt-6 flex items-center justify-center text-center text-xs sm:text-sm">
              Update the job status to keep the customer informed
            </p>

            {(onShowNavigation || onStartService || onArrive || onMarkAsCompleted) && (
              <button
                type="button"
                onClick={handleAction}
                className="mt-4 w-full rounded-lg bg-[#347D53] px-4 py-2.5 text-xs font-medium text-white transition-colors hover:bg-[#286642] sm:text-sm"
              >
                {actionLabel}
              </button>
            )}
            {onCancel && normalizedStatus !== "in_progress" && (
              <button
                type="button"
                onClick={() => onCancel(job)}
                className="mt-2 w-full text-right text-xs font-medium text-red-600 hover:underline"
              >
                Cancel Request
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
