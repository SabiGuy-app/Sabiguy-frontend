import AuthLayout from "../../../components/layouts/layout";
import Navbar from "../../../components/layouts/navbar";
import Button from "../../../components/button";
import { FaChevronLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import axios from "axios";
import InputField from "../../../components/InputField";


export default function ConfirmKyc({ onNext }) {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [email, setEmail] = useState("");
  const [kycLevel, setKycLevel] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMessage("Please enter your email address.");
      return;
    }
    try {
      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");
      setKycLevel(null);

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/provider/kyc-level`,
        { email: email.trim() }
      );
          localStorage.setItem("email", email.trim());

      if (response.status === 200 || response.status === 201) {
        const token =
          response.data?.token ||
          response.data?.data?.token ||
          response.data?.accessToken;
        if (token) {
          localStorage.setItem("token", token);
        }
        if (response.data?.message === "This is a new customer") {
          if (onNext) {
            onNext({ kycLevel: 0, email: email.trim() });
          }
          setSuccessMessage("New customer detected. Redirecting...");
          return;
        }
        const level =
          response.data?.kycLevel ??
          response.data?.data?.kycLevel ??
          response.data?.level;
        setKycLevel(level ?? null);
        setSuccessMessage("KYC level retrieved successfully!");
        if (onNext && level !== undefined && level !== null) {
          onNext({ kycLevel: level, email: email.trim() });
        }
      } else {
        setErrorMessage("Failed to retrieve KYC level. Please try again.");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(
        error.response?.data?.message ||
          "Unable to fetch KYC level. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen"> 
      <Navbar/>
      <AuthLayout
        title="Welcome Back!"
        description="Join us to discover reliable professionals anytime, anywhere."
      >
        <motion.div
          key="step-two"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-2xl font-semibold text-center mb-1">
Let's get you started!
          </h2>
          <p className="text-gray-500 text-center mb-6">
            Enter your email address to continue.
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

            {successMessage && (
              <p className="text-center text-sm text-[#005823] mt-2">{successMessage}</p>
            )}
            {errorMessage && (
              <p className="text-center text-sm text-red-500 mt-2">{errorMessage}</p>
            )}
            {kycLevel !== null && (
              <p className="text-center text-sm text-gray-700">
                Your KYC level: <span className="font-semibold">{kycLevel}</span>
              </p>
            )}

            <Button
              variant="secondary"
              type="submit"
              disabled={loading}
            >
              {loading ? "Loading..." : "Next"}
            </Button>
          </form>
          <div className="inline-flex mt-4 justify-center w-full">
            <Link to="/">
              <button
                className="w-90 text-sm px-2 py-2 font-medium text-[#005823] hover:bg-gray-100 transition-all duration-200 flex items-center justify-center gap-3 rounded-md"
              >
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
