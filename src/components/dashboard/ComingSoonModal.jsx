import React from "react";
import { X } from "lucide-react";

export default function ComingSoonModal({ isOpen, onClose, service }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 backdrop-blur-xs" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-xl max-w-xl w-full mx-4 p-6">
        <div className="flex justify-center mb-4">
          <div className="bg-green-50 p-4 rounded-full">
            {service?.image ? (
              <img src={service.image} alt="" className="w-16 h-16" />
            ) : (
              <div className="w-16 h-16 bg-green-100 rounded-full" />
            )}
          </div>
        </div>

        <h3 className="text-2xl font-semibold text-center text-[#231F20] mb-2">
          {service?.title || "Service"}
        </h3>

        <div className="bg-[#F6821F1A] text-[#F6821F] w-fit m-auto text-xs px-3 py-1 mb-4 mt-3 rounded-full font-medium">
          Coming Soon
        </div>

        <p className="text-center w-[70%] m-auto text-gray-600 mb-6">
          Quick access to {service?.title?.toLowerCase()} when you need it most.
          Launching soon.
        </p>

        <div className="space-y-3">
          <button
            className="w-full bg-[#33794f] hover:bg-green-700 text-white font-medium py-3 rounded-md transition-colors"
            onClick={onClose}
          >
            Notify Me
          </button>
          <button
            className="w-full bg-[#f4f4f4] hover:bg-gray-200 text-gray-700 font-medium py-3 rounded-lg transition-colors"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
