import { createElement } from "react";
import {
  Banknote,
  CalendarDays,
  Clock3,
  MapPin,
  MapPinned,
  ShieldCheck,
  Wrench,
  X,
} from "lucide-react";

function BookingRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-2.5">
      {createElement(Icon, {
        "aria-hidden": true,
        className: "mt-0.5 h-[18px] w-[18px] shrink-0 text-[#438B66]",
        strokeWidth: 2,
      })}
      <div className="min-w-0">
        <p className="text-[13px] font-semibold leading-5 text-[#292929]">{label}</p>
        <p className="break-words text-[13px] leading-5 text-[#777]">{value || "Not provided"}</p>
      </div>
    </div>
  );
}

export default function WaitingForPaymentModal({
  secondsLeft = 0,
  onClose = () => {},
  customer = {},
  service = "Service",
  serviceLocation = "",
  dateTime = "",
  duration = "",
  location = "",
  serviceCost = 0,
}) {
  const formatTime = (totalSeconds) => {
    const safeSeconds = Math.max(0, Number(totalSeconds) || 0);
    return `${String(Math.floor(safeSeconds / 60)).padStart(2, "0")}:${String(safeSeconds % 60).padStart(2, "0")}`;
  };

  const formatNaira = (value) => `₦${Number(value || 0).toLocaleString()}`;
  const rows = [
    { icon: Wrench, label: "Service", value: service },
    { icon: MapPinned, label: "Service Location", value: serviceLocation },
    { icon: CalendarDays, label: "Start Date & Time", value: dateTime },
    { icon: Clock3, label: "Duration", value: duration },
    { icon: MapPin, label: "Location", value: location },
    { icon: Banknote, label: "Service Cost", value: formatNaira(serviceCost) },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 sm:p-5">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="payment-progress-title"
        className="relative max-h-[94dvh] w-full max-w-[632px] overflow-y-auto rounded-[14px] bg-white px-5 pb-6 pt-7 shadow-xl sm:px-11 sm:pb-7 sm:pt-8"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close payment status"
          className="absolute right-4 top-4 rounded p-1 text-[#333] transition hover:bg-gray-100"
        >
          <X size={20} />
        </button>

        <h2 id="payment-progress-title" className="text-center text-[21px] font-semibold leading-7 text-[#292929] sm:text-[24px]">
          Payment in Progress
        </h2>
        <p className="mx-auto mt-1 max-w-[390px] text-center text-[13px] leading-[19px] text-[#999] sm:text-[14px]">
          The customer is completing payment. This booking will be confirmed once payment is received.
        </p>

        <div className="mt-4 text-center">
          <p className={`font-semibold tabular-nums text-[42px] leading-[1.15] tracking-[0.04em] sm:text-[46px] ${secondsLeft <= 30 ? "text-red-600" : secondsLeft <= 120 ? "text-amber-500" : "text-[#438B66]"}`}>
            {formatTime(secondsLeft)}
          </p>
          <p className="mt-1 text-[14px] text-[#777]">Payment window remaining</p>
        </div>

        <div className="mx-auto mt-6 flex w-full max-w-[420px] items-center gap-3">
          <img
            src={customer?.profilePicture || "/avatar.png"}
            alt={customer?.fullName || "Customer"}
            className="h-[68px] w-[68px] shrink-0 rounded-full bg-[#f2f2f2] object-cover"
          />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5">
              <p className="text-[16px] font-semibold text-[#333]">{customer?.fullName || "Customer"}</p>
              {customer?.emailVerified && <ShieldCheck aria-label="Verified" className="h-4 w-4 text-[#438B66]" />}
            </div>
            {customer?.rating?.average != null && (
              <p className="mt-0.5 text-[12px] text-[#777]">
                <span className="text-[#F2B600]">★</span> {Number(customer.rating.average).toFixed(1)}
                {customer?.rating?.count != null && ` (${customer.rating.count} reviews)`}
              </p>
            )}
            {customer?.location && (
              <p className="mt-0.5 flex items-center gap-1 text-[12px] text-[#999]">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{customer.location}</span>
              </p>
            )}
          </div>
        </div>

        <div className="mx-auto mt-5 w-full max-w-[420px]">
          <h3 className="mb-3 text-[16px] font-semibold text-[#333]">Booking Information</h3>
          <div className="space-y-3">
            {rows.map((row) => <BookingRow key={row.label} {...row} />)}
          </div>
        </div>

        <p className="mx-auto mt-5 max-w-[470px] text-center text-[12px] italic leading-[18px] text-[#aaa]">
          We&apos;ll notify you once payment is confirmed, then you can proceed with the booking
        </p>
      </section>
    </div>
  );
}
