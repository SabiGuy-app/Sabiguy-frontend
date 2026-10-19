import { useCallback, useState } from "react";
import { useSearchParams } from "react-router-dom";
import BeautyDashboardLayout from "../layout/BeautyDashboardLayout";
import BookingTabs from "../components/BookingTabs";
import BookingsTable from "../components/BookingsTable";
import BookingDialogs from "../components/BookingDialogs";
import { bookingTabs } from "../utils/bookings";
import useBookingFlow from "../hooks/useBookingFlow";

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
  const flow = useBookingFlow(selectTab);
  const bookings = flow.sessions.map((session) => session.booking);
  const tab = searchParams.get("tab");
  const selected = bookingTabs.some((item) => item.value === tab) ? tab : "requests";

  return (
    <BeautyDashboardLayout showAvailability={false} search={search} onSearchChange={setSearch}>
      <div className="beauty-page-heading">
        <h1>Bookings</h1>
        <p>Respond to requests, assign staff, follow every job to the end</p>
      </div>
      <BookingTabs bookings={bookings} selected={selected} onChange={selectTab} />
      <BookingsTable bookings={bookings} selected={selected} search={search} onView={flow.onView} />
      <BookingDialogs flow={flow} />
    </BeautyDashboardLayout>
  );
}
