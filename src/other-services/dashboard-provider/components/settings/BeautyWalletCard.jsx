import { FiCopy, FiArrowUpRight } from "react-icons/fi";

// Demo copy of the provider Wallet card for the beauty dashboard.
// Static balances — no API call or withdraw flow wired yet.
const WALLET = {
  available: 94000,
  totalWithdrawn: 94000,
  pending: 25000,
};

const formatNaira = (value) => `₦${Number(value || 0).toLocaleString("en-NG")}`;

export default function BeautyWalletCard() {
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
          {formatNaira(WALLET.available)}
        </h2>
        <button
          type="button"
          className="w-full px-4 py-2.5 bg-[#005823] text-white font-medium rounded-lg hover:bg-[#004019] transition-colors flex items-center justify-center gap-2"
        >
          <FiArrowUpRight size={18} />
          Withdraw
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
        <div>
          <p className="text-xs text-gray-600 mb-1">Total Withdrawn</p>
          <p className="text-lg font-semibold text-gray-900">
            {formatNaira(WALLET.totalWithdrawn)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-600 mb-1">Pending Earnings</p>
          <p className="text-lg font-semibold text-gray-900">
            {formatNaira(WALLET.pending)}
          </p>
        </div>
      </div>
    </div>
  );
}
