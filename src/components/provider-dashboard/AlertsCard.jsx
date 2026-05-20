import {
  Calendar,
  MapPin,
  Clock,
  Copy,
  Check,
} from "lucide-react";
import distance from "/distance.png";
import { useState } from "react";

export default function AlertsCard({
  alert,
  onViewDetails,
  onAcceptBooking,
  accepting,
}) {
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

    return styles[String(status || "").toLowerCase()] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  const pickupAddress = alert?.originalData?.pickupLocation?.address || "N/A";
  const dropoffAddress = alert?.originalData?.dropoffLocation?.address || "N/A";

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-lg transition-shadow">
      <div className="flex flex-col sm:flex-row items-start gap-4">
        <div className="flex-1 w-full">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px] items-start">
            <div className="space-y-3">
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
                      {copied ? (
                        <Check size={12} className="text-green-500" />
                      ) : (
                        <Copy size={12} />
                      )}
                    </button>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#2D6A3E]" />
                  <span>{formatCreatedAt(alert?.originalData?.createdAt)}</span>
                </div>
                {alert?.posted && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-yellow-500" />
                    <span className="font-medium">Posted: {alert.posted}</span>
                  </div>
                )}
                {alert?.distance && (
                  <div className="flex items-center gap-2">
                    <img src={distance} alt="" />
                    <p className="text-[#231F20BF]">
                      Distance: <span>{alert.distance}</span>
                    </p>
                  </div>
                )}
                <span className="inline-flex items-center rounded-full bg-[#E6EFE9] px-3 py-1 text-xs font-medium text-[#2D6A3E]">
                  Delivery: {alert?.deliveryDate}
                </span>
              </div>

              <div className="relative pl-0 pt-2">
                <div className="absolute left-4 top-[16px] bottom-[16px] w-[1.5px] bg-[#00582326] z-0" />

                <div className="flex items-start gap-4 mb-4 relative z-10">
                  <div className="w-8 h-8 bg-[#E6EFE9] rounded-full flex items-center justify-center flex-shrink-0 shadow-sm border border-[#0058231A]">
                    <div className="w-2.5 h-2.5 bg-[#005823] rounded-full shadow-inner" />
                  </div>
                  <div className="flex-1 mt-0.5">
                    <span className="text-[#231F2080] text-xs font-bold uppercase tracking-wider">
                      Pickup
                    </span>
                    <p className="text-[#231F20BF] text-base sm:text-[17px] font-medium leading-snug">
                      {pickupAddress}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 relative z-10">
                  <div className="w-8 h-8 bg-[#E6EFE9] rounded-full flex items-center justify-center flex-shrink-0 shadow-sm border border-[#0058231A]">
                    <MapPin className="w-3.5 h-3.5 text-[#005823]" />
                  </div>
                  <div className="flex-1 mt-0.5">
                    <span className="text-[#231F2080] text-xs font-bold uppercase tracking-wider">
                      Dropoff
                    </span>
                    <p className="text-[#231F20BF] text-base sm:text-[17px] font-medium leading-snug">
                      {dropoffAddress}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full rounded-2xl border border-green-100 bg-gradient-to-br from-[#F8FCF9] to-white p-4 shadow-sm lg:w-1/4 lg:min-w-[260px]">
              <div className="flex flex-col gap-3 sm:text-right">
                <span
                  className={`inline-flex w-fit px-3 py-1 text-xs font-medium rounded-full border h-fit sm:ml-auto ${getStatusStyles(
                    alert?.status,
                  )}`}
                >
                  {alert?.status || "Pending"}
                </span>

                <div className="space-y-2">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
                    <span className="text-[11px] uppercase tracking-wide text-gray-500">
                      Booking Price
                    </span>
                    <span className="text-xl sm:text-2xl font-bold text-[#2D6A3E] leading-none">
                      ₦{Number(alert?.BookingPrice || 0).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
                    <span className="text-[11px] uppercase tracking-wide text-gray-500">
                      Platform Fee
                    </span>
                    <span className="text-lg sm:text-xl font-semibold text-[#2D6A3E] leading-none">
                      ₦{Number(alert?.platformFee || 0).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
                    <span className="text-[11px] uppercase tracking-wide text-gray-500">
                      Rider Receives
                    </span>
                    <span className="text-lg sm:text-xl font-semibold text-[#2D6A3E] leading-none">
                      ₦{Number(alert?.RiderReceives || 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 border-t pt-4 mt-3">
            <button
              onClick={() => onAcceptBooking?.(alert)}
              disabled={accepting}
              className="w-full sm:w-auto px-8 py-3 bg-[#2D6A3E] text-white cursor-pointer rounded-xl font-bold hover:bg-[#1f4a2a] transition-all text-sm sm:text-base active:scale-95 shadow-md shadow-green-900/10"
            >
              {accepting ? "Accepting..." : "Accept Booking"}
            </button>

            {String(alert?.status || "").toLowerCase() === "awaiting response" && (
              <button className="w-full sm:w-auto px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-all flex items-center justify-center gap-2 text-sm active:scale-95">
                Awaiting Response
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
