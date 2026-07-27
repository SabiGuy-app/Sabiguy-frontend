import { useState, useRef } from "react";
import { Upload, FileCheck2, X } from "lucide-react";
import InputField from "../../../../components/InputField";
import BusinessSetupLayout from "../BusinessSetupLayout";
import { IoIosArrowBack } from "react-icons/io";
import { Link } from "react-router-dom";

export default function BusinessInfo({ onNext, onBack }) {
  const [form, setForm] = useState({
    businessName: "",
    cacNumber: "",
    address: "",
    city: "",
    nin: "",
  });
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const fileInputRef = useRef(null);

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors((er) => ({ ...er, [field]: undefined }));
  };

  const handleFileSelect = (e) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      if (errors.file) setErrors((er) => ({ ...er, file: undefined }));
    }
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const validate = () => {
    const next = {};
    if (!form.businessName.trim())
      next.businessName = "Business name is required";
    if (!form.cacNumber.trim())
      next.cacNumber = "CAC registration number is required";
    if (!form.address.trim()) next.address = "Business address is required";
    if (!form.city.trim()) next.city = "City of operation is required";
    if (!file) next.file = "Please upload your CAC certificate";
    if (!form.nin.trim()) next.nin = "NIN is required";
    else if (!/^\d{11}$/.test(form.nin.trim()))
      next.nin = "NIN must be 11 digits";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!validate()) return;

    if (typeof onNext !== "function") {
      console.error(
        "BusinessInfo: `onNext` prop is missing or not a function. " +
          "Check that the parent component passes onNext={...} to <BusinessInfo />.",
      );
      setErrorMessage("Something went wrong moving to the next step.");
      return;
    }

    setSubmitting(true);
    try {

      setSuccessMessage("Business information saved successfully!");
      onNext({ ...form, file });
    } catch (error) {
      console.error("BusinessInfo submit error:", error);
      if (error.response) {
        setErrorMessage(
          error.response.data?.message ||
            "Unable to save your details. Please try again.",
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
    <BusinessSetupLayout currentStep={1}>
      <div
        style={{ background: "#fff", minHeight: "100vh" }}
      >
        <Link
          to={"/service-provider/signup"}
          className="flex items-center gap-2 w-fit cursor-pointer"
        >
          <IoIosArrowBack size={24} />
          <h2 className="text-lg">Back</h2>
        </Link>
        <div className="w-full max-w-lg px-5 py-8">
          <h1 className="text-[19px] font-semibold text-gray-900 tracking-tight">
            Tell us more about your company
          </h1>
          <p className="mt-1.5 text-[13px] leading-snug text-gray-500">
            Let's know who you are, tell us a bit about your fleet business
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="mt-7 space-y-5"
          >
            <div>
              <InputField
                name="businessName"
                label="Business Name"
                placeholder="e.g Adewale Fleet Services"
                value={form.businessName}
                onChange={handleChange("businessName")}
                error={errors.businessName}
              />
              {errors.businessName && (
                <p className="mt-1.5 text-[12px] text-red-600">
                  {errors.businessName}
                </p>
              )}
            </div>

            <div>
              <InputField
                name="cacNumber"
                label="CAC Registration Number"
                placeholder="e.g BN-1234567"
                value={form.cacNumber}
                onChange={handleChange("cacNumber")}
                error={errors.cacNumber}
              />
              {errors.cacNumber && (
                <p className="mt-1.5 text-[12px] text-red-600">
                  {errors.cacNumber}
                </p>
              )}
            </div>

            <div>
              <InputField
                name="address"
                label="Business Address"
                placeholder="Address"
                value={form.address}
                onChange={handleChange("address")}
                error={errors.address}
              />
              {errors.address && (
                <p className="mt-1.5 text-[12px] text-red-600">
                  {errors.address}
                </p>
              )}
            </div>

            <div>
              <InputField
                name="city"
                label="City of operation"
                placeholder="Ibadan"
                value={form.city}
                onChange={handleChange("city")}
                error={errors.city}
              />
              {errors.city && (
                <p className="mt-1.5 text-[12px] text-red-600">{errors.city}</p>
              )}
            </div>

            <div>
              <label className="block text-[13px] font-medium text-gray-900">
                Upload CAC Certificate
              </label>
              <p className="mt-1 text-[12.5px] leading-snug text-gray-500">
                Kindly upload a picture of your CAC Certificate (make sure all
                details are readable)
              </p>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf"
                className="hidden"
                onChange={handleFileSelect}
              />

              {!file ? (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-3 w-full flex items-center justify-center gap-2 rounded-lg bg-gray-100 py-3.5 text-[13px] font-medium text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  <Upload size={15} strokeWidth={2} />
                  Upload file
                </button>
              ) : (
                <div className="mt-3 w-full flex items-center justify-between gap-2 rounded-lg bg-gray-100 py-3 px-4">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileCheck2
                      size={16}
                      className="text-emerald-700 shrink-0"
                    />
                    <span className="text-[13px] text-gray-700 truncate">
                      {file.name}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={removeFile}
                    aria-label="Remove file"
                    className="shrink-0 text-gray-400 hover:text-gray-600"
                  >
                    <X size={15} />
                  </button>
                </div>
              )}
              {errors.file && (
                <p className="mt-1.5 text-[12px] text-red-600">{errors.file}</p>
              )}
            </div>

            <div>
              <InputField
                name="nin"
                label="NIN"
                placeholder="Enter your NIN number"
                value={form.nin}
                onChange={handleChange("nin")}
                error={errors.nin}
                inputMode="numeric"
              />
              {errors.nin && (
                <p className="mt-1.5 text-[12px] text-red-600">{errors.nin}</p>
              )}
            </div>
          </form>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="mt-8 ml-auto flex items-center gap-1.5 rounded-lg bg-[#005823CC] px-6 py-3 text-[14px] font-medium text-white hover:bg-emerald-900 active:bg-emerald-950 transition-colors disabled:opacity-60"
          >
            {submitting ? "Saving..." : "Save & Continue"}
          </button>

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

function Field({ label, placeholder, value, onChange, error, inputMode }) {
  return (
    <div>
      <label className="block text-[13px] font-medium text-gray-900">
        {label}
      </label>
      <input
        type="text"
        inputMode={inputMode}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`mt-2 w-full rounded-lg bg-gray-100 px-4 py-3.5 text-[13.5px] text-gray-800 placeholder:text-gray-400 outline-none focus:ring-2 transition-shadow ${
          error ? "ring-2 ring-red-300" : "focus:ring-emerald-700/40"
        }`}
      />
      {error && <p className="mt-1.5 text-[12px] text-red-600">{error}</p>}
    </div>
  );
}
