import { useCallback, useEffect, useState } from "react";
import { UserPlus } from "lucide-react";
import toast from "react-hot-toast";
import AddStaffModal from "../components/AddStaffModal";
import StaffDetailsModal from "../components/StaffDetailsModal";
import BusinessDashboardLayout from "../layout/BusinessDashboardLayout";
import { getBusinessStaff, inviteBusinessStaff } from "../../api/businessess";
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

  const sendInvite = async ({ email, role, services, canDoHomeService }) => {
    await inviteBusinessStaff(businessId, { email, role, services, canDoHomeService });
    toast.success(`Invite sent to ${email}. They’ll join once they accept.`);
    if (page === 1) loadStaff();
    else setPage(1);
  };

  const totalPages = pagination?.pages ?? 1;

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
              </tr>
            </thead>
            <tbody>
              {(loading || !businessId) && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-[#777777]">
                    Loading staff...
                  </td>
                </tr>
              )}
              {!loading && error && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-[#A33A3A]">
                    {error}{" "}
                    <button type="button" onClick={loadStaff} className="font-medium underline">
                      Try again
                    </button>
                  </td>
                </tr>
              )}
              {!loading && !error && businessId && staff.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-[#777777]">
                    No staff yet. Use “Add staff” to invite your team.
                  </td>
                </tr>
              )}
              {!loading && !error && staff.map((member) => {
                const status = getStaffMemberStatus(member);
                const name = getStaffDisplayName(member);
                const isActive = member.status === "ACTIVE";
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
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

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
