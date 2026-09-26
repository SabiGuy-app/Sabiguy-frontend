import BusinessSetupLayout from "../ServiceProvider/BusinessSetupLayout";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import Button from "../../../components/button";
import InputField from "../../../components/InputField";
import UploadBox from "../../../components/uploadBox";
import SelectionChip from "../../../components/SelectionChip";
import {
  saveBusinessServiceDetails,
  uploadBusinessWorkVisual,
} from "../../../api/business";

const BUSINESS_SERVICE_DRAFT_KEY = "business-service-details-draft";

function readBusinessServiceDraft() {
  try {
    const stored = localStorage.getItem(BUSINESS_SERVICE_DRAFT_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

const BeautyAndPersonalCare = ({ onBack, onNext }) => {
  const draft = readBusinessServiceDraft();
  const services = [
    { id: 1, name: "Barbing" },
    { id: 2, name: "Hair Dresser" },
    { id: 3, name: "Spa" },
    { id: 4, name: "Lash Tech." },
    { id: 5, name: "Pedicure" },
    { id: 6, name: "Nails Tech." },
  ];

  const [selectedServices, setSelectedServices] = useState(
    () => draft?.selectedServices || [],
  );
  const [selectedLocations, setSelectedLocations] = useState(
    () => (draft?.selectedLocations || []).filter((location) =>
      ["walk_in_salon", "customer_address"].includes(location),
    ),
  );
  const [studioPictures, setStudioPictures] = useState(
    () => draft?.studioPictures || [],
  );
  const [uploadingPictures, setUploadingPictures] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Handlers
  const toggleLocation = (value) => {
    setSelectedLocations((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  };

  const businessData = {
    businessCategory: "Beauty & Personal Care",

    businessHours: {
      openingTime: "09:00 AM",
      closingTime: "06:00 PM",
    },

    serviceLocations: [
      { id: 1, name: "Walk in Salon", value: "walk_in_salon" },
      { id: 2, name: "Customer Address", value: "customer_address" },
    ],

  };

  const [openingTime, setOpeningTime] = useState(
    () => draft?.openingTime || businessData.businessHours.openingTime,
  );
  const [closingTime, setClosingTime] = useState(
    () => draft?.closingTime || businessData.businessHours.closingTime,
  );
  const [selectedDays, setSelectedDays] = useState(
    () => draft?.selectedDays || [],
  );

  // Keep manual hours active while the schedule selector is hidden.
  // const [hoursMode, setHoursMode] = useState(() => draft?.hoursMode || "every_day");
  const hoursMode = "every_day";

  useEffect(() => {
    try {
      localStorage.setItem(
        BUSINESS_SERVICE_DRAFT_KEY,
        JSON.stringify({
          selectedServices,
          selectedLocations,
          studioPictures,
          openingTime,
          closingTime,
          selectedDays,
          hoursMode,
        }),
      );
    } catch {
      // Ignore storage quota or privacy-mode errors.
    }
  }, [
    selectedServices,
    selectedLocations,
    studioPictures,
    openingTime,
    closingTime,
    selectedDays,
    hoursMode,
  ]);

  const timeOptions = [
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
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const dayLabels = {
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

  const toggleDay = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  const toggleService = (id) => {
    const isSelected = selectedServices.includes(id);

    setSelectedServices((prev) =>
      isSelected
        ? prev.filter((serviceId) => serviceId !== id)
        : [...prev, id],
    );
  };

  const uploadPicture = async (file) => {
    const email = localStorage.getItem("email") || localStorage.getItem("google-email");
    if (!email) throw new Error("Your session has expired. Please sign in again.");
    return uploadBusinessWorkVisual(email, file);
  };

  const canContinue = selectedServices.length > 0 && selectedLocations.length > 0 &&
    selectedDays.length > 0 && Boolean(openingTime && closingTime) && studioPictures.length > 0;

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
    if (!selectedLocations.length) {
      setErrorMessage("Please select at least one service location.");
      return;
    }
    if (hoursMode !== "always" && !selectedDays.length) {
      setErrorMessage("Please select at least one available day.");
      return;
    }
    if (!studioPictures.length) {
      setErrorMessage("Please upload at least one photo of your studio space.");
      return;
    }

    const service = selectedServices.map((id) => ({
      serviceName: services.find((item) => item.id === id)?.name,
    }));

    setSubmitting(true);
    try {
      await saveBusinessServiceDetails({
        service,
        availableDays: (hoursMode === "always" ? daysOfWeek : selectedDays).map((day) => dayLabels[day]),
        businessHours: {
          start: hoursMode === "always" ? "00:00" : timeTo24Hour(openingTime),
          end: hoursMode === "always" ? "23:59" : timeTo24Hour(closingTime),
        },
        servicePlace: businessData.serviceLocations
          .filter((location) => selectedLocations.includes(location.value))
          .map((location) => location.name),
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
    <BusinessSetupLayout currentStep={2} contentClassName="!items-start !px-0 !py-6 md:!px-10 md:!py-0 md:-mt-3.5">
      <div className="flex flex-col gap-6 text-[#231F20]">
        <InputField
          label="Business category"
          name="businessCategory"
          value={businessData.businessCategory}
          readOnly
          inputClassName="!mt-1 !h-16 !rounded-[10px] !border-[#231F2026] !bg-[#F5F5F5] !text-[#231F20BF]"
        />

        <section aria-labelledby="business-services-heading">
          <h2 id="business-services-heading" className="font-semibold">Services you provide</h2>
          <p className="mt-1.5 text-[#231F20BF]">Choose all the services your business offers.</p>
          <div className="mt-5 flex flex-wrap gap-x-3 gap-y-5">
            {services.map((service) => (
              <SelectionChip key={service.id} selected={selectedServices.includes(service.id)}
                onClick={() => toggleService(service.id)} disabled={submitting}>
                {service.name}
              </SelectionChip>
            ))}
          </div>
        </section>

        <section aria-labelledby="business-hours-heading">
          <h2 id="business-hours-heading" className="font-semibold">Business Hours</h2>
          <p className="mt-1.5 text-[#231F20BF]">Set when customers can book your services.</p>
          {/* <fieldset className="mt-5 flex gap-6" disabled={submitting}>
            <legend className="sr-only">Business hours schedule</legend>
            {[["every_day", "Every day"], ["always", "24/7"]].map(([value, label]) => (
              <label key={value} className={`flex cursor-pointer items-center gap-2 ${hoursMode === value ? "font-medium text-[#005823BF]" : "text-[#231F20BF]"}`}>
                <input type="radio" name="hoursMode" value={value} checked={hoursMode === value}
                  onChange={() => setHoursMode(value)} className="h-4 w-4 accent-[#005823]" />
                {label}
              </label>
            ))}
          </fieldset> */}
          <div className={`mt-3 flex max-w-[388px] items-end gap-3 ${hoursMode === "always" ? "pointer-events-none opacity-50" : ""}`}
            inert={hoursMode === "always" ? true : undefined}>
            <InputField select singleChevron name="openingTime" labelClassName="!text-sm !font-normal !text-[#231F20BF]" label="Opening time" value={hoursMode === "always" ? "00:00" : openingTime}
              options={hoursMode === "always" ? [{ value: "00:00", label: "12:00 AM" }] : timeOptions.map((time) => ({ value: time, label: time }))}
              onChange={(option) => setOpeningTime(option.value)} inputClassName="!h-11 !border-[#231F2026] !bg-white !px-3 !py-2 !text-xs" />
            <span aria-hidden="true" className="pb-3 text-[#231F20BF]">&ndash;</span>
            <InputField select singleChevron name="closingTime" labelClassName="!text-sm !font-normal !text-[#231F20BF]" label="Closing time" value={hoursMode === "always" ? "23:59" : closingTime}
              options={hoursMode === "always" ? [{ value: "23:59", label: "11:59 PM" }] : timeOptions.map((time) => ({ value: time, label: time }))}
              onChange={(option) => setClosingTime(option.value)} inputClassName="!h-11 !border-[#231F2026] !bg-white !px-3 !py-2 !text-xs" />
          </div>
          <p className="mt-1.5 text-sm text-[#231F20BF]">Available days</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {daysOfWeek.map((day) => (
              <SelectionChip key={day} selected={hoursMode === "always" || selectedDays.includes(day)} showIcon={false}
                disabled={hoursMode === "always" || submitting} onClick={() => toggleDay(day)}>
                {day}
              </SelectionChip>
            ))}
          </div>
        </section>

        <section aria-labelledby="service-location-heading">
          <h2 id="service-location-heading" className="font-semibold">Where do you provide your service</h2>
          <p className="mt-1.5 text-[#231F20BF]">Select all that apply</p>
          <div className="mt-5 flex flex-wrap gap-3">
            {businessData.serviceLocations.map((location) => (
              <SelectionChip key={location.id} selected={selectedLocations.includes(location.value)}
                disabled={submitting} onClick={() => toggleLocation(location.value)}>
                {location.name}
              </SelectionChip>
            ))}
          </div>
        </section>

        <section aria-labelledby="studio-photos-heading">
          <h2 id="studio-photos-heading" className="font-semibold">Photos of your studio space</h2>
          <p className="mb-3 mt-3 text-sm text-[#231F20BF]">Upload at least one photo of your salon or studio space (inside &amp; outside).</p>
          <UploadBox uploadFile={uploadPicture} accept="image/jpeg,image/png,application/pdf"
            disabled={submitting} prompt="Upload pictures" formatHint="JPEG, PNG, PDF format, Max 5 MB each"
            className="!rounded-md !border !border-[#231F2066] !px-4 !py-6 [&_svg]:h-10 [&_svg]:w-10 [&_svg]:stroke-[1.5] [&_svg]:text-[#005823] [&_p:first-of-type]:pt-4 [&_p:first-of-type]:text-base [&_p:last-of-type]:text-xs"
            onUploadStart={() => { setUploadingPictures(true); setErrorMessage(""); }}
            onUploadEnd={() => setUploadingPictures(false)} onError={setErrorMessage}
            onUploadComplete={(urls) => setStudioPictures((prev) => [...prev, ...urls])} />
          {studioPictures.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-3">
              {studioPictures.map((picture, index) => (
                <li key={`${picture}-${index}`} className="relative flex h-20 w-20 items-center justify-center rounded-lg border border-gray-200">
                  {/\.pdf(?:[?#]|$)/i.test(picture)
                    ? <a href={picture} target="_blank" rel="noreferrer" className="text-sm text-[#005823]">View PDF</a>
                    : <img src={picture} alt={`Studio photo ${index + 1}`} className="h-full w-full rounded-lg object-cover" />}
                  <button type="button" aria-label={`Remove studio file ${index + 1}`} disabled={submitting}
                    onClick={() => setStudioPictures((prev) => prev.filter((_, itemIndex) => itemIndex !== index))}
                    className="absolute right-1 top-1 rounded-full bg-white p-1 text-gray-600">
                    <X size={14} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {errorMessage && <p role="alert" className="text-sm text-red-600">{errorMessage}</p>}
        <div className="mt-4 flex justify-end gap-6">
          <Button type="button" variant="ghost" size="sm" onClick={onBack} disabled={submitting || uploadingPictures}
            className="h-[54px] min-w-[105px] rounded-lg border border-[#005823] px-6 text-sm font-medium text-[#005823] transition-colors hover:bg-[#F5F8F6] focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50">Back</Button>
          <Button type="button" size="sm" onClick={handleSaveAndContinue} disabled={!canContinue || submitting || uploadingPictures}
            className="h-[54px] min-w-[141px] rounded-lg bg-[#005823BF] px-6 text-sm font-medium text-white transition-colors hover:bg-[#005823] focus-visible:outline-2 focus-visible:outline-offset-2 disabled:bg-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed disabled:hover:bg-gray-300">
            {submitting ? "Saving..." : "Complete"}
          </Button>
        </div>
      </div>
    </BusinessSetupLayout>
  );
};

export default BeautyAndPersonalCare;
