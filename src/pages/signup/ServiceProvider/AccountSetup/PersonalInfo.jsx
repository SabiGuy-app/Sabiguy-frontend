import AccountSetupLayout from "./layout";
import Button from "../../../../components/button";
import InputField from "../../../../components/InputField";
import { useState } from "react";
import { motion } from "framer-motion";
import { Formik, ErrorMessage } from "formik";
import { PersonalInfoSchema } from "../schema";

export default function PersonalInfoForm({ onNext }) {
  const handleSubmit = async (values) => {
    onNext(values);
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
            {({ values, handleChange, handleBlur, handleSubmit, setFieldValue}) => (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <InputField
                    name="gender"
                    label="Gender"
                    select
                    options={[
                      { label: "Select gender", value: "" },
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

                <div className="flex justify-end mt-4">
                  <button
                    type="submit"
                    className="p-3 rounded-md text-white bg-[#005823BF] hover:bg-[#005823] transition-all duration-200"
                  >
                    Save & Continue
                  </button>
                </div>
              </form>
        )}
        </Formik>
      </div>
      </motion.div>
    </AccountSetupLayout>
  );
}