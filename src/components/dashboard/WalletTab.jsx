import { useState } from "react";
import { FiSearch, FiDownload } from "react-icons/fi";
import {  ChevronDown } from 'lucide-react'


export default function WalletTab() {
  const [activeTransactionTab, setActiveTransactionTab] = useState("earnings");

  const transactions = [
    {
      id: 1,
      type: "tip",
      title: "Tip from John Smith",
      subtitle: "Kitchen Renovation",
      date: "Oct 28, 2025",
      amount: "+₦500",
      positive: true,
    },
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">My Wallet</h2>

      {/* Available Balance Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <p className="text-sm text-gray-600 mb-2">Available Balance</p>
        <h3 className="text-4xl font-bold text-gray-900 mb-4">₦100,000.00</h3>
        <button className="px-6 py-2.5 bg-[#005823] text-white font-medium rounded-lg hover:bg-[#004019] transition-colors">
          Withdraw
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-600 mb-1">Total Earnings</p>
          <p className="text-xl font-bold text-gray-900">₦150,000</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-600 mb-1">Pending Earnings</p>
          <p className="text-xl font-bold text-gray-900">₦25,000</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-600 mb-1">Total Withdrawn</p>
          <p className="text-xl font-bold text-gray-900">₦94,000</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BC53F] focus:border-transparent"
          />
        </div>
        <button className="px-4 py-2.5 border border-gray-300 rounded-lg flex items-center gap-2 text-sm text-gray-700 hover:bg-gray-50">
          This month
          <ChevronDown size={16} />
        </button>
      </div>

      {/* Transaction Tabs */}
      <div className="bg-gray-50 rounded-lg p-1 flex gap-1 mb-4">
        {["Earnings", "Payouts", "Tips"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTransactionTab(tab.toLowerCase())}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all ${
              activeTransactionTab === tab.toLowerCase()
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
        {transactions.map((transaction) => (
          <div key={transaction.id} className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <FiDownload className="text-green-600" size={20} />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{transaction.title}</h4>
                <p className="text-sm text-gray-600">{transaction.subtitle}</p>
                <p className="text-xs text-gray-500">{transaction.date}</p>
              </div>
            </div>
            <span className={`font-semibold ${transaction.positive ? "text-green-600" : "text-red-600"}`}>
              {transaction.amount}
            </span>
          </div>
        ))}
      </div>

      {/* Platform Fee Notice */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-2">Platform service fee</h4>
        <p className="text-sm text-gray-600">
          Note: A 10% platform fee applies to all completed transactions. For example, if you earn ₦10,000, your payout will be ₦9,000.
        </p>
      </div>
    </div>
  );
}