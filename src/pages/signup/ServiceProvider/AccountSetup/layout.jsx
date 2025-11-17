import { useState } from "react";
import SidebarProgress from "../../../../components/SidebarProgress";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AccountSetupLayout({ currentStep, children }) {
  const steps = [
    "Personal Info",
    "Account Type",
    "Skill Verification",
    "Bank Account",
  ];

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex-row min-h-screen p-8 bg-white relative">
      <button
        className="md:hidden absolute top-4 left-4 z-20 text-"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      <AnimatePresence>
        {(sidebarOpen || window.innerWidth >= 768) && (
          <motion.div
            key="sidebar"
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.3 }}
            // className={`fixed md:static top-0 left-0 h-full z-10 md:w-1/3  bg-[#F8FAF9] md:rounded-r-xl shadow-md md:shadow-none`}
          >
            <SidebarProgress steps={steps} currentStep={currentStep} />
          </motion.div>
        )}
      </AnimatePresence>

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