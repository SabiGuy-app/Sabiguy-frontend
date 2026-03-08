import {
  Calendar,
  MapPin,
  Send,
  Clock,
  Star,
  MessageCircle,
} from "lucide-react";
import { useState } from "react";
import distance from "/distance.png";
import { acceptCompletion, cancelBooking } from "../../api/bookings";

function CancelModal({ isOpen, onClose, onConfirm, loading }) {
  const [reason, setReason] = useState("");
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-xl">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">
          Cancel Booking
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Are you sure you want to cancel this booking? This action cannot be
          undone.
        </p>
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Reason <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={3}
            placeholder="e.g. Change of plans"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-red-400 resize-none"
          />
        </div>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Go Back
          </button>
          <button
            onClick={() => onConfirm(reason)}
            disabled={!reason.trim() || loading}
            className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Cancelling..." : "Yes, Cancel"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ReviewModal({ isOpen, onClose, onSubmit, loading }) {
  const [score, setScore] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [review, setReview] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!score) return;
    onSubmit({ score, review });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-xl">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">
          Accept Job Completion
        </h2>
        <p className="text-sm text-gray-500 mb-5">
          Rate your experience with this provider
        </p>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating
          </label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setScore(star)}
                onMouseEnter={() => setHovered(star)}
                onMouseLeave={() => setHovered(0)}
              >
                <Star
                  className={`w-8 h-8 transition-colors ${
                    star <= (hovered || score)
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-gray-200 text-gray-200"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Review (optional)
          </label>
          <textarea
            rows={3}
            placeholder="Share your experience..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#005823] resize-none"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!score || loading}
            className="flex-1 px-4 py-2.5 bg-[#005823] text-white rounded-lg font-medium hover:bg-[#1f4a2a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function RequestCard({
  request,
  onViewDetails,
  onTrackProvider,
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  const getStatusStyles = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-[#FFC107] border-yellow-200",
      paid_escrow: "bg-[#007BFF1A] text-[#007BFF] border-[#007BFF]",
      active: "bg-blue-100 text-blue-600 border-blue-200",
      "in progress": "bg-blue-100 text-blue-800 border-blue-200",
      "waiting confirmation": "bg-orange-200 text-orange-800 border-orange-200",
      completed: "bg-green-100 text-green-700 border-green-200",
      user_accepted_completion: "bg-green-100 text-green-700 border-green-200",
    };
    return styles[status.toLowerCase()] || styles.pending;
  };

  const handleCancel = async (reason) => {
    setCancelLoading(true);
    try {
      await cancelBooking(request.id, reason);
      setCancelModalOpen(false);
      if (onBookingCancelled) onBookingCancelled();
    } catch (err) {
      console.error("Failed to cancel booking:", err);
    } finally {
      setCancelLoading(false);
    }
  };

  const handleReviewSubmit = async ({ score, review }) => {
    setSubmitLoading(true);
    try {
      await acceptCompletion(request.id, { score, review });
      setSubmitted(true);
      setModalOpen(false);
    } catch (err) {
      console.error("Failed to submit review:", err);
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
        onClose={() => setModalOpen(false)}
        onSubmit={handleReviewSubmit}
        loading={submitLoading}
      />

      <CancelModal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        onConfirm={handleCancel}
        loading={cancelLoading}
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
                  <p className="text-[16px] text-[#231F20BF]">
                    {request.providerName}
                  </p>
                </div>
                <div className="flex justify-end">
                  <div className="text-2xl font-bold text-[#2D6A3E]">
                    ₦{request.price.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 mb-4 text-sm text-gray-600">
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
                    <p className="text-sm text-gray-600">
                      {request.pickupAddress}
                    </p>
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
              "pending_providers",
              "provider_selected",
              "payment_pending",
            ].includes(request.status.toLowerCase()) && (
              <button
                onClick={() => setCancelModalOpen(true)}
                className="px-3 py-1 mt-3 bg-white text-red-600 border border-red-300 rounded-lg font-medium hover:bg-red-50 transition-colors"
              >
                Cancel Request
              </button>
            )}

            {["provider_selected", "in_progress"].includes(
              request.status.toLowerCase(),
            ) && (
              <button
                onClick={() => onTrackProvider(request.id)}
                className="px-3 py-1 mt-3 bg-white text-gray-700 border border-gray-300 rounded-[4px] font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Track provider
              </button>
            )}

            {["provider_selected", "paid_escrow", "in_progress"].includes(
              request.status.toLowerCase(),
            ) && (
              <button className="px-3 py-1 mt-3 bg-white text-gray-700 border border-gray-300 rounded-[4px] font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
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

            {(request.status.toLowerCase() === "pending" ||
              request.status.toLowerCase() === "in progress") && (
              <button className="px-3 py-1 mt-3 bg-white text-red-600 border border-red-300 rounded-lg font-medium hover:bg-red-50 transition-colors">
                Close Request
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
