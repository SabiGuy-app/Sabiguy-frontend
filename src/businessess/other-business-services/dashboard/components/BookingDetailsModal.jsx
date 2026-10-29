import Modal from "../../../../components/Modal";
import Button from "../../../../components/button";
import { MessageCircle, Phone, X } from "../icons";
import { bookingStatuses } from "../utils/status";
import { formatCountdown } from "../utils/bookings";
import { canAssignStaff } from "../utils/businessBookings";
import BookingCustomer from "./BookingCustomer";
import BookingInformation from "./BookingInformation";
import BookingStaffCard from "./BookingStaffCard";
import StatusBadge from "./StatusBadge";

export default function BookingDetailsModal({ isOpen, booking, seconds, available, busyAction, candidates, onClose, onAccept, onConfirm, onAssignStaff, onChooseStaff, onMessage }) {
  if (!booking) return null;
  const pending = booking.status === "pending";
  const upcoming = booking.status === "scheduled";
  const profile = booking.customerProfile ?? {};
  const busy = Boolean(busyAction);

  return (
    <Modal isOpen={isOpen} onClose={onClose} closeIcon={<X size={21} />} title="Service Details" panelClassName="business-booking-dialog" titleClassName="business-booking-dialog-heading" contentClassName="business-booking-dialog-body">
      <BookingCustomer booking={booking} />
      {pending ? (
        <div className="business-booking-response-actions">
          <Button size="sm" className="business-button business-button-primary" disabled={!available || seconds === 0 || busy} onClick={onAccept}>
            {busyAction === "accept" ? "Accepting..." : "Accept Request"}
          </Button>
          <Button variant="outline" size="sm" className="business-button business-button-secondary" disabled={seconds === 0 || busy} onClick={() => onConfirm("decline_booking")}>Decline</Button>
        </div>
      ) : (
        <div className="business-booking-contact-actions">
          {profile.phone ? (
            <a className="business-button business-button-secondary" href={`tel:${profile.phone}`}><Phone size={17} />Call</a>
          ) : <Button variant="outline" size="sm" className="business-button business-button-secondary" disabled title="Phone number unavailable"><Phone size={17} />Call</Button>}
          <Button variant="outline" size="sm" className="business-button business-button-secondary" disabled={!profile.messagingAvailable || !onMessage} title={profile.messagingAvailable && onMessage ? "Message customer" : "Messaging unavailable"} onClick={onMessage}><MessageCircle size={17} />Message</Button>
        </div>
      )}
      {pending && !available && <p className="business-assignment-notice">Turn on “Available for Jobs” to accept new bookings.</p>}
      <div className="business-booking-information-heading">
        <h3 className="business-booking-section-title">Booking Information</h3>
        {pending || upcoming ? (
          <div className="business-booking-countdown">
            <span>{pending ? "Time left to accept" : "Service Starts In:"}</span>
            <strong role="timer" aria-label={pending ? "Time left to accept" : "Time until service starts"}>{formatCountdown(seconds, upcoming)}</strong>
          </div>
        ) : <StatusBadge statuses={bookingStatuses} status={booking.status} />}
      </div>
      <BookingInformation booking={booking} />
      <section className="business-booking-staff-section" aria-label="Staff">
        <h3>Staff</h3>
        <BookingStaffCard
          booking={booking}
          candidates={candidates}
          canAssign={canAssignStaff(booking)}
          busy={busy}
          onAssignStaff={onAssignStaff}
          onChooseStaff={onChooseStaff}
        />
      </section>
      <section className="business-booking-note-section" aria-label="Customer note">
        <h3>Customer note</h3>
        <p>{booking.customerNote || "No customer note."}</p>
      </section>
      {booking.status === "payment_expired" && <p className="business-assignment-notice">Payment was not confirmed within the payment window.</p>}
      {booking.status === "expired" && <p className="business-assignment-notice">The response window for this request has expired.</p>}
      {booking.status === "declined" && <p className="business-assignment-notice">You declined this request.</p>}
    </Modal>
  );
}
