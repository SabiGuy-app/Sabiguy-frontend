import { useEffect, useRef, useState } from "react";
import { Camera, Check, Pencil, Plus, Trash2 } from "lucide-react";
import SettingsTabCard from "./SettingsTabCard";
import { SettingsEditDialog } from "./SettingsTabCard";
import ServiceDetailsModal from "../ServiceDetailsModal";
import { updateServiceDetails } from "../../../api/businessess";
import { uploadBusinessWorkVisual } from "../../../../../api/business";

const weekDays = [
  { short: "Mon", full: "Monday" },
  { short: "Tue", full: "Tuesday" },
  { short: "Wed", full: "Wednesday" },
  { short: "Thu", full: "Thursday" },
  { short: "Fri", full: "Friday" },
  { short: "Sat", full: "Saturday" },
  { short: "Sun", full: "Sunday" },
];

const MASTER_SERVICES = [
  "Barbing",
  "Hair Dresser",
  "Spa",
  "Lash Tech.",
  "Pedicure",
  "Nails Tech.",
];

const serviceLocations = [
  "Office / Commercial Space",
  "Customer Address",
];

const pricingLocationKeys = {
  "Office / Commercial Space": "provider_address",
  "Customer Address": "customer_address",
};

const normalizeServicePlace = (places = []) =>
  [...new Set(places.map((place) =>
    place === "Walk in Salon" ? "Office / Commercial Space" : place,
  ))];

const toUiService = (service, currentServices = []) => {
  const current =
    currentServices.find((item) => item.id === service._id) ??
    currentServices.find(
      (item) => item.name.toLowerCase() === service.serviceName.toLowerCase(),
    );
  const pricingModel = {};
  if (service.pricingModel?.provider_address != null) {
    pricingModel.provider_address = service.pricingModel.provider_address;
  }
  if (service.pricingModel?.customer_address != null) {
    pricingModel.customer_address = service.pricingModel.customer_address;
  }

  return {
    ...current,
    pricingModel,
    id: service._id ?? current?.id ?? `service-${Date.now()}`,
    name: service.serviceName,
    price: String(
      service.fixedPrice ??
        Object.values(pricingModel)[0] ??
        current?.price ??
        "",
    ),
    duration: current?.duration || "45 mins",
    included: current?.included ?? [],
    locationPricing: Object.entries(pricingLocationKeys)
      .filter(([, key]) => pricingModel[key] != null)
      .map(([location, key]) => ({
        location,
        price: String(pricingModel[key]),
        duration:
          current?.locationPricing?.find((item) => item.location === location)
            ?.duration || "45 mins",
      })),
  };
};

const chipClass = (selected) =>
  `inline-flex h-6 items-center gap-1 rounded-full px-2.5 text-[9px] font-medium transition-colors ${selected ? "bg-[#347B54] text-white" : "border border-[#E1E1E1] bg-white text-[#707070] hover:border-[#347B54]"}`;

export default function BusinessSettingsTab({
  business,
  loading,
  error,
  onBusinessUpdate,
}) {
  const [businesses, setBusinesses] = useState({
    name: business?.BusinessName || "__",
    category: business?.businessCategory || "__",
  });
  const [businessEditorOpen, setBusinessEditorOpen] = useState(false);
  const [providedServiceEditorOpen, setProvidedServiceEditorOpen] =
    useState(false);
  const [services, setServices] = useState([]);
  const [serviceEditor, setServiceEditor] = useState(null);
  const [openDays, setOpenDays] = useState(business?.availableDays ?? []);
  const [scheduleMode, setScheduleMode] = useState("scheduled");
  const [hours, setHours] = useState({
    opens: business?.businessHours?.start ?? "09:00",
    closes: business?.businessHours?.end ?? "18:00",
  });
  const [locations, setLocations] = useState(business?.servicePlace ?? []);
  const photoInput = useRef(null);
  const [media, setMedia] = useState([
    ...(business?.studioImages?.[0]?.pictures ?? []).map((url) => ({
      url,
      type: "image",
    })),
    ...(business?.studioImages?.[0]?.videos ?? []).map((url) => ({
      url,
      type: "video",
    })),
  ]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const saveQueue = useRef(Promise.resolve());
  const pendingSaves = useRef(0);
  const hydratedBusinessId = useRef(null);

  useEffect(() => {
    if (!business) return;
    const businessId = business._id ?? business.email;
    if (!businessId || hydratedBusinessId.current === businessId) return;
    hydratedBusinessId.current = businessId;

    setServices((current) =>
      (business?.service ?? []).map((service) => toUiService(service, current)),
    );
    setBusinesses({
      name: business?.BusinessName || "__",
      category: business?.businessCategory || "__",
    });
    setOpenDays(business?.availableDays ?? []);
    setHours({
      opens: business?.businessHours?.start ?? "09:00",
      closes: business?.businessHours?.end ?? "18:00",
    });
    setLocations(normalizeServicePlace(business?.servicePlace));
    setMedia([
      ...(business?.studioImages?.[0]?.pictures ?? []).map((url) => ({
        url,
        type: "image",
      })),
      ...(business?.studioImages?.[0]?.videos ?? []).map((url) => ({
        url,
        type: "video",
      })),
    ]);
  }, [business]);

  const toggleDay = (day) => {
    const nextOpenDays = openDays.includes(day)
      ? openDays.filter((item) => item !== day)
      : [...openDays, day];
    setOpenDays(nextOpenDays);
    void saveSettings({ nextOpenDays });
  };

  if (loading) {
    return (
      <div className="space-y-4 p-4 animate-pulse">
        {/* Skeleton for Business profile / Operating defaults sections */}
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-xl border border-[#E9E9E9] bg-white p-4"
          >
            <div className="h-4 w-32 bg-gray-200 rounded mb-4" />
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="h-3 w-24 bg-gray-100 rounded" />
                <div className="h-3 w-40 bg-gray-100 rounded" />
              </div>
              <div className="flex justify-between items-center">
                <div className="h-3 w-20 bg-gray-100 rounded" />
                <div className="h-3 w-28 bg-gray-100 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="m-4 rounded-lg border border-red-200 bg-red-50 p-4 text-xs text-red-600">
        {error}
      </div>
    );
  }

  const serviceNames = [
    ...new Map(
      [...MASTER_SERVICES, ...services.map((service) => service.name)].map(
        (name) => [name.toLowerCase(), name],
      ),
    ).values(),
  ];

  const saveSettings = async ({
    nextServices = services,
    nextBusinesses = businesses,
    nextOpenDays = openDays,
    nextHours = hours,
    nextLocations = locations,
    nextMedia = media,
  } = {}) => {
    pendingSaves.current += 1;
    setIsSaving(true);
    setSaveError("");
    const saveTask = saveQueue.current.then(async () => {
      try {
        const savedMedia = await Promise.all(
        nextMedia.map(async (item) => {
          if (!item.file) return item;
          if (!business?.email) {
            throw new Error("Business email is unavailable for media upload.");
          }
          const url = await uploadBusinessWorkVisual(business.email, item.file);
          if (!url) {
            throw new Error("The media upload did not return a URL.");
          }
          return { url, type: item.type };
        }),
        );
        setMedia(savedMedia);

        const servicePayload = nextServices.map((service) => {
        const pricingModel = {};
        service.locationPricing.forEach((entry) => {
          const key = pricingLocationKeys[entry.location];
          if (key && entry.price !== "") {
            pricingModel[key] = Number(entry.price);
          }
        });

        return {
          ...(service.id && !service.id.startsWith("service-")
            ? { _id: service.id }
            : {}),
          serviceName: service.name,
          ...(service.price !== "" ? { fixedPrice: Number(service.price) } : {}),
          pricingModel,
        };
        });
        const payload = {
        service: servicePayload,
        availableDays: nextOpenDays,
        businessHours: { start: nextHours.opens, end: nextHours.closes },
        servicePlace: normalizeServicePlace(nextLocations),
        studioImages: [
          {
            pictures: savedMedia
              .filter((item) => item.type === "image")
              .map((item) => item.url),
            videos: savedMedia
              .filter((item) => item.type === "video")
              .map((item) => item.url),
          },
        ],
        businessCategory: nextBusinesses.category,
        ...(nextBusinesses.name !== "__"
          ? { businessName: nextBusinesses.name }
          : {}),
        };
        const result = await updateServiceDetails(payload);

        setServices(
          (result?.service ?? servicePayload).map((service) =>
            service.serviceName
              ? toUiService(service, nextServices)
              : service,
          ),
        );
        setOpenDays(nextOpenDays);
        setHours({
          opens: nextHours.opens,
          closes: nextHours.closes,
        });
        setLocations(normalizeServicePlace(nextLocations));
        onBusinessUpdate?.({
          ...result,
          BusinessName: payload.businessName ?? business?.BusinessName,
          businessCategory:
            result?.businessCategory ?? payload.businessCategory,
        });
        setSaveError("");
        return true;
      } catch (saveError) {
        setSaveError(
          saveError?.response?.data?.message ||
            saveError?.message ||
            "Unable to save these business details. Please try again.",
        );
        return false;
      } finally {
        pendingSaves.current -= 1;
        setIsSaving(pendingSaves.current > 0);
      }
    });
    saveQueue.current = saveTask;
    return saveTask;
  };

  const toggleLocation = (location) => {
    const nextLocations = locations.includes(location)
      ? locations.filter((item) => item !== location)
      : [...locations, location];
    setLocations(nextLocations);
    void saveSettings({ nextLocations });
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

  const toggleServiceSelection = async (serviceName) => {
    const exists = services.some(
      (service) => service.name.toLowerCase() === serviceName.toLowerCase(),
    );
    const nextServices = exists
      ? services.filter(
          (service) =>
            service.name.toLowerCase() !== serviceName.toLowerCase(),
        )
      : [
          ...services,
          {
            id: `service-${Date.now()}`,
            name: serviceName,
            price: "",
            duration: "45 mins",
            included: [],
            locationPricing: [],
          },
        ];

    if (await saveSettings({ nextServices })) setServices(nextServices);
  };

  const removeService = async (id) => {
    const nextServices = services.filter((service) => service.id !== id);
    if (await saveSettings({ nextServices })) setServices(nextServices);
  };

  const addProvidedService = async ({ name }) => {
    const serviceName = name.trim();
    if (!serviceName) return;

    const alreadyExists = services.some(
      (service) => service.name.toLowerCase() === serviceName.toLowerCase(),
    );
    if (!alreadyExists) {
      const nextServices = [
        ...services,
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
      ];
      if (!(await saveSettings({ nextServices }))) return;
      setServices(nextServices);
    }
    setProvidedServiceEditorOpen(false);
  };

  const saveService = async (values) => {
    const serviceName = values.name.trim();
    if (!serviceName) return false;

    const savedValues = { ...values, name: serviceName };
    let nextServices;

    if (serviceEditor.isNew) {
      const duplicate = services.some(
        (service) => service.name.toLowerCase() === serviceName.toLowerCase(),
      );
      if (duplicate) return false;
      nextServices = [
        ...services,
        { id: serviceEditor.id, ...savedValues },
      ];
    } else {
      nextServices = services.map((service) =>
          service.id === serviceEditor.id
            ? { ...service, ...savedValues }
            : service,
      );
    }
    if (await saveSettings({ nextServices })) {
      setServices(nextServices);
      setServiceEditor(null);
      return true;
    }
    return false;
  };

  // const addPhotos = (event) => {
  //   const files = Array.from(event.target.files ?? []);
  //   setPhotos((current) => [
  //     ...current,
  //     ...files.map((file) => URL.createObjectURL(file)),
  //   ]);
  //   event.target.value = "";
  // };

  const addMedia = (event) => {
    const files = Array.from(event.target.files ?? []);
    const nextMedia = [
      ...media,
      ...files.map((file) => ({
        url: URL.createObjectURL(file),
        type: file.type.startsWith("video/") ? "video" : "image",
        file,
      })),
    ];
    setMedia(nextMedia);
    void saveSettings({ nextMedia });
    event.target.value = "";
  };

  const removeMedia = (indexToRemove) => {
    const nextMedia = media.filter((_, index) => index !== indexToRemove);
    setMedia(nextMedia);
    void saveSettings({ nextMedia });
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
              {businesses.name}
            </p>
          </div>
          <p className="text-[10px] font-semibold text-[#272727]">
            {businesses.category}
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
         {serviceNames.map((serviceName) => {
            const isSelected = services.some(
              (s) => s.name.toLowerCase() === serviceName.toLowerCase()
            );
            return (
              <button
                key={serviceName}
                type="button"
                onClick={() => toggleServiceSelection(serviceName)}
                className={chipClass(isSelected)}
              >
                {isSelected && <Check size={10} />}
                {serviceName}
              </button>
            );
          })}
        </div>
      </SettingsTabCard>

    <SettingsTabCard title="Services & Pricing">
        <p className="-mt-1 text-[9px] text-[#828282]">
          List the services you offer and set fair prices so customers know what to expect.
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
                      {service.price
                        ? `₦${Number(service.price).toLocaleString("en-NG")}`
                        : "Set price"}
                    </span>
                    <span className="px-1.5 text-[#A5A5A5]">•</span>
                    <span className="text-[#777777]">
                      {service.duration || "Set duration"}
                    </span>
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
                onChange={() => {
                  setScheduleMode("scheduled");
                  void saveSettings();
                }}
                className="accent-[#347B54]"
              />
              Every day
            </label>
            <label className="inline-flex items-center gap-1.5 text-[#777777]">
              <input
                type="radio"
                name="schedule-mode"
                checked={scheduleMode === "always"}
                onChange={() => {
                  setScheduleMode("always");
                  void saveSettings();
                }}
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
                    onChange={(event) => {
                      const nextHours = {
                        ...hours,
                        opens: event.target.value,
                      };
                      setHours(nextHours);
                      void saveSettings({ nextHours });
                    }}
                    className="mt-1 block h-8 w-full rounded border border-[#DDDDDD] bg-white px-2 text-[10px] text-[#333333]"
                  />
                </label>
                <label className="text-[9px] text-[#777777]">
                  Closing time
                  <input
                    type="time"
                    value={hours.closes}
                    onChange={(event) => {
                      const nextHours = {
                        ...hours,
                        closes: event.target.value,
                      };
                      setHours(nextHours);
                      void saveSettings({ nextHours });
                    }}
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
          {media.map((item, index) => (
            <div
              key={`${item.url}-${index}`}
              className="group relative aspect-square w-[min(28vw,138px)] overflow-hidden rounded-lg bg-[#F4F4F4] sm:w-34.5"
            >
              {item.type === "video" ? (
                <video
                  src={item.url}
                  controls
                  preload="metadata"
                  playsInline
                  className="h-full w-full object-cover"
                />
              ) : (
                <img
                  src={item.url}
                  alt={`Work sample ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              )}
              <button
                type="button"
                aria-label={`Remove media ${index + 1}`}
                onClick={() =>
                  removeMedia(index)
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
            <span className="text-[9px] tracking-widest">Add photos/Video</span>
          </button>
          <input
            ref={photoInput}
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={addMedia}
            className="hidden"
          />
        </div>
      </SettingsTabCard>

      {saveError && (
        <p
          role="alert"
          className="mx-3 my-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600"
        >
          {saveError}
        </p>
      )}
      <div className="mx-3 my-3 text-right text-[10px] text-[#777777]" aria-live="polite">
        {isSaving ? "Saving changes..." : ""}
      </div>

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
            options: ["Beauty & Personal Care"],
          },
        ]}
        values={businesses}
        onClose={() => setBusinessEditorOpen(false)}
        onSave={async (values) => {
          const nextBusinesses = { ...businesses, ...values };
          if (await saveSettings({ nextBusinesses })) {
            setBusinesses(nextBusinesses);
            setBusinessEditorOpen(false);
          }
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
