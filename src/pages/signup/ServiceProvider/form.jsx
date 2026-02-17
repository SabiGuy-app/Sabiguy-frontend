import StepOne from "./step-one";
import StepTwo from "./step-two";
import StepThree from "./step-three";
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
import { useState } from "react";

export default function Form() {
    const [step , setStep] = useState(0)
    const [formData, setFormData] = useState({
        gender: '',
        city: '',
        accountType: '',
        radius: '',
        allowAnywhere: true
    });
      

  const handleNext = (data) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep((prev) => prev + 1);
  };
  const handleBack = () => setStep((prev) => Math.max(prev - 1, 0));

  const forms = [

    <StepOne onNext={handleNext} />,
    <StepTwo onNext={handleNext} email={formData.email} onBack={handleBack} />,
    <StepThree onNext={handleNext} onBack={handleBack} />,
    <PersonalInfoForm onNext={handleNext} onBack={handleBack} />,
    <AccountTypeForm
      onNext={handleNext}
      initialValues={formData}
      onBack={handleBack}
    />,
    <FacialCapture onNext={handleNext} onBack={handleBack} />,
    <FaceCapture onNext={handleNext} onBack={handleBack} />,
    <SkillsVerification onNext={handleNext} onBack={handleBack} />,
    <UploadAutoMobile onNext={handleNext} onBack={handleBack} />,
    <BankAccountForm onNext={handleNext} onBack={handleBack} />,
    <Congrats onNext={handleNext} onBack={handleBack} />,
  ];

  return <AnimatePresence mode="wait">{forms[step]}</AnimatePresence>;
}
