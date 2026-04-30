/**
 * Unified list of booking statuses where messaging is permitted.
 * Both Customer and Provider should see the message button at these stages.
 */
export const MESSAGING_ALLOWED_STATUSES = [
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

/**
 * Format a timestamp to a localized time string (e.g. "2:30 PM")
 */
export const formatTime = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

/**
 * Format a timestamp to a relative time string (e.g. "5m ago", "2h ago")
 */
export const formatRelativeTime = (timestamp) => {
  if (!timestamp) return "";
  const now = new Date();
  const date = new Date(timestamp);
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
};
