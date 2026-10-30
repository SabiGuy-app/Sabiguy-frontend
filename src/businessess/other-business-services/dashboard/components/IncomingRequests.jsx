import Button from "../../../../components/button";
import { House } from "../icons";
import { formatNaira } from "../utils/format";
import { formatBookingStart } from "../utils/bookings";
import { businessDashboardPath } from "../layout/businessNavLinks";
import DashboardCard from "./DashboardCard";
import StatusBadge from "./StatusBadge";
import ResponseCountdown from "./ResponseCountdown";
import { bookingStatuses, getStatus } from "../utils/status";

const closedStatuses = ["declined", "cancelled", "completed", "expired", "payment_expired"];

export default function IncomingRequests({ bookings, search, now, onView, onAssign, onDecline }) {
  const incoming = bookings.filter((booking) => !closedStatuses.includes(booking.status));
  return (
    <DashboardCard title="Incoming Requests" count={incoming.length} action="All bookings" to={`${businessDashboardPath}/bookings`} className="business-requests-card">
      <div className="business-requests-body">
        {incoming.length ? incoming.map((booking) => (
          <IncomingRequest key={booking.id} booking={booking} search={search} now={now}
            onView={() => onView(booking.id)} onAssign={() => onAssign(booking.id)} onDecline={() => onDecline(booking.id)} />
        )) : <p className="business-empty" role="status">No incoming requests.</p>}
      </div>
    </DashboardCard>
  );
}

function IncomingRequest({ booking, search, now, onView, onAssign, onDecline }) {
  const isPending = booking.status === "pending";
  const paymentPending = booking.status === "payment_pending";
  const needsAssignment = booking.status === "accepted" && !booking.assignedStaff && booking.paymentStatus === "paid";
  const isClosed = ["declined", "cancelled", "completed", "expired", "payment_expired"].includes(booking.status);
  const status = getStatus(bookingStatuses, booking.status);
  const isInSalon = booking.serviceLocation === "in_salon";
  const staffMessage = needsAssignment
    ? "Accepted, but nobody is assigned yet"
    : booking.assignedStaff
      ? `Assigned to ${booking.assignedStaff.name}`
      : isPending && booking.requestedStaff
        ? `Customer requested for ${booking.requestedStaff}`
        : status.label;
  const matchesSearch =
    `${booking.service} ${booking.customer} ${booking.requestedStaff ?? ""} ${booking.address} ${booking.assignedStaff?.name ?? ""} ${status.label}`
      .toLowerCase()
      .includes(search.toLowerCase().trim());
  const emptyMessage = booking.status === "expired"
    ? "This request expired before it was accepted."
    : booking.status === "payment_expired"
      ? "The payment window for this booking expired."
      : isClosed ? "No incoming requests." : "No requests match your search.";

  return (
    <>
        {!isClosed && matchesSearch ? (
          <article className="business-request">
            <div className="business-request-heading">
              <div className="business-request-service">
                <h3>{booking.service}</h3>
                <span className={`business-location-badge ${isInSalon ? "business-location-badge--salon" : ""}`}>
                  <House size={13} />{isInSalon ? "Walk in Salon" : booking.location}
                </span>
              </div>
              <strong className="business-request-price">{formatNaira(booking.amount)}</strong>
            </div>
            <p className="business-request-meta">
              {booking.customer} · {formatBookingStart(booking.startsAt)} · {booking.address}
            </p>
            {isPending && <ResponseCountdown booking={booking} now={now} />}
            <div className="business-request-footer">
              <p className={needsAssignment ? "business-unassigned-message" : ""} role="status">{staffMessage}</p>
              <div className="business-request-actions">
                {isPending && <Button variant="outline" size="sm" className="business-button business-button-secondary" onClick={onDecline}>Decline</Button>}
                {!isPending && !needsAssignment && <StatusBadge statuses={bookingStatuses} status={booking.status} />}
                {!needsAssignment && <Button size="sm" className="business-button business-button-primary" onClick={onView}>{paymentPending ? "View payment" : "View Details"}</Button>}
                {needsAssignment && <Button size="sm" className="business-button business-button-primary" onClick={onAssign}>Assign staff</Button>}
              </div>
            </div>
          </article>
        ) : <p className="business-empty" role="status">{emptyMessage}</p>}
    </>
  );
}
