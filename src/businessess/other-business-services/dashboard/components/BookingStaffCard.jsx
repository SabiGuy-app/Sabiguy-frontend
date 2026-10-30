import Button from "../../../../components/button";
import StatusBadge from "./StatusBadge";
import { staffStatuses } from "../utils/status";
import { formatCandidateMeta, getCandidateIneligibility } from "../utils/businessBookings";

const FALLBACK_AVATAR = "/avatar.png";

// Requested staff (from requestedStaffCode) with their details, plus who is
// assigned. When assignment is open the business can take the requested
// staff member or pick someone else.
export default function BookingStaffCard({ booking, candidates, canAssign, busy, onAssignStaff, onChooseStaff }) {
  const assigned = booking.assignedStaffList ?? [];
  const code = booking.requestedStaffCode;

  if (!code) {
    return (
      <>
        {assigned.length ? (
          <p className="business-booking-assigned-summary">Assigned staff: <strong>{assigned.map((item) => item.name).join(", ")}</strong></p>
        ) : <p className="business-booking-muted">No staff preference.</p>}
        {canAssign && (
          <div className="business-booking-staff-actions">
            <Button size="sm" className="business-button business-button-primary" disabled={busy} onClick={onChooseStaff}>
              {assigned.length ? "Assign another staff" : "Assign staff"}
            </Button>
          </div>
        )}
      </>
    );
  }

  const candidate = candidates.list.find((item) => item.staffCode === code) ?? null;
  const member = booking.requestedStaffMember;
  const details = candidate ?? member;
  const staffId = String(candidate?.staffId ?? member?.staffId ?? "");
  const isAssigned = Boolean(staffId) && assigned.some((item) => item.id === staffId);
  const reason = candidate ? getCandidateIneligibility(candidate) : null;
  const meta = formatCandidateMeta(candidate);
  const firstName = details?.name?.split(" ")[0] || code;

  return (
    <>
      <div className="business-booking-staff-card">
        <img className="business-staff-avatar" src={details?.avatar || FALLBACK_AVATAR} alt="" />
        <div>
          <p>Customer asked for</p>
          <strong>{details?.name || code}</strong>
          <p className="business-booking-staff-meta">
            {[code, details?.role].filter(Boolean).join(" · ")}
            {meta && ` · ${meta}`}
          </p>
          {!details && !candidates.loading && (
            <p className="business-booking-staff-meta">This staff code isn’t on your active team.</p>
          )}
          {reason && !isAssigned && <p className="business-booking-staff-meta">{reason}</p>}
        </div>
        {isAssigned
          ? <span className="business-status business-status--assigned">Assigned</span>
          : member?.workStatus
            ? <StatusBadge statuses={staffStatuses} status={member.workStatus} />
            : <span className="business-booking-muted">{candidates.loading ? "Checking..." : "Availability unknown"}</span>}
      </div>
      {assigned.length > 0 && !(assigned.length === 1 && isAssigned) && (
        <p className="business-booking-assigned-summary">Assigned staff: <strong>{assigned.map((item) => item.name).join(", ")}</strong></p>
      )}
      {canAssign ? (
        <div className="business-booking-staff-actions">
          <Button
            size="sm"
            className="business-button business-button-primary"
            disabled={busy || !candidate || Boolean(reason) || isAssigned}
            onClick={() => onAssignStaff(candidate.staffId)}
          >
            {isAssigned ? `${firstName} assigned` : `Assign ${firstName}`}
          </Button>
          <Button variant="outline" size="sm" className="business-button business-button-secondary" disabled={busy} onClick={onChooseStaff}>
            Choose another staff
          </Button>
        </div>
      ) : booking.status === "pending" && (
        <p className="business-booking-assigned-summary">Accept the request to assign staff.</p>
      )}
    </>
  );
}
