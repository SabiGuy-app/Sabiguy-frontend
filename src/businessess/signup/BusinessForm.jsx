import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import ConfirmKyc from "./AccountSetup/ConfirmKyc";
import StepOne from "./AccountSetup/StepOne";
import StepTwo from "./AccountSetup/StepTwo";
import StepThree from "./AccountSetup/StepThree";
import BusinessInfo from "./ServiceProvider/BusinessSetup/BusinessInfo";
import BusinessCongrats from "./BusinessCongrats";
import BusinessVerification from "./ServiceProvider/BusinessSetup/BusinessVerification";
import GeneralBusinessSetup from "./AccountSetup/general-business-setup";

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
  automotive: GeneralBusinessSetup,
  beauty: GeneralBusinessSetup,
  catering: GeneralBusinessSetup,
  cleaning: GeneralBusinessSetup,
  domestic: GeneralBusinessSetup,
  education: GeneralBusinessSetup,
  events: GeneralBusinessSetup,
  fashion: GeneralBusinessSetup,
  "home-repair": GeneralBusinessSetup,
  laundry: GeneralBusinessSetup,
  transport: GeneralBusinessSetup,
  "photography-videography": GeneralBusinessSetup,
};

// In-session onboarding sets businessCategoryId ("beauty"/"transport"). On
// resume we only have the saved businessCategory label from the backend, so
// fall back to matching that.
function resolveBusinessCategoryId(formData) {
  if (formData.businessCategoryId) return formData.businessCategoryId;
  const label = String(formData.businessCategory || "").toLowerCase();
  if (label.includes("automotive")) return "automotive";
  if (label.includes("beauty")) return "beauty";
  if (label.includes("catering")) return "catering";
  if (label.includes("cleaning")) return "cleaning";
  if (label.includes("domestic")) return "domestic";
  if (label.includes("education")) return "education";
  if (label.includes("event")) return "events";
  if (label.includes("fashion")) return "fashion";
  if (label.includes("home repair")) return "home-repair";
  if (label.includes("photography") || label.includes("videography")) return "photography-videography";
  if (label.includes("laundry")) return "laundry";
  if (label.includes("transport")) return "transport";
  return "";
}

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
  const switchedIntoBusiness = localStorage.getItem("switchProfileOnboarding") === "business";
  const [step, setStep] = useState(() => {
    const draft = readBusinessWizardDraft();
    if (switchedIntoBusiness) return BUSINESS_STEPS.ACCOUNT_DETAILS;
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
      ...(switchedIntoBusiness ? { email: localStorage.getItem("email") || "" } : {}),
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
  const handleBusinessCategoryChange = (category) => {
    if (!category) return;
    setFormData((prev) => ({
      ...prev,
      businessCategory: category.label,
      businessCategoryId: category.id,
    }));
  };

  const BusinessSetupStep =
    BUSINESS_SETUP_STEP_BY_CATEGORY[resolveBusinessCategoryId(formData)] ??
    GeneralBusinessSetup;
  useEffect(() => {
    if (localStorage.getItem("switchProfileOnboarding") === "business") {
      localStorage.removeItem("switchProfileOnboarding");
    }
    const storedKycLevel = localStorage.getItem("kycLevel");
    const storedEmail = localStorage.getItem("email");
    const storedCategory = localStorage.getItem("businessCategory");
    if (storedKycLevel) {
      const mappedStep = getStepForBusinessKycLevel(storedKycLevel);
      if (mappedStep !== null) {
        setStep(mappedStep);
      }
      setFormData((prev) => ({
        ...prev,
        ...(storedEmail ? { email: storedEmail } : {}),
        ...(storedCategory ? { businessCategory: storedCategory } : {}),
      }));
      localStorage.removeItem("kycLevel");
      localStorage.removeItem("businessCategory");
    }
  }, []);

  const forms = [
    <ConfirmKyc onNext={handleNext} />,
    <StepOne onNext={handleNext} email={formData.email} />,
    <StepTwo onNext={handleNext} email={formData.email} onBack={handleBack} />,
    <StepThree onNext={handleNext} onBack={handleBack} />,
    <BusinessInfo onNext={handleNext} onBack={handleBack} />,
    <BusinessVerification onNext={handleNext} onBack={handleBack} />,
    <BusinessSetupStep
      onNext={handleNext}
      onBack={handleBack}
      onCategoryChange={handleBusinessCategoryChange}
    />,
    <BusinessCongrats onNext={handleNext} onBack={handleBack} />,
  ];

  return <AnimatePresence mode="wait">{forms[step]}</AnimatePresence>;
}
