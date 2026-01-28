import { useState } from "react";
import { FiX, FiCreditCard, FiChevronRight, FiChevronLeft, FiAlertCircle, FiInfo } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import Modal from "../Modal";

export default function CancellationDescriptionModal({ isOpen, onClose, onBack, onNext }) {
  const [description, setDescription] = useState("");

  const handleContinue = () => {
    onNext(description);
  };
   return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Reason for cancellation"
      showCloseButton={false}
    >
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
      >
        <FiChevronLeft size={18} />
        Back
      </button>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Please describe the problem
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder=""
          rows={6}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BC53F] focus:border-transparent resize-none bg-white"
        />
      </div>

      <button
        onClick={handleContinue}
        disabled={!description.trim()}
        className="w-full px-6 py-3 bg-[#005823] text-white font-medium rounded-lg hover:bg-[#004019] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        Continue
      </button>
    </Modal>
  );
}