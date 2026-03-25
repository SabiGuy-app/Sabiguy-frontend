import SidebarProgress from "../../../../components/SidebarProgress";
import { motion } from "framer-motion";

export default function AccountSetupLayout({ currentStep, children }) {
  const steps = [
    "Personal Info",
    "Account Type",
    'Face Capture',
    "Skill Verification",
    "Upload Automobile",
    "Bank Account",
  ];


  return (
    <div className="flex flex-col md:flex-row min-h-screen p-8 bg-white relative">
      <motion.div
            key="sidebar"
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.3 }}
      >
        <SidebarProgress steps={steps} currentStep={currentStep} />
      </motion.div>

      {/* Content area */}
      <motion.main
        key={currentStep}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.3 }}
        className="flex-1 flex items-center justify-center p-8 md:p-10"
      >
        <div className="w-full max-w-lg">{children}</div>
      </motion.main>
    </div>
  );

}