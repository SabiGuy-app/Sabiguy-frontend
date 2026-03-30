import React, { useEffect, useRef, useState } from "react";
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
import { updateBookingStatus, markAsComplete } from "../../../../api/bookings";
import ProviderNavbar from "../../../../components/provider-dashboard/Navbar";

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

  const booking = useBookingStore((state) => state.booking);
  const bookingDetails = booking?.data?.booking || {};
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

  const estimatedDuration =
    alert?.originalData?.estimatedDuration || bookingDetails?.estimatedDuration;
  const arrivalText =
    estimatedDuration?.value && estimatedDuration?.unit
      ? `Arrival in ${estimatedDuration.value} ${estimatedDuration.unit}`
      : "Tracking delivery";

  useEffect(() => {
    if (
      providerCoords?.latitude !== undefined &&
      providerCoords?.longitude !== undefined
    ) {
      setRiderLocation((prev) => prev || providerCoords);
    }
  }, [providerCoords?.latitude, providerCoords?.longitude]);

  useEffect(() => {
    if (!bookingId) return;

    const wsUrl = `${import.meta.env.VITE_WS_URL}/tracking/${bookingId}`;
    wsRef.current = new WebSocket(wsUrl);

    wsRef.current.onopen = () => {
      console.log("WebSocket connected for provider tracking");
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

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [bookingId]);

  return (
    <>
      <ProviderNavbar />
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 grid grid-cols-2 gap-10">
        <div>
          <h1 className="text-[28px] font-semibold text-[#231F20] mb-4">
            {arrivalText}
          </h1>

          <div className="mb-6 space-y-3 border-2 border-[#231F201A] px-5 py-3 rounded-[16px]">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-[#E6EFE9] rounded-full flex items-center justify-center flex-shrink-0">
                <div className="w-3 h-3 bg-[#005823] rounded-full"></div>
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
                src={
                  user?.data?.profilePicture ||
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop"
                }
                alt={user?.data?.fullName || "Provider"}
                className="w-14 h-14 rounded-full object-cover"
              />
              <div className="flex-grow">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-semibold text-[20px] text-[#231F20]">
                    {user?.data?.fullName || "Provider"}
                  </span>
                  <span className="flex items-center gap-1 px-1.5 py-0.5 bg-green-50 text-[#8BC53F] text-xs font-medium rounded">
                    <Shield className="w-3 h-3" /> Verified
                  </span>
                </div>
                <div className="text-[#231F20BF] text-[16px] mb-1">
                  <p>
                    {user?.data?.services?.[0]?.title?.replace(/_/g, " ") ||
                      bookingDetails?.subCategory?.replace(/_/g, " ") ||
                      "N/A"}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium text-gray-900">
                    {user?.data?.rating?.average > 0
                      ? user.data.rating.average.toFixed(1)
                      : "New"}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({user?.data?.rating?.count ?? 0} reviews)
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <button className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Phone className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Call</span>
              </button>
              <button
                onClick={handleMessageCustomer}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  Message
                </span>
              </button>
             
            </div>
          </div>

          <h3 className="text-[14px] font-semibold text-[#231F20BF] mb-2">
            Pickup note
          </h3>
          <p className="bg-[#007BFF08] rounded-lg text-[#231F2080] border border-[#231F201A] p-4 mb-4">
            {bookingDetails?.pickupNote || "No pickup note provided."}
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
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isCompleted
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
                          className={`text-[16px] font-medium ${isCompleted ? "text-[#005823]" : "text-[#231F20BF]"
                            }`}
                        >
                          {step.title}
                        </div>
                        <div
                          className={`text-[12px] ${isCompleted ? "text-gray-500" : "text-[#231F20BF]"
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

