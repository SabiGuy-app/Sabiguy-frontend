import React, { useState } from "react";
import {
  ArrowLeft,
  Phone,
  MessageCircle,
  User,
  Clock,
  Star,
  MapPin,
  Navigation,
  X,
  CheckCircle,
} from "lucide-react";
import bookingCar from "/bookings.png";
import Navbar from "../../../../components/dashboard/Navbar";
import { FiChevronLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function BookingSummary2() {
  const [selectedPayment, setSelectedPayment] = useState("wallet");
  const [notes, setNotes] = useState("");
  const [walletBalance, setWalletBalance] = useState(60000); // Wallet balance
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  const navigate = useNavigate();
  const serviceCost = 10000;
  const serviceChargeRate = 0.02;
  const serviceCharge = serviceCost * serviceChargeRate;
  const totalAmount = serviceCost + serviceCharge;

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Handle payment
  const handleConfirmAndPay = async () => {
    setErrorMessage("");
    setIsProcessing(true);

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (selectedPayment === "wallet") {
      // Check if wallet has sufficient balance
      if (walletBalance < totalAmount) {
        setErrorMessage(
          `Insufficient wallet balance. You need ${formatCurrency(totalAmount - walletBalance)} more to complete this transaction.`,
        );
        setIsProcessing(false);
        return;
      }

      // Deduct from wallet
      setWalletBalance((prev) => prev - totalAmount);
      setShowSuccessModal(true);
      setIsProcessing(false);
    } else if (selectedPayment === "online") {
      // Handle online payment (integrate payment gateway)
      // For now, just show success
      setShowSuccessModal(true);
      setIsProcessing(false);
    }
  };

  // Success Modal Component
  const SuccessModal = () => (
    <div className="fixed inset-0 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 relative animate-fadeIn">
        <button
          onClick={() => setShowSuccessModal(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Payment Successful!
          </h2>

          <p className="text-gray-600 mb-6">
            Your booking has been confirmed. The rider will proceed shortly.
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Amount Paid:</span>
              <span className="font-bold text-green-600 text-lg">
                {formatCurrency(totalAmount)}
              </span>
            </div>
            {selectedPayment === "wallet" && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">New Wallet Balance:</span>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(walletBalance)}
                </span>
              </div>
            )}
          </div>

          <button
            onClick={() => {
              setIsNavigating(true);
              setTimeout(() => {
                navigate("/bookings/trackrider");
              }, 1500);
            }}
            disabled={isNavigating}
            className="w-full py-3 px-6 bg-[#005823] text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-75 flex items-center justify-center gap-2"
          >
            {isNavigating ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Loading...</span>
              </>
            ) : (
              "Track Provider"
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="bg-[#f7f7f7]">
        <div className="max-w-3xl mx-20 p-4 sm:p-6 bg-white">
          <div className="flex items-center gap-3 mb-6">
            <button className="text-gray-600 hover:text-gray-900">
              <FiChevronLeft size={24} />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">
              Booking summary
            </h1>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <svg
                className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="flex-1">
                <h4 className="font-semibold text-red-800 mb-1">
                  Payment Failed
                </h4>
                <p className="text-sm text-red-700">{errorMessage}</p>
              </div>
              <button
                onClick={() => setErrorMessage("")}
                className="text-red-600 hover:text-red-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Driver Info */}
          <div className="flex items-start gap-4 mb-6">
            <div className="relative">
              <img
                src={bookingCar}
                alt="Marcus Johnson"
                className="w-16 h-16 rounded-full object-cover"
              />
            </div>

            <div className="flex-grow">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-lg font-semibold text-gray-900">
                  Marcus Johnson
                </h2>
                <span className="flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-600 text-xs font-medium rounded">
                  ✓ Verified
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-1">
                Toyota Corolla · KSF257NG
              </p>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                <span className="font-medium text-gray-900">4.9</span>
                <span className="text-gray-500">(25 reviews)</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>2.7 miles away</span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-6">
              <div className="flex flex-col justify-center items-center">
                <div className="flex items-center justify-center w-10 h-10 rounded-full">
                  <User className="w-5 h-5" />
                </div>
                <div className="text-lg font-semibold text-gray-900">25</div>
                <div className="text-xs text-gray-500">Jobs Done</div>
              </div>
              <div className="flex flex-col justify-center items-center">
                <div className="flex items-center justify-center w-10 h-10">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="text-lg font-semibold text-gray-900">
                  {"< 3 Mins"}
                </div>
                <div className="text-xs text-gray-500">Response Time</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-10 h-10">
                  <Star className="w-5 h-5" />
                </div>
                <div className="text-lg font-semibold text-gray-900">4.9</div>
                <div className="text-xs text-gray-500">Rating</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mb-6">
            <button className="flex-1 flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Phone className="w-4 h-4 text-gray-600" />
              <span className="font-medium text-gray-700">Call</span>
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <MessageCircle className="w-4 h-4 text-gray-600" />
              <span className="font-medium text-gray-700">Message</span>
            </button>
            <button className="text-red-500 font-medium px-4 hover:text-red-600 transition-colors">
              Cancel Request
            </button>
          </div>

          {/* Vehicle Image */}
          <img
            src={bookingCar}
            alt="Vehicle"
            className="w-full h-auto object-contain"
          />

          {/* Job Summary */}
          <div className="my-6">
            <h3 className="text-[24px] font-bold text-[#231F20] mb-4">
              Job Summary
            </h3>

            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-[#E6EFE9] rounded-full flex items-center justify-center">
                  <div className="w-5 h-5 bg-[#005823] rounded-full"></div>
                </div>
                <div>
                  <div className="font-semibold text-[16px] text-[#231F20]">
                    Pickup Location
                  </div>
                  <div className="text-[16px] text-[#231F20BF]">
                    24 Palm Avenue, Lagos
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-10 h-10 bg-[#E6EFE9] rounded-full flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-[#005823]" />
                </div>
                <div>
                  <div className="font-semibold text-[16px] text-[#231F20]">
                    Dropoff Location
                  </div>
                  <div className="text-[16px] text-[#231F20BF]">
                    24 Palm Avenue, Lagos
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-10 h-10 bg-[#E6EFE9] rounded-full flex items-center justify-center">
                  <Navigation className="w-5 h-5 text-green-600 mt-0.5" />
                </div>
                <div>
                  <div className="font-semibold text-[16px] text-[#231F20]">
                    Estimated Distance
                  </div>
                  <div className="text-[16px] text-[#231F20BF]">
                    10 Kilometre
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Cost */}
          <div className="mb-6 border-t border-b border-[#231F201A] py-10">
            <h3 className="text-[20px] font-semibold text-gray-900 mb-4">
              Cost
            </h3>

            <div className="space-y-2">
              <div className="flex justify-between text-[16px] font-semibold text-[#231F20BF]">
                <span>Service Cost</span>
                <span>{formatCurrency(serviceCost)}</span>
              </div>
              <div className="flex justify-between text-[16px] font-semibold text-[#231F20BF]">
                <span>Service Charge</span>
                <span>{formatCurrency(serviceCharge)}</span>
              </div>
              <div className="pt-2 mt-2 text-[16px]">
                <div className="flex justify-between">
                  <span className="font-semibold text-[#231F20BF]">
                    Total Amount
                  </span>
                  <span className="font-semibold text-[#005823]">
                    {formatCurrency(totalAmount)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="mb-6">
            <h3 className="text-[20px] font-semibold text-[#231F20] mb-4">
              Payment Method
            </h3>

            <div className="space-y-3">
              <label
                className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedPayment === "wallet"
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="wallet"
                  checked={selectedPayment === "wallet"}
                  onChange={(e) => setSelectedPayment(e.target.value)}
                  className="w-5 h-5 text-green-600"
                />
                <div className="flex items-center gap-3 flex-grow">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Wallet</div>
                    <div className="text-sm text-gray-500">
                      Balance: {formatCurrency(walletBalance)}
                    </div>
                  </div>
                </div>
              </label>

              <label
                className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedPayment === "online"
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="online"
                  checked={selectedPayment === "online"}
                  onChange={(e) => setSelectedPayment(e.target.value)}
                  className="w-5 h-5 text-green-600"
                />
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="font-medium text-gray-900">Pay Online</div>
                </div>
              </label>
            </div>

            <button className="w-full mt-3 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium bg-[#fbfbfb] hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
              <span className="text-xl">+</span>
              <span>Add Payment Method</span>
            </button>
          </div>

          {/* Additional Notes */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Additional notes (optional)
            </h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add extra instructions for the service provider.."
              className="w-full p-4 border-2 border-gray-200 bg-[#fbfbfb] rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              rows="4"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pb-6">
            <button className="flex-1 py-4 px-6 bg-[#fbfbfb] border border-gray-300 rounded-[4px] text-gray-700 font-semibold hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button
              onClick={handleConfirmAndPay}
              disabled={isProcessing}
              className="flex-1 py-4 px-6 bg-[#005823CC] text-white rounded-[4px] font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing
                ? "Processing..."
                : `Confirm & Pay ${formatCurrency(totalAmount)}`}
            </button>
          </div>
          <p className="text-center text-[#231F2080]">
            Rider will proceed once payment is confirmed
          </p>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && <SuccessModal />}
    </>
  );
}
