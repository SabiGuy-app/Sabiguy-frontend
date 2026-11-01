import Modal from "../../../../components/Modal";
import Button from "../../../../components/button";
import { X } from "../icons";
import { formatBookingStart } from "../utils/bookings";
import { formatCandidateMeta, getCandidateIneligibility } from "../utils/businessBookings";

const FALLBACK_AVATAR = "/avatar.png";

// candidates: { list, loading, error } from the staff-candidates endpoint,
// already sorted eligible-first and by distance.
export default function BookingAssignmentModal({ isOpen, booking, candidates, busy, onClose, onAssign }) {
  if (!booking) return null;
  const rows = candidates.list.map((member) => ({ member, reason: getCandidateIneligibility(member) }));
  const hasEligibleStaff = rows.some((row) => !row.reason);

  return (
    <Modal isOpen={isOpen} onClose={onClose} closeIcon={<X size={21} />} title={`Assign staff for ${booking.service.toLowerCase()}`} panelClassName="business-booking-dialog business-assignment-dialog" titleClassName="business-booking-dialog-heading" contentClassName="business-booking-dialog-body">
      <p className="business-assignment-summary">{booking.customer} · {formatBookingStart(booking.startsAt)} · {booking.address}</p>
      {candidates.loading && <p className="business-booking-muted">Loading your staff...</p>}
      {candidates.error && <p className="business-assignment-notice">{candidates.error}</p>}
      {!candidates.loading && !candidates.error && (
        <div className="business-booking-candidates" role="group" aria-label="Staff candidates">
          {rows.map(({ member, reason }) => (
            <div key={member.staffId} className={`business-booking-candidate ${reason ? "is-unavailable" : ""}`}>
              <img className="business-staff-avatar" src={member.avatar || FALLBACK_AVATAR} alt="" />
              <div className="business-booking-candidate-info">
                <h3>{member.name}</h3>
                {formatCandidateMeta(member) && <p>{formatCandidateMeta(member)}</p>}
                <p>{[member.role, member.staffCode].filter(Boolean).join(" · ")}</p>
                {member.staffCode && member.staffCode === booking.requestedStaffCode && (
                  <span className="business-booking-requested-tag">Requested by customer</span>
                )}
                {reason && <p className="business-booking-ineligible">{reason}</p>}
              </div>
              <Button size="sm" className="business-button business-button-primary" aria-label={`Assign ${member.name}`} disabled={Boolean(reason) || busy} onClick={() => onAssign(member.staffId)}>Assign</Button>
            </div>
          ))}
        </div>
      )}
      {!candidates.loading && !candidates.error && !hasEligibleStaff && (
        <p className="business-assignment-notice">
          {rows.length ? "No eligible staff are available for this booking." : "You have no active staff yet. Invite staff from the Staff page."}
        </p>
      )}
    </Modal>
  );
}
