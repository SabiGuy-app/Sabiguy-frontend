import { useState } from "react";
import { useEffect } from "react";
import { CheckCircle2, Plus } from "lucide-react";
import FleetDashboardLayout from "../layout/FleetDashboardLayout";
import DriversTable from "../components/DriversTable";
import DriversPagination from "../components/DriversPagination";
import InviteDriverModal from "../components/InviteDriverModal";
import DriverActionModal from "../components/DriverActionModal";
import { mockDrivers } from "../data/mockDrivers";

const DRIVERS_PER_PAGE = 6;

export default function Drivers() {
  const [drivers, setDrivers] = useState(mockDrivers);
  const [currentPage, setCurrentPage] = useState(1);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [inviteSuccess, setInviteSuccess] = useState(false);
  const activeDrivers = drivers.filter(
    (driver) => driver.status === "online" && driver.accountStatus !== "suspended",
  ).length;
  const suspendedDrivers = drivers.filter(
    (driver) => driver.accountStatus === "suspended",
  ).length;
  const totalPages = Math.max(1, Math.ceil(drivers.length / DRIVERS_PER_PAGE));
  const pageStart = (currentPage - 1) * DRIVERS_PER_PAGE;
  const visibleDrivers = drivers.slice(pageStart, pageStart + DRIVERS_PER_PAGE);

  useEffect(() => {
    if (!inviteSuccess) return undefined;
    const timer = window.setTimeout(() => setInviteSuccess(false), 5000);
    return () => window.clearTimeout(timer);
  }, [inviteSuccess]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const handleInvite = (driverId) => {
    setCurrentPage(Math.ceil((drivers.length + 1) / DRIVERS_PER_PAGE));
    setDrivers((current) => [
      ...current,
      {
        id: driverId,
        name: driverId,
        inviteStatus: "Pending invite",
        status: "pending",
      },
    ]);
    setInviteSuccess(true);
  };

  const handleDriverAction = (driver, action) => {
    setSelectedAction({ driver, action });
  };

  const confirmDriverAction = (action, driver) => {
    setDrivers((current) => {
      if (action === "remove") {
        return current.filter((item) => item.id !== driver.id);
      }

      return current.map((item) =>
        item.id === driver.id
          ? {
              ...item,
              status: action === "suspend" ? "offline" : "online",
              accountStatus: action === "suspend" ? "suspended" : undefined,
            }
          : item,
      );
    });
    setSelectedAction(null);
  };

  return (
    <FleetDashboardLayout>
      <header className="mb-5 sm:mb-6">
        <h1 className="text-2xl font-semibold tracking-[-0.02em] text-[#231F20] sm:text-[26px]">
          Drivers
        </h1>
        <p className="mt-2 text-sm text-[#656263] sm:text-base">
          {activeDrivers} active · {suspendedDrivers} suspended · completion updates live
          with cancellations
        </p>
      </header>

      <section className="min-w-0 max-w-full overflow-hidden rounded-xl border border-[#DDDADB] bg-white sm:rounded-2xl">
        <div className="flex items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <h2 className="text-lg font-semibold text-[#292727] sm:text-xl">All drivers</h2>
          <button
            type="button"
            onClick={() => setInviteOpen(true)}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-[#2F7D55] px-3 py-2.5 text-xs font-medium text-white transition hover:bg-[#256846] sm:gap-2 sm:px-4 sm:text-sm"
          >
            <Plus size={17} />
            Invite driver
          </button>
        </div>

        <DriversTable drivers={visibleDrivers} onDriverAction={handleDriverAction} />

        <DriversPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </section>

      <InviteDriverModal
        isOpen={inviteOpen}
        onClose={() => setInviteOpen(false)}
        onInvite={handleInvite}
      />

      <DriverActionModal
        action={selectedAction?.action}
        driver={selectedAction?.driver}
        onClose={() => setSelectedAction(null)}
        onConfirm={confirmDriverAction}
      />

      {inviteSuccess && (
        <div
          role="status"
          className="fixed bottom-5 left-1/2 z-[90] flex w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 items-start gap-3 rounded-xl bg-white px-4 py-4 text-sm leading-5 text-[#625E5F] shadow-[0_8px_30px_rgba(0,0,0,0.18)] sm:bottom-8"
        >
          <CheckCircle2 className="mt-0.5 shrink-0 text-[#2F7D55]" size={20} />
          <span>
            Invitation sent successfully. The driver will be notified and can accept or
            decline your request.
          </span>
        </div>
      )}
    </FleetDashboardLayout>
  );
}
