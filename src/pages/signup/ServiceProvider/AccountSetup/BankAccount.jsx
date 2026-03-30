import { useState, useEffect, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import AccountSetupLayout from "./layout";
import InputField from "../../../../components/InputField";
import { IoIosArrowBack } from "react-icons/io";

export default function BankAccountForm({ onBack, onNext }) {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [banks, setBanks] = useState([]);
  const [loadingBanks, setLoadingBanks] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [verifyingAccount, setVerifyingAccount] = useState(false);
  const verifyAbortRef = useRef(null);

  // Fetch banks on component mount
  useEffect(() => {
    fetchBanks();
  }, []);

  const fetchBanks = async () => {
    setLoadingBanks(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/payment/banks`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        // Extract only name and code from the response
        const bankList = data.data.map(bank => ({
          name: bank.name,
          code: bank.code
        }));
        setBanks(bankList);
      } else {
        setErrorMessage("Failed to fetch banks");
      }
    } catch (error) {
      console.error("Fetch banks error:", error);
      setErrorMessage("Failed to load banks. Please refresh.");
    } finally {
      setLoadingBanks(false);
    }
  };

  // Filter banks based on search query
  const filteredBanks = banks.filter(bank =>
    bank.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Verify account number when both bank and account number are provided
  const verifyAccountNumber = async (accountNumber, bankCode) => {
    if (!accountNumber || !bankCode || accountNumber.length !== 10) {
      formik.setFieldValue("accountName", "");
      return;
    }

    // Cancel any in-flight verification request
    if (verifyAbortRef.current) {
      verifyAbortRef.current.abort();
    }
    const controller = new AbortController();
    verifyAbortRef.current = controller;

    setVerifyingAccount(true);
    setErrorMessage("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/payment/verify-bank`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            accountNumber,
            bankCode
          }),
          signal: controller.signal,
        }
      );

      const data = await response.json();

      if (data.success) {
        const accountName = data.data?.accountName;

        if (accountName) {
          formik.setFieldValue("accountName", accountName);
        } else {
          setErrorMessage("Could not retrieve account name");
          formik.setFieldValue("accountName", "");
        }
      } else {
        setErrorMessage(data.message || "Could not verify account number");
        formik.setFieldValue("accountName", "");
      }
    } catch (error) {
      if (error.name === "AbortError") return;
      setErrorMessage("Failed to verify account number");
      formik.setFieldValue("accountName", "");
    } finally {
      setVerifyingAccount(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      accountNumber: "",
      accountName: "",
      bankName: "",
      bankCode: ""
    },
    validationSchema: Yup.object({
      bankName: Yup.string().required("Please select a bank"),
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
        console.log("Bank info payload:", {
          accountNumber: values.accountNumber,
          bankCode: values.bankCode,
          bankName: values.bankName,
          accountName: values.accountName,
        });
        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/provider/bank-info`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            accountNumber: values.accountNumber,
            bankCode: values.bankCode,
            bankName: values.bankName, 
            accountName: values.accountName
          }),
        });

        const data = await res.json();

        if (data.success) {
          setSuccessMessage("Bank account added successfully!");
          setTimeout(() => onNext?.(), 1500);
        } else {
          setErrorMessage(data.message || "Failed to add bank account");
        }
      } catch (err) {
        setErrorMessage("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    },
  });

  // Handle bank selection
  const handleBankSelect = (bank) => {
    formik.setFieldValue("bankName", bank.name);
    formik.setFieldValue("bankCode", bank.code);
    setSearchQuery(bank.name);
    setShowDropdown(false);

    // Verify account if account number already entered
    if (formik.values.accountNumber.length === 10) {
      verifyAccountNumber(formik.values.accountNumber, bank.code);
    }
  };

  // Handle account number change
  const handleAccountNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
    formik.setFieldValue("accountNumber", value);

    // Auto-verify when 10 digits entered and bank selected
    if (value.length === 10 && formik.values.bankCode) {
      verifyAccountNumber(value, formik.values.bankCode);
    } else if (value.length !== 10) {
      formik.setFieldValue("accountName", "");
    }
  };

  return (
    <AccountSetupLayout currentStep={5}>
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
          {/* Bank Name with Search */}
          <div className="relative">
            <label className="block text-sm font-medium mb-1">Bank</label>
            <input
              type="text"
              placeholder={loadingBanks ? "Loading banks..." : "Search for your bank"}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              onBlur={() => {
                // Delay to allow click on dropdown
                setTimeout(() => {
                  setShowDropdown(false);
                  formik.setFieldTouched("bankName", true);
                }, 200);
              }}
              disabled={loadingBanks}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#005823BF]"
            />

            {/* Dropdown */}
            {showDropdown && searchQuery && filteredBanks.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {filteredBanks.map((bank) => (
                  <div
                    key={bank.code}
                    onClick={() => handleBankSelect(bank)}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {bank.name}
                  </div>
                ))}
              </div>
            )}

            {showDropdown && searchQuery && filteredBanks.length === 0 && !loadingBanks && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg px-4 py-2 text-gray-500">
                No banks found
              </div>
            )}
          </div>
          {formik.touched.bankName && formik.errors.bankName && (
            <p className="text-red-500 text-sm">{formik.errors.bankName}</p>
          )}

          {/* Account Number */}
          <InputField
            name="accountNumber"
            label="Account Number"
            placeholder="Enter your 10-digit account number"
            value={formik.values.accountNumber}
            onChange={handleAccountNumberChange}
            onBlur={formik.handleBlur}
            disabled={!formik.values.bankCode}
          />
          {formik.touched.accountNumber && formik.errors.accountNumber && (
            <p className="text-red-500 text-sm">{formik.errors.accountNumber}</p>
          )}

          {/* Account Name (Auto-filled after verification) */}
          <div>
            <InputField
              name="accountName"
              label="Account Name"
              placeholder={verifyingAccount ? "Verifying account..." : "Account name will appear here"}
              value={formik.values.accountName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={true}
              className="bg-gray-50"
            />
            {verifyingAccount && (
              <p className="text-blue-500 text-sm mt-1">⏳ Verifying account number...</p>
            )}
            {formik.values.accountName && !verifyingAccount && (
              <p className="text-green-600 text-sm mt-1">✓ Account verified</p>
            )}
          </div>
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
              disabled={loading || verifyingAccount || !formik.values.accountName}
              className={`px-6 py-2 rounded-md text-white bg-[#005823BF] hover:bg-[#004e1a] transition ${(loading || verifyingAccount || !formik.values.accountName) && "opacity-70 cursor-not-allowed"
                }`}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </AccountSetupLayout>
  );
}
