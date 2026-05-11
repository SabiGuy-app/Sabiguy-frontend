import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import Modal from "../Modal";

export default function DisputeCompletionModal({
  isOpen,
  onClose,
  onSubmit,
  loading,
  apiError,
  providerName,
}) {
  const [reason, setReason] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isOpen) {
      setReason("");
      setErrors({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const nextErrors = {};

    if (!reason.trim()) {
      nextErrors.reason = "Please tell us why you are disputing this completion";
    } else if (reason.trim().length < 10) {
      nextErrors.reason = "Please provide a little more detail";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({ reason: reason.trim() });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Dispute Job Completion">
      <div className="flex flex-col items-center text-center py-2">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
          <AlertTriangle size={32} />
        </div>

        <p className="max-w-md text-sm leading-7 text-gray-600 sm:text-base">
          {providerName ? `Provider: ${providerName}` : "Provider"}
          <br />
          Share the reason this job completion should be disputed so our team
          can review it.
        </p>

        <div className="mt-6 w-full">
          <label className="mb-2 block text-left text-sm font-medium text-gray-700">
            Reason for dispute
          </label>
          <textarea
            rows={4}
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              if (errors.reason) {
                setErrors((prev) => ({ ...prev, reason: null }));
              }
            }}
            placeholder="Explain what went wrong..."
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#005823] focus:ring-1 focus:ring-[#005823]"
          />
          {errors.reason && (
            <p className="mt-1 text-left text-xs text-red-500">
              {errors.reason}
            </p>
          )}
          {apiError && (
            <p className="mt-2 text-left text-xs text-red-500">{apiError}</p>
          )}
        </div>

        <div className="mt-6 flex w-full gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Dispute"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
