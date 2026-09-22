import { ChevronLeft, ChevronRight, Info, X } from "lucide-react";
import { useEffect, useState } from "react";
import Modal from "./Modal";

const REASONS = [
  "Rider is unresponsive",
  "Rider is taking too long / ETA is too high",
  "Change of plans / No longer needed",
  "Incorrect booking details (address, vehicle type, etc.)",
  "Rider requested cancellation",
];

const OTHER_REASON = "Other reason";

export default function UserCancellationModal({
  isOpen,
  onClose,
  onSubmit,
  onComplete,
}) {
  const [step, setStep] = useState("reason");
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    setStep("reason");
    setSelectedReason("");
    setCustomReason("");
    setSubmitting(false);
    setError("");
  }, [isOpen]);

  const closeModal = () => {
    if (submitting) return;
    onClose?.();
  };

  const finishFlow = () => {
    onClose?.();
    onComplete?.();
  };

  const submitReason = async (reason) => {
    const normalizedReason = reason.trim();

    if (!normalizedReason) {
      setError("Please provide a cancellation reason.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      await onSubmit(normalizedReason);
      setStep("complete");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to cancel this booking. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleReasonSubmit = () => {
    if (selectedReason === OTHER_REASON) {
      setStep("details");
      return;
    }

    submitReason(selectedReason);
  };

  const renderReasonStep = () => (
    <>
      <div className="flex h-[68px] items-center justify-between border-b border-[#231F201A] px-8 sm:px-10">
        <h2 className="text-[20px] font-semibold leading-none text-[#231F20]">
          What went wrong?
        </h2>
        <button
          type="button"
          onClick={closeModal}
          aria-label="Close cancellation modal"
          className="flex h-9 w-9 items-center justify-center rounded-full text-[#231F20] transition hover:bg-[#F4F4F4]"
        >
          <X size={24} strokeWidth={1.8} />
        </button>
      </div>

      <div className="px-8 pb-6 pt-2 sm:px-9">
        <div role="radiogroup" aria-label="Cancellation reason">
          {REASONS.map((reason) => {
            const isSelected = selectedReason === reason;

            return (
              <button
                key={reason}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => {
                  setSelectedReason(reason);
                  setError("");
                }}
                className="flex h-[58px] w-full items-center justify-between border-b border-[#231F201A] text-left cursor-pointer"
              >
                <span className="text-[14px] font-normal text-[#5F5F5F]">
                  {reason}
                </span>
                <span
                  className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                    isSelected ? "border-[#2F7D4F]" : "border-[#9B9B9B]"
                  }`}
                >
                  {isSelected && (
                    <span className="h-2 w-2 rounded-full bg-[#2F7D4F]" />
                  )}
                </span>
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => {
              setSelectedReason(OTHER_REASON);
              setStep("details");
              setError("");
            }}
            className="flex h-[58px] w-full items-center justify-between border-b border-[#231F201A] text-left cursor-pointer"
          >
            <span className="text-[14px] font-normal text-[#5F5F5F]">
              {OTHER_REASON}
            </span>
            <ChevronRight size={27} className="text-[#5F5F5F]" />
          </button>
        </div>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        <button
          type="button"
          onClick={handleReasonSubmit}
          disabled={!selectedReason || submitting}
          className="mt-10 flex h-10 w-full items-center justify-center rounded-[4px] bg-[#2F7D4F] text-[14px] font-semibold text-white transition hover:bg-[#286A43] disabled:cursor-not-allowed disabled:bg-[#BFC8C2] cursor-pointer"
        >
          {submitting ? "Submitting..." : "Submit"}
        </button>
      </div>
    </>
  );

  const renderDetailsStep = () => (
    <>
      <div className="flex h-[68px] items-center border-b border-[#231F201A] px-7 sm:px-8">
        <button
          type="button"
          onClick={() => {
            setStep("reason");
            setError("");
          }}
          aria-label="Back to cancellation reasons"
          className="mr-3 flex h-9 w-9 items-center justify-center rounded-full text-[#5F5F5F] transition hover:bg-[#F4F4F4]"
        >
          <ChevronLeft size={30} strokeWidth={2} />
        </button>
        <h2 className="text-[20px] font-semibold leading-none text-[#231F20]">
          Reason for cancellation
        </h2>
      </div>

      <div className="pb-6">
        <textarea
          autoFocus
          value={customReason}
          onChange={(event) => {
            setCustomReason(event.target.value);
            if (error) setError("");
          }}
          placeholder="Please describe the problem"
          className="h-[148px] w-full resize-none border-0 px-9 py-6 text-[14px] font-normal text-[#231F20] placeholder:text-[#5F5F5F] focus:outline-none focus:ring-0"
        />

        {error && <p className="mx-8 mb-3 text-sm text-red-600">{error}</p>}

        <div className="px-7 sm:px-8">
          <button
            type="button"
            onClick={() => submitReason(customReason)}
            disabled={!customReason.trim() || submitting}
            className="flex h-10 w-full items-center justify-center rounded-[4px] bg-[#2F7D4F] text-[14px] font-semibold text-white transition hover:bg-[#286A43] disabled:cursor-not-allowed disabled:bg-[#BFC8C2] cursor-pointer"
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </>
  );

  const renderCompleteStep = () => (
    <>
      <div className="flex h-[68px] items-center justify-between border-b border-[#231F201A] px-8 sm:px-10">
        <h2 className="text-[18px] font-semibold leading-none text-[#231F20] sm:text-[19px]">
          Booking cancelled
        </h2>
        <Info size={17} strokeWidth={1.7} className="text-[#8A8A8A]" />
      </div>

      <div className="px-8 pb-10 pt-9 text-center sm:px-10">
        <p className="mx-auto max-w-[390px] text-[14px] leading-5 text-[#231F20]">
          We have received your cancellation request. This booking has
          been cancelled successfully.
        </p>

        <div className="mt-[62px] grid grid-cols-1 gap-4 sm:grid-cols-2">
          <button
            type="button"
            onClick={finishFlow}
            className="flex h-10 items-center justify-center rounded-[4px] border border-[#D9D9D9] bg-white text-[14px] font-semibold text-[#231F20] transition hover:bg-[#F7F7F7] cursor-pointer"
          >
            Close
          </button>
          <button
            type="button"
            onClick={finishFlow}
            className="flex h-10 items-center justify-center rounded-[4px] bg-[#2F7D4F] text-[14px] font-semibold text-white transition hover:bg-[#286A43] cursor-pointer"
          >
            Continue
          </button>
        </div>
      </div>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={step === "complete" ? finishFlow : closeModal}
      showCloseButton={false}
      overlayClassName="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-3"
      panelClassName="relative w-full max-w-[508px] overflow-hidden rounded-[6px] border border-[#231F201A] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.22)]"
      contentClassName="text-[#231F20]"
    >
      {step === "reason" && renderReasonStep()}
      {step === "details" && renderDetailsStep()}
      {step === "complete" && renderCompleteStep()}
    </Modal>
  );
}
