import { useState, useEffect } from "react";
import { FiCopy, FiArrowUpRight } from "react-icons/fi";
import { getWalletBalance, formatCurrency } from "../../api/provider";
import WithdrawFundsModal from "./WithdrawFundModal";

export default function WalletCard() {
  const [walletData, setWalletData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);

  const fetchWalletBalance = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getWalletBalance({ bustCache: true });
      const data = response.data?.data || response.data || response;
      setWalletData(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load wallet data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletBalance();
  }, []);

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  const balance = walletData?.available || 0;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-sm font-medium text-gray-600 mb-2">Wallet</h3>
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Available Balance</span>
          <button className="text-gray-400 hover:text-gray-600">
            <FiCopy size={16} />
          </button>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          {isLoading ? "Loading..." : formatCurrency(balance)}
        </h2>
        <button
          onClick={() => setIsWithdrawOpen(true)}
          disabled={isLoading}
          className="w-full px-4 py-2.5 bg-[#005823] text-white font-medium rounded-lg hover:bg-[#004019] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiArrowUpRight size={18} />
          Withdraw
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
        <div>
          <p className="text-xs text-gray-600 mb-1">Total Withdrawn</p>
          <p className="text-lg font-semibold text-gray-900">
            {isLoading
              ? "Loading..."
              : formatCurrency(walletData?.totalWithdrawals || 0)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-600 mb-1">Pending Earnings</p>
          <p className="text-lg font-semibold text-gray-900">
            {isLoading
              ? "Loading..."
              : formatCurrency(walletData?.pending || 0)}
          </p>
        </div>
      </div>

      <WithdrawFundsModal
        isOpen={isWithdrawOpen}
        onClose={() => {
          setIsWithdrawOpen(false);
          fetchWalletBalance(); // Refresh balance after withdrawal
        }}
        availableBalance={balance}
      />
    </div>
  );
}
