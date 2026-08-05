import { useState } from "react";
import { Plus, IdCard } from "lucide-react";
import InputField from "../../../../components/InputField";
import BusinessSetupLayout from "../BusinessSetupLayout";
import { IoIosArrowBack } from "react-icons/io";

const DRIVER_ID_REGEX = /^[A-Za-z]{2,5}-\d{4,8}$/;

export default function AddDriverForm({ onNext, onBack }) {
  const [invites, setInvites] = useState([]);
  const [driverId, setDriverId] = useState("");
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const validateDriverId = (value) => {
    if (!value.trim()) return "Driver ID is required";
    if (!DRIVER_ID_REGEX.test(value.trim())) {
      return "Enter a valid driver ID, e.g. SGD-284961";
    }
    return "";
  };

  const handleChange = (e) => {
    setDriverId(e.target.value);
    if (touched) setError(validateDriverId(e.target.value));
  };

  const handleBlur = () => {
    setTouched(true);
    setError(validateDriverId(driverId));
  };

  const handleSendInvite = async () => {
    const err = validateDriverId(driverId);
    if (err) {
      setTouched(true);
      setError(err);
      return;
    }
    setSending(true);
    await new Promise((r) => setTimeout(r, 700));
    setSending(false);

    setInvites((list) => [
      ...list,
      { id: Date.now(), driverId: driverId.trim(), status: "invited" },
    ]);
    setDriverId("");
    setTouched(false);
    setError("");
  };

  const handleSaveAndContinue = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    setSubmitting(true);
    try {
      setSuccessMessage("Drivers saved successfully!");
      onNext({ invites });
    } catch (error) {
      console.error("AddDriverForm submit error:", error);
      if (error.response) {
        setErrorMessage(
          error.response.data?.message ||
            "Unable to save your drivers. Please try again.",
        );
      } else if (error.request) {
        setErrorMessage("No response from the server. Please try again later.");
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <BusinessSetupLayout currentStep={3}>
      <div style={{ background: "#fff", minHeight: "100vh" }}>
        <div
          onClick={onBack}
          className="flex items-center gap-2 w-fit cursor-pointer"
        >
          <IoIosArrowBack size={24} />
          <h2 className="text-lg">Back</h2>
        </div>
        <div className="w-full max-w-lg px-5 py-8">
          <h1 className="text-[20px] font-semibold text-[#231F20]">
            Invite drivers
          </h1>
          <p className="mt-1.5 text-[16px] leading-snug text-[#231F20BF]">
            Enter a registered driver&rsquo;s ID to send a fleet invitation.
            They&rsquo;ll need to accept before joining your fleet.
          </p>

          {invites.length > 0 && (
            <div className="mt-6 space-y-2">
              {invites.map((inv) => (
                <div
                  key={inv.id}
                  className="flex items-center justify-between rounded-[8px] border border-[#231F2040] px-4 py-3"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md text-black">
                      <IdCard size={20} />
                    </div>
                    <span className="text-[16px] font-medium text-[#231F20]">
                      {inv.driverId}
                    </span>
                  </div>
                  <span className="rounded-full bg-[#FEF3C7] border border-[#FFC107] px-4 py-1 text-[12px] font-medium text-[#92400E]">
                    Invited
                  </span>
                </div>
              ))}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendInvite();
            }}
            className="mt-6 space-y-5"
          >
            <div>
              <InputField
                name="driverId"
                label="Driver ID"
                placeholder="e.g. SGD-284961"
                value={driverId}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched ? error : ""}
              />
              {touched && error && (
                <p className="mt-1.5 text-[12px] text-red-600">{error}</p>
              )}
            </div>

            <button
              type="button"
              onClick={handleSendInvite}
              disabled={sending}
              className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-[#005823] py-3.5 text-[14px] font-medium text-[#005823] hover:bg-[#00582310] transition-colors disabled:opacity-60"
            >
              <Plus size={15} />
              {sending ? "Sending..." : "Send Invite"}
            </button>
          </form>

          <div className="mt-8 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleSaveAndContinue}
              disabled={submitting || invites.length === 0}
              className="rounded-lg bg-[#005823CC] px-6 py-3 text-[14px] font-medium text-white hover:bg-emerald-900 active:bg-emerald-950 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "Saving..." : "Save & Continue"}
            </button>
          </div>

          {errorMessage && (
            <p className="mt-3 text-[12px] text-red-600">{errorMessage}</p>
          )}
          {successMessage && (
            <p className="mt-3 text-[12px] text-green-600">{successMessage}</p>
          )}
        </div>
      </div>
    </BusinessSetupLayout>
  );
}
