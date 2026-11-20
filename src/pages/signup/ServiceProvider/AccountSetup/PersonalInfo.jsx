import AccountSetupLayout from "./layout";
import InputField from "../components/InputField";
import { useEffect, useRef, useState } from "react";
import { motion as Motion } from "framer-motion";
import { Formik, ErrorMessage } from "formik";
import { PersonalInfoSchema } from "../schema";
import axios from "axios";
import { trackEvent } from "../../../../services/analytics";
import { IoIosArrowBack } from "react-icons/io";
import { CheckCircle2 } from "lucide-react";

export default function PersonalInfoForm({ onBack, onNext, data = {} }) {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [verifyingNin, setVerifyingNin] = useState(false);
  const [ninVerified, setNinVerified] = useState(data.ninVerified === true);
  const [ninVerificationError, setNinVerificationError] = useState("");
  const ninVerificationRef = useRef(null);

  const token = localStorage.getItem("token");

  useEffect(
    () => () => {
      const controller = ninVerificationRef.current;
      ninVerificationRef.current = null;
      controller?.abort();
    },
    [],
  );

  const handleNinChange = (event, currentNin, setFieldValue) => {
    const nin = event.target.value.replace(/\D/g, "").slice(0, 11);
    if (nin === currentNin) return;

    ninVerificationRef.current?.abort();
    ninVerificationRef.current = null;
    setVerifyingNin(false);
    setNinVerified(false);
    setNinVerificationError("");
    setFieldValue("nin", nin);

    if (nin.length !== 11) return;

    const controller = new AbortController();
    ninVerificationRef.current = controller;
    setVerifyingNin(true);

    axios
      .post(
        `${import.meta.env.VITE_BASE_URL}/kyc/nin`,
        { nin },
        {
          signal: controller.signal,
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        },
      )
      .then(({ data: responseData }) => {
        if (controller.signal.aborted) return;

        if (
          responseData?.success === true &&
          responseData?.data?.ninVerified === true
        ) {
          setNinVerified(true);
          setNinVerificationError("");
          return;
        }

        setNinVerificationError(
          responseData?.message || "Unable to verify your NIN.",
        );
      })
      .catch((error) => {
        if (controller.signal.aborted) return;
        console.error(
          "NIN verification failed:",
          error.response?.status || error.message,
        );
        setNinVerificationError(
          error.response?.data?.message ||
            "Unable to verify your NIN. Please try again.",
        );
      })
      .finally(() => {
        if (ninVerificationRef.current === controller) {
          ninVerificationRef.current = null;
          setVerifyingNin(false);
        }
      });
  };

  const handleSubmit = async (values) => {
    if (verifyingNin || !ninVerified || values.nin.length !== 11) {
      setNinVerificationError("Please enter and verify your 11-digit NIN.");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    // const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/provider`,
        {
          gender: values.gender,
          city: values.city,
          address: values.address,
          nin: values.nin,
        },
        token
          ? {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          : undefined,
      );

      if (response.status === 200 || response.status === 201) {
        trackEvent("kyc_step_completed", {
          role: "provider",
          step: "personal_info",
        });
        setSuccessMessage("Personal information saved successfully!");
        onNext({ ...values, ninVerified: true });
      } else {
        setErrorMessage("Failed to save your details. Please try again.");
      }
    } catch (error) {
      console.error(
        "PersonalInfo submit failed:",
        error?.response?.status || error?.message,
      );
      trackEvent("kyc_step_failed", {
        role: "provider",
        step: "personal_info",
        status: error?.response?.status,
      });
      if (error.response) {
        setErrorMessage(
          error.response.data?.message ||
            "Unable to save your details. Please try again.",
        );
      } else if (error.request) {
        setErrorMessage("No response from the server. Please try again later.");
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AccountSetupLayout currentStep={0}>
      <Motion.div
        key="step-one"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.3 }}
      >
        <div
          onClick={onBack}
          className="flex items-center gap-2 w-fit mb-8 cursor-pointer"
        >
          <IoIosArrowBack size={24} />
          <h2 className="text-lg">Back</h2>
        </div>
        <div>
          <h2 className="text-[20px] text-[#231F20] font-semibold mb-2">
            Verify your Identity
          </h2>
          <p className="text-[#231F20BF] text-[16px] mb-6">
            Let's know who you are, tell us a bit about yourself
          </p>

          <Formik
            initialValues={{
              gender: data.gender || "",
              city: data.city || "",
              address: data.address || "",
              nin: data.nin || "",
            }}
            validationSchema={PersonalInfoSchema}
            onSubmit={handleSubmit}
          >
            {({
              values,
              handleChange,
              handleBlur,
              handleSubmit,
              setFieldValue,
              isValid,
            }) => {
              return (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div>
                    <InputField
                      name="gender"
                      label="Gender"
                      select
                      placeholder="Select gender"
                      options={[
                        { label: "Prefer not to say", value: "null" },
                        { label: "Male", value: "male" },
                        { label: "Female", value: "female" },
                      ]}
                      value={values.gender}
                      onChange={(option) =>
                        setFieldValue("gender", option.value)
                      }
                      onBlur={handleBlur}
                    />
                    <ErrorMessage
                      name="gender"
                      component="span"
                      className="text-[#db3a3a]"
                    />
                  </div>

                  <div>
                    <InputField
                      name="address"
                      label="Address"
                      placeholder="Your Address"
                      value={values.address}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <ErrorMessage
                      name="address"
                      component="span"
                      className="text-[#db3a3a]"
                    />
                  </div>

                  <div>
                    <InputField
                      name="city"
                      label="City of residence"
                      placeholder="Lagos"
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
                    <label className="block text-[16px] font-medium text-[#231F20] mb-1.5">
                      NIN
                    </label>
                    <input
                      name="nin"
                      type="text"
                      inputMode="numeric"
                      autoComplete="off"
                      maxLength={11}
                      placeholder="Enter your 11-digit NIN"
                      value={values.nin}
                      onChange={(event) =>
                        handleNinChange(event, values.nin, setFieldValue)
                      }
                      onBlur={handleBlur}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1D9E75] focus:border-transparent"
                    />
                    {verifyingNin && (
                      <p className="text-sm text-gray-500 mt-1">
                        Verifying NIN...
                      </p>
                    )}
                    {ninVerified && values.nin.length === 11 && (
                      <p className="flex items-center gap-1 text-sm text-green-600 mt-1">
                        <CheckCircle2 size={16} aria-hidden="true" />
                        NIN verified
                      </p>
                    )}
                    {ninVerificationError && (
                      <p className="text-red-500 text-sm mt-1">
                        {ninVerificationError}
                      </p>
                    )}

                    <ErrorMessage
                      name="nin"
                      component="span"
                      className="text-[#db3a3a] text-sm mt-1 block"
                    />
                  </div>
                  {/* <CoverageRadius
            initialRadius={values.radius}
            initialAllowOutside={values.allowAnywhere}
            onChange={(coverageData) => {
              setFieldValue('coverageRadius', coverageData);
            }}
          />                */}
                  <div className="flex justify-end mt-4">
                    <button
                      type="submit"
                      disabled={
                        loading || verifyingNin || !ninVerified || !isValid
                      }
                      className="p-3 rounded-md text-white bg-[#005823BF] hover:bg-[#005823] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {verifyingNin
                        ? "Verifying NIN..."
                        : loading
                          ? "Saving..."
                          : "Save & Continue"}
                    </button>
                  </div>
                  {errorMessage && (
                    <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
                  )}
                  {successMessage && (
                    <p className="text-green-600 text-sm mt-2">
                      {successMessage}
                    </p>
                  )}
                </form>
              );
            }}
          </Formik>
        </div>
      </Motion.div>
    </AccountSetupLayout>
  );
}
