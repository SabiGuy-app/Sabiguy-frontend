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
import distance from "/distance.png";

// Reusable Request Card Component
export default function RequestCard({ request, onViewDetails }) {
  const getStatusStyles = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-[#FFC107] border-yellow-200",
      paid_escrow: "bg-[#007BFF1A] text-[#007BFF] border-[##007BFF]",
      active: "bg-blue-100 text-blue-600 border-blue-200",
      "in progress": "bg-blue-100 text-blue-800 border-blue-200",
      "waiting confirmation": "bg-orange-200 text-orange-800 border-orange-200",

      completed: "bg-green-100 text-green-700 border-green-200",
    };
    return styles[status.toLowerCase()] || styles.pending;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-lg transition-shadow w-full max-w-full">

      <div className="flex-1 min-w-0">
        <div className="flex border-b pb-3 border-[#231F2080]">
          <img
            src={request.providerImage || "/api/placeholder/80/80"}
            alt={request.providerName}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div className="w-full">
            <div className="flex flex-col sm:flex-row sm:justify-between mb-2 w-full gap-2">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-semibold text-gray-900 truncate max-w-full">
                    {request.title}
                  </h3>
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusStyles(
                      request.status,
                    )}`}
                  >
                    {request.status}
                  </span>
                </div>
                <p className="text-[16px] text-[#231F20BF]">
                  {request.providerName}
                </p>
                {/* <p className="text-sm text-gray-500">
                    Order ID: {request.orderId}
                  </p> */}
              </div>

              {/* Price Section */}
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
                  <p className="text-sm text-gray-600 break-words">
                    {request.pickupAddress}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3 sm:gap-8">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-[#E6EFE9] rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-3 h-3 text-[#005823]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Dropoff Location
                    </p>
                    <p className="text-sm text-gray-600 break-words">
                      {request.dropoffAddress}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div>
                    <img src={distance} alt="" />
                  </div>
                  <div>
                    <p className="text-[#231F20BF]">
                      Distance: <span>{request.distance}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-3">
          <button
            onClick={() => onViewDetails(request)}
            className="px-3 py-2 mt-3 bg-[#2D6A3E] text-white rounded-[4px] font-medium hover:bg-[#1f4a2a] transition-colors text-sm"
          >
            View Details
          </button>
          {request.status.toLowerCase() === "paid_escrow" && (
            <button className="px-2 py-1 mt-3 bg-white text-gray-700 border border-gray-300 rounded-[4px] font-medium hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm">
              <Send className="w-4 h-4" />
              Track provider
            </button>
          )}
          {request.status.toLowerCase() !== "paid_escrow" && (
            <button className="px-2 py-1 mt-3 bg-white text-gray-700 border border-gray-300 rounded-[4px] font-medium hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm">
              <MessageCircle className="w-4 h-4" />
              Message Provider
            </button>
          )}
          {(request.status.toLowerCase() === "completed" ||
            request.status.toLowerCase() === "waiting confirmation") && (
            <>
              {request.ratings ? (
                <div className="px-2 py-1 mt-3 flex items-center gap-1">
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
                <button className="px-2 py-1 mt-3 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm">
                  Leave review
                </button>
              )}
            </>
          )}
          {(request.status.toLowerCase() === "pending" ||
            request.status.toLowerCase() === "in progress") && (
            <button className="px-2 py-1 mt-3 bg-white text-red-600 border border-red-300 rounded-lg font-medium hover:bg-red-50 transition-colors text-sm">
              Close Request
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
