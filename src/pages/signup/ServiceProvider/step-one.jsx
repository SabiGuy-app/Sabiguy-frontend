import AuthLayout from "../../../components/layouts/layout";
import Button from "../../../components/button";
import InputField from "../../../components/InputField";
import Navbar from "../../../components/layouts/navbar";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Formik, ErrorMessage } from "formik";
import { SignUpSchema } from "./schema";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import Loader from "../../../components/Loader";

export default function StepOne({ onNext }) {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [termAccepted, setTermAccepted] = useState(false);
  const [termError, setTermError] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    if (!termAccepted) {
      setTermError("You must accept the Privacy Policy and Terms of Service.");
      setSubmitting(false);
      return;
    }

    setLoading(true);
    setSuccessMessage("");
    try {
      const payload = {
        fullName: values.fullName,
        phoneNumber: values.phoneNumber,
        email: values.email,
        password: values.password,
        term: values.term,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/auth/provider`,
        payload,
      );

      console.log("Backend response:", response);

      if (
        response.data?.message?.startsWith(
          "Email not verified. OTP sent to email",
        )
      ) {
        setSuccessMessage(
          "Your email is registered but not verified yet, you have however recieved another otp. You will be redirected to the otp input page in a moment...",
        );
        localStorage.setItem("email", values.email);
        setTimeout(() => {
          onNext?.({ email: values.email });
        }, 5000);
        return;
      }

      if (response.status === 200 || response.status === 201) {
        const token = response.data?.token;
        if (token) {
          localStorage.setItem("token", token);
        }
        setSuccessMessage("Registration successful");
        onNext?.({ email: values.email });
        localStorage.setItem("email", values.email);
      } else {
        const data = response.data;
        if (data.debugMessage === "Email already in use") {
          setErrorMessage(
            `${data.debugMessage}. Please login to continue your sign-up process.`,
          );
        } else {
          setErrorMessage(data.message || "Something went wrong");
        }
      }
    } catch (error) {
      console.error("An error occurred:", error);
      if (error.response) {
        const apiMessage = error.response.data?.message;
        if (apiMessage?.startsWith("Email not verified. OTP sent to email")) {
          setSuccessMessage(
            "Your email is registered but not verified yet, you have however received another otp. You will be redirected to the otp input page in a moment...",
          );
          localStorage.setItem("email", values.email);
          setTimeout(() => {
            onNext?.({ email: values.email });
          }, 5000);
        } else {
          setErrorMessage(apiMessage || "An error occurred");
        }
      } else if (error.request) {
        setErrorMessage("No response from the server. Please try again later.");
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setGoogleLoading(true);

        console.log("Token response:", tokenResponse); // Debug log
        console.log("Access token:", tokenResponse.access_token); // Debug log

        // Get Google user info
        const userInfo = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          },
        );

        const profile = await userInfo.json();
        console.log("Google Profile:", profile);

        // Make sure you're sending the access_token
        const res = await fetch(
          `${import.meta.env.VITE_BASE_URL}/auth/google-provider`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token: tokenResponse.access_token }), // Send access_token
          },
        );

        const data = await res.json();
        console.log("Server response:", data);

        if (data?.token) {
          localStorage.setItem("token", data.token);
        }

        const googleEmail =
          data?.email || data?.newUser?.email || profile?.email || "";

        if (
          data?.message?.startsWith(
            "Email not verified. OTP sent to email",
          )
        ) {
          setSuccessMessage(
            "Your email is registered but not verified yet, you have however recieved another otp. You will be redirected to the otp input page in a moment...",
          );
          localStorage.setItem("email", googleEmail);
          setTimeout(() => {
            onNext?.({ email: googleEmail });
          }, 5000);
          setGoogleLoading(false);
          return;
        }

        if (data?.newUser?.email) {
          localStorage.setItem("google-email", data.newUser.email);
          setGoogleLoading(false);
          onNext({ email: data.newUser.email, skipOtp: true });
        } else if (data.message === "Email already in use") {
          setGoogleLoading(false);
          setErrorMessage(data.message);
        } else {
          setGoogleLoading(false);
          setErrorMessage("An error occurred. Please try again.");
        }
      } catch (err) {
        console.error(err);
        setGoogleLoading(false);
        setErrorMessage("Google login failed");
      }
    },

    onError: () => {
      setErrorMessage("Google login failed.");
      setGoogleLoading(false);
    },
  });
  // Keep page visible; we'll disable Google button while loading

  return (
    <div className="h-screen">
      <Navbar />
      <AuthLayout
        title="Welcome Back!"
        description="Connect with trusted providers, verified professionals,
        and manage bookings in real time."
      >
        <motion.div
          key="step-one"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-2xl font-semibold text-center mt-7 mb-1">
            Let’s get you started
          </h2>
          <p className="text-gray-500 text-center mb-6">
            Please enter your details and let’s get you started
          </p>

          <Formik
            initialValues={{
              fullName: "",
              email: "",
              phoneNumber: "",
              password: "",
              term: false,
            }}
            onSubmit={handleSubmit}
            validationSchema={SignUpSchema}
          >
            {({ values, handleChange, handleBlur, handleSubmit }) => (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <InputField
                    name="fullName"
                    label="Full Name"
                    placeholder="Enter your first and last name"
                    value={values.fullName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <ErrorMessage
                    name="fullName"
                    component="span"
                    className="text-[#db3a3a]"
                  />
                </div>
                <div>
                  <InputField
                    name="email"
                    label="Email"
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

                <div>
                  <InputField
                    name="phoneNumber"
                    label="Phone number"
                    placeholder="Enter your phone number"
                    value={values.phoneNumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <ErrorMessage
                    name="phoneNumber"
                    component="span"
                    className="text-[#db3a3a]"
                  />
                </div>

                <div className="relative">
                  <InputField
                    name="password"
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <ErrorMessage
                    name="password"
                    component="span"
                    className="text-[#db3a3a]"
                  />
                   <p className="mt-2 text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-md px-3 py-2">
                    Password must be at least 8 characters long and include a letter, number, and special character
                  </p>
                  {showPassword ? (
                    <BsEye
                      onClick={handleShowPassword}
                      className="absolute top-11 right-3 cursor-pointer"
                    />
                  ) : (
                    <BsEyeSlash
                      onClick={handleShowPassword}
                      className="absolute top-11 right-3 cursor-pointer"
                    />
                  )}
                </div>

                {errorMessage && (
                  <div className="text-center text-[#db3a3a] mt-2">
                    {errorMessage}
                  </div>
                )}
                {successMessage && (
                  <div className="text-center text-[#005823BF] mt-2">
                    {successMessage}
                  </div>
                )}

                <div className="">
                  <div className="flex gap-2">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={termAccepted}
                      onChange={() => {
                        setTermAccepted((prev) => !prev);
                        setTermError("");
                      }}
                      className="accent-[#005823BF]"
                    />
                    <label
                      htmlFor="terms"
                      value={values.term}
                      className="text-sm text-gray-600"
                    >
                      I agree to the{" "}
                      <a href="#" className="text-[#005823BF] font-medium">
                        Privacy Policy
                      </a>{" "}
                      and{" "}
                      <a href="#" className="text-[#005823BF] font-medium">
                        Terms of Services
                      </a>
                    </label>
                  </div>
                  {termError && (
                    <span className="text-[#db3a3a] text-sm">{termError}</span>
                  )}
                </div>

        
                               <Button
                                 type="submit"
                                disabled={
                                   !(
                                  values.fullName.trim() &&
                                  values.email.trim() &&
                                     values.phoneNumber.trim() &&
                                     values.password.trim() &&
                                termAccepted
                                   )
                                 }
                               >
                                 {loading ? "Loading..." : "Continue"}
                               </Button>

                <div className="flex items-center my-4">
                  <div className="flex-grow border-t border-gray-300"></div>
                  <span className="mx-2 text-gray-500 text-sm">or</span>
                  <div className="flex-grow border-t border-gray-300"></div>
                </div>

                <button
                  type="button"
                  onClick={() => googleLogin()}
                  disabled={googleLoading}
                  className="w-full border border-gray-300 rounded-lg py-3 flex items-center justify-center gap-3 hover:bg-gray-50 transition"
                >
                  <img src="/Google.svg" alt="Google" className="w-5 h-5" />
                  <span className="text-gray-700 font-medium">
                    {googleLoading ? "Just a moment..." : "Continue with Google"}
                  </span>
                </button>

                <p className="text-center mb-4 text-sm mt-4">
                  Already have an account?
                  <Link
                    to="/login"
                    className="text-[#005823] font-medium hover:text-black transition-all duration-200 inline-flex items-center group ml-1"
                  >
                    Login
                    <FaArrowRight
                      size={18}
                      className="ml-2 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                    />
                  </Link>
                </p>
              </form>
            )}
          </Formik>
        </motion.div>
      </AuthLayout>
    </div>
  );
}
