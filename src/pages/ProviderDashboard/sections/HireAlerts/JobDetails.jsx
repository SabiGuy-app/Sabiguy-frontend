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

export default function JobDetailsModal({
  isOpen,
  onClose,
  job,
  onMessageCustomer,
}) {
  const [copied, setCopied] = useState(false);

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

  return (
    <div>
      <div className="fixed inset-0 bg-gray-50  bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white sm:p-5 rounded-2xl max-w-3xl w-full max-h-[95vh] overflow-y-auto">
          {/* Header */}
          <div className="top-0 bg-white border-b border-gray-200 px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-semibold">Service Details</h2>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Service Title */}
            <div>
              <h3 className="text-lg font-semibold mb-4">
                {formatTitle(job?.title)}
              </h3>

              {/* Provider Info */}
              <div className="lg:flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={
                      job?.originalData?.userId?.profilePicture || "/avatar.png"
                    }
                    alt="Customer"
                    className="w-14 h-14 rounded-full object-cover"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[16px] sm:text-base">
                        {job?.originalData?.userId?.fullName || "Customer"}
                      </span>
                      <Verified className="w-4 h-4 text-[#2D6A3E]" />
                    </div>
                    <div>
                      {job.ratings && (
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{job.ratings}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-sm">
                      <MapPin className="w-4 h-4" />
                      <span className="font-medium">{job.location}</span>
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <span className="px-2 py-1 bg-green-100 text-xs font-medium rounded-full border border-green-200 whitespace-nowrap self-start">
                  {job.status}{" "}
                </span>
              </div>
              <div className="flex mt-3 gap-3 w-full">
                {/* <button className="flex-1 py-2 mt-3 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                  <PhoneCall className="w-4 h-4" />
                  Call
                </button> */}
                <button
                  className="flex-1 py-2 mt-3 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                  onClick={() => onMessageCustomer?.(job)}
                >
                  <MessageCircle className="w-4 h-4" />
                  Message
                </button>
              </div>
            </div>

            {/* Booking Information */}
            <div className="border-t border-gray-200">
              <h4 className="font-semibold mb-3 mt-2">Booking Information</h4>
              <div className="space-y-3">
                {/* Booking ID */}
                {job?.orderId && (
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-[#E6EFE9] rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-[#005823] text-[10px] font-bold">
                        #
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-sm font-medium text-gray-700">
                        Booking ID
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-gray-600 font-bold uppercase transition-all duration-300">
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
                    <p className="text-sm font-medium text-gray-700">
                      Service Type
                    </p>
                    <p className="text-sm text-gray-600">
                      {formatTitle(job?.title)}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-[#2D6A3E] mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Created At:
                    </p>
                    <p className="text-sm text-gray-600">
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
                        <p className="text-sm font-medium text-gray-700">
                          Scheduled Date
                        </p>
                        <p className="text-sm text-gray-600">
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
                        <p className="text-sm font-medium text-gray-700">
                          Scheduled Time
                        </p>
                        <p className="text-sm text-gray-600">
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
                  <div className="w-5 h-5 bg-[#E6EFE9] rounded-full flex items-center justify-center flex-shrink-0">
                    <div className="w-2 h-2 bg-[#005823] rounded-full" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Pickup Location
                    </p>
                    <p className="text-sm text-gray-600">
                      {job.pickupLocation.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#2D6A3E] mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Dropoff Location
                    </p>
                    <p className="text-sm text-gray-600">
                      {job.dropoffLocation.address}
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
                    <p className="text-sm font-medium text-gray-700">
                      Service Cost
                    </p>
                    <p className="text-sm m mb-3 text-gray-600">
                      ₦{(job.agreedPrice || 0).toLocaleString()}
                    </p>
                  </div>
                  <div></div>
                </div>
              </div>
            </div>

            {/* Additional Notes */}
            <div>
              <h4 className="font-semibold mb-3">Additional notes</h4>
              <div className="bg-blue-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-600 italic">
                  {job?.originalData?.pickupNote ||
                    "No additional notes provided by the customer."}
                </p>
              </div>
            </div>

            <p className="flex mt-6 items-center text-sm justify-center">
              Update the job status to keep the customer informed
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
