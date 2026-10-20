import { useState } from "react";
import { Plus } from "lucide-react";
import InputField from "../InputField";

// Shared registration section for individual-provider onboarding forms.
export default function BusinessRegistrationFields({ values, setFieldValue, handleChange, handleBlur, uploadFile, onUploadingChange }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const registered = values?.isRegistered === true;

  const handleUpload = async (event) => {
    const input = event.target;
    const file = input.files?.[0];
    if (!file) return;
    setUploading(true);
    onUploadingChange?.(true);
    setError("");
    try {
      const url = await uploadFile(file, "cac");
      if (!url) throw new Error("The upload did not return a certificate URL. Please try again.");
      setFieldValue("cacFile", url);
      setFieldValue("cacFileName", file.name);
    } catch (error) {
      setError(error?.response?.data?.message || error.message || "Unable to upload certificate. Please try again.");
    } finally {
      setUploading(false);
      onUploadingChange?.(false);
      input.value = "";
    }
  };

  return (
    <div className="rounded-lg p-0">
      <div className="mb-5">
        <p className="mb-1.5 text-sm text-neutral-700">Are you a registered business</p>
        <div className="flex gap-1.5">
          {[true, false].map((answer) => (
            <button key={String(answer)} type="button" disabled={uploading}
              aria-pressed={values?.isRegistered === answer}
              onClick={() => setFieldValue("isRegistered", answer)}
              className={`rounded-full border px-3 py-0.5 text-xs transition-colors ${values?.isRegistered === answer ? "border-green-800 bg-green-800 text-white" : "border-neutral-300 bg-neutral-100 text-neutral-700"}`}>
              {answer ? "Yes" : "No"}
            </button>
          ))}
        </div>
      </div>
      {registered && (
        <div className="space-y-5">
          <InputField label="Business Name" name="BusinessName" value={values.BusinessName || ""}
            onChange={handleChange} onBlur={handleBlur} placeholder="e.g Adewale Salon & Spa" />
          <InputField label="Business Address" name="BusinessAddress" value={values.BusinessAddress || ""}
            onChange={handleChange} onBlur={handleBlur} placeholder="Address" />
          <div>
            <p className="mb-1 text-sm font-semibold">Business Certificate</p>
            <p className="mb-3 text-sm text-neutral-600">Upload a valid certificate showing your relevant training or qualification.</p>
            <input id="cacFile" name="cacFile" type="file" accept=".pdf,.png,.jpg,.jpeg"
              onChange={handleUpload} disabled={uploading} onBlur={handleBlur} className="hidden" />
            <label htmlFor="cacFile" className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-[#34805A] bg-[#34805A] py-3 text-sm font-medium text-white transition-colors hover:bg-[#296647]">
              <Plus size={16} />{uploading ? "Uploading..." : "Upload file"}
            </label>
            {values.cacFileName && <p className="mt-2 text-sm text-gray-600">{values.cacFileName}</p>}
            {error && <p role="alert" className="mt-2 text-sm text-red-600">{error}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
