import { useEffect, useMemo, useState } from "react";
import BusinessDashboardLayout from "../layout/BusinessDashboardLayout";
import StatTileRow from "../components/StatTileRow";
import IncomingRequests from "../components/IncomingRequests";
import StaffClockRequests from "../components/StaffClockRequests";
import StaffOnDuty from "../components/StaffOnDuty";
import EarningsBarChart from "../components/EarningsBarChart";
import LiveActivityFeed from "../components/LiveActivityFeed";
import BookingDialogs from "../components/BookingDialogs";
import useBusinessBookings from "../hooks/useBusinessBookings";
import { useBusinessSession } from "../session/businessSessionContext";
import { getBusinessDashboardStats, getBusinessDashboardActivity } from "../../api/businessess";

export default function BusinessOverview() {
  const [search, setSearch] = useState("");
  const { business, refreshBusiness } = useBusinessSession();
  const flow = useBusinessBookings();
  const { now, bookings } = flow;
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    if (!business?._id) return;
    let active = true;
    getBusinessDashboardStats(business._id)
      .then((data) => { if (active) setStats(data); })
      .catch(() => {});
    getBusinessDashboardActivity(business._id, { limit: 5 })
      .then((data) => { if (active) setActivity(data?.activities || data || []); })
      .catch(() => {});
    return () => { active = false; };
  }, [business?._id]);

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

  // Adapt stats to StatTileRow expected shape if needed.
  const statTiles = stats
    ? [
        { label: "Earned today", value: stats.earnedToday ?? 0 },
        { label: "Bookings today", value: stats.bookingsToday?.total ?? 0 },
        { label: "Active bookings", value: stats.activeBookings?.total ?? 0 },
        { label: "Active staff", value: stats.activeStaff?.total ?? 0 },
        { label: "Rating", value: stats.rating?.average ?? 0 },
      ]
    : [];



  return (
    <BusinessDashboardLayout search={search} onSearchChange={setSearch}>
      <div className="business-page-heading">
        <h1>Overview</h1>
        <p>
          {today} · everything happening at {business?.BusinessName || "your business"} right now
        </p>
      </div>
      <StatTileRow stats={statTiles} />
      <div className="business-overview-grid">
        <StaffClockRequests businessId={business?._id} />
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
        
        <LiveActivityFeed activity={activity} search={search} />
      </div>
      <BookingDialogs flow={flow} />
    </BusinessDashboardLayout>
  );
}
