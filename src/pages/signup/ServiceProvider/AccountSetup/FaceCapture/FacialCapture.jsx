import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import Webcam from "react-webcam";
import AccountSetupLayout from "../layout";
import Button from "../../../../../components/button";

export default function FacialCapture({ onNext, onBack }) {
  const navigate = useNavigate();
  const webcamRef = useRef(null);
  const [isCameraActive, setIsCameraActive] = useState(true);

  // const handleBack = () => navigate(-1);

  return (
    <AccountSetupLayout currentStep={2}>
      <div className="w-full flex flex-col items-center">
        {/* Back Button */}
        <div
          onClick={onBack}
          className="flex items-center gap-2 w-fit mb-8 cursor-pointer self-start"
        >
          <IoIosArrowBack size={24} />
          <h2 className="text-lg">Back</h2>
        </div>

        {/* Header */}
        <h2 className="text-xl font-semibold mb-2">Face Capturing</h2>
        <p className="text-gray-600 mb-6">Look directly at the camera</p>

        {/* Webcam Preview */}
        {isCameraActive ? (
          <div className="flex flex-col items-center">
            <Webcam
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="shadow-lg w-[280px] h-[280px] border border-gray-300 object-cover"
              videoConstraints={{ facingMode: "user" }}
            />
          </div>
        ) : (
          <div className="w-[280px] h-[280px] flex items-center justify-center border border-gray-300 rounded-2xl text-gray-500 bg-gray-50">
            Camera preview unavailable
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col gap-6 items-center justify-center mt-14">
                     
         <Button
          variant="secondary"
          onClick={onNext}>
            Get Started
           {/* {loading ? "Verifying..." : "Verify Email"} */}
         </Button>

          {/* <Button variant="ghost"
            onClick={onNext}
            
          >
            Proceed on another device
          </Button> */}
        </div>
      </div>
    </AccountSetupLayout>
  );
}
