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
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';
import Loader from "../../../components/Loader";


export default function StepOne({ onNext }) {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false); // Fixed typo


  const handleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    setLoading(true);
    setSuccessMessage("");
    try {
      const payload = {
        fullName: values.fullName,
        phoneNumber: values.phoneNumber,
        city: values.city,
        email: values.email,
        password: values.password,
        term: values.term
      };

      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/buyer`, payload);

      console.log("Backend response:", response);

      if (response.status === 200 || response.status === 201) {
        const token = response.data?.token;
        if (token) {
          localStorage.setItem("token", token)
        }
        setSuccessMessage("Registration successful");
        onNext?.({ email: values.email });
        localStorage.setItem("email", values.email);

      } else {
        const data = response.data;
        if (data.debugMessage === "Email already in use") {
          setErrorMessage(`${data.debugMessage}. Please login to continue your sign-up process.`);
        } else {
          setErrorMessage(data.message || "Something went wrong");
        }
      }
    } catch (error) {
      console.error("An error occurred:", error);
      if (error.response) {
        setErrorMessage(error.response.data?.message || "An error occurred");
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

  //  Sign up with google
  // const handleGoogleSuccess = async (credentialResponse) => {
  //   setGoogleLoading(true); // Start loading
  //   console.log("Google login successful:", credentialResponse);
  //   const token = credentialResponse.credential;

  //   try {
  //     const res = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/google`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ token }),
  //     });

  //     const data = await res.json();
  //     console.log("Server response:", data);

  //     if (data?.token) {
  //       localStorage.setItem("token", data.token);
  //     }

  //     if (data?.newUser?.email) {
  //       localStorage.setItem("google-email", data.newUser.email);
  //       onNext();
  //     } else {
  //       setErrorMessage("data.message");
  //     } 
      
  //     if (data.message === "Email already in use") {
  //       setErrorMessage(data.message);
  //     }
  //   } catch (err) {
  //     console.error("Google login failed:", err);
  //     setErrorMessage("Google login failed. Please try again.");
  //   } finally {
  //     setGoogleLoading(false); // Stop loading
  //   }
  // };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setGoogleLoading(true);
        
        // Get Google user info
        const userInfo = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          }
        );
        
        const profile = await userInfo.json();
        console.log("Google Profile:", profile);
        
        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/google`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: tokenResponse.access_token }), 
        });
        
        const data = await res.json();
        console.log("Server response:", data);
        
        if (data?.token) {
          localStorage.setItem("token", data.token);
        }
        
        if (data?.newUser?.email) {
          localStorage.setItem("google-email", data.newUser.email);
          setGoogleLoading(false);
          onNext();
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


  // Show loader when Google login is in progress
  if (googleLoading) {
    return <Loader />;
  }

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
          <h2 className="text-2xl font-semibold text-center mt-7 mb-1">Let's get you started</h2>
          <p className="text-gray-500 text-center mb-6">
            Please enter your details and let's get you started
          </p>

          <Formik
            initialValues={{
              fullName: "",
              lastName: "",
              email: "",
              city: "",
              phoneNumber: "",
              password: "",
              term:false
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
                  name="city"
                  label="Address"
                  placeholder="Enter your address"
                  value={values.city}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <ErrorMessage
                    name="city"
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
                    placeholder="Use a minimum of 6 characters"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <ErrorMessage
                    name="password"
                    component="span"
                    className="text-[#db3a3a]"
                  />
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
                  <div className="text-center text-[#db3a3a] mt-2">{errorMessage}</div>
                )}
                {successMessage && (
                  <div className="text-center text-[#005823BF] mt-2">{successMessage}</div>
                )}

                <div className="flex items-center gap-2">
                  <input type="checkbox" id="terms" className="accent-[#005823BF]" />
                  <label htmlFor="terms" value={values.term} className="text-sm text-gray-600">
                    I agree to the{" "}
                    <a href="#" className="text-[#005823BF] font-medium">
                      Privacy Policy
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-[#005823BF] font-medium">
                      Terms of Services
                    </a>
                  </label>
                  <ErrorMessage
                    name="term"
                    component="span"
                    className="text-[#db3a3a]"
                  />
                </div>

                <Button type="submit">
                  {loading ? "Loading..." : "Continue"}
                </Button>

                <div className="flex items-center my-4">
                  <div className="flex-grow border-t border-gray-300"></div>
                  <span className="mx-2 text-gray-500 text-sm">or</span>
                  <div className="flex-grow border-t border-gray-300"></div>
                </div>

                {/* <GoogleLogin 
                  onSuccess={handleGoogleSuccess}
                  size="large"
                  text="continue_with"
                  theme="outline"
                  logo_alignment="center"
                /> */}

                <button
  onClick={() => googleLogin()}
  className="w-full border border-gray-300 rounded-lg py-3 flex items-center justify-center gap-3 hover:bg-gray-50 transition"
>
  <img src="/Google.svg" alt="Google" className="w-5 h-5" />
  <span className="text-gray-700 font-medium">Continue with Google</span>
</button>
                
                <p className="text-center text-sm mt-2 mb-5">
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