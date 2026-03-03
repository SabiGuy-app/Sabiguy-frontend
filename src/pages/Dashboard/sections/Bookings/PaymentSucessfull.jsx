import Modal from "../../../../components/Modal";
import { MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Success({ isOpen, onClose, providerName, bookingId }) {
  const navigate = useNavigate();

  const displayName = providerName || "your provider";

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center justify-center text-center py-6">
        <img
          src="/Okay.svg"
          alt="Success"
          className="w-32 h-32 mb-6"
        />

        <h2 className="font-semibold text-2xl text-gray-900 mb-3">
          Payment Successful
        </h2>

        <p className="text-gray-500 text-sm mb-6 max-w-sm">
          Your Booking with {displayName} has been confirmed
        </p>

        <div className="flex gap-5">
          <button
            onClick={() => {
              onClose();
              navigate(bookingId ? `/bookings/summary?bookingId=${bookingId}` : "/dashboard/bookings");
            }}
            className="bg-gray-50 px-10 py-3 font-semibold border border-gray-100 rounded-md 
                       flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
          >
            Continue
          </button>

          <button
            onClick={onClose}
            className="bg-[#005823BF] text-white rounded-md px-6 py-3 
                       flex items-center justify-center gap-2 hover:bg-[#005823]"
          >
            <MessageCircle size={15} />
            <span>Message Provider</span>
          </button>
        </div>
      </div>
    </Modal>
  );
}