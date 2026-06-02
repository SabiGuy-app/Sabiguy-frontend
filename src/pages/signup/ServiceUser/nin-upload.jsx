import { useState } from "react";
import { motion } from "framer-motion";
import { IoIosArrowBack } from "react-icons/io";
import AuthLayout from "../../../components/layouts/layout";
import Navbar from "../../../components/layouts/navbar";
import InputField from "../../../components/InputField";
import { submitUserNin } from "../../../api/user";
import { useAuthStore } from "../../../stores/auth.store";

const NIN_LENGTH = 11;
const MotionDiv = motion.div;

const getNinErrorMessage = (error) => {
  const status = error?.response?.status;
  const responseMessage =
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message;
  const apiMessage =
    typeof responseMessage === "string" ? responseMessage : undefined;

  if (status === 400) {
    return apiMessage || "Please enter a valid 11-digit NIN.";
  }

  if (status === 404) {
    return "NIN verification is not available right now. Please try again later.";
  }

  if (status >= 500) {
    return "We couldn't submit your KYC verification right now. Please try again.";
  }

  if (!error?.response && error?.request) {
    return "No response from the server. Please check your connection and try again.";
  }

  return apiMessage || "Something went wrong. Please try again.";
};

export default function NinUpload({ onNext, onBack }) {
  const updateUser = useAuthStore((state) => state.updateUser);
  const [nin, setNin] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNinChange = (event) => {
    const digitsOnly = event.target.value.replace(/\D/g, "").slice(0, NIN_LENGTH);
    setNin(digitsOnly);
    setErrorMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (nin.length !== NIN_LENGTH) {
      setErrorMessage("Please enter your 11-digit NIN before continuing.");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");

      const response = await submitUserNin(nin);

      if (response.status === 200) {
        const responseUser =
          response.data?.data?.user ||
          response.data?.user ||
          response.data?.data ||
          {};

        updateUser((currentUser) => {
          if (!currentUser) return currentUser;

          if (currentUser.data) {
            return {
              ...currentUser,
              data: {
                ...currentUser.data,
                ...responseUser,
                kycCompleted: true,
                kycVerified: responseUser.kycVerified ?? false,
                kycRejected: responseUser.kycRejected ?? false,
                nin,
                ninSlip: responseUser.ninSlip ?? nin,
              },
            };
          }

          return {
            ...currentUser,
            ...responseUser,
            kycCompleted: true,
            kycVerified: responseUser.kycVerified ?? false,
            kycRejected: responseUser.kycRejected ?? false,
            nin,
            ninSlip: responseUser.ninSlip ?? nin,
          };
        });

        onNext?.({ nin, ninSlip: nin });
        return;
      }

      setErrorMessage("Unable to submit your KYC verification. Please try again.");
    } catch (error) {
      setErrorMessage(getNinErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen">
      <Navbar />
      <AuthLayout
        title="Let's Get Started!"
        description="Connect with trusted providers, verified professionals, and manage bookings in real time."
      >
        <MotionDiv
          key="nin-upload"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <button
            type="button"
            onClick={onBack}
            disabled={loading}
            className="flex items-center gap-2 w-fit mb-8 text-[#005823] font-medium hover:bg-gray-100 transition-all duration-200 rounded-md px-2 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <IoIosArrowBack size={24} />
            <span>Back</span>
          </button>

          <h2 className="text-2xl font-semibold text-center mb-1">
            Enter your NIN
          </h2>
          <p className="text-gray-500 text-center mb-6">
            We require this to help keep your account secure.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <InputField
                name="nin"
                label="NIN"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={NIN_LENGTH}
                placeholder="Enter your 11-digit NIN"
                value={nin}
                onChange={handleNinChange}
                disabled={loading}
              />
              <p className="text-sm text-gray-500 mt-3">
                Kindly enter the NIN on your National Identification Number
                record. It must be {NIN_LENGTH} digits.
              </p>

              {errorMessage && (
                <p className="text-[#db3a3a] text-sm mt-2">{errorMessage}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={nin.length !== NIN_LENGTH || loading}
              className="p-3 rounded-md text-white bg-[#005823BF] hover:bg-[#005823] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              {loading ? "Submitting NIN..." : "Save & Continue"}
            </button>
          </form>
        </MotionDiv>
      </AuthLayout>
    </div>
  );
}
