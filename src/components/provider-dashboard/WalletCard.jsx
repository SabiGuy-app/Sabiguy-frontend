import { useState, useEffect } from "react";
import {
  FiChevronDown,
  FiTrendingUp,
  FiTrendingDown,
  FiCopy,
  FiCheckCircle,
  FiArrowUpRight,
  FiArrowDownLeft
} from "react-icons/fi";
import { FaPencilAlt, FaPaperPlane } from "react-icons/fa";
import { getWalletBalance, formatCurrency } from "../../api/provider";

export default function WalletCard() {
  const [walletData, setWalletData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWalletBalance = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getWalletBalance({ bustCache: true });
        console.log("🔍 Wallet API Full Response:", response);

        // Handle nested data structure
        const data = response.data?.data || response.data || response;
        console.log("💰 Extracted Wallet Data:", data);
        console.log("💵 Available Balance:", data?.available);
        console.log("⏳ Pending:", data?.pending);
        console.log("📤 Total Withdrawals:", data?.totalWithdrawals);

        setWalletData(data);
      } catch (err) {
        console.error("❌ Error fetching wallet balance:", err);
        console.error("❌ Error response:", err.response);
        setError(err.response?.data?.message || "Failed to load wallet data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchWalletBalance();
  }, []);

  // Removed loading skeleton - wallet displays immediately with default values

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
        <h2 className="text-3xl font-bold text-gray-900 mb-4">{formatCurrency(balance)}</h2>
        <button className="w-full px-4 py-2.5 bg-[#005823] text-white font-medium rounded-lg hover:bg-[#004019] transition-colors flex items-center justify-center gap-2">
          <FiArrowUpRight size={18} />
          Withdraw
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
        <div>
          <p className="text-xs text-gray-600 mb-1">Total Withdrawn</p>
          <p className="text-lg font-semibold text-gray-900">{formatCurrency(walletData?.totalWithdrawals || 0)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600 mb-1">Pending Earnings</p>
          <p className="text-lg font-semibold text-gray-900">{formatCurrency(walletData?.pending || 0)}</p>
        </div>
      </div>
    </div>
  );
}