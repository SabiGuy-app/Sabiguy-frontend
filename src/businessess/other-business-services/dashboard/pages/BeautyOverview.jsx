import { useState } from "react";
import BeautyDashboardLayout from "../layout/BeautyDashboardLayout";
import StatTileRow from "../components/StatTileRow";
import IncomingRequests from "../components/IncomingRequests";
import StaffOnDuty from "../components/StaffOnDuty";
import EarningsBarChart from "../components/EarningsBarChart";
import LiveActivityFeed from "../components/LiveActivityFeed";
import BookingDialogs from "../components/BookingDialogs";
import { mockBeautyOverview } from "../data/mockBeautyOverview";
import useBookingFlow from "../hooks/useBookingFlow";

export default function BeautyOverview() {
  const [search, setSearch] = useState("");
  const { business, stats, earnings } = mockBeautyOverview;
  const flow = useBookingFlow();
  const { staff, activity, now } = flow;
  const overviewBookings = flow.sessions.slice(0, 2).map((session) => session.booking);
  const today = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Lagos",
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date(now));

  return (
    <BeautyDashboardLayout search={search} onSearchChange={setSearch}>
      <div className="beauty-page-heading">
        <h1>Overview</h1>
        <p>{today} · everything happening at {business.name} right now</p>
      </div>
      <StatTileRow stats={stats} />
      <div className="beauty-overview-grid">
        <IncomingRequests
          bookings={overviewBookings}
          search={search}
          now={now}
          onView={flow.onView}
          onAssign={flow.onAssign}
          onDecline={(bookingId) => flow.onConfirm("decline_booking", bookingId)}
        />
        <StaffOnDuty staff={staff} search={search} />
        <EarningsBarChart earnings={earnings} />
        <LiveActivityFeed activity={activity} search={search} />
      </div>
      <BookingDialogs flow={flow} />
    </BeautyDashboardLayout>
  );
}
