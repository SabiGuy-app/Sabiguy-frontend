import React, { useState } from "react";
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
import { startJob, cancelBooking } from "../../../../api/bookings";
import ProviderNavbar from "../../../../components/provider-dashboard/Navbar";
import CancelModal from "../../../../components/CancelModal";

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
  const [riderLocation, setRiderLocation] = useState(null);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

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

  const customer = alert?.originalData?.userId || {};

  return (
    <>
      <ProviderNavbar />
      <CancelModal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        onConfirm={handleCancel}
        loading={cancelLoading}
      />

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
              {/* <button className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Phone className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Call</span>
              </button> */}
              {/* <button className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <MessageCircle className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  Message
                </span>
              </button> */}
              <button
                onClick={() => setCancelModalOpen(true)}
                className="text-[#E90000] font-medium text-[16px] px-3 py-3 rounded-[10px] hover:text-red-600 transition-colors hover:bg-red-200"
              >
                Cancel Request
              </button>
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
                ₦{Number(alert?.price || 0).toLocaleString()}
              </span>
            </div>
          </div>
          {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
          <button
            onClick={handleStartNavigation}
            disabled={starting}
            className="px-4 py-2 rounded-md bg-[#005823] text-white disabled:opacity-50 disabled:cursor-not-allowed"
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
    </>
  );
}
