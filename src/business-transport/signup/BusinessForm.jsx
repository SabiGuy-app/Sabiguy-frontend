import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
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

  const getStepForKycLevel = (level) => {
    const normalized = Number(level);
    if (Number.isNaN(normalized)) return null;

    const kycMap = {
      0: 0, // AccountTypeForm
      1: 1, // BusinessInfo
      2: 2, // AddVehicleForm
      3: 3, // AddDriverForm
      4: 4, // IncomeSplitForm
      5: 5, // Congrats
    };

    return kycMap[normalized] ?? null;
  };

  const handleNext = (data) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep((prev) => {
      if (data?.kycLevel !== undefined && data?.kycLevel !== null) {
        const mappedStep = getStepForKycLevel(data.kycLevel);
        if (mappedStep !== null) return mappedStep;
      }
      if (prev === 0 && data?.skipOtp) return prev + 2;
      if (prev === 1 && data?.skipOtp) return prev + 2;
      return prev + 1;
    });
  };
  const handleBack = () => setStep((prev) => Math.max(prev - 1, 0));

  useEffect(() => {
    const storedKycLevel = localStorage.getItem("kycLevel");
    const storedEmail = localStorage.getItem("email");
    if (storedKycLevel) {
      const mappedStep = getStepForKycLevel(storedKycLevel);
      if (mappedStep !== null) {
        setStep(mappedStep);
      }
      if (storedEmail) {
        setFormData((prev) => ({ ...prev, email: storedEmail }));
      }
      localStorage.removeItem("kycLevel");
    }
  }, []);

  const forms = [
    // <AccountTypeForm onNext={handleNext} onBack={handleBack} />, //KYC level 0
    <BusinessInfo onNext={handleNext} onBack={handleBack} />,
    <AddVehicleForm onNext={handleNext} onBack={handleBack} />,
    // <AddDriverForm onNext={handleNext} onBack={handleBack} />,
    // <IncomeSplitForm onNext={handleNext} onBack={handleBack} />,
    <BusinessCongrats onNext={handleNext} onBack={handleBack} />,
  ];

  return <AnimatePresence mode="wait">{forms[step]}</AnimatePresence>;
}
