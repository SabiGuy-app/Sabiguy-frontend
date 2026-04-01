import StepOne from "./step-one";
import StepTwo from "./step-two";
import StepThree from "./step-three";
import ConfirmKyc from "./confirm-kyc";
import PersonalInfoForm from "./AccountSetup/PersonalInfo";
import Identity from "./AccountSetup/Identity";
import AccountTypeForm from "./AccountSetup/AccountType";
import SkillsVerification from "./AccountSetup/SkillVerification";
import BankAccountForm from "./AccountSetup/BankAccount";
import { AnimatePresence } from "framer-motion";
import FaceCapture from "./AccountSetup/FacialCapture";
import FacialCapture from "./AccountSetup/FaceCapture/FacialCapture";
import UploadDocumnet from "./AccountSetup/UploadDoc";
import UploadAutoMobile from "./AccountSetup/UploadAutomobile";
import Congrats from "./congrats";
import { useEffect, useState } from "react";

export default function Form() {
    const [step , setStep] = useState(0)
    const [formData, setFormData] = useState({
        gender: '',
        city: '',
        accountType: '',
    });
      

  const getStepForKycLevel = (level) => {
    const normalized = Number(level);
    if (Number.isNaN(normalized)) return null;

    const kycMap = {
      0: 1,  // Register
      1: 4,  // PersonalInfoForm
      2: 5,  // AccountTypeForm
      3: 6,  // FacialCapture
      4: 8,  // SkillsVerification
      5: 9, // UploadAutoMobile
      6: 10, // BankAccountForm
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
    <ConfirmKyc onNext={handleNext} />,
    <StepOne onNext={handleNext} email={formData.email} />, //KYC level 1
    <StepTwo onNext={handleNext} email={formData.email} onBack={handleBack} />,
    <StepThree onNext={handleNext} onBack={handleBack} />,
    <PersonalInfoForm onNext={handleNext} onBack={handleBack} />, //KYC level 2
    <AccountTypeForm
      onNext={handleNext}
      onBack={handleBack}
    />, //KYC level 3
    <FacialCapture onNext={handleNext} onBack={handleBack} />, //KYC level 4
    <FaceCapture onNext={handleNext} onBack={handleBack} />,
    <SkillsVerification onNext={handleNext} onBack={handleBack} />, //KYC level 5
    <UploadAutoMobile onNext={handleNext} onBack={handleBack} />, //KYC level 6
    <BankAccountForm onNext={handleNext} onBack={handleBack} />, //KYC level completed
    <Congrats onNext={handleNext} onBack={handleBack} />,
  ];

  return <AnimatePresence mode="wait">{forms[step]}</AnimatePresence>;
}
