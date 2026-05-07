import { X } from "lucide-react";
import { BotIcon } from "lucide-react";
import { FaRobot } from "react-icons/fa";

export default function ChatBotDrawer({ isOpen, onClose, children }) {
  return (
   <div
  className={`
    fixed top-0 right-0 h-full w-[90%] md:w-[450px]
    bg-white shadow-xl z-50 rounded-l-3xl flex flex-col
    transform transition-transform duration-500
    ${isOpen ? "translate-x-0" : "translate-x-full"}
  `}
>
      {/* Header */}
      <div className="flex items-center  justify-between px-5 py-4 border-b">
        <BotIcon/>
        <h2 className="text-lg font-semibold">SabiBot (Your Friendly Chat Bot)</h2>
        <button onClick={onClose}>
          <X size={22} />
        </button>
      </div>

      {/* Chat Content */}
      <div className="flex-1 min-h-0">
        {children}
      </div>
    </div>
  );
}
