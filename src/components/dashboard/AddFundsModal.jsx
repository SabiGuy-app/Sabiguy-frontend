// import React, { useCallback, useEffect, useRef, useState } from "react";
// import { X } from "lucide-react";
// import { validateConfig } from "face-api.js";

// const AddFundsModal = ({ isOpen, onClose }) => {
//   const [currentModal, setCurrentModal] = useState(1);
//   const [fundingMethod, setFundingMethod] = useState("online");
//   const [amount, setAmount] = useState("");
//   const [selectedCard, setSelectedCard] = useState(null);

//   const inputRef = useRef(null);

//   // Reset modal state when closing
//   const handleClose = () => {
//     setCurrentModal(1);
//     setFundingMethod("online");
//     setAmount("");
//     setSelectedCard(null);
//     onClose();
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log(inputRef.current.value);
//     handleClose();
//   };

//   // Modal 1 - Select funding method
//   const Modal1 = () => (
//     <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
//       <div className="flex justify-between items-center border-b mb-5 border-[#231F2040] py-3 px-6">
//         <h2 className="text-lg font-semibold text-gray-800">Fund Wallet</h2>
//         <button
//           onClick={handleClose}
//           className="text-gray-400 hover:text-gray-600"
//         >
//           <X size={20} />
//         </button>
//       </div>

//       <div className="py-3 px-6 space-y-[20px]">
//         <div className="space-y-3 mb-8">
//           <label className="flex items-center space-x-3 cursor-pointer">
//             <div className="relative mt-1">
//               <input
//                 type="radio"
//                 name="funding"
//                 value="online"
//                 checked={fundingMethod === "online"}
//                 onChange={(e) => setFundingMethod(e.target.value)}
//                 className="w-5 h-5 border-gray-300"
//               />
//             </div>
//             <span className="text-[#231F20] text-[16px]">
//               Fund Wallet (Online)
//             </span>
//           </label>

//           <label className="flex items-center space-x-3 cursor-pointer">
//             <input
//               type="radio"
//               name="funding"
//               value="saved"
//               checked={fundingMethod === "saved"}
//               onChange={(e) => setFundingMethod(e.target.value)}
//               className="w-5 h-5 text-green-600 border-gray-300 focus:ring-green-500"
//             />
//             <span className="text-[#231F20] text-[16px]">
//               Fund Wallet (From saved card)
//             </span>
//           </label>
//         </div>

//         <button
//           onClick={() => setCurrentModal(fundingMethod === "saved" ? 3 : 2)}
//           className="w-full bg-[#005823CC] hover:bg-green-700 text-white font-medium mb-5 py-3 rounded-lg transition-colors"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );

//   // Modal 2 - Enter amount for online payment
//   const Modal2 = () => (
//     <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
//       <div className="flex justify-between items-center border-b mb-5 border-[#231F2040] py-3 px-6">
//         <h2 className="text-lg font-semibold text-gray-800">Fund Wallet</h2>
//         <button
//           onClick={handleClose}
//           className="text-gray-400 hover:text-gray-600"
//         >
//           <X size={20} />
//         </button>
//       </div>

//       <form onSubmit={handleSubmit} className="py-3 px-6 space-y-[20px]">
//         <div className="mb-6">
//           <label className="block text-sm text-gray-600 mb-2">
//             Top-up Amount
//           </label>
//           <div className="relative">
//             <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
//               ₦
//             </span>

//             <input
//               type="text"
//               placeholder="Enter Amount"
//               ref={inputRef}
//               autoComplete="off"
//               className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
//             />
//           </div>
//         </div>

//         <button
//           // onClick={handleClose}
//           className="w-full bg-[#005823CC] hover:bg-green-700 text-white font-medium mb-5 py-3 rounded-lg transition-colors"
//         >
//           Top-up
//         </button>
//       </form>
//     </div>
//   );

//   // Modal 3 - Enter amount and select saved card
//   const Modal3 = () => (
//     <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
//       <div className="flex justify-between items-center border-b mb-5 border-[#231F2040] py-3 px-6">
//         <h2 className="text-lg font-semibold text-gray-800">Fund Wallet</h2>
//         <button
//           onClick={handleClose}
//           className="text-gray-400 hover:text-gray-600"
//         >
//           <X size={20} />
//         </button>
//       </div>

//       <div className="py-3 px-6 space-y-[20px]">
//         <div className="mb-6">
//           <label className="block text-sm text-gray-600 mb-2">
//             Top-up Amount
//           </label>
//           <div className="relative">
//             <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
//               ₦
//             </span>
//             <input
//               type="text"
//               placeholder="Enter Amount"
//               value={amount}
//               // onChange={(e) => setAmount(e.target.value)}
//               onChange={handleSubmit()}
//               autoComplete="off"
//               className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
//             />
//           </div>
//           <p className="text-xs text-gray-400 mt-2">
//             Amount will be deducted from your saved card
//           </p>
//         </div>

//         <div className="space-y-3 mb-6">
//           <div
//             onClick={() => setSelectedCard("mastercard")}
//             className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${
//               selectedCard === "mastercard"
//                 ? "border-green-600 bg-green-50"
//                 : "border-gray-200 hover:border-gray-300"
//             }`}
//           >
//             <div className="flex items-center space-x-3">
//               <div className="flex items-center">
//                 <div className="w-6 h-6 bg-red-500 rounded-full opacity-80"></div>
//                 <div className="w-6 h-6 bg-orange-400 rounded-full -ml-3 opacity-80"></div>
//               </div>
//               <span className="text-gray-700 font-medium">**** 8332</span>
//             </div>
//             <div
//               className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
//                 selectedCard === "mastercard"
//                   ? "border-green-600"
//                   : "border-gray-300"
//               }`}
//             >
//               {selectedCard === "mastercard" && (
//                 <div className="w-3 h-3 bg-green-600 rounded-full"></div>
//               )}
//             </div>
//           </div>

//           <div
//             onClick={() => setSelectedCard("visa")}
//             className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${
//               selectedCard === "visa"
//                 ? "border-green-600 bg-green-50"
//                 : "border-gray-200 hover:border-gray-300"
//             }`}
//           >
//             <div className="flex items-center space-x-3">
//               <div className="text-blue-600 font-bold text-xl italic">VISA</div>
//               <span className="text-gray-700 font-medium">**** 1234</span>
//             </div>
//             <div
//               className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
//                 selectedCard === "visa" ? "border-green-600" : "border-gray-300"
//               }`}
//             >
//               {selectedCard === "visa" && (
//                 <div className="w-3 h-3 bg-green-600 rounded-full"></div>
//               )}
//             </div>
//           </div>
//         </div>

//         <button
//           onClick={handleClose}
//           className="w-full bg-[#005823CC] hover:bg-green-700 text-white font-medium mb-5 py-3 rounded-lg transition-colors"
//         >
//           Top-up
//         </button>
//       </div>
//     </div>
//   );

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//       <div className="w-full max-w-md">
//         {currentModal === 1 && <Modal1 />}
//         {currentModal === 2 && <Modal2 />}
//         {currentModal === 3 && <Modal3 />}
//       </div>
//     </div>
//   );
// };

// export default AddFundsModal;
