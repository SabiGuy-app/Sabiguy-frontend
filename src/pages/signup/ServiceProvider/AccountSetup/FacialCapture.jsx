
import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import { FaceMesh } from "@mediapipe/face_mesh";
import { Camera } from "@mediapipe/camera_utils";
import Button from "../../../../components/button";
import { FaCamera, FaExclamationCircle } from "react-icons/fa";

export default function FaceCapture({ onNext, handleBack }) {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const cameraInstanceRef = useRef(null);
  const faceMeshRef = useRef(null);
  const prevDetectedRef = useRef(false);
  const isCleaningUpRef = useRef(false);
  
  const [image, setImage] = useState(null);
  const [shouldInitialize, setShouldInitialize] = useState(true);
  const [faceQuality, setFaceQuality] = useState({
    detected: false,
    centered: false,
    tooClose: false,
    tooFar: false
  });
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [captureError, setCaptureError] = useState('');
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [cameraError, setCameraError] = useState(null);

  const email = localStorage.getItem("email");
  const uploadEndpoint = `${import.meta.env.VITE_BASE_URL}/file/${email}/profile_pictures`;
  const saveEndpoint = `${import.meta.env.VITE_BASE_URL}/provider/profile-pic`;

  // Initialize MediaPipe Face Mesh
  useEffect(() => {
    if (!webcamRef.current || !shouldInitialize) return;

    const videoElement = webcamRef.current.video;
    const canvasElement = canvasRef.current;
    const canvasCtx = canvasElement?.getContext("2d");

    if (!canvasElement || !canvasCtx || !videoElement) return;

    isCleaningUpRef.current = false;

    // Cleanup previous instances
    if (cameraInstanceRef.current) {
      try {
        cameraInstanceRef.current.stop();
      } catch (e) {
        console.log("Camera already stopped");
      }
      cameraInstanceRef.current = null;
    }
    
    if (faceMeshRef.current) {
      try {
        faceMeshRef.current.close();
      } catch (e) {
        console.log("FaceMesh already closed");
      }
      faceMeshRef.current = null;
    }

    const faceMesh = new FaceMesh({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    });

    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7,
    });

    faceMesh.onResults((results) => {
      // Don't process if we're cleaning up
      if (isCleaningUpRef.current) return;
      
      if (!results.multiFaceLandmarks || results.multiFaceLandmarks.length === 0) {
        const currentDetected = false;
        
        // Only update if detection state changed
        if (currentDetected !== prevDetectedRef.current) {
          setFaceQuality({
            detected: false,
            centered: false,
            tooClose: false,
            tooFar: false
          });
          canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
          prevDetectedRef.current = currentDetected;
        }
        return;
      }

      const landmarks = results.multiFaceLandmarks[0];
      
      // Check if face is centered (nose tip should be near center)
      const noseTip = landmarks[1];
      const centered = Math.abs(noseTip.x - 0.5) < 0.2 && Math.abs(noseTip.y - 0.5) < 0.2;
      
      // Check if face is too close or too far
      const leftCheek = landmarks[234];
      const rightCheek = landmarks[454];
      const faceWidth = Math.abs(rightCheek.x - leftCheek.x);
      const tooClose = faceWidth > 0.65;
      const tooFar = faceWidth < 0.25;

      const currentDetected = true;
      
      // Only redraw if detection state changed or face is detected
      if (currentDetected !== prevDetectedRef.current || currentDetected) {
        setFaceQuality({
          detected: true,
          centered,
          tooClose,
          tooFar
        });

        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

        // Draw face mesh landmarks
        canvasCtx.fillStyle = centered && !tooClose && !tooFar ? "#00FF00" : "#FFD700";
        for (const point of landmarks) {
          const x = point.x * canvasElement.width;
          const y = point.y * canvasElement.height;
          canvasCtx.beginPath();
          canvasCtx.arc(x, y, 1.5, 0, 2 * Math.PI);
          canvasCtx.fill();
        }

        // Draw face oval guide
        canvasCtx.strokeStyle = centered && !tooClose && !tooFar ? "#00FF00" : "#FFD700";
        canvasCtx.lineWidth = 3;
        canvasCtx.beginPath();
        
        // Draw oval around face
        const faceOval = [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109];
        for (let i = 0; i < faceOval.length; i++) {
          const point = landmarks[faceOval[i]];
          const x = point.x * canvasElement.width;
          const y = point.y * canvasElement.height;
          if (i === 0) {
            canvasCtx.moveTo(x, y);
          } else {
            canvasCtx.lineTo(x, y);
          }
        }
        canvasCtx.closePath();
        canvasCtx.stroke();

        canvasCtx.restore();
        prevDetectedRef.current = currentDetected;
      }
    });

    faceMeshRef.current = faceMesh;

    // Initialize camera
    let camera = null;
    if (typeof videoElement !== "undefined" && videoElement !== null) {
      camera = new Camera(videoElement, {
        onFrame: async () => {
          // Check if we're cleaning up or instance is closed
          if (isCleaningUpRef.current || !faceMeshRef.current) return;
          
          try {
            await faceMeshRef.current.send({ image: videoElement });
          } catch (error) {
            // Silently catch errors during cleanup
            if (!isCleaningUpRef.current) {
              console.error("Error sending frame:", error);
            }
          }
        },
        width: 280,
        height: 280,
      });
      
      camera.start().then(() => {
        if (!isCleaningUpRef.current) {
          setModelsLoaded(true);
        }
      }).catch((error) => {
        if (!isCleaningUpRef.current) {
          console.error("Camera start error:", error);
          setCameraError("Failed to start camera. Please check permissions.");
        }
      });
      cameraInstanceRef.current = camera;
    }

    // Cleanup function
    return () => {
      isCleaningUpRef.current = true;
      
      if (cameraInstanceRef.current) {
        try {
          cameraInstanceRef.current.stop();
        } catch (e) {
          console.log("Camera cleanup error (safe to ignore)");
        }
        cameraInstanceRef.current = null;
      }
      
      if (videoElement?.srcObject) {
        const tracks = videoElement.srcObject.getTracks();
        tracks.forEach(track => {
          try {
            track.stop();
          } catch (e) {
            console.log("Track cleanup error (safe to ignore)");
          }
        });
      }
      
      if (faceMeshRef.current) {
        try {
          faceMeshRef.current.close();
        } catch (e) {
          console.log("FaceMesh cleanup error (safe to ignore)");
        }
        faceMeshRef.current = null;
      }
    };
  }, [shouldInitialize]);

  // Stop camera after capture to save resources
  const stopCamera = () => {
    isCleaningUpRef.current = true;
    
    if (cameraInstanceRef.current) {
      try {
        cameraInstanceRef.current.stop();
      } catch (e) {
        console.log("Camera stop error (safe to ignore)");
      }
      cameraInstanceRef.current = null;
    }
    
    if (webcamRef.current?.video?.srcObject) {
      const tracks = webcamRef.current.video.srcObject.getTracks();
      tracks.forEach(track => {
        try {
          track.stop();
        } catch (e) {
          console.log("Track stop error (safe to ignore)");
        }
      });
    }
    
    if (faceMeshRef.current) {
      try {
        faceMeshRef.current.close();
      } catch (e) {
        console.log("FaceMesh close error (safe to ignore)");
      }
      faceMeshRef.current = null;
    }
  };

  // Capture screenshot from webcam
  const capture = () => {
    const { detected, centered, tooClose, tooFar } = faceQuality;
    
    if (!detected) {
      setCaptureError("No face detected! Please ensure your face is clearly visible.");
      setTimeout(() => setCaptureError(''), 3000);
      return;
    }
    
    if (!centered) {
      setCaptureError("Please center your face in the frame.");
      setTimeout(() => setCaptureError(''), 3000);
      return;
    }
    
    if (tooClose) {
      setCaptureError("You're too close! Please move back a bit.");
      setTimeout(() => setCaptureError(''), 3000);
      return;
    }
    
    if (tooFar) {
      setCaptureError("You're too far! Please move closer.");
      setTimeout(() => setCaptureError(''), 3000);
      return;
    }
    
    setCaptureError('');
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
    
    // Stop camera to save resources
    stopCamera();
  };

  // Restart camera when retaking
  const retake = () => {
    setImage(null);
    setCaptureError('');
    setErrorMessage('');
    setModelsLoaded(false);
    
    // Reset face quality state
    setFaceQuality({
      detected: false,
      centered: false,
      tooClose: false,
      tooFar: false
    });
    
    // Trigger re-initialization
    setShouldInitialize(false);
    setTimeout(() => {
      setShouldInitialize(true);
    }, 100);
  };

  // Upload to Cloudinary and save to provider endpoint
  const handleSave = async () => {
    if (!image) return;
    setUploading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Convert base64 to Blob
      const blob = await fetch(image).then((res) => res.blob());
      const formData = new FormData();
      formData.append("file", blob, "profile.jpg");

      // Upload to Cloudinary
      const res = await fetch(uploadEndpoint, {
        method: "POST",
        body: formData,
      });
      
      if (!res.ok) {
        throw new Error(`Upload failed with status: ${res.status}`);
      }
      
      const data = await res.json();

      if (!data.file?.url) {
        setErrorMessage("Upload failed: No URL returned.");
        setUploading(false);
        return;
      }

      // Save to backend
      const saveRes = await fetch(saveEndpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ imageUrl: data.file.url }),
      });

      const saveData = await saveRes.json();
      
      if (saveData.success) {
        setSuccessMessage("Facial capture successful!");
        setTimeout(() => {
          onNext?.();
        }, 1500);
      } else {
        setErrorMessage(saveData.message || "Failed to save profile picture");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setErrorMessage(err.message || "Something went wrong while uploading");
    } finally {
      setUploading(false);
    }
  };

  // Get feedback message based on face quality
  const getFeedbackMessage = () => {
    const { detected, centered, tooClose, tooFar } = faceQuality;
    
    if (!detected) return "❌ No face detected";
    if (tooClose) return "⚠️ Too close - move back";
    if (tooFar) return "⚠️ Too far - move closer";
    if (!centered) return "⚠️ Center your face";
    return "✅ Perfect! Ready to capture";
  };

  const getFeedbackColor = () => {
    const { detected, centered, tooClose, tooFar } = faceQuality;
    
    if (!detected) return "text-red-500";
    if (tooClose || tooFar || !centered) return "text-yellow-600";
    return "text-green-600";
  };

  const canCapture = faceQuality.detected && faceQuality.centered && 
                     !faceQuality.tooClose && !faceQuality.tooFar;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6">
      <h1 className="text-2xl font-semibold mb-3">Facial Capture</h1>
      <p className="mb-6 text-gray-600">
        Please look into the camera and hold still.
      </p>

      {cameraError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-2">
          <FaExclamationCircle />
          <span>{cameraError}</span>
        </div>
      )}

      {!image ? (
        <div className="flex flex-col items-center">
          {!modelsLoaded && (
            <div className="mb-4 text-sm text-gray-500">
              Loading face detection models...
            </div>
          )}
          
          <div className="relative w-[280px] h-[280px] mb-5">
            <Webcam
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              mirrored
              className="absolute top-0 left-0 w-full h-full border border-gray-300 rounded-lg object-cover"
              videoConstraints={{ 
                facingMode: "user", 
                width: 280, 
                height: 280 
              }}
              onUserMediaError={(error) => {
                console.error("Camera error:", error);
                setCameraError("Camera access denied. Please enable camera permissions.");
              }}
            />
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 w-full h-full rounded-lg"
              width={280}
              height={280}
            />
          </div>

          <div className={`text-sm font-medium mb-3 ${getFeedbackColor()}`}>
            {getFeedbackMessage()}
          </div>

          {captureError && (
            <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm flex items-center gap-2">
              <FaExclamationCircle />
              <span>{captureError}</span>
            </div>
          )}

          <Button
            onClick={capture}
            disabled={!canCapture || !modelsLoaded}
            className={`mt-4 w-20 h-20 flex p-3 items-center justify-center rounded-full transition-all duration-200 ${
              canCapture && modelsLoaded
                ? "bg-[#005823] hover:bg-[#004419] text-white shadow-lg cursor-pointer"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            <FaCamera size={24} />
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <img
            src={image}
            alt="Captured face"
            className="shadow-lg w-[280px] h-[280px] mb-5 border border-gray-300 object-cover rounded-lg"
          />
          
          {errorMessage && (
            <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm flex items-center gap-2">
              <FaExclamationCircle />
              <span>{errorMessage}</span>
            </div>
          )}
          
          {successMessage && (
            <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
              {successMessage}
            </div>
          )}
          
          <div className="flex gap-3 mt-4">
            <button
              onClick={retake}
              disabled={uploading}
              className="px-4 py-2 border border-[#005823] bg-white text-[#005823] rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Retake
            </button>
            <button
              onClick={handleSave}
              disabled={uploading}
              className="px-4 py-2 text-white bg-[#005823] hover:bg-[#004419] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {uploading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}