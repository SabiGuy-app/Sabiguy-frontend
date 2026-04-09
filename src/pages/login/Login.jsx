import AuthLayout from "../../components/layouts/layout";
import Button from "../../components/button";
import InputField from "../../components/InputField";
import LoginNavbar from "../../components/layouts/loginNavbar";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Formik, ErrorMessage } from "formik";
import { useNavigate } from "react-router-dom";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import { LoginSchema } from "./schema";
import ForgotPassword from "../Forgot-Password/ForgotPassword";
import Loader from "../../components/Loader";
import { useAuthStore } from "../../stores/auth.store";
import { login, googleLogin, getUserByEmail } from "../../api/auth";
import {
  requestNotificationPermission,
  listenForMessages,
} from "../../services/fcmService";
import { registerUserFCMToken } from "../../api/fcm";
import { toast } from "react-toastify";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  // const userRole = useAuthStore((state) => state.user?.data?.role);

  const navigate = useNavigate();
  const handleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  useEffect(() => {
    listenForMessages((payload) => {
      // Handle notification in app
      console.log("Notification received in foreground:", payload);

      toast.info(payload?.notification?.title || "New notification", {
        description: payload?.notification?.body,
      });
    });
  }, []);

  const registerFCM = async () => {
    try {
      const fcmToken = await requestNotificationPermission();

      if (fcmToken) {
        await registerUserFCMToken(fcmToken);
        console.log("✅ FCM token registered successfully");
      }
    } catch (error) {
      console.error("Failed to register FCM:", error);
      // Don't block login if FCM fails
    }
  };

  const handleProviderKycRedirect = async (rawEmail, password) => {
    const normalizedEmail = rawEmail.trim().toLowerCase();
    if (!normalizedEmail || !normalizedEmail.includes("@")) return "none";
    try {
      const kycRes = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/provider/kyc-level`,
        { email: normalizedEmail },
      );

      const token =
        kycRes.data?.token ||
        kycRes.data?.data?.token ||
        kycRes.data?.accessToken;
      if (token) {
        localStorage.setItem("token", token);
      }

      const kycCompleted =
        kycRes.data?.kycCompleted ?? kycRes.data?.data?.kycCompleted;
      const kycVerified =
        kycRes.data?.kycVerified ?? kycRes.data?.data?.kycVerified;
      // if (kycCompleted === true && kycVerified === false) {
      //   navigate("/kyc-not-verified");
      //   return "not_verified";
      // }
      if (kycCompleted === true && kycVerified === false) {
        if (password) {
          const res = await login({
            email: normalizedEmail,
            password,
          });
          if (res?.token) {
            localStorage.setItem("token", res.token);
            useAuthStore.getState().setToken(res.token);
            const fullUser = await getUserByEmail(res.email || normalizedEmail);
            useAuthStore.getState().setUser(fullUser);
            await registerFCM();
          }
        }
        navigate("/dashboard/provider");
        return "verified";
      }

      if (kycRes.data?.message === "This is a new customer") {
        localStorage.setItem("kycLevel", "0");
        localStorage.setItem("email", normalizedEmail);
        return "incomplete";
      }

      const level =
        kycRes.data?.kycLevel ||
        kycRes.data?.data?.kycLevel ||
        kycRes.data?.level;
      const numericLevel = Number(level);
      if (!Number.isNaN(numericLevel) && numericLevel < 6) {
        localStorage.setItem("kycLevel", String(numericLevel));
        localStorage.setItem("email", normalizedEmail);
        return "incomplete";
      }
    } catch {
      // Ignore KYC lookup errors and proceed with normal login
    }

    return "none";
  };

  const handleLogin = async (values, { setSubmitting }) => {
    setLoading(true);
    setSuccessMessage("");

    try {
      const normalizedEmail = values.email.trim().toLowerCase();
      const payload = {
        email: normalizedEmail,
        password: values.password,
      };

      // 1. LOGIN
      const res = await login(payload);

      if (res?.message) setSuccessMessage(res.message);

      if (!res?.token) {
        setErrorMessage("Login failed. Please try again.");
        return;
      }

      // Extract token + email
      const token = res.token;
      const refreshToken = res.refreshToken;
      const loginEmail = res.email || normalizedEmail;

      // Store token
      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);
      useAuthStore.getState().setToken(token);
      // useAuthStore.getState().setRefreshToken(refreshToken);

      // 2. GET FULL USER DETAILS
      const fullUser = await getUserByEmail(loginEmail);

      // Store in Zustand
      useAuthStore.getState().setUser(fullUser);

      // Register FCM token
      await registerFCM();

      // Navigate based on user role
      if (res.role === "buyer") {
        navigate("/dashboard");
      } else if (res.role === "provider") {
        const kycStatus = await handleProviderKycRedirect(
          normalizedEmail,
          values.password,
        );
        if (kycStatus === "incomplete") {
          setErrorMessage(
            "You are yet to complete your onboarding process. You will be redirected to where you stopped...",
          );
          setTimeout(() => {
            navigate("/service-provider/signup");
          }, 5000);
          return;
        }
        if (kycStatus === "verified" || kycStatus === "not_verified") {
          return;
        }
        navigate("/dashboard/provider");
      }
    } catch (error) {
      console.error("Login failed:", error);

      if (error.response) {
        console.log("Login error response data:", error.response.data);
        const raw = error.response.data;
        let apiMessage = null;
        if (typeof raw === "string") {
          try {
            const parsed = JSON.parse(raw);
            apiMessage = parsed?.message || parsed?.error;
          } catch {
            const match = raw.match(/"message"\s*:\s*"([^"]+)"/);
            apiMessage = match?.[1] || raw;
          }
        } else {
          apiMessage =
            raw?.message ||
            raw?.error ||
            raw?.error?.message ||
            raw?.data?.message;
        }
        if (
          typeof apiMessage === "string" &&
          apiMessage.toLowerCase().includes("request failed with status code")
        ) {
          apiMessage = null;
        }
        let finalMessage = apiMessage || "Login failed. Try again.";
        if (
          typeof finalMessage === "string" &&
          finalMessage.trim() === "Please verify your email before logging in"
        ) {
          finalMessage =
            "Please verify your email before logging in. Try signing up again to recieve a verification mail.";
        }
        setErrorMessage(finalMessage);
      } else if (error.request) {
        setErrorMessage(
          "No response from server. Please check your connection.",
        );
      } else {
        setErrorMessage("Unexpected error occurred.");
      }
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  const GoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setGoogleLoading(true);

        const data = await googleLogin(tokenResponse.access_token);

        if (!data?.token) {
          const message =
            typeof data === "string"
              ? data
              : data?.message || data?.error || data?.error?.message;
          let finalMessage = message || "Login failed";
          if (
            typeof finalMessage === "string" &&
            finalMessage.trim() === "Please verify your email before logging in"
          ) {
            finalMessage =
              "Please verify your email before logging in. Try signing up again to receive a verification mail.";
          }
          setErrorMessage(finalMessage);
          setGoogleLoading(false);
          return;
        }

        const token = data.token;
        const loginEmail =
          data.user?.email || data.email || data.newUser?.email || "";

        // Store token
        localStorage.setItem("token", token);
        useAuthStore.getState().setToken(token);

        // Get full user
        const fullUser = await getUserByEmail(loginEmail);
        useAuthStore.getState().setUser(fullUser);

        await registerFCM();

        // Navigate based on user role
        if (data.user.role === "buyer") {
          navigate("/dashboard");
        } else if (data.user.role === "provider") {
          const kycStatus = await handleProviderKycRedirect(loginEmail);
          if (kycStatus === "incomplete") {
            setErrorMessage(
              "You are yet to complete your onboarding process. You will be redirected to where you stopped...",
            );
            setTimeout(() => {
              navigate("/service-provider/signup");
            }, 5000);
            setGoogleLoading(false);
            return;
          }
          if (kycStatus === "verified" || kycStatus === "not_verified") {
            setGoogleLoading(false);
            return;
          }
          navigate("/dashboard/provider");
        }

        setGoogleLoading(false);
      } catch (err) {
        console.error("Google login failed:", err);
        const raw = err?.response?.data;
        let apiMessage = null;
        if (typeof raw === "string") {
          try {
            const parsed = JSON.parse(raw);
            apiMessage = parsed?.message || parsed?.error;
          } catch {
            const match = raw.match(/"message"\s*:\s*"([^"]+)"/);
            apiMessage = match?.[1] || raw;
          }
        } else {
          apiMessage =
            raw?.message ||
            raw?.error ||
            raw?.error?.message ||
            raw?.data?.message;
        }
        if (
          typeof apiMessage === "string" &&
          apiMessage.toLowerCase().includes("request failed with status code")
        ) {
          apiMessage = null;
        }
        setGoogleLoading(false);
        let finalMessage = apiMessage || err?.message || "Google login failed";
        if (
          typeof finalMessage === "string" &&
          finalMessage.trim() === "Please verify your email before logging in"
        ) {
          finalMessage =
            "Please verify your email before logging in. Try signing up again to receive a verification mail.";
        }
        setErrorMessage(finalMessage);
      }
    },

    onError: (err) => {
      setGoogleLoading(false);
      setErrorMessage(err.message || "Google login failed.");
    },
  });

  if (googleLoading) {
    return <Loader />;
  }

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="h-screen">
      <LoginNavbar />
      <AuthLayout
        title="Welcome Back!"
        description="Log in with your detail to keep exploring our platform"
      >
        <motion.div
          key="step-one"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-2xl font-semibold text-center mt-7 mb-1">
            Welcome Back
          </h2>
          <p className="text-gray-500 text-center mb-6">
            Kindly provide your email address and password to continue
          </p>

          <Formik
            initialValues={{
              email: "",
              password: "",
            }}
            onSubmit={handleLogin}
            validationSchema={LoginSchema}
          >
            {({ values, handleChange, handleBlur, handleSubmit }) => (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                <div className="flex justify-start mb-5">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="font-semibold text-lg hover:text-[#005823BF]"
                  >
                    Forgot Password?
                  </button>
                </div>

                <Button type="submit">
                  {loading ? "Loading..." : "Log In"}
                </Button>

                <div className="flex items-center my-4">
                  <div className="flex-grow border-t border-gray-300"></div>
                  <span className="mx-2 text-gray-500">or</span>
                  <div className="flex-grow border-t border-gray-300"></div>
                </div>
                <button
                  type="button"
                  onClick={() => GoogleLogin()}
                  disabled={googleLoading}
                  className="w-full border border-gray-300 rounded-lg py-3 flex items-center justify-center gap-3 hover:bg-gray-50 transition"
                >
                  <img src="/Google.svg" alt="Google" className="w-5 h-5" />
                  <span className="text-gray-700 font-medium">
                    {googleLoading ? "Logging in..." : "Continue with Google"}
                  </span>
                </button>
                <p className="text-center mb-5 text-sm mt-4">
                  Don't have an account yet?
                  <Link
                    to="/welcome"
                    className="text-[#005823] font-medium hover:text-black transition-all duration-200 inline-flex items-center group ml-1"
                  >
                    Sign Up
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
      <ForgotPassword
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
      />
    </div>
  );
}
