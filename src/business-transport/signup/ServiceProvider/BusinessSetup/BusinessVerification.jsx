import { useRef, useState } from "react";
import { UploadCloud, X, FileText } from "lucide-react";
import BusinessSetupLayout from "../BusinessSetupLayout";
import Button from "../../../../components/button";
import UploadBox from "../../../../components/uploadBox";
import axios from "axios";

const MAX_FILE_SIZE_MB = 5;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "application/pdf"];
const MIN_BUSINESS_PHOTOS = 1;

// Single-file documents: id, upload folder, label, description
const SINGLE_DOCUMENTS = [
  {
    id: "cacCertificate",
    field: "cac_certificate",
    label: "Upload CAC Certificate",
    description:
      "Kindly upload a picture of your CAC Certificate (make sure all details are readable)",
  },
  {
    id: "profilePhoto",
    field: "profile_photo",
    label: "Profile photo",
    description:
      "Please provide a clear portrait picture of yourself. It should show your full face, front view, with eyes open. No filters, sunglasses or masks.",
  },
];

const BUSINESS_PHOTO_FIELD = "business_photo";

export default function BusinessVerification({ onBack, onNext }) {
  const [files, setFiles] = useState({}); // single-doc uploads: { [id]: { name, url } }
  const [uploading, setUploading] = useState({}); // single-doc uploading flags: { [id]: bool }
  const [fieldErrors, setFieldErrors] = useState({}); // single-doc errors: { [id]: string }
  const inputRefs = useRef({});

  const [businessPhotos, setBusinessPhotos] = useState([]); // [{ id, name, url }]
  const [uploadingBusinessPhotos, setUploadingBusinessPhotos] = useState(false);
  const [businessPhotoError, setBusinessPhotoError] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email");

  const uploadFile = async (file, folder) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/file/${email}/${folder}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data.file.url;
  };

  // ---- Single-file documents (CAC certificate, profile photo) ----

  const handleFile = async (doc, file) => {
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setFieldErrors((prev) => ({
        ...prev,
        [doc.id]: "Only JPEG, PNG or PDF files are allowed.",
      }));
      return;
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setFieldErrors((prev) => ({
        ...prev,
        [doc.id]: `File must be under ${MAX_FILE_SIZE_MB}MB.`,
      }));
      return;
    }

    setFieldErrors((prev) => ({ ...prev, [doc.id]: "" }));
    setUploading((prev) => ({ ...prev, [doc.id]: true }));

    try {
      const url = await uploadFile(file, doc.field);
      setFiles((prev) => ({
        ...prev,
        [doc.id]: { name: file.name, url },
      }));
    } catch (err) {
      setFieldErrors((prev) => ({
        ...prev,
        [doc.id]:
          err.response?.data?.message || "Failed to upload. Please try again.",
      }));
    } finally {
      setUploading((prev) => ({ ...prev, [doc.id]: false }));
    }
  };

  const handleRemove = (doc) => {
    setFiles((prev) => {
      const next = { ...prev };
      delete next[doc.id];
      return next;
    });
    setFieldErrors((prev) => ({ ...prev, [doc.id]: "" }));
    if (inputRefs.current[doc.id]) inputRefs.current[doc.id].value = "";
  };

  // ---- Business photos (multiple) ----

  const handleRemoveBusinessPhoto = (id) => {
    setBusinessPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  const canContinue = SINGLE_DOCUMENTS.every((doc) => Boolean(files[doc.id]?.url)) &&
    businessPhotos.filter((photo) => photo.url).length >= MIN_BUSINESS_PHOTOS;


  const handleSubmit = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (Object.values(uploading).some(Boolean) || uploadingBusinessPhotos) {
      setErrorMessage("Please wait for uploads to finish.");
      return;
    }

    const missingSingle = SINGLE_DOCUMENTS.filter((doc) => !files[doc.id]);
    const missingBusinessPhotos = businessPhotos.length < MIN_BUSINESS_PHOTOS;

    if (missingSingle.length > 0 || missingBusinessPhotos) {
      const missingLabels = missingSingle.map((d) => d.label);
      if (missingBusinessPhotos) missingLabels.push("Business/Store photo");
      setErrorMessage(`Please upload: ${missingLabels.join(", ")}.`);
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        cacCertificateUrl: files.cacCertificate.url,
        profilePhotoUrl: files.profilePhoto.url,
        businessPhotos: businessPhotos.map((p) => p.url),
      };

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/businesses/business-verification`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 200 || response.status === 201) {
        setSuccessMessage("Documents saved successfully!");
        onNext();
      } else {
        setErrorMessage("Something went wrong");
      }
    } catch (error) {
      console.error("BusinessVerification submit error:", error);
      if (error.response) {
        setErrorMessage(
          error.response.data?.message ||
            "Unable to save your documents. Please try again.",
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
      <div className="text-[#231F20]">
        <div className="w-full max-w-lg">
          <h1 className="text-[20px] font-semibold text-[#231F20]">
            Business Verification
          </h1>
          <p className="mt-1.5 text-[16px] leading-snug text-[#231F20BF]">
            We just need a few documents to confirm your business details and
            get you set up on SabiGuy.
          </p>

          <div className="mt-6 space-y-6">
            {SINGLE_DOCUMENTS.map((doc) => {
              const file = files[doc.id];
              const isUploading = uploading[doc.id];
              const error = fieldErrors[doc.id];

              return (
                <div key={doc.id}>
                  <label className="block text-base font-medium text-[#231F20] mb-1">
                    {doc.label}
                  </label>
                  <p className="mb-2 text-sm leading-relaxed text-[#231F20BF]">
                    {doc.description}
                  </p>

                  {file ? (
                    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                      <div className="flex min-w-0 items-center gap-2">
                        <FileText
                          size={16}
                          className="shrink-0 text-[#005823]"
                        />
                        <span className="truncate text-[14px] text-gray-700">
                          {file.name}
                        </span>
                      </div>
                      <button
                        type="button"
                        aria-label={`Remove ${doc.label}`}
                        onClick={() => handleRemove(doc)}
                        className="shrink-0 hover:text-red-500"
                      >
                        <X size={15} />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      disabled={isUploading || submitting}
                      onClick={() => inputRefs.current[doc.id]?.click()}
                      className={`flex w-full items-center justify-center gap-2 rounded-md border border-gray-400 bg-gray-50 px-5 py-4 text-base text-[#231F20BF] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#8BC53FBF] ${
                        isUploading
                          ? "cursor-not-allowed opacity-60"
                          : "cursor-pointer hover:bg-gray-100"
                      }`}
                    >
                      <UploadCloud size={16} className="text-[#005823]" />
                      {isUploading ? "Uploading..." : "Upload file"}
                    </button>
                  )}

                  <input
                    ref={(el) => (inputRefs.current[doc.id] = el)}
                    type="file"
                    accept={ACCEPTED_TYPES.join(",")}
                    className="hidden"
                    disabled={isUploading || submitting}
                    onChange={(e) => handleFile(doc, e.target.files?.[0])}
                  />

                  {error && (
                    <p className="mt-2 text-sm text-red-600">{error}</p>
                  )}
                </div>
              );
            })}

            {/* Business/Store photos - multiple */}
            <div>
              <label className="block text-base font-medium text-[#231F20] mb-1">
                Business/Store photo{" "}
                <span className="font-normal text-gray-500">
                  (you can upload more than one)
                </span>
              </label>
              <p className="mb-2 text-sm leading-relaxed text-[#231F20BF]">
                Upload clear photos of your shop, store, or business premises.
              </p>

              <UploadBox accept={ACCEPTED_TYPES.join(",")} maxSizeMB={MAX_FILE_SIZE_MB}
                prompt="Upload photos" formatHint="JPEG, PNG, PDF format, Max 5 MB each"
                disabled={submitting}
                onUploadStart={() => { setUploadingBusinessPhotos(true); setBusinessPhotoError(""); }}
                onUploadEnd={() => setUploadingBusinessPhotos(false)} onError={setBusinessPhotoError}
                uploadFile={async (file) => {
                  const url = await uploadFile(file, BUSINESS_PHOTO_FIELD);
                  if (!url) throw new Error("Upload failed. Please try again.");
                  setBusinessPhotos((previous) => [...previous, { id: crypto.randomUUID(), name: file.name, url }]);
                  return url;
                }} />

              {businessPhotos.length > 0 && (
                <div className="mt-3 space-y-2">
                  {businessPhotos.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3"
                    >
                      <div className="flex min-w-0 items-center gap-2">
                        <FileText
                          size={16}
                          className="shrink-0 text-[#005823]"
                        />
                        <span className="truncate text-[14px] text-gray-700">
                          {p.name}
                        </span>
                      </div>
                      <button
                        type="button"
                        aria-label="Remove business photo"
                        onClick={() => handleRemoveBusinessPhoto(p.id)}
                        className="shrink-0 hover:text-red-500"
                      >
                        <X size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {businessPhotoError && (
                <p className="mt-2 text-sm text-red-600">
                  {businessPhotoError}
                </p>
              )}
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-4">
            <Button type="button" variant="ghost" onClick={onBack}
              disabled={submitting || uploadingBusinessPhotos || Object.values(uploading).some(Boolean)}>Back</Button>
            <Button type="button" onClick={handleSubmit}
              disabled={!canContinue || submitting || uploadingBusinessPhotos || Object.values(uploading).some(Boolean)}>
              {submitting ? "Saving..." : "Save & Continue"}
            </Button>
          </div>

          {errorMessage && (
            <p className="text-red-600 text-sm mt-2">{errorMessage}</p>
          )}
          {successMessage && (
            <p className="text-[#005823] text-sm mt-2">{successMessage}</p>
          )}
        </div>
      </div>
    </BusinessSetupLayout>
  );
}
