export const staffStatuses = {
  en_route: { label: "En route", tone: "en-route" },
  in_service: { label: "In service", tone: "in-service" },
  available: { label: "Available", tone: "available" },
  assigned: { label: "Assigned", tone: "assigned" },
  offline: { label: "Offline", tone: "offline" },
};

export const bookingStatuses = {
  pending: { label: "Awaiting response", tone: "pending" },
  accepted: { label: "Accepted", tone: "accepted" },
  assigned: { label: "Staff assigned", tone: "assigned" },
  en_route: { label: "Staff en route", tone: "assigned" },
  in_service: { label: "In service", tone: "in-service" },
  completed: { label: "Completed", tone: "completed" },
  cancelled: { label: "Cancelled", tone: "offline" },
  declined: { label: "Declined", tone: "offline" },
  expired: { label: "Expired", tone: "offline" },
  payment_pending: { label: "Payment in progress", tone: "pending" },
  payment_expired: { label: "Payment expired", tone: "offline" },
  scheduled: { label: "Scheduled", tone: "pending" },
};

export function getStatus(statuses, status) {
  return Object.hasOwn(statuses, status) ? statuses[status] : { label: "Status unavailable", tone: "offline" };
}
