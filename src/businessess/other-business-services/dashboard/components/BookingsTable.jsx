import Button from "../../../../components/button";
import StatusBadge from "./StatusBadge";
import { bookingStatuses } from "../utils/status";
import { formatNaira } from "../utils/format";
import { formatBookingStart, getBookingTab } from "../utils/bookings";

export default function BookingsTable({ bookings, selected, search, onView }) {
  const requests = selected === "requests";
  const tabBookings = bookings.filter((booking) => getBookingTab(booking.status) === selected);
  const visible = tabBookings.filter((booking) => [booking.customer, booking.service, booking.address, booking.assignedStaff?.name, booking.requestedStaff, bookingStatuses[booking.status]?.label]
    .filter(Boolean).join(" ").toLowerCase().includes(search.toLowerCase().trim()));

  return (
    <div className="business-bookings-table-scroll" role="region" aria-label="Bookings table" tabIndex={0}>
      <table className="business-bookings-table">
        <caption className="sr-only">{selected} bookings</caption>
        <thead>
          <tr>
            <th scope="col">Customer</th>
            <th scope="col">Service</th>
            <th scope="col">Service Location</th>
            <th scope="col">Date &amp; Time</th>
            <th scope="col">Location</th>
            <th scope="col">{requests ? "Requested Staff" : "Staff"}</th>
            <th scope="col">Amount</th>
            {!requests && <th scope="col">Status</th>}
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {visible.length ? visible.map((booking) => (
            <tr key={booking.id}>
              <td className="business-booking-customer-name">{booking.customer}</td>
              <td>{booking.service}</td>
              <td>{booking.serviceLocation === "in_salon" ? "Walk in salon" : "Customer’s Address"}</td>
              <td>{formatBookingStart(booking.startsAt)}</td>
              <td><span className="business-booking-address" title={booking.address}>{booking.address}</span></td>
              <td>{requests ? booking.requestedStaff || "—" : booking.assignedStaff?.name || "—"}</td>
              <td className="business-booking-amount">{formatNaira(booking.amount)}</td>
              {!requests && <td>{booking.status === "accepted" ? <span className="business-status business-booking-needs-staff">Needs staff</span> : <StatusBadge statuses={bookingStatuses} status={booking.status} />}</td>}
              <td>
                <div className="business-booking-row-actions">
                  <Button size="sm" className="business-button business-button-primary" onClick={() => onView(booking.id)}>{booking.status === "payment_pending" ? "View payment" : "View Details"}</Button>
                </div>
              </td>
            </tr>
          )) : (
            <tr><td className="business-booking-table-empty" colSpan={requests ? 8 : 9}>{tabBookings.length ? "No bookings match your search." : `No ${selected === "completed" ? "completed or closed" : selected} bookings.`}</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
