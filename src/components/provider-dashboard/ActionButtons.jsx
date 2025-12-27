import { FaPencilAlt, FaPaperPlane } from "react-icons/fa";

export default function FloatingActionButtons() {
  return (
    <div className="fixed bottom-8 right-8 flex flex-col gap-3 z-50">
      <button className="w-14 h-14 bg-[#005823] text-white rounded-xl shadow-lg hover:bg-[#004019] transition-all hover:scale-110 flex items-center justify-center">
        <FaPaperPlane size={20} />
      </button>
      <button className="w-14 h-14 bg-white text-gray-700 rounded-xl shadow-lg hover:bg-gray-50 transition-all hover:scale-110 flex items-center justify-center border border-gray-200">
        <FaPencilAlt size={20} />
      </button>
    </div>
  );
}