import { useState } from "react";
import CancelModal from "../components/CancelModal";
import { cancelBooking } from "../api/bookings";

export default function CancelRequestButton({
  bookingId,
  onSuccess,
  className = "",
  buttonText = "Cancel Request",
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCancel = async (reason) => {
    setLoading(true);
    try {
      await cancelBooking(bookingId, reason);
      setOpen(false);
      onSuccess?.();
    } catch (err) {
      console.error("Cancel failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`px-3 py-1 mt-3 bg-white text-red-600 border border-red-300 rounded-lg font-medium hover:bg-red-50 transition-colors ${className}`}
      >
        {buttonText}
      </button>

      <CancelModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleCancel}
        loading={loading}
      />
    </>
  );
}