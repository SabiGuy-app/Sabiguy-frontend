import { Calendar, MapPin, Clock, Star, MessageCircle, Copy, Check } from "lucide-react";
import { useState } from "react";

// Reusable Request Card Component
export default function JobsCard({
  job,
  onViewDetails,
  onMarkAsCompleted,
  onShowNavigation,
  onMessageCustomer,
}) {
  const [copied, setCopied] = useState(false);

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
  const amount = job?.price || job?.originalData?.price || 0;
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
  const shouldShowMessageButton = [
    "paid_escrow",
    "in_progress",
    "arrived_at_pickup",
    "enroute_to_dropoff",
    "arrived_at_dropoff",
  ].includes(bookingStatus);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-lg transition-shadow">
      <div className="flex flex-col sm:flex-row items-start gap-4">
        <div className="flex-1 w-full">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-xl font-semibold text-gray-900">
                  {formatTitle(job?.title)}
                </h3>
              </div>
              <div className="text-sm text-gray-600 flex items-center gap-2">
                <span>User: {job?.originalData?.userId?.fullName || "Customer"}</span>
                {job?.orderId && (
                  <div className="flex items-center gap-1.5 ml-2">
                    <span className="text-xs font-bold text-gray-500">#{job.orderId}</span>
                    <button
                      onClick={() => handleCopy(job.fullOrderId)}
                      className="p-1 hover:bg-gray-100 rounded transition-colors text-gray-400"
                    >
                      {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="sm:text-right w-full sm:w-auto flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2">
              <span
                className={`px-3 py-1 text-xs font-medium rounded-full border h-fit ${getStatusStyles(
                  job?.status,
                )}`}
              >
                {job?.status || "Pending"}
              </span>
              <div className="text-xl sm:text-2xl font-bold text-[#2D6A3E]">
                ₦{Number(amount).toLocaleString()}
              </div>
              <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">
                Delivery:{" "}
                {formatTitle(job?.originalData?.scheduleType || "N/A")}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 mb-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#2D6A3E]" />
              <span>
                {formatDateTime(job?.createdAt || job?.originalData?.createdAt)}
              </span>
            </div>

            {/* Pickup and Dropoff Section with Connecting Line */}
            <div className="relative mt-2 mb-4">
              {/* Vertical Connecting Line */}
              <div className="absolute left-[15px] top-[16px] bottom-[16px] w-[1.5px] bg-[#00582326] z-0"></div>

              {/* Pickup Row */}
              <div className="flex items-start gap-4 mb-4 relative z-10">
                <div className="w-8 h-8 bg-[#E6EFE9] rounded-full flex items-center justify-center flex-shrink-0 shadow-sm border border-[#0058231A]">
                  <div className="w-2.5 h-2.5 bg-[#005823] rounded-full shadow-inner"></div>
                </div>
                <div className="flex-1 mt-0.5">
                  <span className="text-[#231F2080] text-xs font-bold uppercase tracking-wider">Pickup</span>
                  <p className="text-[#231F20BF] text-base sm:text-[17px] font-medium leading-snug">
                    {pickupAddress}
                  </p>
                </div>
              </div>

              {/* Dropoff Row */}
              <div className="flex items-start gap-4 relative z-10">
                <div className="w-8 h-8 bg-[#E6EFE9] rounded-full flex items-center justify-center flex-shrink-0 shadow-sm border border-[#0058231A]">
                  <MapPin className="w-3.5 h-3.5 text-[#005823]" />
                </div>
                <div className="flex-1 mt-0.5">
                  <span className="text-[#231F2080] text-xs font-bold uppercase tracking-wider">Dropoff</span>
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
                   Job Completed On: {formatDateTime(job?.completedAt || job?.originalData?.completedAt)}
                </span>
              </div>
            )}
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
            {normalizedStatus === "awaiting_payment" && (
              <button className="flex-1 sm:flex-none px-4 py-2.5 sm:py-2 bg-gray-50 text-[#DC2626] rounded-lg font-semibold hover:bg-gray-200 transition-all text-sm active:scale-95">
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
