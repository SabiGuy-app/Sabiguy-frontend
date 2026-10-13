import { Check } from "lucide-react";

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
  pricingOption,
  selected,
  onToggle,
}) {
  const included =
    service.includes ||
    service.included ||
    service.inclusions ||
    service.items ||
    SERVICE_INCLUSIONS[
      String(service.name || "")
        .trim()
        .toLowerCase()
    ] ||
    [service.name].filter(Boolean);

  const rawPrice =
    service.pricingModel?.[pricingOption] ??
    (!service.pricingModel ? service.price : null);
  const price = Number(rawPrice);
  const hasPrice = Number.isFinite(price) && price > 0;

  return (
    <article
      className={`rounded-lg border bg-white p-4 ${selected ? "border-[#34805A]" : "border-gray-200"}`}
    >
      <label className="flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          checked={selected}
          disabled={!hasPrice}
          onChange={() => onToggle(service)}
          className="mt-1 h-4 w-4 accent-[#005823]"
        />
        <span className="min-w-0 flex-1">
          <span className="block font-medium">{service.name}</span>
          <span className="mt-1 block text-sm text-gray-500">
            {hasPrice ? (
              <>
                {formatMoney(price)} ·{" "}
                {service.duration || "Duration unavailable"}
              </>
            ) : (
              "Unavailable for this booking location"
            )}
          </span>
        </span>
      </label>

      <div className="mt-3 border-t border-gray-100 pt-3">
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
    </article>
  );
}
