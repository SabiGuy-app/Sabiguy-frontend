export const bookingTabs = [
  { value: "requests", label: "Requests" },
  { value: "active", label: "Active" },
  { value: "upcoming", label: "Upcoming" },
  { value: "completed", label: "Completed" },
];

export function getBookingTab(status) {
  if (["pending", "payment_pending"].includes(status)) return "requests";
  if (["accepted", "assigned", "en_route", "in_service"].includes(status)) return "active";
  if (status === "scheduled") return "upcoming";
  return "completed";
}

export function getStaffEligibility(booking, staff) {
  if (booking.assignedStaff?.id === staff.id) return "Currently assigned to this job";
  if (staff.serviceIds && !staff.serviceIds.includes(booking.serviceId)) return "Doesn’t offer this service";
  if (staff.status === "offline") return "Offline";
  if (staff.assignedBookingId && staff.assignedBookingId !== booking.id) return staff.status === "available" ? "Reserved for another booking" : "Currently assigned to another job";
  if (staff.status !== "available") return "Currently assigned to another job";
  return null;
}

export function formatBookingStart(startsAt) {
  const date = new Date(startsAt);
  if (!startsAt || Number.isNaN(date.getTime())) return "Date unavailable";
  const day = new Intl.DateTimeFormat("en-US", {
    timeZone: "Africa/Lagos",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
  const time = new Intl.DateTimeFormat("en-US", {
    timeZone: "Africa/Lagos",
    hour: "numeric",
    ...(date.getUTCMinutes() ? { minute: "2-digit" } : {}),
    hour12: true,
  }).format(date);
  return `${day} · ${time}`;
}

export function formatCountdown(seconds, includeHours = false) {
  if (seconds === null) return "—";
  const value = Math.max(0, seconds);
  const hours = Math.floor(value / 3600);
  const minutes = Math.floor(value / 60) % 60;
  const remaining = value % 60;
  return [
    ...(includeHours ? [hours] : []),
    includeHours ? minutes : Math.floor(value / 60),
    remaining,
  ].map((part) => String(part).padStart(2, "0")).join(":");
}

export function getBookingDeadline(booking) {
  if (booking.status === "pending") return booking.expiresAt;
  if (booking.status === "payment_pending") return booking.paymentExpiresAt;
  if (booking.status === "scheduled") return booking.startsAt;
  return null;
}
