import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Phone,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  MapPin,
  Star,
  Shield,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Clock3,
  X,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import DeliveryMap from "../../../../components/dashboard/Map";
import { useAuthStore } from "../../../../stores/auth.store";
import useBookingStore from "../../../../stores/booking.store";
import { updateBookingStatus, markAsComplete } from "../../../../api/bookings";
import ProviderDashboardLayout from "../../../../components/layouts/ProviderDashboardLayout";

// Error Boundary for Map Component
class MapErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
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
            We're having trouble loading the live map. Tracking updates will
            still show in the status timeline.
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

const STATUS_FLOW = {
  // current booking status -> what clicking the button SENDS to the API
  enroute_to_pickup: "arrived_at_pickup",
  in_progress: "arrived_at_pickup",
  arrived_at_pickup: "enroute_to_dropoff",
  enroute_to_dropoff: "arrived_at_dropoff",
  arrived_at_dropoff: "completed",
};

const BUTTON_LABELS = {
  enroute_to_pickup: "Arrived at Pickup",
  in_progress: "Arrived at Pickup", // page mounts here
  arrived_at_pickup: "Start Trip",
  enroute_to_dropoff: "Arrived at Destination",
  arrived_at_dropoff: "Complete Trip",
};

const STEPS_COMPLETED_BY_STATUS = {
  enroute_to_pickup: [1],
  in_progress: [1],
  arrived_at_pickup: [1, 2],
  enroute_to_dropoff: [1, 2, 3],
  arrived_at_dropoff: [1, 2, 3, 4],
  completed: [1, 2, 3, 4, 5],
};

export default function TrackDelivery() {
  const routeLocation = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const wsRef = useRef(null);
  const normalizeStatus = (value) =>
    String(value || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "_");
  const toCanonicalStatus = (value) => {
    const normalized = normalizeStatus(value);
    return normalized === "in_progress" ? "enroute_to_pickup" : normalized;
  };

  const alert = routeLocation.state?.alert || {};
  const [isDeliveryStatusExpanded, setIsDeliveryStatusExpanded] =
    useState(true);
  const [updating, setUpdating] = useState(false);
  const [riderLocation, setRiderLocation] = useState(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  const booking = useBookingStore((state) => state.booking);
  const bookingDetails = booking?.data?.booking || {};
  console.log(bookingDetails);
  
  const selectedProviderId = useBookingStore(
    (state) => state.selectedProviderId,
  );
  const providerDetails =
    booking?.data?.providers?.find((p) => p.id === selectedProviderId) ||
    booking?.data?.providers?.[0] ||
    {};

  // Track current booking status in local state so UI updates immediately
  const routeStatus = toCanonicalStatus(routeLocation.state?.status);
  const alertStatus = toCanonicalStatus(
    alert?.status || alert?.originalData?.status,
  );
  const initialStatusCandidate =
    routeStatus || alertStatus || "enroute_to_pickup";
  const supportedStatuses = [
    "enroute_to_pickup",
    "arrived_at_pickup",
    "enroute_to_dropoff",
    "arrived_at_dropoff",
    "completed",
  ];
  const initialStatus = supportedStatuses.includes(initialStatusCandidate)
    ? initialStatusCandidate
    : "enroute_to_pickup";

  const [bookingStatus, setBookingStatus] = useState(initialStatus);

  const bookingId =
    alert?.id || alert?.originalData?._id || bookingDetails?._id;
  const bookingForChat = alert?.originalData || bookingDetails || {};
  const customerForChat = bookingForChat?.userId || null;

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
  const providerCoords = getLocationCoords(user?.data?.currentLocation);

  const pickupAddress =
    alert?.originalData?.pickupLocation?.address ||
    bookingDetails?.pickupLocation?.address ||
    "N/A";
  const dropoffAddress =
    alert?.originalData?.dropoffLocation?.address ||
    bookingDetails?.dropoffLocation?.address ||
    "N/A";
  const serviceCost =
    alert?.price ||
    alert?.originalData?.calculatedPrice ||
    bookingDetails?.calculatedPrice ||
    0;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const normalizedSubCategory = String(
    alert?.originalData?.subCategory || bookingDetails?.subCategory || "",
  )
    .trim()
    .toLowerCase()
    .replace(/_/g, " ");

  const packageDeliverySteps = [
    {
      id: 1,
      title: "En route to pickup",
      subtitle: "On the way to pickup",
    },
    {
      id: 2,
      title: "Arrived at pickup location",
      subtitle: "At pickup point",
    },
    {
      id: 3,
      title: "En route to delivery",
      subtitle: "Leaving for dropoff location",
    },
    {
      id: 4,
      title: "Arrived at delivery Location",
      subtitle: "At delivery location",
    },
    {
      id: 5,
      title: "Delivery completed",
      subtitle: "Package delivered",
    },
  ];

  const bookARideSteps = [
    {
      id: 1,
      title: "En route to pickup",
      subtitle: "On the way to pickup",
    },
    {
      id: 2,
      title: "Arrived at pickup location",
      subtitle: "At pickup point",
    },
    {
      id: 3,
      title: "En route to destination",
      subtitle: "Leaving for dropoff location",
    },
    {
      id: 4,
      title: "Arrived at destination",
      subtitle: "At dropoff location",
    },
    {
      id: 5,
      title: "Ride completed",
      subtitle: "Ride completed",
    },
  ];

  const deliverySteps =
    normalizedSubCategory === "book a ride"
      ? bookARideSteps
      : packageDeliverySteps;
  console.log("alert:", routeLocation.state?.alert);

  const completedStepIds = STEPS_COMPLETED_BY_STATUS[bookingStatus] || [1];

  const handleStatusUpdate = async () => {
    console.log("bookingId:", bookingId);
    console.log("bookingStatus:", bookingStatus);
    console.log("nextStatus:", STATUS_FLOW[bookingStatus]);

    if (!bookingId) return console.error("No bookingId found");

    const isCompleting = bookingStatus === "arrived_at_dropoff";

    setUpdating(true);
    try {
      if (isCompleting) {
        await markAsComplete(bookingId);
        // await updateBookingStatus(bookingId, "completed"); // replace with markAsComplete(bookingId) when ready
        setBookingStatus("completed");
        setShowCompletionModal(true);
      } else {
        const nextStatus = STATUS_FLOW[bookingStatus];
        if (!nextStatus) return;
        await updateBookingStatus(bookingId, nextStatus);
        setBookingStatus(nextStatus);
      }
    } catch (err) {
      console.error("Failed to update booking status:", err);
    } finally {
      setUpdating(false);
    }
  };

  const handleMessageCustomer = () => {
    if (!bookingId) return;
    navigate(`/dashboard/provider/chat?bookingId=${bookingId}`, {
      state: { booking: bookingForChat, customer: customerForChat },
    });
  };

  const buttonLabel = BUTTON_LABELS[bookingStatus] || "Arrived at Pickup";

  const isFullyComplete = bookingStatus === "completed";
  const completionMessage =
    "Well done! Do inform the customer to accept completion so you can get ratings and your payment. Please note that you will only be able to withdraw the payment by tomorrow.";

  const estimatedDuration =
    alert?.originalData?.estimatedDuration || bookingDetails?.estimatedDuration;
  const getArrivalText = () => {
    switch (bookingStatus) {
      case "enroute_to_pickup":
      case "in_progress":
        return estimatedDuration?.value
          ? `Arrival in ${estimatedDuration.value} ${estimatedDuration.unit}`
          : "On the way to pickup";
      case "arrived_at_pickup":
        return "Arrived at pickup location";
      case "enroute_to_dropoff":
        return "En route to delivery";
      case "arrived_at_dropoff":
        return "Arrived at destination";
      case "completed":
        return "Delivery Completed";
      default:
        return "Tracking delivery";
    }
  };

  useEffect(() => {
    if (
      providerCoords?.latitude !== undefined &&
      providerCoords?.longitude !== undefined
    ) {
      setRiderLocation((prev) => prev || providerCoords);
    }
  }, [providerCoords?.latitude, providerCoords?.longitude]);

  useEffect(() => {
    // Correctly prioritize and validate bookingId
    const finalBookingId =
      routeLocation.state?.alert?._id ||
      routeLocation.state?.alert?.id ||
      alert?.id ||
      alert?.originalData?._id ||
      bookingDetails?._id;

    if (!finalBookingId) {
      console.warn("Tracking cannot start: No valid booking ID found.");
      return;
    }

    // Guard against malformed WS URL (avoid 'undefined/tracking/...')
    const wsBaseUrl = import.meta.env.VITE_WS_URL;
    if (!wsBaseUrl || wsBaseUrl === "undefined") {
      console.error(
        "WebSocket Error: VITE_WS_URL is not defined in environment variables.",
      );
      return;
    }

    const wsUrl = `${wsBaseUrl}/tracking/${finalBookingId}`;
    console.log("Connecting to WebSocket:", wsUrl);

    try {
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log(
          "WebSocket connected for provider tracking:",
          finalBookingId,
        );
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.location) {
            setRiderLocation({
              latitude: data.location.coordinates[1],
              longitude: data.location.coordinates[0],
              bearing: data.bearing || 0,
            });
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      wsRef.current.onclose = () => {
        console.log("WebSocket disconnected");
      };
    } catch (wsInitError) {
      console.error("Failed to initialize WebSocket:", wsInitError);
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [bookingId, routeLocation.state]);

  const customer = alert?.originalData?.userId || {};

  return (
    <ProviderDashboardLayout>
      <div className="pb-20 lg:pb-0">
        {/* Navigation Header for Mobile */}
        <div className="lg:hidden mb-4 sm:mb-6">
          <button
            onClick={() => navigate("/dashboard/provider/hire-alert")}
            className="flex items-center gap-2 text-[#231F2080] hover:text-[#005823] transition-colors font-medium group"
          >
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center group-hover:bg-[#E6EFE9] transition-colors border">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="text-sm sm:text-base">Back to Alerts</span>
          </button>
        </div>

        <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 gap-6 lg:gap-10">
          <div>
            <div className="hidden lg:block mb-4 sm:mb-6">
              <button
                onClick={() => navigate("/dashboard/provider/hire-alert")}
                className="flex items-center gap-2 text-[#231F2080] hover:text-[#005823] transition-colors font-medium group"
              >
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center group-hover:bg-[#E6EFE9] transition-colors border">
                  <ArrowLeft className="w-4 h-4" />
                </div>
                <span className="text-sm sm:text-base">Back to Alerts</span>
              </button>
            </div>

            <div className="hidden lg:block mb-6">
              <h1 className="text-[28px] font-semibold text-[#231F20]">
                {getArrivalText()}
              </h1>
            </div>

            <div className="lg:hidden mb-2">
              <h2 className="text-2xl font-bold text-[#231F20] leading-tight">
                {getArrivalText()}
              </h2>
            </div>

            <div className="mb-6 space-y-3 border-2 border-[#231F201A] px-5 py-3 rounded-[16px]">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#E6EFE9] rounded-full flex items-center justify-center flex-shrink-0">
                  <div className="w-3 h-3 bg-[#005823] rounded-full"></div>
                </div>
                <div>
                  <span className="text-[#231F2080] text-[16px]">Pickup</span>
                  <p className="text-[#231F20BF] text-[20px]">
                    {pickupAddress}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#E6EFE9] rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-3 h-3 text-[#005823]" />
                </div>
                <div>
                  <span className="text-[#231F2080] text-[16px]">Dropoff</span>
                  <p className="text-[#231F20BF] text-[20px]">
                    {dropoffAddress}
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
                  {/* <div className="text-[#231F20BF] text-[16px] mb-1">
                    <div>
                      {user?.data?.services?.[0]?.title?.replace(/_/g, " ") ||
                        bookingDetails?.subCategory?.replace(/_/g, " ") ||
                        "N/A"}
                    </div>
                  </div> */}
                  {/* <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium text-gray-900">
                      {user?.data?.rating?.average > 0
                        ? user.data.rating.average.toFixed(1)
                        : "New"}
                    </span>
                    <span className="text-xs text-gray-500">
                      ({user?.data?.rating?.count ?? 0} reviews)
                    </span>
                  </div> */}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6">
                {/* <button className="flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all font-semibold active:scale-95">
                  <Phone className="w-5 h-5 text-gray-600" />
                  <span className="text-sm">Call</span>
                </button> */}
                <button
                  onClick={handleMessageCustomer}
                  className="flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all font-semibold active:scale-95"
                >
                  <MessageCircle className="w-5 h-5 text-gray-600" />
                  <span className="text-sm">Message</span>
                </button>
              </div>
            </div>

            <h3 className="text-[14px] font-semibold text-[#231F20BF] mb-2">
              Pickup note
            </h3>
            <p className="bg-[#007BFF08] rounded-lg text-[#231F2080] border border-[#231F201A] p-4 mb-4">
              {alert?.pickupNote || "No pickup note provided."}
            </p>

            <div className="mb-4">
              <h3 className="text-[16px] font-semibold text-[#231F20]">Fare</h3>
              <div className="flex items-center gap-2">
                <span className="text-[20px] font-bold text-[#231F20]">
                  {formatCurrency(serviceCost)}
                </span>
              </div>

              {!isFullyComplete && (
                <button
                  onClick={handleStatusUpdate}
                  disabled={updating}
                  className="mt-3 px-4 py-2 rounded-md bg-[#005823] text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {updating ? "Updating..." : buttonLabel}
                </button>
              )}

              {isFullyComplete && (
                <p className="mt-3 text-green-700 font-semibold text-[16px]">
                  ✓ Delivery Completed
                </p>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <button
                onClick={() =>
                  setIsDeliveryStatusExpanded(!isDeliveryStatusExpanded)
                }
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-[16px] font-semibold text-[#231F20]">
                  Delivery Status
                </h3>
                {isDeliveryStatusExpanded ? (
                  <ChevronUp className="w-5 h-5 text-black" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-black" />
                )}
              </button>

              {isDeliveryStatusExpanded && (
                <div className="px-4 pb-4">
                  {deliverySteps.map((step, index) => {
                    const isCompleted = completedStepIds.includes(step.id);
                    return (
                      <div key={step.id} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              isCompleted
                                ? "border-green-500 bg-green-500"
                                : "border-gray-300 bg-white"
                            }`}
                          >
                            {isCompleted ? (
                              <svg
                                className="w-3 h-3 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={3}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            ) : (
                              <div className="w-2 h-2 bg-[#908E8F] rounded-full"></div>
                            )}
                          </div>
                          {index < deliverySteps.length - 1 && (
                            <div
                              className={`w-0.5 h-12 ${isCompleted ? "bg-green-500" : "bg-gray-200"}`}
                            ></div>
                          )}
                        </div>

                        <div className="pb-12 last:pb-0">
                          <div
                            className={`text-[16px] font-medium ${
                              isCompleted
                                ? "text-[#005823]"
                                : "text-[#231F20BF]"
                            }`}
                          >
                            {step.title}
                          </div>
                          <div
                            className={`text-[12px] ${
                              isCompleted ? "text-gray-500" : "text-[#231F20BF]"
                            }`}
                          >
                            {step.subtitle}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
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

      <AnimatePresence>
        {showCompletionModal && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCompletionModal(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: 28, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 280, damping: 24 }}
              className="relative w-full max-w-lg overflow-hidden rounded-[28px] border border-white/70 bg-white shadow-[0_30px_80px_rgba(0,0,0,0.28)]"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(0,88,35,0.14),_transparent_42%),linear-gradient(135deg,_rgba(230,239,233,0.92),_rgba(255,255,255,1))]" />
              <div className="relative p-6 sm:p-8">
                <button
                  onClick={() => setShowCompletionModal(false)}
                  aria-label="Close modal"
                  className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/85 text-slate-500 shadow-sm transition hover:bg-white hover:text-slate-900"
                >
                  <X size={18} />
                </button>

                <div className="flex flex-col items-center text-center">
                  <motion.div
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 260, damping: 18 }}
                    className="relative mb-6"
                  >
                    <div className="absolute inset-0 rounded-full bg-[#005823]/10 blur-2xl" />
                    <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-[#005823] text-white shadow-[0_18px_40px_rgba(0,88,35,0.35)]">
                      <CheckCircle2 className="h-12 w-12" />
                    </div>
                    <motion.div
                      className="absolute -right-2 -top-2 rounded-full bg-[#8BC53F] p-2 text-white shadow-lg"
                      animate={{ rotate: [0, 12, 0], scale: [1, 1.08, 1] }}
                      transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <Sparkles className="h-4 w-4" />
                    </motion.div>
                  </motion.div>

                  <span className="mb-3 inline-flex items-center rounded-full border border-[#005823]/15 bg-[#005823]/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#005823]">
                    Trip completed
                  </span>

                  <h2 className="text-3xl font-semibold text-[#231F20] sm:text-[34px]">
                    Well done!
                  </h2>

                  <p className="mt-4 max-w-md text-[15px] leading-7 text-[#231F20BF] sm:text-base">
                    {completionMessage}
                  </p>

                  <div className="mt-6 w-full rounded-2xl border border-[#005823]/10 bg-white/80 p-4 text-left shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 rounded-full bg-[#005823]/10 p-2 text-[#005823]">
                        <Clock3 className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#231F20]">
                          Withdrawal note
                        </p>
                        <p className="mt-1 text-sm leading-6 text-[#231F2080]">
                          The payment will be available for withdrawal from
                          tomorrow.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row">
                    <button
                      onClick={() => setShowCompletionModal(false)}
                      className="inline-flex flex-1 items-center justify-center rounded-xl border border-[#231F201A] bg-white px-5 py-3 text-sm font-semibold text-[#231F20] transition hover:bg-[#F7F8F7]"
                    >
                      Got it
                    </button>
                    <button
                      onClick={() => setShowCompletionModal(false)}
                      className="inline-flex flex-1 items-center justify-center rounded-xl bg-[#005823] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#005823]/25 transition hover:bg-[#00461d]"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ProviderDashboardLayout>
  );
}
