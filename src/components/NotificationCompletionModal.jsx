import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Sparkles, X } from "lucide-react";

export default function NotificationCompletionModal({
  isOpen,
  onClose,
  onAcceptCompletion,
  providerName,
  notification,
}) {
  const title = notification?.title || "Booking completed";
  const message =
    notification?.message ||
    "Please accept job completion and rate the provider so payment can be released.";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 280, damping: 24 }}
            className="relative w-full max-w-lg overflow-hidden rounded-[28px] border border-white/70 bg-white shadow-[0_30px_80px_rgba(0,0,0,0.28)]"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(0,88,35,0.14),_transparent_42%),linear-gradient(135deg,_rgba(230,239,233,0.92),_rgba(255,255,255,1))]" />

            <div className="relative p-6 sm:p-8">
              <button
                onClick={onClose}
                aria-label="Close modal"
                className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/85 text-slate-500 shadow-sm transition hover:bg-white hover:text-slate-900"
              >
                <X size={18} />
              </button>

              <div className="flex flex-col items-center text-center">
                <motion.div
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    delay: 0.1,
                    type: "spring",
                    stiffness: 260,
                    damping: 18,
                  }}
                  className="relative mb-6"
                >
                  <div className="absolute inset-0 rounded-full bg-[#005823]/10 blur-2xl" />
                  <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-[#005823] text-white shadow-[0_18px_40px_rgba(0,88,35,0.35)]">
                    <CheckCircle2 className="h-12 w-12" />
                  </div>
                  <motion.div
                    className="absolute -right-2 -top-2 rounded-full bg-[#8BC53F] p-2 text-white shadow-lg"
                    animate={{ rotate: [0, 12, 0], scale: [1, 1.08, 1] }}
                    transition={{
                      duration: 2.6,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <Sparkles className="h-4 w-4" />
                  </motion.div>
                </motion.div>

                <span className="mb-3 inline-flex items-center rounded-full border border-[#005823]/15 bg-[#005823]/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#005823]">
                  Action required
                </span>

                <h2 className="text-3xl font-semibold text-[#231F20] sm:text-[34px]">
                  {title}
                </h2>

                <p className="mt-2 text-sm font-medium text-[#005823]">
                  {providerName ? `Provider: ${providerName}` : "Provider"}
                </p>

                <p className="mt-4 max-w-md text-[15px] leading-7 text-[#231F20BF] sm:text-base">
                  {message}
                </p>

                <div className="mt-6 w-full rounded-2xl border border-[#005823]/10 bg-white/80 p-4 text-left shadow-sm">
                  <p className="text-sm font-semibold text-[#231F20]">
                    Why this matters
                  </p>
                  <p className="mt-1 text-sm leading-6 text-[#231F2080]">
                    Once the job completion is accepted, the provider can be
                    rated and the payment becomes accessible.
                  </p>
                </div>

                <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row">
                  <button
                    onClick={onClose}
                    className="inline-flex flex-1 items-center justify-center rounded-xl border border-[#231F201A] bg-white px-5 py-3 text-sm font-semibold text-[#231F20] transition hover:bg-[#F7F8F7]"
                  >
                    Not now
                  </button>
                  <button
                    onClick={onAcceptCompletion}
                    className="inline-flex flex-1 items-center justify-center rounded-xl bg-[#005823] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#005823]/25 transition hover:bg-[#00461d]"
                  >
                    Accept Completion
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
