// import { useState } from "react";
// import { FiSearch, FiDownload } from "react-icons/fi";
// import {  ChevronDown } from 'lucide-react'


// export default function WalletTab() {
//   const [activeTransactionTab, setActiveTransactionTab] = useState("earnings");

//   const transactions = [
//     {
//       id: 1,
//       type: "tip",
//       title: "Tip from John Smith",
//       subtitle: "Kitchen Renovation",
//       date: "Oct 28, 2025",
//       amount: "+₦500",
//       positive: true,
//     },
//   ];

//   return (
//     <div>
//       <h2 className="text-xl font-semibold text-gray-900 mb-6">My Wallet</h2>

//       {/* Available Balance Card */}
//       <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
//         <p className="text-sm text-gray-600 mb-2">Available Balance</p>
//         <h3 className="text-4xl font-bold text-gray-900 mb-4">₦100,000.00</h3>
//         <button className="px-6 py-2.5 bg-[#005823] text-white font-medium rounded-lg hover:bg-[#004019] transition-colors">
//           Withdraw
//         </button>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//         <div className="bg-white border border-gray-200 rounded-lg p-4">
//           <p className="text-xs text-gray-600 mb-1">Total Earnings</p>
//           <p className="text-xl font-bold text-gray-900">₦150,000</p>
//         </div>
//         <div className="bg-white border border-gray-200 rounded-lg p-4">
//           <p className="text-xs text-gray-600 mb-1">Pending Earnings</p>
//           <p className="text-xl font-bold text-gray-900">₦25,000</p>
//         </div>
//         <div className="bg-white border border-gray-200 rounded-lg p-4">
//           <p className="text-xs text-gray-600 mb-1">Total Withdrawn</p>
//           <p className="text-xl font-bold text-gray-900">₦94,000</p>
//         </div>
//       </div>

//       {/* Search and Filter */}
//       <div className="flex flex-col md:flex-row gap-4 mb-4">
//         <div className="relative flex-1">
//           <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
//           <input
//             type="text"
//             placeholder="Search"
//             className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BC53F] focus:border-transparent"
//           />
//         </div>
//         <button className="px-4 py-2.5 border border-gray-300 rounded-lg flex items-center gap-2 text-sm text-gray-700 hover:bg-gray-50">
//           This month
//           <ChevronDown size={16} />
//         </button>
//       </div>

//       {/* Transaction Tabs */}
//       <div className="bg-gray-50 rounded-lg p-1 flex gap-1 mb-4">
//         {["Earnings", "Payouts", "Tips"].map((tab) => (
//           <button
//             key={tab}
//             onClick={() => setActiveTransactionTab(tab.toLowerCase())}
//             className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all ${
//               activeTransactionTab === tab.toLowerCase()
//                 ? "bg-white text-gray-900 shadow-sm"
//                 : "text-gray-600 hover:text-gray-900"
//             }`}
//           >
//             {tab}
//           </button>
//         ))}
//       </div>

//       {/* Transactions List */}
//       <div className="space-y-3 mb-6">
//         {transactions.map((transaction) => (
//           <div key={transaction.id} className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
//                 <FiDownload className="text-green-600" size={20} />
//               </div>
//               <div>
//                 <h4 className="font-medium text-gray-900">{transaction.title}</h4>
//                 <p className="text-sm text-gray-600">{transaction.subtitle}</p>
//                 <p className="text-xs text-gray-500">{transaction.date}</p>
//               </div>
//             </div>
//             <span className={`font-semibold ${transaction.positive ? "text-green-600" : "text-red-600"}`}>
//               {transaction.amount}
//             </span>
//           </div>
//         ))}
//       </div>

//       {/* Platform Fee Notice */}
//       <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
//         <h4 className="font-semibold text-gray-900 mb-2">Platform service fee</h4>
//         <p className="text-sm text-gray-600">
//           Note: A 10% platform fee applies to all completed transactions. For example, if you earn ₦10,000, your payout will be ₦9,000.
//         </p>
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import { FiSearch, FiChevronDown, FiPlus } from "react-icons/fi";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Wallet Tab Content
export default function WalletTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [timeFilter, setTimeFilter] = useState("This month");
  const [currentPage, setCurrentPage] = useState(1);

  // Mock transaction data
  const transactions = [
    {
      id: 1,
      description: "Plumbing",
      type: "Card",
      amount: "50,000",
      date: "22/10/2025",
      status: "Successful",
    },
    {
      id: 2,
      description: "Plumbing",
      type: "Card",
      amount: "50,000",
      date: "22/10/2025",
      status: "Successful",
    },
    {
      id: 3,
      description: "Plumbing",
      type: "Card",
      amount: "50,000",
      date: "22/10/2025",
      status: "Successful",
    },
    {
      id: 4,
      description: "Plumbing",
      type: "Card",
      amount: "50,000",
      date: "22/10/2025",
      status: "Successful",
    },
    {
      id: 5,
      description: "Plumbing",
      type: "Card",
      amount: "50,000",
      date: "22/10/2025",
      status: "Successful",
    },
    {
      id: 6,
      description: "Plumbing",
      type: "Card",
      amount: "50,000",
      date: "22/10/2025",
      status: "Successful",
    },
    {
      id: 7,
      description: "Plumbing",
      type: "Card",
      amount: "50,000",
      date: "22/10/2025",
      status: "Failed",
    },
  ];

  const totalPages = 10;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-1">My Wallet</h2>
        <p className="text-sm text-gray-500 italic">Tip: Use your wallet to pay artisans fast</p>
      </div>

      {/* Available Balance Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8 max-w-xs">
        <p className="text-sm text-gray-600 mb-3">Available Balance</p>
        <h3 className="text-4xl font-bold text-gray-900 mb-4">₦0.00</h3>
        <button className="w-full px-6 py-2.5 bg-[#005823] text-white font-medium rounded-lg hover:bg-[#004019] transition-colors">
          Fund wallet
        </button>
      </div>

      {/* Recent Transaction Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent transaction</h3>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
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
            <option>Successful</option>
            <option>Failed</option>
            <option>Pending</option>
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
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-900">{transaction.description}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{transaction.type}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{transaction.amount}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{transaction.date}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                          transaction.status === "Successful"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
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
              {[1, 2, 3, "...", 8, 9, 10].map((page, index) => (
                <button
                  key={index}
                  onClick={() => typeof page === "number" && setCurrentPage(page)}
                  disabled={page === "..."}
                  className={`w-8 h-8 flex items-center justify-center text-sm rounded-lg transition-colors ${
                    currentPage === page
                      ? "bg-[#005823] text-white"
                      : page === "..."
                      ? "text-gray-400 cursor-default"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
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
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Manage Cards</h3>
        
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
              <div className="text-lg font-mono tracking-wider">5119 1198 5634 8532</div>
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
            <div className="absolute top-4 right-4 text-2xl font-bold text-blue-600">VISA</div>

            <div>
              <div className="text-xs text-gray-600 mb-1">Card Number</div>
              <div className="text-lg font-mono tracking-wider">5234 1198 5634 1234</div>
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
    </div>
  );
}