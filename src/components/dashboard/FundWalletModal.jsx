import { ArrowBigLeft, X } from "lucide-react";
import React, { useState } from "react";
import { fundWallet } from "../../api/provider";
import { toast } from "react-toastify";

const FundWalletModal = ({ isOpen, onClose }) => {
  const [currentModal, setCurrentModal] = useState(1);
  const [fundingMethod, setFundingMethod] = useState("online");
  const [amount, setAmount] = useState("");
  const [selectedCard, setSelectedCard] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    setCurrentModal(1);
    setSelectedCard(null);
    setAmount("");
    onClose();
  };

  const handleBack = () => {
    setCurrentModal(1);
  };

  const handleFundWallet = async () => {
    if (!amount || amount.trim() === "") {
      toast.error("Please enter an amount");
      return;
    }

    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue < 1000) {
      toast.error("Minimum funding amount is ₦1,000");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fundWallet(amountValue);

      const authUrl = response.data?.authorizationUrl || response.authorizationUrl;

      if (authUrl) {
        toast.success("Redirecting to payment gateway...");
        // Redirect to Paystack
        window.location.href = authUrl;
      } else {
        toast.error("Payment initialization failed. Please try again.");
      }
    } catch (error) {
      console.error("Fund wallet error:", error);
      const errorMessage = error.response?.data?.message || "Failed to initiate payment. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  //   Modal1
  const Modal1 = () => (
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
      <div className="flex justify-between items-center border-b mb-5 border-[#231F2040] py-3 px-6">
        <h2 className="text-lg font-semibold text-gray-800">Fund Wallet</h2>
        <button
          onClick={handleClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>
      </div>

      <div className="py-3 px-6 space-y-[20px]">
        <div className="space-y-3 mb-8">
          <label className="flex items-center space-x-3 cursor-pointer">
            <div className="relative mt-1">
              <input
                type="radio"
                name="funding"
                value="online"
                checked={fundingMethod === "online"}
                onChange={(e) => setFundingMethod(e.target.value)}
                className="w-5 h-5 border-gray-300"
              />
            </div>
            <span className="text-[#231F20] text-[16px]">
              Fund Wallet (Paystack)
            </span>
          </label>

          {/* <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              name="funding"
              value="saved"
              checked={fundingMethod === "saved"}
              onChange={(e) => setFundingMethod(e.target.value)}
              className="w-5 h-5 text-green-600 border-gray-300 focus:ring-green-500"
            />
            <span className="text-[#231F20] text-[16px]">
              Fund Wallet (From saved card)
            </span>
          </label> */}
        </div>

        <button
          onClick={() => setCurrentModal(fundingMethod === "saved" ? 3 : 2)}
          className="w-full bg-[#005823CC] hover:bg-green-700 text-white font-medium mb-5 py-3 rounded-lg transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );

  // Modal 2 - Enter amount for online payment
  const Modal2 = () => (
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
      <div className="flex justify-between items-center border-b mb-5 border-[#231F2040] py-3 px-6">
        <button onClick={handleBack}>
          <ArrowBigLeft />
        </button>
        <h2 className="text-lg font-semibold text-gray-800">Fund Wallet</h2>
        <button
          onClick={handleClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>
      </div>

      <div className="py-3 px-6 space-y-[20px]">
        <div className="mb-6">
          <label className="block text-[16px] mb-2">Top-up Amount</label>
          <div className="flex border border-gray-300 focus:outline-none rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
            <span className=" w-[10%] flex items-center justify-center rounded-l-md text-gray-500 bg-[#D9D9D9] font-medium">
              ₦
            </span>
            <input
              type="number"
              placeholder="Enter Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full py-3 focus:outline-none px-4 "
              disabled={isLoading}
              autoFocus
            />
          </div>
        </div>

        <button
          onClick={handleFundWallet}
          disabled={isLoading}
          className="w-full bg-[#005823CC] hover:bg-green-700 text-white font-medium mb-5 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Processing..." : "Top-up"}
        </button>
      </div>
    </div>
  );

  // Modal 3 - Enter amount and select saved card
  const Modal3 = () => (
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
      <div className="flex justify-between items-center border-b mb-5 border-[#231F2040] py-3 px-6">
        <button onClick={handleBack}>
          <ArrowBigLeft />
        </button>
        <h2 className="text-lg font-semibold text-gray-800">Fund Wallet</h2>
        <button
          onClick={handleClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>
      </div>

      <div className="py-3 px-6 space-y-[20px]">
        <div className="pb-6 border-b border-[#231F2040]">
          <label className="block text-[16px] text-gray-600 mb-2">
            Top-up Amount
          </label>
          <div className="flex border border-gray-300 focus:outline-none rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
            <span className=" w-[10%] flex items-center justify-center rounded-l-md text-gray-500 bg-[#D9D9D9] font-medium">
              ₦
            </span>
            <input
              type="text"
              placeholder="Enter Amount"
              className="w-full py-3 focus:outline-none px-4 "
            />
          </div>
          <p className="text-xs text-[#231F2080]/90 mt-2">
            Amount will be deducted from your saved card
          </p>
        </div>

        <div className="space-y-3 mb-3">
          <div
            onClick={() => setSelectedCard("mastercard")}
            className={`flex items-center justify-between rounded-lg cursor-pointer transition-all ${selectedCard === "mastercard"
              ? ""
              : "border-gray-200 hover:border-gray-300"
              }`}
          >
            <div className="flex items-center space-x-3">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-red-500 rounded-full opacity-80"></div>
                <div className="w-6 h-6 bg-orange-400 rounded-full -ml-3 opacity-80"></div>
              </div>
              <span className="text-gray-700 font-medium">**** 8332</span>
            </div>
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedCard === "mastercard"
                ? "border-green-600"
                : "border-gray-300"
                }`}
            >
              {selectedCard === "mastercard" && (
                <div className="w-3 h-3 bg-green-600 rounded-full"></div>
              )}
            </div>
          </div>

          <div
            onClick={() => setSelectedCard("visa")}
            className={`flex items-center justify-between cursor-pointer transition-all ${selectedCard === "visa"
              ? ""
              : "border-gray-200 hover:border-gray-300"
              }`}
          >
            <div className="flex items-center space-x-3">
              <div className="text-blue-600 font-bold text-xl italic">VISA</div>
              <span className="text-gray-700 font-medium">**** 1234</span>
            </div>
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedCard === "visa" ? "border-green-600" : "border-gray-300"
                }`}
            >
              {selectedCard === "visa" && (
                <div className="w-3 h-3 bg-green-600 rounded-full"></div>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={handleClose}
          className="w-full bg-[#005823CC] hover:bg-green-700 text-white font-medium mb-5 py-3 rounded-lg transition-colors"
        >
          Top-up
        </button>
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-md">
        {currentModal === 1 && <Modal1 />}
        {currentModal === 2 && <Modal2 />}
        {currentModal === 3 && <Modal3 />}
      </div>
    </div>
  );
};

export default FundWalletModal;
