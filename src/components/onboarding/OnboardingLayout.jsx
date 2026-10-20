import { motion } from "framer-motion";

const MotionDiv = motion.div;
const MotionMain = motion.main;

// Shared page geometry for business and individual onboarding; each supplies its own steps.
export default function OnboardingLayout({ steps, currentStep, children, sidebar, alignTop = false }) {
  return (
    <div className={`flex flex-col md:flex-row min-h-screen bg-white relative ${alignTop ? "p-4 sm:p-8" : "p-8"}`}>
      {alignTop && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-[#F5F8F6] p-4 md:hidden">
          <span className="font-bold text-[#005823]">SabiGuy</span>
          <span className="text-sm text-[#005823]">Account Setup · {currentStep + 1}/{steps.length} · {steps[currentStep]}</span>
        </div>
      )}
      <MotionDiv className={alignTop ? "hidden shrink-0 md:block" : undefined}
        key="sidebar" initial={{ x: -300, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -300, opacity: 0 }} transition={{ duration: 0.3 }}>
        {sidebar}
      </MotionDiv>
      <MotionMain key={currentStep} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.3 }}
        className={`min-w-0 flex-1 flex justify-center ${alignTop ? "items-start px-0 py-2 md:px-10 md:py-0" : "items-center p-8 md:p-10"}`}>
        <div className="w-full max-w-lg">{children}</div>
      </MotionMain>
    </div>
  );
}
