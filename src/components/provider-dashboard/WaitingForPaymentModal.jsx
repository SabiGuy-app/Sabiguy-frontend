import { useState, useEffect, useRef } from "react";
import { X, MapPin, Calendar, Shield } from "lucide-react";

/**
 * Waiting for Payment modal — the countdown view only.
 *
 * `onExpire` fires ONCE, the instant the timer reaches zero. It does NOT
 * render anything itself for the expired state — the parent page listens
 * for this callback, sets its own status to "expired", and shows the
 * separate <PaymentExpiredModal /> in this modal's place.
 *
 * `onClose` is the X icon — Just close the WaitingForPaymentModal
 */
export default function WaitingForPaymentModal({
  initialSeconds = 5 * 60, // 5 minutes
  onClose = () => {},
  onExpire = () => {},
  customer = {
    fullName: "Customer",
    profilePicture: "/avatar.png",
  },
  pickup = "N/A",
  dropoff = "N/A",
  dateTime = "N/A",
  bookingPrice = 0,
  platformFee = 0,
  riderReceives = 0,
}) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  // Ref, not state — we only want onExpire to fire ONE time, and a ref
  // update doesn't trigger a re-render the way state would, so there's
  // no risk of the effect body running twice before the flag "sticks".
  const hasExpiredRef = useRef(false);

  useEffect(() => {
    if (secondsLeft <= 0) {
      if (!hasExpiredRef.current) {
        hasExpiredRef.current = true;
        onExpire();
      }
      return; // don't start another interval once we're at 0
    }

    const id = setInterval(() => {
      setSecondsLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft <= 0]);

  const formatTime = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    const pad = (n) => String(n).padStart(2, "0");
    return `${pad(m)}:${pad(s)}`;
  };

  // Timer color condition tuned for a 5-minute countdown.
  const getTimerStyle = (totalSeconds) => {
    if (totalSeconds <= 30) return "text-red-600 animate-pulse";
    if (totalSeconds <= 120) return "text-amber-500";
    return "text-[#1ea26b]";
  };

  const formatNaira = (value) => `₦${Number(value || 0).toLocaleString()}`;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="relative w-full max-w-sm lg:max-w-lg bg-white rounded-2xl shadow-xl p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <h2 className="text-lg font-semibold text-gray-900 text-center">
          Waiting for Payment
        </h2>
        <p className="text-sm text-gray-400 text-center mt-1">
          The customer is completing payment for this service.
        </p>

        <div
          className={`text-center text-5xl font-bold tracking-tight mt-5 tabular-nums ${getTimerStyle(
            secondsLeft,
          )}`}
        >
          {formatTime(secondsLeft)}
        </div>

        <div className="flex items-center gap-3 mt-6">
          <img
            src={customer?.profilePicture || "/avatar.png"}
            alt={customer?.fullName || "Customer"}
            className="w-11 h-11 rounded-full object-cover"
          />
          <div>
            <div className="flex items-center gap-1">
              <span className="font-semibold text-gray-900 text-sm">
                {customer?.fullName || "Customer"}
              </span>
              <span className="flex items-center gap-1 px-1.5 py-0.5 bg-green-50 text-[#8BC53F] text-[10px] font-medium rounded">
                <Shield className="w-3 h-3" /> Verified
              </span>
            </div>
          </div>
        </div>

        <div className="mt-5 space-y-3 text-sm">
          <div className="flex gap-2">
            <span className="mt-1 w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <div>
              <div className="text-xs text-gray-400">Pickup</div>
              <div className="text-gray-800">{pickup}</div>
            </div>
          </div>
          <div className="flex gap-2">
            <MapPin size={14} className="mt-0.5 text-red-500 shrink-0" />
            <div>
              <div className="text-xs text-gray-400">Dropoff</div>
              <div className="text-gray-800">{dropoff}</div>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <Calendar size={14} className="text-gray-500 shrink-0" />
            <div>
              <div className="text-xs text-gray-400">Date &amp; Time</div>
              <div className="text-gray-800">{dateTime}</div>
            </div>
          </div>
        </div>

        <div className="mt-5 border border-gray-100 rounded-xl p-4 space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Booking Price</span>
            <span className="font-semibold text-gray-900">
              {formatNaira(bookingPrice)}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Platform Fee</span>
            <span className="font-semibold text-gray-900">
              {formatNaira(platformFee)}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm border-t border-gray-100 pt-2">
            <span className="text-gray-500">Rider Receives</span>
            <span className="font-semibold text-gray-900">
              {formatNaira(riderReceives)}
            </span>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 italic mt-6">
          We'll notify you once payment is confirmed.
        </p>
      </div>
    </div>
  );
}
