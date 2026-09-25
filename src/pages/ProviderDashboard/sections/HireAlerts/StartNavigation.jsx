import React, { useState, useEffect, useRef } from "react";
import {
  Phone,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  MapPin,
  Star,
  Shield,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import DeliveryMap from "../../../../components/dashboard/Map";
import { useAuthStore } from "../../../../stores/auth.store";
import useBookingStore from "../../../../stores/booking.store";
import { startJob, getBookingsDetails } from "../../../../api/bookings";
import { cancelBooking as cancelProviderBooking } from "../../../../api/provider";
import {
  canMessage,
  canProviderCancel,
  normalizeStatus,
} from "../../../../utils/chat.utils";
import ProviderNavbar from "../../../../components/provider-dashboard/Navbar";
import ProviderDashboardLayout from "../../../../components/layouts/ProviderDashboardLayout";
import ProviderCancellationModal from "../../../../components/provider-dashboard/ProviderCancellationModal";
import WaitingForPaymentModal from "../../../../components/provider-dashboard/WaitingForPaymentModal"; // adjust path to match where you save it
import PaymentExpiredModal from "../../../../components/provider-dashboard/PaymentExpiredModal"; // adjust path to match where you save it

// Error Boundary for Map Component
class MapErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Map Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full bg-gray-100 rounded-lg flex flex-col items-center justify-center p-6 text-center border-2 border-dashed border-gray-200">
          <MapPin size={48} className="text-gray-300 mb-4" />
          <h3 className="text-gray-600 font-semibold mb-2">Map unavailable</h3>
          <p className="text-gray-400 text-sm max-w-xs">
            We're having trouble loading the live map. Try refreshing the page
            to try again.
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="mt-4 px-4 py-2 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Retry Loading Map
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function StartNavigation() {
  const navigate = useNavigate();
  const locationState = useLocation();
  const alert = locationState.state?.alert || {};
  const user = useAuthStore((state) => state.user);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState(null);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  const booking = useBookingStore((state) => state.booking);
  const bookingDetails = booking?.data?.booking || {};
  const selectedProviderId = useBookingStore(
    (state) => state.selectedProviderId,
  );
  const providerDetails =
    booking?.data?.providers?.find((p) => p.id === selectedProviderId) ||
    booking?.data?.providers?.[0] ||
    {};

  const getLocationCoords = (location) => {
    const coords = location?.coordinates?.coordinates || location?.coordinates;
    if (Array.isArray(coords) && coords.length >= 2) {
      return { longitude: coords[0], latitude: coords[1] };
    }
    return { longitude: undefined, latitude: undefined };
  };

  const pickupCoords = getLocationCoords(
    alert?.originalData?.pickupLocation || bookingDetails?.pickupLocation,
  );
  const dropoffCoords = getLocationCoords(
    alert?.originalData?.dropoffLocation || bookingDetails?.dropoffLocation,
  );

  const bookingId = alert?.id || alert?.originalData?._id || bookingDetails?._id;
  const customer = alert?.originalData?.userId || {};

  // ---------------------------------------------------------------
  // PAYMENT STATUS — single source of truth for the modal(s) AND the
  // Start Navigation button's disabled state below.
  //   "pending" -> WaitingForPaymentModal shows, button disabled
  //   "paid"    -> both modals unmount, button enabled
  //   "expired" -> PaymentExpiredModal shows, button stays disabled
  // ---------------------------------------------------------------
  const [paymentStatus, setPaymentStatus] = useState("pending");
  const [latestBooking, setLatestBooking] = useState(null);
  const [waitingModalDismissed, setWaitingModalDismissed] = useState(false);
  const pollRef = useRef(null);

  useEffect(() => {
    if (!alert?.id || paymentStatus !== "pending") return;

    const poll = async () => {
      try {
        const data = await getBookingsDetails(alert.id);
        const latestBookingData = data?.data?.booking;
        setLatestBooking(latestBookingData);

        // Confirmed: /api/v1/bookings/{id} returns status "paid_escrow"
        // once payment is complete (held in escrow until the job wraps).
        if (latestBookingData?.status === "paid_escrow") {
          setPaymentStatus("paid");
        }
      } catch (err) {
        console.error("Failed to fetch booking status:", err);
        // a failed check just tries again on the next tick
      }
    };

    poll(); // check immediately, don't wait 5s for the first result
    pollRef.current = setInterval(poll, 5000);

    return () => clearInterval(pollRef.current);
  }, [alert?.id, paymentStatus]);

  // Note: checked the payment API module (initializePayment, verifyPayment,
  // payWithWallet) — it's REST-only (axios calls), no socket/push mechanism
  // exists in this codebase. Polling above is the only way to detect
  // payment confirmation right now, not a temporary fallback.

  const handlePaymentExpire = () => {
    clearInterval(pollRef.current); // stop polling a dead job
    setPaymentStatus("expired");
  };

  const handlePaymentModalClose = () => {
    // X icon just hides the popup — stays on this page, keeps polling
    // AND keeps counting down in the background, since both now live
    // in this parent component instead of inside the modal.
    setWaitingModalDismissed(true);
  };

  const handleBackToDashboard = () => {
    navigate("/dashboard/provider/hire-alert");
  };

  const isPaid = paymentStatus === "paid";

  // ---------------------------------------------------------------
  // COUNTDOWN TIMER — lives here (the parent) instead of inside
  // WaitingForPaymentModal, specifically so it keeps running even
  // while the modal is dismissed/unmounted. If the timer lived inside
  // the modal, closing the modal would unmount it, React would clear
  // its interval, and the countdown would just stop — meaning
  // PaymentExpiredModal would never fire for a dismissed job.
  //
  // Same deadline-in-localStorage approach as before, so a page
  // refresh doesn't reset it either.
  // ---------------------------------------------------------------
  const PAYMENT_WINDOW_SECONDS = 5 * 60; // 5 minutes
  const [deadline, setDeadline] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(PAYMENT_WINDOW_SECONDS);
  const hasExpiredRef = useRef(false);

  useEffect(() => {
    if (!alert?.id) return;

    const storageKey = `payment_deadline_${alert.id}`;
    const stored = localStorage.getItem(storageKey);

    if (stored) {
      setDeadline(stored);
      return;
    }

    const fresh = new Date(Date.now() + PAYMENT_WINDOW_SECONDS * 1000).toISOString();
    localStorage.setItem(storageKey, fresh);
    setDeadline(fresh);
  }, [alert?.id]);

  useEffect(() => {
    if (!deadline || paymentStatus !== "pending") return; // stop once paid/expired

    const getRemaining = () =>
      Math.max(Math.floor((new Date(deadline).getTime() - Date.now()) / 1000), 0);

    const tick = () => {
      const remaining = getRemaining();
      setSecondsLeft(remaining);

      if (remaining <= 0 && !hasExpiredRef.current) {
        hasExpiredRef.current = true;
        localStorage.removeItem(`payment_deadline_${alert?.id}`);
        handlePaymentExpire();
      }
    };

    tick(); // sync immediately, don't wait a full second
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deadline, paymentStatus]);

  // Same fields AlertsCard.jsx reads off `alert` for pickup, dropoff,
  // price breakdown and delivery date — reused so the modal shows the
  // exact numbers the provider saw before accepting.
  const modalPickup = alert?.originalData?.pickupLocation?.address || "N/A";
  const modalDropoff = alert?.originalData?.dropoffLocation?.address || "N/A";
  const modalDateTime = alert?.deliveryDate || "N/A";
  const modalBookingPrice =
    latestBooking?.agreedPrice ?? latestBooking?.calculatedPrice ?? alert?.BookingPrice ?? 0;
  // ⚠️ This schema has no platformFee/riderReceives fields — these still
  // fall back to `alert`'s values from AlertsCard until you confirm
  // where (or whether) the backend sends a fee breakdown.
  const modalPlatformFee = alert?.platformFee ?? 0;
  const modalRiderReceives = alert?.RiderReceives ?? 0;

  const handleStartNavigation = async () => {
    if (!alert?.id) return;
    try {
      setStarting(true);
      setError(null);
      await startJob(alert.id);
      navigate("/dashboard/provider/track-delivery", {
        state: { alert },
      });
    } catch (err) {
      console.error("Error starting job:", err);
      setError(err.response?.data?.message || "Failed to start job");
    } finally {
      setStarting(false);
    }
  };

  const statusForCancel =
    alert?.originalData?.status || bookingDetails?.status || alert?.status;
  const isAcceptedUnpaidRoute =
    normalizeStatus(alert?.status) === "new" &&
    normalizeStatus(alert?.originalData?.status) ===
      "awaiting_provider_acceptance";
  const shouldShowCancelRequest =
    canProviderCancel(statusForCancel) ||
    canProviderCancel(alert?.status) ||
    isAcceptedUnpaidRoute;

  const handleCancel = async (reason) => {
    if (!bookingId) {
      throw new Error("Booking details are unavailable for cancellation.");
    }

    await cancelProviderBooking(bookingId, reason);
  };

  const handleCancelComplete = () => {
    navigate("/dashboard/provider/hire-alert");
  };

  return (
    <ProviderDashboardLayout>
      <div className="py-4">
      <ProviderCancellationModal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        onSubmit={handleCancel}
        onComplete={handleCancelComplete}
      />

      {/* Pops up on load and unmounts once paymentStatus flips, or once
          the provider dismisses it early with the X icon. */}
      {paymentStatus === "pending" && !waitingModalDismissed && (
        <WaitingForPaymentModal
          secondsLeft={secondsLeft}
          customer={{
            fullName: customer?.fullName || "Customer",
            profilePicture: customer?.profilePicture || "/avatar.png",
          }}
          pickup={modalPickup}
          dropoff={modalDropoff}
          dateTime={modalDateTime}
          bookingPrice={modalBookingPrice}
          platformFee={modalPlatformFee}
          riderReceives={modalRiderReceives}
          onClose={handlePaymentModalClose}
          onExpire={handlePaymentExpire}
        />
      )}

      {/* Separate modal — pops up automatically the moment the
          countdown above hits 0 with no payment confirmed. */}
      {paymentStatus === "expired" && (
        <PaymentExpiredModal onBackToDashboard={handleBackToDashboard} />
      )}

      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
        <div className="">
          <h1 className="text-[22px] sm:text-[26px] lg:text-[28px] font-semibold text-[#231F20] mb-4">
            {alert?.subCategory
              ? alert.subCategory
                  .toString()
                  .replace(/\b\w/g, (char) => char.toUpperCase())
              : ""}
          </h1>

          <div className="mb-6 space-y-3 border-2 border-[#231F201A] px-5 py-3 rounded-[16px]">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-[#E6EFE9] rounded-full flex items-center justify-center flex-shrink-0">
                <div className="w-3 h-3 bg-[#005823] rounded-full"></div>
              </div>
              <div>
                <span className="text-[#231F2080] text-[16px]">Pickup</span>
                <p className="text-[#231F20BF] text-[15px] sm:text-[17px] lg:text-[20px] leading-snug">
                  {alert?.originalData?.pickupLocation?.address}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-[#E6EFE9] rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin className="w-3 h-3 text-[#005823]" />
              </div>
              <div>
                <span className="text-[#231F2080] text-[16px]">Dropoff</span>
                <p className="text-[#231F20BF] text-[15px] sm:text-[17px] lg:text-[20px] leading-snug">
                  {alert?.originalData?.dropoffLocation?.address}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center gap-3 mb-4">
              <img
                src={customer?.profilePicture || "/avatar.png"}
                alt={customer?.fullName || "Customer"}
                className="w-14 h-14 rounded-full object-cover"
              />
              <div className="flex-grow">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-semibold text-[20px] text-[#231F20]">
                    {customer?.fullName || "Customer"}
                  </span>
                  <span className="flex items-center gap-1 px-1.5 py-0.5 bg-green-50 text-[#8BC53F] text-xs font-medium rounded">
                    <Shield className="w-3 h-3" /> Verified
                  </span>
                </div>
                <div className="text-[#231F20BF] text-[16px] mb-1">
                  <p>
                    {providerDetails?.services?.[0]?.title?.replace(
                      /_/g,
                      " ",
                    ) ||
                      bookingDetails?.subCategory?.replace(/_/g, " ") ||
                      "—"}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium text-gray-900">
                    {user?.data?.rating?.average > 0
                      ? user?.data?.rating.average.toFixed(1)
                      : "New"}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({user?.data?.rating?.count ?? 0} reviews)
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <button className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Phone className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Call</span>
              </button>
              {canMessage(alert?.status || bookingDetails?.status) && (
                <button className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <MessageCircle className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Message
                  </span>
                </button>
              )}
              {shouldShowCancelRequest && (
                <button
                  onClick={() => setCancelModalOpen(true)}
                  className="text-[#E90000] font-medium text-[16px] px-3 py-3 rounded-[10px] hover:text-red-600 transition-colors hover:bg-red-200"
                >
                  Cancel Request
                </button>
              )}
            </div>
          </div>

          <h3 className="text-[14px] font-semibold text-[#231F20BF] mb-2">
            Pickup note
          </h3>
          <p className="bg-[#007BFF08] rounded-lg text-[#231F2080] border border-[#231F201A] p-4 mb-4">
            {alert?.originalData?.pickupNote || "No pickup note provided."}
          </p>

          <div className="mb-4">
            <h3 className="text-[16px] font-semibold text-[#231F20]">Fare</h3>
            <div className="flex items-center gap-2">
              <span className="text-[20px] font-bold text-[#231F20]">
                ₦{Number(alert?.RiderReceives || 0).toLocaleString()}
              </span>
            </div>
          </div>
          {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

          {/* Disabled until the customer has paid (isPaid false while
              "pending" or "expired"), same as while starting=true. */}
          <button
            onClick={handleStartNavigation}
            disabled={starting || !isPaid}
            title={!isPaid ? "Waiting for customer payment" : undefined}
            className={`px-4 py-2 rounded-md text-white transition-colors ${
              isPaid
                ? "bg-[#005823] hover:bg-[#00481c]"
                : "bg-[#005823]/40 cursor-not-allowed"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {starting ? "Starting..." : "Start Navigation"}
          </button>
        </div>

        <div className="h-[400px] sm:h-[500px] lg:h-[660px] rounded-2xl overflow-hidden shadow-inner lg:shadow-lg lg:sticky lg:top-24">
          <MapErrorBoundary>
            <DeliveryMap
              pickup={pickupCoords}
              dropoff={dropoffCoords}
              bookingDetails={bookingDetails}
            />
          </MapErrorBoundary>
        </div>
      </div>
      </div>
    </ProviderDashboardLayout>
  );
}