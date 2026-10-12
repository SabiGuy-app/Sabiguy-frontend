import { IoIosArrowBack } from "react-icons/io";
import BusinessSetupLayout from "../ServiceProvider/BusinessSetupLayout";
import { useEffect, useState } from "react";
import { Check, ChevronDown, CloudUpload, Plus, X } from "lucide-react";
import {
  saveBusinessServiceDetails,
  uploadBusinessWorkVisual,
} from "../../../api/business";
import { BEAUTY_SERVICE_OPTIONS } from "../../../constants/beautyServices";

const BUSINESS_SERVICE_DRAFT_KEY = "business-service-details-draft";

function readBusinessServiceDraft() {
  try {
    const stored = localStorage.getItem(BUSINESS_SERVICE_DRAFT_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

const DEFAULT_SERVICES = BEAUTY_SERVICE_OPTIONS;

const SERVICE_LOCATIONS = [
  { id: "walk-in-salon", name: "Walk in Salon", value: "Walk in Salon" },
  { id: "customer-address", name: "Customer Address", value: "Customer Address" },
];

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

export default function BeautyAndPersonalCare({ onBack, onNext }) {
  const draft = readBusinessServiceDraft();
  const [services, setServices] = useState(
    () => draft?.services || DEFAULT_SERVICES,
  );
  const [selectedServices, setSelectedServices] = useState(
    () =>
      draft?.selectedServices ||
      DEFAULT_SERVICES.slice(0, 5).map((service) => service.id),
  );
  const [newService, setNewService] = useState("");
  const [addingService, setAddingService] = useState(false);
  const [selectedLocations, setSelectedLocations] = useState(
    () => draft?.selectedLocations || SERVICE_LOCATIONS.map((item) => item.value),
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

  useEffect(() => {
    try {
      localStorage.setItem(
        BUSINESS_SERVICE_DRAFT_KEY,
        JSON.stringify({
          services,
          selectedServices,
          selectedLocations,
          studioPictures,
          openingTime,
          closingTime,
          selectedDays,
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
  ]);

  const toggleService = (id) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const addService = () => {
    const name = newService.trim();
    if (!name) return;

    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    setServices((prev) =>
      prev.some((service) => service.id === id || service.name === name)
        ? prev
        : [...prev, { id, name }],
    );
    setSelectedServices((prev) => (prev.includes(id) ? prev : [...prev, id]));
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
        files.map((file) => uploadBusinessWorkVisual(email, file)),
      );
      setStudioPictures((prev) => [...prev, ...urls.filter(Boolean)]);
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message ||
          "Failed to upload studio image(s). Please try again.",
      );
    } finally {
      setUploadingPictures(false);
      event.target.value = "";
    }
  };

  const handleSaveAndContinue = async () => {
    setErrorMessage("");
    if (uploadingPictures) {
      setErrorMessage("Please wait for studio images to finish uploading.");
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

    const selectedServiceNames = services
      .filter((service) => selectedServices.includes(service.id))
      .map((service) => service.name);

    setSubmitting(true);
    try {
      await saveBusinessServiceDetails({
        service: selectedServiceNames.map((serviceName) => ({ serviceName })),
        availableDays: selectedDays.map((day) => DAY_LABELS[day]),
        businessHours: {
          start: timeTo24Hour(openingTime),
          end: timeTo24Hour(closingTime),
        },
        servicePlace: selectedLocations,
        studioImages: [{ pictures: studioPictures, videos: [] }],
      });
      localStorage.removeItem(BUSINESS_SERVICE_DRAFT_KEY);
      onNext?.();
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message ||
          "Unable to save your business service details. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

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

        <h2 className="text-[20px] font-semibold text-[#231F20]">Services</h2>
        <p className="mt-3 max-w-[430px] text-[15px] leading-6 text-[#231F20BF]">
          We just need a few documents to confirm your business details and get
          you set up on SabiGuy.
        </p>

        <div className="mt-6 space-y-6">
          <section>
            <h3 className="text-sm font-semibold text-[#231F20]">
              Business category
            </h3>
            <div className="mt-3 flex h-14 items-center rounded border border-[#231F201A] bg-[#231F200D] px-4 text-sm text-[#231F20BF]">
              Beauty &amp; Personal Care
            </div>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-[#231F20]">
              Services you provide
            </h3>
            <p className="mt-1 text-sm text-[#231F20BF]">
              Choose all the services your business offers.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              {services.map((service) => {
                const isSelected = selectedServices.includes(service.id);

                return (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => toggleService(service.id)}
                    className={`inline-flex h-8 items-center gap-2 rounded-full border px-4 text-xs font-medium transition ${
                      isSelected
                        ? "border-[#34805A] bg-[#34805A] text-white"
                        : "border-[#231F2026] bg-white text-[#231F20BF]"
                    }`}
                  >
                    {isSelected ? <Check size={14} /> : <Plus size={14} />}
                    {service.name}
                  </button>
                );
              })}
              {addingService ? (
                <span className="inline-flex h-8 items-center gap-2 rounded-full border border-[#231F2026] bg-white px-3">
                  <input
                    autoFocus
                    value={newService}
                    onChange={(event) => setNewService(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") addService();
                      if (event.key === "Escape") setAddingService(false);
                    }}
                    className="w-28 bg-transparent text-xs outline-none"
                    placeholder="Service"
                  />
                  <button
                    type="button"
                    onClick={addService}
                    className="text-xs font-semibold text-[#34805A]"
                  >
                    Add
                  </button>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setAddingService(true)}
                  className="inline-flex h-8 items-center gap-2 rounded-full border border-[#231F2026] bg-white px-4 text-xs font-medium text-[#231F20BF]"
                >
                  <Plus size={14} />
                  Add service
                </button>
              )}
            </div>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-[#231F20]">
              Business Hours
            </h3>
            <p className="mt-1 text-sm text-[#231F20BF]">
              Set when customers can book your services.
            </p>

            <label className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#34805A]">
              <input
                type="radio"
                checked
                readOnly
                className="h-4 w-4 accent-[#34805A]"
              />
              Every day
            </label>

            <div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-end gap-3">
              <label className="text-xs text-[#231F20BF]">
                Opening time
                <span className="relative mt-2 block">
                  <select
                    value={openingTime}
                    onChange={(event) => setOpeningTime(event.target.value)}
                    className="h-10 w-full appearance-none rounded-lg border border-[#231F201A] bg-white px-3 pr-8 text-xs text-[#231F20] outline-none"
                  >
                    {TIME_OPTIONS.map((time) => (
                      <option key={`open-${time}`} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={15}
                    className="pointer-events-none absolute right-3 top-3 text-[#231F20BF]"
                  />
                </span>
              </label>
              <span className="pb-2 text-[#231F2040]">-</span>
              <label className="text-xs text-[#231F20BF]">
                Closing time
                <span className="relative mt-2 block">
                  <select
                    value={closingTime}
                    onChange={(event) => setClosingTime(event.target.value)}
                    className="h-10 w-full appearance-none rounded-lg border border-[#231F201A] bg-white px-3 pr-8 text-xs text-[#231F20] outline-none"
                  >
                    {TIME_OPTIONS.map((time) => (
                      <option key={`close-${time}`} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={15}
                    className="pointer-events-none absolute right-3 top-3 text-[#231F20BF]"
                  />
                </span>
              </label>
            </div>

            <div className="mt-3">
              <p className="text-xs text-[#231F20BF]">Available days</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {DAYS_OF_WEEK.map((day) => {
                  const isSelected = selectedDays.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`h-7 rounded-full border px-3 text-xs transition ${
                        isSelected
                          ? "border-[#34805A] bg-[#34805A] text-white"
                          : "border-[#231F201A] bg-white text-[#231F20BF]"
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-[#231F20]">
              Where do you provide your service
            </h3>
            <p className="mt-1 text-sm text-[#231F20BF]">
              Select all that apply
            </p>
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

          <section>
            <h3 className="text-sm font-semibold text-[#231F20]">
              Photos of your studio space
            </h3>
            <p className="mt-1 text-sm text-[#231F20BF]">
              Photos of your salon or studio space (inside &amp; outside).
            </p>

            <div className="relative mt-4 flex min-h-32 flex-col items-center justify-center rounded border border-dashed border-[#231F2040] bg-white px-4 py-8">
              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/jpg"
                onChange={handlePictureUpload}
                className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                disabled={uploadingPictures}
              />
              <CloudUpload
                size={34}
                className="text-[#34805A]"
                strokeWidth={1.5}
              />
              <p className="mt-5 text-sm text-[#231F20BF]">
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
                      alt="Studio"
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
                      aria-label="Remove studio image"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

          <div className="grid grid-cols-2 gap-4 pt-4">
            <button
              type="button"
              onClick={onBack}
              className="h-12 rounded-lg border border-[#34805A] bg-white text-sm font-semibold text-[#34805A]"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleSaveAndContinue}
              disabled={submitting || uploadingPictures}
              className="h-12 rounded-lg bg-[#34805A] text-sm font-semibold text-white disabled:opacity-60"
            >
              {submitting ? "Saving..." : "Complete"}
            </button>
          </div>
        </div>
      </div>
    </BusinessSetupLayout>
  );
}
