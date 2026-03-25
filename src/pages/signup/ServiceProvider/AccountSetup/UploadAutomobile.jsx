import UploadBox from "../../../../components/uploadBox";
import AccountSetupLayout from "./layout";
import { IoIosArrowBack } from "react-icons/io";
import { useState, useEffect } from "react";

export default function UploadAutoMobile({ onNext, onBack }) {
//   const [videos, setVideos] = useState([]);
  const [pictures, setPictures] = useState([]);
  const [isUploading, setIsUploading] = useState(false); // Track upload state
  const [saveError, setSaveError] = useState("");
  
  const email = localStorage.getItem("email")
  const google_email =   localStorage.getItem("google-email")


  const uploadEndpoint = `${import.meta.env.VITE_BASE_URL}/file/${email || google_email}/work_visuals`;
  const workVisualsEndpoint = `${import.meta.env.VITE_BASE_URL}/provider/work-visuals`;

  const handleVideoUpload = (urls) => {
    setVideos((prev) => [...prev, ...urls]);
  };

  const handlePictureUpload = (urls) => {
    setPictures((prev) => [...prev, ...urls]);
    setSaveError("");
  };

  const handleSave = async () => {
    try {
      if (pictures.length < 2) {
        setSaveError("Please upload at least two photos before continuing.");
        return;
      }

      const payload = {
        workVisuals: [
          {
            pictures,
          },
        ],
      };

      console.log("Sending to backend:", payload);

      const res = await fetch(workVisualsEndpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        onNext?.();
      } else {
        console.error(data);
        alert("Failed to save visuals");
      }
    } catch (err) {
      console.error("Save failed:", err);
      alert("Something went wrong while saving. Try again.");
    }
  };

  return (
    <AccountSetupLayout currentStep={4}>
      <div className="mt-4">
        {/* Back Button */}
        <div
          onClick={onBack}
          className="flex items-center gap-2 w-fit mb-8 cursor-pointer"
        >
          <IoIosArrowBack size={24} />
          <h2 className="text-lg">Back</h2>
        </div>

        {/* Header */}
        <h2 className="text-xl font-semibold mb-2">
          Upload Pictures of your Automobile
        </h2>
        <p className="text-gray-500 mb-6">
          Please upload photos of your vehicle or motorbike
        </p>

        {/* Upload Video
        <p className="mb-3 font-medium">A short video of you working</p>
        <UploadBox
          uploadEndpoint={uploadEndpoint}
          accept="video/*"
          multiple={false}
          onUploadComplete={handleVideoUpload}
          onUploadStart={() => setIsUploading(true)}  // Add this
          onUploadEnd={() => setIsUploading(false)}    // Add this
        /> */}

        {/* Upload Pictures */}
        <p className="mb-3 mt-10 font-medium">
          Upload at least 2 photos of your automobile that captures the plate number.
        </p>
        <UploadBox
          uploadEndpoint={uploadEndpoint}
          accept="image/*"
          multiple
          onUploadComplete={handlePictureUpload}
          onUploadStart={() => setIsUploading(true)}  // Add this
          onUploadEnd={() => setIsUploading(false)}    // Add this
        />

        {/* Preview all uploaded files */}
        {(pictures.length > 0) && (
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {pictures.map((pic, i) => (
              <img
                key={i}
                src={pic}
                alt="automobile"
                className="rounded-lg w-full h-20 object-cover border"
              />
            ))}
            {/* {videos.map((vid, i) => (
              <video
                key={i}
                src={vid}
                controls
                className="rounded-lg w-full h-20 object-cover border"
              />
            ))} */}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-end gap-3 mt-8">
          {/* <button
            className="border border-[#005823BF] text-[#005823BF] px-6 py-2 rounded-lg hover:bg-[#005823BF]/10 transition"
            onClick={onNext}
            disabled={isUploading}
          >
            Skip
          </button> */}
          <button
            className="border border-[#005823BF] text-[#005823BF] px-6 py-2 rounded-lg hover:bg-[#005823BF]/10 transition"
            onClick={onBack}
            disabled={isUploading}
          >
            Back
          </button>
          <button
            className={`px-6 py-2 rounded-lg transition ${
              isUploading
                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                : "bg-[#005823BF] text-white hover:bg-[#004e1a]"
            }`}
            onClick={handleSave}
            disabled={isUploading}
          >
            {isUploading ? "Uploading..." : "Save & Continue"}
          </button>
        </div>
        {saveError && (
          <p className="text-sm text-red-500 mt-3">{saveError}</p>
        )}
      </div>
    </AccountSetupLayout>
  );
}
