import { X, Calendar, Clock, Tag, Info, FileText } from "lucide-react";
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
    if (["booking_completed", "job_completed_confirmed", "provider_accepted", "payment_received"].includes(type)) {
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
    if (["new_booking_request", "provider_accepted", "booking_selected", "booking_taken", "booking_cancelled", "booking_completed", "job_started", "job_completed_confirmed"].includes(type)) {
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

export default function ActivityDetailsModal({ isOpen, onClose, notification }) {
    if (!isOpen || !notification) return null;

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
                        <h2 className="text-lg font-semibold text-gray-900">Activity Details</h2>
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
                                <h4 className="text-sm font-semibold text-gray-700">Description</h4>
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
                                    <span className="text-sm font-medium text-gray-900">{category}</span>
                                </div>

                                {/* Date */}
                                <div className="flex items-center justify-between px-4 py-3">
                                    <span className="text-sm text-gray-500 flex items-center gap-2">
                                        <Calendar size={14} />
                                        Date
                                    </span>
                                    <span className="text-sm font-medium text-gray-900">{formattedDate}</span>
                                </div>

                                {/* Time */}
                                {formattedTime && (
                                    <div className="flex items-center justify-between px-4 py-3">
                                        <span className="text-sm text-gray-500 flex items-center gap-2">
                                            <Clock size={14} />
                                            Time
                                        </span>
                                        <span className="text-sm font-medium text-gray-900">{formattedTime}</span>
                                    </div>
                                )}

                                {/* Read Status */}
                                <div className="flex items-center justify-between px-4 py-3">
                                    <span className="text-sm text-gray-500 flex items-center gap-2">
                                        <FiCheckCircle size={14} />
                                        Status
                                    </span>
                                    <span className={`text-sm font-medium ${notification.isRead ? "text-gray-500" : "text-blue-600"}`}>
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
