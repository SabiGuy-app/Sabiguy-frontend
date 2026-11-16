import { useCallback, useEffect, useRef, useState } from "react";
import { MoreVertical, UserPlus } from "lucide-react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";
import AddStaffModal from "../components/AddStaffModal";
import StaffDetailsModal from "../components/StaffDetailsModal";
import BusinessDashboardLayout from "../layout/BusinessDashboardLayout";
import {
  clockOutBusinessStaff,
  getBusinessStaff,
  inviteBusinessStaff,
  liftBusinessStaffSuspension,
  removeBusinessStaff,
  suspendBusinessStaff,
} from "../../api/businessess";
import { useBusinessSession } from "../session/businessSessionContext";
import {
  getBusinessServiceNames,
  getStaffDisplayName,
  getStaffInitials,
  getStaffMemberStatus,
} from "../utils/staffMembers";

const PAGE_SIZE = 20;

const statusClassNames = {
  available: "bg-[#18C84D] text-white",
  "en-route": "bg-[#E3F1E8] text-[#286642]",
  "in-service": "bg-[#347B54] text-white",
  assigned: "bg-[#E3F1E8] text-[#286642]",
  offline: "bg-[#E8ECE9] text-[#626A64]",
  pending: "bg-[#FFF0C2] text-[#8B5A00]",
  declined: "bg-[#FDE2E2] text-[#9B3030]",
  expired: "bg-[#FDE2E2] text-[#9B3030]",
  removed: "bg-[#FDE2E2] text-[#9B3030]",
  suspended: "bg-[#FDE2E2] text-[#9B3030]",
};

const BusinessStaffPage = () => {
  const { business } = useBusinessSession();
  const businessId = business?._id;
  const [staff, setStaff] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [openActionsStaffId, setOpenActionsStaffId] = useState(null);
  const [actionsMenuPosition, setActionsMenuPosition] = useState(null);
  const [busyStaffId, setBusyStaffId] = useState(null);
  const actionsMenuRef = useRef(null);
  const actionsTriggerRef = useRef(null);

  const loadStaff = useCallback(async () => {
    if (!businessId) return;
    setLoading(true);
    setError("");
    try {
      const data = await getBusinessStaff(businessId, { page, limit: PAGE_SIZE });
      setStaff(data?.staff ?? []);
      setPagination(data?.pagination ?? null);
    } catch (loadError) {
      setError(loadError?.response?.data?.message || "Couldn't load your staff.");
    } finally {
      setLoading(false);
    }
  }, [businessId, page]);

  useEffect(() => {
    loadStaff();
  }, [loadStaff]);

  useEffect(() => {
    if (!openActionsStaffId) return undefined;

    const closeMenu = () => {
      setOpenActionsStaffId(null);
      setActionsMenuPosition(null);
    };
    const closeOnOutsideClick = (event) => {
      if (
        !actionsMenuRef.current?.contains(event.target) &&
        !actionsTriggerRef.current?.contains(event.target)
      ) {
        closeMenu();
      }
    };
    const closeOnEscape = (event) => {
      if (event.key === "Escape") closeMenu();
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    document.addEventListener("scroll", closeMenu, true);
    window.addEventListener("resize", closeMenu);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("scroll", closeMenu, true);
      window.removeEventListener("resize", closeMenu);
    };
  }, [openActionsStaffId]);

  const toggleActionsMenu = (event, member) => {
    if (openActionsStaffId === member.staffId) {
      setOpenActionsStaffId(null);
      setActionsMenuPosition(null);
      return;
    }

    const trigger = event.currentTarget;
    const rect = trigger.getBoundingClientRect();
    const menuHeight = member.status === "ACTIVE" ? 120 : 48;
    const menuWidth = 144;
    const shouldOpenAbove =
      window.innerHeight - rect.bottom < menuHeight + 8;
    const top = shouldOpenAbove
      ? Math.max(8, rect.top - menuHeight - 4)
      : rect.bottom + 4;
    const left = Math.max(
      8,
      Math.min(window.innerWidth - menuWidth - 8, rect.right - menuWidth),
    );

    actionsTriggerRef.current = trigger;
    setActionsMenuPosition({ top, left });
    setOpenActionsStaffId(member.staffId);
  };

  const sendInvite = async ({ email, role, services, canDoHomeService }) => {
    await inviteBusinessStaff(businessId, { email, role, services, canDoHomeService });
    toast.success(`Invite sent to ${email}. They’ll join once they accept.`);
    if (page === 1) loadStaff();
    else setPage(1);
  };

  const performStaffAction = async (member, action) => {
    const name = getStaffDisplayName(member);
    if (
      action === "remove" &&
      !window.confirm(`Remove ${name} from your staff?`)
    ) {
      return;
    }

    const actions = {
      "clock-out": {
        request: clockOutBusinessStaff,
        success: `${name} clocked out.`,
        failure: "Couldn't clock out this staff member.",
      },
      suspend: {
        request: suspendBusinessStaff,
        success: `${name} suspended.`,
        failure: "Couldn't suspend this staff member.",
      },
      "lift-suspension": {
        request: liftBusinessStaffSuspension,
        success: `Suspension lifted for ${name}.`,
        failure: "Couldn't lift this staff member's suspension.",
      },
      remove: {
        request: removeBusinessStaff,
        success: `${name} removed from staff.`,
        failure: "Couldn't remove this staff member.",
      },
    };
    const selectedAction = actions[action];
    if (!selectedAction) return;

    setOpenActionsStaffId(null);
    setActionsMenuPosition(null);
    setBusyStaffId(member.staffId);
    try {
      const result = await selectedAction.request(businessId, member.staffId);
      toast.success(result?.message || selectedAction.success);
      await loadStaff();
    } catch (actionError) {
      toast.error(
        actionError?.response?.data?.message || selectedAction.failure,
      );
    } finally {
      setBusyStaffId(null);
    }
  };

  const totalPages = pagination?.pages ?? 1;
  const openActionsMember = staff.find(
    (member) => member.staffId === openActionsStaffId,
  );

  return (
    <BusinessDashboardLayout>
      <section className="min-h-[calc(100vh-8rem)] text-[#242424] xl:min-h-[calc(100vh-9rem)]">
        <div className="mb-3 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold leading-7">Staff</h1>
            <p className="mt-1 text-xs text-[#777777] sm:text-sm">
              Your team, their status, skills and track record
            </p>
          </div>
          <button
            type="button"
            onClick={() => setInviteOpen(true)}
            disabled={!businessId}
            className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-md bg-[#347B54] px-3 text-xs font-medium text-white transition-colors hover:bg-[#286642] focus:outline-none focus:ring-2 focus:ring-[#347B54] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <UserPlus size={14} aria-hidden="true" />
            Add staff
          </button>
        </div>

        <div className="max-h-[calc(100vh-12rem)] overflow-auto rounded-[9px] border border-[#E7E7E7] bg-white">
          <table className="w-full min-w-170 border-collapse text-left text-[11px] sm:text-xs">
            <thead className="sticky top-0 z-10 bg-[#FCFCFC] text-[#505050]">
              <tr className="h-8 border-b border-[#EEEEEE]">
                <th scope="col" className="w-[28%] px-3 font-medium sm:px-4">
                  Staff
                </th>
                <th scope="col" className="w-[17%] px-3 font-medium">
                  Role
                </th>
                <th scope="col" className="w-[28%] px-3 font-medium">
                  Services
                </th>
                <th scope="col" className="w-[12%] px-3 font-medium">
                  Home service
                </th>
                <th scope="col" className="w-[15%] px-3 font-medium">
                  Status
                </th>
                <th scope="col" className="w-[12%] px-3 text-right font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {(loading || !businessId) && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-[#777777]">
                    Loading staff...
                  </td>
                </tr>
              )}
              {!loading && error && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-[#A33A3A]">
                    {error}{" "}
                    <button type="button" onClick={loadStaff} className="font-medium underline">
                      Try again
                    </button>
                  </td>
                </tr>
              )}
              {!loading && !error && businessId && staff.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-[#777777]">
                    No staff yet. Use “Add staff” to invite your team.
                  </td>
                </tr>
              )}
              {!loading && !error && staff.map((member) => {
                const status = getStaffMemberStatus(member);
                const name = getStaffDisplayName(member);
                const isActive = member.status === "ACTIVE";
                const isSuspended = member.status === "SUSPENDED";
                const isBusy = busyStaffId === member.staffId;
                const isMenuOpen = openActionsStaffId === member.staffId;
                return (
                  <tr key={member.staffId} className="h-12 border-b border-[#F0F0F0] last:border-b-0">
                    <td className="px-3 sm:px-4">
                      <div className="flex items-center gap-2">
                        {member.avatar ? (
                          <img src={member.avatar} alt="" className="h-6 w-6 shrink-0 rounded-full object-cover" />
                        ) : (
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#D9E9E4] text-[8px] font-semibold text-[#27634C]">
                            {getStaffInitials(member)}
                          </span>
                        )}
                        <div className="min-w-0">
                          {isActive ? (
                            <button
                              type="button"
                              onClick={() => setSelectedStaff(member)}
                              className="block max-w-full truncate font-medium text-[#222222] hover:underline focus:outline-none focus:underline"
                            >
                              {name}
                            </button>
                          ) : (
                            <span className="block truncate font-medium text-[#222222]">{name}</span>
                          )}
                          <span className="block truncate text-[10px] leading-3 text-[#858585]">
                            {[member.staffCode, member.name && member.email].filter(Boolean).join(" · ")}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 text-[#333333]">{member.role || "—"}</td>
                    <td className="px-3 text-[#333333]">
                      {member.services?.length ? member.services.join(", ") : "—"}
                    </td>
                    <td className="px-3 text-[#333333]">{member.canDoHomeService ? "Yes" : "No"}</td>
                    <td className="px-3">
                      <span
                        className={`inline-flex whitespace-nowrap rounded-full px-2 py-0.75 text-[10px] leading-none ${statusClassNames[status.tone] ?? statusClassNames.offline}`}
                      >
                        {status.label}
                      </span>
                    </td>
                    <td className="px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {isSuspended && (
                          <button
                            type="button"
                            onClick={() => performStaffAction(member, "lift-suspension")}
                            disabled={isBusy}
                            className="whitespace-nowrap rounded-md border border-[#347B54] px-2 py-1 text-[10px] font-medium text-[#286642] hover:bg-[#F0F8F3] disabled:cursor-wait disabled:opacity-60"
                          >
                            {isBusy ? "Working..." : "Lift suspension"}
                          </button>
                        )}
                        <div>
                          <button
                            type="button"
                            aria-label={`Actions for ${name}`}
                            aria-haspopup="menu"
                            aria-expanded={isMenuOpen}
                            ref={isMenuOpen ? actionsTriggerRef : null}
                            onClick={(event) => toggleActionsMenu(event, member)}
                            disabled={isBusy}
                            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-[#555555] hover:bg-[#F1F1F1] disabled:cursor-wait disabled:opacity-60"
                          >
                            <MoreVertical size={16} aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {openActionsMember &&
          actionsMenuPosition &&
          createPortal(
            <div
              ref={actionsMenuRef}
              role="menu"
              aria-label={`Staff actions for ${getStaffDisplayName(openActionsMember)}`}
              className="fixed z-[100] min-w-36 overflow-y-auto rounded-md border border-[#E5E5E5] bg-white py-1 text-left shadow-lg"
              style={{
                top: actionsMenuPosition.top,
                left: actionsMenuPosition.left,
                width: 144,
                maxHeight: "calc(100vh - 16px)",
                fontFamily: "Arial, Helvetica, sans-serif",
              }}
            >
              {openActionsMember.status === "ACTIVE" && (
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => performStaffAction(openActionsMember, "clock-out")}
                  disabled={openActionsMember.workStatus === "offline"}
                  className="block w-full px-3 py-2 text-left text-[11px] text-[#333333] hover:bg-[#F5F5F5] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Clock out
                </button>
              )}
              {openActionsMember.status === "ACTIVE" && (
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => performStaffAction(openActionsMember, "suspend")}
                  className="block w-full px-3 py-2 text-left text-[11px] text-[#333333] hover:bg-[#F5F5F5]"
                >
                  Suspend
                </button>
              )}
              {openActionsMember.status !== "REMOVED" && (
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => performStaffAction(openActionsMember, "remove")}
                  className="block w-full px-3 py-2 text-left text-[11px] text-[#A33A3A] hover:bg-[#FFF4F4]"
                >
                  Remove
                </button>
              )}
            </div>,
            document.body,
          )}

        {totalPages > 1 && (
          <div className="mt-3 flex items-center justify-end gap-3 text-xs text-[#555555]">
            <button
              type="button"
              disabled={page <= 1 || loading}
              onClick={() => setPage((current) => current - 1)}
              className="rounded-md border border-[#DADADA] px-3 py-1.5 disabled:opacity-50"
            >
              Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages || loading}
              onClick={() => setPage((current) => current + 1)}
              className="rounded-md border border-[#DADADA] px-3 py-1.5 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </section>

      <AddStaffModal
        isOpen={inviteOpen}
        onClose={() => setInviteOpen(false)}
        onSubmit={sendInvite}
        serviceOptions={getBusinessServiceNames(business)}
      />

      {selectedStaff && (
        <StaffDetailsModal
          staff={selectedStaff}
          onClose={() => setSelectedStaff(null)}
        />
      )}
    </BusinessDashboardLayout>
  );
};

export default BusinessStaffPage;
