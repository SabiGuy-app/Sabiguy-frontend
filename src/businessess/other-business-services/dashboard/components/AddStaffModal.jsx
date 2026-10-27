import { useState } from "react";
import { Check, ChevronDown, X } from "lucide-react";

const serviceOptions = [
  "Home Cleaning",
  "Deep Cleaning",
  "Office Cleaning",
  "Office Cleaning",
];

export default function AddStaffModal({ isOpen, onClose, onSubmit }) {
  const [staffId, setStaffId] = useState("");
  const [role, setRole] = useState("Barber");
  const [selectedServices, setSelectedServices] = useState([
    "Home Cleaning-0",
    "Deep Cleaning-1",
  ]);

  if (!isOpen) return null;

  const handleSubmit = (event) => {
    event.preventDefault();
    const invitedId = staffId.trim();
    if (!invitedId) return;

    onSubmit({
      staffId: invitedId,
      role,
      services: selectedServices,
    });
    setStaffId("");
    onClose();
  };

  const toggleService = (service) => {
    setSelectedServices((current) =>
      current.includes(service)
        ? current.filter((item) => item !== service)
        : [...current, service],
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="invite-title"
        className="w-full max-w-90 rounded-[10px] border border-[#E8E8E8] bg-white p-5 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 id="invite-title" className="text-sm font-semibold">
            Add staff
          </h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="rounded p-1 text-[#777777] hover:bg-[#F3F3F3]"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>
        <p className="mb-4 text-[11px] leading-[1.45] text-[#777777]">
          Enter a registered ID to send an invitation. They’ll need to accept
          before joining your business.
        </p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <label className="block text-[11px] font-medium text-[#353535]">
            Staff ID
            <input
              autoFocus
              required
              value={staffId}
              onChange={(event) => setStaffId(event.target.value)}
              placeholder="e.g. SGD-284961"
              className="mt-1.5 block h-9 w-full rounded-md border border-[#DADADA] px-2.5 text-xs font-normal outline-none placeholder:text-[#AAAAAA] focus:border-[#347B54] focus:ring-2 focus:ring-[#347B54]/15"
            />
          </label>
          <label className="block text-[11px] font-medium text-[#353535]">
            Role
            <span className="relative mt-1.5 block">
              <select
                value={role}
                onChange={(event) => setRole(event.target.value)}
                className="h-9 w-full appearance-none rounded-md border border-[#DADADA] bg-white px-2.5 pr-8 text-xs outline-none focus:border-[#347B54] focus:ring-2 focus:ring-[#347B54]/15"
              >
                <option>Barber</option>
                <option>Stylist</option>
                <option>Junior barber</option>
              </select>
              <ChevronDown
                size={14}
                aria-hidden="true"
                className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#666666]"
              />
            </span>
          </label>
          <fieldset>
            <legend className="mb-2 text-[11px] font-medium text-[#353535]">
              Services they can do
            </legend>
            <div className="flex flex-wrap gap-1.5">
              {serviceOptions.map((service, index) => {
                const serviceKey = `${service}-${index}`;
                const isSelected = selectedServices.includes(serviceKey);
                return (
                  <button
                    key={serviceKey}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => toggleService(serviceKey)}
                    className={`inline-flex h-6 items-center gap-1 rounded-full px-2 text-[9px] transition-colors ${isSelected ? "bg-[#347B54] text-white" : "bg-[#F0F0F0] text-[#555555] hover:bg-[#E5E5E5]"}`}
                  >
                    {isSelected && <Check size={10} aria-hidden="true" />}
                    {service}
                  </button>
                );
              })}
            </div>
          </fieldset>
          <button
            type="submit"
            className="mt-1 inline-flex h-9 w-full items-center justify-center rounded-md bg-[#347B54] text-xs font-medium text-white hover:bg-[#286642] focus:outline-none focus:ring-2 focus:ring-[#347B54] focus:ring-offset-2"
          >
            Send Invite
          </button>
        </form>
      </div>
    </div>
  );
}
