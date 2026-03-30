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
      awaiting_job_commencement: "bg-slate-100 text-slate-700 border-slate-200",
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
  const amount = job?.agreedPrice ?? job?.calculatedPrice ?? job?.price ?? 0;
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
    <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-6 hover:shadow-lg transition-shadow">
      <div className="flex flex-col sm:flex-row items-start gap-4">
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row items-start sm:justify-between w-full sm:w-auto gap-3 sm:gap-0 mb-2">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                  {formatTitle(job?.title)}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 flex items-center gap-2">
                <span>Provider: {job?.providerName || "You"}</span>
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
              </p>
            </div>

            <div className="text-left sm:text-right w-full sm:w-auto">
              <span
                className={`inline-block max-w-[180px] truncate px-3 py-1 text-xs font-medium rounded-full border mb-2 ${getStatusStyles(
                  job?.status,
                )}`}
                title={job?.status}
              >
                {job?.status || "Pending"}
              </span>
              <div className="text-lg sm:text-2xl font-bold text-[#2D6A3E] truncate max-w-full">
                NGN {Number(amount).toLocaleString()}
              </div>
              <p className="text-xs sm:text-sm text-gray-600">
                Delivery:{" "}
                {formatTitle(job?.originalData?.scheduleType || "N/A")}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 mb-4 text-xs sm:text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#2D6A3E]" />
              <span>
                {formatDateTime(job?.createdAt || job?.originalData?.createdAt)}
              </span>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-[#E6EFE9] rounded-full flex items-center justify-center flex-shrink-0">
                <div className="w-3 h-3 bg-[#005823] rounded-full"></div>
              </div>
              <div>
                <span className="text-[#231F2080] text-xs sm:text-sm">Pickup</span>
                <p className="text-[#231F20BF] text-sm sm:text-base break-words">{pickupAddress}</p>
              </div>
            </div>

            <div className="flex items-start justify-between gap-3">
              <div className="w-8 h-8 bg-[#E6EFE9] rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin className="w-3 h-3 text-[#005823]" />
              </div>
              <div className="flex-1">
                <span className="text-[#231F2080] text-xs sm:text-sm">Dropoff</span>
                <p className="text-[#231F20BF] text-sm sm:text-base break-words">{dropoffAddress}</p>
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
                  Completed {job?.completedAt || "recently"}
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap gap-3 border-t pt-3">
            {normalizedStatus !== "completed" && (
              <button
                onClick={() => onViewDetails(job)}
                className="w-full sm:w-auto px-3 py-2 bg-[#2D6A3E] text-white rounded-lg font-medium hover:bg-[#1f4a2a] transition-colors whitespace-nowrap"
              >
                View Details
              </button>
            )}

            {normalizedStatus === "awaiting_confirmation" && (
              <button className="w-full sm:w-auto px-3 py-2 mt-3 bg-gray-100 text-black rounded-lg font-medium transition-colors whitespace-nowrap">
                Awaiting Customer's Review
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

                <p className="text-gray-500 mt-1 text-sm">
                  {job?.originalData?.rating?.review || "No review available"}
                </p>
              </div>
            )}
            {normalizedStatus === "in_progress" && (
              <button
                onClick={() => onMarkAsCompleted(job)}
                className="w-full sm:w-auto px-3 py-1 mt-3 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
              >
                Mark as Completed
              </button>
            )}

            {normalizedStatus === "pending" && (
              <button className="w-full sm:w-auto px-3 py-1 mt-3 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 whitespace-nowrap">
                En route
              </button>
            )}

            {normalizedStatus === "waiting_confirmation" && (
              <button className="w-full sm:w-auto px-2 py-1 mt-3 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 whitespace-nowrap">
                Awaiting customer's review
              </button>
            )}

            {shouldShowNavigation && (
              <button
                onClick={() => onShowNavigation?.(job)}
                className="w-full sm:w-auto px-2 py-1 mt-3 bg-white text-[#2D6A3E] border border-[#2D6A3E] rounded-lg font-medium hover:bg-[#E6EFE9] transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
              >
                Show navigation
              </button>
            )}

            {shouldShowMessageButton && (
              <button
                onClick={() => onMessageCustomer?.(job)}
                title="Message customer"
                className="w-full sm:w-auto px-2 py-1 mt-3 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 flex-shrink-0" />
                <span className="hidden sm:inline">Message</span>
              </button>
            )}
            {normalizedStatus === "awaiting_job_commencement" && (
              <button className="px-3 py-2 mt-3 bg-gray-50 text-[#DC2626] rounded-lg font-medium hover:bg-gray-200 transition-colors whitespace-nowrap">
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
