import { getStatus, staffStatuses } from "./status";

// Account statuses from GET /business/:businessId/staff. ACTIVE staff show
// their live workStatus instead.
const accountStatuses = {
  INVITED: { label: "Pending invite", tone: "pending" },
  DECLINED: { label: "Declined", tone: "declined" },
  EXPIRED: { label: "Invite expired", tone: "expired" },
  REMOVED: { label: "Removed", tone: "removed" },
  SUSPENDED: { label: "Suspended", tone: "suspended" },
};

export function getStaffMemberStatus(member) {
  if (member?.status === "ACTIVE") return getStatus(staffStatuses, member.workStatus);
  return accountStatuses[member?.status] ?? { label: member?.status || "Unknown", tone: "offline" };
}

// Invitees who haven't signed up yet have no name, only an email.
export const getStaffDisplayName = (member) => member?.name || member?.email || member?.staffCode || "Staff member";

export const getStaffInitials = (member) =>
  getStaffDisplayName(member)
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

// What a staff member is doing right now, for on-duty lists.
export function describeStaffActivity(member) {
  if (member?.workStatus === "offline") return "Offline";
  if (member?.workStatus === "available") {
    return `Free now · ${member.services?.length ? member.services.join(", ") : "Available for bookings"}`;
  }
  const job = member?.currentJob;
  return [job?.serviceName, job?.customerName].filter(Boolean).join(" · ") || "On a job";
}

// Names the invite endpoint accepts: the business's own service catalog.
export const getBusinessServiceNames = (business) => [
  ...new Set(
    (business?.service ?? [])
      .map((entry) => entry?.serviceName?.trim())
      .filter(Boolean),
  ),
];
