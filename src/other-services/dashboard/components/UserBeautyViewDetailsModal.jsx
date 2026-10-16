import React from "react";
import { useNavigate } from "react-router-dom";
import {
  X,
  BadgeCheck,
  Star,
  MapPin,
  Phone,
  MessageCircle,
  Wrench,
  MapPinHouse,
  CalendarDays,
  Clock,
  Banknote,
} from "lucide-react";
import { formatMoney } from "../utils/bookingFormat";
import CancelBookingButton from "../../../components/CancelBookingButton";
import { useCallContext } from "../../../components/shared/CallContext";

const HIDDEN_STATUSES = [
  "completed",
  "cancelled",
  "expired",
  "declined",
  "user_accepted_completion",
  "funds_released",
];

const normalizeStatus = (status) =>
  String(status || "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");

const UserBeautyViewDetailsModal = ({
  provider,
  providerArea,
  booking,
  serviceDate,
  durationLabel,
  dropoffAddress,
  countdownText,
  pickupNote,
  cancel,
  close,
  refreshRequests,
}) => {
  const navigate = useNavigate();
  const callContext = useCallContext();
  const isHiddenBtn = !HIDDEN_STATUSES.includes(
    normalizeStatus(booking?.status),
  );
  const providerId = provider?._id || provider?.id || booking?.provider?._id;
//   console.log(
//     "status:",
//     booking.status,
//     "| apiStatus:",
//     booking.apiStatus,
//     "| raw:",
//     booking.raw?.status,
//   );

  const CAN_CONTACT = ["pending", "accepted", "active"];
const CAN_CANCEL = ["pending", "accepted"];
const SHOW_COUNTDOWN = ["accepted", "active"];

const status = booking?.status;
const canContact = CAN_CONTACT.includes(status);
const canCancel = CAN_CANCEL.includes(status);
const showCountdown = SHOW_COUNTDOWN.includes(status);

  const handleCallProvider = () => {
    if (!providerId || !booking?.id) return;

    callContext?.openCall?.({
      booking: booking.raw || booking,
      targetOverride: {
        targetId: providerId,
        targetType: "provider",
        targetName: provider?.fullName || "Provider",
      },
    });
  };

  const handleMessageProvider = () => {
    if (!booking?.id) return;
    navigate(`/dashboard/chat?bookingId=${booking.id}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4 py-4">
      <div className="relative flex max-h-[92vh] w-full max-w-[670px] flex-col overflow-hidden rounded-xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 className="text-xl font-semibold text-[#231F20]">
            Service Details
          </h2>
          <button
            type="button"
            onClick={close}
            aria-label="Close service details"
            className="text-[#231F20BF] hover:text-[#231F20]"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto px-5 py-4">
          {/* Provider Profile Summary */}
          <div className="flex items-center gap-5 pb-4 border-b border-gray-100">
            <img
              src={provider?.profilePicture || "/avatar.png"}
              alt={provider?.fullName}
              className="h-20 w-20 rounded-full object-cover"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-[#231F20]">
                  {provider?.fullName}
                </h3>
                <BadgeCheck size={18} className="text-[#2F7B4F]" />
              </div>
              <p className="mt-1 flex items-center gap-1 text-sm text-[#231F20BF]">
                <Star size={16} className="fill-yellow-400 text-yellow-400" />
                <span className="font-semibold text-[#231F20]">
                  {provider?.rating}
                </span>
                <span>({provider?.reviews} reviews)</span>
              </p>
              <p className="mt-1 flex items-center gap-1 text-sm text-[#231F2080]">
                <MapPin size={16} />
                {providerArea}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-5 flex w-full items-center gap-5">
            {canContact && (
              <button
                type="button"
                onClick={handleCallProvider}
                disabled={!providerId || !booking?.id}
                className="flex h-11 w-full items-center justify-center gap-3 rounded border border-gray-200 text-[#231F2080]"
              >
                <Phone size={20} />
                Call
              </button>
            )}
            {canContact && (
              <button
                type="button"
                onClick={handleMessageProvider}
                disabled={!booking?.id}
                className="flex h-11 w-full items-center justify-center gap-3 rounded border border-gray-200 text-[#231F2080]"
              >
                <MessageCircle size={20} />
                Message
              </button>
            )}

            {canCancel && (
              <CancelBookingButton
                bookingId={booking.id}
                status={booking.status}
                cancelRequest={(id) => cancel(id)}
                role="user"
                onSuccess={async () => {
                  await refreshRequests();
                  close();
                }}
                className="flex h-11 w-full items-center justify-center gap-3 rounded border bg-white text-red-600  border-red-300  hover:bg-red-50 transition-colors"
              />
            )}
          </div>

          {/* Booking Information */}
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
            <div>
              <h3 className="mb-4 text-base font-semibold text-[#231F20]">
                Booking Information
              </h3>
              <dl className="space-y-3.5">
                <div className="flex gap-4">
                  <Wrench size={20} className="mt-1 text-[#2F7B4F]" />
                  <div>
                    <dt className="text-sm font-semibold text-[#231F20]">
                      Service
                    </dt>
                    <dd className="mt-1 text-sm text-[#231F20BF]">
                      {booking?.service}
                    </dd>
                  </div>
                </div>
                <div className="flex gap-4">
                  <MapPinHouse size={20} className="mt-1 text-[#2F7B4F]" />
                  <div>
                    <dt className="text-sm font-semibold text-[#231F20]">
                      Service Location
                    </dt>
                    <dd className="mt-1 text-sm text-[#231F20BF]">
                      {booking?.label}
                    </dd>
                  </div>
                </div>
                <div className="flex gap-4">
                  <CalendarDays size={20} className="mt-1 text-[#2F7B4F]" />
                  <div>
                    <dt className="text-sm font-semibold text-[#231F20]">
                      Start Date &amp; Time
                    </dt>
                    <dd className="mt-1 text-sm text-[#231F20BF]">
                      {serviceDate}
                    </dd>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Clock size={20} className="mt-1 text-[#2F7B4F]" />
                  <div>
                    <dt className="text-sm font-semibold text-[#231F20]">
                      Duration
                    </dt>
                    <dd className="mt-1 text-sm text-[#231F20BF]">
                      {durationLabel}
                    </dd>
                  </div>
                </div>
                <div className="flex gap-4">
                  <MapPin size={20} className="mt-1 text-[#2F7B4F]" />
                  <div>
                    <dt className="text-sm font-semibold text-[#231F20]">
                      Location
                    </dt>
                    <dd className="mt-1 text-sm text-[#231F20BF]">
                      {dropoffAddress}
                    </dd>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Banknote size={20} className="mt-1 text-[#2F7B4F]" />
                  <div>
                    <dt className="text-sm font-semibold text-[#231F20]">
                      Service Cost
                    </dt>
                    <dd className="mt-1 text-sm text-[#231F20BF]">
                      {formatMoney(booking?.price)}
                    </dd>
                  </div>
                </div>
              </dl>
            </div>

            {showCountdown && (
              <div className="shrink-0 text-left sm:text-right">
                <p className="text-sm text-[#231F2080]">Service Starts In:</p>
                <p className="mt-2 text-4xl font-bold tabular-nums text-[#2F7B4F]">
                  {countdownText}
                </p>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="mt-5">
            <p className="mb-2 text-xs text-[#231F2080]">Additional note</p>
            <p className="min-h-[54px] rounded-lg border border-gray-100 bg-[#F7FAFC] px-4 py-3 text-sm leading-relaxed text-[#231F2080]">
              {pickupNote || "No additional notes provided."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserBeautyViewDetailsModal;
