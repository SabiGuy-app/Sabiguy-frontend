import { useState } from "react";
import axios from "axios";
import { X } from "lucide-react";
import Button from "../../../../components/button";
import UploadBox from "../../../../components/uploadBox";
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

  const handleRemoveNin = () => {
    setNinFile(null);
    setNinError("");
  };

  const canContinue = Boolean(
    form.category && form.businessName.trim() && form.address.trim() &&
    form.city.trim() && ninFile?.url,
  );

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
          businessCategoryId: form.category,
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
      <div className="text-[#231F20]">
        <div className="w-full max-w-lg">
          <h1 className="text-xl font-semibold text-gray-900 tracking-tight">
            Tell us about your business
          </h1>
          <p className="mt-1.5 text-base leading-relaxed text-[#231F20BF]">
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
              <InputField select name="businessCategory" label="Business category"
                placeholder="Select category" value={form.category}
                options={CATEGORIES.map((category) => ({ value: category.id, label: category.label }))}
                onChange={(option) => handleCategoryChange({ target: { value: option.value } })} />
              {errors.category && (
                <p className="mt-1.5 text-sm text-red-600">
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
                    placeholder="e.g Adewale Services"
                    value={form.businessName}
                    onChange={handleChange("businessName")}
                  />
                  {errors.businessName && (
                    <p className="mt-1.5 text-sm text-red-600">
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
                  />
                  {errors.address && (
                    <p className="mt-1.5 text-sm text-red-600">
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
                  />
                  {errors.city && (
                    <p className="mt-1.5 text-sm text-red-600">
                      {errors.city}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-base font-medium text-[#231F20] mb-2">
                    NIN Slip
                  </label>

                  {!ninFile ? (
                    <UploadBox multiple={false} accept={ACCEPTED_TYPES.join(",")} maxSizeMB={MAX_FILE_SIZE_MB}
                      prompt="Upload NIN slip" formatHint="JPEG, PNG, PDF format, Max 5 MB"
                      disabled={submitting} onUploadStart={() => { setUploadingNin(true); setNinError(""); }}
                      onUploadEnd={() => setUploadingNin(false)} onError={setNinError}
                      uploadFile={async (file) => {
                        const url = await uploadFile(file);
                        if (!url) throw new Error("Upload failed. Please try again.");
                        setNinFile({ name: file.name, url });
                        setErrors((previous) => ({ ...previous, nin: undefined }));
                        return url;
                      }} />
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
                    <p className="mt-1.5 text-sm text-red-600">
                      {ninError}
                    </p>
                  )}
                  {errors.nin && !ninError && (
                    <p className="mt-1.5 text-sm text-red-600">
                      {errors.nin}
                    </p>
                  )}
                </div>

                <div className="flex justify-end gap-4 pt-2">
                  <Button type="button" variant="ghost" onClick={onBack} disabled={submitting || uploadingNin}>Back</Button>
                  <Button type="submit" disabled={!canContinue || submitting || uploadingNin}>
                    {submitting ? "Saving..." : "Save & Continue"}
                  </Button>
                </div>
              </>
            )}
          </form>

          {errorMessage && (
            <p className="mt-3 text-sm text-red-600">{errorMessage}</p>
          )}
          {successMessage && (
            <p className="mt-3 text-sm text-[#005823]">{successMessage}</p>
          )}
        </div>
      </div>
    </BusinessSetupLayout>
  );
}
