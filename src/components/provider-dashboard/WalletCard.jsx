import { useState } from "react";
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

export default function WalletCard() {
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
        <h2 className="text-3xl font-bold text-gray-900 mb-4">₦94,000</h2>
        <button className="w-full px-4 py-2.5 bg-[#005823] text-white font-medium rounded-lg hover:bg-[#004019] transition-colors flex items-center justify-center gap-2">
          <FiArrowUpRight size={18} />
          Withdraw
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
        <div>
          <p className="text-xs text-gray-600 mb-1">Total Withdrawn</p>
          <p className="text-lg font-semibold text-gray-900">₦94,000</p>
        </div>
        <div>
          <p className="text-xs text-gray-600 mb-1">Pending Earnings</p>
          <p className="text-lg font-semibold text-gray-900">₦25,000</p>
        </div>
      </div>
    </div>
  );
}