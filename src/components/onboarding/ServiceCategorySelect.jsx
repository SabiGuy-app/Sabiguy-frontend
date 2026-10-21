import InputField from "../InputField";
import { SERVICE_CATEGORY_OPTIONS } from "../../constants/serviceCategories";

export default function ServiceCategorySelect({ value, onChange, label = "Business category", name = "business-category", placeholder = "Select business category" }) {
  return (
    <div>
      <label htmlFor={name} className="text-sm font-semibold text-[#231F20]">{label}</label>
      <div className="mt-3">
        <InputField select singleChevron selectAnchor="bottom start" name={name} placeholder={placeholder}
          options={SERVICE_CATEGORY_OPTIONS} inputClassName="h-14 pr-10 text-sm"
          value={value} onChange={onChange} />
      </div>
    </div>
  );
}
