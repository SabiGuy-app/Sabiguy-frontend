import SidebarProgress from "../../../components/SidebarProgress";
import { motion } from "framer-motion";

const MotionDiv = motion.div;
const MotionMain = motion.main;

export default function BusinessSetupLayout({ currentStep, children, contentClassName = "" }) {
  const steps = [
    // "Account Type",
    "Business Info",
    "Business Verification",
    "Business Setup",
    // "Add Driver",
    // "Income Split",
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen p-4 sm:p-8 bg-white relative">
      <MotionDiv
        key="sidebar"
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -300, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <SidebarProgress steps={steps} currentStep={currentStep} />
      </MotionDiv>

      {/* Content area */}
      <MotionMain
        key={currentStep}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.3 }}
        className={`min-w-0 flex-1 flex items-start justify-center px-0 py-6 md:px-10 md:py-0 ${contentClassName}`}
      >
        <div className="w-full max-w-lg">{children}</div>
      </MotionMain>
    </div>
  );
}
