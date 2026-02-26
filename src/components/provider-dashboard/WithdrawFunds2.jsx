export default function WithdrawStep2({ onBack, onConfirm, withdrawalInfo }) {
  const sendFee = 0.00;
  const totalAmount = withdrawalInfo.amount + sendFee;

  return (
    <>
      <p className="text-sm text-gray-600 mb-6">
        Review your withdrawal details before confirming
      </p>

      {/* Amount Summary */}
      <div className="space-y-4 mb-6">
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Withdrawal Amount</span>
          <span className="text-base font-semibold text-gray-900">
            ₦{withdrawalInfo.amount.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Send fee</span>
          <span className="text-base font-semibold text-gray-900">₦{sendFee.toFixed(2)}</span>
        </div>
        <div className="flex justify-between pt-4 border-t border-gray-200">
          <span className="text-sm font-semibold text-gray-900">Total Amount</span>
          <span className="text-lg font-bold text-gray-900">
            ₦{totalAmount.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Withdrawal Details */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Withdrawal to:</h4>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Account name</span>
            <span className="text-gray-900 font-medium">{withdrawalInfo.accountName}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Bank name</span>
            <span className="text-gray-900 font-medium">{withdrawalInfo.bankName}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Account number</span>
            <span className="text-gray-900 font-medium">{withdrawalInfo.accountNumber}</span>
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-4 italic">
          Funds typically arrive in 1-5 minutes
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 px-6 py-3 bg-white border-2 border-gray-300 text-gray-900 font-medium rounded-lg hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 px-6 py-3 bg-[#005823] text-white font-medium rounded-lg hover:bg-[#004019] transition-colors"
        >
          Confirm Withdrawal
        </button>
      </div>
    </>
  );
}