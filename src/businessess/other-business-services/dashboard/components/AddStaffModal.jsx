import { useState } from "react";
import { Check, X } from "lucide-react";

const inputClassName =
  "mt-1.5 block h-9 w-full rounded-md border border-[#DADADA] px-2.5 text-xs font-normal outline-none placeholder:text-[#AAAAAA] focus:border-[#347B54] focus:ring-2 focus:ring-[#347B54]/15";

const emptyForm = { email: "", role: "", services: [], canDoHomeService: false };

// serviceOptions: the business's own service names; the invite API rejects others.
// onSubmit should throw on failure so the error can be shown here.
export default function AddStaffModal({ isOpen, onClose, onSubmit, serviceOptions = [] }) {
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const update = (changes) => {
    setForm((current) => ({ ...current, ...changes }));
    setError("");
  };

  const close = () => {
    if (submitting) return;
    setForm(emptyForm);
    setError("");
    onClose();
  };

  const toggleService = (service) => {
    update({
      services: form.services.includes(service)
        ? form.services.filter((item) => item !== service)
        : [...form.services, service],
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const email = form.email.trim();
    const role = form.role.trim();
    if (!email || !role) return;
    if (form.services.length === 0) {
      setError("Select at least one service they can do.");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({ ...form, email, role });
      setForm(emptyForm);
      onClose();
    } catch (submitError) {
      setError(
        submitError?.response?.data?.message ||
          "Couldn't send the invite. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4"
      onClick={close}
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
            onClick={close}
            className="rounded p-1 text-[#777777] hover:bg-[#F3F3F3]"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>
        <p className="mb-4 text-[11px] leading-[1.45] text-[#777777]">
          Enter their email to send an invitation. They’ll need to accept
          before joining your business.
        </p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <label className="block text-[11px] font-medium text-[#353535]">
            Email
            <input
              autoFocus
              required
              type="email"
              value={form.email}
              onChange={(event) => update({ email: event.target.value })}
              placeholder="e.g. tunde@example.com"
              className={inputClassName}
            />
          </label>
          <label className="block text-[11px] font-medium text-[#353535]">
            Role
            <input
              required
              value={form.role}
              onChange={(event) => update({ role: event.target.value })}
              placeholder="e.g. Photographer"
              className={inputClassName}
            />
          </label>
          <fieldset>
            <legend className="mb-2 text-[11px] font-medium text-[#353535]">
              Services they can do
            </legend>
            {serviceOptions.length ? (
              <div className="flex flex-wrap gap-1.5">
                {serviceOptions.map((service) => {
                  const isSelected = form.services.includes(service);
                  return (
                    <button
                      key={service}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => toggleService(service)}
                      className={`inline-flex h-6 items-center gap-1 rounded-full px-2 text-[9px] transition-colors ${isSelected ? "bg-[#347B54] text-white" : "bg-[#F0F0F0] text-[#555555] hover:bg-[#E5E5E5]"}`}
                    >
                      {isSelected && <Check size={10} aria-hidden="true" />}
                      {service}
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="text-[11px] text-[#777777]">
                Your business has no services yet. Add them in Settings before
                inviting staff.
              </p>
            )}
          </fieldset>
          <label className="flex items-center gap-2 text-[11px] font-medium text-[#353535]">
            <input
              type="checkbox"
              checked={form.canDoHomeService}
              onChange={(event) => update({ canDoHomeService: event.target.checked })}
              className="h-3.5 w-3.5 accent-[#347B54]"
            />
            Can do home service
          </label>
          {error && (
            <p role="alert" className="text-[11px] text-[#A33A3A]">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={submitting || serviceOptions.length === 0}
            className="mt-1 inline-flex h-9 w-full items-center justify-center rounded-md bg-[#347B54] text-xs font-medium text-white hover:bg-[#286642] focus:outline-none focus:ring-2 focus:ring-[#347B54] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Sending invite..." : "Send Invite"}
          </button>
        </form>
      </div>
    </div>
  );
}
