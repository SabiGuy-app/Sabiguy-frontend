import { useState, useEffect } from "react";
import { FiSearch, FiCheckCircle, FiArrowUpRight, FiArrowDownLeft, FiClock } from "react-icons/fi";
import { ChevronDown } from "lucide-react";
import WithdrawFundsModal from "./WithdrawFundModal";
import { getWalletBalance, getWalletTransactions, formatCurrency } from "../../api/provider";

const typeConfig = {
  credit: { direction: "+", bgColor: "bg-green-100", iconColor: "text-green-600", textColor: "text-green-600", Icon: FiArrowDownLeft },
  escrow: { direction: "+", bgColor: "bg-yellow-100", iconColor: "text-yellow-600", textColor: "text-yellow-600", Icon: FiClock },
  debit: { direction: "-", bgColor: "bg-red-100", iconColor: "text-red-600", textColor: "text-red-600", Icon: FiArrowUpRight },
  withdrawal: { direction: "-", bgColor: "bg-red-100", iconColor: "text-red-600", textColor: "text-red-600", Icon: FiArrowUpRight },
  refund: { direction: "-", bgColor: "bg-red-100", iconColor: "text-red-600", textColor: "text-red-600", Icon: FiArrowUpRight },
};

const defaultConfig = { direction: "", bgColor: "bg-gray-100", iconColor: "text-gray-600", textColor: "text-gray-600", Icon: FiCheckCircle };

export default function ProviderWalletTab() {
  const [activeTransactionTab, setActiveTransactionTab] = useState("all");
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("all_time");
  const [showDateDropdown, setShowDateDropdown] = useState(false);

  const [walletData, setWalletData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const tabToTypeMap = {
    earnings: "credit",
    payouts: "withdrawal",
    tips: "tip",
  };

  const dateFilterOptions = [
    { label: "All time", value: "all_time" },
    { label: "This week", value: "this_week" },
    { label: "This month", value: "this_month" },
    { label: "Last 3 months", value: "last_3_months" },
  ];

  const getDateFilterLabel = () =>
    dateFilterOptions.find((o) => o.value === dateFilter)?.label || "All time";

  // Fetch balance — extracted so it can be called after withdraw
  const fetchBalance = async () => {
    try {
      const balanceResponse = await getWalletBalance({ bustCache: true });
      const data = balanceResponse.data?.data || balanceResponse.data || balanceResponse;
      setWalletData(data);
    } catch (err) {
      console.error("Failed to load wallet balance:", err);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  // Fetch transactions when page or tab changes
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoading(true);
        const mappedType = tabToTypeMap[activeTransactionTab] || "";
        const txResponse = await getWalletTransactions(currentPage, 10, mappedType);

        setTransactions(txResponse?.data || txResponse?.data?.data || []);

        const pages = txResponse?.pagination?.pages || txResponse?.data?.pagination?.pages || txResponse?.meta?.pages || 1;
        setTotalPages(pages);
      } catch (err) {
        console.error("Failed to load transactions:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [currentPage, activeTransactionTab]);

  const handleTabChange = (tab) => {
    setActiveTransactionTab(tab.toLowerCase());
    setCurrentPage(1);
  };

  const getConfig = (type) => typeConfig[type] || defaultConfig;

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Filter transactions by search and date
  const filteredTransactions = transactions.filter((tx) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const desc = (tx.description || tx.type || "").toLowerCase();
      if (!desc.includes(query)) return false;
    }

    // Date filter
    if (dateFilter !== "all_time" && tx.createdAt) {
      const txDate = new Date(tx.createdAt);
      const now = new Date();
      if (dateFilter === "this_week") {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        if (txDate < weekAgo) return false;
      } else if (dateFilter === "this_month") {
        if (txDate.getMonth() !== now.getMonth() || txDate.getFullYear() !== now.getFullYear()) return false;
      } else if (dateFilter === "last_3_months") {
        const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
        if (txDate < threeMonthsAgo) return false;
      }
    }

    return true;
  });

  const balance = walletData?.available || 0;
  const totalEarnings = walletData?.totalEarnings || 0;
  const pendingEarnings = walletData?.pending || 0;
  const totalWithdrawn = walletData?.totalWithdrawals || 0;

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">My Wallet</h2>

      {/* Available Balance Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <p className="text-sm text-gray-600 mb-2">Available Balance</p>
        <h3 className="text-4xl font-bold text-gray-900 mb-4">{formatCurrency(balance)}</h3>
        <button
          onClick={() => setShowWithdrawModal(true)}
          className="px-6 py-2.5 bg-[#005823] text-white font-medium rounded-lg hover:bg-[#004019] transition-colors"
        >
          Withdraw
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-600 mb-1">Total Earnings</p>
          <p className="text-xl font-bold text-gray-900">{formatCurrency(totalEarnings)}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-600 mb-1">Pending Earnings</p>
          <p className="text-xl font-bold text-gray-900">{formatCurrency(pendingEarnings)}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-600 mb-1">Total Withdrawn</p>
          <p className="text-xl font-bold text-gray-900">{formatCurrency(totalWithdrawn)}</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="relative flex-1">
          <FiSearch
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className=" pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BC53F] focus:border-transparent"
          />
        </div>
        <div className="relative">
          <button
            onClick={() => setShowDateDropdown(!showDateDropdown)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg flex items-center gap-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            {getDateFilterLabel()}
            <ChevronDown size={16} />
          </button>
          {showDateDropdown && (
            <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[160px]">
              {dateFilterOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setDateFilter(option.value);
                    setShowDateDropdown(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${dateFilter === option.value ? "text-[#005823] font-medium bg-green-50" : "text-gray-700"
                    }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Transaction Tabs */}
      <div className="bg-gray-50 rounded-lg p-1 flex gap-1 mb-4">
        {["All", "Earnings", "Payouts", "Tips"].map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTransactionTab === tab.toLowerCase()
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Transactions List */}
      <div className="space-y-3 mb-6">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="h-8 w-8 border-4 border-[#005823] border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : filteredTransactions.length > 0 ? (
          filteredTransactions.map((transaction) => {
            const config = getConfig(transaction.type);
            const { Icon } = config;

            return (
              <div
                key={transaction._id}
                className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${config.bgColor}`}
                  >
                    <Icon className={config.iconColor} size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {transaction.description || transaction.type}
                    </h4>
                    {transaction.status && (
                      <p className="text-xs text-gray-500 capitalize">{transaction.status}</p>
                    )}
                    <p className="text-xs text-gray-500">{formatDate(transaction.createdAt)}</p>
                  </div>
                </div>
                <span className={`font-semibold ${config.textColor}`}>
                  {config.direction}₦{Math.abs(transaction.amount || 0).toLocaleString("en-NG")}
                </span>
              </div>
            );
          })
        ) : (
          <p className="text-sm text-gray-500 text-center py-8">
            No transactions found
          </p>
        )}

        {totalPages > 1 && (
          <div className="flex justify-between items-center py-4 border-t border-gray-200 mt-4">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
        <WithdrawFundsModal
          isOpen={showWithdrawModal}
          onClose={() => {
            setShowWithdrawModal(false);
            fetchBalance();
          }}
          availableBalance={balance}
        />
      </div>

      {/* Platform Fee Notice */}
      <div className="bg-blue-50 border border-gray-200 rounded-lg p-2">
        <h4 className=" text-sm font-semibold text-gray-900 mb-2">
          Platform service fee
        </h4>
        <p className="text-xs text-gray-600">
          Note: A 10% platform fee applies to all completed transactions. For
          example, if you earn ₦10,000, your payout will be ₦9,000.
        </p>
      </div>
    </div>
  );
}
