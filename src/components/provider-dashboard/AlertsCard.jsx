import {
  ChevronDown,
  Calendar,
  MapPin,
  Send,
  Clock,
  Star,
  MessageCircle,
} from "lucide-react";
import { useState } from "react";

// Reusable Request Card Component
export default function AlertsCard({ alert, onViewDetails }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      <div className="flex items-start gap-4">
        {/* Main Content */}
        <div className="flex-1">
          <div className="flex  items-start justify-between mb-2">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                {alert.fullName}
              </h3>

              <div className="flex flex-col mb-4 mt-2 gap-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#2D6A3E]" />
                  <span>{alert.distance}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span className="font-medium">{alert.scheduleType}</span>
                </div>
                {alert.posted && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-yellow-500" />
                    <span className="font-medium">Posted: {alert.posted}</span>
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
            <div className="text-right">
              <span
                className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusStyles(
                  alert.status,
                )}`}
              >
                {alert.status}
              </span>
              <div className="text-2xl mt-3 font-bold text-[#2D6A3E]">
                ₦{alert.price.toLocaleString()}
              </div>
              <p className="text-sm text-gray-600">
                Delivery: {alert.deliveryDate}
              </p>
            </div>
          </div>

          {/* Date and Time Info */}

          <div className="flex gap-3 border-t">
            <button
              onClick={() => onViewDetails(alert)}
              className="px-3 py-1 mt-3 bg-[#2D6A3E] text-white cursor-pointer rounded-lg font-medium hover:bg-[#1f4a2a] transition-colors"
            >
              View Details
            </button>
            {alert.status.toLowerCase() === "awaiting response" && (
              <button className="px-3 py-1 mt-3 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
                Awaiting Customer's response
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
