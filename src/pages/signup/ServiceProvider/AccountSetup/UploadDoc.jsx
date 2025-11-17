// import UploadBox from "../../../../components/uploadBox";
// import AccountSetupLayout from "./layout";
// import { IoIosArrowBack } from "react-icons/io";
// import { useState } from "react";

// export default function UploadDocument({ onNext, onBack }) {
//   const [videos, setVideos] = useState([]);
//   const [pictures, setPictures] = useState([]);
//     const email = localStorage.getItem("email")




//   const handleVideoUpload = (urls) => {
//     setVideos((prev) => [...prev, ...urls]); // ✅ accumulate videos
//   };

//   const handlePictureUpload = (urls) => {
//     setPictures((prev) => [...prev, ...urls]); // ✅ accumulate pictures
//   };

//   const handleSave = async () => {
//     try {
//       const payload = {
//         workVisuals: [
//           {
//             pictures,
//             videos,
//           },
//         ],
//       };

//       console.log("Sending to backend:", payload);

//       const res = await fetch(workVisualsEndpoint, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("token")}`,

//         },
//         body: JSON.stringify(payload),
//       });

//       const data = await res.json();

//       if (data.success) {
//         alert("Work visuals uploaded successfully!");
//         onNext?.();
//       } else {
//         console.error(data);
//         alert("Failed to save visuals");
//       }
//     } catch (err) {
//       console.error("Save failed:", err);
//     }
//   };

//   return (
//     <AccountSetupLayout currentStep={2}>
//       <div className="mt-4">
//         <div
//           onClick={onBack}
//           className="flex items-center gap-2 w-fit mb-8 cursor-pointer"
//         >
//           <IoIosArrowBack size={24} />
//           <h2 className="text-lg">Back</h2>
//         </div>

//         <h2 className="text-xl font-semibold mb-2">Upload Supporting Documents</h2>
//         <p className="text-gray-500 mb-6">
//           Please upload photos & videos of your previous jobs.
//         </p>

//         <p className="mb-3 font-medium">A short video of you working</p>
//         <UploadBox
//           uploadEndpoint={uploadEndpoint}
//           accept="video/*"
//           multiple={false}
//           onUploadComplete={handleVideoUpload}
//         />

//         <p className="mb-3 mt-10 font-medium">Upload 3 - 4 photos of your past jobs</p>
//         <UploadBox
//           uploadEndpoint={uploadEndpoint}
//           accept="image/*"
//           multiple
//           onUploadComplete={handlePictureUpload}
//         />

//         {/* Optional: show uploaded previews again here */}
//         <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
//           {pictures.map((pic) => (
//             <img
//               key={pic}
//               src={pic}
//               alt="work"
//               className="rounded-lg w-full h-40 object-cover"
//             />
//           ))}
//           {videos.map((vid) => (
//             <video
//               key={vid}
//               src={vid}
//               controls
//               className="rounded-lg w-full h-40 object-cover"
//             />
//           ))}
//         </div>

//         <div className="flex justify-end gap-3 mt-8">
//           <button
//             className="border border-[#005823BF] text-[#005823BF] px-6 py-2 rounded-lg hover:bg-[#005823BF]/10 transition"
//             onClick={onBack}
//           >
//             Back
//           </button>
//           <button
//             className="bg-[#005823BF] text-white px-6 py-2 rounded-lg hover:bg-[#004e1a] transition"
//             onClick={handleSave}
//           >
//             Save & Continue
//           </button>
//         </div>
//       </div>
//     </AccountSetupLayout>
//   );
// }

import UploadBox from "../../../../components/uploadBox";
import AccountSetupLayout from "./layout";
import { IoIosArrowBack } from "react-icons/io";
import { useState, useEffect } from "react";

export default function UploadDocument({ onNext, onBack }) {
  const [videos, setVideos] = useState([]);
  const [pictures, setPictures] = useState([]);
  
       const email = localStorage.getItem("email")

    // const email =('thequeensamuel@gmail.com')


  const uploadEndpoint = `${import.meta.env.VITE_BASE_URL}/file/${email}/work_visuals`;

 
  const workVisualsEndpoint = `${import.meta.env.VITE_BASE_URL}/provider/work-visuals`;

  const handleVideoUpload = (urls) => {
    setVideos((prev) => [...prev, ...urls]);
  };

  const handlePictureUpload = (urls) => {
    setPictures((prev) => [...prev, ...urls]);
  };

  const handleSave = async () => {
    try {
      if (!pictures.length && !videos.length) {
        alert("Please upload at least one photo or video before continuing.");
        return;
      }

      const payload = {
        workVisuals: [
          {
            pictures,
            videos,
          },
        ],
      };

      console.log("Sending to backend:", payload);

         const res = await fetch(workVisualsEndpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
                              // Authorization:`Bearer ${'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MGM4OTVhOTUwZDRmODhkYzg3ZjIyMCIsInJvbGUiOiJwcm92aWRlciIsImlhdCI6MTc2MjQzNTg3MywiZXhwIjoxNzYyNDM5NDczfQ.zQi5_YDDpohwlQHOSq5CVzEY14mUTagMIAVngqgsw1s'}`,

        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        // alert("Work visuals uploaded successfully!");
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
    <AccountSetupLayout currentStep={2}>
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
          Upload Supporting Documents
        </h2>
        <p className="text-gray-500 mb-6">
          Please upload photos and videos of your previous jobs.
        </p>

        {/* Upload Video */}
        <p className="mb-3 font-medium">A short video of you working</p>
        <UploadBox
          uploadEndpoint={uploadEndpoint}
          accept="video/*"
          multiple={false}
          onUploadComplete={handleVideoUpload}
        />

        {/* Upload Pictures */}
        <p className="mb-3 mt-10 font-medium">
          Upload 3 – 4 photos of your past jobs
        </p>
        <UploadBox
          uploadEndpoint={uploadEndpoint}
          accept="image/*"
          multiple
          onUploadComplete={handlePictureUpload}
        />

        {/* Preview all uploaded files */}
        {(pictures.length > 0 || videos.length > 0) && (
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {pictures.map((pic, i) => (
              <img
                key={i}
                src={pic}
                alt="work visual"
                className="rounded-lg w-full h-20 object-cover border"
              />
            ))}
            {videos.map((vid, i) => (
              <video
                key={i}
                src={vid}
                controls
                className="rounded-lg w-full h-20 object-cover border"
              />
            ))}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-end gap-3 mt-8">
          <button
            className="border border-[#005823BF] text-[#005823BF] px-6 py-2 rounded-lg hover:bg-[#005823BF]/10 transition"
            onClick={onBack}
          >
            Back
          </button>
          <button
            className="bg-[#005823BF] text-white px-6 py-2 rounded-lg hover:bg-[#004e1a] transition"
            onClick={handleSave}
          >
            Save & Continue
          </button>
        </div>
      </div>
    </AccountSetupLayout>
  );
}

