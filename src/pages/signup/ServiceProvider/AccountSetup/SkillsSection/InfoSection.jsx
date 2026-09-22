// DriverInfoSection.jsx
import { IoIosAdd } from "react-icons/io";
import InputField from "../../../../../components/InputField";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { vehicleTypes } from "./jobData";

export function DriverInfoSection({
  values,
  handleChange,
  handleBlur,
  setFieldValue,
}) {
  const isCarDriver = values.vehicleType === "car_driver";
  const isBikeRider = values.vehicleType === "motorbike_rider";

  return (
    <div className="flex flex-col gap-4">
      <InputField
        label="I want to join as"
        select
        options={vehicleTypes}
        value={values.vehicleType}
        onChange={(option) => {
          setFieldValue("vehicleType", option.value);
          // Reset vehicle-specific fields when type changes
          setFieldValue("driverLicenseNumber", "");
          setFieldValue("vehicleName", "");
          setFieldValue("vehicleProductionYear", "");
          setFieldValue("vehicleRegNo", "");
          setFieldValue("vehiclePictures", []);
        }}
        placeholder="Select role"
      />

      {/* ── Car Driver Fields ── */}
      {isCarDriver && (
        <>
          <InputField
            label="Driver's Licence Number"
            name="driverLicenseNumber"
            value={values?.driverLicenseNumber || ""}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter driver's licence number"
          />

          <InputField
            label="Vehicle Name"
            name="vehicleName"
            value={values?.vehicleName || ""}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="e.g. Toyota Corolla"
          />

          <InputField
            label="Vehicle Production Year"
            name="vehicleProductionYear"
            type="number"
            value={values?.vehicleProductionYear || ""}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="e.g. 2019"
          />

          <InputField
            label="License Plate Number"
            name="vehicleRegNo"
            value={values?.vehicleRegNo || ""}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="e.g. KSF-2843QR"
          />
        </>
      )}

      {/* ── Motorbike Rider Fields ── */}
      {isBikeRider && (
        <>
          <InputField
            label="Plate Number"
            name="vehicleRegNo"
            value={values?.vehicleRegNo || ""}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="e.g. KSF-2843QR"
          />
        </>
      )}
    </div>
  );
}

// === BEAUTY&PERSONAL CARE INFO SECTION ===

export function BeautyInfoSection({
  values,
  handleChange,
  handleBlur,
  setFieldValue,
}) {
  const availableDays = [
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun",
  ];
  const servicePlaces = [
    { value: "customer_address", label: "Customer address" },
    { value: "walk_in_salon", label: "Walk-in salon" },
    { value: "my_home_address", label: "My home address" },
  ];

  const toggleArrayValue = (field, value) => {
    const currentValues = values?.[field] || [];
    setFieldValue(
      field,
      currentValues.includes(value)
        ? currentValues.filter((item) => item !== value)
        : [...currentValues, value],
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold mb-2">
        Beauty & Personal Care Information
      </h2>
      <p className="text-gray-500 mb-3">
        Provide your services, availability, and business details.
      </p>

      <InputField
        label="Service name"
        name="serviceName"
        value={values?.serviceName || ""}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="e.g. Braiding"
      />

      <InputField
        label="Years of experience"
        name="yearsOfExperience"
        type="number"
        min="0"
        value={values?.yearsOfExperience || ""}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="e.g. 5"
      />

      <fieldset className="flex flex-col gap-2">
        <legend className="text-[16px] text-[#231F20] font-medium">
          Available days
        </legend>
        <div className="flex flex-wrap gap-3">
          {availableDays.map((day) => (
            <label key={day} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={(values?.availableDays || []).includes(day)}
                onChange={() => toggleArrayValue("availableDays", day)}
                className="h-4 w-4"
              />
              <span>{day}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <InputField
          label="Business hours start"
          name="businessHours.start"
          type="time"
          value={values?.businessHours?.start || ""}
          onChange={(event) =>
            setFieldValue("businessHours.start", event.target.value)
          }
          onBlur={handleBlur}
        />
        <InputField
          label="Business hours end"
          name="businessHours.end"
          type="time"
          value={values?.businessHours?.end || ""}
          onChange={(event) =>
            setFieldValue("businessHours.end", event.target.value)
          }
          onBlur={handleBlur}
        />
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="text-[16px] text-[#231F20] font-medium">
          Service place
        </legend>
        <div className="flex flex-wrap gap-3">
          {servicePlaces.map((place) => (
            <label key={place.value} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={(values?.servicePlace || []).includes(place.value)}
                onChange={() => toggleArrayValue("servicePlace", place.value)}
                className="h-4 w-4"
              />
              <span>{place.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <InputField
        label="Business name"
        name="BusinessName"
        value={values?.BusinessName || ""}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="Enter your business name"
      />

      <InputField
        label="Business address"
        name="BusinessAddress"
        value={values?.BusinessAddress || ""}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="Enter your business address"
      />

      <div className="flex flex-col gap-1">
        <label
          htmlFor="cacFile"
          className="text-[16px] text-[#231F20] font-medium"
        >
          CAC file
        </label>
        <input
          id="cacFile"
          name="cacFile"
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(event) =>
            setFieldValue("cacFile", event.target.files?.[0]?.name || "")
          }
          onBlur={handleBlur}
          className="w-full rounded-md border border-gray-400 bg-gray-50 px-5 py-4"
        />
      </div>
    </div>
  );
}

// === DOMESTIC INFO SECTION ===
export function DomesticInfoSection({ values, handleChange, handleBlur }) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold mb-2">Domestic Staff Information</h2>
      <p className="text-gray-500 mb-3">
        Provide identification and reference details.
      </p>

      <InputField
        placeholder="Full name (as on ID)"
        name="fullName"
        value={values?.fullName || ""}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      <InputField
        placeholder="National ID Number"
        name="nationalId"
        value={values?.nationalId || ""}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      <InputField
        placeholder="Reference contact"
        name="referenceContact"
        value={values?.referenceContact || ""}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <h6 className="text-xl font-semibold mt-10">Profile Photo</h6>
      <p className="text-gray-500">Upload a recent passport-sized photo.</p>
      <button className="flex items-center justify-center gap-1 rounded-3xl px-4 py-2 bg-gray-100 mt-3 w-40 font-semibold">
        <IoIosAdd size={22} /> Upload Photo
      </button>
    </div>
  );
}

export function EmergencyInfoSection({ values, handleChange, handleBlur }) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold mb-2">
        Emergency Personnel Information
      </h2>
      <p className="text-gray-500 mb-3">
        Provide valid identification and certification details for emergency
        response verification.
      </p>

      <InputField
        placeholder="Emergency Service ID Number"
        name="emergencyServiceId"
        value={values?.emergencyServiceId || ""}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      <InputField
        placeholder="Certification Number"
        name="certificationNumber"
        value={values?.certificationNumber || ""}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <h6 className="text-xl font-semibold mt-10">Certification Upload</h6>
      <p className="text-gray-500">
        Upload your valid emergency service certification.
      </p>
      <button className="flex items-center justify-center gap-2 rounded-3xl px-4 py-2 bg-gray-100 mt-3 w-48 font-semibold">
        <IoIosAdd size={22} /> Upload Certificate
      </button>
    </div>
  );
}
export function HomeRepairInfoSection({ values, handleChange, handleBlur }) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold mb-2">
        Home & Repair Technician Information
      </h2>
      <p className="text-gray-500 mb-3">
        Please provide your technical license or trade certification details.
      </p>

      <InputField
        placeholder="License / Registration Number"
        name="licenseNumber"
        value={values?.licenseNumber || ""}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      <InputField
        placeholder="Years of Experience"
        type="number"
        name="yearsOfExperience"
        value={values?.yearsOfExperience || ""}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <h6 className="text-xl font-semibold mt-10">Portfolio / Certificate</h6>
      <p className="text-gray-500">
        Upload a document or image showing your previous work or certification.
      </p>
      <button className="flex items-center justify-center gap-2 rounded-3xl px-4 py-2 bg-gray-100 mt-3 w-48 font-semibold">
        <IoIosAdd size={22} /> Upload File
      </button>
    </div>
  );
}

export function ProfessionalInfoSection({ values, handleChange, handleBlur }) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold mb-2">
        Professional Service Information
      </h2>
      <p className="text-gray-500 mb-3">
        Provide details of your professional credentials and relevant
        documentation.
      </p>

      <InputField
        placeholder="Professional License Number"
        name="professionalLicense"
        value={values?.professionalLicense || ""}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      <InputField
        placeholder="Organization / Firm Name"
        name="organizationName"
        value={values?.organizationName || ""}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <h6 className="text-xl font-semibold mt-10">Proof of Certification</h6>
      <p className="text-gray-500">
        Upload your professional license or accreditation certificate.
      </p>
      <button className="flex items-center justify-center gap-2 rounded-3xl px-4 py-2 bg-gray-100 mt-3 w-48 font-semibold">
        <IoIosAdd size={22} /> Upload Document
      </button>
    </div>
  );
}

export function FreelanceInfoSection({ values, handleChange, handleBlur }) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold mb-2">Freelancer Information</h2>
      <p className="text-gray-500 mb-3">
        Provide your portfolio details or link to showcase your previous work.
      </p>

      <InputField
        placeholder="Portfolio URL (optional)"
        type="url"
        name="portfolioUrl"
        value={values?.portfolioUrl || ""}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      <InputField
        placeholder="Years of Freelance Experience"
        type="number"
        name="freelanceExperience"
        value={values?.freelanceExperience || ""}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <h6 className="text-xl font-semibold mt-10">Portfolio Samples</h6>
      <p className="text-gray-500">
        Upload your sample designs, writings, or previous work.
      </p>
      <button className="flex items-center justify-center gap-2 rounded-3xl px-4 py-2 bg-gray-100 mt-3 w-48 font-semibold">
        <IoIosAdd size={22} /> Upload File
      </button>
    </div>
  );
}
