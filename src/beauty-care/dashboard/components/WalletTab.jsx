import { useState } from "react";
import { FiSearch, FiPlus } from "react-icons/fi";
import { ChevronLeft, ChevronRight } from "lucide-react";
import BeautyFundWalletModal from "./BeautyFundWalletModal";

const SAMPLE_BALANCE = 125000;

const SAMPLE_TRANSACTIONS = [
  {
    _id: "1",
    description: "Payment to Artisan - Plumbing",
    type: "debit",
    amount: 15000,
    createdAt: "2026-09-10T10:00:00Z",
    status: "completed",
  },
  {
    _id: "2",
    description: "Wallet Top-up",
    type: "credit",
    amount: 50000,
    createdAt: "2026-09-08T14:30:00Z",
    status: "completed",
  },
  {
    _id: "3",
    description: "Escrow Hold - Electrical Job",
    type: "escrow",
    amount: 20000,
    createdAt: "2026-09-05T09:15:00Z",
    status: "pending",
  },
  {
    _id: "4",
    description: "Withdrawal to Bank",
    type: "withdrawal",
    amount: 30000,
    createdAt: "2026-09-01T17:45:00Z",
    status: "completed",
  },
  {
    _id: "5",
    description: "Refund - Cancelled Job",
    type: "refund",
    amount: 8000,
    createdAt: "2026-08-28T12:20:00Z",
    status: "failed",
  },
];

const STATUS_BADGE_STYLES = {
  completed: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  failed: "bg-red-100 text-red-700",
};

// Wallet Tab Content (static)
export default function BeautyWalletTab() {
  const currentPage = 1;
  const totalPages = 1;
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-1">My Wallet</h2>
        <p className="text-sm text-gray-500 italic">
          Tip: Use your wallet to pay artisans fast
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-8 w-full sm:max-w-xs">
        <p className="text-sm text-gray-600 mb-3">Available Balance</p>
        <h3 className="text-3xl font-bold text-gray-900 mb-4">
          ₦{SAMPLE_BALANCE.toLocaleString()}
        </h3>
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full px-4 py-2 bg-[#005823] text-white font-medium rounded-lg hover:bg-[#004019] transition-colors"
        >
          Fund wallet
        </button>
      </div>

      <div className="mb-8 w-full">
        <div className="flex flex-col gap-3 mb-4 w-full max-w-full md:flex-row md:flex-wrap">
          <div className="relative flex-1 min-w-0">
            <FiSearch
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BC53F] focus:border-transparent text-sm"
              readOnly
            />
          </div>

          <select
            defaultValue="All Status"
            className="w-full md:w-auto min-w-0 px-1 py-1 shrink border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BC53F] text-sm text-gray-700 bg-white cursor-pointer"
          >
            <option>All Status</option>
            <option>Credit</option>
            <option>Debit</option>
            <option>Escrow</option>
            <option>Withdrawal</option>
            <option>Refund</option>
          </select>

          <select
            defaultValue="This month"
            className="w-full md:w-auto min-w-0 px-1 py-1 shrink border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BC53F] text-sm text-gray-700 bg-white cursor-pointer"
          >
            <option>This month</option>
            <option>Last month</option>
            <option>Last 3 months</option>
            <option>This year</option>
          </select>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="hidden sm:block overflow-x-auto w-full max-w-full">
            <table className="w-full min-w-full table-fixed">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-2 sm:px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    <span className="truncate block">Description</span>
                  </th>
                  <th className="px-2 sm:px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    <span className="truncate block">Transaction Type</span>
                  </th>
                  <th className="px-3 sm:px-6 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="hidden sm:table-cell px-3 sm:px-6 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="hidden sm:table-cell px-3 sm:px-6 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {SAMPLE_TRANSACTIONS.map((transaction) => (
                  <tr
                    key={transaction._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-2 sm:px-4 py-4 text-sm text-gray-900 break-words max-w-[120px]">
                      <span className="truncate block">
                        {transaction.description || transaction.type}
                      </span>
                    </td>
                    <td className="hidden sm:table-cell px-4 sm:px-6 py-4 text-sm text-gray-900 capitalize">
                      {transaction.type}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-900">
                      ₦{transaction.amount.toLocaleString()}
                    </td>
                    <td className="hidden sm:table-cell px-4 sm:px-6 py-4 text-sm text-gray-900">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-medium rounded-full capitalize ${
                          STATUS_BADGE_STYLES[transaction.status] ||
                          "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="sm:hidden">
            {SAMPLE_TRANSACTIONS.map((t) => (
              <div key={t._id} className="p-4 border-b last:border-b-0">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-sm truncate">
                    {t.description || t.type}
                  </span>
                  <span className="text-sm">₦{t.amount.toLocaleString()}</span>
                </div>
                <div className="text-xs text-gray-500 flex flex-wrap gap-2">
                  <span className="capitalize">{t.type}</span>
                  <span>{new Date(t.createdAt).toLocaleDateString()}</span>
                  <span
                    className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full capitalize ${
                      STATUS_BADGE_STYLES[t.status] || "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {t.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
            <button
              disabled
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
              Previous
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    className={`w-8 h-8 flex items-center justify-center text-sm rounded-lg transition-colors ${
                      currentPage === page
                        ? "bg-[#005823] text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
            </div>

            <button
              disabled
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <BeautyFundWalletModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}