import { formatNaira } from "./format";

export function createBookingActivity(type, booking, staff, occurredAt) {
  return {
    id: `${booking.id}:${type}:${occurredAt}`,
    type,
    bookingId: booking.id,
    customer: booking.customer,
    service: booking.service,
    staffName: booking.assignedStaff?.name ?? staff.name,
    amount: type === "service_completed" ? booking.amount : null,
    occurredAt,
  };
}

export function getActivityDescription(activity) {
  const amount = activity.type === "service_completed" && Number.isFinite(activity.amount)
    ? ` · ${formatNaira(activity.amount)}`
    : "";
  return `${getActivityMessage(activity)}${amount}`;
}

export function getActivityMessage(activity) {
  const { customer, service, staffName } = activity;

  switch (activity.type) {
    case "booking_requested":
      return `${customer} requested ${service}`;
    case "booking_accepted":
      return `Booking accepted: ${service} for ${customer}`;
    case "booking_declined":
      return `Booking declined: ${service} for ${customer}`;
    case "staff_assigned":
      return `${staffName} assigned to ${service} for ${customer}`;
    case "staff_en_route":
      return `${staffName} is en route to ${customer} for ${service}`;
    case "service_started":
      return `${staffName} started ${service} for ${customer}`;
    case "service_completed":
      return `${staffName} completed ${service} for ${customer}`;
    case "booking_cancelled":
      return `Booking cancelled: ${service} for ${customer}`;
    case "booking_expired":
      return `Request expired: ${service} for ${customer}`;
    case "payment_confirmed":
      return `Payment confirmed: ${service} for ${customer}`;
    case "payment_expired":
      return `Payment window expired: ${service} for ${customer}`;
    default:
      return activity.message || "Activity update";
  }
}

export function formatActivityTime(occurredAt) {
  const date = new Date(occurredAt);
  if (!occurredAt || Number.isNaN(date.getTime())) return null;

  return {
    dateTime: date.toISOString(),
    time: new Intl.DateTimeFormat("en-GB", {
      timeZone: "Africa/Lagos",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date),
    fullDate: new Intl.DateTimeFormat("en-GB", {
      timeZone: "Africa/Lagos",
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date),
  };
}
