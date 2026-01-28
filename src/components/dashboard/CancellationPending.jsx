import { FiInfo } from "react-icons/fi";
import Modal from "../Modal";

export default function CancellationPendingModal({ isOpen, onClose }) {

    return (
        <Modal
        isOpen={isOpen} 
      onClose={onClose} 
      title="Cancellation pending approval"
      showCloseButton={false}
    >
        <div className="flex items-start gap-3 mb-6">
        <FiInfo className="text-blue-500 flex-shrink-0 mt-1" size={20} />
        <div className="text-sm text-gray-600 space-y-3">
          <p>
            We've received your cancellation request. The service provider will need to review and approve it before the request can be closed.
          </p>
          <p>You'll be notified once it's confirmed.</p>
        </div>
      </div>
       <div className="flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 px-6 py-3 bg-white border-2 border-gray-300 text-gray-900 font-medium rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onClose}
          className="flex-1 px-6 py-3 bg-[#005823] text-white font-medium rounded-lg hover:bg-[#004019] transition-colors"
        >
          Continue
        </button>
      </div>
    </Modal>
    );
}