import { useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { ChevronDown } from "lucide-react";
import BusinessSetupLayout from "../ServiceProvider/BusinessSetupLayout";
import AddVehicleForm from "../ServiceProvider/BusinessSetup/AddVehicleForm";
import CategoryService from "./business-setup/category-service";
import { AUTOMOTIVE_SERVICE_OPTIONS } from "../../../constants/automotiveService";
import { BEAUTY_SERVICE_OPTIONS } from "../../../constants/beautyServices";
import { CATERING_SERVICE_OPTIONS } from "../../../constants/cateringService";
import { CLEANING_SERVICE_OPTIONS } from "../../../constants/cleaningService";
import { DOMESTIC_SERVICE_OPTIONS } from "../../../constants/domesticService";
import { EDUCATION_SERVICE_OPTIONS } from "../../../constants/educationService";
import { EVENT_SERVICE_OPTIONS } from "../../../constants/eventsServices";
import { FASHION_SERVICE_OPTIONS } from "../../../constants/fashionService";
import { HOME_REPAIR_SERVICE_OPTIONS } from "../../../constants/home-repairServices";
import { LAUNDRY_SERVICE_OPTIONS } from "../../../constants/laundryService";
import { PHOTOGRAPHY_VIDEOGRAPHY_SERVICE_OPTIONS } from "../../../constants/photography-videographyService";

const BUSINESS_CATEGORIES = [
  { id: "automotive", label: "Automotive Services", services: AUTOMOTIVE_SERVICE_OPTIONS },
  { id: "beauty", label: "Beauty & Personal Care", services: BEAUTY_SERVICE_OPTIONS },
  { id: "catering", label: "Catering & Food", services: CATERING_SERVICE_OPTIONS },
  { id: "cleaning", label: "Cleaning Service", services: CLEANING_SERVICE_OPTIONS },
  { id: "domestic", label: "Domestic Services", services: DOMESTIC_SERVICE_OPTIONS },
  { id: "education", label: "Education & Tutoring", services: EDUCATION_SERVICE_OPTIONS },
  { id: "events", label: "Events & Entertainment", services: EVENT_SERVICE_OPTIONS },
  { id: "fashion", label: "Fashion & Tailoring", services: FASHION_SERVICE_OPTIONS },
  { id: "home-repair", label: "Home Repair", services: HOME_REPAIR_SERVICE_OPTIONS },
  { id: "laundry", label: "Laundry Service", services: LAUNDRY_SERVICE_OPTIONS },
  { id: "photography-videography", label: "Photography & Videography", services: PHOTOGRAPHY_VIDEOGRAPHY_SERVICE_OPTIONS },
  { id: "transport", label: "Transport & Logistics" },
];                                                                                              

export default function GeneralBusinessSetup({ onBack, onNext, onCategoryChange }) {
  const [category, setCategory] = useState("");

  const handleCategoryChange = (event) => {
    const selectedCategory = event.target.value;
    setCategory(selectedCategory);
    onCategoryChange?.(
      BUSINESS_CATEGORIES.find((item) => item.id === selectedCategory),
    );
  };

  const handleReturnToCategory = () => setCategory("");

  if (category === "transport") {
    return (
      <AddVehicleForm onBack={handleReturnToCategory} onNext={onNext} />
    );
  }

  const selectedCategory = BUSINESS_CATEGORIES.find(
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
          <label
            htmlFor="business-category"
            className="text-sm font-semibold text-[#231F20]"
          >
            Business category
          </label>
          <span className="relative mt-3 block">
            <select
              id="business-category"
              value={category}
              onChange={handleCategoryChange}
              className="h-14 w-full appearance-none rounded border border-[#34805A] bg-[#F5FAF7] px-4 pr-10 text-sm text-[#005823] outline-none focus:ring-2 focus:ring-[#34805A]/20"
            >
              <option value="" disabled>
                Select business category
              </option>
              {BUSINESS_CATEGORIES.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={18}
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#34805A]"
              aria-hidden="true"
            />
          </span>
        </div>
      </div>
    </BusinessSetupLayout>
  );
}
