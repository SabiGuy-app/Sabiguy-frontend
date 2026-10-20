import { IoIosArrowBack } from "react-icons/io";
import { useEffect, useRef, useState } from "react";
import { Check, CloudUpload, Plus, X } from "lucide-react";
import InputField from "../InputField";
import BusinessRegistrationFields from "./BusinessRegistrationFields";
import ServiceLocationFields from "./ServiceLocationFields";
import { SERVICE_LOCATIONS } from "../../constants/serviceLocations";
function readBusinessServiceDraft(draftKey) {
  try {
    const stored = localStorage.getItem(draftKey);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}



const TIME_OPTIONS = [
  "07:00 AM",
  "08:00 AM",
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
  "07:00 PM",
  "08:00 PM",
];

const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const TIME_SELECT_OPTIONS = TIME_OPTIONS.map((time) => ({ label: time, value: time }));
const DAY_LABELS = {
  Mon: "Monday",
  Tue: "Tuesday",
  Wed: "Wednesday",
  Thu: "Thursday",
  Fri: "Friday",
  Sat: "Saturday",
  Sun: "Sunday",
};

const timeTo24Hour = (time) => {
  const [value, period] = time.split(" ");
  let [hours, minutes] = value.split(":").map(Number);
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
};

export default function CategoryServiceForm({
  category,
  categoryLabel,
  serviceOptions,
  onBack,
  onNext,
  onSave,
  onUpload,
  draftScope = "business",
  categoryHeading = "Business category",
  servicesDescription = "Choose all the services your business offers.",
  showRegistration = false,
}) {
  const draftKey = `${draftScope}-service-details-draft-${category}`;
  const draft = readBusinessServiceDraft(draftKey);
  const DEFAULT_SERVICES = serviceOptions;
  const [services, setServices] = useState(
    () => draft?.services || DEFAULT_SERVICES,
  );
  const [selectedServices, setSelectedServices] = useState(
    () =>
      draft?.selectedServices ||
      DEFAULT_SERVICES.slice(0, 5).map((service) => service.id),
  );
  const servicesRef = useRef(services);
  const selectedServicesRef = useRef(selectedServices);
  const [newService, setNewService] = useState("");
  const [addingService, setAddingService] = useState(false);
  const [selectedLocations, setSelectedLocations] = useState(
    () =>
      draft?.selectedLocations || SERVICE_LOCATIONS.map((item) => item.value),
  );
  const [studioPictures, setStudioPictures] = useState(
    () => draft?.studioPictures || [],
  );
  const [openingTime, setOpeningTime] = useState(
    () => draft?.openingTime || "09:00 AM",
  );
  const [closingTime, setClosingTime] = useState(
    () => draft?.closingTime || "06:00 PM",
  );
  const [selectedDays, setSelectedDays] = useState(
    () => draft?.selectedDays || DAYS_OF_WEEK.slice(0, 6),
  );
  const [uploadingPictures, setUploadingPictures] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [registration, setRegistration] = useState(() => draft?.registration || {
    isRegistered: null, BusinessName: "", BusinessAddress: "", cacFile: "", cacFileName: "",
  });
  const [uploadingCertificate, setUploadingCertificate] = useState(false);
  const setRegistrationField = (name, value) => setRegistration((previous) => ({ ...previous, [name]: value }));
  const isFormComplete = selectedServices.some((id) => services.some((service) => service.id === id && service.name.trim())) &&
    selectedDays.length > 0 && selectedLocations.length > 0 &&
    TIME_OPTIONS.includes(openingTime) && TIME_OPTIONS.includes(closingTime);

  useEffect(() => {
    try {
      localStorage.setItem(
        draftKey,
        JSON.stringify({
          services,
          selectedServices,
          selectedLocations,
          studioPictures,
          openingTime,
          closingTime,
          selectedDays,
          ...(showRegistration ? { registration } : {}),
        }),
      );
    } catch {
      // Ignore storage quota or privacy-mode errors.
    }
  }, [
    services,
    selectedServices,
    selectedLocations,
    studioPictures,
    openingTime,
    closingTime,
    selectedDays,
    draftKey,
    registration,
    showRegistration,
  ]);

  const toggleService = (id) => {
    const current = selectedServicesRef.current;
    const next = current.includes(id)
      ? current.filter((item) => item !== id)
      : [...current, id];
    selectedServicesRef.current = next;
    setSelectedServices(next);
  };

  const addService = () => {
    const name = newService.trim();
    if (!name) return;

    const normalizedName = name.toLocaleLowerCase();
    const existingService = servicesRef.current.find(
      (service) => service.name.trim().toLocaleLowerCase() === normalizedName,
    );
    const id =
      existingService?.id ||
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") ||
      `custom-${Date.now()}`;

    if (!existingService) {
      const nextServices = [...servicesRef.current, { id, name }];
      servicesRef.current = nextServices;
      setServices(nextServices);
    }
    const currentSelection = selectedServicesRef.current;
    const nextSelection = currentSelection.includes(id)
      ? currentSelection
      : [...currentSelection, id];
    selectedServicesRef.current = nextSelection;
    setSelectedServices(nextSelection);
    setNewService("");
    setAddingService(false);
  };

  const toggleDay = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((item) => item !== day) : [...prev, day],
    );
  };

  const toggleLocation = (value) => {
    setSelectedLocations((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value],
    );
  };

  const handlePictureUpload = async (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    const email =
      localStorage.getItem("email") || localStorage.getItem("google-email");
    if (!email) {
      setErrorMessage("Your session has expired. Please sign in again.");
      return;
    }

    setUploadingPictures(true);
    setErrorMessage("");
    try {
      const urls = await Promise.all(
        files.map((file) => onUpload(email, file)),
      );
      setStudioPictures((prev) => [...prev, ...urls.filter(Boolean)]);
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to upload work photos. Please try again.",
      );
    } finally {
      setUploadingPictures(false);
      event.target.value = "";
    }
  };

  const handleSaveAndContinue = async () => {
    if (submitting) return;
    setErrorMessage("");
    if (uploadingPictures || uploadingCertificate) {
      setErrorMessage("Please wait for uploads to finish.");
      return;
    }
    if (!selectedServices.length) {
      setErrorMessage("Please select at least one service.");
      return;
    }
    if (!selectedDays.length) {
      setErrorMessage("Please select at least one available day.");
      return;
    }
    if (!selectedLocations.length) {
      setErrorMessage("Please select at least one service location.");
      return;
    }
    if (!isFormComplete) {
      setErrorMessage("Please select your services and opening and closing times.");
      return;
    }

    const selectedServiceNames = selectedServicesRef.current
      .map(
        (serviceId) =>
          servicesRef.current.find((service) => service.id === serviceId)?.name,
      )
      .filter(Boolean);

    setSubmitting(true);
    try {
      await onSave({
        businessCategory: categoryLabel,
        service: selectedServiceNames.map((serviceName) => ({ serviceName })),
        availableDays: selectedDays.map((day) => DAY_LABELS[day]),
        businessHours: {
          start: timeTo24Hour(openingTime),
          end: timeTo24Hour(closingTime),
        },
        servicePlace: selectedLocations,
        studioImages: [{ pictures: studioPictures, videos: [] }],
        ...(showRegistration ? {
          businessName: registration.isRegistered === true ? registration.BusinessName : "",
          businessAddress: registration.isRegistered === true ? registration.BusinessAddress : "",
          cacFile: registration.isRegistered === true ? registration.cacFile : "",
        } : {}),
      });
      localStorage.removeItem(draftKey);
      onNext?.();
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to save your service details. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={onBack}
        className="mb-8 flex w-fit items-center gap-2 text-[#005823]"
      >
        <IoIosArrowBack size={24} />
        <span className="text-lg">Back</span>
      </button>

      <h2 className="mb-2 text-xl font-semibold text-[#231F20]">Services</h2>
      <p className="mb-4 text-[#231F20BF]">
        We just need a few details and get you set up on SabiGuy.
      </p>

      <div className="mb-9 flex flex-col gap-4">
        <section>
          <h3 className="text-sm font-semibold text-[#231F20]">
            {categoryHeading}
          </h3>
          <div className="mt-3 rounded-md border border-gray-300 bg-gray-50 px-5 py-4">
            {categoryLabel}
          </div>
        </section>

        <div className="flex flex-col gap-6">
        <section className="flex flex-col gap-1.5">
          <h3 className="font-semibold">
            Services you provide
          </h3>
          <p className="text-[#231F20BF]">
            {servicesDescription}
          </p>
          <div className="flex w-full flex-wrap gap-3">
            {services.map((service) => {
              const isSelected = selectedServices.includes(service.id);

              return (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => toggleService(service.id)}
                  className={`inline-flex items-center gap-2 rounded-full border px-5 py-2 text-sm font-medium transition-all duration-200 ${
                    isSelected
                      ? "border-[#34805A] bg-[#34805A] text-white"
                      : "border-gray-300 bg-white text-gray-700 hover:border-[#34805A] hover:text-[#34805A]"
                  }`}
                >
                  {isSelected ? <Check size={18} /> : <Plus size={18} />}
                  {service.name}
                </button>
              );
            })}
            {addingService ? (
              <span className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-sm">
                <input
                  autoFocus
                  value={newService}
                  onChange={(event) => setNewService(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") addService();
                    if (event.key === "Escape") setAddingService(false);
                  }}
                  className="min-w-0 w-28 bg-transparent outline-none"
                  placeholder="Service"
                />
                <button
                  type="button"
                  onClick={addService}
                  className="font-semibold text-[#34805A]"
                >
                  Add
                </button>
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setAddingService(true)}
                className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 hover:border-[#34805A] hover:text-[#34805A]"
              >
                <Plus size={18} />
                Add service
              </button>
            )}
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <h3 className="font-semibold">
            Business Hours
          </h3>
          <p className="text-[#231F20BF]">
            Set when customers can book your services.
          </p>

          <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-end gap-3">
            <InputField label="Opening time" name="business-opening-time" select selectAnchor="bottom start"
              options={TIME_SELECT_OPTIONS} value={openingTime}
              onChange={(option) => setOpeningTime(option.value)} placeholder="Select time" />
            <div className="mb-3 text-gray-400">-</div>
            <InputField label="Closing time" name="business-closing-time" select selectAnchor="bottom start"
              options={TIME_SELECT_OPTIONS} value={closingTime}
              onChange={(option) => setClosingTime(option.value)} placeholder="Select time" />
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-[15px] text-gray-600">Available days</p>
            <div className="flex flex-wrap gap-2">
              {DAYS_OF_WEEK.map((day) => {
                const isSelected = selectedDays.includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`min-w-[52px] rounded-full border px-2.5 py-1 text-[14px] transition-all ${
                      isSelected
                        ? "border-[#34805A] bg-[#34805A] text-white"
                        : "border-gray-300 bg-white text-gray-600 hover:border-[#34805A] hover:text-[#34805A]"
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <ServiceLocationFields selectedLocations={selectedLocations} toggleLocation={toggleLocation} />

        <section className="mt-4 flex flex-col gap-3">
          <h3 className="font-semibold text-[#231F20]">
            Photos of your work space
          </h3>
          <p className="mt-1 text-sm text-[#231F20BF]">
             Upload clear photos of your shop, store, or office.
          </p>

          <div className="relative mt-2 flex min-h-[188px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-400 bg-white py-10 transition-all hover:bg-gray-50">
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/jpg"
              onChange={handlePictureUpload}
              className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
              disabled={uploadingPictures}
            />
            <CloudUpload
              size={36}
              className="text-[#34805A]"
              strokeWidth={1.5}
            />
            <p className="mt-3 text-base text-gray-700">
              Upload pictures{" "}
              <span className="font-semibold text-[#34805A]">Browse</span>
            </p>
            {uploadingPictures && (
              <p className="mt-2 text-xs text-[#231F20BF]">Uploading...</p>
            )}
          </div>

          {studioPictures.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {studioPictures.map((picture) => (
                <div key={picture} className="relative h-20 w-20">
                  <img
                    src={picture}
                    alt="Work sample"
                    className="h-full w-full rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setStudioPictures((prev) =>
                        prev.filter((item) => item !== picture),
                      )
                    }
                    className="absolute right-1 top-1 rounded-full bg-white p-1 text-gray-600"
                    aria-label="Remove work photo"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {showRegistration && (
          <BusinessRegistrationFields
            values={registration}
            setFieldValue={setRegistrationField}
            handleChange={(event) => setRegistrationField(event.target.name, event.target.value)}
            uploadFile={(file, folder) => {
              const email = localStorage.getItem("email") || localStorage.getItem("google-email");
              if (!email) return Promise.reject(new Error("Your session has expired. Please sign in again."));
              return onUpload(email, file, folder);
            }}
            onUploadingChange={setUploadingCertificate}
          />
        )}
        </div>
        {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

        <div className="mt-8 flex justify-end gap-3">
          <button
            type="button"
            onClick={handleSaveAndContinue}
            disabled={submitting || uploadingPictures || uploadingCertificate || !isFormComplete}
            className="rounded-lg bg-[#005823BF] px-6 py-2 text-white transition hover:bg-[#004e1a] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Saving..." : "Complete"}
          </button>
        </div>
      </div>
    </div>
  );
}
