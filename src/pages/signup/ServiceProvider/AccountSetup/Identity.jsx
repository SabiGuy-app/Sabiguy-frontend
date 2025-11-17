import AccountSetupLayout from "./layout";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoIosArrowBack, IoIosAdd } from "react-icons/io";
import UploadBox from "../../../../components/uploadBox";
import IDTypeSelector from "../../../../components/IdType";
import DocumentTips from "../../../../components/DocumentTips";
import { FaPassport, FaIdCard, FaIdBadge, FaRegCreditCard} from "react-icons/fa";


export default function Identity({onNext}) {
    const [selected, setSelected] = useState("");
    const navigate = useNavigate();

     const idTypes = [
    { title: "National ID Card", desc: "Government-issued identification card", icon: <FaIdCard size={29} />},
    { title: "Passport", desc: "International travel document with photo", icon: <FaPassport size={29}/>},
    { title: "Driving License", desc: "Valid Driver’s license with photo", icon: <FaRegCreditCard size={29}/>},
    { title: "NIN", desc: "Valid picture of your NIN slip", icon: <FaIdBadge size={29}/> },
  ];


    const handleBack = () => {
   navigate (-1)
    }

  return (
    
    <AccountSetupLayout currentStep={2}>
      <div className="mt-4">
        <div
    onClick={handleBack}
    className="flex items-center gap-2 w-fit mb-8 cursor-pointer"
  >
    <IoIosArrowBack size={24} />
    <h2 className="text-lg">Back</h2>
  </div>
        <h2 className="text-xl font-semibold mb-2">Verify your identity</h2>
        <p className="text-gray-500 mb-6">
Upload a government-issued ID to verify your identity. This helps keep
your account secure and comply with regulations        </p>

        
 
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-sm">
      <h2 className="text-lg font-semibold mb-2">Select ID Type</h2>

      <div className="flex flex-col gap-4 mb-10">
        {idTypes.map((id, index) => (
          <IDTypeSelector key={index} {...id} />
        ))}
      </div>

      <DocumentTips />

      <UploadBox />
      </div>

      <div className="mt-5">
<p className="text-gray-500 text-xl font-semibold">Profile Photo</p>

<p className="text-gray-500">Please provide a clear portrait picture of yourself. It should show your full face,
front view, with eyes open. No filters, sunglasses or masks.</p>

<button className="flex items-center justify-center gap-1 rounded-3xl p-1 px-2 py-2 bg-gray-100 mt-3 w-40 font-semibold">
            <IoIosAdd size={30}/>
                Upload File
             </button>

      </div>

      <div className="flex justify-end gap-3 mt-8">
        <button className="border border-[#005823BF] text-[#005823BF] px-6 py-2 rounded-lg hover:bg-[#005823BF]/10 transition"
        onClick={handleBack}>
          Back
        </button>
        <button className="bg-[#005823BF] text-white px-6 py-2 rounded-lg hover:bg-[#004e1a] transition"
        onClick={onNext}>
          Save & Continue
        </button>
      </div>
    </div>
  


    </AccountSetupLayout>
  );
}