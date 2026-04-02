import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBookingsDetails } from "../../../src/api/bookings";
import useBookingStore from "../../../src/stores/booking.store";

const POLL_INTERVAL_MS = 3000; // check every 3 seconds
const TIMEOUT_MS = 60000;

export default function SearchingLoader() {
  const navigate = useNavigate();
  const booking = useBookingStore((state) => state.booking);
  const setBooking = useBookingStore((state) => state.setBooking);

  const [elapsed, setElapsed] = useState(0); // seconds shown in UI
  const [timedOut, setTimedOut] = useState(false);
  const [error, setError] = useState("");

  const pollRef = useRef(null);
  const timerRef = useRef(null);
  const startTimeRef = useRef(Date.now());
  console.log("nnnn");

  // Pull booking ID from wherever your store puts it
  const bookingId =
    booking?.data?.booking?._id ||
    booking?.booking?._id ||
    booking?._id ||
    booking?.data?._id;

  const stopPolling = () => {
    clearInterval(pollRef.current);
    clearInterval(timerRef.current);
  };

  useEffect(() => {
    if (!bookingId) {
      setError("No booking ID found. Please go back and try again.");
      return;
    }

    // Tick the elapsed counter every second for the UI
    timerRef.current = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);

    const poll = async () => {
      // Hard timeout check
      if (Date.now() - startTimeRef.current >= TIMEOUT_MS) {
        stopPolling();
        setTimedOut(true);
        return;
      }

      try {
        const data = await getBookingsDetails(bookingId);
        const bookingData = data?.data?.booking || data?.booking || {};
        const providerId  = bookingData?.providerId;

        if (providerId) {
          stopPolling();
          setBooking(data);
          navigate("/bookings/summary");
        }
        // else: no providers yet — keep polling
      } catch (err) {
        console.error("Polling error:", err);
        // Don't stop polling on a transient network error — just log it
      }
    };

    // Run once immediately, then on interval
    poll();
    pollRef.current = setInterval(poll, POLL_INTERVAL_MS);

    return () => stopPolling();
  }, [bookingId]);

  const handleRetry = () => {
    setTimedOut(false);
    setElapsed(0);
    startTimeRef.current = Date.now();

    timerRef.current = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);

    const poll = async () => {
      if (Date.now() - startTimeRef.current >= TIMEOUT_MS) {
        stopPolling();
        setTimedOut(true);
        return;
      }
      try {
        const data = await getBookingsDetails(bookingId);
        const bookingData = data?.data?.booking || data?.booking || {};
        const providerId  = bookingData?.providerId  || [];
        if (providerId ) {
          stopPolling();
          setBooking(data);
          navigate("/bookings/summary");
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    };

    poll();
    pollRef.current = setInterval(poll, POLL_INTERVAL_MS);
  };

  // ── Timed-out state ──────────────────────────────────────────────────────
  if (timedOut) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <svg
            className="w-10 h-10 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          No providers available
        </h2>
        <p className="text-gray-500 max-w-xs mb-8">
          We couldn't find an available provider in your area right now. Please
          try again in a few minutes.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
          <button
            onClick={handleRetry}
            className="flex-1 py-3 px-6 bg-[#005823] text-white rounded-lg font-semibold hover:bg-green-800 transition-colors"
          >
            Try again
          </button>
          <button
            onClick={() => navigate("/bookings")}
            className="flex-1 py-3 px-6 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  // ── Error state ──────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => navigate("/bookings")}
          className="py-3 px-6 border border-gray-300 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
        >
          Go back
        </button>
      </div>
    );
  }

  // ── Searching state ──────────────────────────────────────────────────────
  const progress = Math.min((elapsed / 60) * 100, 100);
  const remaining = Math.max(60 - elapsed, 0);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
      {/* Pulsing ring animation */}
      <div className="relative w-32 h-32 mb-8">
        <div className="absolute inset-0 rounded-full border-4 border-[#005823] opacity-20 animate-ping" />
        <div className="absolute inset-2 rounded-full border-4 border-[#005823] opacity-30 animate-ping [animation-delay:0.4s]" />
        <div className="absolute inset-4 rounded-full bg-[#E6EFE9] flex items-center justify-center">
          <svg
            className="w-10 h-10 text-[#005823]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z"
            />
          </svg>
        </div>
      </div>

      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        Finding you a provider...
      </h2>
      <p className="text-gray-500 text-sm mb-8 max-w-xs">
        We're matching you with the nearest available provider. This usually
        takes less than a minute.
      </p>

      {/* Progress bar */}
      <div className="w-full max-w-xs mb-2">
        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#005823] rounded-full transition-all duration-1000 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <p className="text-xs text-gray-400">
        {remaining > 0 ? `Up to ${remaining}s remaining` : "Finalising..."}
      </p>

      <button
        onClick={() => navigate("/bookings")}
        className="mt-10 text-sm text-gray-400 hover:text-gray-600 underline"
      >
        Cancel search
      </button>
    </div>
  );
}
