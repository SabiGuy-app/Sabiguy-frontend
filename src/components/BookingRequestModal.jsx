import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, MapPin, X } from "lucide-react";

export default function BookingRequestModal({
  isOpen,
  onClose,
  onViewBooking,
  notification,
}) {
  const payload = notification?.data || notification || {};
  const title = payload?.title || "Booking request";
  const message =
    payload?.message || "You have a new booking request to review.";
  const serviceType = payload?.serviceType || "Booking";
  const scheduleType = payload?.scheduleType || payload?.schedule_type || null;
  const scheduleDate =
    payload?.scheduleDate ||
    payload?.schedule_date ||
    payload?.scheduleTime ||
    null;
  const pickupAddress =
    payload?.pickupAddress || payload?.pickupLocation?.address || null;
  const dropoffAddress =
    payload?.dropoffAddress || payload?.dropoffLocation?.address || null;
  const calculatedPrice =
    payload?.calculatedPrice ??
    payload?.budget ??
    payload?.driverReceives ??
    payload?.amount ??
    null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 z-0 bg-slate-950/45 backdrop-blur-sm"
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
            className="relative z-10 flex max-h-[calc(100dvh-24px)] min-h-0 w-full max-w-[520px] flex-col overflow-hidden rounded-2xl border border-white/70 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.28)] sm:max-h-[calc(100dvh-32px)] sm:rounded-3xl"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(0,88,35,0.14),_transparent_42%),linear-gradient(135deg,_rgba(230,239,233,0.92),_rgba(255,255,255,1))]" />

            <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden p-5 sm:p-6">
              <button
                onClick={onClose}
                aria-label="Close modal"
                className="absolute right-3 top-3 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/85 text-slate-500 shadow-sm transition hover:bg-white hover:text-slate-900"
              >
                <X size={18} />
              </button>

              <div className="flex min-h-0 flex-1 flex-col items-center overflow-y-auto overscroll-contain text-center">
                <div className="relative mb-4 shrink-0">
                  <div className="absolute inset-0 rounded-full bg-[#005823]/10 blur-2xl" />
                  <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-[#005823] text-white shadow-[0_14px_32px_rgba(0,88,35,0.3)]">
                    <CalendarDays className="h-10 w-10" />
                  </div>
                </div>

                <span className="mb-2 inline-flex items-center rounded-full border border-[#005823]/15 bg-[#005823]/5 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#005823]">
                  New booking
                </span>

                <h2 className="text-2xl font-semibold leading-tight text-[#231F20] sm:text-3xl">
                  {title}
                </h2>

                <p className="mt-1 text-sm font-medium text-[#005823]">
                  {serviceType}
                </p>

                <p className="mt-3 max-w-md text-sm leading-6 text-[#231F20BF]">
                  {message}
                </p>

                <div className="mt-5 w-full shrink-0 rounded-xl border border-[#005823]/10 bg-white/80 p-3.5 text-left shadow-sm">
                  <p className="text-sm font-semibold text-[#231F20]">
                    Booking details
                  </p>
                  <div className="mt-3 space-y-2.5">
                    {scheduleType && (
                      <div className="flex items-start gap-2 text-sm leading-5 text-[#231F20BF]">
                        <CalendarDays size={16} className="mt-0.5 shrink-0 text-[#005823]" />
                        <span className="capitalize">
                          Schedule: {String(scheduleType).replace(/_/g, " ")}
                        </span>
                      </div>
                    )}
                    {scheduleDate && (
                      <div className="flex items-start gap-2 text-sm leading-5 text-[#231F20BF]">
                        <CalendarDays size={16} className="mt-0.5 shrink-0 text-[#005823]" />
                        <span>
                          Scheduled for:{" "}
                          {new Date(scheduleDate).toLocaleString()}
                        </span>
                      </div>
                    )}
                    {pickupAddress && (
                      <div className="flex items-start gap-2 text-sm leading-5 text-[#231F20BF]">
                        <MapPin size={16} className="mt-0.5 shrink-0 text-[#005823]" />
                        <span className="line-clamp-2">
                          Pickup: {pickupAddress}
                        </span>
                      </div>
                    )}
                    {dropoffAddress && (
                      <div className="flex items-start gap-2 text-sm leading-5 text-[#231F20BF]">
                        <MapPin size={16} className="mt-0.5 shrink-0 text-[#005823]" />
                        <span className="line-clamp-2">
                          Dropoff: {dropoffAddress}
                        </span>
                      </div>
                    )}
                    {calculatedPrice !== null &&
                      calculatedPrice !== undefined && (
                        <div className="flex items-start gap-2 text-sm leading-5 text-[#231F20BF]">
                          <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#005823] text-[10px] font-bold text-white">
                            ₦
                          </span>
                          <span>
                            Price: {Number(calculatedPrice).toLocaleString()}
                          </span>
                        </div>
                      )}
                  </div>
                </div>

                <div className="mt-6 flex w-full shrink-0 flex-col gap-2 sm:flex-row">
                  <button
                    onClick={onClose}
                    className="inline-flex min-h-10 flex-1 items-center justify-center rounded-lg border border-[#231F201A] bg-white px-4 py-2.5 text-sm font-semibold text-[#231F20] transition hover:bg-[#F7F8F7]"
                  >
                    Close
                  </button>
                  <button
                    onClick={onViewBooking}
                    className="inline-flex min-h-10 flex-1 items-center justify-center rounded-lg bg-[#005823] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#005823]/25 transition hover:bg-[#00461d]"
                  >
                    View Booking
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
