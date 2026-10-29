// Maps GET /businesses/:businessId/bookings records onto the booking shape the
// dashboard components use. `status` here is the UI status from utils/status.

const PAYMENT_PENDING = ["payment_pending", "provider_accepted", "provider_selected", "accept_selection"];
const PAID = ["paid_escrow", "paid_escrow_scheduled"];
const COMPLETED = ["completed", "user_accepted_completion", "funds_released"];
const ON_SITE = ["in_progress", "arrived_at_pickup", "enroute_to_dropoff", "arrived_at_dropoff"];

export function getUiBookingStatus(booking) {
  const { status, businessStatus, providerResponse } = booking;
  if (providerResponse === "declined") return "declined";
  if (status === "awaiting_provider_acceptance" || status === "pending_providers") return "pending";
  if (status === "booking_expired" || status === "no_provider_available") return "expired";
  if (status === "expired") return "payment_expired";
  if (status === "cancelled" || businessStatus === "cancelled") return "cancelled";
  if (status === "cancellation_requested") return "cancellation_requested";
  if (status === "disputed") return "disputed";
  if (PAYMENT_PENDING.includes(status)) return "payment_pending";
  if (COMPLETED.includes(status) || businessStatus === "completed") return "completed";
  if (ON_SITE.includes(status) || businessStatus === "in_progress") return "in_service";
  if (businessStatus === "assigned") return status === "paid_escrow_scheduled" ? "scheduled" : "assigned";
  if (PAID.includes(status)) return "accepted";
  return "completed";
}

// scheduleDate is midnight UTC of the day; scheduledTime is Lagos wall time ("4:30 PM").
function getStartsAt(scheduleDate, scheduledTime) {
  const day = String(scheduleDate || "").slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return null;
  const match = String(scheduledTime || "").trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (!match) return `${day}T00:00:00+01:00`;
  let hour = Number(match[1]);
  const period = match[3]?.toUpperCase();
  if (period === "PM" && hour !== 12) hour += 12;
  if (period === "AM" && hour === 12) hour = 0;
  return `${day}T${String(hour).padStart(2, "0")}:${match[2]}:00+01:00`;
}

const toMinutes = ({ value, unit } = {}) => {
  if (!Number.isFinite(value)) return 0;
  return unit?.startsWith("hour") ? value * 60 : value;
};

// roster: ACTIVE staff from GET /business/:businessId/staff, to name the
// requested and assigned staff (bookings only carry their ids/codes).
export function normalizeBusinessBooking(booking, roster = []) {
  const items = booking.serviceDetails?.items?.length
    ? booking.serviceDetails.items
    : [booking.serviceDetails].filter(Boolean);
  const serviceNames = items.map((item) => item.serviceName).filter(Boolean);
  const pricingOption = booking.serviceDetails?.pricingOption;
  const createdAt = Date.parse(booking.createdAt);
  const expiresAt = Date.parse(booking.expiredAt);
  const status = getUiBookingStatus(booking);

  const requestedStaffMember = booking.requestedStaffCode
    ? roster.find((member) => member.staffCode === booking.requestedStaffCode) ?? null
    : null;
  const assignedStaffList = (booking.assignedStaff ?? []).map((entry) => {
    const staffId = String(entry.staff?._id ?? entry.staff);
    const member = roster.find((item) => String(item.staffId) === staffId);
    return { id: staffId, name: member?.name || member?.staffCode || "Assigned staff", member };
  });

  return {
    id: booking._id,
    status,
    apiStatus: booking.status,
    businessStatus: booking.businessStatus,
    paymentStatus: PAID.includes(booking.status) ? "paid" : null,
    customer: booking.userId?.fullName || "Customer",
    customerProfile: {
      avatar: booking.userId?.profilePicture || null,
      phone: booking.userId?.phoneNumber || null,
      messagingAvailable: false,
    },
    service: serviceNames.join(" + ") || booking.title || booking.subCategory || "Service",
    serviceNames,
    serviceLocation: pricingOption === "provider_address" ? "in_salon" : "customer_address",
    location: pricingOption === "provider_address" ? "Walk in" : "Customer’s address",
    address: booking.location?.formattedAddress || booking.location?.address || "Address unavailable",
    startsAt: getStartsAt(booking.scheduleDate, booking.scheduledTime),
    durationMinutes: toMinutes(booking.estimatedDuration) || toMinutes(booking.bookingDuration),
    amount: booking.agreedPrice ?? booking.serviceDetails?.price ?? booking.totalAmount ?? 0,
    customerNote: booking.description || "",
    expiresAt: booking.expiredAt,
    responseWindowSeconds: Number.isFinite(createdAt) && Number.isFinite(expiresAt) && expiresAt > createdAt
      ? Math.round((expiresAt - createdAt) / 1000)
      : undefined,
    paymentExpiresAt: booking.paymentDeadlineAt,
    requestedStaffCode: booking.requestedStaffCode || null,
    requestedStaffMember,
    requestedStaff: booking.requestedStaffCode
      ? requestedStaffMember?.name || booking.requestedStaffCode
      : null,
    assignedStaffList,
    assignedStaff: assignedStaffList.length
      ? { id: assignedStaffList[0].id, name: assignedStaffList.map((item) => item.name).join(", ") }
      : null,
    createdAt: booking.createdAt,
  };
}

// Staff can be assigned once the business has accepted and until the job closes.
const NOT_ASSIGNABLE = ["pending", "expired", "declined", "cancelled", "completed", "payment_expired", "disputed"];
export const canAssignStaff = (booking) => Boolean(booking) && !NOT_ASSIGNABLE.includes(booking.status);

const ineligibleReasons = {
  already_assigned: "Already assigned to this booking",
  does_not_do_service: "Doesn’t offer this service",
  off_duty: "Off duty",
};

export const getCandidateIneligibility = (candidate) =>
  candidate.eligible ? null : ineligibleReasons[candidate.reason] || "Not available for this booking";

export const formatCandidateMeta = (candidate) =>
  [
    candidate?.distanceKm != null ? `${Number(candidate.distanceKm).toFixed(1)} km away` : null,
    candidate?.etaMinutes != null ? `about ${Math.round(candidate.etaMinutes)} min` : null,
    candidate?.rating ? `${candidate.rating}★` : null,
  ].filter(Boolean).join(" · ");
