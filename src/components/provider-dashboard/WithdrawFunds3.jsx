import { FiCheck } from "react-icons/fi";
export default function WithdrawStep3({ onClose, withdrawalInfo }) {
  return (
    <div className="text-center">
      {/* Success Icon */}
      <div className="w-24 h-24 bg-[#005823] rounded-full flex items-center justify-center mx-auto mb-6">
        <FiCheck className="text-white" size={48} strokeWidth={3} />
      </div>

      {/* Amount */}
      <h3 className="text-3xl font-bold text-gray-900 mb-2">
        ₦{withdrawalInfo.amount.toLocaleString()}
      </h3>
      <p className="text-base text-gray-600 mb-6">Withdrawal Initiated Successfully</p>

      {/* Withdrawal Details */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">To:</span>
            <span className="text-gray-900 font-medium">{withdrawalInfo.accountName}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Bank:</span>
            <span className="text-gray-900 font-medium">{withdrawalInfo.bankName}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Account number:</span>
            <span className="text-gray-900 font-medium">{withdrawalInfo.accountNumber}</span>
          </div>
        </div>
      </div>

      {/* Info Message */}
      <p className="text-sm text-gray-500 mb-6">
        You will receive a confirmation email shortly. You can track your withdrawal in the Payouts tab.
      </p>

      {/* Done Button */}
      <button
        onClick={onClose}
        className="w-full px-6 py-3 bg-[#005823] text-white font-medium rounded-lg hover:bg-[#004019] transition-colors"
      >
        Done
      </button>
    </div>
  );
}