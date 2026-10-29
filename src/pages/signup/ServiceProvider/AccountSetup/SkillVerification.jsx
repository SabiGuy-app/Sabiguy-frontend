import { useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import AccountSetupLayout from "./layout";
import ProviderCategoryVerification from "./ProviderCategoryVerification";
import IndividualServiceForm from "./IndividualServiceForm";
// These are the same dropdown, service options, and form used by businesses.
import ServiceCategorySelect from "../../../../components/onboarding/ServiceCategorySelect";
import { useServiceCategories } from "../../../../stores/serviceCategories.store";

export default function SkillsVerification({ onNext, onBack }) {
  const [category, setCategory] = useState("");
  const { categories } = useServiceCategories();
  const selectedCategory = categories.find((item) => item.id === category);
  const returnToCategories = () => setCategory("");

  // Beauty and transport retain their original provider-specific fields and APIs.
  if (category === "transport" || category === "beauty") {
    return <ProviderCategoryVerification key={category} category={category === "beauty" ? "beauty_personal_care" : "transport"} onNext={onNext} onBack={returnToCategories} />;
  }

  if (selectedCategory?.services) {
    return <IndividualServiceForm key={category} category={category} categoryLabel={selectedCategory.label}
      serviceOptions={selectedCategory.services} onBack={returnToCategories} onNext={onNext} />;
  }

  return (
    <AccountSetupLayout currentStep={2} alignTop>
        <div className="mx-auto w-full max-w-[496px] pb-8">
          <button type="button" onClick={onBack} className="mb-8 flex w-fit items-center gap-2 text-[#005823]">
            <IoIosArrowBack size={22} /><span className="text-sm font-semibold">Back</span>
          </button>
          <h2 className="text-[20px] font-semibold text-[#231F20]">Verify your skill</h2>
          <p className="mt-3 text-sm text-[#231F20BF]">Complete your verification to build trust with customers and access more features.</p>
          <div className="mt-6">
            <ServiceCategorySelect name="provider-service-category" label="Service category" placeholder="Select Category"
              value={category} onChange={(option) => setCategory(option.value)} />
          </div>
        </div>
    </AccountSetupLayout>
  );
}
