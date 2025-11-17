import AuthLayout from "../../../components/layouts/layout";
import Navbar from "../../../components/layouts/navbar";
import Button from "../../../components/button";
import { FaChevronLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useRef } from "react";
import axios from "axios";


export default function StepTwo({onNext, email}) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const inputRefs = useRef ([]); 

    const google_email =   localStorage.getItem("google-email")


   const handleChange = (index, value) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto move to next input
      if (value && index < 5) inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

   const handleSubmit = async () => {
    const fullOtp = otp.join("");
    if (fullOtp.length !== 6) {
      setMessage("Please enter all 6 digits of the verification code.");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");

      // Retrieve token from localStorage (saved in StepOne)
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("No token found. Please register again.");
        return;
      }

      const response = await axios.post(
       `${import.meta.env.VITE_BASE_URL}/auth/email`,
        { otp: fullOtp },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        setSuccessMessage("Email verified successfully!");
        setTimeout(() => onNext(), 1000);
      } else {
        setErrorMessage("Verification failed. Please try again.");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(error.response?.data?.message || "Invalid or expired code.");
    } finally {
      setLoading(false);
    }
  };
 const isOtpComplete = otp.every((digit) => digit !== "");

    return (
       <> 
       <Navbar/>
       <AuthLayout
       title="Welcome Back!"
    description="Join us to discover reliable professionals
anytime, anywhere."
       
       >

        <motion.div
      key="step-two"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
    >
        <h2 className="text-2xl font-semibold text-center mb-1">
                 Verify your email address
               </h2>
               <p className="text-gray-500 text-center mb-6">
                 We've sent a verification code to your email: {" "} <span className="font-bold">{email || google_email}</span>
               </p>
               <div className="flex flex-col gap-4 items-center">
               <div class="flex justify-center gap-2">
 
  
{otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={digit}
                  ref={(el) => (inputRefs.current[index] = el)}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-14 h-14 text-center border border-gray-300 rounded-md text-xl focus:outline-none focus:ring-2 focus:ring-[#8BC53FBF]"
                />
              ))}
  
</div>

       {successMessage && (
              <p className="text-center text-sm text-[#005823] mt-2">{successMessage}</p>
            )}
             {errorMessage && (
              <p className="text-center text-sm text-red-500 mt-2">{errorMessage}</p>
            )}
<Button
  variant="secondary"
  onClick={handleSubmit}
  disabled={!isOtpComplete || loading}
>
  {loading ? "Verifying..." : "Verify Email"}
</Button>
<p className="text-gray-500 text-center  text-sm mb-6">
                 Didn't recieve an email? Please check your spam folder or request for another code in 30 seconds
               </p>
                     <div className="inline-flex">
  <Link to="/">
    <button
      className="w-90 text-sm px-2 py-2 font-medium text-[#005823] hover:bg-gray-100 transition-all duration-200 flex items-center justify-center gap-3 rounded-md"
    >
      <FaChevronLeft size={20} className="text-[#005823]" />
      <span>Back to sign in</span>
    </button>
  </Link>
</div>
      </div>
      </motion.div>
        </AuthLayout> 
       </>
    )
}