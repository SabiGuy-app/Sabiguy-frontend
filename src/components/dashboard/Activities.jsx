import { Trash2, Loader2, Eye } from "lucide-react";
import {
  FiCheckCircle,
  FiTruck,
  FiMapPin,
  FiTool,
  FiXCircle,
  FiClock,
  FiCalendar,
  FiBell,
  FiMessageSquare,
  FiDollarSign,
  FiUserCheck,
} from "react-icons/fi";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Activities({ notification, onDelete, onViewDetails }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const getIconConfig = (type) => {
    const configs = {
      // Booking types — use original design icons
      new_booking_request: {
        icon: FiCheckCircle,
        bgColor: "bg-blue-500",
      },
      provider_accepted: {
        icon: FiUserCheck,
        bgColor: "bg-green-500",
      },
      booking_selected: {
        icon: FiCheckCircle,
        bgColor: "bg-blue-500",
      },
      booking_taken: {
        icon: FiTruck,
        bgColor: "bg-yellow-500",
      },
      booking_cancelled: {
        icon: FiXCircle,
        bgColor: "bg-red-500",
      },
      job_started: {
        icon: FiTool,
        bgColor: "bg-blue-500",
      },
      payment_received: {
        icon: FiDollarSign,
        bgColor: "bg-green-500",
      },
      booking_completed: {
        icon: FiCheckCircle,
        bgColor: "bg-green-500",
      },
      job_completed_confirmed: {
        icon: FiCheckCircle,
        bgColor: "bg-green-500",
      },
      // Message types
      message_received: {
        icon: FiMessageSquare,
        bgColor: "bg-orange-500",
      },
      new_message: {
        icon: FiMessageSquare,
        bgColor: "bg-blue-500",
      },
      // Other
      counter_offer: {
        icon: FiClock,
        bgColor: "bg-yellow-500",
      },
      test: {
        icon: FiBell,
        bgColor: "bg-gray-500",
      },
    };
    return configs[type] || { icon: FiBell, bgColor: "bg-gray-500" };
  };

  const { icon: Icon, bgColor } = getIconConfig(notification.type);

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!onDelete || isDeleting) return;
    setIsDeleting(true);
    try {
      await onDelete(notification._id);
      toast.success("Activity deleted");
    } catch (error) {
      console.error("Failed to delete notification:", error);
      toast.error("Failed to delete. Try again.");
      setIsDeleting(false);
    }
  };

  // Format the timestamp
  let timeAgo = "";
  try {
    timeAgo = formatDistanceToNow(new Date(notification.createdAt), {
      addSuffix: true,
    });
  } catch {
    timeAgo = "";
  }

  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all duration-200 ${isDeleting ? "opacity-50 scale-[0.98]" : ""
        }`}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div
          className={`w-10 h-10 ${bgColor} rounded-full flex items-center justify-center flex-shrink-0`}
        >
          <Icon className="text-white" size={20} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 mb-1 text-sm">
                {notification.title}
              </h3>
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                {notification.message}
              </p>
              <span className="text-xs text-gray-400">{timeAgo}</span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetails && onViewDetails(notification);
                }}
                className="px-3 py-1.5 text-xs font-medium text-[#005823] border border-gray-300 rounded-lg hover:bg-[#8BC53F1A] transition-colors"
              >
                View Details
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 disabled:opacity-50 flex-shrink-0"
                title="Delete activity"
                aria-label={`Delete ${notification.title}`}
              >
                {isDeleting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Trash2 size={16} />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}