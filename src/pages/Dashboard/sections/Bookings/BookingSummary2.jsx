import React, { useState, useEffect } from "react";
import {
  Phone,
  MessageCircle,
  Clock,
  Star,
  MapPin,
  Navigation,
  X,
  CheckCircle,
  Award,
  BadgeCheck,
} from "lucide-react";
import DashboardLayout from "../../../../components/layouts/DashboardLayout";
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

  const booking = useBookingStore((state) => state.booking);
  const setBooking = useBookingStore((state) => state.setBooking);

  const bookingDetails = booking?.data?.booking || {};
  const providerDetails = bookingDetails?.providerId || {};

  const pickupAddress = bookingDetails?.pickupLocation?.address || "—";
  const dropoffAddress = bookingDetails?.dropoffLocation?.address || "—";
  const estimatedDistance = bookingDetails?.distance
    ? `${bookingDetails.distance.value} ${bookingDetails.distance.unit}`
    : "—";
  const acceptedProviderId = bookingDetails?.providerId?._id || providerDetails?._id;
  const targetProvider = booking?.data?.providers?.find(p => (p.id || p._id || p.userId) === acceptedProviderId) || providerDetails;
  const pricing = targetProvider?.pricing || bookingDetails?.pricing;


  const baseFare = pricing?.breakdown?.baseFare ?? bookingDetails?.pricingBreakdown?.baseFare ?? 0;
  const timeCost = pricing?.breakdown?.timeCost ?? bookingDetails?.pricingBreakdown?.timeCost ?? 0;
  const distanceCost = pricing?.breakdown?.distanceCost ?? bookingDetails?.pricingBreakdown?.distanceCost ?? 0;
  const perMinuteRate = pricing?.meta?.ratesUsed?.perMinuteRate ?? bookingDetails?.pricingMeta?.ratesUsed?.perMinuteRate ?? 0;
  const perKmRate = pricing?.meta?.ratesUsed?.perKmRate ?? bookingDetails?.pricingMeta?.ratesUsed?.perKmRate ?? 0;
  const tax = pricing?.breakdown?.tax ?? bookingDetails?.pricingBreakdown?.tax ?? 0;
  const serviceCost = pricing?.breakdown?.subtotal ?? bookingDetails?.pricingBreakdown?.subtotal ?? 0;
  const serviceCharge = pricing?.breakdown?.platformFee ?? bookingDetails?.pricingBreakdown?.platformFee ?? 0;
  const totalAmount = pricing?.riderPays ?? bookingDetails?.pricingBreakdown?.riderPaysFinal ?? 0;

  const providerDistanceInfo = bookingDetails?.providerDistances?.find(
    (p) => p.providerId === acceptedProviderId
  );
  const providerETA = providerDistanceInfo?.providerETAMinutes;

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
        if (totalAmount != null && walletBalance < totalAmount) {
          toast.error("Insufficient wallet balance. Please fund your wallet.");
          setIsProcessing(false);
          return;
        }

        const pickupNote = notes?.trim() || undefined;
        const payResponse = await payWithWallet(bookingId, pickupNote);

        if (payResponse) {
          setBooking(payResponse);
        }

        const newBalance =
          payResponse?.data?.walletBalance?.available ??
          payResponse?.walletBalance?.available ??
          null;
        if (newBalance != null) {
          setWalletBalance(newBalance);
        } else {
          await fetchBalance();
        }

        setIsPaid(true);
        setShowSuccessModal(true);
      } else if (selectedPayment === "online") {
        const pickupNote = notes?.trim() || undefined;
        const response = await initializePayment(bookingId, pickupNote);
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
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 relative animate-fadeIn">
        <button
          onClick={() => {
            setShowSuccessModal(false);
            navigate("/bookings");
          }}
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

          <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Service Cost:</span>
              <span className="font-medium text-gray-900">{formatCurrency(serviceCost)}</span>
            </div>
             <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Tax:</span>
              <span className="font-medium text-gray-900">{formatCurrency(tax)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Platform Fee:</span>
              <span className="font-medium text-gray-900">{formatCurrency(serviceCharge)}</span>
            </div>
            <div className="border-t border-gray-200 pt-2 flex justify-between items-center">
              <span className="text-gray-600 font-semibold">Total Deducted:</span>
              <span className="font-bold text-green-600 text-lg">
                {formatCurrency(totalAmount)}
              </span>
            </div>

            {selectedPayment === "wallet" ? (
              <div className="border-t border-gray-200 pt-2 flex justify-between items-center">
                <span className="text-gray-600">New Wallet Balance:</span>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(walletBalance)}
                </span>
              </div>
            ) : (
              <div className="border-t border-gray-200 pt-2 flex justify-between items-center">
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
    <DashboardLayout>
      <CancelModal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        onConfirm={handleCancel}
        loading={cancelLoading}
      />

      <div className="w-full px-3 sm:px-4 md:px-[5%]">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-4 sm:mb-6 mt-4 sm:mt-8">
          <Link to={"/bookings"} className="flex items-center gap-3">
            <button className="text-gray-600 hover:text-gray-900">
              <FiChevronLeft size={24} />
            </button>
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
              Booking summary
            </h1>
          </Link>
          {bookingDetails?._id && (
            <span className="text-[10px] sm:text-[12px] font-mono text-[#005823] bg-[#0058231A] px-2 py-1 rounded-md border border-[#0058234D] w-fit">
              Booking #{bookingDetails._id.slice(-6).toUpperCase()}
            </span>
          )}
        </div>

        {errorMessage && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-10">
          {/* Main Content Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white shadow-sm p-6 rounded-[16px] space-y-6 border border-gray-100">
              <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4">
                <div className="relative">
                  <img
                    src={providerDetails?.profilePicture}
                    alt={providerDetails?.fullName || "Provider"}
                    className="w-20 h-20 rounded-full object-cover border-2 border-[#0058231A]"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                    <BadgeCheck className="w-6 h-6 text-[#8BC53F]" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col items-center sm:items-start gap-1 mb-2">
                    <h2 className="text-xl font-bold text-gray-900 capitalize truncate w-full">
                      {providerDetails?.fullName || "Provider"}
                    </h2>
                    {providerDetails?._id && (
                      <span className="text-[10px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                        ID: {providerDetails._id.slice(-6).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2 capitalize font-medium">
                    {providerDetails?.job?.[0]?.title?.replace(/_/g, " ") ||
                      providerDetails?.services?.[0]?.title?.replace(/_/g, " ") ||
                      bookingDetails?.subCategory?.replace(/_/g, " ") ||
                      "—"}
                  </p>
                  <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-yellow-50 rounded-full border border-yellow-100">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-bold text-gray-900">
                        {providerDetails?.rating?.average > 0
                          ? providerDetails.rating.average.toFixed(1)
                          : "New"}
                      </span>
                      <span className="text-gray-500 text-xs">
                        ({providerDetails?.rating?.count ?? 0})
                      </span>
                    </div>
                    {providerETA && (
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 rounded-full border border-green-100">
                        <Clock className="w-4 h-4 text-[#005823]" />
                        <span className="font-semibold text-[#005823]">
                          {providerETA} mins away
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex sm:flex-col gap-4 sm:gap-2 justify-center border-t sm:border-t-0 sm:border-l border-gray-100 pt-4 sm:pt-0 sm:pl-6">
                  <div className="text-center sm:text-left">
                    <div className="text-2xl font-bold text-[#005823]">
                      {providerDetails?.completedJobs ?? 0}
                    </div>
                    <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      Jobs Done
                    </div>
                  </div>
                  <div className="hidden sm:block h-px bg-gray-100 w-full my-1"></div>
                  <div className="text-center sm:text-left">
                    <div className="text-base font-bold text-[#231F20]">
                      {bookingDetails?.bookingDuration?.value 
                        ? `${bookingDetails.bookingDuration.value} ${bookingDetails.bookingDuration.unit}` 
                        : bookingDetails?.estimatedDuration?.value
                        ? `${bookingDetails.estimatedDuration.value} ${bookingDetails.estimatedDuration.unit}`
                        : "—"}
                    </div>
                    <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      Duration
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="md:flex gap-5">
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
                    className="text-red-500 hover:bg-red-200 rounded-lg font-medium px-4 hover:text-red-600 transition-colors"
                  >
                    Cancel Request
                  </button>
                )}
              </div>
            </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-5 space-y-6">
            {/* Job Summary */}
            <div className="bg-[#231F2005] border border-[#231F201A] p-6 rounded-[16px] space-y-6">
              <h3 className="text-xl font-bold text-[#231F20]">Job Summary</h3>
              
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-[#E6EFE9] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-3 h-3 bg-[#005823] rounded-full" />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-sm text-[#231F2080] uppercase tracking-wide">Pickup Location</div>
                    <div className="text-[15px] font-medium text-[#231F20] leading-snug mt-1">
                      {pickupAddress}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-[#E6EFE9] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <MapPin className="w-5 h-5 text-[#005823]" />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-sm text-[#231F2080] uppercase tracking-wide">Dropoff Location</div>
                    <div className="text-[15px] font-medium text-[#231F20] leading-snug mt-1">
                      {dropoffAddress}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-[#E6EFE9] rounded-full flex items-center justify-center flex-shrink-0">
                    <Navigation className="w-5 h-5 text-[#005823]" />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-sm text-[#231F2080] uppercase tracking-wide">Estimated Distance</div>
                    <div className="text-[15px] font-medium text-[#231F20] mt-1">{estimatedDistance}</div>
                  </div>
                </div>
              </div>

              {bookingDetails?.description && (
                <div className="pt-4 border-t border-[#231F201A]">
                  <h4 className="font-bold text-sm text-[#231F2080] uppercase tracking-wide mb-2">Description</h4>
                  <p className="text-sm text-[#231F20BF] leading-relaxed italic">
                    "{bookingDetails.description}"
                  </p>
                </div>
              )}
            </div>

            {/* Payment Summary & Method */}
            <div className="bg-white border border-[#231F201A] p-6 rounded-[16px] shadow-sm space-y-6">
              <h3 className="text-xl font-bold text-[#231F20]">Payment Summary</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm font-medium text-gray-600">
                  <span>Base Fare</span>
                  <span>{formatCurrency(baseFare)}</span>
                </div>
                <div className="flex justify-between text-sm font-medium text-gray-600">
                  <span>Price per Minute</span>
                  <span>{formatCurrency(perMinuteRate)}</span>
                </div>
                <div className="flex justify-between text-sm font-medium text-gray-600">
                  <span>Price per KM</span>
                  <span>{formatCurrency(perKmRate)}</span>
                </div>
                <div className="flex justify-between text-sm font-medium text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatCurrency(serviceCost)}</span>
                </div>
                <div className="flex justify-between text-sm font-medium text-gray-600">
                  <span>Tax </span>
                  <span>{formatCurrency(tax)}</span>
                </div>
                <div className="flex justify-between text-sm font-medium text-gray-600">
                  <span>Platform Fee</span>
                  <span>{formatCurrency(serviceCharge)}</span>
                </div>
                <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                  <span className="font-bold text-gray-900">Total Amount</span>
                  <span className="text-xl font-black text-[#005823]">{formatCurrency(totalAmount)}</span>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-gray-100">
                <h4 className="font-bold text-sm text-gray-900 tracking-wide uppercase">Select Payment Method</h4>
                <div className="grid grid-cols-1 gap-3">
                  <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${selectedPayment === 'wallet' ? 'border-[#005823] bg-green-50 shadow-sm' : 'border-gray-100 hover:border-gray-300'}`}>
                    <input
                      type="radio"
                      name="payment"
                      value="wallet"
                      checked={selectedPayment === "wallet"}
                      onChange={(e) => setSelectedPayment(e.target.value)}
                      disabled={isPaid}
                      className="w-4 h-4 accent-[#005823]"
                    />
                    <div className="flex-1">
                      <div className="font-bold text-gray-900">Wallet</div>
                      <div className="text-xs text-gray-500">Bal: {formatCurrency(walletBalance)}</div>
                    </div>
                  </label>
                  <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${selectedPayment === 'online' ? 'border-[#005823] bg-green-50 shadow-sm' : 'border-gray-100 hover:border-gray-300'}`}>
                    <input
                      type="radio"
                      name="payment"
                      value="online"
                      checked={selectedPayment === "online"}
                      onChange={(e) => setSelectedPayment(e.target.value)}
                      disabled={isPaid}
                      className="w-4 h-4 accent-[#005823]"
                    />
                    <div className="flex-1 font-bold text-gray-900">Pay Online</div>
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pickup Notes (Optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Need something specific? Tell the provider..."
                  disabled={isPaid}
                  className="w-full p-3 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#00582333] transition-all resize-none h-20"
                />
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleConfirmAndPay}
                  disabled={isProcessing || isPaid}
                  className="w-full py-4 bg-[#005823] text-white rounded-xl font-bold text-lg hover:bg-green-700 transition-all shadow-lg shadow-green-900/10 disabled:opacity-50"
                >
                  {isPaid ? "Payment Successful ✓" : isProcessing ? "Processing..." : `Confirm & Pay ${formatCurrency(totalAmount)}`}
                </button>
                {!isPaid && (
                  <button
                    onClick={() => setCancelModalOpen(true)}
                    className="w-full py-2 text-red-600 font-bold hover:bg-red-50 rounded-lg transition-all text-sm"
                  >
                    Cancel Request
                  </button>
                )}
                <p className="text-center text-[10px] text-gray-400 font-medium">Rider will proceed once payment is confirmed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showSuccessModal && <SuccessModal />}
      </div>
    </DashboardLayout>
  );
}
