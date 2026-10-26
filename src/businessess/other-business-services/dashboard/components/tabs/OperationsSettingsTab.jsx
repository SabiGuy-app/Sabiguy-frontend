import { useRef, useState } from "react";
import { Camera, Check, Pencil, Plus, Trash2 } from "lucide-react";
import SettingsTabCard from "./SettingsTabCard";
import { SettingsEditDialog } from "./SettingsTabCard";
import ServiceDetailsModal from "../ServiceDetailsModal";

const weekDays = [
  { short: "Mon", full: "Monday" },
  { short: "Tue", full: "Tuesday" },
  { short: "Wed", full: "Wednesday" },
  { short: "Thu", full: "Thursday" },
  { short: "Fri", full: "Friday" },
  { short: "Sat", full: "Saturday" },
  { short: "Sun", full: "Sunday" },
];

const initialServices = [
  {
    id: "cut",
    name: "Haircut",
    price: "8000",
    duration: "45 mins",
    included: ["Hair wash", "Hair cut & styling", "Beard Trim"],
    locationPricing: [
      { location: "Walk in Salon", price: "5000", duration: "45 mins" },
      { location: "Customer's Address", price: "7000", duration: "1 hr" },
    ],
  },
  {
    id: "beard",
    name: "Haircut & Beard Trim",
    price: "12000",
    duration: "1 hr",
    included: ["Hair wash", "Hair cut & styling", "Beard Trim"],
    locationPricing: [
      { location: "Walk in Salon", price: "10000", duration: "1 hr" },
      { location: "Customer's Address", price: "12000", duration: "1 hr" },
    ],
  },
  {
    id: "kids",
    name: "Kids Haircut",
    price: "5000",
    duration: "30 mins",
    included: [],
    locationPricing: [
      { location: "Walk in Salon", price: "5000", duration: "30 mins" },
      { location: "Customer's Address", price: "7000", duration: "45 mins" },
    ],
  },
  {
    id: "shape",
    name: "Shape-up",
    price: "4000",
    duration: "20 mins",
    included: [],
    locationPricing: [
      { location: "Walk in Salon", price: "4000", duration: "20 mins" },
      { location: "Customer's Address", price: "6000", duration: "30 mins" },
    ],
  },
];

const serviceLocations = [
  "Walk in Salon",
  "Customer's Address",
  "My home Address",
];

const initialPhotos = [
  "/beauty/hair-1.png",
  "/beauty/hair-2.png",
  "/beauty/hair-3.png",
];

const chipClass = (selected) =>
  `inline-flex h-6 items-center gap-1 rounded-full px-2.5 text-[9px] font-medium transition-colors ${selected ? "bg-[#347B54] text-white" : "border border-[#E1E1E1] bg-white text-[#707070] hover:border-[#347B54]"}`;

export default function OperationsSettingsTab() {
  const [business, setBusiness] = useState({
    name: "Sharp Edge Grooming",
    category: "Beauty & Personal Care",
  });
  const [businessEditorOpen, setBusinessEditorOpen] = useState(false);
  const [providedServiceEditorOpen, setProvidedServiceEditorOpen] =
    useState(false);
  const [services, setServices] = useState(initialServices);
  const [serviceEditor, setServiceEditor] = useState(null);
  const [openDays, setOpenDays] = useState([
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ]);
  const [scheduleMode, setScheduleMode] = useState("scheduled");
  const [hours, setHours] = useState({ opens: "09:00", closes: "18:00" });
  const [locations, setLocations] = useState([
    "Customer's Address",
    "Walk in Salon",
  ]);
  const [photos, setPhotos] = useState(initialPhotos);
  const photoInput = useRef(null);

  const toggleDay = (day) => {
    setOpenDays((current) =>
      current.includes(day)
        ? current.filter((item) => item !== day)
        : [...current, day],
    );
  };

  const toggleLocation = (location) => {
    setLocations((current) =>
      current.includes(location)
        ? current.filter((item) => item !== location)
        : [...current, location],
    );
  };

  const editService = (service) => {
    const values = service ?? {
      name: "",
      price: "",
      duration: "45 mins",
      included: [],
      locationPricing: locations.map((location) => ({
        location,
        price: "",
        duration: "45 mins",
      })),
    };
    setServiceEditor({
      id: service?.id ?? `service-${Date.now()}`,
      isNew: !service,
      values,
    });
  };

  const removeService = (id) => {
    setServices((current) => current.filter((service) => service.id !== id));
  };

  const addProvidedService = ({ name }) => {
    const serviceName = name.trim();
    if (!serviceName) return;

    const alreadyExists = services.some(
      (service) => service.name.toLowerCase() === serviceName.toLowerCase(),
    );
    if (!alreadyExists) {
      setServices((current) => [
        ...current,
        {
          id: `service-${Date.now()}`,
          name: serviceName,
          price: "",
          duration: "45 mins",
          included: [],
          locationPricing: locations.map((location) => ({
            location,
            price: "",
            duration: "45 mins",
          })),
        },
      ]);
    }
    setProvidedServiceEditorOpen(false);
  };

  const saveService = (values) => {
    const serviceName = values.name.trim();
    if (!serviceName) return;

    const savedValues = { ...values, name: serviceName };

    if (serviceEditor.isNew) {
      const duplicate = services.some(
        (service) => service.name.toLowerCase() === serviceName.toLowerCase(),
      );
      if (duplicate) return;
      setServices((current) => [
        ...current,
        { id: serviceEditor.id, ...savedValues },
      ]);
    } else {
      setServices((current) =>
        current.map((service) =>
          service.id === serviceEditor.id
            ? { ...service, ...savedValues }
            : service,
        ),
      );
    }
    setServiceEditor(null);
  };

  const addPhotos = (event) => {
    const files = Array.from(event.target.files ?? []);
    setPhotos((current) => [
      ...current,
      ...files.map((file) => URL.createObjectURL(file)),
    ]);
    event.target.value = "";
  };

  return (
    <div className="py-1">
      <SettingsTabCard
        title="Business category"
        onEdit={() => setBusinessEditorOpen(true)}
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[10px] text-[#777777]">Business name</p>
            <p className="mt-0.5 text-[10px] font-semibold text-[#272727]">
              {business.name}
            </p>
          </div>
          <p className="text-[10px] font-semibold text-[#272727]">
            {business.category}
          </p>
        </div>
        <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
          <div className="max-w-md">
            <p className="text-[10px] font-semibold text-[#373737]">
              Services you provide
            </p>
            <p className="mt-1 text-[9px] leading-4 text-[#818181]">
              Here are the service you currently provide. You can add more
              service if you’re now able to provide them.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setProvidedServiceEditorOpen(true)}
            className="inline-flex h-7 items-center gap-1 rounded-md bg-[#347B54] px-2.5 text-[9px] font-medium text-white hover:bg-[#286642]"
          >
            <Plus size={12} />
            Add service
          </button>
        </div>
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {services.map((service) => (
            <button
              key={service.id}
              type="button"
              aria-label={`Remove ${service.name} from services you provide`}
              onClick={() => removeService(service.id)}
              className={chipClass(true)}
            >
              <Check size={10} />
              {service.name}
            </button>
          ))}
        </div>
      </SettingsTabCard>

      <SettingsTabCard title="Services & Pricing">
        <p className="-mt-1 text-[9px] text-[#828282]">
          List the services you offer and set fair prices so customers know what
          to expect.
        </p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {services.map((service) => (
            <article
              key={service.id}
              className="rounded-md border border-[#DADADA] px-3 py-2.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="truncate text-xs font-semibold text-[#626262]">
                    {service.name}
                  </h3>
                  <p className="mt-1 text-[10px]">
                    <span className="font-semibold text-[#347B54]">
                      ₦{Number(service.price).toLocaleString("en-NG")}
                    </span>
                    <span className="px-1.5 text-[#A5A5A5]">•</span>
                    <span className="text-[#777777]">{service.duration}</span>
                  </p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <button
                    type="button"
                    aria-label={`Edit ${service.name}`}
                    onClick={() => editService(service)}
                    className="rounded p-1 text-[#777777] hover:bg-[#F4F4F4] hover:text-[#347B54]"
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    type="button"
                    aria-label={`Remove ${service.name}`}
                    onClick={() => removeService(service.id)}
                    className="rounded p-1 text-[#777777] hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
        <button
          type="button"
          onClick={() => editService(null)}
          className="inline-flex h-7 w-full items-center justify-center gap-1.5 rounded border border-[#BFD8C7] text-[9px] font-medium text-[#347B54] hover:bg-[#F3F8F4]"
        >
          <Plus size={12} />
          Add New Service
        </button>
      </SettingsTabCard>

      <div className="grid grid-cols-1 gap-1 md:grid-cols-2">
        <section className="px-3 py-3 sm:px-4">
          <h2 className="text-[11px] font-semibold text-[#333333]">
            Business Hours
          </h2>
          <p className="mt-1 text-[9px] text-[#818181]">
            Set when customers can book your services.
          </p>
          <div className="mt-3 flex items-center gap-4 text-[10px]">
            <label className="inline-flex items-center gap-1.5">
              <input
                type="radio"
                name="schedule-mode"
                checked={scheduleMode === "scheduled"}
                onChange={() => setScheduleMode("scheduled")}
                className="accent-[#347B54]"
              />
              Every day
            </label>
            <label className="inline-flex items-center gap-1.5 text-[#777777]">
              <input
                type="radio"
                name="schedule-mode"
                checked={scheduleMode === "always"}
                onChange={() => setScheduleMode("always")}
                className="accent-[#347B54]"
              />
              24/7
            </label>
          </div>
          {scheduleMode === "scheduled" && (
            <>
              <div className="mt-3 grid max-w-sm grid-cols-2 gap-3">
                <label className="text-[9px] text-[#777777]">
                  Opening time
                  <input
                    type="time"
                    value={hours.opens}
                    onChange={(event) =>
                      setHours((current) => ({
                        ...current,
                        opens: event.target.value,
                      }))
                    }
                    className="mt-1 block h-8 w-full rounded border border-[#DDDDDD] bg-white px-2 text-[10px] text-[#333333]"
                  />
                </label>
                <label className="text-[9px] text-[#777777]">
                  Closing time
                  <input
                    type="time"
                    value={hours.closes}
                    onChange={(event) =>
                      setHours((current) => ({
                        ...current,
                        closes: event.target.value,
                      }))
                    }
                    className="mt-1 block h-8 w-full rounded border border-[#DDDDDD] bg-white px-2 text-[10px] text-[#333333]"
                  />
                </label>
              </div>
              <p className="mb-1.5 mt-2.5 text-[9px] text-[#777777]">
                Available days
              </p>
              <div className="flex flex-wrap gap-1">
                {weekDays.map(({ short, full }) => {
                  const isOpen = openDays.includes(full);
                  return (
                    <button
                      key={full}
                      type="button"
                      aria-pressed={isOpen}
                      onClick={() => toggleDay(full)}
                      className={`h-5 min-w-8 rounded-full px-1.5 text-[9px] ${isOpen ? "bg-[#347B54] text-white" : "border border-[#DDDDDD] bg-white text-[#777777]"}`}
                    >
                      {short}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </section>

        <section className="px-3 py-3 sm:px-4">
          <h2 className="text-[11px] font-semibold text-[#333333]">
            Where do you provide your service
          </h2>
          <p className="mt-1 text-[9px] text-[#818181]">
            Select all that apply
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {serviceLocations.map((location) => {
              const isSelected = locations.includes(location);
              return (
                <button
                  key={location}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => toggleLocation(location)}
                  className={chipClass(isSelected)}
                >
                  {isSelected && <Check size={10} />}
                  {location}
                </button>
              );
            })}
          </div>
        </section>
      </div>

     <SettingsTabCard title="Photos of your work">
  <div className="flex flex-wrap gap-2.5">
    {photos.map((photo, index) => (
      <div
        key={`${photo}-${index}`}
        className="group relative aspect-square w-[min(28vw,138px)] overflow-hidden rounded-lg bg-[#F4F4F4] sm:w-34.5"
      >
        <img
          src={photo}
          alt={`Example of salon work ${index + 1}`}
          className="h-full w-full object-cover"
        />
        <button
          type="button"
          aria-label={`Remove photo ${index + 1}`}
          onClick={() =>
            setPhotos((current) =>
              current.filter((_, photoIndex) => photoIndex !== index),
            )
          }
          className="pointer-events-none absolute right-1.5 top-1.5 z-10 rounded-full bg-red-400 p-1 text-white opacity-0 transition-opacity group-hover:pointer-events-auto group-hover:opacity-100 focus-visible:pointer-events-auto focus-visible:opacity-100 [@media(hover:none)]:pointer-events-auto [@media(hover:none)]:opacity-100"
        >
          <Trash2 size={12} />
        </button>
      </div>
    ))}
    <button
      type="button"
      onClick={() => photoInput.current?.click()}
      className="flex aspect-square w-[min(28vw,138px)] flex-col items-center justify-center gap-1.5 rounded-lg bg-[#F5F5F5] text-[#8B8B8B] hover:bg-[#EEEEEE] sm:w-34.5"
    >
      <Camera size={20} />
      <span className="text-[9px]">Add photos</span>
    </button>
    <input
      ref={photoInput}
      type="file"
      accept="image/*"
      multiple
      onChange={addPhotos}
      className="hidden"
    />
  </div>
</SettingsTabCard>

      <SettingsEditDialog
        isOpen={providedServiceEditorOpen}
        title="Add service"
        fields={[{ key: "name", label: "Service name" }]}
        values={{ name: "" }}
        onClose={() => setProvidedServiceEditorOpen(false)}
        onSave={addProvidedService}
      />
      <SettingsEditDialog
        isOpen={businessEditorOpen}
        title="Edit business category"
        fields={[
          { key: "name", label: "Business name" },
          {
            key: "category",
            label: "Business category",
            type: "select",
            options: [
              "Beauty & Personal Care",
              "Barbershop",
              "Hair Salon",
              "Spa",
            ],
          },
        ]}
        values={business}
        onClose={() => setBusinessEditorOpen(false)}
        onSave={(values) => {
          setBusiness((current) => ({ ...current, ...values }));
          setBusinessEditorOpen(false);
        }}
      />
      <ServiceDetailsModal
        isOpen={Boolean(serviceEditor)}
        service={serviceEditor?.values ?? null}
        locations={serviceLocations}
        onClose={() => setServiceEditor(null)}
        onSave={saveService}
      />
    </div>
  );
}
