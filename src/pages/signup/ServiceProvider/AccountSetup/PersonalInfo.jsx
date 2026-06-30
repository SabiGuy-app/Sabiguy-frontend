import AccountSetupLayout from "./layout";
import Button from "../../../../components/button";
import InputField from "../../../../components/InputField";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Formik, ErrorMessage } from "formik";
import { PersonalInfoSchema } from "../schema";
import CoverageRadius from "../../../../components/Coverage";
import axios from "axios";
import { trackEvent } from "../../../../services/analytics";
import { IoIosArrowBack } from "react-icons/io";
import { LuUpload, LuFileCheck, LuX } from "react-icons/lu";

export default function PersonalInfoForm({ onBack, onNext }) {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [uploadingNin, setUploadingNin] = useState(false);
  const fileInputRef = useRef(null);

  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email");

  const uploadNinSlip = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/file/${email}/identity_docs`,
      formData,  
      {
        headers: {
          "Content-Type": "multipart/form-data",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      },
    );

    return response.data.file.url;
  };

  const handleNinUpload = async (file, setFieldValue) => {
    if (!file) return;

    const allowed = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
    if (!allowed.includes(file.type)) {
      setErrorMessage("Only JPG, PNG, or PDF files are accepted.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("File must be under 5MB.");
      return;
    }

    setUploadingNin(true);
    setErrorMessage("");
    try {
      const url = await uploadNinSlip(file);
      // console.log("Uploaded URL:", url);
      // console.log("URL type:", typeof url);
      // console.log("URL length:", url?.length);

      setFieldValue("ninSlip", url);

      setTimeout(() => {
        setFieldValue("ninSlipFile", file);
      }, 100);
    } catch (err) {
      console.error("NIN upload error:", err);
      setErrorMessage(
        err.response?.data?.message ||
          "Failed to upload NIN slip. Please try again.",
      );
    } finally {
      setUploadingNin(false);
    }
  };

  const handleSubmit = async (values) => {
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
          ninSlip: values.ninSlip,
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
        onNext(values);
      } else {
        setErrorMessage("Failed to save your details. Please try again.");
      }
    } catch (error) {
      console.error("PersonalInfo submit error:", error);
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
    <AccountSetupLayout currentStep={1}>
      <motion.div
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
              gender: "",
              city: "",
              address: "",
              ninSlip: "",
              ninSlipFile: null,
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
              dirty,
            }) => {
              console.log("Form State:", {
                values,
                isValid,
                ninSlipValue: values.ninSlip,
                ninSlipFile: values.ninSlipFile,
              });

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
                      NIN Slip
                    </label>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/jpg,application/pdf"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleNinUpload(file, setFieldValue);
                      }}
                    />

                    {!values.ninSlipFile ? (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingNin}
                        className="w-full flex items-center justify-center gap-2 border-[1.5px] border-dashed border-gray-300 rounded-xl p-5 text-gray-500 hover:border-[#1D9E75] hover:text-[#1D9E75] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed bg-gray-50"
                      >
                        <LuUpload size={18} />
                        <span className="text-sm">
                          {uploadingNin
                            ? "Uploading..."
                            : "Click to upload NIN slip"}
                        </span>
                        <span className="text-xs text-gray-400 ml-1">
                          (JPG, PNG or PDF · max 5MB)
                        </span>
                      </button>
                    ) : (
                      <div className="flex items-center justify-between border border-[#1D9E75] bg-[#f0faf6] rounded-xl px-4 py-3">
                        <div className="flex items-center gap-2 text-[#1D9E75]">
                          <LuFileCheck size={18} />
                          <span className="text-sm font-medium truncate max-w-[220px]">
                            {values.ninSlipFile.name}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setFieldValue("ninSlip", "");
                            setFieldValue("ninSlipFile", null);
                            if (fileInputRef.current)
                              fileInputRef.current.value = "";
                          }}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <LuX size={16} />
                        </button>
                      </div>
                    )}

                    <ErrorMessage
                      name="ninSlip"
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
                      disabled={loading || !isValid}
                      className="p-3 rounded-md text-white bg-[#005823BF] hover:bg-[#005823] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? "Saving..." : "Save & Continue"}
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
      </motion.div>
    </AccountSetupLayout>
  );
}
