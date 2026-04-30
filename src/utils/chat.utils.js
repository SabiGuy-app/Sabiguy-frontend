/**
 * Unified list of booking statuses where messaging is permitted.
 * Both Customer and Provider should see the message button at these stages.
 */
export const MESSAGING_ALLOWED_STATUSES = [
  "provider_selected",
  "paid_escrow",
  "in_progress",
  "enroute_to_pickup",
  "arrived_at_pickup",
  "enroute_to_dropoff",
  "arrived_at_dropoff",
];

/**
 * Normalizes a status string to lowercase underscored format.
 */
export const normalizeStatus = (status) => {
  if (!status) return "";
  return String(status).trim().toLowerCase().replace(/\s+/g, "_");
};

/**
 * Checks if messaging is allowed for a given status.
 */
export const canMessage = (status) => {
  return MESSAGING_ALLOWED_STATUSES.includes(normalizeStatus(status));
};

/**
 * Format message date for dividers
 */
export const formatMessageDate = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  date.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  yesterday.setHours(0, 0, 0, 0);

  if (date.getTime() === today.getTime()) return "Today";
  if (date.getTime() === yesterday.getTime()) return "Yesterday";

  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

/**
 * Get initials for avatar placeholders
 */
export const getInitials = (name) => {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};
