import Modal from "../../../../components/Modal";
import Button from "../../../../components/button";
import { X } from "../icons";
import { formatBookingStart, getStaffEligibility } from "../utils/bookings";

export default function BookingAssignmentModal({ isOpen, booking, staff, staffMembers = [], onClose, onAssign }) {
  const candidates = (staffMembers.length ? staffMembers : [staff].filter(Boolean))
    .map((member) => ({ member, reason: getStaffEligibility(booking, member) }))
    .sort((a, b) => Number(Boolean(a.reason)) - Number(Boolean(b.reason)));
  const hasEligibleStaff = candidates.some((candidate) => !candidate.reason);

  return (
    <Modal isOpen={isOpen} onClose={onClose} closeIcon={<X size={21} />} title={`${booking.assignedStaff ? "Change staff for" : "Assign"} ${booking.service.toLowerCase()}`} panelClassName="beauty-booking-dialog beauty-assignment-dialog" titleClassName="beauty-booking-dialog-heading" contentClassName="beauty-booking-dialog-body">
      <p className="beauty-assignment-summary">{booking.customer} · {formatBookingStart(booking.startsAt)} · {booking.address}</p>
      <div className="beauty-booking-candidates" role="group" aria-label="Staff candidates">
        {candidates.map(({ member, reason }) => (
          <div key={member.id} className={`beauty-booking-candidate ${reason ? "is-unavailable" : ""}`}>
            <img className="beauty-staff-avatar" src={member.avatar} alt="" />
            <div className="beauty-booking-candidate-info">
              <h3>{member.name}</h3>
              <p>{member.distanceKm} km away · about {member.travelMinutes} min · {member.rating}★</p>
              <p>{member.role}</p>
              {reason && <p className="beauty-booking-ineligible">{reason}</p>}
            </div>
            <Button size="sm" className="beauty-button beauty-button-primary" aria-label={`Assign ${member.name}`} disabled={Boolean(reason)} onClick={() => onAssign(member.id)}>Assign</Button>
          </div>
        ))}
      </div>
      {!hasEligibleStaff && <p className="beauty-assignment-notice">{booking.assignedStaff ? "No other eligible staff are available to take over this booking." : "No eligible staff are available for this booking."}</p>}
    </Modal>
  );
}
