import { useState } from "react";
import { FiCopy } from "react-icons/fi";
export default function WithdrawStep1({
  onNext,
  availableBalance,
  withdrawalInfo,
  setWithdrawalInfo,
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
    if (numAmount < 1000) {
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
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BC53F] focus:border-transparent"
          />
        </div>
        <p className="text-xs text-gray-500 mt-2">Minimum withdrawal: ₦1,000</p>
        {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
      </div>

      {/* Withdrawal Details */}
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
              {withdrawalInfo.accountNumber}
            </span>
          </div>
        </div>
      </div>

      {/* Next Button */}
      <button
        onClick={handleNext}
        className="w-full px-6 py-3 bg-[#005823] text-white font-medium rounded-lg hover:bg-[#004019] transition-colors"
      >
        Next
      </button>
    </>
  );
}
