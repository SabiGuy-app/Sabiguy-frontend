import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import AccountSetupLayout from "./layout";
import InputField from "../../../../components/InputField";
import { IoIosArrowBack } from "react-icons/io";


// remove alert
export default function BankAccountForm({ onBack, onNext }) {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const formik = useFormik({
    initialValues: {
      bankName: "",
      accountNumber: "",
      accountName: "",
    },
    validationSchema: Yup.object({
      bankName: Yup.string().required("Bank name is required"),
      accountNumber: Yup.string()
        .matches(/^\d{10}$/, "Enter a valid 10-digit account number")
        .required("Account number is required"),
      accountName: Yup.string().required("Account name is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");
      try {
        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/provider/bank-info`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(values),
        });

        const data = await res.json();
        if (data.success) {
          setSuccessMessage("Account info updated successfully!");
          onNext?.();
        } else {
          setErrorMessage(data.message || "Failed to update account info");
        }
      } catch (err) {
        console.error("Bank info update failed:", err);
        setErrorMessage("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <AccountSetupLayout currentStep={3}>
      <div>
        {/* Back button */}
        <div
          onClick={onBack}
          className="flex items-center gap-2 w-fit mb-8 cursor-pointer"
        >
          <IoIosArrowBack size={24} />
          <h2 className="text-lg">Back</h2>
        </div>

        <h2 className="text-xl font-semibold mb-2">
          What bank account do you want to withdraw funds to?
        </h2>

        {/* Form */}
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
          {/* Bank Name */}
          <InputField
            name="bankName"
            label="Bank"
            select
            options={[
              { label: "Select Bank", value: "" },
              { label: "UBA", value: "UBA" },
              { label: "GTB", value: "GTB" },
              { label: "OPAY", value: "OPAY" },
            ]}
            value={formik.values.bankName}
            onChange={(option) => formik.setFieldValue("bankName", option.value)}
            onBlur={formik.handleBlur}
          />
          {formik.touched.bankName && formik.errors.bankName && (
            <p className="text-red-500 text-sm">{formik.errors.bankName}</p>
          )}

          {/* Account Number */}
          <InputField
            name="accountNumber"
            placeholder="Account Number"
            value={formik.values.accountNumber}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.accountNumber && formik.errors.accountNumber && (
            <p className="text-red-500 text-sm">{formik.errors.accountNumber}</p>
          )}

          {/* Account Name */}
          <InputField
            name="accountName"
            placeholder="Account Name"
            value={formik.values.accountName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.accountName && formik.errors.accountName && (
            <p className="text-red-500 text-sm">{formik.errors.accountName}</p>
          )}
{errorMessage && (
                  <div className="text-center text-[#db3a3a] mt-2">{errorMessage}</div>
                )}
                {successMessage && (
                  <div className="text-center text-[#005823BF] mt-2">{successMessage}</div>
                )}
          {/* Submit Button */}
          <div className="flex justify-end mt-6">
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 rounded-md text-white bg-[#005823BF] hover:bg-[#004e1a] transition ${
                loading && "opacity-70 cursor-not-allowed"
              }`}
            >
              {loading ? "Saving..." : "Save & Continue"}
            </button>
          </div>
        </form>
      </div>
    </AccountSetupLayout>
  );
}
