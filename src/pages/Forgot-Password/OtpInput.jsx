import { FaChevronLeft } from "react-icons/fa";
import Button from "../../components/button";
import { useState, useRef, useEffect } from "react";
import Modal from "../../components/Modal";
import ResetPassword from "./ResetPassword";
import axios from "axios";

export default function OtpInput ({ isOpen, onClose})  {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [showResetModal, setShowResetModal] = useState(false)
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [countdown, setCountdown] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const inputRefs = useRef ([]); 

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

const email = localStorage.getItem("passwordEmail");

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [countdown]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleContinue = async () => {
        // Combine OTP digits into a single string
        const otpCode = otp.join("");
        
        if (!email) {
            setError("Email not found. Please restart password reset.");
            return;
        }

        // Validate OTP is complete
        if (otpCode.length !== 6) {
            setError("Please enter all 6 digits");
            return;
        }

        setLoading(true);
        setError("");
        setSuccessMessage("");
        try {
             const res = await axios.post(
               `${import.meta.env.VITE_BASE_URL}/auth/verify-reset-otp`,
               { email, otp: otpCode },
             );

             if (res.data) {
               localStorage.setItem("resetOtp", otpCode);
               onClose();
               setShowResetModal(true);
             }

        } catch (error) {
           console.error("OTP verification error:", error);
           if (error.response) {
             setError(error.response.data?.message || "Something went wrong.");
           } else {
             setError("Network error. Please try again.");
           }
        }finally {
            setLoading(false);
        }
      };

  const handleResendOtp = async () => {
    if (!email) {
      setError("Email not found. Please restart password reset.");
      return;
    }

    try {
      setResending(true);
      setError("");
      setSuccessMessage("");

      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/auth/resend-forgot-password-otp`,
        { email },
      );

      if (res.status === 200 || res.status === 201 || res.data) {
        setSuccessMessage("OTP resent successfully!");
        setCountdown(60);
        setCanResend(false);
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      } else {
        setError("Failed to resend OTP. Please try again.");
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
      if (error.response) {
        setError(error.response.data?.message || "Something went wrong.");
      } else {
        setError("Network error. Please try again.");
      }
    } finally {
      setResending(false);
    }
  };
  
    return (
      <>
               <Modal isOpen={isOpen} onClose={onClose} title="Forgot Password?">

        <p className="text-gray-500">Please enter the code sent to your email: {email}</p>

        <div className="flex flex-col gap-4 items-center">
               <div className="flex justify-center gap-2">
 
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
                  <p className="text-sm text-[#005823]">{successMessage}</p>
                )}
                {error && <p className="text-sm text-red-500">{error}</p>}


                <Button 
                    variant="secondary" 
                    onClick={handleContinue}
                    disabled={loading}
                >
                    {loading ? "Loading..." : "Continue"}
                </Button>

                <div className="flex flex-col items-center gap-2 mt-2">
                  <p className="text-gray-500 text-center text-sm">
                    Didn&apos;t receive an email? Please check your spam folder
                  </p>

                  {!canResend ? (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">
                        Request new code in
                      </span>
                      <span className="text-sm font-semibold text-[#005823] bg-[#8BC53F1A] px-3 py-1 rounded-md">
                        {formatTime(countdown)}
                      </span>
                    </div>
                  ) : (
                    <button
                      onClick={handleResendOtp}
                      disabled={resending}
                      className="text-sm font-medium text-[#005823] hover:text-[#004019] underline disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {resending ? "Resending..." : "Resend verification code"}
                    </button>
                  )}
                </div>
</div>
 <div className="flex item-center justify-center mt-5">
    <button
    onClick={onClose}
      className="w-90 text-sm px-2 py-2 font-medium text-[#005823] hover:bg-gray-100 transition-all duration-200 flex items-center justify-center gap-3 rounded-md"
    >
      <FaChevronLeft size={20} className="text-[#005823]" />
      <span>Back to Login</span>
    </button>
</div>   
</Modal>
<ResetPassword
isOpen={showResetModal}
onClose={() => setShowResetModal(false)}

/>
</>
    )

}
