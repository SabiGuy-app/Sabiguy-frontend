import Modal from "../../../../components/Modal";
import Button from "../../../../components/button";
import { MessageCircle, Phone, X } from "../icons";
import { bookingStatuses } from "../utils/status";
import { formatCountdown } from "../utils/bookings";
import BookingCustomer from "./BookingCustomer";
import BookingInformation from "./BookingInformation";
import BookingStaffCard from "./BookingStaffCard";
import StatusBadge from "./StatusBadge";

export default function BookingDetailsModal({ isOpen, booking, staff, staffMembers, seconds, available, onClose, onAction, onAssign, onConfirm, onMessage }) {
  const pending = booking.status === "pending";
  const upcoming = booking.status === "scheduled";
  const cancellable = ["pending", "accepted", "assigned", "en_route", "in_service", "scheduled"].includes(booking.status);
  const profile = booking.customerProfile ?? {};
  const serviceAction = booking.status === "assigned" && booking.serviceLocation === "customer_address"
    ? { label: "Mark en route", type: "staff_en_route" }
    : ["assigned", "en_route"].includes(booking.status)
      ? { label: "Start service", type: "start_service" }
      : booking.status === "in_service"
        ? { label: "Complete service", type: "complete_service" }
        : null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} closeIcon={<X size={21} />} title="Service Details" panelClassName="beauty-booking-dialog" titleClassName="beauty-booking-dialog-heading" contentClassName="beauty-booking-dialog-body">
      <BookingCustomer booking={booking} />
      {pending ? (
        <div className="beauty-booking-response-actions">
          <Button size="sm" className="beauty-button beauty-button-primary" disabled={!available || seconds === 0} onClick={() => onAction("accept_booking")}>Accept Request</Button>
          <Button variant="outline" size="sm" className="beauty-button beauty-button-secondary" disabled={seconds === 0} onClick={() => onConfirm("decline_booking")}>Decline</Button>
        </div>
      ) : (
        <div className="beauty-booking-contact-actions">
          {profile.phone ? (
            <a className="beauty-button beauty-button-secondary" href={`tel:${profile.phone}`}><Phone size={17} />Call</a>
          ) : <Button variant="outline" size="sm" className="beauty-button beauty-button-secondary" disabled title="Phone number unavailable"><Phone size={17} />Call</Button>}
          <Button variant="outline" size="sm" className="beauty-button beauty-button-secondary" disabled={!profile.messagingAvailable || !onMessage} title={profile.messagingAvailable && onMessage ? "Message customer" : "Messaging unavailable"} onClick={onMessage}><MessageCircle size={17} />Message</Button>
          {cancellable && <button type="button" className="beauty-booking-cancel-link" onClick={() => onConfirm("cancel_booking")}>Cancel Request</button>}
        </div>
      )}
      {pending && !available && <p className="beauty-assignment-notice">You’re currently unavailable for new bookings.</p>}
      <div className="beauty-booking-information-heading">
        <h3 className="beauty-booking-section-title">Booking Information</h3>
        {pending || upcoming ? (
          <div className="beauty-booking-countdown">
            <span>{pending ? "Time left to accept" : "Service Starts In:"}</span>
            <strong role="timer" aria-label={pending ? "Time left to accept" : "Time until service starts"}>{formatCountdown(seconds, upcoming)}</strong>
          </div>
        ) : <StatusBadge statuses={bookingStatuses} status={booking.status} />}
      </div>
      <BookingInformation booking={booking} />
      <section className="beauty-booking-staff-section" aria-label="Staff">
        <h3>Staff</h3>
        <BookingStaffCard booking={booking} staff={staff} staffMembers={staffMembers} />
      </section>
      <section className="beauty-booking-note-section" aria-label="Customer note">
        <h3>Customer note</h3>
        <p>{booking.customerNote || "No customer note."}</p>
      </section>
      {booking.status === "accepted" && <Button size="sm" className="beauty-button beauty-button-primary beauty-booking-footer-action" onClick={onAssign}>Assign staff</Button>}
      {upcoming && <Button size="sm" className="beauty-button beauty-button-primary beauty-booking-footer-action" onClick={onAssign}>Change staff</Button>}
      {serviceAction && <Button size="sm" className="beauty-button beauty-button-primary beauty-booking-footer-action" onClick={() => onAction(serviceAction.type)}>{serviceAction.label}</Button>}
      {booking.status === "payment_expired" && <p className="beauty-assignment-notice">Payment was not confirmed within the payment window.</p>}
      {booking.status === "expired" && <p className="beauty-assignment-notice">The response window for this request has expired.</p>}
    </Modal>
  );
}
