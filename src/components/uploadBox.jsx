import { useRef, useState } from "react";
import { UploadCloud } from "lucide-react";

export default function UploadBox({
  uploadEndpoint,
  onUploadComplete,
  accept = "image/*,video/*",
   onUploadStart,  
  onUploadEnd,
  multiple = true,
  maxSizeMB = 5,
  uploadFile,
  onError,
  disabled = false,
  prompt = "Drag and drop files here or",
  formatHint,
  className = "",
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFiles = async (files) => {
    if (disabled || uploading || !files.length) return;
    if (uploadFile) {
      const selectedFiles = Array.from(files).slice(0, multiple ? undefined : 1);
      const allowedTypes = accept.split(",").map((type) => type.trim());
      const invalid = selectedFiles.some((file) =>
        file.size > maxSizeMB * 1024 * 1024 ||
        !allowedTypes.some((type) => type.endsWith("/*")
          ? file.type.startsWith(type.slice(0, -1))
          : file.type === type),
      );
      if (invalid) {
        onError?.(`Choose an accepted file format, up to ${maxSizeMB} MB each.`);
        return;
      }
      setUploading(true);
      onUploadStart?.();
      try {
        for (const file of selectedFiles) {
          const url = await uploadFile(file);
          if (!url) throw new Error("The upload did not return a file URL. Please try again.");
          onUploadComplete?.([url]);
        }
      } catch (error) {
        onError?.(error.response?.data?.message || error.message || "File upload failed. Please try again.");
      } finally {
        setUploading(false);
        onUploadEnd?.();
      }
      return;
    }
    const validFiles = Array.from(files).filter(
      (file) => file.size <= maxSizeMB * 1024 * 1024
    );

    if (validFiles.length === 0) {
      alert(`Please upload files less than ${maxSizeMB} MB.`);
      return;
    }


    // ✅ Step 2: Upload to backend
    if (!uploadEndpoint) {
      console.error("Missing uploadEndpoint");
      return;
    }

    setUploading(true);
    const uploadedUrls = [];

        onUploadStart?.(); // Call when upload starts


    try {
      for (const file of validFiles) {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch(uploadEndpoint, {
          method: "POST",
          body: formData,
        });
        const data = await res.json();

        if (data?.file?.url) {
          uploadedUrls.push(data.file.url);
        } else {
          console.error("No URL returned:", data);
        }
      }

      // ✅ Step 3: Replace local preview with real URLs
      if (uploadedUrls.length > 0) {
        onUploadComplete?.(uploadedUrls);
      }
    } catch (err) {
      console.error("Upload failed:", err);
      alert("File upload failed. Please try again.");
    } finally {
      setUploading(false);
      onUploadEnd?.(); 

    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleBrowse = () => fileInputRef.current.click();

  return (
    <div>
      {/* Upload area */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={handleBrowse}
        role="button"
        tabIndex={disabled || uploading ? -1 : 0}
        aria-label="Upload pictures"
        aria-disabled={disabled || uploading}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            handleBrowse();
          }
        }}
        className={`border-2 border-dashed rounded-lg p-10 text-center text-sm cursor-pointer transition focus-visible:outline-2 focus-visible:outline-[#005823]
          ${isDragging ? "bg-[#EAF5EE] border-[#005823]" : "border-[#005823BF] hover:bg-[#F5F8F6]"} ${className}`}
      >
        <input
          type="file"
          multiple={multiple}
          accept={accept}
          ref={fileInputRef}
          disabled={disabled || uploading}
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = "";
          }}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
          <span className="text-[#005823BF] text-2xl">
            <UploadCloud size={36} />
          </span>
          <p>
            {uploading ? (
              <span className="text-[#005823BF] font-medium">Uploading...</span>
            ) : (
              <>
                {prompt}{" "}
                <span className="text-[#005823BF] font-medium">Browse</span>
              </>
            )}
          </p>
          <p className="text-gray-400 text-sm">
            {formatHint || `JPEG, PNG (Max ${maxSizeMB} MB)`}
          </p>
        </div>
      </div>

    </div>
  );
}
