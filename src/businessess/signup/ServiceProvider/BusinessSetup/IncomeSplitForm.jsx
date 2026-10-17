import { useState } from "react";
import { Check, AlertCircle } from "lucide-react";
import BusinessSetupLayout from "../BusinessSetupLayout";
import { IoIosArrowBack } from "react-icons/io";

const PLATFORM_SHARE = 10;

export default function IncomeSplitForm({ onNext, onBack }) {
  const [driver, setDriver] = useState(63);
  const [company, setCompany] = useState(27);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const total = driver + company + PLATFORM_SHARE;
  const isValid = total === 100;

  const handleDriverChange = (e) => {
    const val = e.target.value;
    if (val === "") return setDriver("");
    const num = Math.max(0, Math.min(100, Number(val)));
    setDriver(num);
  };

  const handleCompanyChange = (e) => {
    const val = e.target.value;
    if (val === "") return setCompany("");
    const num = Math.max(0, Math.min(100, Number(val)));
    setCompany(num);
  };

  const goNext = (payload) => {
    if (typeof onNext !== "function") {
      console.error(
        "IncomeSplitForm: `onNext` prop is missing or not a function. " +
          "Check that the parent component passes onNext={...} to <IncomeSplitForm />.",
      );
      setErrorMessage("Something went wrong moving to the next step.");
      return;
    }
    onNext(payload);
  };

  const handleSaveAndContinue = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!isValid) return;

    setSubmitting(true);
    try {

      setSuccessMessage("Income split saved successfully!");
      goNext({ incomeSplit: { driver, company, platform: PLATFORM_SHARE } });
    } catch (error) {
      console.error("IncomeSplitForm submit error:", error);
      if (error.response) {
        setErrorMessage(
          error.response.data?.message ||
            "Unable to save your income split. Please try again.",
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
    <BusinessSetupLayout currentStep={4}>
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
            Set your income split
          </h1>
          <p className="mt-1.5 text-[16px] leading-snug text-[#231F20BF]">
            How fares are shared. Drivers earn their share, SabiGuy takes 10%,
            you keep the rest. You can set per-driver deals later.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveAndContinue();
            }}
          >
            <div className="mt-7 grid grid-cols-3 gap-3">
              <SplitField
                label="Driver"
                value={driver}
                onChange={handleDriverChange}
                colorClass="text-[#005823]"
              />
              <SplitField
                label="Company"
                value={company}
                onChange={handleCompanyChange}
                colorClass="text-[#7C3AED]"
              />
              <SplitField
                label="Platform"
                value={PLATFORM_SHARE}
                readOnly
                colorClass="text-gray-400"
              />
            </div>

            <div className="mt-5 flex items-center justify-between rounded-lg border border-[#00582340] px-4 py-5">
              <div className="flex items-center gap-2">
                {isValid ? (
                  <Check size={18} className="text-emerald-700" />
                ) : (
                  <AlertCircle size={18} className="text-amber-500" />
                )}
                <span
                  className={`text-[13px] font-medium ${
                    isValid ? "text-emerald-700" : "text-amber-600"
                  }`}
                >
                  {isValid ? "Adds up to 100" : `Should add up to 100`}
                </span>
              </div>
              <span
                className={`text-[16px] font-semibold ${
                  isValid ? "text-emerald-800" : "text-amber-600"
                }`}
              >
                {total}%
              </span>
            </div>
          </form>

          <div className="mt-8 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleSaveAndContinue}
              disabled={!isValid || submitting}
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

function SplitField({ label, value, onChange, readOnly, colorClass }) {
  return (
    <div>
      <label className="block text-[16px] font-medium text-[#231F20]">
        {label}
      </label>
      <div
        className={`mt-2 flex items-center justify-between border border-[#231F201A] rounded-lg bg-gray-100 px-3 py-3.5 ${
          readOnly ? "opacity-70" : ""
        }`}
      >
        <input
          type="number"
          value={value}
          onChange={onChange}
          readOnly={readOnly}
          min={0}
          max={100}
          className={`w-full bg-transparent text-[15px] font-semibold outline-none ${colorClass} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
        />
        <span className="text-[13px] text-gray-400 ml-1 shrink-0">%</span>
      </div>
    </div>
  );
}
