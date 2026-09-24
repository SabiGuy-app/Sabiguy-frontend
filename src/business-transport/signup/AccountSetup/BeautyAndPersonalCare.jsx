import { IoIosArrowBack } from "react-icons/io";
import BusinessSetupLayout from "../ServiceProvider/BusinessSetupLayout";
import { useEffect, useState } from "react";
import { Check, ChevronDown, CloudUpload, Plus, X } from "lucide-react";
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
    { id: 1, name: "Braiding" },
    { id: 2, name: "Hair Dresser" },
    { id: 3, name: "Spa" },
    { id: 4, name: "Lash Tech" },
    { id: 5, name: "Pedicure" },
    { id: 6, name: "Nails Tech" },
  ];

  const [selectedServices, setSelectedServices] = useState(
    () => draft?.selectedServices || [],
  );
  const [serviceDetails, setServiceDetails] = useState(
    () => draft?.serviceDetails || {},
  );
  const [selectedLocations, setSelectedLocations] = useState(
    () => draft?.selectedLocations || [],
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

    services: [
      { id: 1, name: "Braiding", status: false },
      { id: 2, name: "Hair Dresser", status: false },
      { id: 3, name: "Spa", status: false },
      { id: 4, name: "Lash Tech", status: false },
      { id: 5, name: "Pedicure", status: false },
      { id: 6, name: "Nails Tech", status: false },
    ],

    businessHours: {
      openingTime: "09:00 AM",
      closingTime: "06:00 PM",
    },

    serviceLocations: [
      {
        id: 1,
        name: "Customer Address",
        value: "customer_address",
      },
      {
        id: 2,
        name: "Walk in Salon",
        value: "walk_in_salon",
      },
      {
        id: 3,
        name: "My Home Address",
        value: "my_home_address",
      },
    ],

    photos: [],
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

  useEffect(() => {
    try {
      localStorage.setItem(
        BUSINESS_SERVICE_DRAFT_KEY,
        JSON.stringify({
          selectedServices,
          serviceDetails,
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
    selectedServices,
    serviceDetails,
    selectedLocations,
    studioPictures,
    openingTime,
    closingTime,
    selectedDays,
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

    setServiceDetails((prev) => {
      if (isSelected) {
        const next = { ...prev };
        delete next[id];
        return next;
      }

      return {
        ...prev,
        [id]: prev[id] || { pricingModel: "", price: "" },
      };
    });
  };

  const updateServiceDetail = (id, field, value) => {
    setServiceDetails((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const handlePictureUpload = async (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    const email = localStorage.getItem("email") || localStorage.getItem("google-email");
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
    if (!selectedLocations.length) {
      setErrorMessage("Please select at least one service location.");
      return;
    }
    if (!selectedDays.length) {
      setErrorMessage("Please select at least one available day.");
      return;
    }

    const service = selectedServices.map((id) => ({
      serviceName: services.find((item) => item.id === id)?.name,
      pricingModel: serviceDetails[id]?.pricingModel || "",
      price: serviceDetails[id]?.price ?? "",
    }));
    const missingPricing = service.filter(
      (item) =>
        !item.serviceName ||
        !String(item.pricingModel).trim() ||
        item.price === "" ||
        item.price === null ||
        item.price === undefined,
    );
    if (missingPricing.length > 0) {
      setErrorMessage(
        `Please complete pricing for: ${missingPricing
          .map((item) => item.serviceName || "selected service")
          .join(", ")}.`,
      );
      return;
    }

    setSubmitting(true);
    try {
      await saveBusinessServiceDetails({
        service,
        availableDays: selectedDays.map((day) => dayLabels[day]),
        businessHours: {
          start: timeTo24Hour(openingTime),
          end: timeTo24Hour(closingTime),
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
    <BusinessSetupLayout currentStep={2}>
      <div>
        <div
          onClick={onBack}
          className="flex items-center gap-2 w-fit mb-8 cursor-pointer"
        >
          <IoIosArrowBack size={24} />
          <h2 className="text-lg">Back</h2>
        </div>
        <div>
          <h2 className="text-[20px] text-[#231F20] font-semibold mb-2">
            Verify your skill
          </h2>
          <p className="text-[#231F20BF] text-[16px] mb-6">
            Complete your verification to build trust with customers and access
            more features.
          </p>

          <div>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <h3 className="font-semibold">Business category</h3>
                <div className="border rounded-lg py-2.5 px-4 bg-[#231F200D] border-[#231F2040] h-15 flex justify-between items-center font-normal text-[#231F20BF]">
                  {businessData.businessCategory}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex flex-col gap-1.5">
                  <h3 className="font-semibold">Services you provide</h3>
                  <p className="text-[#231F20BF]">
                    Choose all the services your business offers.
                  </p>
                  <div className="w-full flex gap-3 flex-wrap">
                    {services.map((service) => {
                      const isSelected = selectedServices.includes(service.id);

                      return (
                        <button
                          onClick={() => toggleService(service.id)}
                          className={`inline-flex items-center gap-2 rounded-full border px-5 py-2 text-sm font-medium transition-all duration-200
                           ${
                             isSelected
                               ? "border-[#34805A] bg-[#34805A] text-white"
                               : "border-gray-300 bg-white text-gray-700 hover:border-[#34805A] hover:text-[#34805A]"
                           }`}
                          type="button"
                          key={service.id}
                        >
                          {isSelected ? (
                            <Check size={18} strokeWidth={2} />
                          ) : (
                            <Plus size={18} strokeWidth={2} />
                          )}
                          {service.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <h3 className="font-semibold">Business Hours</h3>
                <p className="text-[#231F20BF]">
                  Set when customers can book your services.
                </p>

                {/* Business Hours */}
                <div className="flex flex-col gap-5 mt-2">
                  {/* Times */}
                  <div className="flex w-full items-end gap-3">
                    <div className="flex w-full flex-col gap-1.5">
                      <label className="text-[15px] text-gray-600">
                        Opening time
                      </label>
                      <div className="relative w-full">
                        <select
                          value={openingTime}
                          onChange={(e) => setOpeningTime(e.target.value)}
                          className="w-full appearance-none rounded-lg border border-[#231F2040] bg-white px-4 py-2.5 text-[15px] text-gray-700 outline-none transition-all focus:border-[#3B82F6] disabled:bg-gray-100 disabled:opacity-70 cursor-pointer"
                        >
                          {timeOptions.map((time) => (
                            <option key={`open-${time}`} value={time}>
                              {time}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
                          <ChevronDown size={18} strokeWidth={2} />
                        </div>
                      </div>
                    </div>

                    <div className="mb-3 text-gray-400">—</div>

                    <div className="flex w-full flex-col gap-1.5">
                      <label className="text-[15px] text-gray-600">
                        Closing time
                      </label>
                      <div className="relative w-full">
                        <select
                          value={closingTime}
                          onChange={(e) => setClosingTime(e.target.value)}
                          className="w-full appearance-none rounded-lg border border-[#231F2040] bg-white px-4 py-2.5 text-[15px] text-gray-700 outline-none transition-all focus:border-[#3B82F6] disabled:bg-gray-100 disabled:opacity-70 cursor-pointer"
                        >
                          {timeOptions.map((time) => (
                            <option key={`close-${time}`} value={time}>
                              {time}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
                          <ChevronDown size={18} strokeWidth={2} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Available Days */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[15px] text-gray-600">
                      Available days
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {daysOfWeek.map((day) => {
                        const isSelected = selectedDays.includes(day);
                        return (
                          <button
                            key={day}
                            type="button"
                            onClick={() => toggleDay(day)}
                            className={`min-w-[52px] rounded-full px-2.5 py-1 text-[14px] transition-all disabled:opacity-60 ${
                              isSelected
                                ? "border border-[#34805A] bg-[#34805A] text-white"
                                : "border border-gray-300 bg-white text-gray-600 hover:border-[#34805A] hover:text-[#34805A]"
                            }`}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div>
                      <h3 className="font-semibold">Pricing per service</h3>
                      <p className="text-sm text-gray-500">
                        Complete the pricing model and price for every selected service.
                      </p>
                    </div>
                    {selectedServices.map((id) => {
                      const service = services.find((item) => item.id === id);
                      return (
                        <div key={id} className="grid gap-3 md:grid-cols-3">
                          <span className="flex items-center rounded-lg bg-gray-100 px-3 py-2 text-sm">
                            {service?.name}
                          </span>
                          <select
                            value={serviceDetails[id]?.pricingModel || ""}
                            onChange={(event) =>
                              updateServiceDetail(id, "pricingModel", event.target.value)
                            }
                            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                          >
                            <option value="">Pricing model</option>
                            <option value="fixed">Fixed</option>
                            <option value="project">Per Project</option>
                            <option value="daily">Per Day</option>
                            <option value="hourly">Per Hour</option>
                            <option value="unit">Per Unit</option>
                          </select>
                          <input
                            type="number"
                            min="0"
                            placeholder="Price"
                            value={serviceDetails[id]?.price ?? ""}
                            onWheel={(event) => event.currentTarget.blur()}
                            onChange={(event) =>
                              updateServiceDetail(id, "price", event.target.value)
                            }
                            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                          />
                        </div>
                      );
                    })}
                  </div>

                  {/* Where do you provide your service */}
                  <div className="flex flex-col gap-3 mt-4">
                    <div>
                      <h3 className="font-semibold text-[#231F20]">
                        Where do you provide your service
                      </h3>
                      <p className="text-[#231F20BF] text-sm mt-1">
                        Select all that apply
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-3 mt-1">
                      {businessData.serviceLocations.map((location) => {
                        const isSelected = selectedLocations.includes(
                          location.value,
                        );
                        return (
                          <button
                            key={location.id}
                            type="button"
                            onClick={() => toggleLocation(location.value)}
                            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 ${
                              isSelected
                                ? "border-[#34805A] bg-[#34805A] text-white"
                                : "border-gray-300 bg-white text-gray-700 hover:border-[#34805A] hover:text-[#34805A]"
                            }`}
                          >
                            {isSelected ? (
                              <Check size={16} strokeWidth={2.5} />
                            ) : (
                              <Plus size={16} strokeWidth={2.5} />
                            )}
                            {location.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Photos of your work */}
                  <div className="flex flex-col gap-3 mt-4">
                    <div>
                      <h3 className="font-semibold text-[#231F20] flex gap-1">
                        Photos of your work
                        <span className="text-[#231F20BF] font-normal">
                          (optional)
                        </span>
                      </h3>
                      <p className="text-[#231F20BF] text-sm mt-1">
                        Upload clear photos that show your work or tools.
                      </p>
                    </div>

                    {/* Upload Dropzone */}
                    <div className="relative mt-2 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-400 bg-white py-10 transition-all hover:bg-gray-50">
                      <input
                        type="file"
                        multiple
                        accept="image/jpeg,image/png,image/jpg"
                        onChange={handlePictureUpload}
                        className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                        disabled={uploadingPictures}
                      />

                      <div className="flex flex-col items-center justify-center gap-3">
                        <CloudUpload
                          size={36}
                          className="text-[#34805A]"
                          strokeWidth={1.5}
                        />

                        <p className="text-base text-gray-700">
                          Upload pictures
                          <span className="font-semibold text-[#34805A]">
                            Browse
                          </span>
                        </p>

                        <p className="text-xs md:text-sm text-gray-400">
                          JPEG, PNG, PDF format, Max 5 MB each
                        </p>
                      </div>
                    </div>
                    {studioPictures.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {studioPictures.map((picture) => (
                          <div key={picture} className="relative h-20 w-20">
                            <img src={picture} alt="Studio work" className="h-full w-full rounded-lg object-cover" />
                            <button
                              type="button"
                              onClick={() => setStudioPictures((prev) => prev.filter((item) => item !== picture))}
                              className="absolute right-1 top-1 rounded-full bg-white p-1 text-gray-600"
                              aria-label="Remove studio image"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Bottom Action Buttons */}
                  <div className="mt-12 flex justify-end gap-4 border-t border-gray-100 pt-6">
                    <button
                      type="button"
                      onClick={onBack}
                      className="rounded-lg border border-[#34805A] bg-white px-8 py-2.5 font-semibold text-[#34805A] transition-all hover:bg-green-50"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveAndContinue}
                      disabled={submitting || uploadingPictures}
                      className="rounded-lg bg-[#34805A] px-8 py-2.5 font-semibold text-white transition-all hover:bg-[#296647]"
                    >
                      {submitting ? "Saving..." : "Save & Continue"}
                    </button>
                  </div>
                  {errorMessage && (
                    <p className="mt-3 text-sm text-red-600">{errorMessage}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BusinessSetupLayout>
  );
};

export default BeautyAndPersonalCare;
