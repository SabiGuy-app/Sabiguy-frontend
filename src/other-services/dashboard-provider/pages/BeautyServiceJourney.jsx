import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Banknote,
  MapPin,
  MessageCircle,
  PhoneCall,
} from "lucide-react";
import ProviderDashboardLayout from "../../../components/layouts/ProviderDashboardLayout";
import DeliveryMap from "../../../components/dashboard/Map";
import { useCallContext } from "../../../components/shared/CallContext";
import {
  getBookingsDetails,
  startJob,
  updateBookingStatus,
} from "../../../api/bookings";
import { getBookingDetails as getProviderBookingDetails } from "../../../api/provider";
import JobDetailsModal from "../../../pages/ProviderDashboard/sections/HireAlerts/JobDetails";
import MarkAsCompleted from "../../../components/provider-dashboard/MarkAsCompleted";
import { useAuthStore } from "../../../stores/auth.store";
import { cancelBooking as cancelProviderBooking } from "../../../api/provider";
import ProviderCancellationModal from "../../../components/provider-dashboard/ProviderCancellationModal";

const extractBooking = (response) =>
  response?.data?.booking ||
  response?.data?.data?.booking ||
  response?.data?.data ||
  response?.data ||
  response?.booking ||
  response;

const mapPoint = (location) => {
  if (!location) return null;

  const address =
    location?.address || location?.formattedAddress || location?.name || "";

  const coordinates =
    location?.coordinates?.coordinates || location?.coordinates;
  const [longitude, latitude] = Array.isArray(coordinates)
    ? coordinates.map(Number)
    : [
        Number(
          location?.longitude ??
            location?.coordinates?.longitude ??
            location?.coordinates?.lng ??
            location?.lng,
        ),
        Number(
          location?.latitude ??
            location?.coordinates?.latitude ??
            location?.coordinates?.lat ??
            location?.lat,
        ),
      ];

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return address ? { address } : null;
  }

  return { latitude, longitude, address };
};

const hasCoordinates = (point) =>
  Number.isFinite(point?.latitude) && Number.isFinite(point?.longitude);

const getAvatar = (person) =>
  person?.profilePicture ||
  person?.profileImage ||
  person?.avatar ||
  person?.image ||
  person?.photo ||
  person?.profile?.profilePicture ||
  "/avatar.png";

const getStoredProviderLocation = () => {
  try {
    const stored = JSON.parse(
      localStorage.getItem("providerCurrentLocation") || "null",
    );
    return stored && typeof stored === "object" ? stored : null;
  } catch {
    return null;
  }
};

export default function BeautyServiceJourney() {
  const { bookingId } = useParams();
  const route = useLocation();
  const navigate = useNavigate();
  const callContext = useCallContext();
  const user = useAuthStore((state) => state.user);
  const [booking, setBooking] = useState(
    route.state?.job?.originalData || route.state?.booking || null,
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [starting, setStarting] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [completionOpen, setCompletionOpen] = useState(false);
  const [error, setError] = useState("");
  const [cancelOpen, setCancelOpen] = useState(false);
  const [storedProviderLocation, setStoredProviderLocation] = useState(
    getStoredProviderLocation,
  );

  useEffect(() => {
    let active = true;
    const loadBooking = async () => {
      try {
        return await getProviderBookingDetails(bookingId);
      } catch (providerError) {
        const statusCode = providerError?.response?.status;
        if (![400, 404, 405].includes(statusCode)) throw providerError;

        // Some deployed API versions do not expose the provider detail route.
        // Fall back to the shared booking detail response when the route is unavailable.
        return getBookingsDetails(bookingId);
      }
    };

    loadBooking()
      .then((response) => {
        if (!active) return;
        const next = extractBooking(response);
        if (next?._id) setBooking(next);
        else setError("Booking details are unavailable.");
      })
      .catch((err) => {
        if (active)
          setError(
            err.response?.data?.message || "Unable to load this booking.",
          );
      });
    return () => {
      active = false;
    };
  }, [bookingId]);

  useEffect(() => {
    const refreshLocation = () =>
      setStoredProviderLocation(getStoredProviderLocation());
    window.addEventListener("provider-location-updated", refreshLocation);
    return () =>
      window.removeEventListener("provider-location-updated", refreshLocation);
  }, []);

  const pricingOption = String(
    booking?.serviceDetails?.pricingOption ||
      booking?.pricingOption ||
      "customer_address",
  )
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
  const needsTravel = pricingOption === "customer_address";
  const status = String(booking?.status || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");
  const paidStatuses = [
    "paid_escrow",
    "paid_escrow_scheduled",
    "enroute_to_pickup",
    "arrived_at_pickup",
    "enroute_to_dropoff",
    "arrived_at_dropoff",
    "in_progress",
  ];
  const paymentState = String(
    booking?.paymentStatus ??
      booking?.payment?.status ??
      booking?.escrowStatus ??
      booking?.escrow?.status ??
      "",
  )
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
  const hasExplicitPaymentState = Boolean(paymentState);
  const paid = hasExplicitPaymentState
    ? [
        "paid",
        "completed",
        "successful",
        "success",
        "released",
        "paid_escrow",
        "paid_escrow_scheduled",
      ].includes(paymentState) ||
      booking?.isPaid === true ||
      booking?.paymentCompleted === true
    : paidStatuses.includes(status);
  const started = status === "in_progress";
  const arrived = ["arrived_at_pickup", "arrived_at_dropoff"].includes(status);
  const customer = typeof booking?.userId === "object" ? booking.userId : {};
  const provider =
    typeof booking?.providerId === "object" ? booking.providerId : {};
  const destinationCandidates = [
    mapPoint(booking?.location),
    mapPoint(booking?.dropoffLocation),
  ].filter(Boolean);
  const destination =
    destinationCandidates.find(hasCoordinates) ||
    destinationCandidates[0] ||
    null;
  const originCandidates = [
    mapPoint(provider?.currentLocation),
    mapPoint(storedProviderLocation),
    mapPoint(user?.currentLocation),
    mapPoint(user?.data?.currentLocation),
  ].filter(Boolean);
  const origin =
    originCandidates.find(hasCoordinates) || originCandidates[0] || null;
  const displayBooking = booking;
  const job = {
    id: bookingId,
    status: displayBooking?.status,
    title:
      displayBooking?.title ||
      displayBooking?.serviceDetails?.serviceName ||
      displayBooking?.serviceType,
    location: displayBooking?.location,
    pickupLocation:
      displayBooking?.pickupLocation || provider?.currentLocation || origin,
    dropoffLocation:
      displayBooking?.dropoffLocation || displayBooking?.location,
    originalData: displayBooking,
  };

  const applyBookingResponse = (response, fallbackStatus) => {
    const nextBooking = extractBooking(response);
    if (nextBooking?._id) {
      setBooking(nextBooking);
    } else if (fallbackStatus) {
      setBooking((current) => ({ ...current, status: fallbackStatus }));
    }
  };

  const handleArrive = async () => {
    if (arrived || started || updatingStatus) return;

    setUpdatingStatus(true);
    setError("");
    try {
      const response = await updateBookingStatus(
        bookingId,
        "arrived_at_pickup",
      );
      applyBookingResponse(response, "arrived_at_pickup");
      setModalOpen(false);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to update arrival status.",
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleStart = async () => {
    setStarting(true);
    setError("");
    try {
      const response = await startJob(bookingId);
      applyBookingResponse(response, "in_progress");
      setModalOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to start service.");
    } finally {
      setStarting(false);
    }
  };

  const handleJourneyAction = () => {
    if (started) {
      setCompletionOpen(true);
    } else if (needsTravel && !arrived) {
      handleArrive();
    } else {
      handleStart();
    }
  };

  const handleCompletionClose = () => {
    setCompletionOpen(false);
    navigate("/dashboard/provider/hire-alert", { replace: true });
  };

  return (
    <ProviderDashboardLayout>
      <div className="mx-auto w-full max-w-[1280px] bg-white p-4 sm:p-6 lg:p-8">
        <button
          onClick={() => navigate("/dashboard/provider/hire-alert")}
          className="mb-5 inline-flex items-center gap-2 text-sm text-[#303030]"
        >
          <ArrowLeft size={18} />
          Back to Jobs
        </button>
        {!booking ? (
          <p className="py-16 text-center text-gray-500">
            Loading service details...
          </p>
        ) : !paid ? (
          <p className="py-16 text-center text-gray-600">
            Payment has not been confirmed for this booking.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-[minmax(330px,0.9fr)_minmax(0,1.1fr)]">
            <section className="min-w-0">
              <h1 className="mb-4 text-xl font-semibold text-[#292929]">
                {booking?.serviceDetails?.serviceName ||
                  booking?.title ||
                  "Service"}
              </h1>
              <div className="rounded-[8px] border border-[#E4E7E5] p-4">
                <div className="space-y-3 border-b border-gray-100 pb-4 text-sm">
                  {needsTravel && (
                    <div className="flex gap-2">
                      <MapPin
                        size={18}
                        className="mt-0.5 shrink-0 text-[#318052]"
                      />
                      <span>
                        <span className="block text-xs text-gray-400">
                          Location
                        </span>
                        {(typeof booking?.location === "string"
                          ? booking.location
                          : booking?.location?.address) || "Customer's address"}
                      </span>
                    </div>
                  )}
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <img
                    src={getAvatar(customer)}
                    alt={customer?.fullName || "Customer"}
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = "/avatar.png";
                    }}
                    className="h-14 w-14 rounded-full object-cover"
                  />
                  <div className="min-w-0">
                    <p className="font-semibold text-[#303030]">
                      {customer?.fullName || "Customer"}
                    </p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button
                    onClick={() =>
                      callContext?.openCall?.({
                        booking,
                        targetOverride: {
                          targetId: customer?._id || booking?.userId,
                          targetType: "buyer",
                          targetName: customer?.fullName || "Customer",
                        },
                      })
                    }
                    className="flex h-10 items-center justify-center gap-2 rounded border border-gray-200 text-sm text-gray-600"
                  >
                    <PhoneCall size={16} />
                    Call
                  </button>
                  <button
                    onClick={() =>
                      navigate(
                        `/dashboard/provider/chat?bookingId=${bookingId}`,
                        { state: { booking, customer } },
                      )
                    }
                    className="flex h-10 items-center justify-center gap-2 rounded border border-gray-200 text-sm text-gray-600"
                  >
                    <MessageCircle size={16} />
                    Message
                  </button>
                </div>
                <p className="mt-5 text-xs text-gray-500">Pickup note</p>
                <p className="mt-1 min-h-12 rounded border border-[#E3EAF0] bg-[#F7FAFC] p-2 text-xs text-gray-500">
                  {booking?.pickupNote || "No additional notes provided."}
                </p>
                <div className="mt-5 flex items-end justify-between gap-3">
                  <div>
                    <p className="text-xs text-gray-600">Service Fee</p>
                    <p className="flex items-center gap-1 font-semibold text-[#303030]">
                      <Banknote size={18} className="text-[#8BC53F]" />₦
                      {Number(
                        booking?.agreedPrice ??
                          booking?.serviceDetails?.price ??
                          0,
                      ).toLocaleString()}
                    </p>
                  </div>
                  {!started && (
                    <button
                      onClick={handleJourneyAction}
                      disabled={starting || updatingStatus}
                      className="rounded bg-[#337E52] px-4 py-2.5 text-sm font-medium text-white disabled:cursor-wait disabled:opacity-60"
                    >
                      {starting
                        ? "Starting service..."
                        : updatingStatus
                          ? "Updating..."
                          : arrived || !needsTravel
                            ? "Start Service"
                            : "Arrived at Destination"}
                    </button>
                  )}
                  {started && (
                    <button
                      onClick={handleJourneyAction}
                      className="rounded bg-[#337E52] px-4 py-2.5 text-sm font-medium text-white"
                    >
                      Mark Service Complete
                    </button>
                  )}
                </div>
                {/* <button
                  onClick={() => setModalOpen(true)}
                  className="mt-5 w-full rounded bg-[#337E52] px-4 py-2.5 text-sm font-medium text-white"
                >
                  View Service Details
                </button> */}
              </div>
            </section>
            {needsTravel && (
              <div className="h-[420px] min-h-[340px] overflow-hidden rounded-[8px] bg-[#F5F7F6] md:h-[620px] md:min-h-[520px]">
                {origin && destination ? (
                  <DeliveryMap
                    pickup={origin}
                    dropoff={destination}
                    bookingDetails={booking}
                    routeColor="#1685F7"
                  />
                ) : (
                  <div className="flex h-full min-h-[340px] items-center justify-center p-5 text-center text-sm text-gray-500">
                    Route unavailable until both locations have coordinates.
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        {error && (
          <p role="alert" className="mt-4 text-sm text-red-600">
            {error}
          </p>
        )}
      </div>
      {booking && paid && modalOpen && (
        <JobDetailsModal
          isOpen
          onClose={() => setModalOpen(false)}
          job={job}
          onShowNavigation={handleArrive}
          onArrive={handleJourneyAction}
          onStartService={handleStart}
          onMarkAsCompleted={() => setCompletionOpen(true)}
          onCancel={() => {
            setModalOpen(false);
            setCancelOpen(true);
          }}
          onMessageCustomer={() =>
            navigate(`/dashboard/provider/chat?bookingId=${bookingId}`, {
              state: { booking, customer },
            })
          }
        />
      )}
      <ProviderCancellationModal
        isOpen={cancelOpen}
        onClose={() => setCancelOpen(false)}
        onSubmit={(reason) => cancelProviderBooking(bookingId, reason)}
        onComplete={() =>
          navigate("/dashboard/provider/hire-alert", { replace: true })
        }
      />
      <MarkAsCompleted
        isOpen={completionOpen}
        onClose={handleCompletionClose}
        job={job}
      />
      {starting && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 text-white">
          Starting service...
        </div>
      )}
    </ProviderDashboardLayout>
  );
}
