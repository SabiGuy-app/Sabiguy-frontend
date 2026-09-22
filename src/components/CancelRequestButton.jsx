import { useState } from "react";
import UserCancellationModal from "./UserCancellationModal";
import { cancelBooking } from "../api/bookings";

export default function CancelRequestButton({
  bookingId,
  onSuccess,
  className = "",
  buttonText = "Cancel Request",
}) {
  const [open, setOpen] = useState(false);

  const handleCancelSubmit = async (reason) => {
    await cancelBooking(bookingId, reason);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`w-full px-2 py-1.5 text-xs sm:px-3 sm:py-2 sm:text-sm bg-white text-red-600 border border-red-300 rounded-[4px] font-medium hover:bg-red-50 transition-colors flex items-center justify-center gap-1 sm:gap-2 md:w-fit md:px-4 md:py-2 md:text-base ${className}`}
      >
        {buttonText}
      </button>

      <UserCancellationModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onSubmit={handleCancelSubmit}
        onComplete={onSuccess}
      />
    </>
  );
}