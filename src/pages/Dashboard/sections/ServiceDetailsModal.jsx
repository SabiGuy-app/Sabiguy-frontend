import {
  PhoneCall,
  MessageCircle,
  Star,
  MapPin,
  Navigation,
  Award,
  Clock,
  BadgeCheck,
} from "lucide-react";
import { FiChevronLeft } from "react-icons/fi";
import distance from "/distance.png";
import { useNavigate } from "react-router-dom";
import { useCallContext } from "../../../components/shared/CallContext";
import { useState } from "react";
import UserCancellationModal from "../../../components/UserCancellationModal";
import CancelBookingButton from "../../../components/CancelBookingButton";

export default function ServiceDetailsModal({ isOpen, onClose, request }) {
  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  const navigate = useNavigate();
  const callContext = useCallContext();
  const bookingStatus = String(
    request?.originalData?.status || request?.status || "",
  )
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");

  if (!isOpen) return null;
  console.log(request);
  const bookingId = request?.id;
  console.log(bookingId);

  const handleMessageProvider = () => {
    if (!bookingId) return;
    navigate(`/dashboard/chat?bookingId=${bookingId}`);
  };

  const getStatusStyles = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-[#FFC107] border-red-200",
      paid_escrow: "bg-[#007BFF1A] text-[#007BFF] border-[#007BFF]",
      cancelled: "bg-red-100 text-red-700 border-red-200",
      active: "bg-blue-100 text-blue-600 border-blue-200",
      "enroute to pickup": "bg-blue-100 text-blue-800 border-blue-200",
      "arrived at pickup": "bg-blue-100 text-blue-800 border-blue-200",
      "enroute to dropoff": "bg-blue-100 text-blue-800 border-blue-200",
      "arrived at dropoff": "bg-blue-100 text-blue-800 border-blue-200",
      "waiting confirmation": "bg-orange-200 text-orange-800 border-orange-200",
      completed: "bg-green-100 text-green-700 border-green-200",
      user_accepted_completion: "bg-green-100 text-green-700 border-green-200",
      "no provider available": "bg-red-50 text-red-700 border-red-200",
      expired: "bg-red-100 text-red-700 border-red-200",
      "funds released": "bg-green-100 text-green-700 border-green-200",
    };
    return styles[status.toLowerCase()] || styles.pending;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-50/50 p-3 sm:p-4">
      <div className="max-h-[95vh] w-full max-w-6xl overflow-y-auto rounded-2xl bg-white shadow-xl sm:p-5">
        <div className="mb-4 flex justify-between flex-col gap-3 border-b border-gray-200 px-2 py-4 sm:mb-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="text-gray-600 transition-colors hover:text-gray-900"
            >
              <FiChevronLeft size={20} />
            </button>
            <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">
              Service Details
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {request.orderId && (
              <span className="w-fit rounded-full border border-[#0058234D] bg-[#0058231A] px-2 py-1 font-mono text-[10px] text-[#005823] sm:text-[12px]">
                {request.orderId}
              </span>
            )}

            {request.status && (
              <span
                className={`rounded-full border px-3 py-1 text-[10px] font-medium capitalize sm:text-[12px] ${getStatusStyles(
                  request.status,
                )}`}
              >
                {request.status.replace(/_/g, " ")}
              </span>
            )}
          </div>
        </div>

        <div className="grid gap-4 space-y-4 md:grid-cols-2 md:gap-8 md:space-y-0">
          <div className="space-y-6">
            <div className="space-y-6 rounded-2xl p-4 shadow-sm sm:p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-6">
                <img
                  src={
                    request.providerImage ||
                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop"
                  }
                  alt={request.providerName}
                  className="h-16 w-16 shrink-0 self-center rounded-full object-cover lg:self-start"
                />
                <div className="w-full grow text-center lg:text-left">
                  <div className="mb-1 flex items-center justify-center gap-2 lg:justify-start">
                    <h2 className="text-base font-semibold capitalize text-gray-900">
                      {request.providerName ?? "Provider"}
                    </h2>
                    <span className="text-[#8BC53F]">
                      <BadgeCheck className="h-5 w-5" />
                    </span>
                  </div>
                  <p className="mb-1 text-sm capitalize text-gray-600">
                    {request.title?.replace(/_/g, " ") || "—"}
                  </p>
                  {request.providerIdDisplay &&
                    request.providerIdDisplay !== "—" && (
                      <div className="mb-1">
                        <span className="inline-block rounded border border-gray-200 bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-500">
                          ID: {request.providerIdDisplay}
                        </span>
                      </div>
                    )}
                  <div className="flex items-center justify-center gap-1 text-[14px] text-gray-600 lg:justify-start">
                    <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium text-gray-900">
                      {request.providerRating ?? ""}
                    </span>
                    <span className="text-gray-500">
                      ({request.providerReviews ?? 0} reviews)
                    </span>
                  </div>
                  {request.providerDistance && (
                    <div className="mt-1 flex items-center justify-center gap-1 text-[14px] text-[#231F20BF] lg:justify-start">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{request.providerDistance} miles away</span>
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="mt-1 flex w-full justify-between gap-4 lg:mt-0 lg:w-auto lg:justify-start lg:gap-6">
                  <div className="flex flex-1 flex-col items-center md:flex-none">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full">
                      <Award className="h-5 w-5 text-[#005823]" />
                    </div>
                    <div className="text-base font-semibold text-[#231F20]">
                      {request.jobsDone ?? 0}
                    </div>
                    <div className="text-center text-[12px] text-[#231F2080]">
                      Jobs Done
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col items-center md:flex-none">
                    <div className="flex h-10 w-10 items-center justify-center">
                      <Clock className="h-5 w-5 text-[#231F20BF]" />
                    </div>
                    <div className="text-base font-semibold text-[#231F20]">
                      {"< 3 Mins"}
                    </div>
                    <div className="text-center text-[12px] text-[#231F2080]">
                      Response Time
                    </div>
                  </div>
                </div>
              </div>

              {![
                "cancelled",
                "funds_released",
                "no_provider_available",
                "booking_expired",
                "expired",
              ].includes(bookingStatus) && (
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={() =>
                      callContext?.openCall?.({
                        booking: request?.originalData || request,
                        targetOverride: {
                          targetId:
                            request?.originalData?.providerId?._id ||
                            request?.originalData?.providerId ||
                            request?.providerId?._id ||
                            request?.providerId,
                          targetType: "provider",
                          targetName:
                            request?.providerName ||
                            request?.originalData?.providerId?.fullName ||
                            "Provider",
                        },
                      })
                    }
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-3 transition-colors hover:bg-gray-50"
                  >
                    <span className="flex items-center justify-center gap-2 font-medium text-gray-700">
                      <PhoneCall className="h-4 w-4 text-gray-600" />
                      Call
                    </span>
                  </button>
                  <button
                    onClick={handleMessageProvider}
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-3 transition-colors hover:bg-gray-50"
                  >
                    <span className="flex items-center justify-center gap-2 font-medium text-gray-700">
                      <MessageCircle className="h-5 w-5 text-gray-600" />
                      Message
                    </span>
                  </button>
                  <CancelBookingButton
                    bookingId={bookingId}
                    role="user"
                    status={request?.originalData?.status || request?.status}
                    paymentStatus={
                      request?.originalData?.payment?.status ||
                      request?.payment?.status ||
                      request?.paymentStatus ||
                      request?.payment_status
                    }
                    className="flex-1 rounded-lg border border-red-300 bg-white px-4 py-3 text-red-600 transition-colors hover:bg-red-50"
                    title="Cancel"
                    onSuccess={() => {
                      setCancelModalOpen(false);
                      onClose?.();
                    }}
                  />
                  {/* {showCancelBtn && (
                    <button
                      type="button"
                      onClick={() => setCancelModalOpen(true)}
                      className="flex-1 flex items-center justify-center px-4 py-2.5 sm:py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg font-semibold hover:bg-red-100 transition-all active:scale-95"
                    >
                      {cancelling ? "Cancelling..." : "Cancel"}
                    </button>
                  )} */}
                </div>
              )}
              {/* {request.status?.toLowerCase() !== "cancelled" &&  (
                  <button
                    onClick={handleMessageProvider}
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-gray-600" />
                    <span className="font-medium text-gray-700">Message</span>
                  </button>
                )} */}
              {/* <button
                  onClick={onClose}
                  className="text-red-500 font-medium px-4 hover:text-red-600 transition-colors whitespace-nowrap"
                >
                  Cancel Request
                </button> */}
            </div>

            {request.providerVehicleImage && (
              <img
                src={request.providerVehicleImage}
                alt="Vehicle"
                className="w-full h-auto object-contain rounded-2xl bg-gray-50"
              />
            )}
          </div>

          <div>
            <div className="space-y-6 rounded-2xl border border-[#231F201A] px-4 py-5 sm:px-6 sm:py-6">
              <h3 className="text-base font-semibold text-[#231F20]">
                Job Summary
              </h3>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E6EFE9]">
                    <div className="h-3 w-3 rounded-full bg-[#005823]" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-[#231F20]">
                      Pickup Location
                    </div>
                    <div className="break-words text-sm text-[#231F20BF]">
                      {request.pickupAddress || "—"}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E6EFE9]">
                    <MapPin className="h-5 w-5 text-[#005823]" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-[#231F20]">
                      Dropoff Location
                    </div>
                    <div className="break-words text-sm text-[#231F20BF]">
                      {request.dropoffAddress || "—"}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                    <img src={distance} alt="" className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-[#231F20]">
                      Distance
                    </div>
                    <div className="break-words text-sm text-[#231F20BF]">
                      {request.distance || "—"}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                    <svg
                      className="h-5 w-5 text-[#005823]"
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
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-[#231F20]">
                      Fare
                    </div>
                    <div className="break-words text-sm text-[#231F20BF]">
                      {(request.totalAmount ??
                      request.total_amount ??
                      request.amount ??
                      request.total ??
                      request.finalPrice)
                        ? `₦${(request.totalAmount ?? request.total_amount ?? request.amount ?? request.total ?? request.finalPrice).toLocaleString()}`
                        : request.price != null
                          ? `₦${request.price.toLocaleString()}`
                          : "—"}
                    </div>
                  </div>
                </div>

                {/* Service Fee */}
                {(() => {
                  const baseFare =
                    request.agreedPrice ??
                    request.calculatedPrice ??
                    request.price ??
                    0;
                  const fee =
                    request.serviceFee ??
                    request.service_fee ??
                    request.fee ??
                    request.serviceCharge ??
                    Math.round(baseFare * 0.1);

                  if (fee > 0) {
                    return (
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 shrink-0 rounded-full" />
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-[#231F20]">
                            Service Charge (10%)
                          </div>
                          <div className="break-words text-sm text-[#231F20BF]">
                            ₦{fee.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>

              {/* Description */}
              {request.description && (
                <div className="mt-4">
                  <h4 className="mb-2 text-base font-semibold text-[#231F20]">
                    Description
                  </h4>
                  <p className="rounded-lg border border-gray-100 bg-gray-50 p-4 text-sm leading-relaxed text-[#231F20BF]">
                    {request.description}
                  </p>
                </div>
              )}

              <div>
                <h4 className="mb-3 text-base font-semibold text-[#231F20]">
                  Pickup notes{" "}
                  <span className="text-[14px] text-[#231F20BF]"></span>
                </h4>
                <p className="rounded-lg border border-gray-100 bg-gray-50 p-4 text-sm leading-relaxed text-[#231F20BF]">
                  {request.pickupNotes || "No pickup notes provided."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
