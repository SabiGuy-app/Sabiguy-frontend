import AuthLayout from "../../../components/layouts/layout";
import Navbar from "../../../components/layouts/navbar";
import Button from "../../../components/button";
import { FaChevronLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import InputField from "../../../components/InputField";

// TODO: UI-only until the business email-lookup endpoint is ready
// (should work like the individual flow's /provider/kyc-level).
export default function ConfirmKyc({ onNext }) {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMessage("Please enter your email address.");
      return;
    }
    setErrorMessage("");
    localStorage.setItem("email", email.trim());
    onNext?.({ email: email.trim() });
  };

  return (
    <div className="h-screen">
      <Navbar />
      <AuthLayout
        title="Let's Get Started!"
        description="Set up your business account to start managing your fleet on SabiGuy."
      >
        <motion.div
          key="business-confirm-kyc"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-2xl font-semibold text-center mb-1">
            Let's get you started!
          </h2>
          <p className="text-gray-500 text-center mb-6">
            Enter your business email address to continue.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 items-center">
            <div className="w-full max-w-md">
              <InputField
                name="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {errorMessage && (
              <p className="text-center text-sm text-red-500 mt-2">{errorMessage}</p>
            )}

            <Button variant="secondary" type="submit">
              Next
            </Button>
          </form>
          <div className="inline-flex mt-4 justify-center w-full">
            <Link to="/login">
              <button className="w-90 text-sm px-2 py-2 font-medium text-[#005823] hover:bg-gray-100 transition-all duration-200 flex items-center justify-center gap-3 rounded-md">
                <FaChevronLeft size={20} className="text-[#005823]" />
                <span>Back to sign in</span>
              </button>
            </Link>
          </div>
        </motion.div>
      </AuthLayout>
    </div>
  );
}
