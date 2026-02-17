// DriverInfoSection.jsx
import { IoIosAdd } from "react-icons/io";
import InputField from "../../../../../components/InputField";

export function DriverInfoSection({ values, handleChange, handleBlur }) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold mb-2">Driver Information</h2>
      <p className="text-gray-500 mb-3">
        Your driver's license will be kept private
      </p>
      <InputField
        placeholder="Driver's license number"
        name="driverLicenseNumber"
        value={values?.driverLicenseNumber || ""}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <h6 className="text-xl font-semibold mt-5">Vehicle Information</h6>
      <InputField
      label='Vehicle Production Year'
        name="vehicleProductionYear"
        value={values?.vehicleProductionYear || ""}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="Vehicle Production Year"
      />

      <InputField
      label='Vehicle Name'
        name="vehicleName"
        value={values?.vehicleName || ""}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="Vehicle Name"
      />
      <InputField
      label= 'Vehicle Registration Number'
        name="vehicleRegNo"
        value={values?.vehicleRegNo || ""}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="Vehicle Registration Number"
      />
      <InputField
      label='Vehicle Color'
        name="vehicleColor"
        value={values?.vehicleColor || ""}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="Vehicle Color"
      />
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
