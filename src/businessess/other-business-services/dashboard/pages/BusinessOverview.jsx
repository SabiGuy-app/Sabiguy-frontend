import { useEffect, useMemo, useState } from "react";
import BusinessDashboardLayout from "../layout/BusinessDashboardLayout";
import StatTileRow from "../components/StatTileRow";
import IncomingRequests from "../components/IncomingRequests";
import StaffOnDuty from "../components/StaffOnDuty";
import EarningsBarChart from "../components/EarningsBarChart";
import LiveActivityFeed from "../components/LiveActivityFeed";
import BookingDialogs from "../components/BookingDialogs";
import { mockBusinessOverview } from "../data/mockBusinessOverview";
import useBusinessBookings from "../hooks/useBusinessBookings";
import { useBusinessSession } from "../session/businessSessionContext";

export default function BusinessOverview() {
  const [search, setSearch] = useState("");
  const { stats, earnings, activity } = mockBusinessOverview;
  const { business, refreshBusiness } = useBusinessSession();
  const flow = useBusinessBookings();
  const { now, bookings } = flow;
  // Requests waiting on the business first, then anything that still needs staff.
  const overviewBookings = useMemo(
    () => bookings.filter((booking) => ["pending", "payment_pending", "accepted"].includes(booking.status)),
    [bookings],
  );

  // Staff on duty changes through the day, so refetch it on every visit.
  useEffect(() => {
    refreshBusiness();
  }, [refreshBusiness]);
  const today = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Lagos",
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date(now));



  return (
    <BusinessDashboardLayout search={search} onSearchChange={setSearch}>
      <div className="business-page-heading">
        <h1>Overview</h1>
        <p>
          {today} · everything happening at {business?.BusinessName || "your business"} right now
        </p>
      </div>
      <StatTileRow stats={stats} />
      <div className="business-overview-grid">
        <IncomingRequests
          bookings={overviewBookings}
          search={search}
          now={now}
          onView={flow.onView}
          onAssign={flow.onAssign}
          onDecline={(bookingId) =>
            flow.onConfirm("decline_booking", bookingId)
          }
        />
        <StaffOnDuty staffOnDuty={business ? business.staffsOnDuty ?? { count: 0, staff: [] } : null} search={search} />
        <EarningsBarChart earnings={earnings} />
        <LiveActivityFeed activity={activity} search={search} />
      </div>
      <BookingDialogs flow={flow} />
    </BusinessDashboardLayout>
  );
}
