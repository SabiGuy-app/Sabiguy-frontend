import { useEffect, useState } from "react";
import { cancelBooking as cancelProviderBooking } from "../api/provider";
import { cancelBooking as cancelUserBooking } from "../api/bookings";
import { ChevronLeft, ChevronRight, Info, X } from "lucide-react";
import Modal from "./Modal";

const HIDDEN_CANCEL_STATUSES = [
  "completed",
  "cancelled",
  "expired",
  "booking_expired",
  "disputed",
  "user_accepted_completion",
  "funds_released",
  "awaiting_provider_acceptance",
  "declined",
  "review "
];


export default function CancelBookingButton({
  bookingId,
  role = "user",
  status,
  title = "Cancel Request",
  paymentStatus,
  onSuccess,
  className = "flex w-full min-w-25 items-center justify-center gap-3 rounded border bg-white text-red-600  border-red-300  hover:bg-red-50 transition-colors",
}) {
  const [isOpen, setIsOpen] = useState(false);

  const normalizedStatus = String(status || "")
    .trim()
    .toLowerCase();

  if (HIDDEN_CANCEL_STATUSES.includes(normalizedStatus)) {
    return null;
  }

  

  const handleSubmit = (reason) => {
    const cancelRequest =
      role === "provider" ? cancelProviderBooking : cancelUserBooking;

    return cancelRequest(bookingId, reason);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        disabled={!bookingId}
        className={` ${className}`}
      >
        {title}
      </button>

      <CancelBookingModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={handleSubmit}
        onComplete={() => onSuccess?.()}
        role={role}
        paymentStatus={paymentStatus || status}
        bookingStatus={status}
      />
    </>
  );
}

const USER_REASONS = [
  "Provider is unresponsive",
  "Provider is taking too long",
  "Change of plans / No longer needed",
  "Incorrect booking details",
  "Other reason",
];

const PROVIDER_REASONS = [
  "Customer is unresponsive",
  "Unable to complete the booking",
  "Incorrect booking details",
  "Scheduling conflict",
  "Other reason",
];

const OTHER_REASON = "Other reason";

const PAID_STATUSES = ["paid", "paid_escrow", "paid_escrow_scheduled"];

const ACTIVE_JOB_STATUSES = [
  "provider_accepted",
  "in_progress",
  "arrived_at_pickup",
  "enroute_to_dropoff",
  "arrived_at_dropoff",
  "waiting_confirmation",
  "active",
  "enroute_to_pickup",
];

const normalizeStatus = (status) =>
  String(status ?? "")
    .toLowerCase()
    .trim()
    .replaceAll("_", " ");

export function CancelBookingModal({
  isOpen,
  onClose,
  onSubmit,
  onComplete,
  role = "user",
  paymentStatus,
  bookingStatus,
}) {
  const [step, setStep] = useState("reason");
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const isProvider = role === "provider";
  const reasons = isProvider ? PROVIDER_REASONS : USER_REASONS;

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
    if (submitting) return;
    onClose?.();
    onComplete?.();
  };

  const submitReason = async (reason) => {
    const normalizedReason = reason.trim();

    if (!normalizedReason) {
      setError("Please provide a cancellation reason.");
      return;
    }

    if (typeof onSubmit !== "function") {
      setError("Cancellation is currently unavailable. Please try again.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const response = await onSubmit(normalizedReason);

      const normalizedPaymentStatus = normalizeStatus(paymentStatus);
      const normalizedBookingStatus = normalizeStatus(bookingStatus);

      const isPaid = PAID_STATUSES.some(
        (status) => normalizeStatus(status) === normalizedPaymentStatus,
      );

      const isActiveJob = ACTIVE_JOB_STATUSES.some(
        (status) => normalizeStatus(status) === normalizedBookingStatus,
      );

      // Paid active bookings go to review.
      setStep(isPaid && isActiveJob ? "review" : "complete");

      return response;
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Unable to submit cancellation request. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleReasonSubmit = () => {
    if (!selectedReason) {
      setError("Please select a cancellation reason.");
      return;
    }

    if (selectedReason === OTHER_REASON) {
      setStep("details");
      setError("");
      return;
    }

    submitReason(selectedReason);
  };

  const renderReasonStep = () => (
    <>
      <div className="flex h-17 items-center justify-between border-b border-[#231F201A] px-8 sm:px-10">
        <h2 className="text-[20px] font-semibold leading-none text-[#231F20]">
          What went wrong?
        </h2>

        <button
          type="button"
          onClick={closeModal}
          disabled={submitting}
          aria-label="Close cancellation modal"
          className="flex h-9 w-9 items-center justify-center rounded-full text-[#231F20] transition hover:bg-[#F4F4F4] disabled:opacity-50"
        >
          <X size={24} strokeWidth={1.8} />
        </button>
      </div>

      <div className="px-8 pb-6 pt-2 sm:px-9">
        <div role="radiogroup" aria-label="Cancellation reason">
          {reasons
            .filter((reason) => reason !== OTHER_REASON)
            .map((reason) => {
              const isSelected = selectedReason === reason;

              return (
                <button
                  key={reason}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  disabled={submitting}
                  onClick={() => {
                    setSelectedReason(reason);
                    setError("");
                  }}
                  className="flex h-14.5 w-full items-center justify-between border-b border-[#231F201A] text-left disabled:opacity-60"
                >
                  <span className="text-[14px] text-[#5F5F5F]">{reason}</span>

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
            disabled={submitting}
            onClick={() => {
              setSelectedReason(OTHER_REASON);
              setStep("details");
              setError("");
            }}
            className="flex h-14.5 w-full items-center justify-between border-b border-[#231F201A] text-left disabled:opacity-60"
          >
            <span className="text-[14px] text-[#5F5F5F]">{OTHER_REASON}</span>
            <ChevronRight size={27} className="text-[#5F5F5F]" />
          </button>
        </div>

        {error && (
          <p role="alert" className="mt-4 text-sm text-red-600">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={handleReasonSubmit}
          disabled={!selectedReason || submitting}
          className="mt-10 flex h-10 w-full items-center justify-center rounded-sm bg-[#2F7D4F] text-[14px] font-semibold text-white transition hover:bg-[#286A43] disabled:cursor-not-allowed disabled:bg-[#BFC8C2]"
        >
          {submitting ? "Submitting..." : "Submit"}
        </button>
      </div>
    </>
  );

  const renderDetailsStep = () => (
    <>
      <div className="flex h-17 items-center border-b border-[#231F201A] px-7 sm:px-8">
        <button
          type="button"
          disabled={submitting}
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
          disabled={submitting}
          onChange={(event) => {
            setCustomReason(event.target.value);
            if (error) setError("");
          }}
          placeholder="Please describe the problem"
          className="h-37 w-full resize-none border-0 px-9 py-6 text-[14px] text-[#231F20] placeholder:text-[#5F5F5F] focus:outline-none focus:ring-0 disabled:opacity-60"
        />

        {error && (
          <p role="alert" className="mx-8 mb-3 text-sm text-red-600">
            {error}
          </p>
        )}

        <div className="px-7 sm:px-8">
          <button
            type="button"
            onClick={() => submitReason(customReason)}
            disabled={!customReason.trim() || submitting}
            className="flex h-10 w-full items-center justify-center rounded-sm bg-[#2F7D4F] text-[14px] font-semibold text-white transition hover:bg-[#286A43] disabled:cursor-not-allowed disabled:bg-[#BFC8C2]"
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </>
  );

  const renderCompleteStep = () => (
    <>
      <div className="flex h-17 items-center justify-between border-b border-[#231F201A] px-8 sm:px-10">
        <h2 className="text-[18px] font-semibold leading-none text-[#231F20] sm:text-[19px]">
          Cancellation request submitted
        </h2>
        <Info size={17} className="text-[#8A8A8A]" />
      </div>

      <div className="px-8 pb-10 pt-9 text-center sm:px-10">
        <p className="mx-auto max-w-97.5 text-[14px] leading-5 text-[#231F20]">
          Your cancellation request has been received and is being reviewed. We
          will notify you once a decision has been made.
        </p>

        <div className="mt-15.5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <button
            type="button"
            onClick={finishFlow}
            className="flex h-10 items-center justify-center rounded-sm border border-[#D9D9D9] bg-white text-[14px] font-semibold text-[#231F20] hover:bg-[#F7F7F7]"
          >
            Close
          </button>

          <button
            type="button"
            onClick={finishFlow}
            className="flex h-10 items-center justify-center rounded-sm bg-[#2F7D4F] text-[14px] font-semibold text-white hover:bg-[#286A43]"
          >
            Continue
          </button>
        </div>
      </div>
    </>
  );

  const renderReviewStep = () => (
    <>
      <div className="flex h-17 items-center justify-between border-b border-[#231F201A] px-8 sm:px-10">
        <h2 className="text-[18px] font-semibold leading-none text-[#231F20] sm:text-[19px]">
          Cancellation under review
        </h2>
        <Info size={17} className="text-[#8A8A8A]" />
      </div>

      <div className="px-8 pb-10 pt-9 text-center sm:px-10">
        <p className="mx-auto max-w-97.5 text-[14px] leading-5 text-[#231F20]">
          Your cancellation request has been received and is being reviewed. We
          will notify you once a decision has been made.
        </p>

        <div className="mt-15.5">
          <button
            type="button"
            onClick={finishFlow}
            className="flex h-10 w-full items-center justify-center rounded-sm bg-[#2F7D4F] text-[14px] font-semibold text-white hover:bg-[#286A43]"
          >
            Close
          </button>
        </div>
      </div>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={
        step === "complete" || step === "review" ? finishFlow : closeModal
      }
      showCloseButton={false}
      overlayClassName="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-3"
      panelClassName="relative w-full max-w-[508px] overflow-hidden rounded-[6px] border border-[#231F201A] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.22)]"
      contentClassName="text-[#231F20]"
    >
      {step === "reason" && renderReasonStep()}
      {step === "details" && renderDetailsStep()}
      {step === "complete" && renderCompleteStep()}
      {step === "review" && renderReviewStep()}
    </Modal>
  );
}
