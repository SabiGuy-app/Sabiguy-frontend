import { useState } from "react";
import { Plus, MoreHorizontal } from "lucide-react";
import FleetDashboardLayout from "../layout/FleetDashboardLayout";
import AddVehicleModal from "../components/AddVehicleModal";
import Pagination from "../components/Pagination";

export default function VehiclesPage({
  vehicles = MOCK_VEHICLES,
  registeredCount,
  roadReadyCount,
  page = 1,
  totalPages = 10,
  onPageChange = () => {},
  onAddVehicle = () => {},
  onChangeDriver = () => {},
  onRemoveDriver = () => {},
  onAssignDriver = () => {},
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const registered = registeredCount ?? vehicles.length;
  const roadReady =
    roadReadyCount ?? vehicles.filter((v) => v.status === "active").length;

  function handleAddVehicle(newVehicle) {
    onAddVehicle(newVehicle);
    setIsModalOpen(false);
  }

  return (
    <FleetDashboardLayout>
      <div className="mb-6">
        <h1 className="text-[24px] font-semibold text-[#231F20]">Vehicles</h1>
        <p className="mt-1 text-[16px] text-[#231F20BF]">
          {registered} registered · {roadReady} road ready
        </p>
      </div>

      <div className="rounded-xl border border-[#231F2026] bg-white">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 className="text-[20px] font-semibold text-[#231F20]">Fleet</h2>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 rounded-md bg-[#33794F] px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#004a1d]"
          >
            <Plus className="h-4 w-4" />
            Add Vehicle
          </button>
        </div>

        <ul>
          {vehicles.map((vehicle) => (
            <VehicleRow
              key={vehicle.id}
              vehicle={vehicle}
              onChangeDriver={() => onChangeDriver(vehicle)}
              onRemoveDriver={() => onRemoveDriver(vehicle)}
              onAssignDriver={() => onAssignDriver(vehicle)}
            />
          ))}
        </ul>

        <div className="px-5 py-4">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      </div>

      <AddVehicleModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddVehicle}
      />
    </FleetDashboardLayout>
  );
}

function VehicleRow({
  vehicle,
  onChangeDriver,
  onRemoveDriver,
  onAssignDriver,
}) {
  const {
    model,
    plateNumber,
    driver,
    tripsToday,
    totalTrips,
    utilization,
    status,
  } = vehicle;
  const isSuspended = status === "suspended";
  const isInactive = status === "inactive";

  return (
    <li
      className={`flex items-center gap-4 border-b border-[#231F2026] px-5 py-4 last:border-b-0 ${
        isSuspended ? "bg-[#DC26260D]" : ""
      }`}
    >
      <span className="text-xl leading-none">🏍️</span>

      <div className="w-80 shrink-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-gray-900">{model}</p>
          {isSuspended && <StatusBadge tone="red">Suspended</StatusBadge>}
          {isInactive && <StatusBadge tone="red">Inactive</StatusBadge>}
        </div>
        <p className="mt-0.5 text-xs text-gray-500">
          {plateNumber} · {driver ?? "No driver"} · {tripsToday} trips today
        </p>
      </div>

      <div className="flex-1">
        <UtilizationBar value={utilization} />
        <p className="mt-1 text-xs text-gray-400">
          Utilization · {totalTrips} total trips
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {isInactive ? (
          <button
            type="button"
            onClick={onAssignDriver}
            className="rounded-md bg-[#33794F] px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#004a1d]"
          >
            Assign driver
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={onChangeDriver}
              className="rounded-md border border-gray-200 px-3.5 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Change Driver
            </button>
            <button
              type="button"
              onClick={onRemoveDriver}
              className="rounded-md border border-red-200 px-3.5 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-50"
            >
              Remove driver
            </button>
          </>
        )}
        <button
          type="button"
          aria-label="More options"
          className="rounded-md p-2 text-gray-400 hover:bg-gray-50 hover:text-gray-600"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>
    </li>
  );
}

function UtilizationBar({ value }) {
  const color =
    value >= 70 ? "bg-[#33794F]" : value >= 40 ? "bg-amber-400" : "bg-red-500";

  return (
    <div className="h-5 w-full max-w-[220px] overflow-hidden rounded-[4px] bg-[#231F201A]">
      <div
        className={`flex h-full items-center rounded-[4px] px-2 text-[10px] font-semibold text-white ${color}`}
        style={{ width: `${Math.max(value, 12)}%` }}
      >
        {value}%
      </div>
    </div>
  );
}

function StatusBadge({ tone = "red", children }) {
  const tones = {
    red: "bg-[#FEE2E2] text-red-500",
  };
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

const MOCK_VEHICLES = [
  {
    id: 1,
    model: "Honda CB125",
    plateNumber: "OY-001-1BD",
    driver: "Samuel Kutti",
    tripsToday: 42,
    totalTrips: 62,
    utilization: 95,
    status: "suspended",
  },
  {
    id: 2,
    model: "Honda CB125",
    plateNumber: "OY-001-1BD",
    driver: "Tunde Adeyemi",
    tripsToday: 42,
    totalTrips: 62,
    utilization: 70,
    status: "active",
  },
  {
    id: 3,
    model: "Honda CB125",
    plateNumber: "OY-001-1BD",
    driver: "Ben White",
    tripsToday: 22,
    totalTrips: 42,
    utilization: 40,
    status: "active",
  },
  {
    id: 2,
    model: "Honda CB125",
    plateNumber: "OY-001-1BD",
    driver: "Paul Peter",
    tripsToday: 52,
    totalTrips: 62,
    utilization: 95,
    status: "active",
  },
  {
    id: 3,
    model: "Honda CB125",
    plateNumber: "OY-001-1BD",
    driver: null,
    tripsToday: 0,
    totalTrips: 0,
    utilization: 0,
    status: "inactive",
  },
];
