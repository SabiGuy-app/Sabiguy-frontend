import { AlertCircle } from "lucide-react";

/**
 * Shown automatically in place of <WaitingForPaymentModal /> once the
 * countdown reaches 0 with no payment confirmed. Its only job on screen
 * is to explain what happened and send the provider back to the
 * dashboard — it has no timer or state of its own.
 */
export default function PaymentExpiredModal({
  onBackToDashboard = () => {},
}) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl p-6 text-center py-8">
        <div className="mx-auto w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
          <AlertCircle size={24} className="text-red-500" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900">Job Expired</h2>
        <p className="text-sm text-gray-500 mt-2 leading-relaxed">
          The user has not made a payment and the job has expired. Click the
          button below to go back to the dashboard.
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
