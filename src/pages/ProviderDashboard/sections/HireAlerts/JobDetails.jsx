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
} from "lucide-react";

export default function JobDetailsModal({ isOpen, onClose, job,  onMessageCustomer}) {
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

  return (
    <div>
      <div className="fixed inset-0 bg-gray-50  bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white p-5 rounded-2xl max-w-3xl w-full max-h-[95vh] overflow-y-auto">
          {/* Header */}
          <div className=" top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
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
              <h3 className="text-lg font-semibold mb-4">{formatTitle(job?.title)}</h3>

              {/* Provider Info */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={job?.originalData?.providerId?.profilePicture || "/avatar.png"}
                    alt={job.providerName}
                    className="w-18 h-18 rounded-full object-cover"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs">
                        {job.providerName}
                      </span>
                      <Verified className="w-4 h-4 text-[#2D6A3E]" />
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">4.6</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <MapPin className="w-4 h-4" />
                      <span className="font-medium">{job.location}</span>
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <span className="px-3 py-1 bg-green-100 text-sm font-medium rounded-full border border-green-200">
{job.status}                </span>
              </div>
              <div className="flex mt-3 gap-8">
                <button className="px-15 py-2 mt-3 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
                  <PhoneCall className="w-4 h-4" />
                  Call
                </button>
                <button 
                className="px-15 py-2 mt-3 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                onClick={() => onMessageCustomer?.(job)}>
                  <MessageCircle className="w-4 h-4" />
                  Message
                </button>
                {/* <button className="px-5 py-2 mt-3 bg-white text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors flex items-center gap-2">
                  Cancel Request
                </button> */}
              </div>
            </div>

            {/* Booking Information */}
            <div className="border-t border-gray-200">
              <h4 className="font-semibold mb-3 mt-2">Booking Information</h4>
              <div className="space-y-3">
                {/* Start Date & Time */}
                <div className="flex items-start gap-3">
                  <Wrench className="w-5 h-5 text-[#2D6A3E] mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Service Type
                    </p>
                    <p className="text-sm text-gray-600">{formatTitle(job?.title)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-[#2D6A3E] mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Start Date & Time
                    </p>
                    <p className="text-sm text-gray-600">{formatDateTime(job?.createdAt || job?.originalData?.createdAt)}
</p>
                  </div>
                </div>

                {/* End Date */}
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-[#2D6A3E] mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      End Date
                    </p>
                    <p className="text-sm text-gray-600">{job.deliveryDate}</p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#2D6A3E] mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Location
                    </p>
                    <p className="text-sm text-gray-600">{job.location}</p>
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
                      ₦{job.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Project Description */}
            <div>
              <h4 className="font-semibold mb-3">Project Description</h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                Need a licensed electrician to install new wiring for a home
                office setup. This includes installation of 4 new outlets, 2
                overhead lights, and an ethernet cable run. The office is on the
                second floor. All materials will be provided, but please bring
                standard tools and safety equipment.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Attached photos</h3>
            </div>

            {/* Additional Notes */}
            <div>
              <h4 className="font-semibold mb-3">Additional notes</h4>
              <div className="bg-blue-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-600 italic">
                  Please park in the driveway. The side door will be unlocked.
                </p>
              </div>
            </div>

            <p className="flex mt-15 items-center  text-sm justify-center">
              Update the job status to keep the customer informed
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
