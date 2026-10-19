import DashboardCard from "./DashboardCard";
import StatusBadge from "./StatusBadge";
import { beautyDashboardPath } from "../layout/beautyNavLinks";
import { getStatus, staffStatuses } from "../utils/status";

export default function StaffOnDuty({ staff, search }) {
  const status = getStatus(staffStatuses, staff.status);
  const description = staff.status === "offline"
    ? "Offline today"
    : staff.status === "available"
      ? `Free now · ${staff.skills?.length ? staff.skills.join(", ") : "Available for bookings"}`
      : [staff.service, staff.customer].filter(Boolean).join(" · ");
  const matchesSearch = `${staff.name} ${description} ${status.label}`
    .toLowerCase()
    .includes(search.toLowerCase().trim());
  return (
    <DashboardCard title="Staff on duty" action="Manage staff" to={`${beautyDashboardPath}/staff`} className="beauty-staff-card">
      {matchesSearch ? <div className="beauty-staff-row">
        <img src={staff.avatar} alt="" className="beauty-staff-avatar" />
        <div className="beauty-staff-info"><h3>{staff.name}</h3><p title={description}>{description || "No current booking"}</p></div>
        <StatusBadge statuses={staffStatuses} status={staff.status} />
      </div> : <p className="beauty-empty">No staff match your search.</p>}
    </DashboardCard>
  );
}
