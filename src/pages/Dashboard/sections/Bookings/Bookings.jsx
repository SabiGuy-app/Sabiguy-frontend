import DashboardLayout from "../../../../components/layouts/DashboardLayout";
import InputField from "../../../../components/InputField";
import { useState, useEffect } from "react";
import { Bike } from "lucide-react";
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
} from "../../../../api/bookings";
import { allowSystem } from "../../../../api/bookings";
import useBookingStore from "../../../../stores/booking.store";
import BookingsTour from "../../../../components/tour/BookingsTour";
import { useAuthStore } from "../../../../stores/auth.store";

const vehicleOptions = [
  {
    value: "Bike",
    label: "Bike Delivery",
    icon: <Bike color="black" size={30} />,
    eta: "15 min",
    capacity: 2,
    description: "Best for small packages",
  },
  {
    value: "Car",
    label: "Car Delivery",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="w-7 h-7"
        stroke="currentColor"
        strokeWidth={1.6}
      >
        <rect x="2" y="9" width="20" height="9" rx="2" />
        <path d="M5 9l2-4h10l2 4" />
        <circle cx="7" cy="18" r="1.5" fill="currentColor" stroke="none" />
        <circle cx="17" cy="18" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    ),
    eta: "21 min",
    capacity: 4,
    description: "Medium sized delivery",
  },
];

export default function Bookings() {
  const [activeTab, setActiveTab] = useState("request");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [pickupMode, setPickupMode] = useState("manual");

  const [userBookings, setUserBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [bookingsError, setBookingsError] = useState("");

  const setBooking = useBookingStore((state) => state.setBooking);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

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

  const location = useLocation();
  const preselectedService =
    new URLSearchParams(location.search).get("service") ?? "";
  const currentLocationValue =
    localStorage.getItem("currentLocationAddress") || "";
  const hasCurrentLocation = !!currentLocationValue;

  const formik = useFormik({
    initialValues: {
      jobTitle: "transport",
      service: preselectedService,
      pickupAddress: "",
      dropoffAddress: "",
      serviceType: "",
      scheduleDate: "",
      scheduleTime: "",
      // vehicle: "",
      modeOfDelivery: "",
      autoAcceptNearest: false,
    },
    validationSchema: Yup.object().shape({
      jobTitle: Yup.string().required("Work category is required"),
      service: Yup.string().required("Sub-category is required"),
      pickupAddress: Yup.string().required("Pickup location is required"),
      dropoffAddress: Yup.string().required("Dropoff location is required"),
      serviceType: Yup.string().required("Service type is required"),
      modeOfDelivery: Yup.string().required("Please choose a vehicle"),
      scheduleDate: Yup.date().when("serviceType", {
        is: "scheduled",
        then: (schema) => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return schema
            .required("Schedule date is required")
            .min(today, "Date must be today or in the future");
        },
        otherwise: (schema) => schema.notRequired(),
      }),
      scheduleTime: Yup.string().when("serviceType", {
        is: "scheduled",
        then: (schema) => schema.required("Schedule time is required"),
        otherwise: (schema) => schema.notRequired(),
      }),
    }),
    onSubmit: async (values) => {
      console.log("Submitting booking with values:", values);
      setLoading(true);
      setSuccessMessage("");
      setErrorMessage("");

      try {
        const payload = {
          serviceType: values.jobTitle,
          subCategory: values.service,
          pickupAddress: values.pickupAddress,
          dropoffAddress: values.dropoffAddress,
          scheduleType: values.serviceType,
          // vehicle: values.modeOfDelivery,
          modeOfDelivery: values.modeOfDelivery,
          scheduleDate:
            values.serviceType === "scheduled"
              ? `${values.scheduleDate}T${values.scheduleTime}:00`
              : undefined,
        };

        console.log("Calling bookingPost with payload:", payload);
        const res = await bookingPost(payload);
        console.log("Booking created response:", res);

        try {
          await allowSystem(false);
        } catch (allowErr) {
          console.error("Error resetting allowSystem:", allowErr);
        }

        setBooking(res);
        setSuccessMessage(res?.message || "Booking created successfully!");
        formik.resetForm();
        console.log("Navigating to searching page...");
        // navigate("/dashboard/provider/searching");

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

  const isFormReady =
    !!formik.values.service &&
    !!formik.values.pickupAddress &&
    !!formik.values.dropoffAddress &&
    !!formik.values.serviceType &&
    !!formik.values.modeOfDelivery &&
    (formik.values.serviceType !== "scheduled" ||
      (!!formik.values.scheduleDate && !!formik.values.scheduleTime));

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
      <div className="flex justify-center mb-6">
        <div className="grid grid-cols-2 gap-2">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => onFilterChange(filter.toLowerCase())}
              className={`w-full text-center px-4 py-2.5 rounded-lg font-medium text-sm transition-colors ${
                activeFilter === filter.toLowerCase()
                  ? "bg-[#2D6A3E] text-white"
                  : "bg-white text-gray-600 border border-gray-300 hover:border-[#2D6A3E] hover:text-[#2D6A3E]"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
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
    providerImage:
      booking.providerId?.profilePicture ||
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop",
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
    providerIdDisplay: booking.providerId?._id?.slice(-6)?.toUpperCase() || "—",
    fullProviderId: booking.providerId?._id || "",
    price: booking.calculatedPrice || booking.agreedPrice || 0,
    totalAmount: booking.totalAmount || 0,
    serviceFee: booking.serviceFee || 0,

    pickupAddress: booking.pickupLocation?.address || "—",
    dropoffAddress: booking.dropoffLocation?.address || "—",
    distance: booking.distance?.value
      ? `${booking.distance.value} ${booking.distance.unit}`
      : "—",

    description: booking.description || null,
    notes: null,
    modeOfDelivery: booking.modeOfDelivery || "—",

    scheduledDate: booking.createdAt
      ? new Date(booking.createdAt).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "—",
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

  const filteredRequests = userBookings
    .map(mapBookingToRequest)
    .filter((request) => {
      const status = request.status.toLowerCase();
      if (statusFilter === "all") return true;
      if (statusFilter === "active")
        return [
          "enroute to pickup",
          "paid escrow",
          "provider selected",
          "completed",
          "arrived at pickup",
          "enroute to dropoff",
          "arrived at dropoff",
        ].includes(status);
      if (statusFilter === "pending")
        return [
          "pending providers",
          "payment pending",
          // "awaiting provider acceptance",
        ].includes(status);
      if (statusFilter === "completed")
        return [
          // "completed",
          // "funds_released",
          "user_accepted_completion",
        ].includes(status);
      return false;
    });

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
    if (mode === "current" && !hasCurrentLocation) {
      setErrorMessage("Current location is not available yet.");
      return;
    }

    setPickupMode(mode);
    if (mode === "current") {
      formik.setFieldValue("pickupAddress", currentLocationValue);
    }
  };

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
              Request a service
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
              My requests
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
            <input type="hidden" name="jobTitle" value="transport" />
            <div id="booking-category">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Select work category
              </label>
              <div className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-md text-gray-700 flex items-center justify-between">
                <span>Transport &amp; Logistics</span>
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
            <div>
              <InputField
                label="Subcategory"
                select
                options={[
                  { label: "Select Services", value: "" },
                  { label: "Package delivery", value: "package delivery" },
                  { label: "Book a ride", value: "book a ride" },
                ]}
                value={formik.values.service}
                onChange={(option) =>
                  formik.setFieldValue("service", option.value)
                }
                onBlur={() => formik.setFieldTouched("service", true)}
              />
              {formik.touched.service && formik.errors.service && (
                <p className="mt-1 text-sm text-red-600">
                  {formik.errors.service}
                </p>
              )}
            </div>
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
                <InputField
                  name="pickupAddress"
                  label="Pickup location"
                  placeholder="24 Palm Avenue, Lagos"
                  value={formik.values.pickupAddress}
                  onChange={
                    pickupMode === "manual" ? formik.handleChange : undefined
                  }
                  onBlur={formik.handleBlur}
                  readOnly={pickupMode === "current"}
                />
                {formik.touched.pickupAddress &&
                  formik.errors.pickupAddress && (
                    <p className="mt-1 text-sm text-red-600">
                      {formik.errors.pickupAddress}
                    </p>
                  )}
              </div>
              <div>
                <InputField
                  name="dropoffAddress"
                  label="Dropoff location"
                  placeholder="24 Palm Avenue, Lagos"
                  value={formik.values.dropoffAddress}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.dropoffAddress &&
                  formik.errors.dropoffAddress && (
                    <p className="mt-1 text-sm text-red-600">
                      {formik.errors.dropoffAddress}
                    </p>
                  )}
              </div>
            </div>

            {/* {formik.values.pickupAddress && formik.values.dropoffAddress && (
              <div className="flex items-center gap-2 text-sm text-gray-500 -mt-2">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>15km</span>
              </div>
            )} */}
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
            {formik.values.serviceType === "scheduled" && (
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Choose Vehicle
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {vehicleOptions.map((vehicle) => {
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

            {/* Auto-accept checkbox */}
            <div id="booking-auto-accept" className="flex items-center gap-3">
              <input
                type="checkbox"
                id="auto-accept"
                name="autoAcceptNearest"
                checked={formik.values.autoAcceptNearest}
                onChange={async (e) => {
                  formik.handleChange(e);
                  try {
                    await allowSystem(e.target.checked);
                  } catch (error) {
                    console.error("Error updating allowSystem:", error);
                    setErrorMessage("Failed to update auto-accept setting");
                  }
                }}
                className="w-4 h-4 rounded cursor-pointer accent-[#005823]"
              />
              <label
                htmlFor="auto-accept"
                className="text-sm text-gray-500 cursor-pointer select-none"
              >
                Automatically accept the nearest provider
              </label>
            </div>
            {formik.values.autoAcceptNearest && (
              <div className="flex items-start gap-2 p-3 bg-[#005823] border border-[#005823] rounded-lg">
                <svg
                  className="w-5 h-5 text-white mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-sm text-white">
                  The system will automatically assign the nearest available
                  provider to your request.
                </p>
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

            {/* ✅ Loading */}
            {bookingsLoading && (
              <div className="text-center py-12 bg-white rounded-lg">
                <div className="w-8 h-8 border-4 border-[#005823] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-500">Loading your bookings...</p>
              </div>
            )}

            {/* ✅ Error */}
            {!bookingsLoading && bookingsError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {bookingsError}
              </div>
            )}

            {/* ✅ Real bookings list */}
            {!bookingsLoading && !bookingsError && (
              <div className="space-y-4 w-full">
                {filteredRequests.length > 0 ? (
                  filteredRequests.map((request) => (
                    <RequestCard
                      key={request.id}
                      request={request}
                      onViewDetails={handleViewDetails}
                      onTrackProvider={handleTrackProvider}
                      onMessageProvider={handleMessageProvider}
                      onBookingCancelled={refreshBookings}
                      onStatusUpdate={refreshBookings}
                    />
                  ))
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
