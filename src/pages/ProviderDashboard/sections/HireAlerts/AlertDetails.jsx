import { useState } from "react";
import { Calendar, MapPin, ChevronLeft, Star, Settings } from "lucide-react";
import { acceptBookings } from "../../../../api/bookings";

export default function AlertDetailsModal({ isOpen, onClose, alert: alertData, onAcceptSuccess }) {
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  console.log("📋 Alert details:", alert);

  const handleAcceptBooking = async () => {
    try {
      setAccepting(true);
      setError(null);

      console.log("Accepting booking:", alertData.id);

      const response = await acceptBookings(alertData.id);

      console.log(" Accept response:", response);

      if (response.success) {
        alert(" Booking accepted successfully!");

        onClose();

        if (onAcceptSuccess) {
          onAcceptSuccess();
        }
      } else {
        setError(response.message || "Failed to accept booking");
      }
    } catch (err) {
      console.error("Error accepting booking:", err);

      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to accept booking. Please try again.";

      setError(errorMessage);
      window.alert(` ${errorMessage}`);
    } finally {
      setAccepting(false);
    }
  };

  return (
    <div>
      <div className="fixed inset-0 bg-gray-50 bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white p-5 rounded-2xl max-w-3xl w-full max-h-[95vh] overflow-y-auto">
          {/* Header */}
          <div className="top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
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
            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            {/* Service Title */}
            <div>
              <h3 className="text-lg font-semibold mb-4">{alert.title}</h3>

              {/* Provider Info */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={alert.providerImage || "/avatar.png"}
                    alt={alert.providerName || "Provider"}
                    className="w-18 h-18 rounded-full object-cover"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[20px]">
                        {alert?.subCategory}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">4.6</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <MapPin className="w-4 h-4" />
                      <span className="font-medium">{alert.location}</span>
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full border border-green-200">
                  {alert.status}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 mt-3 gap-3">
                <button
                  onClick={handleAcceptBooking}
                  disabled={accepting}
                  className="bg-[#005823] text-white font-semibold rounded-md text-sm border border-[#005823] px-2 py-2 hover:bg-[#003d19] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {accepting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Accepting...
                    </>
                  ) : (
                    "Accept Offer"
                  )}
                </button>
                <button 
                  className="text-[#005823] font-semibold rounded-md text-sm border border-[#005823] px-2 py-2 hover:bg-gray-50 transition-colors"
                  disabled={accepting}
                >
                  Send Counter Offer
                </button>
              </div>
            </div>

            {/* Booking Information */}
            <div className="border-t border-gray-200">
              <h4 className="font-semibold mb-3 mt-2">Booking Information</h4>
              <div className="space-y-3">
                {/* Service Type */}
                <div className="flex items-start gap-3">
                  <Settings className="w-5 h-5 text-[#2D6A3E] mt-0.5" />
                  <div className="flex gap-2">
                    <p className="text-sm font-medium text-gray-700">Service Type:</p>
                    <p className="text-sm font-bold text-gray-600">
                      {alert.originalData?.serviceType?.toUpperCase() || "N/A"}
                    </p>
                  </div>
                </div>

                {/* Schedule Type */}
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-[#2D6A3E] mt-0.5" />
                  <div className="flex gap-2">
                    <p className="text-sm font-medium text-gray-700">Schedule Type:</p>
                    <p className="text-sm font-bold text-gray-600">
                      {alert.originalData?.scheduleType?.toUpperCase() || "N/A"}
                    </p>
                  </div>
                </div>

                {/* Pickup Location */}
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#2D6A3E] mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Pickup Location:</p>
                    <p className="text-sm font-bold text-gray-600">
                      {alert.location?.toUpperCase() || "N/A"}
                    </p>
                  </div>
                </div>

                {/* Dropoff Location */}
                {alert.originalData?.dropoffLocation?.address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-red-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Dropoff Location:</p>
                      <p className="text-sm font-bold text-gray-600">
                        {alert.originalData.dropoffLocation.address.toUpperCase()}
                      </p>
                    </div>
                  </div>
                )}

                {/* Service Cost */}
                <div className="flex items-start gap-3 border-b border-gray-200 pb-3">
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
                    <p className="text-sm font-medium text-gray-700">Service Cost</p>
                    <p className="text-lg font-bold text-[#2D6A3E]">
                      ₦
                      {(
                        alert.originalData?.totalAmount ||
                        alert.originalData?.budget ||
                        alert.price ||
                        0
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Project Description */}
            {alert.originalData?.description && (
              <div>
                <h4 className="font-semibold mb-3">Project Description</h4>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {alert.originalData.description}
                </p>
              </div>
            )}

            {/* Attached Photos Section */}
            <div>
              <h3 className="font-semibold mb-3">Attached photos</h3>
              <p className="text-sm text-gray-500">No photos attached</p>
            </div>

            {/* Additional Notes */}
            <div>
              <h4 className="font-semibold mb-3">Additional notes</h4>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-gray-600">
                  {alert.originalData?.notes || "No additional notes"}
                </p>
              </div>
            </div>

            <p className="flex mt-6 items-center text-sm text-gray-600 justify-center">
              💡 First come, first served - Accept quickly to secure this job!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}