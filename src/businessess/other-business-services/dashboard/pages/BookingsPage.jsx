import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import BusinessDashboardLayout from "../layout/BusinessDashboardLayout";
import BookingTabs from "../components/BookingTabs";
import BookingsTable from "../components/BookingsTable";
import BookingDialogs from "../components/BookingDialogs";
import { bookingTabs } from "../utils/bookings";
import useBusinessBookings from "../hooks/useBusinessBookings";

export default function BookingsPage() {
  const [search, setSearch] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const selectTab = useCallback((value) => {
    setSearchParams((previous) => {
      const next = new URLSearchParams(previous);
      next.set("tab", value);
      return next;
    });
  }, [setSearchParams]);
  const flow = useBusinessBookings({ onStatusChange: selectTab });
  const { bookings, loading, error, reload, onView } = flow;
  const tab = searchParams.get("tab");
  const selected = bookingTabs.some((item) => item.value === tab) ? tab : "requests";

  // ?booking=<id> comes from a booking-request notification: open it once loaded.
  const requestedBookingId = searchParams.get("booking");
  useEffect(() => {
    if (!requestedBookingId || loading) return;
    if (bookings.some((item) => item.id === requestedBookingId)) onView(requestedBookingId);
    setSearchParams((previous) => {
      const next = new URLSearchParams(previous);
      next.delete("booking");
      return next;
    }, { replace: true });
  }, [requestedBookingId, loading, bookings, onView, setSearchParams]);

  return (
    <BusinessDashboardLayout showAvailability={false} search={search} onSearchChange={setSearch}>
      <div className="business-page-heading">
        <h1>Bookings</h1>
        <p>Respond to requests, assign staff, follow every job to the end</p>
      </div>
      <BookingTabs bookings={bookings} selected={selected} onChange={selectTab} />
      {loading ? (
        <p className="business-empty" role="status">Loading bookings...</p>
      ) : error ? (
        <p className="business-empty" role="alert">
          {error}{" "}
          <button type="button" className="business-card-link" onClick={() => reload()}>Try again</button>
        </p>
      ) : (
        <BookingsTable bookings={bookings} selected={selected} search={search} onView={onView} />
      )}
      <BookingDialogs flow={flow} />
    </BusinessDashboardLayout>
  );
}
