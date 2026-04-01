import AccountSetupLayout from "./layout";
import Button from "../../../../components/button";
import InputField from "../../../../components/InputField";
import { useState } from "react";
import { motion } from "framer-motion";
import { Formik, ErrorMessage } from "formik";
import { PersonalInfoSchema } from "../schema";
import CoverageRadius from "../../../../components/Coverage";
import axios from "axios";

export default function PersonalInfoForm({ onNext }) {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (values) => {
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/provider`,
        {
          gender: values.gender,
          city: values.city,
          address: values.address,
        },
        token
          ? {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          : undefined
      );

      if (response.status === 200 || response.status === 201) {
        setSuccessMessage("Personal information saved successfully!");
        onNext(values);
      } else {
        setErrorMessage("Failed to save your details. Please try again.");
      }
    } catch (error) {
      console.error("PersonalInfo submit error:", error);
      if (error.response) {
        setErrorMessage(
          error.response.data?.message ||
            "Unable to save your details. Please try again."
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
      <motion.div
        key="step-one"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.3 }}
      >
        <div>
          <h2 className="text-xl font-semibold mb-2">Basic Information</h2>
          <p className="text-gray-500 mb-6">
            Let’s know who you are, tell us a bit about yourself
          </p>

          <Formik
            initialValues={{
              gender: "",
              city: "",
              address: "",
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
            }) => (

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
  onChange={(option) => setFieldValue("gender", option.value)}
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
                    disabled={loading || !isValid || !dirty}
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
        )}
        </Formik>
      </div>
      </motion.div>
    </AccountSetupLayout>
  );
}
