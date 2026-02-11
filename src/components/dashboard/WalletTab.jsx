import { useState, useEffect } from "react";
import { FiSearch, FiChevronDown, FiPlus } from "react-icons/fi";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import FundWalletModal from "./FundWalletModal";
import { getWalletBalance, getWalletTransactions } from "../../api/provider";
import { useSearchParams } from "react-router-dom";

// Wallet Tab Content
export default function WalletTab() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [timeFilter, setTimeFilter] = useState("This month");
  const [currentPage, setCurrentPage] = useState(1);
  const [balance, setBalance] = useState(0);
  const [isLoadingBalance, setIsLoadingBalance] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);

  const typeFilterMap = {
    "All Status": "",
    "Credit": "credit",
    "Debit": "debit",
    "Escrow": "escrow",
    "Withdrawal": "withdrawal",
    "Refund": "refund"
  };

  const fetchBalance = async () => {
    try {
      setIsLoadingBalance(true);
      const data = await getWalletBalance();
      setBalance(data.data.available || 0);
    } catch (error) {
      console.error("Failed to fetch wallet balance:", error);
    } finally {
      setIsLoadingBalance(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      setIsLoadingTransactions(true);
      const typeParam = typeFilterMap[statusFilter] || "";
      const data = await getWalletTransactions(currentPage, 10, typeParam);
      setTransactions(data.data || []);
      setTotalPages(data.pagination?.pages || 1);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
      setTransactions([]);
    } finally {
      setIsLoadingTransactions(false);
    }
  };

  useEffect(() => {
    fetchBalance();

    if (searchParams.get("payment_success")) {
      fetchTransactions();
      searchParams.delete("payment_success");
      setSearchParams(searchParams);
    }
  }, [searchParams.get("payment_success")]);

  useEffect(() => {
    fetchTransactions();
  }, [currentPage, statusFilter]);

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-1">My Wallet</h2>
        <p className="text-sm text-gray-500 italic">
          Tip: Use your wallet to pay artisans fast
        </p>
      </div>

      {/* Available Balance Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8 max-w-xs">
        <p className="text-sm text-gray-600 mb-3">Available Balance</p>
        <h3 className="text-4xl font-bold text-gray-900 mb-4">
          {isLoadingBalance ? "..." : `₦${balance.toLocaleString()}`}
        </h3>
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full px-6 py-2.5 bg-[#005823] text-white font-medium rounded-lg hover:bg-[#004019] transition-colors"
        >
          Fund wallet
        </button>
      </div>

      {/* Recent Transaction Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Recent transaction
        </h3>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <FiSearch
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BC53F] focus:border-transparent text-sm"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BC53F] text-sm text-gray-700 bg-white cursor-pointer"
          >
            <option>All Status</option>
            <option>Credit</option>
            <option>Debit</option>
            <option>Escrow</option>
            <option>Withdrawal</option>
            <option>Refund</option>
          </select>

          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BC53F] text-sm text-gray-700 bg-white cursor-pointer"
          >
            <option>This month</option>
            <option>Last month</option>
            <option>Last 3 months</option>
            <option>This year</option>
          </select>
        </div>

        {/* Transaction Table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Transaction Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {isLoadingTransactions ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                      Loading transactions...
                    </td>
                  </tr>
                ) : transactions.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                      No transactions found
                    </td>
                  </tr>
                ) : (
                  transactions.map((transaction) => (
                    <tr
                      key={transaction._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {transaction.description || transaction.type}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 capitalize">
                        {transaction.type}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        ₦{transaction.amount?.toLocaleString() || 0}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-3 py-1 text-xs font-medium rounded-full capitalize ${transaction.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : transaction.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                            }`}
                        >
                          {transaction.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
              Previous
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 flex items-center justify-center text-sm rounded-lg transition-colors ${currentPage === page
                    ? "bg-[#005823] text-white"
                    : "text-gray-700 hover:bg-gray-100"
                    }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Manage Cards Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Manage Cards
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Card 1 - Green Mastercard */}
          <div className="relative bg-gradient-to-br from-[#005823] to-[#003d18] rounded-xl p-6 text-white h-48 flex flex-col justify-between overflow-hidden">
            {/* Mastercard circles */}
            <div className="absolute top-4 right-4 flex items-center gap-1">
              <div className="w-8 h-8 bg-red-500 rounded-full opacity-80"></div>
              <div className="w-8 h-8 bg-orange-400 rounded-full opacity-80 -ml-4"></div>
            </div>

            <div>
              <div className="text-xs opacity-75 mb-1">Card Number</div>
              <div className="text-lg font-mono tracking-wider">
                5119 1198 5634 8532
              </div>
            </div>

            <div className="flex justify-between items-end">
              <div>
                <div className="text-xs opacity-75 mb-1">Card Holder</div>
                <div className="text-sm font-medium">23/26</div>
              </div>
              <div className="w-12 h-8 bg-white bg-opacity-20 rounded flex items-center justify-center">
                <div className="w-8 h-6 bg-white bg-opacity-30 rounded-sm"></div>
              </div>
            </div>
          </div>

          {/* Card 2 - Light Visa */}
          <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-6 text-gray-800 h-48 flex flex-col justify-between border border-gray-300">
            <div className="absolute top-4 right-4 text-2xl font-bold text-blue-600">
              VISA
            </div>

            <div>
              <div className="text-xs text-gray-600 mb-1">Card Number</div>
              <div className="text-lg font-mono tracking-wider">
                5234 1198 5634 1234
              </div>
            </div>

            <div className="flex justify-between items-end">
              <div>
                <div className="text-xs text-gray-600 mb-1">Card Holder</div>
                <div className="text-sm font-medium">23/26</div>
              </div>
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                <div className="w-6 h-1 bg-gray-400"></div>
              </div>
            </div>
          </div>

          {/* Add Card Button */}
          <div className="border-2 border-dashed border-gray-300 rounded-xl h-48 flex items-center justify-center hover:border-gray-400 transition-colors cursor-pointer group">
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-gray-200 transition-colors">
                <FiPlus size={24} className="text-gray-600" />
              </div>
              <p className="text-sm text-gray-600 font-medium">Add New Card</p>
            </div>
          </div>
        </div>
      </div>

      <FundWalletModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
