import React, { useState, useEffect, useRef } from "react";
import {
  Phone,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  MapPin,
  Star,
  BadgeCheck,
} from "lucide-react";
import DeliveryMap from "../../../../components/dashboard/Map";
import Navbar from "../../../../components/dashboard/Navbar";
import { useNavigate } from "react-router-dom";
import useBookingStore from "../../../../stores/booking.store";
import { getBookingsDetails, cancelBooking } from "../../../../api/bookings";
import CancelModal from "../../../../components/CancelModal";
import { toast } from "react-hot-toast";

const STEPS_COMPLETED_BY_STATUS = {
  in_progress: [1],
  arrived_at_pickup: [1, 2],
  enroute_to_dropoff: [1, 2, 3],
  arrived_at_dropoff: [1, 2, 3, 4],
  completed: [1, 2, 3, 4, 5],
};

const STATUS_LABELS = {
  in_progress: "Rider is on the way",
  arrived_at_pickup: "Rider arrived at pickup",
  enroute_to_dropoff: "En route to you",
  arrived_at_dropoff: "Rider arrived at destination",
  completed: "Delivery completed!",
};

const POLL_INTERVAL_MS = 6000;

export default function TrackRider() {
  const [isDeliveryStatusExpanded, setIsDeliveryStatusExpanded] = useState(true);
  const [bookingStatus, setBookingStatus] = useState("in_progress");
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [riderLocation, setRiderLocation] = useState(null); // Rider/provider location

  const navigate = useNavigate();
  const wsRef = useRef(null); // WebSocket reference

  const booking = useBookingStore((state) => state.booking);
  const bookingDetails = booking?.data?.booking || {};
  const selectedProviderId = useBookingStore((state) => state.selectedProviderId);
  const providerDetails =
    booking?.data?.providers?.find((p) => p.id === selectedProviderId) ||
    booking?.data?.providers?.[0] ||
    {};

  const bookingId = bookingDetails?._id;

  const acceptedProviderId = bookingDetails?.providerId?._id || providerDetails?._id || selectedProviderId;
  const providerDistanceInfo = bookingDetails?.providerDistances?.find(
    (p) => p.providerId === acceptedProviderId
  );
  const providerETA = providerDistanceInfo?.providerETAMinutes;

  const arrivalText =
    providerETA != null
      ? `Arrival in ${providerETA} mins`
      : "Arrival in — mins";

  // Extract pickup and dropoff coordinates (GeoJSON -> coordinates array)
  const pickupCoords = {
    latitude: bookingDetails?.pickupLocation?.coordinates?.coordinates?.[1],
    longitude: bookingDetails?.pickupLocation?.coordinates?.coordinates?.[0],
  };

  const dropoffCoords = {
    latitude: bookingDetails?.dropoffLocation?.coordinates?.coordinates?.[1],
    longitude: bookingDetails?.dropoffLocation?.coordinates?.coordinates?.[0],
  };

  // Provider current location (used as initial map focus before WS updates)
  const providerCoords = {
    latitude: providerDetails?.currentLocation?.coordinates?.[1],
    longitude: providerDetails?.currentLocation?.coordinates?.[0],
  };

  useEffect(() => {
    const stored = bookingDetails?.status;
    if (stored && STEPS_COMPLETED_BY_STATUS[stored]) {
      setBookingStatus(stored);
    }
  }, [bookingDetails?.status]);

  const intervalRef = useRef(null);

  // Polling for booking status updates
  useEffect(() => {
    if (!bookingId) return;

    const poll = async () => {
      try {
        const res = await getBookingsDetails(bookingId);
        console.log(res);
        const latestStatus = res?.data?.booking?.status || res?.data?.status;
        if (latestStatus && STEPS_COMPLETED_BY_STATUS[latestStatus]) {
          setBookingStatus(latestStatus);
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    };

    poll();
    intervalRef.current = setInterval(poll, POLL_INTERVAL_MS);
    return () => clearInterval(intervalRef.current);
  }, [bookingId]);

  // Set initial rider/provider location from booking data (before WS updates)
  useEffect(() => {
    if (
      providerCoords?.latitude !== undefined &&
      providerCoords?.longitude !== undefined
    ) {
      setRiderLocation((prev) => prev || providerCoords);
    }
  }, [providerCoords?.latitude, providerCoords?.longitude]);

  // WebSocket for real-time rider location updates
  useEffect(() => {
    if (!bookingId) return;

    // Replace with your actual WebSocket URL
    const wsUrl = `${import.meta.env.VITE_WS_URL}/tracking/${bookingId}`;
    wsRef.current = new WebSocket(wsUrl);

    wsRef.current.onopen = () => {
      console.log("WebSocket connected for tracking");
    };

    wsRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("Rider location update:", data);

        // Update rider location
        // Adjust based on your WebSocket payload structure
        if (data.location) {
          setRiderLocation({
            latitude: data.location.coordinates[1],
            longitude: data.location.coordinates[0],
            bearing: data.bearing || 0, // Direction rider is facing
          });
        }

        // Optionally update ETA or status
        if (data.status) {
          setBookingStatus(data.status);
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

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [bookingId]);

  useEffect(() => {
    if (bookingStatus === "completed") {
      clearInterval(intervalRef.current);
      if (wsRef.current) {
        wsRef.current.close();
      }
    }
  }, [bookingStatus]);

  const completedStepIds = STEPS_COMPLETED_BY_STATUS[bookingStatus] || [1];
  const isFullyComplete = bookingStatus === "completed";

  const pickupAddress = bookingDetails?.pickupLocation?.address || "—";
  const dropoffAddress = bookingDetails?.dropoffLocation?.address || "—";
  const fareDisplay = providerDetails?.pricing?.riderPays ?? bookingDetails?.calculatedPrice ?? bookingDetails?.agreedPrice ?? 0;

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);

  const deliverySteps = [
    { id: 1, title: "En route to pickup", subtitle: "On the way to pickup" },
    { id: 2, title: "Arrived at pickup location", subtitle: "At pickup point" },
    {
      id: 3,
      title: "En route to delivery",
      subtitle: "Leaving for dropoff location",
    },
    {
      id: 4,
      title: "Arrived at delivery location",
      subtitle: "At delivery location",
    },
    { id: 5, title: "Delivery completed", subtitle: "Package delivered" },
  ];

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

  const handleMessageProvider = () => {
    if (!bookingId) return;
    navigate(`/dashboard/chat?bookingId=${bookingId}`);
  };

  return (
    <>
      <Navbar />

      <CancelModal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        onConfirm={handleCancel}
        loading={cancelLoading}
      />
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:grid md:grid-cols-2 md:gap-10 space-y-8">
        <div>
          <h1 className="text-[28px] font-semibold text-[#231F20] mb-1">
            {isFullyComplete ? "Delivery Completed 🎉" : arrivalText}
          </h1>
          <p className="text-sm text-[#005823] font-medium mb-4">
            {STATUS_LABELS[bookingStatus]}
          </p>

          <div className="mb-6 space-y-3 border-2 border-[#231F201A] px-5 py-3 rounded-[16px]">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-[#E6EFE9] rounded-full flex items-center justify-center flex-shrink-0">
                <div className="w-3 h-3 bg-[#005823] rounded-full" />
              </div>
              <div>
                <span className="text-[#231F2080] text-[16px]">Pickup</span>
                <p className="text-[#231F20BF] text-[20px]">{pickupAddress}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-[#E6EFE9] rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin className="w-3 h-3 text-[#005823]" />
              </div>
              <div>
                <span className="text-[#231F2080] text-[16px]">Dropoff</span>
                <p className="text-[#231F20BF] text-[20px]">{dropoffAddress}</p>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center gap-3 mb-4">
              <img
                src={providerDetails?.profilePicture}
                alt={providerDetails?.fullName || "Provider"}
                className="w-14 h-14 rounded-full object-cover"
              />
              <div className="flex-grow">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-semibold text-[20px] text-[#231F20]">
                    {providerDetails?.fullName || "Provider"}
                  </span>
                  <span className="text-[#8BC53F]">
                    <BadgeCheck className="w-[20px] h-[20px]" />
                  </span>
                </div>
                <div className="text-[#231F20BF] text-[16px] mb-1">
                  <p>
                    {providerDetails?.job?.[0]?.title?.replace(/_/g, " ") ||
                      bookingDetails?.subCategory?.replace(/_/g, " ") ||
                      "—"}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium text-gray-900">
                    {providerDetails?.rating?.average > 0
                      ? providerDetails.rating.average.toFixed(1)
                      : "New"}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({providerDetails?.rating?.count ?? 0} reviews)
                  </span>
                </div>
              </div>
            </div>

            <div className="md:grid md:grid-cols-3 gap-6">
              <button className="md:flex-1 flex items-center w-full justify-center gap-2 py-2.5 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Phone className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Call</span>
              </button>
              <button
                onClick={handleMessageProvider}
                className="md:flex-1 w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Message</span>
              </button>
            </div>
          </div>

          <h3 className="text-[14px] font-semibold text-[#231F20BF] mb-2">
            Pickup note
          </h3>
          <p className="bg-[#007BFF08] rounded-lg text-[#231F2080] border border-[#231F201A] p-4 mb-4">
            {bookingDetails?.pickupNote || "No note provided."}
          </p>

          <div className="mb-4 grid grid-cols-2 md:grid-cols-3 gap-4 border-2 border-[#231F201A] px-5 py-3 rounded-[16px]">
            <div>
              <h3 className="text-[14px] font-semibold text-[#231F20BF] mb-1">Fare</h3>
              <span className="text-[18px] font-bold text-[#231F20]">
                {fareDisplay != null ? formatCurrency(fareDisplay) : "—"}
              </span>
            </div>
            <div>
              <h3 className="text-[14px] font-semibold text-[#231F20BF] mb-1">Provider ETA</h3>
              <span className="text-[18px] font-bold text-[#231F20]">
                {providerETA != null ? `${providerETA} mins` : "—"}
              </span>
            </div>
            <div>
              <h3 className="text-[14px] font-semibold text-[#231F20BF] mb-1">Duration</h3>
              <span className="text-[18px] font-bold text-[#231F20]">
                {bookingDetails?.bookingDuration?.value 
                  ? `${bookingDetails.bookingDuration.value} ${bookingDetails.bookingDuration.unit}` 
                  : bookingDetails?.estimatedDuration?.value
                  ? `${bookingDetails.estimatedDuration.value} ${bookingDetails.estimatedDuration.unit}`
                  : "—"}
              </span>
            </div>
          </div>

          {/* Description */}
          {bookingDetails?.description && (
            <div className="mb-4">
              <h3 className="text-[16px] font-semibold text-[#231F20] mb-1">Description</h3>
              <p className="bg-[#007BFF08] rounded-lg text-[#231F20BF] border border-[#231F201A] p-4">
                {bookingDetails.description}
              </p>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <button
              onClick={() => setIsDeliveryStatusExpanded(!isDeliveryStatusExpanded)}
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
                            <div className="w-2 h-2 bg-[#908E8F] rounded-full" />
                          )}
                        </div>
                        {index < deliverySteps.length - 1 && (
                          <div
                            className={`w-0.5 h-12 ${
                              isCompleted ? "bg-green-500" : "bg-gray-200"
                            }`}
                          />
                        )}
                      </div>
                      <div className="pb-12 last:pb-0">
                        <div
                          className={`text-[16px] font-medium ${
                            isCompleted ? "text-[#005823]" : "text-[#231F20BF]"
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

        {/* Replace the image with the map */}
        <div className="h-[660px]">
          <DeliveryMap
            pickup={pickupCoords}
            dropoff={dropoffCoords}
            riderLocation={riderLocation}
          />
        </div>
      </div>
    </>
  );
}
