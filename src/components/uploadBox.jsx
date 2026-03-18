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
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previews, setPreviews] = useState([]);
  const fileInputRef = useRef(null);

  const handleFiles = async (files) => {
    const validFiles = Array.from(files).filter(
      (file) => file.size <= maxSizeMB * 1024 * 1024
    );

    if (validFiles.length === 0) {
      alert(`Please upload files less than ${maxSizeMB} MB.`);
      return;
    }

    // ✅ Step 1: Show immediate local previews
    const localPreviews = validFiles.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...localPreviews]);

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
        setPreviews(uploadedUrls);
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
        className={`border-2 border-dashed rounded-lg p-10 text-center text-sm cursor-pointer transition
          ${isDragging ? "bg-[#EAF5EE] border-[#005823]" : "border-[#005823BF] hover:bg-[#F5F8F6]"}`}
      >
        <input
          type="file"
          multiple={multiple}
          accept={accept}
          ref={fileInputRef}
          onChange={(e) => handleFiles(e.target.files)}
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
                Drag and drop files here or{" "}
                <span className="text-[#005823BF] font-medium">Browse</span>
              </>
            )}
          </p>
          <p className="text-gray-400 text-sm">
            JPEG, PNG (Max {maxSizeMB} MB)
          </p>
        </div>
      </div>

      {/* ✅ Preview area */}
      {/* {previews.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-3 justify-center">
          {previews.map((url, i) =>
            url.match(/\.(mp4|webm|ogg)$/i) ? (
              <video
                key={i}
                src={url}
                controls
                className="w-32 h-32 rounded-lg border object-cover"
              />
            ) : (
              <img
                key={i}
                src={url}
                alt="preview"
                className="w-32 h-32 rounded-lg border object-cover"
              />
            )
          )}
        </div>
      )} */}
    </div>
  );
}
