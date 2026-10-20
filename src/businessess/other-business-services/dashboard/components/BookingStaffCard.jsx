import StatusBadge from "./StatusBadge";
import { staffStatuses } from "../utils/status";

export default function BookingStaffCard({ booking, staff, staffMembers = [] }) {
  const requested = Boolean(booking.requestedStaff);
  const id = requested ? booking.requestedStaffId : booking.assignedStaff?.id;
  const name = requested ? booking.requestedStaff : booking.assignedStaff?.name;
  if (!name) return <p className="beauty-booking-muted">No staff preference.</p>;
  const member = staffMembers.find((candidate) => candidate.id === id) ?? (staff?.id === id ? staff : null);
  const differentAssignee = requested && booking.assignedStaff && booking.assignedStaff.id !== id;

  return (
    <>
      <div className="beauty-booking-staff-card">
        {member && <img className="beauty-staff-avatar" src={member.avatar} alt="" />}
        <div><p>{requested ? "Customer asked for" : "Assigned staff"}</p><strong>{name}</strong></div>
        {member ? <StatusBadge statuses={staffStatuses} status={member.status} /> : <span className="beauty-booking-muted">Availability unknown</span>}
      </div>
      {differentAssignee && <p className="beauty-booking-assigned-summary">Assigned staff: <strong>{booking.assignedStaff.name}</strong></p>}
    </>
  );
}
