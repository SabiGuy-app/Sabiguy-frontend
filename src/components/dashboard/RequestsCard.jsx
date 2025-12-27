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
export default function RequestCard({ request, onViewDetails }) {

  const getStatusStyles = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-[#FFC107] border-yellow-200",
      active: "bg-blue-100 text-blue-600 border-blue-200",
      "in progress": "bg-blue-100 text-blue-800 border-blue-200",
      "waiting confirmation": "bg-orange-200 text-orange-800 border-orange-200",

      completed: "bg-green-100 text-green-700 border-green-200",
    };
    return styles[status.toLowerCase()] || styles.pending;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start gap-4">
        {/* Profile Image */}
        <img
          src={request.providerImage || "/api/placeholder/80/80"}
          alt={request.providerName}
          className="w-16 h-16 rounded-full object-cover"
        />

        {/* Main Content */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-xl font-semibold text-gray-900">
                  {request.title}
                </h3>
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusStyles(
                    request.status
                  )}`}
                >
                  {request.status}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Provider: {request.providerName}
              </p>
              <p className="text-sm text-gray-500">
                Order ID: {request.orderId}
              </p>
            </div>

            {/* Price Section */}
            <div className="text-right">
              <div className="text-2xl font-bold text-[#2D6A3E]">
                ₦{request.price.toLocaleString()}
              </div>
              <p className="text-sm text-gray-600">
                Delivery: {request.deliveryDate}
              </p>
            </div>
          </div>

          {/* Date and Time Info */}
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
          <div className="flex gap-3 border-t">
            <button
              onClick={() => onViewDetails(request)}
              className="px-3 py-1 mt-3 bg-[#2D6A3E] text-white rounded-lg font-medium hover:bg-[#1f4a2a] transition-colors"
            >
              View Details
            </button>
            {request.status.toLowerCase() === "pending" && (
              <button className="px-3 py-1 mt-3 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
                <Send className="w-4 h-4" />
                Track provider
              </button>
            )}
            {request.status.toLowerCase() !== "completed" && (
              <button className="px-3 py-1 mt-3 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Message Provider
              </button>
            )}
            {(request.status.toLowerCase() === "completed" ||
              request.status.toLowerCase() === "waiting confirmation") && (
              <>
                {request.ratings ? (
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
                  <button className="px-3 py-1 mt-3 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
                    Leave review
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
    </div>
  );
}
