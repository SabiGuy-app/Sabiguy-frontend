import { FiArrowDownLeft, FiArrowUpRight } from "react-icons/fi";

// Demo copy of the provider Recent Transactions list for the beauty dashboard.
const TRANSACTIONS = [
  {
    id: 1,
    description: "Kitchen Renovation",
    subtitle: "John Smith",
    date: "Oct 28, 2025",
    amount: 64000,
    direction: "credit",
    note: "Platform fee: ₦6,400",
  },
  {
    id: 2,
    description: "Kitchen Renovation",
    subtitle: "John Smith",
    date: "Oct 28, 2025",
    amount: 64000,
    direction: "credit",
    note: "Platform fee: ₦6,400",
  },
  {
    id: 3,
    description: "Withdrawal to Bank",
    subtitle: "****1234",
    date: "Nov 13, 2025",
    amount: 50000,
    direction: "debit",
    note: "Completed",
  },
  {
    id: 4,
    description: "Tip from John Smith",
    subtitle: "Kitchen Renovation",
    date: "Oct 28, 2025",
    amount: 500,
    direction: "credit",
  },
];

const formatAmount = (amount, direction) => {
  const value = Math.abs(amount || 0).toLocaleString("en-NG");
  return `${direction === "debit" ? "-" : "+"}₦${value}`;
};

export default function BeautyRecentTransactions() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Recent Transaction
      </h3>

      <div className="space-y-1">
        {TRANSACTIONS.map((tx) => {
          const isDebit = tx.direction === "debit";
          const Icon = isDebit ? FiArrowUpRight : FiArrowDownLeft;
          return (
            <div
              key={tx.id}
              className="flex items-start justify-between p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isDebit ? "bg-red-100" : "bg-green-100"
                  }`}
                >
                  <Icon
                    className={isDebit ? "text-red-600" : "text-green-600"}
                    size={20}
                  />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    {tx.description}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">{tx.subtitle}</p>
                  <p className="text-xs text-gray-500 mt-1">{tx.date}</p>
                </div>
              </div>
              <div className="text-right">
                <span
                  className={`text-sm font-semibold ${
                    isDebit ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {formatAmount(tx.amount, tx.direction)}
                </span>
                {tx.note && (
                  <p className="text-xs text-gray-500 mt-1">{tx.note}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
