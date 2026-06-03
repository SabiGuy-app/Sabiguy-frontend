import StepOne from "./step-one";
import StepTwo from "./step-two";
import NinUpload from "./nin-upload";
import StepThree from "./step-three";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function Form() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({});

  // const handleNext = () => setStep ((prev) => prev + 1);

  const handleNext = (data) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep((prev) => {
      if (prev === 0 && data?.skipOtp) return prev + 2;
      return prev + 1;
    });
  };
  const handleBack = () =>
    setStep((prev) => {
      if (prev === 2 && formData.skipOtp) return 0;
      return Math.max(prev - 1, 0);
    });

  const forms = [
    <StepOne onNext={handleNext} />,
    <StepTwo onNext={handleNext} email={formData.email} onBack={handleBack} />,
    // <NinUpload onNext={handleNext} onBack={handleBack} />,
    <StepThree onNext={handleNext} onBack={handleBack} />,
  ];

  return <AnimatePresence mode="wait">{forms[step]}</AnimatePresence>;
}
