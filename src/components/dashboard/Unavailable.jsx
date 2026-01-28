import Modal from "../Modal";
import { useState } from "react";
import { FiX, FiChevronLeft, FiChevronRight, FiUser, FiClock, FiCalendar, FiMapPin, FiPlus } from "react-icons/fi";
import { FaTools } from "react-icons/fa";

export default function ProviderUnavailableModal({ isOpen, onClose, provider }) {
    const handleSeeSimilar = () => {
    console.log("Navigate to similar providers");
    onClose();
  };

  const handleWaitForProvider = () => {
    console.log("Set notification for provider");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
        <div className="p-8">
            <div className="flex items-start gap-4 mb-6">
                 <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
            {provider?.avatar ? (
              <img src={provider.avatar} alt={provider.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600" />
            )}
          </div>
          <div>
             <h2 className="text-2xl font-semibold text-gray-900 mb-1">
              {provider?.name} isn't available
            </h2>
              <p className="text-gray-600">
              {provider?.unavailableDate || "Today, Dec 21 at 2:00 PM"}
            </p>
            </div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
            <FaTools className="text-green-600" size={20} />
          </div>
          <p className="text-sm text-gray-800">
            <span className="font-semibold text-green-700">{provider?.similarCount || 3} electricians</span> similar to {provider?.name} are available now
          </p>
        </div>
                <div className="space-y-3">
                    <button
            onClick={handleSeeSimilar}
            className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
          > <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <FiUser className="text-green-600" size={20} />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900 mb-1">See similar providers</h3>
                <p className="text-sm text-gray-600">Keep your booking details, just switch provider</p>
              </div>
            </div>
            <FiChevronRight className="text-gray-400 group-hover:text-gray-600" size={20} />
          </button>
           <button
            onClick={handleWaitForProvider}
            className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <FiClock className="text-yellow-600" size={20} />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900 mb-1">Wait for {provider?.name}</h3>
                <p className="text-sm text-gray-600">Get notified when they become available</p>
              </div>
            </div>
            <FiChevronRight className="text-gray-400 group-hover:text-gray-600" size={20} />
          </button>
</div>
        </div>
    </Modal>
  )

}