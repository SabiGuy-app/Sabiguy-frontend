import { create } from "zustand";
import {
  acceptCompletion,
  cancelBooking,
  createServiceBooking,
  getUserBookings,
} from "../api/bookings";

const BEAUTY_TYPES = new Set(["beauty_personal_care"]);

const normalizeServiceType = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/-/g, "_");

const isBeautyBooking = (booking) =>
  BEAUTY_TYPES.has(normalizeServiceType(booking?.serviceType));

const getPricingLabel = (pricingOption) => {
  const labels = {
    walk_in: "Walk in Salon",
    provider_address: "Provider's Address",
    customer_address: "Customer's Address",
  };
  return labels[pricingOption] || pricingOption || "Service Location";
};

const toTwentyFourHourTime = (time = "12:00 AM") => {
  const match = String(time).match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return "00:00";

  let hours = Number(match[1]);
  const minutes = match[2];
  const period = match[3].toUpperCase();

  if (period === "AM" && hours === 12) hours = 0;
  if (period === "PM" && hours !== 12) hours += 12;

  return `${String(hours).padStart(2, "0")}:${minutes}`;
};

const getBookingStatus = (status) => {
  const normalized = String(status || "pending").toLowerCase();
  const statusMap = {
    pending_providers: "pending",
    awaiting_provider_acceptance: "pending",
    booking_expired: "expired",
    expired: "expired",
    provider_selected: "accepted",
    payment_pending: "accepted",
    paid_escrow: "active",
    paid_escrow_scheduled: "active",
    in_progress: "active",
    completed: "review",
    user_accepted_completion: "completed",
    funds_released: "completed",
    cancelled: "cancelled",
  };

  return statusMap[normalized] || normalized;
};

export const normalizeBeautyBooking = (booking) => {
  if (!booking) return null;

  const provider = booking.providerId || {};
  const serviceDetails = booking.serviceDetails || {};
  const price =
    serviceDetails.price ||
    booking.agreedPrice ||
    booking.budget ||
    booking.totalAmount ||
    0;
  const date = booking.scheduleDate
    ? `${booking.scheduleDate.slice(0, 10)}T${toTwentyFourHourTime(
        booking.scheduledTime,
      )}`
    : booking.date;

  return {
    ...booking,
    raw: booking,
    id: booking._id,
    apiStatus: booking.status,
    status: getBookingStatus(booking.status),
    provider,
    providerName: provider.fullName || "Provider",
    providerImage: provider.profilePicture || "/avatar.png",
    service: serviceDetails.serviceName || booking.subCategory || booking.title,
    label: getPricingLabel(serviceDetails.pricingOption),
    pricingOption: serviceDetails.pricingOption,
    price,
    totalAmount: booking.totalAmount || price,
    duration:
      booking.estimatedDuration?.value || booking.bookingDuration?.value || 120,
    date,
    scheduledTime: booking.scheduledTime,
    address: booking.location?.address || booking.address || "",
    note: booking.pickupNote || booking.note || "",
    review: booking.rating || booking.review || null,
  };
};

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

export const useBeautyBookingStore = create((set, get) => ({
  booking: null,
  bookings: [],
  loading: false,
  error: "",
  notifications: [],
  notify: (message, target = "details") =>
    set({
      notifications: [
        {
          _id: `beauty-${Date.now()}`,
          type: "beauty_booking",
          title: "Bookings",
          message,
          data: { target },
          createdAt: new Date().toISOString(),
          isRead: false,
        },
      ],
    }),
  markRead: () =>
    set({
      notifications: get().notifications.map((item) => ({
        ...item,
        isRead: true,
      })),
    }),
  clearNotifications: () => set({ notifications: [] }),
  fetchBookings: async () => {
    set({ loading: true, error: "" });
    try {
      const response = await getUserBookings();
      const allBookings = Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response)
          ? response
          : [];
      const beautyBookings = allBookings
        .filter(isBeautyBooking)
        .map(normalizeBeautyBooking);
      set({
        bookings: beautyBookings,
        booking: beautyBookings[0] || null,
        loading: false,
      });
      return beautyBookings;
    } catch (error) {
      set({
        loading: false,
        error: getErrorMessage(error, "Failed to load beauty bookings."),
      });
      throw error;
    }
  },
  submit: async (payload) => {
    set({ loading: true, error: "" });
    try {
      const response = await createServiceBooking(payload);
      const booking = normalizeBeautyBooking(
        response?.data || response?.booking || response,
      );
      set((state) => ({
        booking,
        bookings: booking
          ? [booking, ...state.bookings.filter((item) => item.id !== booking.id)]
          : state.bookings,
        loading: false,
        notifications: [],
      }));
      get().notify("Your booking has been sent to the provider.", "details");
      return response;
    } catch (error) {
      set({
        loading: false,
        error: getErrorMessage(error, "Booking creation failed. Try again."),
      });
      throw error;
    }
  },
  cancel: async (bookingId, reason = "Change of plans") => {
    const targetId = bookingId || get().booking?.id;
    if (!targetId) return null;

    set({ loading: true, error: "" });
    try {
      const response = await cancelBooking(targetId, reason);
      await get().fetchBookings();
      return response;
    } catch (error) {
      set({
        loading: false,
        error: getErrorMessage(error, "Booking could not be cancelled."),
      });
      throw error;
    }
  },
  complete: async (bookingId, review) => {
    const targetId = bookingId || get().booking?.id;
    if (!targetId) return null;

    set({ loading: true, error: "" });
    try {
      const response = await acceptCompletion(targetId, review);
      await get().fetchBookings();
      get().notify("Your service is complete. Thank you!", "thanks");
      return response;
    } catch (error) {
      set({
        loading: false,
        error: getErrorMessage(error, "Review could not be submitted."),
      });
      throw error;
    }
  },
}));
