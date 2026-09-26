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
import BeautyAndPersonalCare from "./AccountSetup/BeautyAndPersonalCare";

const BUSINESS_STEPS = {
  CONFIRM_KYC: 0,
  ACCOUNT_DETAILS: 1,
  VERIFY_EMAIL: 2,
  ACCOUNT_CREATED: 3,
  BUSINESS_INFO: 4,
  BUSINESS_VERIFICATION: 5,
  SERVICE_DETAILS: 6,
  CONGRATS: 7,
};

const BUSINESS_KYC_LEVEL_TO_STEP = {
  0: BUSINESS_STEPS.ACCOUNT_DETAILS,
  1: BUSINESS_STEPS.BUSINESS_INFO,
  2: BUSINESS_STEPS.BUSINESS_VERIFICATION,
  3: BUSINESS_STEPS.SERVICE_DETAILS,
  4: BUSINESS_STEPS.CONGRATS,
};

const BUSINESS_SETUP_STEP_BY_CATEGORY = {
  transport: AddVehicleForm,
  beauty: BeautyAndPersonalCare,
};

const BUSINESS_WIZARD_DRAFT_KEY = "business-onboarding-draft";

function readBusinessWizardDraft() {
  try {
    const stored = localStorage.getItem(BUSINESS_WIZARD_DRAFT_KEY);
    const draft = stored ? JSON.parse(stored) : null;
    const email = localStorage.getItem("email");
    if (email && draft?.formData?.email?.trim().toLowerCase() !== email.trim().toLowerCase()) return null;
    return draft;
  } catch {
    return null;
  }
}

function getStepForBusinessKycLevel(level) {
  const normalized = Number(level);
  if (Number.isNaN(normalized)) return null;
  return BUSINESS_KYC_LEVEL_TO_STEP[normalized] ?? null;
}

export default function BusinessForm() {
  const [step, setStep] = useState(() => {
    const draft = readBusinessWizardDraft();
    return Number.isInteger(draft?.step)
      ? draft.step
      : BUSINESS_STEPS.CONFIRM_KYC;
  });
  const [formData, setFormData] = useState(() => {
    const draft = readBusinessWizardDraft();
    return {
      gender: "",
      city: "",
      accountType: "",
      ...(draft?.formData || {}),
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem(
        BUSINESS_WIZARD_DRAFT_KEY,
        JSON.stringify({ step, formData }),
      );
    } catch {
      // Ignore storage quota or privacy-mode errors.
    }
  }, [step, formData]);

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

  const BusinessSetupStep =
    BUSINESS_SETUP_STEP_BY_CATEGORY[formData.businessCategoryId] ?? AddVehicleForm;
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
    <BusinessSetupStep onNext={handleNext} onBack={handleBack} />,
    <BusinessCongrats onNext={handleNext} onBack={handleBack} />,
  ];

  return <AnimatePresence mode="wait">{forms[step]}</AnimatePresence>;
}
