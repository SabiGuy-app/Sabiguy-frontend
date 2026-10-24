import { BeautyBookingCard } from "../../../../other-services/dashboard/components/booking/BeautyRequest";
import { normalizeBeautyBooking } from "../../../../stores/beautyBooking.store";
import DashboardLayout from "../../../../components/layouts/DashboardLayout";
import InputField from "../../../../components/InputField";
import LocationAutocomplete from "../../../../components/LocationAutocomplete";
import { useState, useEffect } from "react";
import { Bike, Car } from "lucide-react";
import Button from "../../../../components/button";
import RequestCard from "../../../../components/dashboard/RequestsCard";
import ServiceDetailsModal from "../ServiceDetailsModal";
import { useNavigate, useLocation } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  bookingPost,
  getUserBookings,
  getBookingsDetails,
  searchServiceProviders,
} from "../../../../api/bookings";
import { allowSystem } from "../../../../api/bookings";
import { getPromoEligibility } from "../../../../api/payment";
import useBookingStore from "../../../../stores/booking.store";
import BookingsTour from "../../../../components/tour/BookingsTour";
import { BEAUTY_PROVIDER_SEARCH_NAMES } from "../../../../constants/beautyServices";

const vehicleOptions = (service) => {
  const isRide = service === "book a ride";
  return [
    {
      value: "Bike",
      label: isRide ? "Bike Rider" : "Bike Delivery",
      icon: <Bike color="black" size={30} />,
      capacity: 2,
      description: isRide ? "Quick rides for one" : "Best for small packages",
    },
    {
      value: "Car",
      label: isRide ? "Car Rider" : "Car Delivery",
      icon: <Car color="black" size={30} />,
      capacity: 4,
      description: isRide
        ? "Comfortable rides for groups"
        : "Medium sized delivery",
    },
  ];
};

const isBeautyBooking = (booking) =>
  String(booking?.serviceType || "")
    .trim()
    .toLowerCase()
    .replace(/-/g, "_") === "beauty_personal_care";

const getBookingTimestamp = (booking) => {
  const value =
    booking?.createdAt ||
    booking?.created_at ||
    booking?.requestedAt ||
    booking?.requestCreatedAt ||
    booking?.updatedAt ||
    booking?.date ||
    booking?.scheduleDate;
  const timestamp = Date.parse(value || "");
  return Number.isFinite(timestamp) ? timestamp : 0;
};

const sortBookingsNewestFirst = (bookings) =>
  bookings
    .map((booking, index) => ({ booking, index }))
    .sort((a, b) => {
      const timestampDifference =
        getBookingTimestamp(b.booking) - getBookingTimestamp(a.booking);
      return timestampDifference || a.index - b.index;
    })
    .map(({ booking }) => booking);

export default function Bookings() {
  const locationForTab = useLocation();
  const [activeTab, setActiveTab] = useState(() =>
    new URLSearchParams(locationForTab.search).get("tab") === "requests"
      ? "requests"
      : "request",
  );
  useEffect(() => {
    if (new URLSearchParams(locationForTab.search).get("tab") === "requests")
      setActiveTab("requests");
  }, [locationForTab.search]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [pickupMode, setPickupMode] = useState("manual");
  const [beautyLocationLoading, setBeautyLocationLoading] = useState(false);
  const [beautyLocationError, setBeautyLocationError] = useState("");
  const [userBookings, setUserBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [bookingsError, setBookingsError] = useState("");
  const [promoEligibility, setPromoEligibility] = useState(null);
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState("");
  const setBooking = useBookingStore((state) => state.setBooking);
  const navigate = useNavigate();
  const [customBeautyService, setCustomBeautyService] = useState("");

  useEffect(() => {
    if (activeTab === "requests") {
      const fetchBookings = async () => {
        setBookingsLoading(true);
        setBookingsError("");
        try {
          const data = await getUserBookings();
          const bookings = data?.data || data || [];
          setUserBookings(Array.isArray(bookings) ? bookings : []);
        } catch (err) {
          console.error("Failed to fetch bookings:", err);
          setBookingsError("Failed to load your bookings. Please try again.");
        } finally {
          setBookingsLoading(false);
        }
      };
      fetchBookings();
    }
  }, [activeTab]);

  useEffect(() => {
    const fetchPromoEligibility = async () => {
      setPromoLoading(true);
      setPromoError("");

      try {
        const res = await getPromoEligibility();
        setPromoEligibility(res?.data?.promo || res?.promo || null);
      } catch (err) {
        console.error("Failed to fetch promo eligibility:", err);
        setPromoError("Unable to load discount eligibility right now.");
      } finally {
        setPromoLoading(false);
      }
    };

    fetchPromoEligibility();
  }, []);

  const location = useLocation();
  const preselectedService =
    new URLSearchParams(location.search).get("service") ?? "";
  const currentLocationValue =
    localStorage.getItem("currentLocationAddress") || "";
  const hasCurrentLocation = !!currentLocationValue;

  const geocodeAddress = async (address) => {
    if (!address || !window.google?.maps?.Geocoder) return null;

    const geocoder = new window.google.maps.Geocoder();
    const result = await new Promise((resolve, reject) => {
      geocoder.geocode(
        { address, componentRestrictions: { country: "NG" } },
        (results, status) => {
          if (status === "OK" && results?.[0]) {
            resolve(results[0]);
          } else {
            reject(new Error(`Geocoding failed: ${status}`));
          }
        },
      );
    });

    const location = result?.geometry?.location;
    return {
      latitude: typeof location?.lat === "function" ? location.lat() : "",
      longitude: typeof location?.lng === "function" ? location.lng() : "",
    };
  };

  const formik = useFormik({
    initialValues: {
      jobTitle: "",
      service: preselectedService,
      pickupAddress: "",
      pickupLatitude: "",
      pickupLongitude: "",
      dropoffAddress: "",
      dropoffLatitude: "",
      dropoffLongitude: "",
      serviceType: "",
      scheduleDate: "",
      scheduleTime: "",
      modeOfDelivery: "",
      autoAcceptNearest: false,
      applyRideDiscount: false,
    },
    validationSchema: Yup.object().shape({
      jobTitle: Yup.string().required("Work category is required"),
      service: Yup.string().required("Sub-category is required"),
      pickupAddress: Yup.string().required("Pickup location is required"),
      pickupLatitude: Yup.string().when("jobTitle", {
        is: "beauty_personal_care",
        then: (schema) =>
          schema.required("Choose a location from the suggestions."),
        otherwise: (schema) => schema.notRequired(),
      }),
      pickupLongitude: Yup.string().when("jobTitle", {
        is: "beauty_personal_care",
        then: (schema) =>
          schema.required("Choose a location from the suggestions."),
        otherwise: (schema) => schema.notRequired(),
      }),
      dropoffAddress: Yup.string().when("jobTitle", {
        is: "transport",
        then: (schema) => schema.required("Dropoff location is required"),
        otherwise: (schema) => schema.notRequired(),
      }),
      serviceType: Yup.string().when("jobTitle", {
        is: "transport",
        then: (schema) => schema.required("Service type is required"),
        otherwise: (schema) => schema.notRequired(),
      }),
      modeOfDelivery: Yup.string().when("jobTitle", {
        is: "transport",
        then: (schema) => schema.required("Please choose a vehicle"),
        otherwise: (schema) => schema.notRequired(),
      }),
      scheduleDate: Yup.date().when(["jobTitle", "serviceType"], {
        is: (jobTitle, serviceType) =>
          jobTitle === "transport" && serviceType === "scheduled",
        then: (schema) => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return schema
            .required("Schedule date is required")
            .min(today, "Date must be today or in the future");
        },
        otherwise: (schema) => schema.notRequired(),
      }),
      scheduleTime: Yup.string().when(["jobTitle", "serviceType"], {
        is: (jobTitle, serviceType) =>
          jobTitle === "transport" && serviceType === "scheduled",
        then: (schema) => schema.required("Schedule time is required"),
        otherwise: (schema) => schema.notRequired(),
      }),
    }),
    onSubmit: async (values) => {
      console.log("Submitting booking with values:", values);
      setSuccessMessage("");
      setErrorMessage("");

      setLoading(true);

      try {
        if (values.jobTitle === "beauty_personal_care") {
          const finalServiceName =
            values.service === "Other"
              ? customBeautyService.trim()
              : values.service;

          const searchLocation = {
            latitude: Number(values.pickupLatitude),
            longitude: Number(values.pickupLongitude),
          };
          const searchResponse = await searchServiceProviders({
            location: searchLocation,
            search: finalServiceName,
          });

          navigate(
            `/dashboard/categories/beauty-personal-care?service=${encodeURIComponent(finalServiceName)}`,
            {
              state: {
                beautySearch: {
                  location: searchLocation,
                  address: values.pickupAddress,
                  serviceName: finalServiceName,
                  response: searchResponse,
                },
              },
            },
          );
          return;
        }

        const pickupCoords =
          values.pickupLatitude && values.pickupLongitude
            ? {
                address: values.pickupAddress,
                latitude: values.pickupLatitude,
                longitude: values.pickupLongitude,
              }
            : await geocodeAddress(values.pickupAddress);

        const dropoffCoords =
          values.dropoffLatitude && values.dropoffLongitude
            ? {
                address: values.dropoffAddress,
                latitude: values.dropoffLatitude,
                longitude: values.dropoffLongitude,
              }
            : await geocodeAddress(values.dropoffAddress);

        const payload = {
          serviceType: values.jobTitle,
          subCategory: values.service,
          pickupAddress: values.pickupAddress,
          pickupLatitude:
            pickupCoords?.latitude || values.pickupLatitude || undefined,
          pickupLongitude:
            pickupCoords?.longitude || values.pickupLongitude || undefined,
          dropoffAddress: values.dropoffAddress,
          dropoffLatitude:
            dropoffCoords?.latitude || values.dropoffLatitude || undefined,
          dropoffLongitude:
            dropoffCoords?.longitude || values.dropoffLongitude || undefined,
          scheduleType: values.serviceType,
          modeOfDelivery: values.modeOfDelivery,
          applyRideDiscount: values.applyRideDiscount,
          scheduleDate:
            values.serviceType === "scheduled"
              ? new Date(
                  `${values.scheduleDate}T${values.scheduleTime}:00`,
                ).toISOString()
              : undefined,
        };

        const res = await bookingPost(payload);

        try {
          await allowSystem(false);
        } catch (allowErr) {
          console.error("Error resetting allowSystem:", allowErr);
        }

        setBooking(res);
        setSuccessMessage(res?.message || "Booking created successfully!");
        formik.resetForm();

        if (values.autoAcceptNearest) {
          navigate("/dashboard/provider/searching");
        } else {
          navigate("/bookings/availableriders");
        }
      } catch (error) {
        console.error("Booking creation error:", error);
        if (error.response) {
          setErrorMessage(
            error.response.data?.message ||
              "Booking creation failed. Try again.",
          );
        } else if (error.request) {
          setErrorMessage(
            "No response from server. Please check your connection.",
          );
        } else {
          setErrorMessage("Unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    },
  });

  const isBeautyFlow = formik.values.jobTitle === "beauty_personal_care";
  const hasBeautySearchCoordinates =
    String(formik.values.pickupLatitude ?? "").trim() !== "" &&
    String(formik.values.pickupLongitude ?? "").trim() !== "" &&
    Number.isFinite(Number(formik.values.pickupLatitude)) &&
    Number.isFinite(Number(formik.values.pickupLongitude));

  const isFormReady = isBeautyFlow
    ? Boolean(
        formik.values.service &&
        formik.values.service !== "Other" &&
        formik.values.pickupAddress &&
        hasBeautySearchCoordinates,
      ) ||
      Boolean(
        formik.values.service === "Other" &&
        customBeautyService.trim() &&
        formik.values.pickupAddress &&
        hasBeautySearchCoordinates,
      )
    : Boolean(
        formik.values.service &&
        formik.values.pickupAddress &&
        formik.values.dropoffAddress &&
        formik.values.serviceType &&
        formik.values.modeOfDelivery &&
        (formik.values.serviceType !== "scheduled" ||
          (formik.values.scheduleDate && formik.values.scheduleTime)),
      );

  const handleTrackProvider = async (requestId) => {
    try {
      const data = await getBookingsDetails(requestId);

      const bookingData = data?.data?.booking || data?.booking || {};
      const providerRaw = bookingData?.providerId;

      const providers = providerRaw
        ? [
            {
              id: providerRaw._id,
              _id: providerRaw._id,
              fullName: providerRaw.fullName,
              profilePicture: providerRaw.profilePicture,
              phoneNumber: providerRaw.phoneNumber,
              rating: providerRaw.rating,
              services: providerRaw.services,
              completedJobs: providerRaw.completedJobs,
              distance: providerRaw.distance,
            },
          ]
        : [];

      const shapedData = {
        ...data,
        data: {
          ...data?.data,
          booking: bookingData,
          providers,
        },
      };

      setBooking(shapedData);

      if (providerRaw?._id) {
        useBookingStore.getState().setSelectedProviderId(providerRaw._id);
      }

      navigate("/bookings/trackrider");
    } catch (err) {
      console.error("Failed to load booking for tracking:", err);
    }
  };

  const StatusFilter = ({ activeFilter, onFilterChange }) => {
    const filters = ["All", "Active", "Pending", "Completed"];

    return (
      <div className="flex gap-2 sm:gap-3 mb-6 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 no-scrollbar whitespace-nowrap">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => onFilterChange(filter.toLowerCase())}
            className={`px-5 sm:px-6 py-2.5 rounded-xl font-semibold transition-all text-sm whitespace-nowrap ${
              activeFilter === filter.toLowerCase()
                ? "bg-[#2D6A3E] text-white shadow-md shadow-green-900/10 active:scale-95"
                : "bg-white text-gray-500 border border-gray-200 hover:border-[#2D6A3E] hover:text-[#2D6A3E] active:scale-95"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>
    );
  };

  const mapBookingToRequest = (booking) => ({
    id: booking._id,
    title: (
      booking.subCategory?.replace(/_/g, " ") ||
      booking.serviceType ||
      "Booking"
    ).replace(/\b\w/g, (l) => l.toUpperCase()),
    status:
      booking.status === "in_progress"
        ? "Enroute to Pickup"
        : (booking.status || "pending")
            .replace(/_/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase()),
    providerName: booking.providerId?.fullName || "—",
    providerIdDisplay: booking.providerId?._id?.slice(-6)?.toUpperCase() || "—",
    providerImage: booking.providerId?.profilePicture || "/avatar.png",
    providerVehicleImage:
      booking.providerId?.workVisuals?.[0]?.pictures?.[0] || null,
    providerRole: (
      booking.providerId?.services?.[0]?.title?.replace(/_/g, " ") || "—"
    ).replace(/\b\w/g, (l) => l.toUpperCase()),
    providerRating: booking.providerId?.rating?.average || null,
    providerReviews: booking.providerId?.rating?.count || 0,
    providerPhone: booking.providerId?.phoneNumber || "—",

    orderId: booking._id?.slice(-6)?.toUpperCase() || "—",
    fullOrderId: booking._id || "",
    fullProviderId: booking.providerId?._id || "",
    price: booking.calculatedPrice || booking.agreedPrice || 0,
    totalAmount: booking.totalAmount || 0,
    serviceFee: booking.serviceFee || 0,

    pickupAddress: booking.pickupLocation?.address || "—",
    dropoffAddress: booking.dropoffLocation?.address || "—",
    distance: booking.distance?.value
      ? `${booking.distance.value} ${booking.distance.unit}`
      : "—",

    notes: booking.pickupNote,
    modeOfDelivery: booking.modeOfDelivery || "—",
    scheduleType: booking.scheduleType || booking.schedule_type || null,

    scheduledDate:
      booking.scheduleDate || booking.startDate
        ? new Date(booking.scheduleDate || booking.startDate).toLocaleString(
            "en-GB",
            {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            },
          )
        : null,
    deliveryDate: booking.endDate
      ? new Date(booking.endDate).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "—",

    startsIn: null,
    ratings: booking.rating?.score || null,
    originalData: booking,
  });

  const matchesLogisticsFilter = (status) => {
    if (statusFilter === "all") return true;
    if (statusFilter === "active")
      return [
        "in progress",
        "enroute to pickup",
        "arrived at pickup",
        "enroute to dropoff",
        "arrived at dropoff",
        "completed",
      ].includes(status);
    if (statusFilter === "pending")
      return [
        "payment pending",
        "awaiting provider acceptance",
        "provider selected",
      ].includes(status);
    if (statusFilter === "completed")
      return ["funds released", "user accepted completion"].includes(status);
    return false;
  };

  const matchesBeautyFilter = (status) => {
    if (statusFilter === "pending")
      return ["pending", "accepted"].includes(status);
    if (statusFilter === "active") return ["active", "review"].includes(status);
    if (statusFilter === "completed") return status === "completed";
    return true;
  };

  const visibleUserBookings = sortBookingsNewestFirst(userBookings).flatMap(
    (booking) => {
      if (isBeautyBooking(booking)) {
        const normalizedBooking = normalizeBeautyBooking(booking);
        return matchesBeautyFilter(normalizedBooking.status)
          ? [{ type: "beauty", booking: normalizedBooking }]
          : [];
      }

      const request = mapBookingToRequest(booking);
      return matchesLogisticsFilter(request.status.toLowerCase())
        ? [{ type: "logistics", booking: request }]
        : [];
    },
  );

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const handleMessageProvider = (request) => {
    const booking = request?.originalData || {};
    const bookingId = booking?._id || request?.fullOrderId || request?.id;
    const provider = booking?.providerId || null;

    if (!bookingId) return;

    navigate(`/dashboard/chat?bookingId=${bookingId}`, {
      state: { booking, provider },
    });
  };

  const refreshBookings = async () => {
    const data = await getUserBookings();
    const bookings = data?.data || data || [];
    setUserBookings(Array.isArray(bookings) ? bookings : []);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRequest(null);
  };

  const handlePickupModeChange = (mode) => {
    if (mode === "current" && isBeautyFlow) {
      if (!navigator.geolocation) {
        setBeautyLocationError(
          "Location services are not available in this browser.",
        );
        return;
      }

      setBeautyLocationError("");
      setBeautyLocationLoading(true);
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          formik.setValues(
            (values) => ({
              ...values,
              pickupAddress: currentLocationValue || "Current location",
              pickupLatitude: String(coords.latitude),
              pickupLongitude: String(coords.longitude),
            }),
            false,
          );
          setPickupMode("current");
          setBeautyLocationLoading(false);
        },
        (locationError) => {
          setBeautyLocationError(
            locationError.code === 1
              ? "Allow location access in your browser, or enter an address manually."
              : "Could not get your location. Try again or enter an address manually.",
          );
          setPickupMode("manual");
          setBeautyLocationLoading(false);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
      );
      return;
    }

    if (mode === "current" && !hasCurrentLocation) {
      setErrorMessage("Current location is not available yet.");
      return;
    }

    setPickupMode(mode);
    if (mode === "current") {
      formik.setFieldValue("pickupAddress", currentLocationValue);
      formik.setFieldValue("pickupLatitude", "");
      formik.setFieldValue("pickupLongitude", "");

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            formik.setFieldValue("pickupLatitude", position.coords.latitude);
            formik.setFieldValue("pickupLongitude", position.coords.longitude);
          },
          (error) => {
            console.warn("Geolocation failed:", error);
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
        );
      }
    } else if (isBeautyFlow) {
      setBeautyLocationError("");
      formik.setFieldValue("pickupLatitude", "");
      formik.setFieldValue("pickupLongitude", "");
    }
  };

  const promoDescription = promoLoading
    ? "We’re checking your promo status."
    : promoEligibility?.eligible && promoEligibility?.canApplyAtPayment
      ? `You have ${promoEligibility.remaining || 0} promo use(s) left.`
      : promoEligibility?.eligible
        ? "You qualify for a promo, and it can be applied at payment."
        : promoError ||
          "You are not currently eligible for the first ride discount.";

  return (
    <DashboardLayout>
      <BookingsTour />
      <div className=" bg-gray-50 min-h-screen overflow-x-hidden">
        <ServiceDetailsModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          request={selectedRequest || {}}
        />
        <h1 className="text-xl font-semibold p-4">My Bookings</h1>

        {/* Tabs */}
        <div className="flex border-b mb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
          <button
            onClick={() => setActiveTab("request")}
            className={`flex-1 sm:flex-none px-4 sm:px-8 py-3.5 font-bold transition-all relative text-center text-sm sm:text-base ${
              activeTab === "request"
                ? "text-[#005823]"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              Request A Service
            </span>
            {activeTab === "request" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#005823]" />
            )}
          </button>
          <button
            id="booking-my-requests"
            onClick={() => setActiveTab("requests")}
            className={`flex-1 sm:flex-none px-4 sm:px-8 py-3.5 font-bold transition-all relative text-center text-sm sm:text-base ${
              activeTab === "requests"
                ? "text-[#005823]"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              My Requests
            </span>
            {activeTab === "requests" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#005823]" />
            )}
          </button>
        </div>

        {activeTab === "request" ? (
          <form onSubmit={formik.handleSubmit} className="space-y-5 p-5">
            {errorMessage && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                {errorMessage}
              </div>
            )}
            {successMessage && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
                {successMessage}
              </div>
            )}
            <div id="booking-category">
              <InputField
                name="jobTitle"
                label="Select work category"
                select
                singleChevron
                options={[
                  { label: "Select category", value: "" },
                  { label: "Transport & Logistics", value: "transport" },
                  {
                    label: "Beauty & Personal Care",
                    value: "beauty_personal_care",
                  },
                ]}
                value={formik.values.jobTitle}
                onChange={(option) => {
                  formik.setValues((values) => ({
                    ...values,
                    jobTitle: option.value,
                    service: "",
                    pickupAddress: "",
                    pickupLatitude: "",
                    pickupLongitude: "",
                    dropoffAddress: "",
                    dropoffLatitude: "",
                    dropoffLongitude: "",
                  }));
                  setPickupMode("manual");
                }}
              />
            </div>

            <div>
              <InputField
                label="Subcategory"
                select
                disabled={!formik.values.jobTitle}
                options={
                  !formik.values.jobTitle
                    ? [{ label: "Select category first", value: "" }]
                    : formik.values.jobTitle === "beauty_personal_care"
                      ? [
                          { label: "Select a service", value: "" },
                          ...BEAUTY_PROVIDER_SEARCH_NAMES.map((service) => ({
                            label: service,
                            value: service,
                          })),
                          { label: "Other", value: "Other" },
                        ]
                      : [
                          { label: "Select Services", value: "" },
                          {
                            label: "Package delivery",
                            value: "package delivery",
                          },
                          { label: "Book a ride", value: "book a ride" },
                        ]
                }
                value={
                  formik.values.service === "Other"
                    ? "Other"
                    : formik.values.service
                }
                onChange={(option) => {
                  formik.setFieldValue("service", option.value);
                  if (option.value !== "Other") {
                    setCustomBeautyService("");
                  }
                }}
                onBlur={() => formik.setFieldTouched("service", true)}
              />
              {formik.touched.service && formik.errors.service && (
                <p className="mt-1 text-sm text-red-600">
                  {formik.errors.service}
                </p>
              )}
            </div>

            {/* ✅ Custom input field when "Other" is selected */}
            {isBeautyFlow && formik.values.service === "Other" && (
              <div className="mt-3">
                <InputField
                  name="customService"
                  label="Specify Service"
                  placeholder="e.g. Eyelash Extensions, Dreadlocks"
                  value={customBeautyService}
                  onChange={(e) => {
                    setCustomBeautyService(e.target.value);
                  }}
                />
              </div>
            )}

            {isBeautyFlow && formik.values.service && (
              <div id="booking-location" className="space-y-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handlePickupModeChange("current")}
                    disabled={beautyLocationLoading}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
                      pickupMode === "current"
                        ? "border-[#005823] bg-[#f0f9f4] text-[#005823]"
                        : "border-gray-200 bg-white text-gray-600 hover:border-[#005823] hover:text-[#005823]"
                    } disabled:cursor-wait disabled:opacity-50`}
                  >
                    {beautyLocationLoading
                      ? "Getting current location..."
                      : "Use current location"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePickupModeChange("manual")}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
                      pickupMode === "manual"
                        ? "border-[#005823] bg-[#f0f9f4] text-[#005823]"
                        : "border-gray-200 bg-white text-gray-600 hover:border-[#005823] hover:text-[#005823]"
                    }`}
                  >
                    Enter manually
                  </button>
                </div>
                {pickupMode === "current" ? (
                  <InputField
                    name="pickupAddress"
                    label="Location"
                    value={formik.values.pickupAddress}
                    onBlur={formik.handleBlur}
                    readOnly
                  />
                ) : (
                  <LocationAutocomplete
                    name="pickupAddress"
                    label="Location"
                    placeholder="Enter an address"
                    value={formik.values.pickupAddress}
                    onChange={(value) => {
                      setBeautyLocationError("");
                      formik.setFieldValue("pickupAddress", value);
                      formik.setFieldValue("pickupLatitude", "");
                      formik.setFieldValue("pickupLongitude", "");
                    }}
                    onSelect={(selectedLocation) => {
                      formik.setFieldValue(
                        "pickupAddress",
                        selectedLocation.displayAddress ||
                          selectedLocation.address ||
                          "",
                      );
                      formik.setFieldValue(
                        "pickupLatitude",
                        selectedLocation.latitude ?? "",
                      );
                      formik.setFieldValue(
                        "pickupLongitude",
                        selectedLocation.longitude ?? "",
                      );
                    }}
                    onBlur={() => formik.setFieldTouched("pickupAddress", true)}
                  />
                )}
                {beautyLocationError && (
                  <p role="alert" className="text-sm text-red-600">
                    {beautyLocationError}
                  </p>
                )}
                {formik.touched.pickupAddress &&
                  (formik.errors.pickupAddress ||
                    formik.errors.pickupLatitude ||
                    formik.errors.pickupLongitude) && (
                    <p className="text-sm text-red-600">
                      {formik.errors.pickupAddress ||
                        formik.errors.pickupLatitude ||
                        formik.errors.pickupLongitude}
                    </p>
                  )}
                {pickupMode === "manual" &&
                  formik.values.pickupAddress &&
                  !hasBeautySearchCoordinates && (
                    <p className="text-sm text-gray-500">
                      Select an address from the suggestions to use it for
                      provider search.
                    </p>
                  )}
              </div>
            )}

            {!isBeautyFlow && formik.values.service && (
              <div id="booking-location" className="space-y-4">
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handlePickupModeChange("current")}
                      disabled={!hasCurrentLocation}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                        pickupMode === "current"
                          ? "border-[#005823] bg-[#f0f9f4] text-[#005823]"
                          : "border-gray-200 bg-white text-gray-600 hover:border-[#005823] hover:text-[#005823]"
                      } ${!hasCurrentLocation ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      Use current location
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePickupModeChange("manual")}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                        pickupMode === "manual"
                          ? "border-[#005823] bg-[#f0f9f4] text-[#005823]"
                          : "border-gray-200 bg-white text-gray-600 hover:border-[#005823] hover:text-[#005823]"
                      }`}
                    >
                      Enter manually
                    </button>
                  </div>
                  {pickupMode === "current" ? (
                    <InputField
                      name="pickupAddress"
                      label="Pickup location"
                      placeholder="24 Palm Avenue, Lagos"
                      value={formik.values.pickupAddress}
                      onBlur={formik.handleBlur}
                      readOnly
                    />
                  ) : (
                    <LocationAutocomplete
                      name="pickupAddress"
                      label="Pickup location"
                      placeholder="24 Palm Avenue, Lagos"
                      value={formik.values.pickupAddress}
                      onChange={(value) => {
                        formik.setFieldValue("pickupAddress", value);
                        formik.setFieldValue("pickupLatitude", "");
                        formik.setFieldValue("pickupLongitude", "");
                      }}
                      onSelect={(location) => {
                        formik.setFieldValue(
                          "pickupAddress",
                          location.displayAddress || location.address || "",
                        );
                        formik.setFieldValue(
                          "pickupLatitude",
                          location.latitude || "",
                        );
                        formik.setFieldValue(
                          "pickupLongitude",
                          location.longitude || "",
                        );
                      }}
                      onBlur={() =>
                        formik.setFieldTouched("pickupAddress", true)
                      }
                    />
                  )}
                  {formik.touched.pickupAddress &&
                    formik.errors.pickupAddress && (
                      <p className="mt-1 text-sm text-red-600">
                        {formik.errors.pickupAddress}
                      </p>
                    )}
                </div>
                <div>
                  <LocationAutocomplete
                    name="dropoffAddress"
                    label="Dropoff location"
                    placeholder="24 Palm Avenue, Lagos"
                    value={formik.values.dropoffAddress}
                    onChange={(value) => {
                      formik.setFieldValue("dropoffAddress", value);
                      formik.setFieldValue("dropoffLatitude", "");
                      formik.setFieldValue("dropoffLongitude", "");
                    }}
                    onSelect={(location) => {
                      formik.setFieldValue(
                        "dropoffAddress",
                        location.displayAddress || location.address || "",
                      );
                      formik.setFieldValue(
                        "dropoffLatitude",
                        location.latitude || "",
                      );
                      formik.setFieldValue(
                        "dropoffLongitude",
                        location.longitude || "",
                      );
                    }}
                    onBlur={() =>
                      formik.setFieldTouched("dropoffAddress", true)
                    }
                  />
                  {formik.touched.dropoffAddress &&
                    formik.errors.dropoffAddress && (
                      <p className="mt-1 text-sm text-red-600">
                        {formik.errors.dropoffAddress}
                      </p>
                    )}
                </div>
              </div>
            )}

            {!isBeautyFlow && formik.values.service && (
              <div>
                <InputField
                  label="Service Type"
                  select
                  options={[
                    { label: "Select service type", value: "" },
                    { label: "Pickup now", value: "immediate" },
                    { label: "Schedule", value: "scheduled" },
                  ]}
                  value={formik.values.serviceType}
                  onChange={(option) =>
                    formik.setFieldValue("serviceType", option.value)
                  }
                  onBlur={() => formik.setFieldTouched("serviceType", true)}
                />
                {formik.touched.serviceType && formik.errors.serviceType && (
                  <p className="mt-1 text-sm text-red-600">
                    {formik.errors.serviceType}
                  </p>
                )}
              </div>
            )}

            {!isBeautyFlow &&
              formik.values.service &&
              formik.values.serviceType === "scheduled" && (
                <div className="flex gap-6">
                  <div className="w-full">
                    <InputField
                      name="scheduleDate"
                      label="Select Date"
                      type="date"
                      min={new Date().toISOString().split("T")[0]}
                      value={formik.values.scheduleDate}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.scheduleDate &&
                      formik.errors.scheduleDate && (
                        <p className="mt-1 text-sm text-red-600">
                          {formik.errors.scheduleDate}
                        </p>
                      )}
                  </div>

                  <div className="w-full">
                    <InputField
                      name="scheduleTime"
                      label="Select Time"
                      type="time"
                      value={formik.values.scheduleTime}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.scheduleTime &&
                      formik.errors.scheduleTime && (
                        <p className="mt-1 text-sm text-red-600">
                          {formik.errors.scheduleTime}
                        </p>
                      )}
                  </div>
                </div>
              )}

            {!isBeautyFlow && formik.values.service && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Choose Vehicle
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {vehicleOptions(formik.values.service).map((vehicle) => {
                    const isSelected =
                      formik.values.modeOfDelivery === vehicle.value;
                    return (
                      <button
                        key={vehicle.value}
                        type="button"
                        onClick={() =>
                          formik.setFieldValue("modeOfDelivery", vehicle.value)
                        }
                        className={`text-left p-4 rounded-xl border-2 transition-all ${
                          isSelected
                            ? "border-[#005823] bg-[#f0f9f4]"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                      >
                        <div
                          className={`mb-2 ${isSelected ? "text-[#005823]" : "text-gray-600"}`}
                        >
                          {vehicle.icon}
                        </div>
                        <p
                          className={`font-semibold text-sm ${isSelected ? "text-[#005823]" : "text-gray-800"}`}
                        >
                          {vehicle.label}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1.5">
                          <span>{vehicle.eta}</span>
                          <span>•</span>
                          <span className="flex items-center gap-0.5">
                            <svg
                              className="w-3 h-3"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v1h8v-1zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-1a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v1h-3zM4.75 12.094A5.973 5.973 0 004 15v1H1v-1a3 3 0 013.75-2.906z" />
                            </svg>
                            {vehicle.capacity}
                          </span>
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {vehicle.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
                {formik.touched.modeOfDelivery &&
                  formik.errors.modeOfDelivery && (
                    <p className="mt-2 text-sm text-red-600">
                      {formik.errors.modeOfDelivery}
                    </p>
                  )}
              </div>
            )}

            <div className="flex flex-col">
              <Button
                variant="secondary"
                type="submit"
                disabled={loading || !isFormReady}
              >
                {loading ? "Creating Booking..." : "Post Request"}
              </Button>
            </div>
          </form>
        ) : (
          <div className="mt-5 py-5 px-3">
            <StatusFilter
              activeFilter={statusFilter}
              onFilterChange={setStatusFilter}
            />

            {bookingsLoading && (
              <div className="text-center py-12 bg-white rounded-lg">
                <div className="w-8 h-8 border-4 border-[#005823] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-500">Loading your bookings...</p>
              </div>
            )}

            {!bookingsLoading && bookingsError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {bookingsError}
              </div>
            )}

            {!bookingsLoading && !bookingsError && (
              <div className="space-y-4 w-full">
                {visibleUserBookings.length > 0 ? (
                  visibleUserBookings.map(({ type, booking }) =>
                    type === "beauty" ? (
                      <BeautyBookingCard
                        key={booking.id}
                        booking={booking}
                        onRefresh={refreshBookings}
                      />
                    ) : (
                      <RequestCard
                        key={booking.id}
                        request={booking}
                        onViewDetails={handleViewDetails}
                        onTrackProvider={handleTrackProvider}
                        onMessageProvider={handleMessageProvider}
                        onBookingCancelled={refreshBookings}
                        onStatusUpdate={refreshBookings}
                      />
                    ),
                  )
                ) : (
                  <div className="text-center py-12 bg-white rounded-lg">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-8 h-8 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No requests found
                    </h3>
                    <p className="text-gray-600">
                      {userBookings.length === 0
                        ? "You haven't made any bookings yet."
                        : "No requests match the selected filter."}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
