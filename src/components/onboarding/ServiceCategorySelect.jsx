import InputField from "../InputField";
import { useServiceCategories } from "../../stores/serviceCategories.store";

export default function ServiceCategorySelect({ value, onChange, label = "Business category", name = "business-category", placeholder = "Select business category" }) {
  const { categories, loading, error, retry } = useServiceCategories();
  const options = categories.map(({ id, label: categoryLabel }) => ({ value: id, label: categoryLabel }));

  return (
    <div>
      <label htmlFor={name} className="text-sm font-semibold text-[#231F20]">{label}</label>
      <div className="mt-3">
        <InputField select singleChevron selectAnchor="bottom start" name={name}
          placeholder={loading ? "Loading categories..." : placeholder}
          options={options} inputClassName="h-14 pr-10 text-sm"
          value={value} onChange={onChange} />
      </div>
      {error && (
        <p className="mt-2 text-xs text-red-600">
          Couldn't load categories.{" "}
          <button type="button" onClick={retry} className="font-semibold underline">Try again</button>
        </p>
      )}
    </div>
  );
}
