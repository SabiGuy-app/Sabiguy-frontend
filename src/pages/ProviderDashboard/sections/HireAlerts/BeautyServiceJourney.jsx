import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Banknote, MapPin, MessageCircle, PhoneCall } from "lucide-react";
import ProviderDashboardLayout from "../../../../components/layouts/ProviderDashboardLayout";
import DeliveryMap from "../../../../components/dashboard/Map";
import { useCallContext } from "../../../../components/shared/CallContext";
import { getBookingsDetails, startJob } from "../../../../api/bookings";
import JobDetailsModal from "./JobDetails";
import { useAuthStore } from "../../../../stores/auth.store";
import { cancelBooking as cancelProviderBooking } from "../../../../api/provider";
import ProviderCancellationModal from "../../../../components/provider-dashboard/ProviderCancellationModal";

const extractBooking = (response) =>
  response?.data?.booking || response?.data?.data?.booking || response?.data?.data || response?.data || response?.booking || response;

const mapPoint = (location) => {
  const coordinates = location?.coordinates?.coordinates || location?.coordinates;
  if (!Array.isArray(coordinates) || coordinates.length < 2) return null;
  const [longitude, latitude] = coordinates.map(Number);
  return Number.isFinite(latitude) && Number.isFinite(longitude)
    ? { latitude, longitude, address: location?.address || "" }
    : null;
};

export default function BeautyServiceJourney() {
  const { bookingId } = useParams();
  const route = useLocation();
  const navigate = useNavigate();
  const callContext = useCallContext();
  const user = useAuthStore((state) => state.user);
  const [booking, setBooking] = useState(route.state?.job?.originalData || route.state?.booking || null);
  const [stage, setStage] = useState(() => sessionStorage.getItem(`beauty-journey-${bookingId}`) || "enroute");
  const [modalOpen, setModalOpen] = useState(false);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState("");
  const [cancelOpen, setCancelOpen] = useState(false);

  useEffect(() => {
    let active = true;
    getBookingsDetails(bookingId)
      .then((response) => {
        if (!active) return;
        const next = extractBooking(response);
        if (next?._id) setBooking(next);
        else setError("Booking details are unavailable.");
      })
      .catch((err) => { if (active) setError(err.response?.data?.message || "Unable to load this booking."); });
    return () => { active = false; };
  }, [bookingId]);

  const moveTo = (next) => {
    sessionStorage.setItem(`beauty-journey-${bookingId}`, next);
    setStage(next);
  };
  const pricingOption = booking?.serviceDetails?.pricingOption;
  const needsTravel = pricingOption === "customer_address";
  const status = booking?.status;
  const paid = ["paid_escrow", "paid_escrow_scheduled", "enroute_to_pickup", "arrived_at_pickup", "in_progress"].includes(status);
  const started = status === "in_progress";
  const loadedBookingId = booking?._id;
  const customer = typeof booking?.userId === "object" ? booking.userId : {};
  const provider = typeof booking?.providerId === "object" ? booking.providerId : {};
  const destination = mapPoint(booking?.location);
  const origin = mapPoint(provider?.currentLocation) || mapPoint(user?.currentLocation);
  const displayBooking = stage === "arrived" && !started ? { ...booking, status: "arrived_at_pickup" } : booking;
  const job = { id: bookingId, status: displayBooking?.status, title: booking?.title, originalData: displayBooking };

  const handleStart = async () => {
    setStarting(true);
    setError("");
    try {
      const response = await startJob(bookingId);
      const nextBooking = extractBooking(response);
      if (nextBooking?._id) setBooking(nextBooking);
      sessionStorage.removeItem(`beauty-journey-${bookingId}`);
      navigate("/dashboard/provider/hire-alert", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Unable to start service.");
    } finally {
      setStarting(false);
    }
  };

  useEffect(() => {
    if (loadedBookingId && !started) setModalOpen(true);
  }, [loadedBookingId, started]);

  useEffect(() => {
    if (stage === "arrived" && !started) setModalOpen(true);
  }, [stage, started]);

  return (
    <ProviderDashboardLayout>
      <div className="mx-auto w-full max-w-[1280px] bg-white p-4 sm:p-6 lg:p-8">
        <button onClick={() => navigate("/dashboard/provider/hire-alert")} className="mb-5 inline-flex items-center gap-2 text-sm text-[#303030]"><ArrowLeft size={18} />Back to Jobs</button>
        {!booking ? <p className="py-16 text-center text-gray-500">Loading service details...</p> : !paid ? (
          <p className="py-16 text-center text-gray-600">Payment has not been confirmed for this booking.</p>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[minmax(330px,0.9fr)_minmax(0,1.1fr)]">
            <section className="min-w-0">
              <h1 className="mb-4 text-xl font-semibold text-[#292929]">{booking?.serviceDetails?.serviceName || booking?.title || "Service"}</h1>
              <div className="rounded-[8px] border border-[#E4E7E5] p-4">
                <div className="space-y-3 border-b border-gray-100 pb-4 text-sm">
                  <div className="flex gap-2"><MapPin size={18} className="mt-0.5 shrink-0 text-[#318052]" /><span><span className="block text-xs text-gray-400">From</span>{origin?.address || "Provider's current location"}</span></div>
                  <div className="flex gap-2"><MapPin size={18} className="mt-0.5 shrink-0 text-[#318052]" /><span><span className="block text-xs text-gray-400">To</span>{booking?.location?.address || "Customer's address"}</span></div>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <img src={customer?.profilePicture || "/avatar.png"} alt="" className="h-14 w-14 rounded-full object-cover" />
                  <div className="min-w-0"><p className="font-semibold text-[#303030]">{customer?.fullName || "Customer"}</p><p className="truncate text-xs text-gray-500">{booking?.location?.address || ""}</p></div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button onClick={() => callContext?.openCall?.({ booking, targetOverride: { targetId: customer?._id || booking?.userId, targetType: "buyer", targetName: customer?.fullName || "Customer" } })} className="flex h-10 items-center justify-center gap-2 rounded border border-gray-200 text-sm text-gray-600"><PhoneCall size={16} />Call</button>
                  <button onClick={() => navigate(`/dashboard/provider/chat?bookingId=${bookingId}`, { state: { booking, customer } })} className="flex h-10 items-center justify-center gap-2 rounded border border-gray-200 text-sm text-gray-600"><MessageCircle size={16} />Message</button>
                </div>
                <p className="mt-5 text-xs text-gray-500">Pickup note</p>
                <p className="mt-1 min-h-12 rounded border border-[#E3EAF0] bg-[#F7FAFC] p-2 text-xs text-gray-500">{booking?.pickupNote || "No additional notes provided."}</p>
                <div className="mt-5 flex items-end justify-between gap-3">
                  <div><p className="text-xs text-gray-600">Fare</p><p className="flex items-center gap-1 font-semibold text-[#303030]"><Banknote size={18} className="text-[#8BC53F]" />₦{Number(booking?.agreedPrice ?? booking?.serviceDetails?.price ?? 0).toLocaleString()}</p></div>
                  {needsTravel && stage !== "arrived" && !started && <button onClick={() => { moveTo("arrived"); setModalOpen(true); }} className="rounded bg-[#337E52] px-4 py-2.5 text-sm font-medium text-white">Arrived at Destination</button>}
                </div>
                {!started && <button onClick={() => setModalOpen(true)} className="mt-5 w-full rounded bg-[#337E52] px-4 py-2.5 text-sm font-medium text-white">View Service Details</button>}
              </div>
            </section>
            {needsTravel && <div className="min-h-[340px] overflow-hidden rounded-[8px] bg-[#F5F7F6] lg:min-h-[520px]">
              {origin && destination ? <DeliveryMap pickup={origin} dropoff={destination} bookingDetails={booking} routeColor="#1685F7" /> : <div className="flex h-full min-h-[340px] items-center justify-center p-5 text-center text-sm text-gray-500">Route unavailable until both locations have coordinates.</div>}
            </div>}
          </div>
        )}
        {error && <p role="alert" className="mt-4 text-sm text-red-600">{error}</p>}
      </div>
      {booking && paid && !started && modalOpen && <JobDetailsModal isOpen onClose={() => setModalOpen(false)} job={job} onShowNavigation={() => setModalOpen(false)} onStartService={handleStart} onCancel={() => { setModalOpen(false); setCancelOpen(true); }} onMessageCustomer={() => navigate(`/dashboard/provider/chat?bookingId=${bookingId}`, { state: { booking, customer } })} />}
      <ProviderCancellationModal isOpen={cancelOpen} onClose={() => setCancelOpen(false)} onSubmit={(reason) => cancelProviderBooking(bookingId, reason)} onComplete={() => navigate("/dashboard/provider/hire-alert", { replace: true })} />
      {starting && <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 text-white">Starting service...</div>}
    </ProviderDashboardLayout>
  );
}
