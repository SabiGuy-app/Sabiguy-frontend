import { useState, useEffect } from "react";
import {
  FiCheckCircle,
  FiArrowUpRight,
  FiArrowDownLeft,
  FiClock
} from "react-icons/fi";
import { getWalletTransactions } from "../../api/provider";

// Provider-perspective transaction type config
const typeConfig = {
  credit: { direction: "+", bgColor: "bg-green-100", iconColor: "text-green-600", textColor: "text-green-600", Icon: FiArrowDownLeft },
  escrow: { direction: "+", bgColor: "bg-yellow-100", iconColor: "text-yellow-600", textColor: "text-yellow-600", Icon: FiClock },
  debit: { direction: "-", bgColor: "bg-red-100", iconColor: "text-red-600", textColor: "text-red-600", Icon: FiArrowUpRight },
  withdrawal: { direction: "-", bgColor: "bg-red-100", iconColor: "text-red-600", textColor: "text-red-600", Icon: FiArrowUpRight },
  refund: { direction: "-", bgColor: "bg-red-100", iconColor: "text-red-600", textColor: "text-red-600", Icon: FiArrowUpRight },
};

const defaultConfig = { direction: "", bgColor: "bg-gray-100", iconColor: "text-gray-600", textColor: "text-gray-600", Icon: FiCheckCircle };

export default function RecentTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getWalletTransactions(1, 5);
      setTransactions(data.data || []);
    } catch (err) {
      console.error("Failed to fetch recent transactions:", err);
      setError("Failed to load transactions");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const getConfig = (type) => typeConfig[type] || defaultConfig;

  const formatAmount = (amount, type) => {
    const value = Math.abs(amount || 0).toLocaleString("en-NG");
    const { direction } = getConfig(type);
    return `${direction}₦${value}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-NG", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transaction</h3>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start justify-between p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
              <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transaction</h3>
        <div className="text-center py-8">
          <p className="text-sm text-gray-500 mb-3">{error}</p>
          <button
            onClick={fetchTransactions}
            className="px-4 py-2 text-sm font-medium text-[#005823] border border-[#005823] rounded-lg hover:bg-[#005823] hover:text-white transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transaction</h3>
        <div className="text-center py-8">
          <p className="text-sm text-gray-500">No transactions yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transaction</h3>

      <div className="space-y-3">
        {transactions.map((transaction) => {
          const config = getConfig(transaction.type);
          const { Icon } = config;
          return (
            <div
              key={transaction._id}
              className="flex items-start justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${config.bgColor}`}
                >
                  <Icon className={config.iconColor} size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    {transaction.description || transaction.type}
                  </h4>
                  {transaction.status && (
                    <p className="text-xs text-gray-500 mt-1 capitalize">{transaction.status}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDate(transaction.createdAt)}
                  </p>
                </div>
              </div>
              <span className={`text-sm font-semibold ${config.textColor}`}>
                {formatAmount(transaction.amount, transaction.type)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}