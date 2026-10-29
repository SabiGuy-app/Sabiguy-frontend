import InputField from "../components/InputField";
import BusinessRegistrationFields from "../../../../components/onboarding/BusinessRegistrationFields";
import { useState } from "react";
import { Check, CloudUpload, Plus, X } from "lucide-react";

const experienceOptions = ["0-2 years", "2-5 years", "5-10 years", "10+ years"];

const experienceSelectOptions = experienceOptions.map((experience) => ({
  label: experience,
  value: experience,
}));

const experienceYears = {
  "0-2 years": 0,
  "2-5 years": 2,
  "5-10 years": 5,
  "10+ years": 10,
};

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

const timeSelectOptions = timeOptions.map((time) => ({
  label: time,
  value: time,
}));

const beautyDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const beautyLocations = [
  { value: "customer_address", label: "Customer address" },
  { value: "Walk in Salon", label: "Walk in Salon" },
  { value: "My home address", label: "My home address" },
];

export default function ProviderServicesSection({
  values,
  handleChange,
  handleBlur,
  setFieldValue,
  uploadFile,
  onRegistrationUploadingChange,
  onWorkUploadingChange,
  serviceNames = [],
  servicesField = "beautyServices",
  serviceLocationSection,
  allowCustomServices = false,
}) {
  const [uploadingWorkPhotos, setUploadingWorkPhotos] = useState(false);
  const [workPhotoNames, setWorkPhotoNames] = useState([]);
  const [uploadError, setUploadError] = useState("");
  const [showAllServices, setShowAllServices] = useState(false);
  const [addingService, setAddingService] = useState(false);
  const [newService, setNewService] = useState("");

  const addService = () => {
    const name = newService.trim();
    if (!name) return;
    const existing = serviceNames.find((item) => item.toLowerCase() === name.toLowerCase());
    if (!existing) setFieldValue("customServices", [...(values.customServices || []), name]);
    const selected = values[servicesField] || [];
    if (!selected.includes(existing || name)) setFieldValue(servicesField, [...selected, existing || name]);
    setNewService("");
    setAddingService(false);
  };

  const toggleArrayValue = (field, value) => {
    const currentValues = values?.[field] || [];
    setFieldValue(
      field,
      currentValues.includes(value)
        ? currentValues.filter((item) => item !== value)
        : [...currentValues, value],
    );
  };

  const handleWorkPhotosUpload = async (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    setUploadingWorkPhotos(true);
    onWorkUploadingChange?.(true);
    setUploadError("");
    try {
      const urls = await Promise.all(
        files.map((file) => uploadFile(file, "work_visuals")),
      );
      setFieldValue("workPhotos", [...(values?.workPhotos || []), ...urls]);
      setWorkPhotoNames((currentNames) => [
        ...currentNames,
        ...files.map((file) => file.name),
      ]);
    } catch (error) {
      setUploadError(error?.response?.data?.message || error.message || "Unable to upload work photos. Please try again.");
    } finally {
      setUploadingWorkPhotos(false);
      onWorkUploadingChange?.(false);
      event.target.value = "";
    }
  };

  const removeWorkPhoto = (index) => {
    setFieldValue(
      "workPhotos",
      (values?.workPhotos || []).filter((_, photoIndex) => photoIndex !== index),
    );
    setWorkPhotoNames((currentNames) =>
      currentNames.filter((_, photoIndex) => photoIndex !== index),
    );
  };



  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <h3 className="font-semibold">Services you provide</h3>
        <p className="text-[#231F20BF]">
          Choose all the services your business offers.
        </p>
        <div className="flex w-full flex-wrap gap-3">
          {(showAllServices ? serviceNames : serviceNames.slice(0, 4)).map((service) => {
            const isSelected = (values?.[servicesField] || []).includes(service);
            return (
              <button
                key={service}
                type="button"
                onClick={() => toggleArrayValue(servicesField, service)}
                className={`inline-flex items-center gap-2 rounded-full border px-5 py-2 text-sm font-medium transition-all duration-200 ${
                  isSelected
                    ? "border-[#34805A] bg-[#34805A] text-white"
                    : "border-gray-300 bg-white text-gray-700 hover:border-[#34805A] hover:text-[#34805A]"
                }`}
              >
                {isSelected ? <Check size={18} /> : <Plus size={18} />}
                {service}
              </button>
            );
          })}
          {serviceNames.length > 4 && !showAllServices ? (
            <button
              type="button"
              onClick={() => setShowAllServices(true)}
              className="inline-flex items-center gap-2 rounded-full border border-[#34805A] px-5 py-2 text-sm font-medium text-[#34805A] hover:bg-[#E8F4EC]"
            >
              View more
            </button>
          ) : null}
          {allowCustomServices && (addingService ? (
            <div className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-sm">
              <input autoFocus aria-label="New service" value={newService} onChange={(event) => setNewService(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") { event.preventDefault(); addService(); }
                  if (event.key === "Escape") setAddingService(false);
                }} className="min-w-0 w-28 outline-none" placeholder="Service" />
              <button type="button" onClick={addService} className="font-semibold text-[#34805A]">Add</button>
            </div>
          ) : (
            <button type="button" onClick={() => setAddingService(true)} className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 hover:border-[#34805A] hover:text-[#34805A]">
              <Plus size={18} />Add service
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="font-semibold">Experience</h3>
        <InputField
          select
          options={experienceSelectOptions}
          value={values?.experience || ""}
          onChange={(option) => {
            setFieldValue("experience", option.value);
            setFieldValue("yearsOfExperience", experienceYears[option.value]);
          }}
          onBlur={handleBlur}
          placeholder="Select experience"
        />
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="font-semibold">Business Hours</h3>
        <p className="text-[#231F20BF]">
          Set when customers can book your services.
        </p>
        <div className="flex w-full items-end gap-3">
          <InputField
            label="Opening time"
            select
            options={timeSelectOptions}
            value={values?.businessHours?.start || ""}
            onChange={(option) =>
              setFieldValue("businessHours.start", option.value)
            }
            onBlur={handleBlur}
            placeholder="Select time"
          />
          <div className="mb-3 text-gray-400">-</div>
          <InputField
            label="Closing time"
            select
            options={timeSelectOptions}
            value={values?.businessHours?.end || ""}
            onChange={(option) =>
              setFieldValue("businessHours.end", option.value)
            }
            onBlur={handleBlur}
            placeholder="Select time"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[15px] text-gray-600">Available days</label>
          <div className="flex flex-wrap gap-2">
            {beautyDays.map((day) => {
              const isSelected = (values?.availableDays || []).includes(day);
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleArrayValue("availableDays", day)}
                  className={`min-w-[52px] rounded-full px-2.5 py-1 text-[14px] transition-all ${
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
      </div>

      {serviceLocationSection ?? (
      <div className="mt-4 flex flex-col gap-3">
        <div>
          <h3 className="font-semibold text-[#231F20]">
            Where do you provide your service
          </h3>
          <p className="mt-1 text-sm text-[#231F20BF]">Select all that apply</p>
        </div>
        <div className="mt-1 flex flex-wrap gap-3">
          {beautyLocations.map((location) => {
            const isSelected = (values?.servicePlace || []).includes(
              location.value,
            );
            return (
              <button
                key={location.value}
                type="button"
                onClick={() => toggleArrayValue("servicePlace", location.value)}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  isSelected
                    ? "border-[#34805A] bg-[#34805A] text-white"
                    : "border-gray-300 bg-white text-gray-700 hover:border-[#34805A] hover:text-[#34805A]"
                }`}
              >
                {isSelected ? <Check size={16} /> : <Plus size={16} />}
                {location.label}
              </button>
            );
          })}
        </div>
      </div>
      )}

      <div className="mt-4 flex flex-col gap-3">
        <div>
          <h3 className="flex gap-1 font-semibold text-[#231F20]">
            Photos of your work
            <span className="font-normal text-[#231F20BF]">(required)</span>
          </h3>
          <p className="mt-1 text-sm text-[#231F20BF]">
            Upload at least one clear photo that shows your work or tools.
          </p>
        </div>
        <div className="relative mt-2 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-400 bg-white py-10 transition-all hover:bg-gray-50">
          <input
            type="file"
            multiple
            accept=".jpg,.jpeg,.png"
            onChange={handleWorkPhotosUpload}
            disabled={uploadingWorkPhotos}
            aria-required="true"
            className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
          />
          <div className="flex flex-col items-center justify-center gap-3">
            <CloudUpload
              size={36}
              className="text-[#34805A]"
              strokeWidth={1.5}
            />
            <p className="text-base text-gray-700">
              {uploadingWorkPhotos ? (
                <span className="font-semibold text-[#34805A]">
                  Uploading...
                </span>
              ) : (
                <>
                  Upload pictures{" "}
                  <span className="font-semibold text-[#34805A]">Browse</span>
                </>
              )}
            </p>
            <p className="text-xs text-gray-400 md:text-sm">
              JPEG, PNG format, Max 5 MB each
            </p>
          </div>
        </div>
        {(values?.workPhotos || []).length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {(values?.workPhotos || []).map((photoUrl, index) => (
              <div
                key={`${photoUrl}-${index}`}
                className="relative h-20 w-20 overflow-hidden rounded-lg border border-gray-200 bg-gray-50"
              >
                <img
                  src={photoUrl}
                  alt={workPhotoNames[index] || "Uploaded work"}
                  className="h-full w-full object-cover"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
                <span className="flex h-full w-full items-center justify-center px-2 text-center text-[10px] text-gray-500">
                  {workPhotoNames[index] || "Uploaded file"}
                </span>
                <button
                  type="button"
                  onClick={() => removeWorkPhoto(index)}
                  className="absolute right-1 top-1 rounded-full bg-white p-1 text-gray-600 shadow hover:text-red-600"
                  aria-label="Remove uploaded work photo"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
        {uploadError && <p role="alert" className="text-sm text-red-600">{uploadError}</p>}
      </div>

      <BusinessRegistrationFields
        values={values}
        setFieldValue={setFieldValue}
        handleChange={handleChange}
        handleBlur={handleBlur}
        uploadFile={uploadFile}
        onUploadingChange={onRegistrationUploadingChange}
      />
    </div>
  );
}
