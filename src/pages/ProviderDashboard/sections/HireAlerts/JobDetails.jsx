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
      <div className="fixed inset-0 bg-gray-50  bg-opacity-50 flex items-start sm:items-center justify-center z-50 p-0 sm:p-4 overflow-hidden">
        <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-3xl overflow-y-auto max-h-[100vh] sm:max-h-[95vh]" style={{marginTop: 'auto'}}>
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="text-base sm:text-xl font-semibold">Service Details</h2>
            </div>
          </div>

          {/* Content */}
          <div className="p-3 sm:p-6 space-y-3 sm:space-y-6">
            {/* Service Title */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
                {formatTitle(job?.title)}
              </h3>

              {/* Provider Info */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-0 items-center sm:items-start">
                <div className="flex items-center gap-3">
                  <img
                    src={
                      job?.originalData?.providerId?.profilePicture ||
                      "/avatar.png"
                    }
                    alt={job.providerName}
                    className="w-14 h-14 sm:w-18 sm:h-18 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs sm:text-sm truncate">
                        {job.providerName}
                      </span>
                      <Verified className="w-4 h-4 text-[#2D6A3E] flex-shrink-0" />
                    </div>
                    <div className="flex items-center gap-1 text-xs sm:text-sm">
                      <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                      <span className="font-medium">4.6</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs sm:text-sm truncate">
                      <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span className="font-medium truncate">{job.location}</span>
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <span className="px-3 py-1 bg-green-100 text-xs sm:text-sm font-medium rounded-full border border-green-200 whitespace-nowrap">
                  {job.status}{" "}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row mt-2 sm:mt-3 gap-2 sm:gap-4">
                <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm">
                  <PhoneCall className="w-3 h-3 sm:w-4 sm:h-4" />
                  Call
                </button>
                <button
                  className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm"
                  onClick={() => onMessageCustomer?.(job)}
                >
                  <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                  Message
                </button>
                {/* <button className="px-5 py-2 mt-3 bg-white text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors flex items-center gap-2">
                  Cancel Request
                </button> */}
              </div>
            </div>

            {/* Booking Information */}
            <div className="border-t border-gray-200">
              <h4 className="font-semibold mb-2 sm:mb-3 mt-2 text-sm sm:text-base">Booking Information</h4>
              <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                {/* Booking ID */}
                {job?.orderId && (
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 bg-[#E6EFE9] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[#005823] text-[8px] sm:text-[10px] font-bold">
                        #
                      </span>
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <p className="text-xs sm:text-sm font-medium text-gray-700">
                        Booking ID
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="text-xs sm:text-sm text-gray-600 font-bold uppercase transition-all duration-300 truncate">
                          {job.orderId}
                        </p>
                        <button
                          onClick={() => handleCopy(job.fullOrderId)}
                          className="p-1 hover:bg-gray-100 rounded transition-colors text-gray-400 flex-shrink-0"
                          title="Copy Full Booking ID"
                        >
                          {copied ? (
                            <Check size={12} className="text-green-500 sm:w-[14px] sm:h-[14px]" />
                          ) : (
                            <Copy size={12} className="sm:w-[14px] sm:h-[14px]" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                {/* Start Date & Time */}
                <div className="flex items-start gap-2 sm:gap-3">
                  <Wrench className="w-4 h-4 sm:w-5 sm:h-5 text-[#2D6A3E] mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-700">
                      Service Type
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600 break-words">
                      {formatTitle(job?.title)}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2 sm:gap-3">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-[#2D6A3E] mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-700">
                      Scheduled Date
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600 break-words">
                      {formatDateTime(
                        job?.createdAt || job?.originalData?.createdAt,
                      )}
                    </p>
                  </div>
                </div>

                {/* End Date */}
                {/* <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-[#2D6A3E] mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      End Date
                    </p>
                    <p className="text-sm text-gray-600">{job.deliveryDate}</p>
                  </div>
                </div> */}

                {/* Location */}
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 bg-[#E6EFE9] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#005823] rounded-full" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-700">
                      Pickup Location
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600 break-words">
                      {job.pickupLocation.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 sm:gap-3">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-[#2D6A3E] mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-700">
                      Dropoff Location
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600 break-words">
                      {job.dropoffLocation.address}
                    </p>
                  </div>
                </div>

                {/* Service Cost */}
                <div className="flex items-start gap-2 sm:gap-3 border-b border-gray-200 pb-2 sm:pb-3">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-[#2D6A3E] mt-0.5 flex-shrink-0"
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
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-700">
                      Service Cost
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600">
                      ₦{job.agreedPrice.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Project Description */}
            {/* <div>
              <h4 className="font-semibold mb-3">Project Description</h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                Need a licensed electrician to install new wiring for a home
                office setup. This includes installation of 4 new outlets, 2
                overhead lights, and an ethernet cable run. The office is on the
                second floor. All materials will be provided, but please bring
                standard tools and safety equipment.
              </p>
            </div> */}

            {/* <div>
              <h3 className="font-semibold mb-3">Attached photos</h3>
            </div> */}

            {/* Additional Notes */}
            <div>
              <h4 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Additional notes</h4>
              <div className="bg-blue-50 border border-gray-200 rounded-lg p-2 sm:p-4">
                <p className="text-xs sm:text-sm text-gray-600 italic">
                  Please park in the driveway. The side door will be unlocked.
                </p>
              </div>
            </div>

            {/* <p className="flex mt-15 items-center  text-sm justify-center">
              Update the job status to keep the customer informed
            </p> */}
          </div>
        </div>
      </div>
    </div>
  );
}
