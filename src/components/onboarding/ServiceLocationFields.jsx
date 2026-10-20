import { Check, Plus } from "lucide-react";

import { SERVICE_LOCATIONS } from "../../constants/serviceLocations";

export default function ServiceLocationFields({ selectedLocations, toggleLocation }) {
  return (
        <section>
          <h3 className="text-sm font-semibold text-[#231F20]">
            Where do you provide your service
          </h3>
          <p className="mt-1 text-sm text-[#231F20BF]">Select all that apply</p>
          <div className="mt-4 flex flex-wrap gap-3">
            {SERVICE_LOCATIONS.map((location) => {
              const isSelected = selectedLocations.includes(location.value);
              return (
                <button
                  key={location.id}
                  type="button"
                  onClick={() => toggleLocation(location.value)}
                  className={`inline-flex h-8 items-center gap-2 rounded-full border px-4 text-xs font-medium transition ${
                    isSelected
                      ? "border-[#34805A] bg-[#34805A] text-white"
                      : "border-[#231F2026] bg-white text-[#231F20BF]"
                  }`}
                >
                  {isSelected ? <Check size={14} /> : <Plus size={14} />}
                  {location.name}
                </button>
              );
            })}
          </div>
        </section>
  );
}
