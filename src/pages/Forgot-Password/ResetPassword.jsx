import { FaChevronLeft } from "react-icons/fa";
import InputField from "../../components/InputField";
import Button from "../../components/button";
import { Link } from "react-router-dom";
import Modal from "../../components/Modal";
import { useState } from "react";
import Success from "./success";
import axios from "axios";

export default function ResetPassword ({ isOpen, onClose })  {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false)


  const savedOtp = localStorage.getItem("resetOtp");
  const email = localStorage.getItem("passwordEmail");


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/reset`, {
         newPassword,
        otp: savedOtp,
        email });

      
      setMessage(res.data?.message);
      if (res.data) {
        onClose(); 
        setShowSuccess(true); 
      }
      localStorage.removeItem("resetOtp");
        localStorage.removeItem("passwordEmail");
    } catch (error) {
      console.error("Reset password error:", error);
      if (error.response) {
        setMessage(error.response.data?.message || "Something went wrong.");
      } else {
        setMessage("Network error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };


    return (
      <>
       <Modal isOpen={isOpen} onClose={onClose} title="Reset Password">
          <p className="flex flex-col items-center justify-center text-gray-500 mb-5">Kindly reset your password</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <InputField
          name="email"
          label="New password"
          type="password"
          placeholder="Enter your new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <InputField
          name="confirmPassword"
          label="Confirm new password"
          type="password"
          placeholder="Confirm your new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
         <p className="mt-2 text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-md px-3 py-2">
                    Password must be at least 8 characters long and include a letter, number, and special character
                  </p>
{message && (
          <p
            className={`text-sm ${
              message.toLowerCase().includes("check") ? "text-green-600" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}
<Button type="submit">
          {loading ? "Please wait..." : "Continue"}</Button>
        </form>

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
        <Success
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}      
        />
        </>
    )

}
