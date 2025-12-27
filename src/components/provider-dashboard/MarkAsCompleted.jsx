import UploadBox from "../uploadBox";
import { ChevronLeft } from "lucide-react";
import ReviewSent from "./ReviewSentModal";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "../button";

export default function MarkAsCompleted ({ isOpen, onClose, job}) {
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate()


      if (!isOpen) return null;

    return (
        <div>
                <div className="fixed inset-0 bg-gray-50  bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-5 rounded-2xl max-w-3xl w-full max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className=" top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-semibold">Review</h2>
          </div>
         
          {/* <UploadBox/> */}
        </div>
         <div>
            <h2 className="font-semibold text-lg"> Upload Supporting Documents</h2>
            <p className="text-gray-500 mt-2">To mark this project completed, upload some of the work pictures for customer review</p>
          </div>

          <div className="mt-5 mb-4">
       <h3 className="font-semibold text-lg"> Work Photos</h3>
       <p className="text-gray-500 mt-2">Upload 2 - 3 photos of this completed project</p>


          </div>
          <UploadBox/>

          <div>
            <textarea
            placeholder="Additional Notes (optional)"
            rows={4}
          className="w-full mt-7 mb-5 px-4 py-3 bg-gray-50 border border-gray-300 rounded-md placeholder:text-black resize-none focus:outline-none focus:ring-2 focus:ring-[#8BC53F] focus:border-transparent"

            

            />
          </div>
          <button
          onClick={() => setShowModal(true)}
          className="w-full mb-15 rounded-md p-3 bg-[#005823BF] text-white hover:bg-[#005823]">
Mark as completed
          </button>
         
        </div>
        </div>
        <ReviewSent
        isOpen={showModal}
        onClose={onClose}
        
        
        />


        </div>
    )

}