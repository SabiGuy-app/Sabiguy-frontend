import Modal from "../../../../components/Modal";
import BookingCustomer from "./BookingCustomer";
import BookingInformation from "./BookingInformation";
import { formatCountdown } from "../utils/bookings";
import { X } from "../icons";

export default function BookingPaymentModal({ isOpen, booking, seconds, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} closeIcon={<X size={21} />} title="Payment in Progress" panelClassName="business-booking-dialog business-payment-dialog" titleClassName="business-payment-title" contentClassName="business-booking-dialog-body">
      <p className="business-payment-description">The customer is completing payment. This booking will be confirmed once payment is received.</p>
      <div className="business-payment-countdown"><strong role="timer" aria-label="Payment window remaining">{formatCountdown(seconds)}</strong><p>Payment window remaining</p></div>
      <BookingCustomer booking={booking} />
      <h3 className="business-booking-section-title">Booking Information</h3>
      <BookingInformation booking={booking} />
      <p className="business-payment-footnote">We’ll notify you once payment is confirmed, then you can proceed with the booking.</p>
    </Modal>
  );
}
