import { useMemo, useState } from "react";
import FleetDashboardLayout from "../layout/FleetDashboardLayout";
import StatTileRow from "../components/StatTileRow";
import TripsFilterBar from "../components/TripsFilterBar";
import TripsList from "../components/TripsList";
import TripDetailModal from "../components/TripDetailModal";
import { mockTripStats, mockDrivers, mockTrips } from "../data/mockTrips";
import { formatNaira } from "../utils/format";

const TRIP_DETAIL_STATUSES = ["completed", "cancelled_driver", "cancelled_passenger"];

const isCancelled = (status) => status === "cancelled_driver" || status === "cancelled_passenger";

const CSV_HEADERS = ["From", "To", "Driver", "Vehicle", "Time", "Duration", "Status", "Fare", "Rating"];

const tripToCsvRow = (trip) =>
  [
    trip.from,
    trip.to,
    trip.driver,
    trip.vehicleReg,
    trip.time,
    trip.duration || "",
    trip.status,
    trip.fare ?? "",
    trip.rating ?? "",
  ]
    .map((value) => `"${String(value).replace(/"/g, '""')}"`)
    .join(",");

const downloadCsv = (trips) => {
  const csv = [CSV_HEADERS.join(","), ...trips.map(tripToCsvRow)].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "trips.csv";
  link.click();
  URL.revokeObjectURL(url);
};


export default function TripsPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [driverFilter, setDriverFilter] = useState("all");
  const [selectedTrip, setSelectedTrip] = useState(null);

  const openTripDetail = (trip) => {
    if (TRIP_DETAIL_STATUSES.includes(trip.status)) setSelectedTrip(trip);
  };

  const filteredTrips = useMemo(() => {
    return mockTrips.filter((trip) => {
      if (statusFilter === "completed" && trip.status !== "completed") return false;
      if (statusFilter === "cancelled" && !isCancelled(trip.status)) return false;
      if (driverFilter !== "all" && trip.driver !== driverFilter) return false;
      return true;
    });
  }, [statusFilter, driverFilter]);

  const counts = {
    all: mockTripStats.totalCount,
    completed: mockTripStats.completed,
    cancelled: mockTripStats.cancelled,
  };

  const stats = [
    { id: "completed", label: "Completed", value: String(mockTripStats.completed) },
    {
      id: "cancelled",
      label: "Cancelled",
      value: String(mockTripStats.cancelled),
      valueTone: "red",
    },
    {
      id: "cancellationRate",
      label: "Cancellation Rate",
      value: `${mockTripStats.cancellationRate}%`,
      valueTone: "red",
    },
    {
      id: "grossFares",
      label: "Gross Fares",
      value: formatNaira(mockTripStats.grossFares),
      valueTone: "green",
    },
    {
      id: "averageFare",
      label: "Average Fare",
      value: formatNaira(mockTripStats.averageFare),
    },
  ];

  return (
    <FleetDashboardLayout>
      <div className="mb-5">
        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">Trips</h1>
        <p className="mt-1 text-sm text-gray-500">
          Full lifecycle, completed and cancelled trips, live
        </p>
      </div>

      <div className="space-y-5">
        <StatTileRow stats={stats} />

        <TripsFilterBar
          activeFilter={statusFilter}
          onFilterChange={setStatusFilter}
          counts={counts}
          drivers={mockDrivers}
          driverFilter={driverFilter}
          onDriverFilterChange={setDriverFilter}
          onExport={() => downloadCsv(filteredTrips)}
        />

        <TripsList trips={filteredTrips} onTripClick={openTripDetail} />
      </div>

      <TripDetailModal trip={selectedTrip} onClose={() => setSelectedTrip(null)} />
    </FleetDashboardLayout>
  );
}
