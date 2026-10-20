import { useEffect, useState } from "react";
import { Formik } from "formik";
import { IoIosArrowBack } from "react-icons/io";
import AccountSetupLayout from "./layout";
// Same section layout used by BeautyAndPersonalCare.jsx.
import ProviderServicesSection from "./ProviderServicesSection";
// Preserve the compact Customer Address / Office location section used before.
import ServiceLocationFields from "../../../../components/onboarding/ServiceLocationFields";
import { saveProviderOnboardingServices, uploadProviderWorkVisual } from "../../../../api/providerOnboarding";
import { trackEvent } from "../../../../services/analytics";
import { buildProviderServiceDetails, getProviderServiceInitialValues, isProviderServiceComplete } from "./SkillsSection/providerServiceForm";

function SavedDraft({ values, draftKey }) {
  useEffect(() => {
    try { localStorage.setItem(draftKey, JSON.stringify({ individualForm: values })); }
    catch { /* Ignore storage quota and privacy-mode errors. */ }
  }, [values, draftKey]);
  return null;
}

export default function IndividualServiceForm({ category, categoryLabel, serviceOptions, onBack, onNext }) {
  const [initialValues] = useState(() => getProviderServiceInitialValues(category, serviceOptions));
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [uploadingRegistration, setUploadingRegistration] = useState(false);
  const [error, setError] = useState("");
  const draftKey = `provider-service-details-draft-${category}`;

  const uploadFile = (file, folder) => {
    const email = localStorage.getItem("email") || localStorage.getItem("google-email");
    if (!email) return Promise.reject(new Error("Your session has expired. Please sign in again."));
    return uploadProviderWorkVisual(email, file, folder);
  };

  const submit = async (values) => {
    if (!isProviderServiceComplete(values) || uploadingPhotos || uploadingRegistration) return;
    setError("");
    try {
      await saveProviderOnboardingServices(category, buildProviderServiceDetails(values));
      trackEvent("kyc_step_completed", { role: "provider", step: "skill_verification", service_category: category });
      localStorage.removeItem(draftKey);
      onNext?.();
    } catch (error) {
      setError(error?.response?.data?.message || error.message || "Unable to save your service details. Please try again.");
      trackEvent("kyc_step_failed", { role: "provider", step: "skill_verification", service_category: category, status: error?.response?.status });
    }
  };

  return (
    <AccountSetupLayout currentStep={2} alignTop>
      <div className="mt-4">
        <button type="button" onClick={onBack} className="mb-8 flex w-fit items-center gap-2 text-[#005823]">
          <IoIosArrowBack size={24} /><span className="text-lg">Back</span>
        </button>
        <div className="mb-4">
          <h2 className="mb-2 text-xl font-semibold">Verify your skill</h2>
          <p className="text-[#231F20BF]">Complete your verification to build trust with customers and access more features.</p>
        </div>
        <Formik initialValues={initialValues} onSubmit={submit}>
          {({ values, handleChange, handleBlur, handleSubmit, setFieldValue, isSubmitting }) => (
            <form onSubmit={handleSubmit} className="mb-9 flex flex-col gap-4">
              <SavedDraft values={values} draftKey={draftKey} />
              <div>
                <p className="text-sm font-semibold text-[#231F20]">Service Category</p>
                <p className="mt-3 rounded-md border border-gray-300 bg-gray-50 px-5 py-4">{categoryLabel}</p>
              </div>
              <ProviderServicesSection
                values={values} handleChange={handleChange} handleBlur={handleBlur} setFieldValue={setFieldValue}
                serviceNames={[...serviceOptions.map((item) => item.name), ...(values.customServices || [])]}
                servicesField="selectedServices" allowCustomServices uploadFile={uploadFile}
                onWorkUploadingChange={setUploadingPhotos} onRegistrationUploadingChange={setUploadingRegistration}
                serviceLocationSection={
                  <ServiceLocationFields selectedLocations={values.servicePlace} toggleLocation={(location) => {
                    setFieldValue("servicePlace", values.servicePlace.includes(location)
                      ? values.servicePlace.filter((item) => item !== location) : [...values.servicePlace, location]);
                  }} />
                }
              />
              {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
              <div className="mt-8 flex justify-end gap-3">
                <button type="submit" disabled={isSubmitting || uploadingPhotos || uploadingRegistration || !isProviderServiceComplete(values)}
                  className="rounded-lg bg-[#005823BF] px-6 py-2 text-white transition hover:bg-[#004e1a] disabled:cursor-not-allowed disabled:opacity-50">
                  {isSubmitting ? "Saving..." : "Complete"}
                </button>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </AccountSetupLayout>
  );
}
