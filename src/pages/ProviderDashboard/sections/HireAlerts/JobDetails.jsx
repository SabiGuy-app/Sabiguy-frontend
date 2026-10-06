import {
  Calendar,
  MapPin,
  ChevronLeft,
  Star,
  MessageCircle,
  Settings,
  PhoneCall,
  Verified,
  Wrench,
  Copy,
  Check,
  X,
  MapPinned,
  Clock3,
  Banknote,
} from "lucide-react";
import { createElement, useEffect, useState } from "react";
import { canMessage } from "../../../../utils/chat.utils";
import { useCallContext } from "../../../../components/shared/CallContext";

export default function JobDetailsModal({
  isOpen,
  onClose,
  job,
  onMessageCustomer,
  onShowNavigation,
  onStartService,
  onArrive,
  onMarkAsCompleted,
  onCancel,
}) {
  const [copied, setCopied] = useState(false);
  const [clockNow, setClockNow] = useState(Date.now());
  const callContext = useCallContext();

  useEffect(() => {
    if (!isOpen) return undefined;
    const interval = setInterval(() => setClockNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const formatTitle = (value) =>
    String(value || "Untitled job")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  if (!isOpen) return null;

  const booking = job?.originalData || {};
  const beautyJob = String(booking?.serviceType || "").toLowerCase().includes("beauty");
  if (beautyJob) {
    const serviceName = booking?.serviceDetails?.serviceName || booking?.subCategory || job?.title || "Service";
    const servicePlace = {
      walk_in: "Walk in Salon",
      provider_address: "Provider's Address",
      customer_address: "Customer's Address",
    }[booking?.serviceDetails?.pricingOption] || "";
    const scheduleDate = booking?.scheduleDate || booking?.startDate;
    const scheduledAt = scheduleDate ? new Date(scheduleDate) : null;
    const scheduledTime = booking?.scheduledTime || booking?.scheduleTime || "";
    const timeMatch = scheduledTime.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (scheduledAt && timeMatch) {
      let hours = Number(timeMatch[1]) % 12;
      if (timeMatch[3].toUpperCase() === "PM") hours += 12;
      scheduledAt.setHours(hours, Number(timeMatch[2]), 0, 0);
    }
    const secondsToStart = scheduledAt
      ? Math.max(0, Math.floor((scheduledAt.getTime() - clockNow) / 1000))
      : null;
    const countdown = secondsToStart == null
      ? "--:--:--"
      : `${String(Math.floor(secondsToStart / 3600)).padStart(2, "0")}:${String(Math.floor((secondsToStart % 3600) / 60)).padStart(2, "0")}:${String(secondsToStart % 60).padStart(2, "0")}`;
    const status = String(booking?.status || job?.status || "").toLowerCase().replace(/\s+/g, "_");
    const inProgress = status === "in_progress";
    const enRoute = status === "enroute_to_pickup";
    const atDestination = status === "arrived_at_pickup";
    const needsTravel = booking?.serviceDetails?.pricingOption === "customer_address";
    const actionLabel = inProgress ? "Mark as Completed" : atDestination || !needsTravel ? "Start Service" : enRoute ? "Arrived at Destination" : "En Route";
    const handleAction = () => {
      if (inProgress) onMarkAsCompleted?.(job);
      else if (atDestination || !needsTravel) onStartService?.(job);
      else if (enRoute) onArrive?.(job);
      else onShowNavigation?.(job);
    };
    const customer = booking?.userId && typeof booking.userId === "object" ? booking.userId : {};
    const serviceDate = scheduleDate && !Number.isNaN(new Date(scheduleDate).getTime())
      ? new Date(scheduleDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
      : "Not provided";
    const dateTime = [serviceDate, scheduledTime].filter(Boolean).join(" - ");
    const duration = booking?.serviceDetails?.duration || (booking?.estimatedDuration?.value ? `${booking.estimatedDuration.value} ${booking.estimatedDuration.unit || "minutes"}` : "Not provided");
    const details = [
      { icon: Wrench, label: "Service", value: serviceName },
      { icon: MapPinned, label: "Service Location", value: servicePlace || "Not provided" },
      { icon: Calendar, label: "Start Date & Time", value: dateTime },
      { icon: Clock3, label: "Duration", value: duration },
      { icon: MapPin, label: "Location", value: booking?.location?.address || job?.location || "Not provided" },
      { icon: Banknote, label: "Service Cost", value: `₦${Number(booking?.agreedPrice ?? booking?.serviceDetails?.price ?? booking?.budget ?? 0).toLocaleString()}` },
    ];

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-3 sm:p-5">
        <section role="dialog" aria-modal="true" aria-labelledby="beauty-job-details-title" className="relative max-h-[94dvh] w-full max-w-[520px] overflow-y-auto rounded-[8px] bg-white shadow-xl">
          <header className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-5 py-3">
            <h2 id="beauty-job-details-title" className="text-[14px] font-semibold text-[#252525]">Service Details</h2>
            <button onClick={onClose} aria-label="Close service details" className="rounded p-1 text-gray-700 hover:bg-gray-100"><X size={18} /></button>
          </header>

          <div className="px-5 pb-5 pt-4 sm:px-6">
            <div className="flex items-center gap-3">
              <img src={customer?.profilePicture || "/avatar.png"} alt={customer?.fullName || "Customer"} className="h-12 w-12 rounded-full bg-gray-100 object-cover" />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="truncate text-[14px] font-semibold text-[#333]">{customer?.fullName || "Customer"}</p>
                  {customer?.emailVerified && <Check className="h-3.5 w-3.5 text-[#438B66]" />}
                </div>
                {(customer?.rating?.average != null || customer?.location?.address) && (
                  <div className="flex flex-wrap items-center gap-x-2 text-[10px] text-[#888]">
                    {customer?.rating?.average != null && <span><span className="text-[#F2B600]">★</span>{Number(customer.rating.average).toFixed(1)} ({customer?.rating?.count ?? 0} reviews)</span>}
                    {customer?.location?.address && <span className="inline-flex items-center gap-0.5"><MapPin size={11} />{customer.location.address}</span>}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <button onClick={() => callContext?.openCall?.({ booking, targetOverride: { targetId: customer?._id || booking?.userId, targetType: "buyer", targetName: customer?.fullName || "Customer" } })} className="flex h-9 items-center justify-center gap-2 rounded-[4px] border border-gray-200 text-[11px] text-[#777] hover:bg-gray-50"><PhoneCall className="h-3.5 w-3.5" />Call</button>
              <button onClick={() => onMessageCustomer?.(job)} className="flex h-9 items-center justify-center gap-2 rounded-[4px] border border-gray-200 text-[11px] text-[#777] hover:bg-gray-50"><MessageCircle className="h-3.5 w-3.5" />Message</button>
            </div>
            <button onClick={() => onCancel?.(job)} className="mt-2 w-full text-right text-[10px] font-medium text-red-600 hover:underline">Cancel Request</button>

            <div className="mt-3 flex items-start justify-between gap-3">
              <h3 className="pt-1 text-[14px] font-semibold text-[#333]">Booking Information</h3>
              <div className="shrink-0 text-right">
                <p className="text-[10px] text-[#888]">Service Starts In:</p>
                <p className="text-[21px] font-semibold leading-7 tabular-nums text-[#438B66]">{countdown}</p>
              </div>
            </div>

            <div className="mt-1 space-y-2.5">
              {details.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-2">
                  {createElement(Icon, { className: "mt-0.5 h-3.5 w-3.5 shrink-0 text-[#438B66]" })}
                  <div><p className="text-[11px] font-semibold leading-4 text-[#333]">{label}</p><p className="text-[11px] leading-4 text-[#777]">{value || "Not provided"}</p></div>
                </div>
              ))}
            </div>

            <div className="mt-3">
              <p className="mb-1 text-[10px] text-[#888]">Additional note</p>
              <div className="min-h-10 rounded-[4px] border border-gray-200 bg-[#F7FAFC] px-3 py-2 text-[10px] leading-4 text-[#888]">{booking?.pickupNote || "No additional notes provided."}</div>
            </div>

            <button
              onClick={handleAction}
              className="mt-3 w-full rounded-[4px] bg-[#438B66] px-4 py-2.5 text-[11px] font-medium text-white hover:bg-[#347653]"
            >
              {actionLabel}
            </button>
          </div>
        </section>
      </div>
    );
  }

  const formatDateTime = (value) => {
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
  console.log(job);

  return (
    <div>
      <div className="fixed inset-0 bg-gray-50  bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white sm:p-5 rounded-2xl max-w-3xl w-full max-h-[95vh] overflow-y-auto">
          {/* Header */}
          <div className="top-0 bg-white border-b border-gray-200 px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-semibold">Service Details</h2>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Service Title */}
            <div>
              <h3 className="text-lg font-semibold mb-4">
                {formatTitle(job?.title)}
              </h3>

              {/* Provider Info */}
              <div className="lg:flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={
                      job?.originalData?.userId?.profilePicture || "/avatar.png"
                    }
                    alt="Customer"
                    className="w-14 h-14 rounded-full object-cover"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[16px] sm:text-base">
                        {job?.originalData?.userId?.fullName || "Customer"}
                      </span>
                      <Verified className="w-4 h-4 text-[#2D6A3E]" />
                    </div>
                    <div>
                      {job.ratings && (
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{job.ratings}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-sm">
                      <MapPin className="w-4 h-4" />
                      <span className="font-medium">{job.location}</span>
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <span className="px-2 py-1 bg-green-100 text-xs font-medium rounded-full border border-green-200 whitespace-nowrap self-start">
                  {job.status}{" "}
                </span>
              </div>
              <div className="flex mt-3 gap-3 w-full">
                <button
                  onClick={() =>
                    callContext?.openCall?.({
                      booking: job?.originalData || job,
                      targetOverride: {
                        targetId:
                          job?.originalData?.userId?._id ||
                          job?.originalData?.userId ||
                          job?.userId?._id ||
                          job?.userId,
                        targetType: "buyer",
                        targetName:
                          job?.originalData?.userId?.fullName ||
                          job?.originalData?.customerName ||
                          "Customer",
                      },
                    })
                  }
                  className="flex-1 py-2 mt-3 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <PhoneCall className="w-4 h-4" />
                  Call
                </button>
                {canMessage(job?.status || job?.originalData?.status) && (
                  <button
                    className="flex-1 py-2 mt-3 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                    onClick={() => onMessageCustomer?.(job)}
                  >
                    <MessageCircle className="w-4 h-4" />
                    Message
                  </button>
                )}
              </div>
            </div>

            {/* Booking Information */}
            <div className="border-t border-gray-200">
              <h4 className="font-semibold mb-3 mt-2">Booking Information</h4>
              <div className="space-y-3">
                {/* Booking ID */}
                {job?.orderId && (
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-[#E6EFE9] rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-[#005823] text-[10px] font-bold">
                        #
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-sm font-medium text-gray-700">
                        Booking ID
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-gray-600 font-bold uppercase transition-all duration-300">
                          {job.orderId}
                        </p>
                        <button
                          onClick={() => handleCopy(job.fullOrderId)}
                          className="p-1 hover:bg-gray-100 rounded transition-colors text-gray-400"
                          title="Copy Full Booking ID"
                        >
                          {copied ? (
                            <Check size={14} className="text-green-500" />
                          ) : (
                            <Copy size={14} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                {/* Start Date & Time */}
                <div className="flex items-start gap-3">
                  <Wrench className="w-5 h-5 text-[#2D6A3E] mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Service Type
                    </p>
                    <p className="text-sm text-gray-600">
                      {formatTitle(job?.title)}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-[#2D6A3E] mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Created At:
                    </p>
                    <p className="text-sm text-gray-600">
                      {formatDateTime(
                        job?.createdAt || job?.originalData?.createdAt,
                      )}
                    </p>
                  </div>
                </div>
                {(job?.scheduleType === "scheduled" ||
                  job?.originalData?.scheduleType === "scheduled") && (
                  <>
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-[#2D6A3E] mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Scheduled Date
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatDateTime(
                            job?.scheduleDate ||
                              job?.originalData?.scheduleDate,
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-[#2D6A3E] mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Scheduled Time
                        </p>
                        <p className="text-sm text-gray-600">
                          {job?.scheduleTime ||
                            job?.originalData?.scheduleTime ||
                            "N/A"}
                        </p>
                      </div>
                    </div>
                  </>
                )}

                {/* Location */}
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-[#E6EFE9] rounded-full flex items-center justify-center flex-shrink-0">
                    <div className="w-2 h-2 bg-[#005823] rounded-full" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Pickup Location
                    </p>
                    <p className="text-sm text-gray-600">
                      {job.pickupLocation.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#2D6A3E] mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Dropoff Location
                    </p>
                    <p className="text-sm text-gray-600">
                      {job.dropoffLocation.address}
                    </p>
                  </div>
                </div>

                {/* Service Cost */}
                <div className="flex items-start  gap-3 border-b border-gray-200">
                  <svg
                    className="w-5 h-5 text-[#2D6A3E] mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Service Cost
                    </p>
                    <p className="text-sm m mb-3 text-gray-600">
                      ₦{(job.agreedPrice || 0).toLocaleString()}
                    </p>
                  </div>
                  <div></div>
                </div>
              </div>
            </div>

            {/* Additional Notes */}
            <div>
              <h4 className="font-semibold mb-3">Additional notes</h4>
              <div className="bg-blue-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-600 italic">
                  {job?.originalData?.pickupNote ||
                    "No additional notes provided by the customer."}
                </p>
              </div>
            </div>

            <p className="flex mt-6 items-center text-sm justify-center">
              Update the job status to keep the customer informed
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
