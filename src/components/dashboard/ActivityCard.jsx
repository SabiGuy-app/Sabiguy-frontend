import { Bookmark } from "lucide-react";

export default function ActivityCard({ title, value, button, figure, icon }) {
  return (
    <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-1.5 sm:p-3 flex flex-col w-full max-w-64 mx-auto">

<div className="flex flex-col items-center justify-center mb-2 sm:mb-4">
                {icon && <span className="bg-gray-50 rounded-md p-0.5 mb-2">{icon}</span>}
        <h3 className="font-semibold text-gray-400 break-words text-center">{title}</h3>

      </div> 
      <p className="text-xl sm:text-2xl text-black font-semibold mb-1 mt-1 break-words">{figure}</p>
      <p className="text-xs sm:text-sm text-gray-600 break-words">{value}</p>
      
    </div>
  );
}
