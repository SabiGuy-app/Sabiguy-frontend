import { useEffect, useMemo, useState } from "react";
import {
  BadgeCheck,
  Banknote,
  CalendarDays,
  Clock3,
  MapPin,
  MapPinned,
  Star,
  Wrench,
  X,
} from "lucide-react";

const SERVICE_PLACE_LABELS = {
  customer_address: "Customer's Address",
  provider_address: "Provider's Address",
  walk_in: "Walk in Salon",
};

const ACCEPTANCE_WINDOW_MS = 3 * 60 * 1000;

const getDeadline = (booking, alert) => {
  const serverDeadline =
    booking?.providerResponseDeadlineAt ||
    booking?.responseDeadlineAt ||
    booking?.acceptanceDeadlineAt ||
    booking?.acceptanceExpiresAt ||
    booking?.expiresAt ||
    booking?.expiryDate ||
    alert?.providerResponseDeadlineAt ||
    alert?.acceptanceDeadlineAt;
  if (serverDeadline) return serverDeadline;

  const createdAt = booking?.createdAt || alert?.createdAt;
  if (createdAt) {
    const createdTimestamp = new Date(createdAt).getTime();
    if (Number.isFinite(createdTimestamp)) {
      return new Date(createdTimestamp + ACCEPTANCE_WINDOW_MS).toISOString();
    }
  }

  const bookingId = booking?._id || alert?.id;
  if (!bookingId || typeof window === "undefined") return null;
  const storageKey = `provider_accept_deadline_${bookingId}`;
  try {
    const savedDeadline = window.localStorage.getItem(storageKey);
    if (savedDeadline) return savedDeadline;
    const fallbackDeadline = new Date(Date.now() + ACCEPTANCE_WINDOW_MS).toISOString();
    window.localStorage.setItem(storageKey, fallbackDeadline);
    return fallbackDeadline;
  } catch {
    return new Date(Date.now() + ACCEPTANCE_WINDOW_MS).toISOString();
  }
};

const formatDateTime = (booking) => {
  const dateValue = booking?.scheduleDate || booking?.startDate;
  if (!dateValue) return "Not specified";

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "Not specified";
  const dateText = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const time = booking?.scheduledTime ||
    date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).replace(":00", "");

  return `${dateText} - ${time}`;
};

const formatDuration = (booking) => {
  const duration = booking?.estimatedDuration?.value;
  const unit = booking?.estimatedDuration?.unit;
  if (duration != null) return `${duration} ${unit || "minutes"}`;
  return booking?.serviceDetails?.duration || booking?.duration || "Not specified";
};

const formatPrice = (value) =>
  `₦${Number(value || 0).toLocaleString("en-NG")}`;

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-2.5">
      {icon}
      <div className="min-w-0">
        <p className="text-[13px] font-semibold leading-4 text-[#333333]">{label}</p>
        <p className="mt-0.5 break-words text-[13px] leading-5 text-[#777777]">{value || "Not specified"}</p>
      </div>
    </div>
  );
}

export default function AlertDetailsModal({
  isOpen,
  onClose,
  alert: alertData,
  onAccept,
  onDecline,
  accepting = false,
}) {
  const booking = alertData?.originalData || {};
  const customer = booking?.userId && typeof booking.userId === "object"
    ? booking.userId
    : {};
  const customerName = customer.fullName ||
    [customer.firstName, customer.lastName].filter(Boolean).join(" ") ||
    alertData?.customerName ||
    "Customer";
  const avatar = customer.profilePicture || customer.avatar || customer.image || "/avatar.png";
  const rating = customer.rating || booking.userRating || {};
  const averageRating = Number(rating.average ?? rating.score);
  const reviewCount = Number(rating.count ?? rating.reviewCount ?? 0);
  const address = booking?.location?.address ||
    booking?.pickupLocation?.address || alertData?.location || "Address unavailable";
  const pricingOption = String(
    booking?.serviceDetails?.pricingOption || booking?.pricingOption || "customer_address",
  ).toLowerCase();
  const serviceLocation = SERVICE_PLACE_LABELS[pricingOption] ||
    pricingOption.replace(/_/g, " ");
  const serviceName = booking?.serviceDetails?.serviceName ||
    booking?.subCategory || alertData?.title || "Service request";
  const serviceCost = booking?.agreedPrice ?? booking?.budget ?? booking?.totalAmount ?? alertData?.agreedPrice;
  const note = booking?.additionalNote || booking?.notes || booking?.pickupNote || "";
  const deadline = getDeadline(booking, alertData);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    if (!isOpen || !deadline) return undefined;
    const timer = window.setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [deadline, isOpen]);

  const timeRemaining = useMemo(() => {
    if (!deadline) return null;
    const seconds = Math.max(0, Math.floor((new Date(deadline).getTime() - currentTime) / 1000));
    return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  }, [currentTime, deadline]);

  if (!isOpen || !alertData) return null;

  const handleAccept = async () => {
    setActionError("");
    try {
      await onAccept?.(alertData);
    } catch (error) {
      setActionError(error?.response?.data?.message || error?.message || "Could not accept this request.");
    }
  };

  const handleDecline = () => {
    setActionError("");
    onDecline?.(alertData);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 sm:p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose?.();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="hire-alert-details-title"
        className="flex max-h-[min(92vh,720px)] w-full max-w-[660px] flex-col overflow-hidden rounded-xl bg-white shadow-xl"
      >
        <header className="flex shrink-0 items-center justify-between border-b border-gray-200 px-5 py-4 sm:px-6">
          <h2 id="hire-alert-details-title" className="text-base font-semibold text-[#252525]">
            Service Details
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close service details"
            className="rounded p-1 text-[#555555] transition hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="min-h-0 overflow-y-auto px-5 py-5 sm:px-6">
          <div className="flex items-center gap-3.5">
            <img
              src={avatar}
              alt=""
              className="h-16 w-16 shrink-0 rounded-full bg-gray-100 object-cover"
              onError={(event) => { event.currentTarget.src = "/avatar.png"; }}
            />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5">
                <h3 className="text-base font-semibold leading-5 text-[#292929]">{customerName}</h3>
                {(customer.emailVerified || customer.kycVerified) && (
                  <BadgeCheck className="h-4 w-4 text-[#43875B]" aria-label="Verified customer" />
                )}
              </div>
              {Number.isFinite(averageRating) && (
                <div className="mt-1 flex items-center gap-1 text-xs text-[#777777]">
                  <Star className="h-3.5 w-3.5 fill-[#F6B400] text-[#F6B400]" />
                  <span className="font-medium text-[#333333]">{averageRating.toFixed(1)}</span>
                  {reviewCount > 0 && <span>({reviewCount} reviews)</span>}
                </div>
              )}
              <div className="mt-1 flex min-w-0 items-center gap-1 text-xs text-[#888888]">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{customer.city || customer.currentLocation?.address || address}</span>
              </div>
            </div>
          </div>

          {actionError && (
            <div role="alert" className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {actionError}
            </div>
          )}

          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleAccept}
              disabled={accepting}
              className="min-h-10 rounded-md bg-[#347D53] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#286642] disabled:cursor-wait disabled:opacity-60"
            >
              {accepting ? "Accepting..." : "Accept Request"}
            </button>
            <button
              type="button"
              onClick={handleDecline}
              disabled={accepting}
              className="min-h-10 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-[#555555] transition hover:bg-gray-50 disabled:opacity-60"
            >
              Decline
            </button>
          </div>

          <section className="mt-5 border-t border-gray-100 pt-4">
            <div className="mb-3 flex items-start justify-between gap-4">
              <h3 className="text-sm font-semibold text-[#333333]">Booking Information</h3>
              <div className="shrink-0 text-right">
                <p className="text-[11px] text-[#777777]">Time left to accept</p>
                <p className="mt-0.5 text-xl font-bold leading-6 text-[#347D53]">
                  {timeRemaining || "--:--"}
                </p>
              </div>
            </div>

            <div className="space-y-3.5">
              <InfoRow icon={<Wrench className="mt-0.5 h-[18px] w-[18px] shrink-0 text-[#43875B]" />} label="Service" value={serviceName} />
              <InfoRow icon={<MapPinned className="mt-0.5 h-[18px] w-[18px] shrink-0 text-[#43875B]" />} label="Service Location" value={serviceLocation} />
              <InfoRow icon={<CalendarDays className="mt-0.5 h-[18px] w-[18px] shrink-0 text-[#43875B]" />} label="Start Date & Time" value={formatDateTime(booking)} />
              <InfoRow icon={<Clock3 className="mt-0.5 h-[18px] w-[18px] shrink-0 text-[#43875B]" />} label="Duration" value={formatDuration(booking)} />
              <InfoRow icon={<MapPin className="mt-0.5 h-[18px] w-[18px] shrink-0 text-[#43875B]" />} label="Location" value={address} />
              <InfoRow icon={<Banknote className="mt-0.5 h-[18px] w-[18px] shrink-0 text-[#43875B]" />} label="Service Cost" value={formatPrice(serviceCost)} />
            </div>

            <div className="mt-4">
              <p className="mb-1.5 text-xs text-[#888888]">Additional note</p>
              <div className="min-h-[56px] rounded-md border border-[#E4EAF0] bg-[#F7FAFC] px-3 py-2.5 text-xs leading-4 text-[#888888]">
                {note || "No additional note"}
              </div>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
