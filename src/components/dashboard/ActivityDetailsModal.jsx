import {
  X,
  Calendar,
  Clock,
  Tag,
  Info,
  FileText,
  Zap,
  TrendingUp,
} from "lucide-react";
import {
  FiCheckCircle,
  FiTruck,
  FiTool,
  FiXCircle,
  FiClock,
  FiBell,
  FiMessageSquare,
  FiDollarSign,
  FiUserCheck,
} from "react-icons/fi";
import { format } from "date-fns";
import { useEffect, useState } from "react";

// Human-readable type labels
const TYPE_LABELS = {
  new_booking_request: "New Booking Request",
  provider_accepted: "Provider Accepted Booking",
  booking_selected: "Booking Selected",
  booking_taken: "Booking Taken",
  booking_cancelled: "Booking Cancelled",
  booking_completed: "Booking Completed",
  job_started: "Job Started",
  job_completed_confirmed: "Job Completed & Confirmed",
  payment_received: "Payment Received",
  message_received: "Message Received",
  new_message: "New Message",
  counter_offer: "Counter Offer",
  test: "Test Notification",
};

// Status badge styling
const getStatusStyle = (type) => {
  if (
    [
      "booking_completed",
      "job_completed_confirmed",
      "provider_accepted",
      "payment_received",
    ].includes(type)
  ) {
    return "bg-green-100 text-green-700 border-green-200";
  }
  if (["booking_cancelled"].includes(type)) {
    return "bg-red-100 text-red-700 border-red-200";
  }
  if (["job_started", "booking_taken", "counter_offer"].includes(type)) {
    return "bg-yellow-100 text-yellow-700 border-yellow-200";
  }
  if (["new_message", "message_received"].includes(type)) {
    return "bg-orange-100 text-orange-700 border-orange-200";
  }
  return "bg-blue-100 text-blue-700 border-blue-200";
};

// Category label
const getCategory = (type) => {
  if (
    [
      "new_booking_request",
      "provider_accepted",
      "booking_selected",
      "booking_taken",
      "booking_cancelled",
      "booking_completed",
      "job_started",
      "job_completed_confirmed",
    ].includes(type)
  ) {
    return "Booking";
  }
  if (type === "payment_received") return "Payment";
  if (["new_message", "message_received"].includes(type)) return "Message";
  return "Update";
};

// Icon config matching Activities.jsx
const getIconConfig = (type) => {
  const configs = {
    new_booking_request: { icon: FiCheckCircle, bgColor: "bg-blue-500" },
    provider_accepted: { icon: FiUserCheck, bgColor: "bg-green-500" },
    booking_selected: { icon: FiCheckCircle, bgColor: "bg-blue-500" },
    booking_taken: { icon: FiTruck, bgColor: "bg-yellow-500" },
    booking_cancelled: { icon: FiXCircle, bgColor: "bg-red-500" },
    job_started: { icon: FiTool, bgColor: "bg-blue-500" },
    payment_received: { icon: FiDollarSign, bgColor: "bg-green-500" },
    booking_completed: { icon: FiCheckCircle, bgColor: "bg-green-500" },
    job_completed_confirmed: { icon: FiCheckCircle, bgColor: "bg-green-500" },
    message_received: { icon: FiMessageSquare, bgColor: "bg-orange-500" },
    new_message: { icon: FiMessageSquare, bgColor: "bg-blue-500" },
    counter_offer: { icon: FiClock, bgColor: "bg-yellow-500" },
    test: { icon: FiBell, bgColor: "bg-gray-500" },
  };
  return configs[type] || { icon: FiBell, bgColor: "bg-gray-500" };
};

// Confetti component
const Confetti = ({ isActive }) => {
  const [confetti, setConfetti] = useState([]);

  useEffect(() => {
    if (!isActive) return;

    const pieces = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.5,
      duration: 2 + Math.random() * 1,
      size: 4 + Math.random() * 8,
    }));
    setConfetti(pieces);
  }, [isActive]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="absolute animate-pulse"
          style={{
            left: `${piece.left}%`,
            top: "-20px",
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            background: ["#FFD700", "#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A"][
              Math.floor(Math.random() * 5)
            ],
            borderRadius: "50%",
            animation: `fall ${piece.duration}s linear ${piece.delay}s infinite`,
            opacity: 0.8,
          }}
        />
      ))}
      <style>{`
                @keyframes fall {
                    to {
                        transform: translateY(100vh) rotate(360deg);
                        opacity: 0;
                    }
                }
            `}</style>
    </div>
  );
};

// Celebratory modal for job_completed_confirmed
const JobCompletedCelebrationModal = ({
  notification,
  onClose,
  showConfetti,
}) => {
  const data = notification.data || {};

  // Format dates
  let formattedDate = "";
  let formattedTime = "";
  try {
    const date = new Date(notification.createdAt);
    formattedDate = format(date, "MMMM d, yyyy");
    formattedTime = format(date, "h:mm a");
  } catch {
    formattedDate = "—";
    formattedTime = "";
  }

  return (
    <>
      {/* Confetti Animation */}
      <Confetti isActive={showConfetti} />

      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-3xl max-w-md w-full max-h-[calc(100vh-2rem)] overflow-y-auto shadow-2xl transform transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Gradient Header */}
          <div className="relative h-28 sm:h-36 bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 overflow-hidden flex-shrink-0">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                {/* Animated glow circle */}
                <div
                  className="absolute inset-0 bg-white rounded-full opacity-20 animate-pulse"
                  style={{ boxShadow: "0 0 60px rgba(255,255,255,0.3)" }}
                />
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
                  <span className="text-4xl animate-bounce">🎉</span>
                </div>
              </div>
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-white/30 hover:bg-white/50 text-white rounded-full transition-colors backdrop-blur-sm"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="px-5 sm:px-6 py-5 sm:py-6 space-y-4">
            {/* Title with Emoji */}
            <div className="text-center">
              <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                {notification.title}
              </h2>
              <div className="flex items-center justify-center gap-2 text-sm font-semibold text-green-600">
                <Zap size={16} className="animate-pulse" />
                Job Completed & Confirmed
                <Zap size={16} className="animate-pulse" />
              </div>
            </div>

            {/* Message */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-3 sm:p-4 border border-green-200">
              <p className="text-center text-gray-700 text-sm leading-relaxed">
                {notification.message}
              </p>
            </div>

            {/* Highlight Box - Key Info */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-3 sm:p-4 border-2 border-amber-300 shadow-md">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-amber-500">
                    <TrendingUp size={18} className="text-white" />
                  </div>
                </div>
                <h3 className="text-sm font-bold text-amber-900">
                  Bonus Earned!
                </h3>
              </div>
              <p className="text-xs text-amber-800">
                🎁 You've earned a bonus for successfully completing this job!
                Your excellent work is appreciated.
              </p>
            </div>

            {/* Details Grid */}
            <div className="space-y-2">
              {/* Amount */}
              {data.amount && (
                <div className="flex items-center justify-between gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                  <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <FiDollarSign size={16} className="text-green-600" />
                    Amount Earned
                  </span>
                  <span className="text-lg font-bold text-green-600">
                    ₦{Number(data.amount).toLocaleString()}
                  </span>
                </div>
              )}

              {/* Service */}
              {data.serviceTitle && (
                <div className="flex items-center justify-between gap-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100">
                  <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Tag size={16} className="text-purple-600" />
                    Service
                  </span>
                  <span className="text-sm font-semibold text-gray-900 text-right break-words">
                    {data.serviceTitle}
                  </span>
                </div>
              )}

              {/* Customer Name */}
              {data.buyerName && (
                <div className="flex items-center justify-between gap-3 p-3 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg border border-cyan-100">
                  <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <FiUserCheck size={16} className="text-cyan-600" />
                    Customer
                  </span>
                  <span className="text-sm font-semibold text-gray-900 text-right break-words">
                    {data.buyerName}
                  </span>
                </div>
              )}

              {/* Date and Time */}
              <div className="flex items-center justify-between gap-3 p-3 bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg border border-gray-200">
                <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Calendar size={16} className="text-gray-600" />
                  {formattedDate}
                </span>
                {formattedTime && (
                  <span className="text-sm text-gray-600 flex items-center gap-1">
                    <Clock size={14} />
                    {formattedTime}
                  </span>
                )}
              </div>
            </div>

            {/* Withdrawal Info */}
            <div className="bg-blue-50 rounded-xl p-3 border border-blue-200">
              <p className="text-xs text-blue-900">
                <span className="font-semibold">💡 Pro Tip:</span> Your payment
                will be available for withdrawal after 24 hours. Check your
                transaction history for more details.
              </p>
            </div>

            {/* Action Button */}
            <button
              onClick={onClose}
              className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <FiCheckCircle size={18} />
              Awesome! Dismiss
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default function ActivityDetailsModal({
  isOpen,
  onClose,
  notification,
}) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen && notification?.type === "job_completed_confirmed") {
      setShowConfetti(true);
    } else {
      setShowConfetti(false);
    }
  }, [isOpen, notification?.type]);

  if (!isOpen || !notification) return null;

  // Special celebratory modal for job_completed_confirmed
  if (notification.type === "job_completed_confirmed") {
    return (
      <JobCompletedCelebrationModal
        notification={notification}
        onClose={onClose}
        showConfetti={showConfetti}
      />
    );
  }

  // Default modal for other notification types
  const { icon: Icon, bgColor } = getIconConfig(notification.type);
  const typeLabel = TYPE_LABELS[notification.type] || notification.type;
  const statusStyle = getStatusStyle(notification.type);
  const category = getCategory(notification.type);

  // Format dates
  let formattedDate = "";
  let formattedTime = "";
  try {
    const date = new Date(notification.createdAt);
    formattedDate = format(date, "MMMM d, yyyy");
    formattedTime = format(date, "h:mm a");
  } catch {
    formattedDate = "—";
    formattedTime = "";
  }

  // Extract metadata from notification.data if available
  const data = notification.data || {};

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Activity Details
            </h2>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Title Section with Icon */}
            <div className="flex items-start gap-4">
              <div
                className={`w-12 h-12 ${bgColor} rounded-full flex items-center justify-center flex-shrink-0`}
              >
                <Icon className="text-white" size={22} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {notification.title}
                </h3>
                <span
                  className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border ${statusStyle}`}
                >
                  {typeLabel}
                </span>
              </div>
            </div>

            {/* Message */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FileText size={16} className="text-gray-400" />
                <h4 className="text-sm font-semibold text-gray-700">
                  Description
                </h4>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-lg p-4">
                {notification.message}
              </p>
            </div>

            {/* Details Grid */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Info size={16} className="text-gray-400" />
                Details
              </h4>

              <div className="bg-gray-50 rounded-lg divide-y divide-gray-200">
                {/* Category */}
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-sm text-gray-500 flex items-center gap-2">
                    <Tag size={14} />
                    Category
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {category}
                  </span>
                </div>

                {/* Date */}
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-sm text-gray-500 flex items-center gap-2">
                    <Calendar size={14} />
                    Date
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {formattedDate}
                  </span>
                </div>

                {/* Time */}
                {formattedTime && (
                  <div className="flex items-center justify-between px-4 py-3">
                    <span className="text-sm text-gray-500 flex items-center gap-2">
                      <Clock size={14} />
                      Time
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {formattedTime}
                    </span>
                  </div>
                )}

                {/* Read Status */}
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-sm text-gray-500 flex items-center gap-2">
                    <FiCheckCircle size={14} />
                    Status
                  </span>
                  <span
                    className={`text-sm font-medium ${notification.isRead ? "text-gray-500" : "text-blue-600"}`}
                  >
                    {notification.isRead ? "Read" : "Unread"}
                  </span>
                </div>

                {/* Amount from data */}
                {data.amount && (
                  <div className="flex items-center justify-between px-4 py-3">
                    <span className="text-sm text-gray-500 flex items-center gap-2">
                      <FiDollarSign size={14} />
                      Amount
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      ₦{Number(data.amount).toLocaleString()}
                    </span>
                  </div>
                )}

                {/* Provider name from data */}
                {(data.providerName || data.buyerName) && (
                  <div className="flex items-center justify-between px-4 py-3">
                    <span className="text-sm text-gray-500 flex items-center gap-2">
                      <FiUserCheck size={14} />
                      {data.providerName ? "Provider" : "Customer"}
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {data.providerName || data.buyerName}
                    </span>
                  </div>
                )}

                {/* Service title from data */}
                {data.serviceTitle && (
                  <div className="flex items-center justify-between px-4 py-3">
                    <span className="text-sm text-gray-500 flex items-center gap-2">
                      <Tag size={14} />
                      Service
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {data.serviceTitle}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
