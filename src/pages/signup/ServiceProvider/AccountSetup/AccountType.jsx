import AccountSetupLayout from "./layout";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { trackEvent } from "../../../../services/analytics";
import individual from "../../../../../public/individual.png";
import business from "../../../../../public/business.png";

const ACCOUNT_TYPE_PAYLOAD = {
  Individual: "personal",
  Business: "business",
};

export default function AccountTypeForm({ onNext, onBack }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (values) => {
    setLoading(true);
    setErrorMessage("");

    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/provider/account-type`,
        { accountType: ACCOUNT_TYPE_PAYLOAD[values.accountType] },
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
          account_type: values.accountType,
        });
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
  });

  return (
    <AccountSetupLayout currentStep={0}>
      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-2">Account Type</h2>
        <p className="text-gray-500 mb-6">
          We require this to make your profile setup easier{" "}
        </p>
        <Formik
          initialValues={{ accountType: "" }}
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
            handleSubmit,
            errors,
            touched,
          }) => (
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
                        if (value === "Business") {
                          navigate("/business-provider/signup");
                          return;
                        }
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

              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  disabled={loading || !values.accountType}
                  className="p-3 rounded-md text-white bg-[#005823] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Saving..." : "Save & Continue"}
                </button>
              </div>

              {errorMessage && (
                <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
              )}
            </form>
          )}
        </Formik>
      </div>
    </AccountSetupLayout>
  );
}
