import Modal from "./Modal";
import { Share } from "lucide-react";
import { RiShareForwardFill } from "react-icons/ri";
import { FaInstagram } from "react-icons/fa";
import { FaWhatsapp, FaFacebookF, FaTelegramPlane, } from "react-icons/fa";



export default function ShareVia ({ isOpen, onClose })  {

    return (
  <Modal isOpen={isOpen} onClose={onClose}>
    <div className="flex flex-col items-center justify-between text-center py-6">
        <p className="items-start font-semibold ">Share Via</p>
      <div className="flex gap-4">
            <button
              onClick={() => handleShare('whatsapp')}
              className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
            >
              <FaWhatsapp size={40} />
            </button>
            <button
              onClick={() => handleShare('facebook')}
              className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
            >
              <FaFacebookF size={40} />
            </button>
            <button
              onClick={() => handleShare('telegram')}
              className="w-12 h-12 bg-blue-400 text-white rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors"
            >
              <FaTelegramPlane size={40} />
            </button>
             <button
              onClick={() => handleShare('telegram')}
              className="w-12 h-12 bg-pink-900 text-white rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors"
            >
              <FaInstagram size={40} />
            </button>
          </div>

    

  
</div>


  </Modal>
  
);

}