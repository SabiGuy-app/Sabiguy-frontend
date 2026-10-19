import customerAvatar from "../../../../assets/emeka.png";
import { mockBeautyOverview } from "./mockBeautyOverview";

// Base booking fields reused by the status samples below.
export const mockBeautyBookings = {
  ...mockBeautyOverview,
  booking: {
    ...mockBeautyOverview.booking,
    status: "pending",
    serviceId: "face_beard_trim",
    durationMinutes: 180,
    startOffsetSeconds: 7200,
    paymentWindowSeconds: 300,
    customerNote: "Please take extra care around my beard line.",
    requestedStaff: mockBeautyOverview.staff.name,
    requestedStaffId: mockBeautyOverview.staff.id,
    customerProfile: {
      avatar: customerAvatar,
      verified: true,
      rating: 4.9,
      reviewCount: 25,
      location: "Lekki Phase 1",
      phone: null,
      messagingAvailable: false,
    },
  },
  staff: {
    ...mockBeautyOverview.staff,
    serviceIds: ["face_beard_trim"],
    distanceKm: 5,
    travelMinutes: 24,
    rating: 4.9,
    role: "Senior barber",
  },
};

// One sample per booking tab; status-specific UI remains conditional.
const bookingSamples = [
  { status: "pending", customer: "Daniel Okon", staff: "Tunde Adeyemi" },
  { status: "accepted", customer: "Ada Williams", staff: "Tunde Adeyemi" },
  { status: "scheduled", customer: "Amaka Nwosu", staff: "Kemi Lawal" },
  { status: "completed", customer: "David Cole", staff: "Tunde Adeyemi" },
];

export const mockBeautyBookingSamples = bookingSamples.map((sample) => {
  // Reuse two staff identities across bookings instead of creating staff per row.
  const staffId = `beauty-staff-${sample.staff.toLowerCase().replaceAll(" ", "-")}`;
  return {
    ...mockBeautyBookings,
    booking: {
      ...mockBeautyBookings.booking,
      id: `beauty-booking-${sample.status}`,
      status: sample.status,
      customer: sample.customer,
      serviceLocation: sample.serviceLocation ?? "customer_address",
      requestedStaff: sample.staff,
      requestedStaffId: staffId,
    },
    staff: {
      ...mockBeautyBookings.staff,
      id: staffId,
      name: sample.staff,
      customer: sample.customer,
    },
  };
});
