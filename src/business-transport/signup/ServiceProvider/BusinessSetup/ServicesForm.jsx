import { useState } from "react";
import BusinessSetupLayout from "../BusinessSetupLayout";
import { IoIosArrowBack } from "react-icons/io";

const SERVICES_BY_CATEGORY = {
  beauty: [
    { id: "barbing", label: "Barbing" },
    { id: "hair_dresser", label: "Hair Dresser" },
    { id: "spa", label: "Spa" },
    { id: "lash_tech", label: "Lash Tech." },
    { id: "pedicure", label: "Pedicure" },
    { id: "nails_tech", label: "Nails Tech." },
  ],
};

export default function ServicesForm({ onBack, onNext, businessCategory }) {
  const categoryId = "beauty";
  const availableServices = SERVICES_BY_CATEGORY[categoryId] || [];

  const [selected, setSelected] = useState([]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");


  const toggleService = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
    if (error) setError("");
  };

  const handleSubmit = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (selected.length === 0) {
      setError("Please select at least one service.");
      return;
    }

    setSubmitting(true);
    try {
      
      if (response.status === 200 || response.status === 201) {
        setSuccessMessage("Services saved successfully!");
        onNext({ services: selected });
      } else {
        setErrorMessage("Something went wrong");
      }
    } catch (error) {
      console.error("ServicesForm submit error:", error);
      if (error.response) {
        setErrorMessage(
          error.response.data?.message ||
            "Unable to save your services. Please try again.",
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
    <BusinessSetupLayout currentStep={2}>
      <div style={{ background: "#fff", minHeight: "100vh" }}>
        <div className="w-full max-w-lg px-5 py-8">
          <h1 className="text-[20px] font-semibold text-[#231F20]">
            Services
          </h1>
          <p className="mt-1.5 text-[16px] leading-snug text-[#231F20BF]">
            We just need a few documents to confirm your business details and
            get you set up on SabiGuy.
          </p>

          <div className="mt-6">
            <label className="block text-[15px] font-medium text-[#231F20] mb-2">
              Business category
            </label>
            <div className="w-full rounded-lg bg-gray-100 px-4 py-3.5 text-[14px] text-gray-700">
              {businessCategory || "Beauty & Personal Care"}
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-[15px] font-medium text-[#231F20] mb-1">
              Services you provide
            </label>
            <p className="mb-3 text-[13px] leading-snug text-[#231F20BF]">
              Choose all the services your business offers. You can select
              more than one.
            </p>

            <div className="flex flex-wrap gap-2">
              {availableServices.map((service) => {
                const isSelected = selected.includes(service.id);
                return (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => toggleService(service.id)}
                    aria-pressed={isSelected}
                    className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-medium transition-colors ${
                      isSelected
                        ? "bg-[#005823] text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        isSelected ? "bg-white" : "bg-gray-400"
                      }`}
                    />
                    {service.label}
                  </button>
                );
              })}
            </div>

            {error && <p className="mt-2 text-[12px] text-red-600">{error}</p>}
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <button
              type="button"
              onClick={onBack}
              className="rounded-md border border-gray-200 px-6 py-3 text-[14px] font-medium text-gray-600 hover:bg-gray-50 transition-all duration-200"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="rounded-md bg-[#005823BF] px-6 py-3 text-[14px] font-medium text-white hover:bg-[#005823] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Saving..." : "Save & Continue"}
            </button>
          </div>

          {errorMessage && (
            <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
          )}
          {successMessage && (
            <p className="text-green-600 text-sm mt-2">{successMessage}</p>
          )}
        </div>
      </div>
    </BusinessSetupLayout>
  );
}