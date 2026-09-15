import { useRef, useState } from "react";
import axios from "axios";
import { ChevronDown, UploadCloud, X } from "lucide-react";
import InputField from "../../../../components/InputField";
import BusinessSetupLayout from "../BusinessSetupLayout";

const BUSINESS_DETAILS_ENDPOINT = "/businesses/business-details";
const FILE_UPLOAD_CATEGORY = "identity_docs";

const CATEGORIES = [
  { id: "transport", label: "Transport & Logistics" },
  { id: "beauty", label: "Beauty & Personal Care" },
];

const MAX_FILE_SIZE_MB = 5;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "application/pdf"];

export default function BusinessInfo({ onNext, onBack }) {
  const [form, setForm] = useState({
    category: "",
    businessName: "",
    address: "",
    city: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [ninFile, setNinFile] = useState(null);
  const [uploadingNin, setUploadingNin] = useState(false);
  const [ninError, setNinError] = useState("");
  const ninInputRef = useRef(null);

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors((er) => ({ ...er, [field]: undefined }));
  };

  const handleCategoryChange = (e) => {
    setForm((f) => ({ ...f, category: e.target.value }));
    if (errors.category) setErrors((er) => ({ ...er, category: undefined }));
  };

  const uploadFile = async (file) => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");

    if (!token || !email) {
      throw new Error("Your session has expired. Please sign in again.");
    }

    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/file/${encodeURIComponent(email)}/${FILE_UPLOAD_CATEGORY}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data?.file?.url ?? response.data?.data?.file?.url;
  };

  const handleNinFile = async (fileList) => {
    const file = fileList?.[0];
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setNinError("Only JPEG, PNG or PDF files are allowed.");
      return;
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setNinError(`File must be under ${MAX_FILE_SIZE_MB}MB.`);
      return;
    }

    setNinError("");
    setUploadingNin(true);
    try {
      const url = await uploadFile(file);
      setNinFile({ name: file.name, url });
      if (errors.nin) setErrors((er) => ({ ...er, nin: undefined }));
    } catch (err) {
      setNinError(
        err.response?.data?.message ||
          "Failed to upload NIN slip. Please try again.",
      );
    } finally {
      setUploadingNin(false);
    }
  };

  const handleNinDrop = (e) => {
    e.preventDefault();
    handleNinFile(e.dataTransfer.files);
  };

  const handleRemoveNin = () => {
    setNinFile(null);
    setNinError("");
  };

  const validate = () => {
    const next = {};
    if (!form.category) next.category = "Please select a business category";
    if (!form.businessName.trim())
      next.businessName = "Business name is required";
    if (!form.address.trim()) next.address = "Business address is required";
    if (!form.city.trim()) next.city = "City of operation is required";
    if (!ninFile) next.nin = "Please upload your NIN slip";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (uploadingNin) {
      setNinError("Please wait for the NIN slip to finish uploading.");
      return;
    }

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
      const token = localStorage.getItem("token");

      if (!token) {
        setErrorMessage(
          "Your session has expired. Please sign in again and continue onboarding.",
        );
        return;
      }

      const categoryLabel = CATEGORIES.find(
        (c) => c.id === form.category,
      )?.label;

      const payload = {
        businessName: form.businessName.trim(),
        businessAddress: form.address.trim(),
        cityOfOperation: form.city.trim(),
        ninUrl: ninFile.url,
        businessCategory: categoryLabel,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}${BUSINESS_DETAILS_ENDPOINT}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 200 || response.status === 201) {
        setSuccessMessage("Business information saved successfully!");
        onNext({
          businessCategory: categoryLabel,
          businessName: form.businessName,
          address: form.address,
          city: form.city,
          ninUrl: ninFile.url,
          businessDetails: response.data,
        });
      } else {
        setErrorMessage("Something went wrong");
      }
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
    <BusinessSetupLayout currentStep={0}>
      <div style={{ background: "#fff", minHeight: "100vh" }}>
        {/* <div
          onClick={onBack}
          className="flex items-center gap-2 w-fit cursor-pointer"
        >
          <IoIosArrowBack size={24} />
          <h2 className="text-lg">Back</h2>
        </div> */}

        <div className="w-full max-w-lg px-5 py-8">
          <h1 className="text-[19px] font-semibold text-gray-900 tracking-tight">
            Tell us about your business
          </h1>
          <p className="mt-1.5 text-[13px] leading-snug text-gray-500">
            Provide accurate details about your company to help us verify your
            business and set up your account.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="mt-7 space-y-5"
          >
            <div>
              <label className="block text-[13px] font-medium text-gray-900 mb-2">
                Business category
              </label>
              <div className="relative">
                <select
                  value={form.category}
                  onChange={handleCategoryChange}
                  className="w-full appearance-none rounded-lg bg-gray-100 border border-[#231F2040] px-4 py-3.5 text-[13px] text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#005823]/30"
                >
                  <option value="" disabled>
                    Select category
                  </option>
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                />
              </div>
              {errors.category && (
                <p className="mt-1.5 text-[12px] text-red-600">
                  {errors.category}
                </p>
              )}
            </div>

            {/* Rest of the form only appears once a category is picked. */}
            {form.category && (
              <>
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
                    <p className="mt-1.5 text-[12px] text-red-600">
                      {errors.city}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-gray-900 mb-2">
                    NIN Slip
                  </label>

                  {!ninFile ? (
                    <div
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={handleNinDrop}
                      onClick={() =>
                        !uploadingNin && ninInputRef.current?.click()
                      }
                      className={`flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 py-10 text-center transition-colors ${
                        uploadingNin
                          ? "cursor-not-allowed opacity-60"
                          : "cursor-pointer hover:bg-gray-50"
                      }`}
                    >
                      <UploadCloud size={32} className="text-[#005823]" />
                      <p className="text-[15px] text-gray-700">
                        {uploadingNin ? (
                          "Uploading..."
                        ) : (
                          <>
                            Upload NIN slip{" "}
                            <span className="font-medium text-[#005823] underline">
                              Browse
                            </span>
                          </>
                        )}
                      </p>
                      <p className="text-[12px] text-gray-400">
                        JPEG, PNG, PDF format, Max {MAX_FILE_SIZE_MB}MB
                      </p>
                      <input
                        ref={ninInputRef}
                        type="file"
                        accept={ACCEPTED_TYPES.join(",")}
                        className="hidden"
                        disabled={uploadingNin}
                        onChange={(e) => handleNinFile(e.target.files)}
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3">
                      <span className="max-w-[220px] truncate text-[13px] text-gray-700">
                        {ninFile.name}
                      </span>
                      <button
                        type="button"
                        aria-label="Remove NIN slip"
                        onClick={handleRemoveNin}
                        className="hover:text-red-500"
                      >
                        <X size={15} />
                      </button>
                    </div>
                  )}

                  {ninError && (
                    <p className="mt-1.5 text-[12px] text-red-600">
                      {ninError}
                    </p>
                  )}
                  {errors.nin && !ninError && (
                    <p className="mt-1.5 text-[12px] text-red-600">
                      {errors.nin}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting || uploadingNin}
                  className="ml-auto flex items-center gap-1.5 rounded-lg bg-[#005823CC] px-6 py-3 text-[14px] font-medium text-white hover:bg-emerald-900 active:bg-emerald-950 transition-colors disabled:opacity-60"
                >
                  {submitting ? "Saving..." : "Save & Continue"}
                </button>
              </>
            )}
          </form>

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
