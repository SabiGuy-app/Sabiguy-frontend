import React from "react";
import Button from "../../../components/button";
import Navbar from "../../../components/layouts/navbar";
import AuthLayout from "../../../components/layouts/layout";

export default function StepThree({ onNext }) {
  return (
    <div className="h-screen">
      <Navbar />
      <AuthLayout title="A few clicks away from completing your account setup">
        <div className="flex flex-col min-h-[70vh] justify-start sm:justify-center items-center px-4 py-8 text-center">
          <div className="w-full max-w-md">
          <h2 className="font-semibold text-2xl sm:text-3xl mb-4 sm:mb-6">
            Congratulations!
          </h2>
          <p className="text-gray-500 mb-5 text-sm sm:text-base leading-relaxed">
            Welcome Onboard, Your SabiGuy account is almost complete. Just a few
            more details to help personalize your experience.
          </p>

          <div className="flex justify-center">
            <Button variant="secondary" onClick={onNext}>
              Continue
            </Button>
          </div>
          </div>
          {/* <button className="mt-7">Skip for now</button> */}
        </div>
      </AuthLayout>
    </div>
  );
}
