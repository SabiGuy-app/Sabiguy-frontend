import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Sparkles, X } from "lucide-react";
import notificationSoundService from "../services/notificationSoundService";

const completionNotificationTypes = [
  "booking_completed",
  "booking_completed_awaiting_acceptance",
];

export default function NotificationCompletionModal({
  isOpen,
  onClose,
  onAcceptCompletion,
  onDisputeCompletion,
  providerName,
  notification,
}) {
  const playedNotificationRef = useRef(null);
  const title = notification?.title || "Booking completed";
  const message =
    notification?.message ||
    "Please accept job completion and rate the provider so payment can be released.";

  useEffect(() => {
    const notificationKey =
      notification?._id ||
      notification?.id ||
      notification?.createdAt ||
      notification?.title ||
      null;

    if (
      !isOpen ||
      !completionNotificationTypes.includes(notification?.type) ||
      !notificationKey
    ) {
      playedNotificationRef.current = null;
      return;
    }

    if (playedNotificationRef.current === notificationKey) {
      return;
    }

    playedNotificationRef.current = notificationKey;

    notificationSoundService.play().catch((err) => {
      console.warn("Modal sound playback failed:", err);
    });
  }, [isOpen, notification]);

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
            className="relative max-h-[90dvh] w-full max-w-[500px] overflow-y-auto overflow-x-hidden rounded-2xl border border-white/70 bg-white shadow-[0_24px_60px_rgba(0,0,0,0.24)]"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(0,88,35,0.14),_transparent_42%),linear-gradient(135deg,_rgba(230,239,233,0.92),_rgba(255,255,255,1))]" />

            <div className="relative p-5 sm:p-6">
              <button
                onClick={onClose}
                aria-label="Close modal"
                className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/85 text-slate-500 shadow-sm transition hover:bg-white hover:text-slate-900"
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
                  className="relative mb-4"
                >
                  <div className="absolute inset-0 rounded-full bg-[#005823]/10 blur-2xl" />
                  <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-[#005823] text-white shadow-[0_14px_32px_rgba(0,88,35,0.3)]">
                    <CheckCircle2 className="h-10 w-10" />
                  </div>
                  <motion.div
                    className="absolute -right-1.5 -top-1.5 rounded-full bg-[#8BC53F] p-1.5 text-white shadow-lg"
                    animate={{ rotate: [0, 12, 0], scale: [1, 1.08, 1] }}
                    transition={{
                      duration: 2.6,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                  </motion.div>
                </motion.div>

                <span className="mb-2 inline-flex items-center rounded-full border border-[#005823]/15 bg-[#005823]/5 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#005823]">
                  Action required
                </span>

                <h2 className="text-2xl font-semibold text-[#231F20] sm:text-3xl">
                  {title}
                </h2>

                <p className="mt-1 text-sm font-medium text-[#005823]">
                  {providerName ? `Provider: ${providerName}` : "Provider"}
                </p>

                <p className="mt-3 max-w-md text-sm leading-6 text-[#231F20BF]">
                  {message}
                </p>

                <div className="mt-5 w-full rounded-xl border border-[#005823]/10 bg-white/80 p-3.5 text-left shadow-sm">
                  <p className="text-sm font-semibold text-[#231F20]">
                    Why this matters
                  </p>
                  <p className="mt-1 text-sm leading-5 text-[#231F2080]">
                    Once the job completion is accepted, the provider can be
                    rated and the payment becomes accessible.
                  </p>
                </div>

                <div className="mt-6 flex w-full flex-col gap-2 sm:flex-row">
                  <button
                    onClick={onClose}
                    className="inline-flex min-h-10 flex-1 items-center justify-center rounded-lg border border-[#231F201A] bg-white px-4 py-2.5 text-sm font-semibold text-[#231F20] transition hover:bg-[#F7F8F7]"
                  >
                    Not now
                  </button>
                  <button
                    onClick={onDisputeCompletion}
                    className="inline-flex min-h-10 flex-1 items-center justify-center rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                  >
                    Dispute Completion
                  </button>
                  <button
                    onClick={onAcceptCompletion}
                    className="inline-flex min-h-10 flex-1 items-center justify-center rounded-lg bg-[#005823] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#005823]/25 transition hover:bg-[#00461d]"
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
