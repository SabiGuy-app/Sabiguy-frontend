import DashboardCard from "./DashboardCard";
import StatusBadge from "./StatusBadge";
import { businessDashboardPath } from "../layout/businessNavLinks";
import { getStatus, staffStatuses } from "../utils/status";
import { describeStaffActivity } from "../utils/staffMembers";

const FALLBACK_AVATAR = "/avatar.png";

// staffOnDuty: the business's `staffsOnDuty` ({ count, staff }); null while loading.
export default function StaffOnDuty({ staffOnDuty, search }) {
  const staff = staffOnDuty?.staff ?? [];
  const query = search.toLowerCase().trim();
  const rows = staff
    .map((member) => ({ member, description: describeStaffActivity(member) }))
    .filter(({ member, description }) =>
      `${member.name} ${member.role} ${description} ${getStatus(staffStatuses, member.workStatus).label}`
        .toLowerCase()
        .includes(query),
    );

  let content;
  if (!staffOnDuty) content = <p className="business-empty">Loading staff...</p>;
  else if (staff.length === 0) content = <p className="business-empty">No staff on duty right now.</p>;
  else if (rows.length === 0) content = <p className="business-empty">No staff match your search.</p>;
  else {
    content = (
      <div className="business-staff-list">
        {rows.map(({ member, description }) => (
          <div key={member.staffId} className="business-staff-row">
            <img
              src={member.avatar || FALLBACK_AVATAR}
              alt=""
              className="business-staff-avatar"
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = FALLBACK_AVATAR;
              }}
            />
            <div className="business-staff-info"><h3>{member.name}</h3><p title={description}>{description}</p></div>
            <StatusBadge statuses={staffStatuses} status={member.workStatus} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <DashboardCard title="Staff on duty" count={staffOnDuty?.count} action="Manage staff" to={`${businessDashboardPath}/staff`} className="business-staff-card">
      {content}
    </DashboardCard>
  );
}
