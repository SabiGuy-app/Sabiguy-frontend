import InputField from "../../../../components/InputField";
import { useState } from "react";
import { Check, CloudUpload, Plus } from "lucide-react";

const beautyServices = [
  "Braiding",
  "Hair Dresser",
  "Spa",
  "Lash Tech",
  "Pedicure",
  "Nails Tech",
];

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

export function BeautyAndPersonalCareSection({
  values,
  handleChange,
  handleBlur,
  setFieldValue,
  uploadFile,
}) {
  const isRegistered = values?.isRegistered === true;
  const [uploadingWorkPhotos, setUploadingWorkPhotos] = useState(false);
  const [uploadingCacFile, setUploadingCacFile] = useState(false);
  const [workPhotoNames, setWorkPhotoNames] = useState([]);
  const [cacFileName, setCacFileName] = useState("");

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
    try {
      const urls = await Promise.all(
        files.map((file) => uploadFile(file, "work_visuals")),
      );
      setFieldValue("workPhotos", [...(values?.workPhotos || []), ...urls]);
      setWorkPhotoNames((currentNames) => [
        ...currentNames,
        ...files.map((file) => file.name),
      ]);
    } finally {
      setUploadingWorkPhotos(false);
      event.target.value = "";
    }
  };

  const handleCacUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingCacFile(true);
    try {
      const url = await uploadFile(file, "cac");
      setFieldValue("cacFile", url);
      setCacFileName(file.name);
    } finally {
      setUploadingCacFile(false);
      event.target.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <h3 className="font-semibold">Services you provide</h3>
        <p className="text-[#231F20BF]">
          Choose all the services your business offers.
        </p>
        <div className="flex w-full flex-wrap gap-3">
          {beautyServices.map((service) => {
            const isSelected = (values?.beautyServices || []).includes(service);
            return (
              <button
                key={service}
                type="button"
                onClick={() => toggleArrayValue("beautyServices", service)}
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

      <div className="mt-4 flex flex-col gap-3">
        <div>
          <h3 className="flex gap-1 font-semibold text-[#231F20]">
            Photos of your work
            <span className="font-normal text-[#231F20BF]">(optional)</span>
          </h3>
          <p className="mt-1 text-sm text-[#231F20BF]">
            Upload clear photos that show your work or tools.
          </p>
        </div>
        <div className="relative mt-2 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-400 bg-white py-10 transition-all hover:bg-gray-50">
          <input
            type="file"
            multiple
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={handleWorkPhotosUpload}
            disabled={uploadingWorkPhotos}
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
              JPEG, PNG, PDF format, Max 5 MB each
            </p>
          </div>
        </div>
        {workPhotoNames.length > 0 && (
          <div className="flex flex-col gap-1 text-sm text-gray-600">
            {workPhotoNames.map((fileName) => (
              <span key={fileName}>{fileName}</span>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-lg p-0">
        <div className="mb-5">
          <p className="mb-1.5 text-sm text-neutral-700">
            Are you a registered business
          </p>
          <div className="flex gap-1.5">
            {[true, false].map((registered) => (
              <button
                key={String(registered)}
                type="button"
                onClick={() => setFieldValue("isRegistered", registered)}
                className={`rounded-full border px-3 py-0.5 text-xs transition-colors ${
                  isRegistered === registered
                    ? "border-green-800 bg-green-800 text-white"
                    : "border-neutral-300 bg-neutral-100 text-neutral-700"
                }`}
              >
                {registered ? "Yes" : "No"}
              </button>
            ))}
          </div>
        </div>

        {isRegistered && (
          <div className="space-y-5">
            <InputField
              label="Business Name"
              name="BusinessName"
              value={values?.BusinessName || ""}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="e.g Adewale Salon & Spa"
            />
            <InputField
              label="Business Address"
              name="BusinessAddress"
              value={values?.BusinessAddress || ""}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Address"
            />
            <div>
              <p className="mb-1 text-sm font-semibold">Business Certificate</p>
              <p className="mb-3 text-sm text-neutral-600">
                Upload a valid certificate showing your relevant training or
                qualification.
              </p>
              <input
                id="cacFile"
                name="cacFile"
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleCacUpload}
                disabled={uploadingCacFile}
                onBlur={handleBlur}
                className="hidden"
              />
              <label
                htmlFor="cacFile"
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-[#34805A] bg-[#34805A] py-3 text-sm font-medium text-white transition-colors hover:bg-[#296647]"
              >
                <Plus size={16} />
                {uploadingCacFile ? "Uploading..." : "Upload file"}
              </label>
              {cacFileName && (
                <p className="mt-2 text-sm text-gray-600">{cacFileName}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
