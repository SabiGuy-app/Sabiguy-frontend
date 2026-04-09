import { useState } from "react";
import { FiCopy, FiAlertCircle } from "react-icons/fi";

const maskAccountNumber = (num) => {
  if (!num || num.length < 4) return num || "";
  return "****" + num.slice(-4);
};

export default function WithdrawStep1({
  onNext,
  availableBalance,
  withdrawalInfo,
  setWithdrawalInfo,
  hasBankDetails,
  onClose,
}) {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  const handleNext = () => {
    const numAmount = parseFloat(amount);

    if (!amount || numAmount <= 0) {
      setError("Please enter a valid amount");
      return;
    }
    if (numAmount < 10) {
      setError("Minimum withdrawal: ₦1,000");
      return;
    }

    if (numAmount > availableBalance) {
      setError("Insufficient balance");
      return;
    }
    setWithdrawalInfo({ ...withdrawalInfo, amount: numAmount });
    onNext();
  };

  return (
    <>
      <p className="text-sm text-gray-600 mb-6">
        Enter the amount you want to withdraw to your bank account
      </p>

      {/* Bank details missing warning */}
      {!hasBankDetails && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
          <FiAlertCircle className="text-red-500 mt-0.5 flex-shrink-0" size={18} />
          <div>
            <p className="text-sm font-medium text-red-800">Bank details not set up</p>
            <p className="text-xs text-red-600 mt-1">
              Please go to your Service Profile tab and add your bank account details before withdrawing.
            </p>
          </div>
        </div>
      )}

      {/* Available Balance */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6 flex items-center justify-between">
        <span className="text-sm text-gray-600">Available Balance</span>
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-gray-900">
            ₦{availableBalance.toLocaleString()}
          </span>
          <button className="text-gray-400 hover:text-gray-600">
            <FiCopy size={16} />
          </button>
        </div>
      </div>

      {/* Amount Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Amount
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
            ₦
          </span>
          <input
            type="number"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setError("");
            }}
            placeholder=""
            disabled={!hasBankDetails}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BC53F] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
        <p className="text-xs text-gray-500 mt-2">Minimum withdrawal: ₦1,000</p>
        {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
      </div>

      {/* Withdrawal Details */}
      {hasBankDetails && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">
            Withdrawal to:
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Account name</span>
              <span className="text-gray-900 font-medium">
                {withdrawalInfo.accountName}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Bank name</span>
              <span className="text-gray-900 font-medium">
                {withdrawalInfo.bankName}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Account number</span>
              <span className="text-gray-900 font-medium">
                {maskAccountNumber(withdrawalInfo.accountNumber)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Next Button */}
      <button
        onClick={handleNext}
        disabled={!hasBankDetails}
        className="w-full px-6 py-3 bg-[#005823] text-white font-medium rounded-lg hover:bg-[#004019] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </>
  );
}

