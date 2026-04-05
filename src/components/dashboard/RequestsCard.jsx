import {
  Calendar,
  MapPin,
  Send,
  Clock,
  Star,
  MessageCircle,
  Copy,
  Check,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import distance from "/distance.png";
import { acceptCompletion, cancelBooking } from "../../api/bookings";
import ReviewModal from "./ReviewModal";
import CancelRequestButton from "../CancelRequestButton";

export default function RequestCard({
  request,
  onViewDetails,
  onTrackProvider,
  onMessageProvider,
  onBookingCancelled,
  onStatusUpdate,
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = (text, idType) => {
    navigator.clipboard.writeText(text);
    setCopiedId(idType);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStatusStyles = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-[#FFC107] border-yellow-200",
      paid_escrow: "bg-[#007BFF1A] text-[#007BFF] border-[#007BFF]",
      active: "bg-blue-100 text-blue-600 border-blue-200",
      "enroute to pickup": "bg-blue-100 text-blue-800 border-blue-200",
      "arrived at pickup": "bg-blue-100 text-blue-800 border-blue-200",
      "enroute to dropoff": "bg-blue-100 text-blue-800 border-blue-200",
      "arrived at dropoff": "bg-blue-100 text-blue-800 border-blue-200",
      "waiting confirmation": "bg-orange-200 text-orange-800 border-orange-200",
      completed: "bg-green-100 text-green-700 border-green-200",
      user_accepted_completion: "bg-green-100 text-green-700 border-green-200",
    };
    return styles[status.toLowerCase()] || styles.pending;
  };


  const handleReviewSubmit = async ({ score, review, tipAmount }) => {
    setSubmitLoading(true);
    setApiError(null);
    try {
      const payload = { score, review };
      const tipIsEmpty =
        tipAmount === undefined ||
        tipAmount === null ||
        tipAmount === "" ||
        tipAmount === 0;
      if (!tipIsEmpty) payload.tipAmount = tipAmount;
      const response = await acceptCompletion(request.id, payload);
      const successMsg =
        response?.message ||
        response?.data?.message ||
        "Job completion accepted successfully";
      toast.success(successMsg);
      setSubmitted(true);
      setModalOpen(false);
      if (onStatusUpdate) onStatusUpdate();
    } catch (err) {
      console.error("Failed to submit review:", err);
      const status = err.response?.status;
      let message = "Something went wrong. Please try again later.";
      if (status === 400)
        message =
          "Invalid rating score or tip amount. Please check your inputs.";
      else if (status === 401) message = "Unauthorized. Please log in again.";
      else if (status === 409)
        message =
          "This booking has not been marked as completed by the provider yet.";
      setApiError(message);
      toast.error(message);
    } finally {
      setSubmitLoading(false);
    }
  };

  const isCompleted =
    request.status.toLowerCase() === "completed" ||
    request.status.toLowerCase() === "waiting confirmation" ||
    request.status.toLowerCase() === "user_accepted_completion";

  return (
    <>
      <ReviewModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setApiError(null);
        }}
        onSubmit={handleReviewSubmit}
        loading={submitLoading}
        apiError={apiError}
      />


      <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
        <div className="flex-1">
          <div className="flex gap-2 border-b pb-3 border-[#231F2080]">
            <img
              src={
                request.providerImage &&
                request.providerImage !== "/api/placeholder/80/80"
                  ? request.providerImage
                  : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop"
              }
              alt={request.providerName}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="w-full">
              <div className="flex justify-between mb-2 w-full">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {request.title}
                    </h3>
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusStyles(request.status)}`}
                    >
                      {request.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-[16px] text-[#231F20BF]">
                      {request.providerName}
                    </p>
                    {request.providerIdDisplay &&
                      request.providerIdDisplay !== "—" && (
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] font-medium text-gray-400 bg-gray-50 border border-gray-100 px-1.5 py-0.5 rounded">
                            ID: {request.providerIdDisplay}
                          </span>
                          <button
                            onClick={() =>
                              handleCopy(request.fullProviderId, "provider")
                            }
                            className="p-1 hover:bg-gray-100 rounded transition-colors text-gray-400"
                            title="Copy Full Provider ID"
                          >
                            {copiedId === "provider" ? (
                              <Check size={10} className="text-green-500" />
                            ) : (
                              <Copy size={10} />
                            )}
                          </button>
                        </div>
                      )}
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-2xl font-bold text-[#2D6A3E]">
                    ₦{request.price.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1 mt-1 justify-end">
                    <span className="text-[10px] font-medium text-gray-400">
                      #{request.orderId}
                    </span>
                    <button
                      onClick={() => handleCopy(request.fullOrderId, "booking")}
                      className="p-1 hover:bg-gray-100 rounded transition-colors text-gray-400"
                      title="Copy Full Booking ID"
                    >
                      {copiedId === "booking" ? (
                        <Check size={10} className="text-green-500" />
                      ) : (
                        <Copy size={10} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 mb-4 text-sm text-gray-600 mt-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#2D6A3E]" />
              <span>{request.scheduledDate}</span>
            </div>
            {request.startsIn && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-yellow-500" />
                <span className="font-medium">
                  Starts in: {request.startsIn}
                </span>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-[#E6EFE9] rounded-full flex items-center justify-center flex-shrink-0">
                <div className="w-2 h-2 bg-[#005823] rounded-full" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Pickup Location
                </p>
                <p className="text-sm text-gray-600">{request.pickupAddress}</p>
              </div>
            </div>

            <div className="flex items-end gap-8">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-[#E6EFE9] rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-3 h-3 text-[#005823]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Dropoff Location
                  </p>
                  <p className="text-sm text-gray-600">
                    {request.dropoffAddress}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <img src={distance} alt="" />
                <p className="text-[#231F20BF]">
                  Distance: <span>{request.distance}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => onViewDetails(request)}
              className="px-5 py-2 mt-3 bg-[#2D6A3E] text-white rounded-[4px] font-medium hover:bg-[#1f4a2a] transition-colors"
            >
              View Details
            </button>

            {[
              "pending providers",
              "provider selected",
              "payment pending",
              "awaiting provider acceptance",
            ].includes(request.status.toLowerCase()) && (
              <CancelRequestButton
                bookingId={request.id}
                onSuccess={onBookingCancelled}
              />
            )}

            {[
              "provider selected",
              "in progress",
              "enroute to pickup",
              "arrived at pickup",
              "enroute to dropoff",
              "arrived at dropoff",
              "completed",
            ].includes(request.status.toLowerCase()) && (
              <button
                onClick={() => onTrackProvider(request.id)}
                className="px-3 py-1 mt-3 bg-white text-gray-700 border border-gray-300 rounded-[4px] font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Track provider
              </button>
            )}

            {[
              "provider selected",
              "paid escrow",
              "enroute to pickup",
              "arrived at pickup",
              "enroute to dropoff",
              "arrived at dropoff",
            ].includes(request.status.toLowerCase()) && (
              <button
                onClick={() => onMessageProvider?.(request)}
                className="px-3 py-1 mt-3 bg-white text-gray-700 border border-gray-300 rounded-[4px] font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Message Provider
              </button>
            )}

            {isCompleted && (
              <>
                {request.ratings || submitted ? (
                  <div className="px-3 py-1 mt-3 flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.round(request.ratings)
                            ? "fill-yellow-400 text-yellow-400"
                            : "fill-gray-300 text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="text-sm font-bold ml-2">
                      {request.ratings}.0
                    </span>
                  </div>
                ) : (
                  <button
                    onClick={() => setModalOpen(true)}
                    className="px-3 py-1 mt-3 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                  >
                    Accept Job Completion
                  </button>
                )}
              </>
            )}

            {/* {(request.status.toLowerCase() === "pending" ||
              request.status.toLowerCase() === "in progress") && (
              <button className="px-3 py-1 mt-3 bg-white text-red-600 border border-red-300 rounded-lg font-medium hover:bg-red-50 transition-colors">
                Close Request
              </button>
            )} */}
          </div>
        </div>
      </div>
    </>
  );
}
