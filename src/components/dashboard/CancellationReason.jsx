import { useState } from "react";
import { FiX, FiCreditCard, FiChevronRight, FiChevronLeft, FiAlertCircle, FiInfo } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import Modal from "../Modal";

export default function CancellationReasonModal({ isOpen, onClose, onNext }) {
  const [selectedReason, setSelectedReason] = useState("");

  const reasons = [
    "The service provider isn't responding",
    "Unable to continue",
    "Found another provider",
    "Other reason",
  ];

  const handleContinue = () => {
    if (selectedReason === "Other reason") {
      onNext("other");
    } else {
      onNext(selectedReason);
    }
  };

   return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="What went wrong?"
    >
      <div className="space-y-3 mb-6">
        {reasons.map((reason, index) => (
          <label
            key={index}
            className="flex items-center justify-between p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <span className="text-sm text-gray-900">{reason}</span>
            <input
              type="radio"
              name="reason"
              value={reason}
              checked={selectedReason === reason}
              onChange={(e) => setSelectedReason(e.target.value)}
              className="w-5 h-5 text-[#005823] focus:ring-[#8BC53F]"
            />
          </label>
        ))}
      </div>

      <button
        onClick={handleContinue}
        disabled={!selectedReason}
        className="w-full px-6 py-3 bg-[#005823] text-white font-medium rounded-lg hover:bg-[#004019] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        Continue
      </button>
    </Modal>
  );
}