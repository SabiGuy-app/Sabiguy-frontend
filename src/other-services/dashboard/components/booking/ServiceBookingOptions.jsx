import { useState } from "react";
import { Store, House, MapPin, CalendarDays, Timer } from "lucide-react";
import Button from "../../../../components/button";

import { formatMoney } from "../../utils/bookingFormat";

export default function ServiceBookingOptions({ service, onBook }) {
  const [place, setPlace] = useState("salon");
  const options = [
    {
      id: "salon",
      label: "Walk in Salon",
      price: service.price,
      duration: 45,
      icon: Store,
    },
    {
      id: "home",
      label: "My Address",
      price: service.price + 2000,
      duration: 60,
      icon: House,
    },
    {
      id: "provider",
      label: "Provider’s Address",
      price: service.price,
      duration: 45,
      icon: MapPin,
    },
  ];
  const selected = options.find((option) => option.id === place);
  const book = (mode) => {
    onBook({
      service: service.name,
      id: selected.id,
      label: selected.label,
      price: selected.price,
      duration: selected.duration,
      mode,
    });
  };
  return (
    <details className="group rounded-xl border border-gray-200 bg-gray-50/60 p-4 shadow-sm sm:p-5">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
        <span>
          <span className="block font-medium">{service.name}</span>
          <span className="mt-1 block text-sm text-gray-500">
            Starting ·{" "}
            <strong className="text-[#005823]">
              {formatMoney(service.price)}
            </strong>
          </span>
        </span>
        <span
          aria-hidden="true"
          className="mr-1 h-3 w-3 rotate-45 border-b-2 border-r-2 border-gray-500 transition-transform group-open:rotate-[225deg]"
        />
      </summary>
      <fieldset className="mt-4 space-y-3">
        <legend className="sr-only">
          Where would you like your {service.name}?
        </legend>
        {options.map((option) => (
          <label
            key={option.id}
            className={`flex cursor-pointer items-center gap-4 rounded-lg border bg-white p-4 shadow-sm ${place === option.id ? "border-[#34805A]" : "border-gray-200"}`}
          >
            <option.icon
              size={30}
              className={
                place === option.id ? "text-[#34805A]" : "text-gray-500"
              }
            />
            <span className="flex-1 text-sm">
              <span className="block text-gray-500">{option.label}</span>
              <span className="mt-1 block text-gray-500">
                <strong
                  className={
                    place === option.id ? "text-[#005823]" : "font-medium"
                  }
                >
                  {formatMoney(option.price)}
                </strong>{" "}
                · {option.duration === 60 ? "1 hr" : `${option.duration} mins`}
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
        ))}
      </fieldset>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Button variant="ghost" size="sm" onClick={() => book("later")}>
          <span className="flex items-center justify-center gap-2">
            <CalendarDays size={18} />
            Book for Later
          </span>
        </Button>
        <Button size="sm" onClick={() => book("now")}>
          <span className="flex items-center justify-center gap-2">
            <Timer size={18} />
            Book Now
          </span>
        </Button>
      </div>
    </details>
  );
}
