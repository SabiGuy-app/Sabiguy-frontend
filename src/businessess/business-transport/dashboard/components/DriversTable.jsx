import { useEffect, useState } from "react";
import { Ban, MoreHorizontal, UserRound } from "lucide-react";
import DriverStatusBadge from "./DriverStatusBadge";

function DriverIdentity({ driver, compact = false }) {
  const isPending = driver.status === "pending";

  return (
    <div className={`flex items-center gap-3 ${compact ? "min-w-0" : "min-w-[240px]"}`}>
      <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#ECECEC]">
        {driver.avatar ? (
          <img src={driver.avatar} alt="" className="h-full w-full object-cover" />
        ) : (
          <UserRound size={28} className="translate-y-1 text-[#6B6B6B]" />
        )}
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate text-sm font-semibold text-[#292727]">{driver.name}</p>
          {driver.accountStatus === "suspended" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#FFE0E0] px-2 py-1 text-[10px] font-medium text-[#D93025]">
              <Ban size={11} />
              Suspended
            </span>
          )}
        </div>
        <p className="mt-0.5 truncate text-xs text-[#777474]">
          {isPending ? driver.inviteStatus : `${driver.vehicle} · ${driver.vehicleId}`}
        </p>
      </div>
    </div>
  );
}

export default function DriversTable({ drivers, onDriverAction }) {
  const [openMenuId, setOpenMenuId] = useState(null);

  useEffect(() => {
    if (!openMenuId) return undefined;

    const closeOnOutsideClick = (event) => {
      if (!event.target.closest("[data-driver-action-menu]")) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, [openMenuId]);

  const selectAction = (driver, action) => {
    setOpenMenuId(null);
    onDriverAction?.(driver, action);
  };

  const ActionMenu = ({ driver, mobile = false }) => (
    <div className="relative shrink-0" data-driver-action-menu>
      <button
        type="button"
        onClick={() => setOpenMenuId((current) => (current === driver.id ? null : driver.id))}
        aria-label={`Actions for ${driver.name}`}
        aria-expanded={openMenuId === driver.id}
        className="rounded-md p-1.5 text-[#686566] transition hover:bg-gray-100"
      >
        <MoreHorizontal size={20} />
      </button>
      {openMenuId === driver.id && (
        <div
          className={`absolute z-30 w-32 overflow-hidden rounded-md border border-[#E1DEDF] bg-white py-1 text-left shadow-lg ${
            mobile ? "right-0 top-9" : "right-0 top-8"
          }`}
        >
          {[
            driver.accountStatus === "suspended"
              ? { value: "reinstate", label: "Reinstate" }
              : { value: "suspend", label: "Suspend" },
            { value: "remove", label: "Remove" },
          ].map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => selectAction(driver, item.value)}
              className={`block w-full px-3 py-2 text-left text-xs hover:bg-[#F5F5F5] ${
                item.value === "remove" ? "text-[#D93025]" : "text-[#4D494A]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div>
      <div className="divide-y divide-[#EEEEEE] border-t border-[#EEEEEE] xl:hidden">
        {drivers.map((driver) => {
          const isPending = driver.status === "pending";
          return (
            <article
              key={driver.id}
              className={`px-4 py-4 sm:px-6 ${
                driver.accountStatus === "suspended" ? "bg-[#FFF6F6]" : "bg-white"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <DriverIdentity driver={driver} compact />
                {!isPending && <ActionMenu driver={driver} mobile />}
              </div>

              <div className="mt-4 flex items-center justify-between gap-3">
                {!isPending ? (
                  <dl className="grid flex-1 grid-cols-2 gap-x-5 gap-y-3 sm:grid-cols-4">
                    {[
                      ["Trips", driver.trips],
                      ["Rating", driver.rating.toFixed(1)],
                      ["Completion", `${driver.completion}%`],
                      ["Cancelled", driver.cancelled],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <dt className="text-[11px] text-[#8A8788]">{label}</dt>
                        <dd className="mt-0.5 text-sm font-medium text-[#3D3A3B]">{value}</dd>
                      </div>
                    ))}
                  </dl>
                ) : (
                  <span className="text-xs text-[#8A8788]">Awaiting driver acceptance</span>
                )}
                <DriverStatusBadge status={driver.status} />
              </div>
            </article>
          );
        })}
      </div>

      <div className="hidden min-w-0 max-w-full overflow-visible xl:block">
        <table className="w-full table-fixed border-collapse text-left">
        <thead>
          <tr className="border-b border-[#E9E9E9] text-sm font-medium text-[#656263]">
            <th className="w-[29%] px-6 py-5">Drivers</th>
            <th className="w-[10%] px-3 py-5">Trips</th>
            <th className="w-[11%] px-3 py-5">Ratings</th>
            <th className="w-[13%] px-3 py-5">Completion</th>
            <th className="w-[12%] px-3 py-5">Cancelled</th>
            <th className="w-[15%] px-3 py-5">Status</th>
            <th className="w-[10%] px-6 py-5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {drivers.map((driver) => {
            const isPending = driver.status === "pending";
            return (
              <tr
                key={driver.id}
                className={`border-b border-[#EEEEEE] text-sm text-[#3D3A3B] ${
                  driver.accountStatus === "suspended" ? "bg-[#FFF6F6]" : "bg-white"
                }`}
              >
                <td className="px-6 py-4">
                  <DriverIdentity driver={driver} />
                </td>
                <td className="px-3 py-4">{isPending ? "" : driver.trips}</td>
                <td className="px-3 py-4">{isPending ? "" : driver.rating.toFixed(1)}</td>
                <td className="px-3 py-4">{isPending ? "" : `${driver.completion}%`}</td>
                <td className="px-3 py-4">{isPending ? "" : driver.cancelled}</td>
                <td className="whitespace-nowrap px-3 py-4">
                  <DriverStatusBadge status={driver.status} />
                </td>
                <td className="px-6 py-4 text-right">
                  {!isPending && <ActionMenu driver={driver} />}
                </td>
              </tr>
            );
          })}
        </tbody>
        </table>
      </div>
    </div>
  );
}
