import { X } from "lucide-react";
import { getStaffDisplayName, getStaffMemberStatus } from "../utils/staffMembers";

export default function StaffDetailsModal({ staff, onClose }) {
  if (!staff) return null;
  const status = getStaffMemberStatus(staff);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4"
      onClick={onClose}
    >
      <article
        role="dialog"
        aria-modal="true"
        aria-labelledby="staff-detail-name"
        className="w-full max-w-90 overflow-hidden rounded-[10px] border border-[#E8E8E8] bg-white shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="flex items-start justify-between border-b border-[#EEEEEE] px-4 py-3">
          <div>
            <h2 id="staff-detail-name" className="text-sm font-semibold">
              {getStaffDisplayName(staff)}
            </h2>
            <p className="mt-0.5 text-[10px] text-[#777777]">
              {staff.role}
            </p>
          </div>
          <button
            type="button"
            aria-label="Close staff details"
            onClick={onClose}
            className="rounded p-1 text-[#444444] hover:bg-[#F3F3F3]"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </header>
        <div className="space-y-3 p-4">
          <div className="flex flex-wrap items-center gap-2 text-[10px]">
            <span className="rounded-full bg-[#18C84D] px-2 py-1 text-white">
              {status.label}
            </span>
            <span className="text-[#777777]">
              Clocked in 9:51 am · Free now
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              ["4.8★", "154 reviews"],
              ["91%", "Accepts tasks"],
              ["89%", "Arrives on time"],
              ["17", "Jobs in the last 7 days"],
            ].map(([value, label]) => (
              <div key={label} className="rounded-md bg-[#F4F4F4] px-2.5 py-2">
                <p className="text-xs font-semibold">{value}</p>
                <p className="mt-0.5 text-[9px] text-[#777777]">{label}</p>
              </div>
            ))}
          </div>
          <div>
            <p className="mb-1.5 text-[10px] font-medium text-[#555555]">
              Services they can be assigned
            </p>
            <div className="flex flex-wrap gap-1.5">
              {(staff.services ?? []).map((service) => (
                <span
                  key={service}
                  className="rounded-full bg-[#347B54] px-2 py-1 text-[9px] text-white"
                >
                  {service}
                </span>
              ))}
            </div>
          </div>
          <dl className="space-y-1.5 border-t border-[#EEEEEE] pt-2 text-[10px]">
            <div className="flex justify-between gap-4">
              <dt className="text-[#777777]">ID</dt>
              <dd>{staff.staffCode}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[#777777]">Home service</dt>
              <dd>{staff.canDoHomeService ? "Yes" : "No"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[#777777]">Documents</dt>
              <dd>All verified</dd>
            </div>
          </dl>
          <div className="border-t border-[#EEEEEE] pt-2">
            <p className="mb-2 text-[10px] font-semibold">Today’s job</p>
            <div className="space-y-1.5 text-[10px]">
              <div className="flex items-center justify-between gap-2">
                <span>Haircut + beard trim · Osapa</span>
                <span className="rounded-full bg-[#347B54] px-2 py-0.5 text-[9px] text-white">
                  In service
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span>Haircut + beard trim · Ikoyi</span>
                <span className="rounded-full border border-[#A7D9B5] bg-[#EFFAF1] px-2 py-0.5 text-[9px] text-[#347B54]">
                  Completed
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span>Haircut · Ikate</span>
                <span className="rounded-full border border-[#A7D9B5] bg-[#EFFAF1] px-2 py-0.5 text-[9px] text-[#347B54]">
                  Completed
                </span>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
