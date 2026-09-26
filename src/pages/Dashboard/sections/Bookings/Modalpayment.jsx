import { AlertCircle } from "lucide-react";

/**
 * Shown automatically in place of <WaitingForPaymentModal /> once the
 * countdown reaches 0 with no payment confirmed. Its only job on screen
 * is to explain what happened and return the user to their bookings.
 */
export default function PaymentExpiredModal({
  onBackTobooking = () => {},
}) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl p-6 text-center py-8">
        <div className="mx-auto w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
          <AlertCircle size={24} className="text-red-500" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900">Payment Time Expired</h2>
        <p className="text-sm text-gray-500 mt-2 leading-relaxed">
          You did not complete payment within the time allowed, so this booking
          has expired. Return to your bookings to continue.
        </p>
        <button
          onClick={onBackTobooking}
          className="mt-6 w-full px-6 py-3 bg-red-100 text-red-700 rounded-xl font-semibold hover:bg-red-200 transition-all active:scale-95"
        >
          My Booking
        </button>
      </div>
    </div>
  );
}