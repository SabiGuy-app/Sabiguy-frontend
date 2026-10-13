import { XCircle } from "lucide-react";

/**
 * Shown automatically when polling detects the customer has cancelled
 * the booking while the provider was waiting for payment. Different
 * from PaymentExpiredModal (timeout) — this is a deliberate
 * cancellation, so the message is distinct even though the button
 * does the same thing: send the provider back to the dashboard.
 */
export default function JobCancelledModal({ onBackToDashboard = () => {} }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl p-6 text-center py-8">
        <div className="mx-auto w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
          <XCircle size={24} className="text-red-500" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900">Job Cancelled</h2>
        <p className="text-sm text-gray-500 mt-2 leading-relaxed">
          The customer has cancelled this request. Click the button below to
          go back to the dashboard.
        </p>
        <button
          onClick={onBackToDashboard}
          className="mt-6 w-full px-6 py-3 bg-[#2D6A3E] text-white rounded-xl font-semibold hover:bg-[#1f4a2a] transition-all active:scale-95"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
