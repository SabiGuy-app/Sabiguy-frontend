import {
  ChevronDown,
  Calendar,
  MapPin,
  Send,
  Clock,
  Star,
  MessageCircle,
  Copy,
  Check,
} from "lucide-react";
import { FaBicycle } from "react-icons/fa";
import { useState } from "react";

// Reusable Request Card Component
export default function AlertsCard({
  alert,
  onViewDetails,
  onAcceptBooking,
  accepting,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const formatCreatedAt = (value) => {
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

  const getStatusStyles = (status) => {
    const styles = {
      new: "bg-green-100 text-green-500 border-green-200",
      awaiting_response: "bg-yellow-100 text-[#FFC107] border-yellow-200",
      "awaiting response": "bg-yellow-100 text-[#FFC107] border-yellow-200",
      "waiting confirmation": "bg-orange-200 text-orange-800 border-orange-200",

      completed: "bg-green-100 text-green-700 border-green-200",
    };
    return styles[status.toLowerCase()];
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
      <div className="flex flex-col sm:flex-row items-start gap-4">
        {/* Main Content */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row items-start sm:justify-between mb-2">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                {alert?.subCategory
                  ?.split(" ")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </h3>
              {alert?.orderId && (
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-xs font-bold text-gray-500">#{alert.orderId}</span>
                  <button
                    onClick={() => handleCopy(alert.fullOrderId)}
                    className="p-1 hover:bg-gray-100 rounded transition-colors text-gray-400"
                  >
                    {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                  </button>
                </div>
              )}

              <div className="flex flex-col mb-4 mt-2 gap-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#2D6A3E]" />
                  <span>{formatCreatedAt(alert?.originalData?.createdAt)}</span>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#E6EFE9] rounded-full flex items-center justify-center flex-shrink-0">
                    <div className="w-3 h-3 bg-[#005823] rounded-full"></div>
                  </div>
                  <div>
                    <span className="text-[#231F2080] text-[16px]">Pickup</span>
                    <p className="text-[#231F20BF] text-[18px] break-words">
                      {alert?.originalData?.pickupLocation.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-start justify-between gap-3">
                  <div className="w-8 h-8 bg-[#E6EFE9] rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-3 h-3 text-[#005823]" />
                  </div>
                  <div className="flex-1">
                    <span className="text-[#231F2080] text-[16px]">
                      Dropoff
                    </span>
                    <p className="text-[#231F20BF] text-[18px] break-words">
                      {alert?.originalData?.dropoffLocation?.address}
                    </p>
                  </div>
                </div>

                {/* <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span className="font-medium">{alert.scheduleType || alert.scheduledDate}</span>
                </div> */}
                {alert.posted && (
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-yellow-500" />
                    <span className="font-medium">Posted: {alert.posted}</span>
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      <FaBicycle className="w-7 h-7 text-[#2D6A3E]" />
                      <span>{alert.distance}</span>
                    </div>
                  </div>
                )}

                {alert.offerSent && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-yellow-500" />
                    <span className="font-medium">
                      Counter offer sent {alert.offerSent}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="text-left sm:text-right mt-3 sm:mt-0 w-full sm:w-auto">
              <span
                className={`inline-block px-3 py-1 text-xs font-medium rounded-full border ${getStatusStyles(
                  alert.status,
                )}`}
              >
                {alert.status}
              </span>
              <div className="text-2xl mt-3 font-bold text-[#2D6A3E] truncate max-w-full">
                ₦{alert.price.toLocaleString()}
              </div>
              <p className="text-sm text-gray-600">
                Delivery: {alert.deliveryDate}
              </p>
            </div>
          </div>

          {/* Date and Time Info */}

          <div className="flex flex-col sm:flex-row gap-3 border-t pt-3">
            <button
              onClick={() => onAcceptBooking?.(alert)}
              disabled={accepting}
              className="w-full sm:w-auto px-4 py-2 bg-[#2D6A3E] text-white rounded-lg font-medium hover:bg-[#1f4a2a] transition-colors"
            >
              {accepting ? "Accepting..." : "Accept Booking"}
            </button>
            {alert.status.toLowerCase() === "awaiting response" && (
              <button className="w-full sm:w-auto px-3 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                Awaiting Customer's response
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
