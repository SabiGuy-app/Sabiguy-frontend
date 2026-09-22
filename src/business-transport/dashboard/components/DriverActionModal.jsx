import { X } from "lucide-react";

const ACTION_COPY = {
  reinstate: {
    title: "Reinstate driver?",
    message:
      "This driver will regain access to the fleet and can become available for trips again.",
    confirmLabel: "Reinstate driver",
    confirmClass: "bg-[#2F7D55] hover:bg-[#256846]",
  },
  suspend: {
    title: "Suspend driver?",
    message:
      "This driver will be taken offline and will not be able to receive new fleet trips.",
    confirmLabel: "Suspend driver",
    confirmClass: "bg-[#D97706] hover:bg-[#B96305]",
  },
  remove: {
    title: "Remove driver?",
    message:
      "This driver will be removed from your fleet. You will need to invite them again to restore access.",
    confirmLabel: "Remove driver",
    confirmClass: "bg-[#D93025] hover:bg-[#B9271E]",
  },
};

export default function DriverActionModal({ action, driver, onClose, onConfirm }) {
  if (!action || !driver) return null;

  const copy = ACTION_COPY[action];

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="driver-action-title"
        className="relative w-full max-w-[430px] rounded-xl bg-white p-6 shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close confirmation"
          className="absolute right-4 top-4 rounded-md p-1 text-[#777474] hover:bg-gray-100"
        >
          <X size={20} />
        </button>

        <h2 id="driver-action-title" className="pr-8 text-lg font-semibold text-[#292727]">
          {copy.title}
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#6D696A]">
          {copy.message}
        </p>
        <p className="mt-4 rounded-lg bg-[#F7F7F7] px-4 py-3 text-sm font-medium text-[#343132]">
          {driver.name}
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[#D5D2D3] px-4 py-2.5 text-sm font-medium text-[#5D595A] hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm?.(action, driver)}
            className={`rounded-lg px-4 py-2.5 text-sm font-medium text-white transition ${copy.confirmClass}`}
          >
            {copy.confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
