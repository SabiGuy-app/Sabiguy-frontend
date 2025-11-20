import { Bookmark } from "lucide-react";

export default function ActivityCard({ title, value, button, figure, icon }) {
  return (
    <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-5 flex flex-col">

<div className="flex flex-col  md:flex-row md:items-center md:justify-between mb-6">
        <h3 className="font-semibold text-gray-400">{title}</h3>
                {icon && <span className="bg-gray-50 rounded-md p-1">{icon}</span>}

      </div> 
      <p className="text-4xl text-black font-semibold mb-3 mt-3">{figure}</p>
      
    </div>
  );
}
