import { AnimatePresence, motion as Motion } from "framer-motion";
import { PackageCheck, X } from "lucide-react";

export default function ProductOrderReceivedModal({
  isOpen,
  onClose,
  onProcessOrder,
  notification,
}) {
  const data = notification?.data?.order || notification?.data || {};
  const title =
    notification?.title ||
    notification?.data?.title ||
    "New product order received";
  const message =
    notification?.message ||
    notification?.data?.message ||
    "A customer placed a new product order. Review it to begin processing.";
  const orderNumber = data.orderNumber || data.orderId || data._id;

  return (
    <AnimatePresence>
      {isOpen && (
        <Motion.div
          className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Motion.div
            className="absolute inset-0 z-0 bg-slate-950/45 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <Motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-order-notification-title"
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 280, damping: 24 }}
            className="relative z-10 w-full max-w-[520px] overflow-hidden rounded-2xl border border-white/70 bg-white p-5 shadow-[0_24px_70px_rgba(15,23,42,0.28)] sm:rounded-3xl sm:p-6"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm transition hover:text-slate-900"
            >
              <X size={18} />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#005823] text-white shadow-[0_14px_32px_rgba(0,88,35,0.3)]">
                <PackageCheck className="h-10 w-10" />
              </div>
              <span className="mb-2 inline-flex items-center rounded-full border border-[#005823]/15 bg-[#005823]/5 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#005823]">
                Product order
              </span>
              <h2
                id="product-order-notification-title"
                className="text-2xl font-semibold leading-tight text-[#231F20] sm:text-3xl"
              >
                {title}
              </h2>
              <p className="mt-3 max-w-md text-sm leading-6 text-[#231F20BF]">
                {message}
              </p>
              {orderNumber && (
                <p className="mt-4 rounded-xl border border-[#005823]/10 bg-white/80 px-4 py-3 text-sm text-[#231F20BF]">
                  Order number:{" "}
                  <span className="font-semibold text-[#231F20]">
                    {orderNumber}
                  </span>
                </p>
              )}
              <div className="mt-6 flex w-full flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex min-h-10 flex-1 items-center justify-center rounded-lg border border-[#231F201A] bg-white px-4 py-2.5 text-sm font-semibold text-[#231F20] transition hover:bg-[#F7F8F7]"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={onProcessOrder}
                  className="inline-flex min-h-10 flex-1 items-center justify-center rounded-lg bg-[#005823] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#005823]/25 transition hover:bg-[#00461d]"
                >
                  Process Order
                </button>
              </div>
            </div>
          </Motion.div>
        </Motion.div>
      )}
    </AnimatePresence>
  );
}
