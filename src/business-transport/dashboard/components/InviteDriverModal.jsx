import { useState } from "react";
import { X } from "lucide-react";

export default function InviteDriverModal({ isOpen, onClose, onInvite }) {
  const [driverId, setDriverId] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (event) => {
    event.preventDefault();
    const value = driverId.trim();
    if (!value) return;
    onInvite?.(value);
    setDriverId("");
    onClose?.();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="invite-driver-title"
        className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close invite driver modal"
          className="absolute right-4 top-4 rounded-md p-1 text-gray-400 hover:bg-gray-100"
        >
          <X size={20} />
        </button>
        <h2 id="invite-driver-title" className="text-lg font-semibold text-[#292727]">
          Invite Driver
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#6D696A]">
          Enter a registered driver&apos;s ID to send a fleet invite. They must accept
          before joining your fleet.
        </p>
        <form onSubmit={handleSubmit} className="mt-5">
          <label htmlFor="driver-id" className="sr-only">
            Driver ID
          </label>
          <input
            id="driver-id"
            value={driverId}
            onChange={(event) => setDriverId(event.target.value)}
            placeholder="e.g. SGD-284961"
            autoFocus
            className="w-full rounded-lg border border-[#D5D2D3] px-4 py-3.5 text-sm outline-none focus:border-[#2F7D55] focus:ring-2 focus:ring-[#2F7D55]/10"
          />
          <button
            type="submit"
            disabled={!driverId.trim()}
            className="mt-5 w-full rounded-lg bg-[#2F7D55] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#256846] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Send Invite
          </button>
        </form>
      </div>
    </div>
  );
}
