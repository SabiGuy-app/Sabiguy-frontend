import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import ConfirmKyc from "./AccountSetup/ConfirmKyc";
import StepOne from "./AccountSetup/StepOne";
import StepTwo from "./AccountSetup/StepTwo";
import StepThree from "./AccountSetup/StepThree";
import BusinessInfo from "./ServiceProvider/BusinessSetup/BusinessInfo";
import AddVehicleForm from "./ServiceProvider/BusinessSetup/AddVehicleForm";
import AddDriverForm from "./ServiceProvider/BusinessSetup/AddDriverForm";
import IncomeSplitForm from "./ServiceProvider/BusinessSetup/IncomeSplitForm";
import BusinessCongrats from "./BusinessCongrats";
import BusinessVerification from "./ServiceProvider/BusinessSetup/BusinessVerification";
import ServicesForm from "./ServiceProvider/BusinessSetup/ServicesForm";

const BUSINESS_STEPS = {
  CONFIRM_KYC: 0,
  ACCOUNT_DETAILS: 1,
  VERIFY_EMAIL: 2,
  ACCOUNT_CREATED: 3,
  BUSINESS_INFO: 4,
  VEHICLE_SETUP: 5,
  CONGRATS: 6,
};

const BUSINESS_KYC_LEVEL_TO_STEP = {
  0: BUSINESS_STEPS.ACCOUNT_DETAILS,
  1: BUSINESS_STEPS.BUSINESS_INFO,
  2: BUSINESS_STEPS.VEHICLE_SETUP,
  3: BUSINESS_STEPS.CONGRATS,
};

function getStepForBusinessKycLevel(level) {
  const normalized = Number(level);
  if (Number.isNaN(normalized)) return null;
  return BUSINESS_KYC_LEVEL_TO_STEP[normalized] ?? null;
}

export default function BusinessForm() {
  const [step, setStep] = useState(BUSINESS_STEPS.CONFIRM_KYC);
  const [formData, setFormData] = useState({
    gender: "",
    city: "",
    accountType: "",
  });

  const handleNext = (data) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep((prev) => {
      if (data?.kycLevel !== undefined && data?.kycLevel !== null) {
        const mappedStep = getStepForBusinessKycLevel(data.kycLevel);
        if (mappedStep !== null) return mappedStep;
      }
      if (prev === BUSINESS_STEPS.ACCOUNT_DETAILS && data?.skipOtp) {
        return prev + 2;
      }
      if (prev === BUSINESS_STEPS.VERIFY_EMAIL && data?.skipOtp) {
        return prev + 2;
      }
      return prev + 1;
    });
  };
  const handleBack = () => setStep((prev) => Math.max(prev - 1, 0));

  const businessSetupStep =
    formData.businessCategory === "Beauty & Personal Care" ? (
      <ServicesForm onNext={handleNext} onBack={handleBack} />
    ) : (
      <AddVehicleForm onNext={handleNext} onBack={handleBack} />
    );
  useEffect(() => {
    const storedKycLevel = localStorage.getItem("kycLevel");
    const storedEmail = localStorage.getItem("email");
    if (storedKycLevel) {
      const mappedStep = getStepForBusinessKycLevel(storedKycLevel);
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
    <ConfirmKyc onNext={handleNext} />,
    <StepOne onNext={handleNext} email={formData.email} />,
    <StepTwo onNext={handleNext} email={formData.email} onBack={handleBack} />,
    <StepThree onNext={handleNext} onBack={handleBack} />,
    <BusinessInfo onNext={handleNext} onBack={handleBack} />,
    <BusinessVerification onNext={handleNext} onBack={handleBack} />,
    businessSetupStep,
    <BusinessCongrats onNext={handleNext} onBack={handleBack} />,
  ];

  return <AnimatePresence mode="wait">{forms[step]}</AnimatePresence>;
}
