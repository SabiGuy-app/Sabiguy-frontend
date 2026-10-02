import AuthLayout from "../../components/layouts/layout";
import Button from "../../components/button";
import InputField from "../../components/InputField";
import LoginNavbar from "../../components/layouts/loginNavbar";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Formik, ErrorMessage } from "formik";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { LoginSchema } from "./schema";
import ForgotPassword from "../Forgot-Password/ForgotPassword";
import { useAuthStore } from "../../stores/auth.store";
import Loader from "../../components/Loader";
import {
  login,
  googleLogin,
  getUserByEmail,
  getBusinessProfile,
} from "../../api/auth";
import { requestNotificationPermission } from "../../services/fcmService";
import { registerUserFCMToken } from "../../api/fcm";

const MotionDiv = motion.div;

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Registers the FCM token with a 3-second timeout so it never blocks navigation.
 */
const registerFCM = async () => {
  try {
    const fcmToken = await Promise.race([
      requestNotificationPermission(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("FCM timeout")), 3000),
      ),
    ]);
    if (fcmToken) {
      await registerUserFCMToken(fcmToken);
    }
  } catch (error) {
    // FCM failure must never block login
    console.warn("FCM registration skipped:", error.message);
  }
};

/**
 * Extracts a human-readable message from an Axios error response.
 */
const extractErrorMessage = (error) => {
  const raw = error?.response?.data;
  let message = null;

  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      message = parsed?.message || parsed?.error;
    } catch {
      const match = raw.match(/"message"\s*:\s*"([^"]+)"/);
      message = match?.[1] || raw;
    }
  } else {
    message =
      raw?.message || raw?.error || raw?.error?.message || raw?.data?.message;
  }

  // Strip axios internal noise
  if (
    typeof message === "string" &&
    message.toLowerCase().includes("request failed with status code")
  ) {
    message = null;
  }

  return message || null;
};

/**
 * Normalises specific backend messages to be more user-friendly.
 */
const normaliseMessage = (msg, fallback = "An unexpected error occurred.") => {
  if (!msg) return fallback;
  if (msg.trim() === "Please verify your email before logging in") {
    return "Please verify your email before logging in. Try signing up again to receive a verification mail.";
  }
  return msg;
};

/**
 * Checks the KYC level for a provider and returns a status string.
 * Does NOT perform a second login — token is already stored by the time this runs.
 */
const getProviderKycStatus = async (email) => {
  try {
    const { data } = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/provider/kyc-level`,
      { email },
    );

    // Persist token if the KYC endpoint returns a fresher one
    const token = data?.token || data?.data?.token || data?.accessToken;
    if (token) localStorage.setItem("token", token);

    const kycCompleted = data?.kycCompleted ?? data?.data?.kycCompleted;

    // Completion is authoritative. A completed provider must not be sent back
    // to onboarding merely because its historic KYC level is below 5.
    if (kycCompleted) return "done";

    if (data?.message === "This is a new customer") {
      localStorage.setItem("kycLevel", "0");
      localStorage.setItem("email", email);
      return "incomplete";
    }

    const level = data?.kycLevel ?? data?.data?.kycLevel ?? data?.level;
    if (level !== undefined && level !== null) {
      // The level is kept only to resume an incomplete onboarding form; it
      // never determines whether the provider is considered complete.
      localStorage.setItem("kycLevel", String(level));
      localStorage.setItem("email", email);
    }

    return "incomplete";
  } catch {
    // KYC lookup failure should not block login
  }

  return "done";
};

// Service details completes onboarding at level 4; anything below still has a
// step to finish. Completion is authoritative regardless of level.
const BUSINESS_ONBOARDING_COMPLETE_LEVEL = 4;

// The login response already carries the business owner's KYC progress, so use
// it directly instead of a second lookup. Returns null when the response did
// not include progress, so the caller can fall back to the endpoint.
const businessKycStatusFromLogin = (email, kycLevel, kycCompleted) => {
  if (kycCompleted) return "done";

  if (kycLevel === undefined || kycLevel === null) return null;
  const level = Number(kycLevel);
  if (Number.isNaN(level)) return null;

  if (level < BUSINESS_ONBOARDING_COMPLETE_LEVEL) {
    localStorage.setItem("kycLevel", String(level));
    localStorage.setItem("email", email);
    return "incomplete";
  }

  return "done";
};

const getBusinessKycStatus = async (email) => {
  try {
    const { data } = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/businesses/kyc-level`,
      { email },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );

    const token = data?.token || data?.data?.token || data?.accessToken;
    if (token) {
      localStorage.setItem("token", token);
      useAuthStore.getState().setToken(token);
    }

    const message = String(data?.message || "").toLowerCase();
    const isNewBusiness =
      message.includes("new customer") || message.includes("new business");
    const rawLevel = data?.kycLevel ?? data?.data?.kycLevel ?? data?.level;
    const level = Number(rawLevel);

    if (isNewBusiness) {
      localStorage.setItem("kycLevel", "0");
      localStorage.setItem("email", email);
      return "incomplete";
    }

    // Service details completes level 4; level 3 still needs that setup step.
    if (level < 4) {
      localStorage.setItem("kycLevel", String(level));
      localStorage.setItem("email", email);
      return "incomplete";
    }
  } catch {
    // KYC lookup failure should not block login.
  }

  return "done";
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const navigate = useNavigate();

  const clearMessages = () => {
    setSuccessMessage("");
    setErrorMessage("");
  };

  /**
   * Shared post-login flow: store user, register FCM, navigate by role.
   */
  const finaliseLogin = async ({
    role,
    email,
    token,
    message,
    kycLevel,
    kycCompleted,
  }) => {
    if (message) setSuccessMessage(message);

    // Store token (login/googleLogin already do this, but be explicit)
    if (token) {
      localStorage.setItem("token", token);
      useAuthStore.getState().setToken(token);
    }

    // Fetch & store full user profile (best-effort — must not block
    // navigation if this account type isn't in the /users lookup yet)
    let fullUser = null;
    try {
      fullUser = await getUserByEmail(email);
      useAuthStore.getState().setUser(fullUser);
    } catch (err) {
      console.warn("Could not fetch full user profile:", err.message);
    }
    const userRole =
      role ||
      fullUser?.role ||
      fullUser?.data?.role ||
      fullUser?.user?.role ||
      fullUser?.data?.user?.role;

    // Non-blocking FCM registration
    registerFCM(); // intentionally NOT awaited — fire and forget

    if (userRole === "buyer") {
      setRedirecting(true);
      navigate("/dashboard", { replace: true });
      return;
    }

    if (userRole === "business" || userRole === "businessOwner") {
      const kycStatus =
        businessKycStatusFromLogin(email, kycLevel, kycCompleted) ??
        (await getBusinessKycStatus(email));

      if (kycStatus === "incomplete") {
        // Restore the saved business category so onboarding resumes on the
        // correct setup screen (Beauty vs. Transport) even on a fresh device.
        try {
          const profile = await getBusinessProfile();
          if (profile?.businessCategory) {
            localStorage.setItem("businessCategory", profile.businessCategory);
          }
        } catch (err) {
          console.warn("Could not load business category:", err.message);
        }

        setRedirecting(true);
        setErrorMessage(
          "You are yet to complete your onboarding process. You will be redirected to where you stopped...",
        );
        setTimeout(() => navigate("/business-provider/signup"), 2000);
        return;
      }

      setRedirecting(true);
      navigate("/business-provider/dashboard", { replace: true });
      return;
    }

    if (userRole === "provider") {
      const kycStatus = await getProviderKycStatus(email);

      if (kycStatus === "incomplete") {
        setRedirecting(true);
        setErrorMessage(
          "You are yet to complete your onboarding process. You will be redirected to where you stopped...",
        );
        setTimeout(() => navigate("/service-provider/signup"), 2000);
        return;
      }

      setRedirecting(true);
      navigate("/dashboard/provider", { replace: true });
    }
  };

  // ── Email / password login ─────────────────────────────────────────────────
  const handleLogin = async (values, { setSubmitting }) => {
    clearMessages();
    setLoading(true);

    const email = values.email.trim().toLowerCase();

    try {
      const res = await login({ email, password: values.password });

      if (!res?.token) {
        setErrorMessage("Login failed. Please try again.");
        return;
      }

      await finaliseLogin({
        role: res.role,
        email: res.email || email,
        token: res.token,
        message: res.message,
        kycLevel: res.user?.kycLevel ?? res.kycLevel,
        kycCompleted: res.user?.kycCompleted ?? res.kycCompleted,
      });
    } catch (error) {
      console.error("Login error:", error);

      if (error.request && !error.response) {
        setErrorMessage(
          "No response from server. Please check your connection.",
        );
      } else {
        const raw = extractErrorMessage(error);
        setErrorMessage(normaliseMessage(raw, "Login failed. Try again."));
      }
    } finally {
      // Always reset loading — this was the primary bug causing infinite loading
      setLoading(false);
      setSubmitting(false);
    }
  };

  // ── Google login ───────────────────────────────────────────────────────────
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      clearMessages();
      setGoogleLoading(true);

      try {
        const data = await googleLogin(tokenResponse.access_token);

        if (!data?.token) {
          const msg =
            typeof data === "string"
              ? data
              : data?.message || data?.error || data?.error?.message;
          setErrorMessage(normaliseMessage(msg, "Google login failed."));
          return;
        }

        const email =
          data.user?.email || data.email || data.newUser?.email || "";

        await finaliseLogin({
          role: data.user?.role,
          email,
          token: data.token,
          kycLevel: data.user?.kycLevel ?? data.kycLevel,
          kycCompleted: data.user?.kycCompleted ?? data.kycCompleted,
        });
      } catch (err) {
        console.error("Google login error:", err);
        const raw = extractErrorMessage(err);
        setErrorMessage(normaliseMessage(raw, "Google login failed."));
      } finally {
        setGoogleLoading(false);
      }
    },

    onError: (err) => {
      setGoogleLoading(false);
      setErrorMessage(err.message || "Google login failed.");
    },
  });

  if (googleLoading || loading || redirecting) {
    return <Loader />;
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="h-screen">
      <LoginNavbar />
      <AuthLayout
        title="Welcome Back!"
        description="Log in with your detail to keep exploring our platform"
      >
        <MotionDiv
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
            initialValues={{ email: "", password: "" }}
            onSubmit={handleLogin}
            validationSchema={LoginSchema}
          >
            {({ values, handleChange, handleBlur, handleSubmit }) => {
              const handleFieldChange = (e) => {
                if (errorMessage) setErrorMessage("");
                handleChange(e);
              };

              return (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  {/* Email */}
                  <div>
                    <InputField
                      name="email"
                      label="Email"
                      placeholder="Enter your email"
                      value={values.email}
                      onChange={handleFieldChange}
                      onBlur={handleBlur}
                    />
                    <ErrorMessage
                      name="email"
                      component="span"
                      className="text-[#db3a3a]"
                    />
                  </div>

                  {/* Password */}
                  <div className="relative">
                    <InputField
                      name="password"
                      label="Password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={values.password}
                      onChange={handleFieldChange}
                      onBlur={handleBlur}
                    />
                    <ErrorMessage
                      name="password"
                      component="span"
                      className="text-[#db3a3a]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      className="absolute top-11 right-3"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? <BsEye /> : <BsEyeSlash />}
                    </button>
                  </div>

                  {/* Feedback messages */}
                  {errorMessage && (
                    <p className="text-center text-[#db3a3a] mt-2">
                      {errorMessage}
                    </p>
                  )}
                  {successMessage && (
                    <p className="text-center text-[#005823BF] mt-2">
                      {successMessage}
                    </p>
                  )}

                  {/* Forgot password */}
                  <div className="flex justify-end mb-5">
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="font-semibold text-[14px] hover:text-[#005823BF] hover:underline cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  {/* Submit */}
                  <Button type="submit" disabled={loading}>
                    {loading ? "Loading..." : "Log In"}
                  </Button>

                  {/* Divider */}
                  <div className="flex items-center my-4">
                    <div className="flex-grow border-t border-gray-300" />
                    <span className="mx-2 text-gray-500">or</span>
                    <div className="flex-grow border-t border-gray-300" />
                  </div>

                  {/* Google */}
                  <button
                    type="button"
                    onClick={() => handleGoogleLogin()}
                    disabled={googleLoading}
                    className="w-full border border-gray-300 rounded-lg py-3 flex items-center justify-center gap-3 hover:bg-gray-50 transition"
                  >
                    <img src="/Google.svg" alt="Google" className="w-5 h-5" />
                    <span className="text-gray-700 font-medium">
                      {googleLoading ? "Logging in..." : "Continue with Google"}
                    </span>
                  </button>

                  <p className="text-center mb-5 text-sm mt-4">
                    Don&apos;t have an account yet?
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
              );
            }}
          </Formik>
        </MotionDiv>
      </AuthLayout>

      <ForgotPassword
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
        accountType="auto"
      />
    </div>
  );
}
