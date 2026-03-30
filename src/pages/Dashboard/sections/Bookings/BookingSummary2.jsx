import React, { useState, useEffect } from "react";
import {
  Phone,
  MessageCircle,
  User,
  Clock,
  Star,
  MapPin,
  Navigation,
  X,
  CheckCircle,
  Award,
  Shield,
  BadgeCheck,
} from "lucide-react";
import Navbar from "../../../../components/dashboard/Navbar";
import { toast } from "react-hot-toast";
import { FiChevronLeft } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import useBookingStore from "../../../../stores/booking.store";
import { initializePayment, payWithWallet } from "../../../../api/payment";
import { getBookingsDetails, cancelBooking } from "../../../../api/bookings";
import { getWalletBalance } from "../../../../api/provider";
import { useSearchParams } from "react-router-dom";
import CancelModal from "../../../../components/CancelModal";

export default function BookingSummary2() {
  const [selectedPayment, setSelectedPayment] = useState("wallet");
  const [notes, setNotes] = useState("");
  const [walletBalance, setWalletBalance] = useState(0);
  const [isLoadingBalance, setIsLoadingBalance] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryBookingId = searchParams.get("bookingId");
  const paymentSuccess = searchParams.get("payment_success");
  const reference = searchParams.get("reference");

  // Zustand store
  const booking = useBookingStore((state) => state.booking);
  const setBooking = useBookingStore((state) => state.setBooking);
  const selectedProviderId = useBookingStore(
    (state) => state.selectedProviderId,
  );

  const bookingDetails = booking?.data?.booking || {};
  const providerDetails = bookingDetails?.providerId || {};

  const pickupAddress = bookingDetails?.pickupLocation?.address || "—";
  const dropoffAddress = bookingDetails?.dropoffLocation?.address || "—";
  const estimatedDistance = bookingDetails?.distance
    ? `${bookingDetails.distance.value} ${bookingDetails.distance.unit}`
    : "—";
  const serviceCost = bookingDetails?.calculatedPrice || 0;
  const serviceChargeRate = 0.02;
  const serviceCharge = serviceCost * serviceChargeRate;
  const totalAmount = serviceCost + serviceCharge;

  // Fetch wallet balance on mount
  const fetchBalance = async () => {
    try {
      setIsLoadingBalance(true);
      const data = await getWalletBalance({ bustCache: true });
      const available =
        data?.data?.walletBalance?.available ??
        data?.data?.available ??
        data?.available ??
        0;
      setWalletBalance(available);
    } catch (error) {
      console.error("Failed to fetch wallet balance:", error);
    } finally {
      setIsLoadingBalance(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  useEffect(() => {
    const bookingId = queryBookingId || bookingDetails?._id;

    if (!bookingId) return;

    const fetchBooking = async () => {
      try {
        const data = await getBookingsDetails(bookingId);
        setBooking(data);

        if (paymentSuccess === "true") {
          setIsPaid(true);
          if (reference) setSelectedPayment("online");
          setShowSuccessModal(true);
        }
      } catch (error) {
        console.error("Failed to fetch booking details:", error);
        if (paymentSuccess === "true") {
          toast.error("Payment successful but failed to load booking details.");
        }
      }
    };

    fetchBooking();
  }, [queryBookingId, paymentSuccess, setBooking]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleCancel = async (reason) => {
    setCancelLoading(true);
    try {
      await cancelBooking(bookingDetails._id, reason);
      setCancelModalOpen(false);
      toast.success("Booking cancelled successfully.");
      navigate("/bookings");
    } catch (err) {
      console.error("Failed to cancel booking:", err);
      toast.error(err.response?.data?.message || "Failed to cancel booking.");
    } finally {
      setCancelLoading(false);
    }
  };

  const handleConfirmAndPay = async () => {
    setErrorMessage("");
    setIsProcessing(true);

    try {
      const bookingId = bookingDetails?._id;

      if (!bookingId) {
        toast.error("Booking ID not found. Please refresh.");
        return;
      }

      if (selectedPayment === "wallet") {
        if (walletBalance < totalAmount) {
          toast.error("Insufficient wallet balance. Please fund your wallet.");
          setIsProcessing(false);
          return;
        }

        await payWithWallet(bookingId);
        await fetchBalance();
        setIsPaid(true);
        setShowSuccessModal(true);
      } else if (selectedPayment === "online") {
        const response = await initializePayment(bookingId);
        const authUrl =
          response?.data?.authorizationUrl || response?.authorizationUrl;

        if (authUrl) {
          localStorage.setItem("pendingBookingPaymentId", bookingId);
          toast.success("Redirecting to payment gateway...");
          window.location.href = authUrl;
        } else {
          console.error("No authorization URL found in response", response);
          toast.error("Failed to initialize payment. Please try again.");
          setIsProcessing(false);
        }
      } else {
        toast.error("Please select a valid payment method.");
        setIsProcessing(false);
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(error.response?.data?.message || "Payment processing failed");
      setIsProcessing(false);
    }
  };

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
            {selectedPayment === "wallet" ? (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">New Wallet Balance:</span>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(walletBalance)}
                </span>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Payment Status:</span>
                <span className="font-semibold text-[#005823]">
                  Held in Escrow
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
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
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

      <CancelModal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        onConfirm={handleCancel}
        loading={cancelLoading}
      />

      <div className=" w-[90%] m-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6 mt-8">
          <div className="flex items-center gap-3">
            <Link to={"/bookings"} className="flex items-center gap-3">
              <button className="text-gray-600 hover:text-gray-900">
                <FiChevronLeft size={24} />
              </button>
              <h1 className="text-xl font-semibold text-gray-900">
                Booking summary
              </h1>
            </Link>
          </div>
          {bookingDetails?._id && (
            <span className="text-[12px] font-mono text-[#005823] bg-[#0058231A] px-2 py-1 rounded-md border border-[#0058234D] w-fit">
              Booking #{bookingDetails._id.slice(-6).toUpperCase()}
            </span>
          )}
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

        <div className="md:grid md:grid-cols-2 space-y-4 gap-8">
          <div className="space-y-8">
            <div className="shadow-sm p-6 rounded-[16px] space-y-6">
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                <div className="relative">
                  <img
                    src={providerDetails?.profilePicture}
                    alt={providerDetails?.fullName || "Provider"}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                </div>
                <div className="flex-grow">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-semibold text-gray-900 capitalize">
                        {providerDetails?.fullName || "Provider"}
                      </h2>
                      <span className="text-[#8BC53F]">
                        <BadgeCheck className="w-[20px] h-[20px]" />
                      </span>
                    </div>
                    {providerDetails?._id && (
                      <span className="text-[10px] font-medium text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200 inline-block">
                        ID: {providerDetails._id.slice(-6).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-1 capitalize">
                    {providerDetails?.services?.[0]?.title?.replace(
                      /_/g,
                      " ",
                    ) ||
                      bookingDetails?.subCategory?.replace(/_/g, " ") ||
                      "—"}
                  </p>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex items-center gap-1 text-[14px] text-gray-600">
                      <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium text-gray-900">
                        {providerDetails?.rating?.average > 0
                          ? providerDetails.rating.average.toFixed(1)
                          : "New"}
                      </span>
                      <span className="text-gray-500">
                        ({providerDetails?.rating?.count ?? 0} reviews)
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[14px] text-[#231F20BF]">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>
                        {providerDetails?.distance?.toFixed(1) ?? "—"} miles away
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex flex-col sm:flex-row gap-6 sm:gap-10">
                  <div className="flex flex-col justify-center items-center">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full">
                      <Award className="w-[24px] h-[24px] text-[#005823]" />
                    </div>
                    <div className="text-[20px] font-semibold text-[#231F20]">
                      {providerDetails?.completedJobs ?? 0}
                    </div>
                    <div className="text-[15px] text-[#231F2080]">
                      Jobs Done
                    </div>
                  </div>
                  <div className="flex flex-col justify-center items-center">
                    <div className="flex items-center justify-center w-10 h-10">
                      <Clock className="w-[24px] h-[24px] text-[#231F20BF]" />
                    </div>
                    <div className="text-[20px] font-semibold text-[#231F20]">
                      {"< 3 Mins"}
                    </div>
                    <div className="text-[15px] text-[#231F2080]">
                      Response Time
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col md:flex-row gap-2 md:gap-5">
                <button className="w-full flex-1 flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Phone className="w-4 h-4 text-gray-600" />
                  <span className="font-medium text-gray-700">Call</span>
                </button>
                <button className="w-full flex-1 flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <MessageCircle className="w-4 h-4 text-gray-600" />
                  <span className="font-medium text-gray-700">Message</span>
                </button>
                {!isPaid && (
                  <button
                    onClick={() => setCancelModalOpen(true)}
                    className="text-red-500 font-medium px-4 hover:text-red-600 transition-colors"
                  >
                    Cancel Request
                  </button>
                )}
              </div>
            </div>

            {/* Vehicle Image */}
            <img
              src={providerDetails?.workVisuals?.[0]?.pictures?.[0]}
              className="w-full h-auto object-contain"
            />
          </div>

          <div className="space-y-4">
            <div className="bg-[#231F2005] border border-[#231F201A] px-6 py-4 rounded-[16px]">
              <div>
                <h3 className="text-[24px] font-bold text-[#231F20] mb-4">
                  Job Summary
                </h3>

                <div className="space-y-3">
                  {/* Pickup */}
                  <div className="flex gap-3">
                    <div className="w-10 h-10 bg-[#E6EFE9] rounded-full flex items-center justify-center flex-shrink-0">
                      <div className="w-5 h-5 bg-[#005823] rounded-full" />
                    </div>
                    <div>
                      <div className="font-semibold text-[16px] text-[#231F20]">
                        Pickup Location
                      </div>
                      <div className="text-[16px] text-[#231F20BF]">
                        {pickupAddress}
                      </div>
                    </div>
                  </div>

                  {/* Dropoff */}
                  <div className="flex gap-3">
                    <div className="w-10 h-10 bg-[#E6EFE9] rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-[#005823]" />
                    </div>
                    <div>
                      <div className="font-semibold text-[16px] text-[#231F20]">
                        Dropoff Location
                      </div>
                      <div className="text-[16px] text-[#231F20BF]">
                        {dropoffAddress}
                      </div>
                    </div>
                  </div>

                  {/* Distance */}
                  <div className="flex gap-3">
                    <div className="w-10 h-10 bg-[#E6EFE9] rounded-full flex items-center justify-center flex-shrink-0">
                      <Navigation className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-[16px] text-[#231F20]">
                        Estimated Distance
                      </div>
                      <div className="text-[16px] text-[#231F20BF]">
                        {estimatedDistance}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cost */}
              <div className="my-6 border-t border-b border-[#231F201A] py-10">
                <h3 className="text-[20px] font-semibold text-gray-900 mb-4">
                  Cost
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-[16px] font-semibold text-[#231F20BF]">
                    <span>Service Cost</span>
                    <span>{formatCurrency(serviceCost)}</span>
                  </div>
                  <div className="flex justify-between text-[16px] font-semibold text-[#231F20BF]">
                    <span>Service Charge (2%)</span>
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
                    className={`flex items-center gap-3 p-3 border rounded-[8px] transition-colors ${isPaid ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${selectedPayment === "wallet" ? "border-[#005823] bg-[#00582305]" : "border-[#231F2040] hover:bg-gray-50"}`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="wallet"
                      checked={selectedPayment === "wallet"}
                      onChange={(e) => setSelectedPayment(e.target.value)}
                      disabled={isPaid}
                      className="w-5 h-5 accent-[#005823]"
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
                        <div className="font-semibold text-[16px] text-[#231F20]">
                          Wallet
                        </div>
                        <div className="text-[12px] font-semibold text-[#231F20BF]">
                          Balance: {formatCurrency(walletBalance)}
                        </div>
                      </div>
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-3 p-3 border rounded-[8px] transition-colors ${isPaid ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${selectedPayment === "online" ? "border-[#005823] bg-[#00582305]" : "border-[#231F2040] hover:bg-gray-50"}`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="online"
                      checked={selectedPayment === "online"}
                      onChange={(e) => setSelectedPayment(e.target.value)}
                      disabled={isPaid}
                      className="w-5 h-5 accent-[#005823]"
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
                      <div className="font-medium text-[16px] text-[#231F20]">
                        Pay Online
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Additional Notes */}
              <div className="mb-6">
                <h3 className="text-[20px] font-semibold text-[#231F20] mb-3">
                  Pickup notes{" "}
                  <span className="text-[16px] text-[#231F20BF]">
                    (optional)
                  </span>
                </h3>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add extra instructions for the service provider.."
                  disabled={isPaid}
                  className={`w-full p-4 border-2 border-gray-200 bg-[#fbfbfb] rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${isPaid ? "opacity-50 cursor-not-allowed" : ""}`}
                  rows="4"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pb-6">
                <button
                  onClick={() => setCancelModalOpen(true)}
                  disabled={isPaid}
                  className={`flex-1 py-4 px-6 text-[16px] bg-[#fbfbfb] border border-gray-300 rounded-[4px] text-[#231F20] font-semibold transition-colors ${isPaid ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"}`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmAndPay}
                  disabled={isProcessing || isPaid}
                  className="flex-1 py-4 px-6 text-[16px] bg-[#005823CC] text-white rounded-[4px] font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPaid
                    ? "Paid ✓"
                    : isProcessing
                      ? "Processing..."
                      : `Confirm & Pay ${formatCurrency(totalAmount)}`}
                </button>
              </div>
            </div>
            <p className="text-center text-[#231F2080]">
              Rider will proceed once payment is confirmed
            </p>
          </div>
        </div>
      </div>
      {showSuccessModal && <SuccessModal />}
    </>
  );
}
