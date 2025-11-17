import React from "react";
import { motion } from "framer-motion";

export default function SidebarProgress({ steps, currentStep }) {
  return (
    <motion.aside
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="h-full flex flex-col items-center justify-start py-1 bg-[#F5F8F6] rounded-tr-2xl rounded-br-2xl w-60 overflow-y-auto"
    >
      {/* <div className="flex items-center justify-center"> */}
      <h1 className="text-2xl font-bold text-[#005823BF] mt-8">SabiGuy</h1>
      <h2 className="text-base font-semibold text-gray-900 mt-10 mb-8">Account Setup</h2>
{/* </div> */}
      <div className="flex flex-col relative gap-6">
        {steps.map((step, index) => {
          const isActive = currentStep === index;
          const isCompleted = currentStep > index;
          const isLast = index === steps.length - 1;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-4 relative"
            >
              {!isLast && (
                <div className="absolute left-[14px] top-8 w-[2px] h-8 bg-gray-200"></div>
              )}

              <div
                className={`w-7 h-7 flex items-center justify-center rounded-full border-2 text-sm
                  ${
                    isCompleted
                      ? "bg-[#005823BF] border-[#005823BF] text-white"
                      : isActive
                      ? "border-[#005823BF] text-[#005823BF]"
                      : "border-gray-300 text-gray-400"
                  }`}
              >
                {isCompleted ? "✓" : index + 1}
              </div>

              <div
                className={`font-medium text-sm leading-5 ${
                  isActive
                    ? "text-[#005823BF]"
                    : isCompleted
                    ? "text-gray-700"
                    : "text-gray-500"
                }`}
              >
                {step}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.aside>
  );
}
