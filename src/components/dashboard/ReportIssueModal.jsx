import { useState } from "react";
import { FiX, FiCreditCard, FiChevronRight, FiChevronLeft, FiAlertCircle, FiInfo } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import Modal from "../Modal";

export default function ReportIssue({ isOpen, onClose}) {
    const [description, setDescription] = useState("");

    const handleSubmit = async () => {
    console.log({ description });
    // TODO: API call to submit report
    onClose();
  };

   return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Report an Issue"
      subtitle="Let us know what went wrong"
    >
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Please describe the problem
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Share your experience"
          rows={6}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BC53F] focus:border-transparent resize-none bg-gray-50"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={!description.trim()}
        className="w-full px-6 py-3 bg-white border-2 border-red-500 text-red-500 font-medium rounded-lg hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
      >
        <FiAlertCircle size={18} />
        Submit Report
      </button>
    </Modal>
  );


}