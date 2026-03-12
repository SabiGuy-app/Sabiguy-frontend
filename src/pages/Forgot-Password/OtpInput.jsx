import { FaChevronLeft } from "react-icons/fa";
import InputField from "../../components/InputField";
import Button from "../../components/button";
import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import Modal from "../../components/Modal";
import ResetPassword from "./ResetPassword";

export default function OtpInput ({ isOpen, onClose})  {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [showResetModal, setShowResetModal] = useState(false)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
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

  const handleContinue = async () => {
        // Combine OTP digits into a single string
        const otpCode = otp.join("");
        
        // Validate OTP is complete
        if (otpCode.length !== 6) {
            setError("Please enter all 6 digits");
            return;
        }

        setLoading(true);
        setError("");
        try {
             localStorage.setItem("resetOtp", otpCode);
             onClose()
             setShowResetModal(true);

        } catch (error) {
           console.error("OTP verification error:", error)   
        }finally {
            setLoading(false);
        }
      };

  
    return (
      <>
               <Modal isOpen={isOpen} onClose={onClose} title="Forgot Password?">

        <p className="text-gray-500">Please enter the code sent to your email: {email}</p>

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
                {error && <p className="text-sm text-red-500">{error}</p>}


 <Button 
                    variant="secondary" 
                    onClick={handleContinue}
                    disabled={loading}
                >
                    {loading ? "Loading..." : "Continue"}
                </Button>
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