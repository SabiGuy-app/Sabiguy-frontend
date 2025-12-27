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

export default function RecentTransactions() {
  const transactions = [
    {
      id: 1,
      title: "Kitchen Renovation",
      name: "John Smith",
      amount: "+₦64,000",
      note: "Platform fee: ₦6,400",
      date: "Oct 28, 2025",
      type: "credit",
    },
    {
      id: 2,
      title: "Kitchen Renovation",
      name: "John Smith",
      amount: "+₦64,000",
      note: "Platform fee: ₦6,400",
      date: "Oct 28, 2025",
      type: "credit",
    },
    {
      id: 3,
      title: "Withdrawal to Bank",
      name: "****1234",
      amount: "-₦50,000",
      note: "Completed",
      date: "Nov 13, 2025",
      type: "debit",
    },
    {
      id: 4,
      title: "Tip from John Smith",
      name: "Kitchen Renovation",
      amount: "+₦500",
      date: "Oct 28, 2025",
      type: "credit",
    },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transaction</h3>

      <div className="space-y-3">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-start justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  transaction.type === "credit" ? "bg-green-100" : "bg-red-100"
                }`}
              >
                <FiCheckCircle
                  className={transaction.type === "credit" ? "text-green-600" : "text-red-600"}
                  size={20}
                />
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">{transaction.title}</h4>
                <p className="text-xs text-gray-600">{transaction.name}</p>
                {transaction.note && (
                  <p className="text-xs text-gray-500 mt-1">{transaction.note}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">{transaction.date}</p>
              </div>
            </div>
            <span
              className={`text-sm font-semibold ${
                transaction.type === "credit" ? "text-green-600" : "text-red-600"
              }`}
            >
              {transaction.amount}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}