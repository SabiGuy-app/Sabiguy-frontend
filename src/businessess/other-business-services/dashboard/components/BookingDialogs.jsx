import Modal from "../../../../components/Modal";
import Button from "../../../../components/button";
import { X } from "../icons";
import BookingDetailsModal from "./BookingDetailsModal";
import BookingPaymentModal from "./BookingPaymentModal";
import BookingAssignmentModal from "./BookingAssignmentModal";
import { canAssignStaff } from "../utils/businessBookings";
import "../layout/businessBookings.css";

// flow: the object returned by useBusinessBookings.
export default function BookingDialogs({ flow }) {
  const { booking, seconds, available, dialog, confirmation, busyAction, candidates, onClose, onAssign, onClearConfirmation, onConfirm, onAccept, onDecline, onAssignStaff } = flow;
  if (!booking) return null;

  return (
    <>
      <BookingDetailsModal
        isOpen={dialog === "details"}
        booking={booking}
        seconds={seconds}
        available={available}
        busyAction={busyAction}
        candidates={candidates}
        onClose={onClose}
        onAccept={onAccept}
        onConfirm={onConfirm}
        onAssignStaff={onAssignStaff}
        onChooseStaff={() => onAssign(booking.id)}
      />
      <BookingPaymentModal isOpen={dialog === "payment" && booking.status === "payment_pending"} booking={booking} seconds={seconds} onClose={onClose} />
      <BookingAssignmentModal
        isOpen={dialog === "assign" && canAssignStaff(booking)}
        booking={booking}
        candidates={candidates}
        busy={Boolean(busyAction)}
        onClose={onClose}
        onAssign={onAssignStaff}
      />
      <Modal isOpen={confirmation === "decline_booking" && booking.status === "pending"} onClose={onClearConfirmation} closeIcon={<X size={21} />} title="Decline this request?">
        <p className="business-modal-copy">Decline {booking.customer}’s request? They’ll be told you can’t take it.</p>
        <div className="business-modal-actions">
          <Button variant="outline" size="sm" className="business-button business-button-secondary" onClick={onClearConfirmation}>Keep booking</Button>
          <Button size="sm" className="business-button business-button-primary" disabled={Boolean(busyAction)} onClick={onDecline}>
            {busyAction === "decline" ? "Declining..." : "Decline request"}
          </Button>
        </div>
      </Modal>
    </>
  );
}
