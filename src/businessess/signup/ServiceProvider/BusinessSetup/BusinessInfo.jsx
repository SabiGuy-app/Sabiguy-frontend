import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { CheckCircle2 } from "lucide-react";
import Button from "../../../../components/button";
import InputField from "../../../../components/InputField";
import BusinessSetupLayout from "../BusinessSetupLayout";

const BUSINESS_DETAILS_ENDPOINT = "/businesses/business-details";

export default function BusinessInfo({ onNext, onBack }) {
  const [form, setForm] = useState({
    businessName: "",
    address: "",
    city: "",
    nin: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [verifyingNin, setVerifyingNin] = useState(false);
  const [ninVerified, setNinVerified] = useState(false);
  const [ninError, setNinError] = useState("");
  const ninVerificationRef = useRef(null);

  useEffect(
    () => () => {
      const controller = ninVerificationRef.current;
      ninVerificationRef.current = null;
      controller?.abort();
    },
    [],
  );

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors((er) => ({ ...er, [field]: undefined }));
  };

  const handleNinChange = (event) => {
    const nin = event.target.value.replace(/\D/g, "").slice(0, 11);
    if (nin === form.nin) return;

    ninVerificationRef.current?.abort();
    ninVerificationRef.current = null;
    setVerifyingNin(false);
    setNinVerified(false);
    setNinError("");
    setErrors((previous) => ({ ...previous, nin: undefined }));
    setForm((previous) => ({ ...previous, nin }));

    if (nin.length !== 11) return;

    const controller = new AbortController();
    ninVerificationRef.current = controller;
    setVerifyingNin(true);
    const token = localStorage.getItem("token");

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
          setNinError("");
          return;
        }

        setNinError(responseData?.message || "Unable to verify your NIN.");
      })
      .catch((error) => {
        if (controller.signal.aborted) return;
        console.error(
          "Business NIN verification failed:",
          error.response?.status || error.message,
        );
        setNinError(
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

  const canContinue = Boolean(
    form.businessName.trim() &&
      form.address.trim() &&
      form.city.trim() &&
      form.nin.length === 11 &&
      ninVerified,
  );

  const validate = () => {
    const next = {};
    if (!form.businessName.trim())
      next.businessName = "Business name is required";
    if (!form.address.trim()) next.address = "Business address is required";
    if (!form.city.trim()) next.city = "City of operation is required";
    if (form.nin.length !== 11)
      next.nin = "Please enter your 11-digit NIN";
    else if (!ninVerified) next.nin = "Please verify your NIN";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (verifyingNin || !ninVerified) {
      setNinError("Please enter and verify your 11-digit NIN.");
      return;
    }

    if (!validate()) return;

    if (typeof onNext !== "function") {
      console.error(
        "BusinessInfo: `onNext` prop is missing or not a function. " +
          "Check that the parent component passes onNext={...} to <BusinessInfo />.",
      );
      setErrorMessage("Something went wrong moving to the next step.");
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setErrorMessage(
          "Your session has expired. Please sign in again and continue onboarding.",
        );
        return;
      }

      const payload = {
        businessName: form.businessName.trim(),
        businessAddress: form.address.trim(),
        cityOfOperation: form.city.trim(),
        nin: form.nin,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}${BUSINESS_DETAILS_ENDPOINT}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 200 || response.status === 201) {
        setSuccessMessage("Business information saved successfully!");
        onNext({
          businessName: form.businessName,
          address: form.address,
          city: form.city,
          nin: form.nin,
          ninVerified: true,
          businessDetails: response.data,
        });
      } else {
        setErrorMessage("Something went wrong");
      }
    } catch (error) {
      console.error("BusinessInfo submit error:", error);
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
      setSubmitting(false);
    }
  };

  return (
    <BusinessSetupLayout currentStep={0}>
      <div className="text-[#231F20]">
        <div className="w-full max-w-lg">
          <h1 className="text-xl font-semibold text-gray-900 tracking-tight">
            Tell us about your business
          </h1>
          <p className="mt-1.5 text-base leading-relaxed text-[#231F20BF]">
            Provide accurate details about your company to help us verify your
            business and set up your account.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="mt-7 space-y-5"
          >
                <div>
                  <InputField
                    name="businessName"
                    label="Business Name"
                    placeholder="e.g Adewale Services"
                    value={form.businessName}
                    onChange={handleChange("businessName")}
                  />
                  {errors.businessName && (
                    <p className="mt-1.5 text-sm text-red-600">
                      {errors.businessName}
                    </p>
                  )}
                </div>

                <div>
                  <InputField
                    name="address"
                    label="Business Address"
                    placeholder="Address"
                    value={form.address}
                    onChange={handleChange("address")}
                  />
                  {errors.address && (
                    <p className="mt-1.5 text-sm text-red-600">
                      {errors.address}
                    </p>
                  )}
                </div>

                <div>
                  <InputField
                    name="city"
                    label="City of operation"
                    placeholder="Ibadan"
                    value={form.city}
                    onChange={handleChange("city")}
                  />
                  {errors.city && (
                    <p className="mt-1.5 text-sm text-red-600">
                      {errors.city}
                    </p>
                  )}
                </div>

                <div>
                  <InputField
                    name="nin"
                    label="NIN"
                    placeholder="Enter your 11-digit NIN"
                    value={form.nin}
                    onChange={handleNinChange}
                    inputMode="numeric"
                    autoComplete="off"
                    maxLength={11}
                  />
                  {verifyingNin && (
                    <p className="mt-1.5 text-sm text-gray-500">
                      Verifying NIN...
                    </p>
                  )}
                  {ninVerified && form.nin.length === 11 && (
                    <p className="mt-1.5 flex items-center gap-1 text-sm text-green-600">
                      <CheckCircle2 size={16} aria-hidden="true" />
                      NIN verified
                    </p>
                  )}

                  {ninError && (
                    <p className="mt-1.5 text-sm text-red-600">
                      {ninError}
                    </p>
                  )}
                  {errors.nin && !ninError && (
                    <p className="mt-1.5 text-sm text-red-600">
                      {errors.nin}
                    </p>
                  )}
                </div>

                <div className="flex justify-end gap-4 pt-2">
                  <Button type="button" variant="ghost" onClick={onBack} disabled={submitting || verifyingNin}>Back</Button>
                  <Button type="submit" disabled={!canContinue || submitting || verifyingNin}>
                    {verifyingNin ? "Verifying NIN..." : submitting ? "Saving..." : "Save & Continue"}
                  </Button>
                </div>
          </form>

          {errorMessage && (
            <p className="mt-3 text-sm text-red-600">{errorMessage}</p>
          )}
          {successMessage && (
            <p className="mt-3 text-sm text-[#005823]">{successMessage}</p>
          )}
        </div>
      </div>
    </BusinessSetupLayout>
  );
}
