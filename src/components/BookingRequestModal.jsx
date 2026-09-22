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
  const scheduleDate = payload?.scheduleDate || payload?.scheduleTime || null;
  const pickupAddress = payload?.pickupAddress || payload?.pickupLocation?.address || null;
  const dropoffAddress = payload?.dropoffAddress || payload?.dropoffLocation?.address || null;
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
                <div className="relative mb-6">
                  <div className="absolute inset-0 rounded-full bg-[#005823]/10 blur-2xl" />
                  <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-[#005823] text-white shadow-[0_18px_40px_rgba(0,88,35,0.35)]">
                    <CalendarDays className="h-12 w-12" />
                  </div>
                </div>

                <span className="mb-3 inline-flex items-center rounded-full border border-[#005823]/15 bg-[#005823]/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#005823]">
                  New booking
                </span>

                <h2 className="text-3xl font-semibold text-[#231F20] sm:text-[34px]">
                  {title}
                </h2>

                <p className="mt-2 text-sm font-medium text-[#005823]">
                  {serviceType}
                </p>

                <p className="mt-4 max-w-md text-[15px] leading-7 text-[#231F20BF] sm:text-base">
                  {message}
                </p>

                <div className="mt-6 w-full rounded-2xl border border-[#005823]/10 bg-white/80 p-4 text-left shadow-sm">
                  <p className="text-sm font-semibold text-[#231F20]">
                    Booking details
                  </p>
                  <div className="mt-3 space-y-3">
                    {scheduleDate && (
                      <div className="flex items-center gap-2 text-sm text-[#231F20BF]">
                        <CalendarDays size={14} className="text-[#005823]" />
                        <span>{new Date(scheduleDate).toLocaleString()}</span>
                      </div>
                    )}
                    {pickupAddress && (
                      <div className="flex items-center gap-2 text-sm text-[#231F20BF]">
                        <MapPin size={14} className="text-[#005823]" />
                        <span className="line-clamp-2">
                          Pickup: {pickupAddress}
                        </span>
                      </div>
                    )}
                    {dropoffAddress && (
                      <div className="flex items-center gap-2 text-sm text-[#231F20BF]">
                        <MapPin size={14} className="text-[#005823]" />
                        <span className="line-clamp-2">
                          Dropoff: {dropoffAddress}
                        </span>
                      </div>
                    )}
                    {calculatedPrice !== null && calculatedPrice !== undefined && (
                      <div className="flex items-center gap-2 text-sm text-[#231F20BF]">
                        <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#005823] text-[10px] font-bold text-white">
                          ₦
                        </span>
                        <span>
                          Price: {Number(calculatedPrice).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row">
                  <button
                    onClick={onClose}
                    className="inline-flex flex-1 items-center justify-center rounded-xl border border-[#231F201A] bg-white px-5 py-3 text-sm font-semibold text-[#231F20] transition hover:bg-[#F7F8F7]"
                  >
                    Close
                  </button>
                  <button
                    onClick={onViewBooking}
                    className="inline-flex flex-1 items-center justify-center rounded-xl bg-[#005823] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#005823]/25 transition hover:bg-[#00461d]"
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
