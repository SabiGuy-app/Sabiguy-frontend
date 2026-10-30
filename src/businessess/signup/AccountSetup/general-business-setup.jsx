import { useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import ServiceCategorySelect from "../../../components/onboarding/ServiceCategorySelect";
import BusinessSetupLayout from "../ServiceProvider/BusinessSetupLayout";
import AddVehicleForm from "../ServiceProvider/BusinessSetup/AddVehicleForm";
import CategoryService from "./business-setup/category-service";
import { useServiceCategories } from "../../../stores/serviceCategories.store";

export default function GeneralBusinessSetup({ onBack, onNext, onCategoryChange }) {
  const [category, setCategory] = useState("");
  const { categories } = useServiceCategories();

  const handleCategoryChange = (option) => {
    const selectedCategory = option.value;
    setCategory(selectedCategory);
    onCategoryChange?.(
      categories.find((item) => item.id === selectedCategory),
    );
  };

  const handleReturnToCategory = () => setCategory("");

  if (category === "transport") {
    return (
      <AddVehicleForm onBack={handleReturnToCategory} onNext={onNext} />
    );
  }

  const selectedCategory = categories.find(
    (item) => item.id === category,
  );
  if (selectedCategory?.services) {
    return (
      <CategoryService
        category={category}
        categoryLabel={selectedCategory.label}
        serviceOptions={selectedCategory.services}
        onBack={handleReturnToCategory}
        onNext={onNext}
      />
    );
  }

  return (
    <BusinessSetupLayout currentStep={2}>
      <div className="mx-auto w-full max-w-[496px] pb-8">
        <button
          type="button"
          onClick={onBack}
          className="mb-8 flex w-fit items-center gap-2 text-[#005823]"
        >
          <IoIosArrowBack size={22} />
          <span className="text-sm font-semibold">Verification</span>
        </button>

        <h2 className="text-[20px] font-semibold text-[#231F20]">
          Business setup
        </h2>
        <div className="mt-6">
          <ServiceCategorySelect value={category} onChange={handleCategoryChange} />
        </div>
      </div>
    </BusinessSetupLayout>
  );
}
