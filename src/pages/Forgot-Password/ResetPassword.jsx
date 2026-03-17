import { FaChevronLeft } from "react-icons/fa";
import InputField from "../../components/InputField";
import Button from "../../components/button";
import { Link } from "react-router-dom";
import Modal from "../../components/Modal";
import { useState } from "react";
import Success from "./success";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";

export default function ResetPassword({ isOpen, onClose }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/auth/reset`,
        { newPassword, otp: savedOtp, email },
      );

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

  const EyeToggle = ({ show, onToggle }) => (
    <button
      type="button"
      onClick={onToggle}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
    >
      {show ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  );

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Reset Password">
        <p className="flex flex-col items-center justify-center text-gray-500 mb-5">
          Kindly reset your password
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1 w-full">
            <label className="text-sm font-medium text-gray-700">
              New password
            </label>
            <div className="relative w-full">
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="Enter your new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-4 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-[#005823]"
              />
              <EyeToggle
                show={showNewPassword}
                onToggle={() => setShowNewPassword((p) => !p)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1 w-full">
            <label className="text-sm font-medium text-gray-700">
              Confirm new password
            </label>
            <div className="relative w-full">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-4 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-[#005823]"
              />
              <EyeToggle
                show={showConfirmPassword}
                onToggle={() => setShowConfirmPassword((p) => !p)}
              />
            </div>
          </div>

          <p className="mt-2 text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-md px-3 py-2">
            Password must be at least 8 characters long and include a letter,
            number, and special character
          </p>
          {message && (
            <p
              className={`text-sm ${
                message.toLowerCase().includes("check")
                  ? "text-green-600"
                  : "text-red-500"
              }`}
            >
              {message}
            </p>
          )}
          <Button type="submit">
            {loading ? "Please wait..." : "Continue"}
          </Button>
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
      <Success isOpen={showSuccess} onClose={() => setShowSuccess(false)} />
    </>
  );
}
