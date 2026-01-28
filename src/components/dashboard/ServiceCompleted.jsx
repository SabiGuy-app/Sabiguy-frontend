import Modal from "./Modal";
import { Share } from "lucide-react";
import { RiShareForwardFill } from "react-icons/ri";
import ShareVia from "./SendVia";
import { useState } from "react";


export default function ServiceCompleted ({ isOpen, onClose })  {
      const [showShare, setShowShare] = useState(false);

   const handleShare = async () => {
        onClose();
        setShowShare(true);
      }

    return (
        <>
  <Modal isOpen={isOpen} onClose={onClose}>
    <div className="flex flex-col items-center justify-center text-center py-6">
      <img 
        src="/Okay.svg" 
        alt="Success" 
        className="w-32 h-32 mb-6"
      />

      <h2 className="font-semibold text-2xl text-gray-900 mb-3">
        Thank you!
      </h2>

      <p className="text-gray-500 text-sm mb-6 max-w-sm">
Your service with Phil Crook is now complete.     </p>

<p className="text-gray-500 italic">Help a friend get started</p>

      <div className="flex gap-5">
  <button
  type="button"
  onClick={handleShare}
    className=" text-[#005823BF] text-lg flex items-center justify-center gap-1"
  >
    
    Refer & Earn
    <RiShareForwardFill size={30}/>
  </button>

  
</div>

      </div>
  </Modal>
  <ShareVia
      isOpen={showShare}
      onClose={() => setShowShare(false)}/>
      </>
  
);

}