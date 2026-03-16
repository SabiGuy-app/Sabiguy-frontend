import { FaChevronLeft } from "react-icons/fa";
import InputField from "../../components/InputField";
import Button from "../../components/button";
import { Link } from "react-router-dom";
import Modal from "../../components/Modal";
import axios from "axios";
import { useState } from "react";
import { Formik, ErrorMessage } from "formik";
import { ForgotPasswordSchema } from "./schema";
import OtpInput from "./OtpInput";

export default function ForgotPassword ({ isOpen, onClose })  {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false)

  const handleSubmit = async (values, { setSubmitting }) => {
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/password`,{ email: values.email });

      localStorage.setItem("passwordEmail", values.email);
      
      setMessage(res.data?.message || "Check your email for reset instructions.");
      if (res.data) {
        onClose(); // Close forgot password modal
        setShowOtpModal(true); // Open OTP modal
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      if (error.response) {
        setMessage(error.response.data?.message || "Something went wrong.");
      } else {
        setMessage("Network error. Please try again.");
      }
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

    return (
      <>

        <Modal isOpen={isOpen} onClose={onClose} title="Forgot Password?">
          <p className="flex flex-col items-center justify-center text-gray-500 mb-5">Enter the email associated with your account to reset your password</p>
      <Formik
        initialValues={{ email: "" }}
        onSubmit={handleSubmit}
        validationSchema={ForgotPasswordSchema}
      >
        {({ values, handleChange, handleBlur, handleSubmit }) => (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <InputField
                name="email"
                placeholder="Enter your email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                name="email"
                component="span"
                className="text-[#db3a3a]"
              />
            </div>

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
              {loading ? "Sending..." : "Send Reset OTP"}
            </Button>
          </form>
        )}
      </Formik>
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
    <OtpInput
isOpen={showOtpModal}
onClose={() => setShowOtpModal(false)}

/>
</>
          
          
    )
};
