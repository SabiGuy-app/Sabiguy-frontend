import AccountSetupLayout from "./layout";
import { useState } from "react";
import InputField from "../../../../components/InputField";
import { ErrorMessage, Formik } from "formik";
import * as Yup from "yup";
import { IoIosArrowBack, IoIosAdd } from "react-icons/io";
import axios from "axios";
import { trackEvent } from "../../../../services/analytics";
import individual from "../../../../../public/individual.png";
import business from "../../../../../public/business.png";

export default function AccountTypeForm({ onNext, onBack }) {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (values) => {
    setLoading(true);
    setErrorMessage("");
    console.log("AccountType submit values:", values);

    const token = localStorage.getItem("token");

    try {
      const accountType = values.accountType;
      let cacUrl = "";

      if (values.cacFile) {
        const email = localStorage.getItem("email");
        const google_email = localStorage.getItem("google-email");
        const uploadEndpoint = `${import.meta.env.VITE_BASE_URL}/file/${email || google_email}/certificates`;

        const cacForm = new FormData();
        cacForm.append("file", values.cacFile);

        const cacUpload = await axios.post(uploadEndpoint, cacForm, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });

        cacUrl = cacUpload.data.file?.url || "";
      }

      const businessPayload = {
        accountType,
        businessName: values.businessName,
        cacNumber: values.cacNumber,
        businessAddress: values.businessAddress,
        cacFile: cacUrl,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/provider/business`,
        businessPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 200 || response.status === 201) {
        trackEvent("kyc_step_completed", {
          role: "provider",
          step: "account_type",
          account_type: accountType,
        });
        setSuccessMessage("");
        onNext();
      } else {
        setErrorMessage(response.data?.message || "Something went wrong");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      trackEvent("kyc_step_failed", {
        role: "provider",
        step: "account_type",
        status: error?.response?.status,
      });
      if (error.response) {
        setErrorMessage(error.response.data?.message || "An error occurred");
      } else if (error.request) {
        setErrorMessage("No response from the server. Please try again later.");
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const AccountTypeSchema = Yup.object().shape({
    accountType: Yup.string().required("Please select an account type"),
    businessName: Yup.string(),
    cacNumber: Yup.string(),
    businessAddress: Yup.string(),
    cacFile: Yup.mixed()
      .nullable()
      .test(
        "fileType",
        "Only PDF, JPEG, or PNG files are allowed",
        (value) =>
          !value ||
          ["application/pdf", "image/jpeg", "image/png"].includes(value.type),
      ),
  });

  return (
    <AccountSetupLayout currentStep={0}>
      <div className="mt-4">
        {/* <div
          onClick={onBack}
          className="flex items-center gap-2 w-fit mb-8 cursor-pointer"
        >
          <IoIosArrowBack size={24} />
          <h2 className="text-lg">Back</h2>
        </div> */}
        <h2 className="text-xl font-semibold mb-2">Account Type</h2>
        <p className="text-gray-500 mb-6">
          We require this to make your profile setup easier{" "}
        </p>
        <Formik
          initialValues={{
            accountType: "",
            businessName: "",
            cacNumber: "",
            businessAddress: "",
            cacFile: null,
          }}
          validationSchema={AccountTypeSchema}
          onSubmit={(values, { setSubmitting }) => {
            handleSubmit(values);
            setSubmitting(false);
          }}
        >
          {({
            values,
            setFieldValue,
            setFieldTouched,
            handleChange,
            handleBlur,
            handleSubmit,
            validateForm,
            errors,
            touched,
          }) => {
            const accountType = values.accountType;
            const businessOk =
              !!values.businessName &&
              !!values.cacNumber &&
              !!values.businessAddress &&
              !!values.cacFile;

            const isFormComplete =
              accountType === "Individual"
                ? true
                : accountType === "Business"
                  ? businessOk
                  : false;

            return (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-3">
                  {[
                    {
                      value: "Individual",
                      icon: individual,
                      title: "Individual",
                      desc: "Ideal for freelancers and independent professionals looking to offer services and manage client bookings.",
                    },
                    {
                      value: "Business",
                      icon: business,
                      title: "Business",
                      desc: "For companies, agencies, and service teams managing multiple providers, jobs, and business operations from one account.",
                    },
                  ].map(({ value, icon, title, desc }) => {
                    const isSelected = values.accountType === value;
                    return (
                      <div
                        key={value}
                        onClick={() => {
                          setFieldValue("accountType", value, true);
                          setFieldTouched("accountType", true, false);
                        }}
                        className={`flex items-center gap-3.5 p-4 rounded-[8px] cursor-pointer bg-white border-[1px] transition-colors ${
                          isSelected ? "border-[#005823]" : "border-[#231F2026]"
                        }`}
                      >
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                          <img src={icon} alt="" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-[15px] mb-1 text-gray-900">
                            {title}
                          </p>
                          <p className="text-[13px] text-gray-500 leading-relaxed m-0">
                            {desc}
                          </p>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full shrink-0 border-[1.5px] flex items-center justify-center transition-colors ${
                            isSelected
                              ? "border-[#1D9E75] bg-[#1D9E75]"
                              : "border-gray-300 bg-transparent"
                          }`}
                        >
                          {isSelected && (
                            <div className="w-2 h-2 rounded-full bg-white" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                {touched.accountType && errors.accountType && (
                  <span className="text-red-500 text-sm">
                    {errors.accountType}
                  </span>
                )}

                {values.accountType === "Business" && (
                  <div className="flex flex-col gap-4 mt-4">
                    <p className="font-semibold text-gray-700">
                      Upload required document
                    </p>

                    <InputField
                      name="businessName"
                      label="Registered Business Name"
                      placeholder="Enter the exact name on your CAC certificate"
                      value={values.businessName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <ErrorMessage
                      name="businessName"
                      component="span"
                      className="text-red-500 text-sm"
                    />

                    <InputField
                      name="cacNumber"
                      label="CAC Registration Number"
                      placeholder="e.g BN1234567"
                      italicPlaceholder
                      value={values.cacNumber}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <ErrorMessage
                      name="cacNumber"
                      component="span"
                      className="text-red-500 text-sm"
                    />

                    <InputField
                      name="businessAddress"
                      label="Business Address"
                      placeholder="Address"
                      value={values.businessAddress}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <ErrorMessage
                      name="businessAddress"
                      component="span"
                      className="text-red-500 text-sm"
                    />

                    <div>
                      <p className="font-medium text-gray-700 mb-2">
                        CAC Certificate
                      </p>
                      <p className="text-sm text-gray-500 mb-3">
                        Kindly upload a picture of your CAC certificate (make
                        sure all details are readable). Accepted formats are
                        PDF, JPEG & PNG. Maximum file size is 10MB.
                      </p>

                      {/* Hidden file input */}
                      <input
                        id="cacFile"
                        type="file"
                        accept=".pdf,.jpeg,.jpg,.png"
                        onChange={(e) => {
                          setFieldValue("cacFile", e.target.files[0]);
                          setFieldTouched("cacFile", true, true);
                        }}
                        className="hidden"
                      />

                      {/* Custom styled upload button */}
                      <label
                        htmlFor="cacFile"
                        className="flex items-center justify-center gap-1 rounded-3xl px-4 py-2 bg-gray-100 hover:bg-gray-200 transition-colors font-semibold cursor-pointer"
                      >
                        <IoIosAdd size={30} />
                        Upload File
                      </label>
                      {values.cacFile && (
                        <p className="text-sm text-gray-600 mt-2">
                          {values.cacFile.name}
                        </p>
                      )}
                      {touched.cacFile && errors.cacFile && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.cacFile}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex justify-end mt-4">
                  <button
                    type="submit"
                    disabled={loading || !isFormComplete}
                    onClick={async () => {
                      const validationErrors = await validateForm();
                      console.log("AccountType validation:", {
                        values,
                        validationErrors,
                      });
                    }}
                    className="p-3 rounded-md text-white bg-[#005823] disabled:opacity-50 disabled:cursor-not-allowed"
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
    </AccountSetupLayout>
  );
}
