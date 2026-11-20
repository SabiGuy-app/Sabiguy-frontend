import { useEffect, useState } from "react";
import { AnimatePresence, motion as Motion } from "framer-motion";
import { X } from "lucide-react";

export default function DisputeProductDeliveryModal({
  isOpen,
  order,
  submitting = false,
  error = "",
  onClose,
  onSubmit,
}) {
  const [reason, setReason] = useState("");
  const orderNumber = order?.orderNumber || order?.orderId || order?.id || order?._id;

  useEffect(() => {
    if (isOpen) setReason("");
  }, [isOpen, orderNumber]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmedReason = reason.trim();
    if (!trimmedReason || submitting) return;
    onSubmit(trimmedReason);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Motion.div
          className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Motion.div
            className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={submitting ? undefined : onClose}
          />
          <Motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="dispute-product-delivery-title"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            className="relative z-10 w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl sm:p-6"
          >
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              aria-label="Close modal"
              className="absolute right-3 top-3 rounded-full p-2 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
            >
              <X size={18} />
            </button>
            <h2
              id="dispute-product-delivery-title"
              className="pr-8 text-xl font-semibold text-gray-900"
            >
              Dispute Delivery
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Tell us what is wrong with this delivery. A reason is required to
              submit the dispute.
            </p>
            {orderNumber && (
              <p className="mt-3 text-sm text-gray-500">
                Order: <span className="font-medium text-gray-800">{orderNumber}</span>
              </p>
            )}
            <form onSubmit={handleSubmit} className="mt-4">
              <label
                htmlFor="product-delivery-dispute-reason"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Reason <span className="text-red-600">*</span>
              </label>
              <textarea
                id="product-delivery-dispute-reason"
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                required
                minLength={1}
                maxLength={2000}
                rows={4}
                disabled={submitting}
                placeholder="Describe the delivery issue"
                className="w-full resize-y rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-[#005823] focus:ring-2 focus:ring-[#005823]/15 disabled:bg-gray-50"
              />
              {error && (
                <p role="alert" className="mt-2 text-sm text-red-600">
                  {error}
                </p>
              )}
              <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={submitting}
                  className="min-h-10 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !reason.trim()}
                  className="min-h-10 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? "Submitting..." : "Submit Dispute"}
                </button>
              </div>
            </form>
          </Motion.div>
        </Motion.div>
      )}
    </AnimatePresence>
  );
}
