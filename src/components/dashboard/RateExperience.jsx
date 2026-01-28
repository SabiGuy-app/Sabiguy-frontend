import { useState } from "react";
import { FiX, FiCreditCard } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import Modal from "../Modal";
import ServiceCompleted from "./ServiceCompleted";

export default function RateExperienceModal ({ isOpen, onClose, providerName = "Phil Crook" }) {
  const [rating, setRating] = useState(4);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState("");
  const [tip, setTip] = useState(null);
  const [customTip, setCustomTip] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("wallet");
  const [showCompleted, setShowCompleted] = useState(false);


   const handleSubmit = async () => {
    console.log({ rating, review, tip: tip === "custom" ? customTip : tip, paymentMethod });
    // TODO: API call to submit review
    onClose();
    setShowCompleted(true)
  };

  return (
    <>
    <Modal 
    isOpen={isOpen}
    onClose={onClose}
    title={`Rate your experience with ${providerName}`}
    >
        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3, 4, 5].map((star) => {
            <button
            key={star}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            className="transition-transform hover:scale-110"
            >
              <FaStar
              size={40}
               className={`${
                star <= (hoverRating || rating)
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300"
              }`}
            />
            </button>
          })}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tell us how it went <span className="text-gray-400">(optional)</span>
          </label>
          <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
           placeholder="Share your experience"
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BC53F] focus:border-transparent resize-none bg-gray-50"
        />
        </div>
        <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Add a Tip <span className="text-gray-400">(optional)</span>
        </label>
        <div className="grid grid-cols-4 gap-2 mb-3">
          {["500", "1000", "2000"].map((amount) => (
            <button
              key={amount}
              onClick={() => {
                setTip(amount);
                setCustomTip("");
              }}
              className={`px-4 py-2 text-sm font-medium rounded-lg border-2 transition-colors ${
                tip === amount
                  ? "border-[#005823] bg-green-50 text-[#005823]"
                  : "border-gray-300 text-gray-700 hover:border-gray-400"
              }`}
            >
              ₦{amount}
            </button>
          ))}
          <button
            onClick={() => setTip("custom")}
            className={`px-4 py-2 text-sm font-medium rounded-lg border-2 transition-colors ${
              tip === "custom"
                ? "border-[#005823] bg-green-50 text-[#005823]"
                : "border-gray-300 text-gray-700 hover:border-gray-400"
            }`}
          >
            Custom
          </button>
        </div>
         {tip === "custom" && (
          <input
            type="number"
            value={customTip}
            onChange={(e) => setCustomTip(e.target.value)}
            placeholder="Enter amount"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BC53F] mb-3"
          />
        )}
         {tip && (
          <div className="flex gap-2">
            <button
              onClick={() => setPaymentMethod("wallet")}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg border-2 transition-colors flex items-center justify-center gap-2 ${
                paymentMethod === "wallet"
                  ? "border-[#005823] bg-[#005823] text-white"
                  : "border-gray-300 text-gray-700 hover:border-gray-400"
              }`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
              </svg>
              Wallet
            </button>
            <button
              onClick={() => setPaymentMethod("card")}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg border-2 transition-colors flex items-center justify-center gap-2 ${
                paymentMethod === "card"
                  ? "border-[#005823] bg-white text-[#005823]"
                  : "border-gray-300 text-gray-700 hover:border-gray-400"
              }`}
            >
              <FiCreditCard size={16} />
              Card
            </button>
          </div>
        )}
      </div>
       <button
        onClick={handleSubmit}
        disabled={rating === 0}
        className="w-full px-6 py-3 bg-[#005823] text-white font-medium rounded-lg hover:bg-[#004019] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors mb-3"
      >
        Submit Review
      </button>
      <button
        onClick={onClose}
        className="w-full text-sm text-gray-600 hover:text-gray-900 py-2"
      >
        Skip for now
      </button>

     
    </Modal>
     <ServiceCompleted
      isOpen={showCompleted}
      onClose={() => setShowCompleted(false)}/>
      </>
  )
} 