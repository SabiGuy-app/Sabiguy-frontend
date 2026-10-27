import { useState } from "react";
import { X } from "lucide-react";
import UploadBox from "./uploadBox";

export default function ImageUploadField({
  label,
  value,
  onChange,
  uploadFile,
  onUploadingChange,
  error,
  disabled = false,
  required = false,
  prompt = "Drop an image here or",
}) {
  const [uploadError, setUploadError] = useState("");
  const [uploading, setUploading] = useState(false);

  return (
    <fieldset disabled={disabled} className="min-w-0">
      <legend className="mb-3 text-sm font-medium text-gray-700">
        {label}{required && <span className="ml-1 text-red-600">*</span>}
      </legend>
      {value ? (
        <div className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 sm:max-w-sm">
          <img src={value} alt={label} className="h-20 w-20 rounded-md object-cover" />
          <p className="flex-1 text-sm text-gray-600">Image uploaded</p>
          <button type="button" aria-label={`Remove ${label.toLowerCase()}`} disabled={disabled}
            onClick={() => { onChange(""); setUploadError(""); }}
            className="rounded-md p-2 text-gray-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-50">
            <X size={18} />
          </button>
        </div>
      ) : (
        <UploadBox compact multiple={false} accept="image/jpeg,image/png,image/webp"
          maxSizeMB={5} uploadFile={uploadFile} disabled={disabled}
          prompt={prompt} formatHint="JPEG, PNG, WEBP (Max 5 MB)"
          className="sm:max-w-sm"
          onUploadStart={() => {
            setUploadError(""); setUploading(true); onUploadingChange?.(true);
          }}
          onUploadEnd={() => { setUploading(false); onUploadingChange?.(false); }}
          onUploadComplete={(urls) => onChange(urls[0])}
          onError={setUploadError} />
      )}
      <div aria-live="polite">
        {uploading && <p className="mt-2 text-xs text-gray-500">Please wait for the image to finish uploading.</p>}
        {(uploadError || error) && <p role="alert" className="mt-2 text-sm text-red-600">{uploadError || error}</p>}
      </div>
    </fieldset>
  );
}
