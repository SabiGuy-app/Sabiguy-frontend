import { useState } from "react";
import { Check, House, MapPinned, Store, Timer } from "lucide-react";

import { formatMoney } from "../../utils/bookingFormat";

const SERVICE_INCLUSIONS = {
  barbing: ["Hair consultation", "Haircut", "Line-up & finish"],
  "hair dresser": ["Hair wash", "Hair styling", "Finishing"],
  braiding: ["Style consultation", "Hair sectioning", "Braiding & finish"],
  spa: ["Treatment consultation", "Selected spa treatment", "Relaxation"],
  "lash tech": ["Lash style consultation", "Lash application", "Finishing"],
  "lash tech.": ["Lash style consultation", "Lash application", "Finishing"],
  pedicure: ["Foot soak", "Nail shaping", "Pedicure finish"],
  "nails tech": ["Nail shaping", "Cuticle care", "Nail finish"],
  "nails tech.": ["Nail shaping", "Cuticle care", "Nail finish"],
};

export default function ServiceBookingOptions({
  service,
  onBook,
  defaultOpen = false,
}) {
  const [place, setPlace] = useState("salon");
  const included =
    service.includes ||
    service.included ||
    service.inclusions ||
    service.items ||
    SERVICE_INCLUSIONS[String(service.name || "").trim().toLowerCase()] ||
    [service.name].filter(Boolean);

  const getPrice = (pricingOption) => {
    const explicitPrice = service.pricingModel?.[pricingOption];
    const price = explicitPrice ?? (!service.pricingModel ? service.price : null);
    const number = Number(price);
    return Number.isFinite(number) && number > 0 ? number : null;
  };

  const getDurationLabel = (duration) =>
    service.duration || (duration === 60 ? "1 hr" : `${duration} mins`);

  const options = [
    {
      id: "salon",
      pricingOption: "walk_in",
      label: "Walk in Salon",
      price: getPrice("walk_in"),
      duration: 45,
      icon: Store,
    },
    {
      id: "home",
      pricingOption: "customer_address",
      label: "My Address",
      price: getPrice("customer_address"),
      duration: 60,
      icon: House,
    },
    {
      id: "provider",
      pricingOption: "provider_address",
      label: "Provider's Address",
      price: getPrice("provider_address"),
      duration: 45,
      icon: MapPinned,
    },
  ];

  const availableOptions = options.filter((option) => option.price !== null);
  const selected = availableOptions.find((option) => option.id === place);

  const book = () => {
    onBook({
      service: service.name,
      id: selected.id,
      label: selected.label,
      price: selected.price,
      duration: selected.duration,
      pricingOption: selected.pricingOption,
      mode: "later",
    });
  };

  return (
    <details
      open={defaultOpen}
      className="group rounded-lg border border-gray-200 bg-white shadow-sm open:border-[#34805A]"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-4 [&::-webkit-details-marker]:hidden sm:px-5">
        <span>
          <span className="block font-medium">{service.name}</span>
          <span className="mt-1 block text-sm text-gray-500">
            Starting ·{" "}
            <strong className="text-[#005823]">
              {Number(service.price) > 0
                ? formatMoney(service.price)
                : "Price unavailable"}
            </strong>
          </span>
        </span>
        <span
          aria-hidden="true"
          className="mr-1 h-3 w-3 rotate-45 border-b-2 border-r-2 border-gray-500 transition-transform group-open:rotate-[225deg]"
        />
      </summary>

      <div className="border-t border-gray-100 px-4 pb-4 pt-2 sm:px-5">
        <p className="text-xs font-semibold text-gray-700">What's included</p>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500">
          {included.map((item) => (
            <span key={item} className="inline-flex items-center gap-1">
              <Check size={15} className="text-[#34805A]" />
              {item}
            </span>
          ))}
        </div>
      </div>

      <fieldset className="space-y-3 px-4 pb-4 sm:px-5">
        <legend className="sr-only">
          Where would you like your {service.name}?
        </legend>
        {availableOptions.length ? availableOptions.map((option) => (
          <label
            key={option.id}
            className={`flex cursor-pointer items-center gap-4 rounded-lg border bg-white p-4 ${place === option.id ? "border-[#34805A]" : "border-gray-200"}`}
          >
            <option.icon
              size={30}
              className={
                place === option.id ? "text-[#34805A]" : "text-gray-500"
              }
            />
            <span className="flex-1 text-sm">
              <span className="block font-medium text-gray-700">
                {option.label}
              </span>
              <span className="mt-1 block text-gray-500">
                <strong
                  className={
                    place === option.id ? "text-[#005823]" : "font-medium"
                  }
                >
                  {formatMoney(option.price)}
                </strong>{" "}
                · {getDurationLabel(option.duration)}
              </span>
            </span>
            <input
              type="radio"
              name={`place-${service.name}`}
              value={option.id}
              checked={place === option.id}
              onChange={() => setPlace(option.id)}
              className="h-4 w-4 accent-[#005823]"
            />
          </label>
        )) : (
          <p className="rounded-md bg-gray-50 px-4 py-3 text-sm text-gray-600">
            Pricing is not available for this service yet.
          </p>
        )}
      </fieldset>

      <div className="px-4 pb-4 sm:px-5">
        <button
          type="button"
          onClick={book}
          disabled={!selected}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-[#34805A] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#2d6f4f] disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          <Timer size={17} />
          Book Service
        </button>
      </div>
    </details>
  );
}
