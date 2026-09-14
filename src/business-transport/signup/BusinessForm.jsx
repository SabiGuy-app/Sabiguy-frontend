import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import ConfirmKyc from "./AccountSetup/ConfirmKyc";
import StepOne from "./AccountSetup/StepOne";
import StepTwo from "./AccountSetup/StepTwo";
import StepThree from "./AccountSetup/StepThree";
import BusinessInfo from "./ServiceProvider/BusinessSetup/BusinessInfo";
import AddVehicleForm from "./ServiceProvider/BusinessSetup/AddVehicleForm";
import AddDriverForm from "./ServiceProvider/BusinessSetup/AddDriverForm";
import IncomeSplitForm from "./ServiceProvider/BusinessSetup/IncomeSplitForm";
import BusinessCongrats from "./BusinessCongrats";

export default function BusinessForm() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    gender: "",
    city: "",
    accountType: "",
  });

  const handleNext = (data) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep((prev) => {
      // Google sign-up verifies the email up front, so skip the OTP step.
      if (prev === 0 && data?.skipOtp) return prev + 2;
      if (prev === 1 && data?.skipOtp) return prev + 2;
      return prev + 1;
    });
  };
  const handleBack = () => setStep((prev) => Math.max(prev - 1, 0));

  const forms = [
    <ConfirmKyc onNext={handleNext} />,
    <StepOne onNext={handleNext} email={formData.email} />,
    <StepTwo onNext={handleNext} email={formData.email} onBack={handleBack} />,
    <StepThree onNext={handleNext} onBack={handleBack} />,
    <BusinessInfo onNext={handleNext} onBack={handleBack} />,
    <AddVehicleForm onNext={handleNext} onBack={handleBack} />,
    // <AddDriverForm onNext={handleNext} onBack={handleBack} />,
    // <IncomeSplitForm onNext={handleNext} onBack={handleBack} />,
    <BusinessCongrats onNext={handleNext} onBack={handleBack} />,
  ];

  return <AnimatePresence mode="wait">{forms[step]}</AnimatePresence>;
}
