import SidebarProgress from "../components/SidebarProgress";
import OnboardingLayout from "../../../../components/onboarding/OnboardingLayout";

export default function AccountSetupLayout({ currentStep, children, alignTop = false }) {
  const steps = ["Personal Info", "Face Capture", "Verification"];
  return (
    <OnboardingLayout steps={steps}
      currentStep={currentStep} sidebar={<SidebarProgress steps={steps} currentStep={currentStep} />} alignTop={alignTop}>
      {children}
    </OnboardingLayout>
  );
}
