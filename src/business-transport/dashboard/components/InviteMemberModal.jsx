import { useState } from "react";
import { X } from "lucide-react";
import { TEAM_ROLES } from "../data/mockSettings";

const EMPTY_FORM = { name: "", email: "", role: TEAM_ROLES[0] };

export default function InviteMemberModal({ isOpen, onClose, onInvite }) {
  const [form, setForm] = useState(EMPTY_FORM);

  if (!isOpen) return null;

  const handleSubmit = (event) => {
    event.preventDefault();
    onInvite?.(form);
    setForm(EMPTY_FORM);
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose?.();
      }}
    >
      <form onSubmit={handleSubmit} className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close invite form"
          className="absolute right-4 top-4 rounded-md p-1 text-gray-500 hover:bg-gray-100"
        >
          <X size={20} />
        </button>
        <h2 className="text-lg font-semibold text-[#302C2D]">Invite team member</h2>
        <div className="mt-5 space-y-4">
          <label className="block text-sm font-medium text-[#5E5A5B]">
            Full name
            <input
              type="text"
              required
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              className="mt-2 w-full rounded-lg border border-[#D5D2D3] px-4 py-3 outline-none focus:border-[#2F7D55] focus:ring-2 focus:ring-[#2F7D55]/10"
            />
          </label>
          <label className="block text-sm font-medium text-[#5E5A5B]">
            Email
            <input
              type="email"
              required
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              className="mt-2 w-full rounded-lg border border-[#D5D2D3] px-4 py-3 outline-none focus:border-[#2F7D55] focus:ring-2 focus:ring-[#2F7D55]/10"
            />
          </label>
          <label className="block text-sm font-medium text-[#5E5A5B]">
            Role
            <select
              value={form.role}
              onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))}
              className="mt-2 w-full appearance-none rounded-lg border border-[#D5D2D3] bg-white px-4 py-3 outline-none focus:border-[#2F7D55] focus:ring-2 focus:ring-[#2F7D55]/10"
            >
              {TEAM_ROLES.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </label>
        </div>
        <button
          type="submit"
          className="mt-5 w-full rounded-md bg-[#2F7D55] px-4 py-3 text-sm font-medium text-white hover:bg-[#256846]"
        >
          Send invite
        </button>
      </form>
    </div>
  );
}
