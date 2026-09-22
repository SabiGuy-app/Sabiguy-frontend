import { X, MessageCircle, CheckCircle2, AlertCircle } from "lucide-react";
import { FiMessageSquare, FiCalendar, FiBell } from "react-icons/fi";

export default function NotificationToast({ notification, onClose, onClick }) {
  const getIcon = (type) => {
    const iconMap = {
      new_booking_request: <FiCalendar className="text-blue-500" size={20} />,
      provider_accepted: <CheckCircle2 className="text-green-500" size={20} />,
      booking_selected: <FiCalendar className="text-blue-500" size={20} />,
      booking_taken: <FiCalendar className="text-purple-500" size={20} />,
      booking_cancelled: <AlertCircle className="text-red-500" size={20} />,
      job_started: <FiCalendar className="text-orange-500" size={20} />,
      payment_received: <CheckCircle2 className="text-green-500" size={20} />,
      booking_completed: <CheckCircle2 className="text-green-500" size={20} />,
      message_received: <MessageCircle className="text-blue-600" size={20} />,
      new_message: <MessageCircle className="text-blue-600" size={20} />,
      counter_offer: <FiBell className="text-blue-500" size={20} />,
      job_completed_confirmed: (
        <CheckCircle2 className="text-green-500" size={20} />
      ),
      test: <FiBell className="text-gray-500" size={20} />,
    };
    return iconMap[type] || <FiBell className="text-gray-500" size={20} />;
  };

  const getBackgroundColor = (type) => {
    if (type === "new_message" || type === "message_received")
      return "bg-blue-50 border-blue-200";
    if (
      type === "provider_accepted" ||
      type === "payment_received" ||
      type === "booking_completed"
    )
      return "bg-green-50 border-green-200";
    if (type === "booking_cancelled") return "bg-red-50 border-red-200";
    return "bg-white border-gray-200";
  };

  return (
    <div
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-2xl shadow-2xl border p-4 max-w-sm w-full cursor-pointer
        hover:shadow-3xl transition-all duration-300 
        transform hover:scale-105 animate-slideInDown
        ${getBackgroundColor(notification.type)}
      `}
      style={{
        animation: "slideInDown 0.4s ease-out",
      }}
    >
      <style>{`
        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 bg-white/50 backdrop-blur">
          {getIcon(notification.type)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="font-bold text-gray-900 text-sm leading-tight">
              {notification.title}
            </h4>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="text-gray-400 hover:text-gray-600 flex-shrink-0 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2 leading-snug">
            {notification.message}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div
        className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-green-500 animate-pulse"
        style={{
          animation: "shrink 5s linear forwards",
        }}
      />

      <style>{`
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
}
