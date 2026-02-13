import { useState } from "react";
import {
  FiChevronLeft,
  FiStar,
  FiCalendar,
  FiMapPin,
  FiPlus,
} from "react-icons/fi";
import { Wallet, CreditCard } from "lucide-react";
import Success from "../../pages/Dashboard/sections/Bookings/PaymentSucessfull";

export default function BookingSummaryScreen({
  bookingData,
  onBack,
  onConfirm,
}) {
  const [paymentMethod, setPaymentMethod] = useState("wallet");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [openSuccessModal, setOpenSuccessModal] = useState(false);

  const handleConfirm = () => {
    console.log({
      ...bookingData,
      paymentMethod,
      additionalNotes,
    });
    // onConfirm();
    setOpenSuccessModal(true);
  };
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-5">
      <div className="bg-gray-50 rounded-2xl shadow-lg w-full max-w-3xl p-20">
        <div className="flex items-center gap-3 mb-6 ">
          <button
            onClick={onBack}
            className="text-gray-600 hover:text-gray-900"
          >
            <FiChevronLeft size={24} />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">
            Booking summary
          </h1>
        </div>
        <h1 className="border-b border-gray-300 mb-5"></h1>
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Service Overview
          </h2>
          <div className="flex items-center gap-4 p-4 rounded-lg">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
              {bookingData?.provider?.avatar ? (
                <img
                  src={bookingData.provider.avatar}
                  alt={bookingData.provider.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">
                {bookingData?.service}
              </h3>
              <h3 className=" text-gray-300 text-sm mb-1">
                {bookingData?.service}
              </h3>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-600">
                  {bookingData?.provider?.name}
                </span>
                <div className="flex items-center gap-1">
                  <FiStar
                    className="text-yellow-400 fill-yellow-400"
                    size={12}
                  />

                  <span className="text-sm text-gray-400">
                    {bookingData?.rating}
                  </span>
                </div>
              </div>
            </div>
            <span className="px-2 py-1 bg-[#0058231A] text-xs font-medium rounded-full border border-green-200">
              {bookingData?.status || "Pending Confirmation"}{" "}
            </span>
          </div>
        </div>
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">
            Schedule Details
          </h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <FiCalendar className="text-gray-400 mt-0.5" size={18} />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Start Date & Time
                </p>
                <p className="text-sm text-gray-600">
                  {bookingData?.startDate}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FiCalendar className="text-gray-400 mt-0.5" size={18} />
              <div>
                <p className="text-sm font-medium text-gray-900">End Date</p>
                <p className="text-sm text-gray-600">{bookingData?.endDate}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FiMapPin className="text-gray-400 mt-0.5" size={18} />
              <div>
                <p className="text-sm font-medium text-gray-900">Location</p>
                <p className="text-sm text-gray-600">{bookingData?.location}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Cost</h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Service Cost</span>
              <span className="font-semibold text-gray-900">
                ₦{bookingData?.serviceCost?.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Service Charge</span>
              <span className="font-semibold text-gray-900">
                ₦{bookingData?.serviceCharge?.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
              <span className="text-sm font-semibold text-gray-900">
                Total Amount
              </span>
              <span className="text-lg font-bold text-green-600">
                ₦{bookingData?.totalAmount?.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">
            Payment Method
          </h2>
          <div className="space-y-3">
            <label className="flex items-center gap-3 p-2 border-2 rounded-lg cursor-pointer transition-all hover:bg-gray-50">
              <input
                type="radio"
                name="payment"
                value="wallet"
                checked={paymentMethod === "wallet"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-4 h-4 accent-[#005823] focus:ring-[#8BC53F]"
              />
              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Wallet size={20} />
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">Wallet</p>
                  <p className="text-xs text-gray-500">
                    ₦{bookingData?.walletBalance?.toLocaleString()}
                  </p>
                </div>
              </div>
            </label>
            <label className="flex items-center gap-3 p-2 border-2 rounded-lg cursor-pointer transition-all hover:bg-gray-50">
              <input
                type="radio"
                name="payment"
                value="card"
                checked={paymentMethod === "card"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-4 h-4 accent-[#005823] focus:ring-[#8BC53F]"
              />
              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <CreditCard size={20} />
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">
                    Card Payment
                  </p>
                  <p className="text-xs text-gray-500">Visa, Mastercard</p>
                </div>
              </div>
            </label>
            <button className="w-full mt-5 flex items-center justify-center gap-2 py-2 text-xs bg-gray-50 font-medium text-black hover:bg-[#005823] hover:text-white rounded-lg transition-colors">
              <FiPlus size={18} />
              Add Payment Method
            </button>
          </div>
        </div>
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Additional notes (optional)
          </label>
          <textarea
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            placeholder="Add extra instructions for the service provider"
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BC53F] focus:border-transparent resize-none bg-white"
          />
        </div>
        <div className="flex gap-3">
          <button
            onClick={onBack}
            className="flex-1 px-5 py-2 bg-white border-2 border-gray-300 text-gray-900 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-5 py-2 bg-[#005823CC] text-white font-medium rounded-lg hover:bg-[#005823] transition-colors"
          >
            Confirm & Pay ₦{bookingData?.totalAmount?.toLocaleString()}
          </button>
        </div>
      </div>
      <Success
        isOpen={openSuccessModal}
        onClose={() => setOpenSuccessModal(false)}
      />
    </div>
  );
}
