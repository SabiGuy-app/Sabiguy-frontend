// DriverInfoSection.jsx
import { IoIosAdd } from "react-icons/io";
import InputField from "../../../../../components/InputField";


export function DriverInfoSection() {
  return (
        <form className="flex flex-col gap-4">
       <h2 className="text-xl font-semibold mb-2">Driver Information</h2>
             <p className="text-gray-500 mb-3">Your National ID and license will be kept private</p>
             <InputField
             placeholder="Driver's licence number"
             
             />

              <h6 className="text-xl font-semibold mt-5">Driver's profile photo</h6>
              <p className="text-gray-500 ">Please provide a clear portrait picture of yourself. It should show your full face, front view, with eyes 
              open. No filters, sunglasses or mask.
             </p>
              <button className="flex items-center justify-center gap-1 rounded-3xl p-1 px-2 py-2 bg-gray-100 mt-3 w-40 font-semibold">
                    <IoIosAdd size={30}/>
                Upload File
             </button>
             

             <h6 className="text-xl font-semibold mt-5">NIN Slip</h6>
              <p className="text-gray-500 ">Kindly upload a picture of your NIN slip (make sure all details are readable).
             </p>
    <button className="flex items-center justify-center gap-1 rounded-3xl p-1 px-2 py-2 bg-gray-100 mt-3 w-40 font-semibold">
            <IoIosAdd size={30}/>
                Upload File
             </button>
    </form>
  );
}

// === DOMESTIC INFO SECTION ===
export function DomesticInfoSection() {
  return (
        <form className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold mb-2">Domestic Staff Information</h2>
      <p className="text-gray-500 mb-3">
        Provide identification and reference details.
      </p>

      <InputField placeholder="Full name (as on ID)" />
      <InputField placeholder="National ID Number" />
      <InputField placeholder="Reference contact" />

      <h6 className="text-xl font-semibold mt-10">Profile Photo</h6>
      <p className="text-gray-500">Upload a recent passport-sized photo.</p>
      <button className="flex items-center justify-center gap-1 rounded-3xl px-4 py-2 bg-gray-100 mt-3 w-40 font-semibold">
        <IoIosAdd size={22} /> Upload Photo
      </button>
    </form>
  );
}


export function EmergencyInfoSection() {
  return (
        <form className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold mb-2">Emergency Personnel Information</h2>
      <p className="text-gray-500 mb-3">
        Provide valid identification and certification details for emergency response verification.
      </p>

      <InputField placeholder="Emergency Service ID Number" />
      <InputField placeholder="Certification Number" />

      <h6 className="text-xl font-semibold mt-10">Certification Upload</h6>
      <p className="text-gray-500">Upload your valid emergency service certification.</p>
      <button className="flex items-center justify-center gap-2 rounded-3xl px-4 py-2 bg-gray-100 mt-3 w-48 font-semibold">
        <IoIosAdd size={22} /> Upload Certificate
      </button>
    </form>
  );
}
export function HomeRepairInfoSection() {
  return (
        <form className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold mb-2">Home & Repair Technician Information</h2>
      <p className="text-gray-500 mb-3">
        Please provide your technical license or trade certification details.
      </p>

      <InputField placeholder="License / Registration Number" />
      <InputField placeholder="Years of Experience" type="number" />

      <h6 className="text-xl font-semibold mt-10">Portfolio / Certificate</h6>
      <p className="text-gray-500">Upload a document or image showing your previous work or certification.</p>
      <button className="flex items-center justify-center gap-2 rounded-3xl px-4 py-2 bg-gray-100 mt-3 w-48 font-semibold">
        <IoIosAdd size={22} /> Upload File
      </button>
    </form>
  );
}

export function ProfessionalInfoSection() {
  return (
        <form className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold mb-2">Professional Service Information</h2>
      <p className="text-gray-500 mb-3">
        Provide details of your professional credentials and relevant documentation.
      </p>

      <InputField placeholder="Professional License Number" />
      <InputField placeholder="Organization / Firm Name" />

      <h6 className="text-xl font-semibold mt-10">Proof of Certification</h6>
      <p className="text-gray-500">
        Upload your professional license or accreditation certificate.
      </p>
      <button className="flex items-center justify-center gap-2 rounded-3xl px-4 py-2 bg-gray-100 mt-3 w-48 font-semibold">
        <IoIosAdd size={22} /> Upload Document
      </button>
    </form>
  );
}

export function FreelanceInfoSection() {
  return (
        <form className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold mb-2">Freelancer Information</h2>
      <p className="text-gray-500 mb-3">
        Provide your portfolio details or link to showcase your previous work.
      </p>

      <InputField placeholder="Portfolio URL (optional)" type="url" />
      <InputField placeholder="Years of Freelance Experience" type="number" />

      <h6 className="text-xl font-semibold mt-10">Portfolio Samples</h6>
      <p className="text-gray-500">Upload your sample designs, writings, or previous work.</p>
      <button className="flex items-center justify-center gap-2 rounded-3xl px-4 py-2 bg-gray-100 mt-3 w-48 font-semibold">
        <IoIosAdd size={22} /> Upload File
      </button>
      </form>
  );
}