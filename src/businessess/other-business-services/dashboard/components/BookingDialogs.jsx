import Modal from "../../../../components/Modal";
import Button from "../../../../components/button";
import { X } from "../icons";
import BookingDetailsModal from "./BookingDetailsModal";
import BookingPaymentModal from "./BookingPaymentModal";
import BookingAssignmentModal from "./BookingAssignmentModal";
import "../layout/beautyBookings.css";

export default function BookingDialogs({ flow }) {
  const { booking, staff, staffMembers, seconds, available, dialog, confirmation, onClose, onAssign, onConfirm, onClearConfirmation, handleAction } = flow;
  const canConfirm = confirmation === "decline_booking"
    ? booking.status === "pending"
    : ["pending", "accepted", "assigned", "en_route", "in_service", "scheduled"].includes(booking.status);

  return (
    <>
      <BookingDetailsModal
        isOpen={dialog === "details"}
        booking={booking}
        staff={staff}
        staffMembers={staffMembers}
        seconds={seconds}
        available={available}
        onClose={onClose}
        onAction={handleAction}
        onAssign={onAssign}
        onConfirm={onConfirm}
      />
      <BookingPaymentModal isOpen={dialog === "payment" && booking.status === "payment_pending"} booking={booking} seconds={seconds} onClose={onClose} />
      <BookingAssignmentModal isOpen={dialog === "assign" && ["accepted", "scheduled"].includes(booking.status)} booking={booking} staff={staff} staffMembers={staffMembers} onClose={onClose} onAssign={(staffId) => handleAction("assign_staff", { staffId })} />
      <Modal isOpen={Boolean(confirmation) && canConfirm} onClose={onClearConfirmation} closeIcon={<X size={21} />} title={confirmation === "decline_booking" ? "Decline this request?" : "Cancel this booking?"}>
        <p className="beauty-modal-copy">{confirmation === "decline_booking" ? `Decline ${booking.customer}’s request?` : `Cancel ${booking.customer}’s booking? Any assigned staff member will be released.`}</p>
        <div className="beauty-modal-actions">
          <Button variant="outline" size="sm" className="beauty-button beauty-button-secondary" onClick={onClearConfirmation}>Keep booking</Button>
          <Button size="sm" className="beauty-button beauty-button-primary" onClick={() => handleAction(confirmation)}>{confirmation === "decline_booking" ? "Decline request" : "Confirm cancellation"}</Button>
        </div>
      </Modal>
    </>
  );
}
