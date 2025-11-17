import { Bookmark } from "lucide-react";

export default function DashboardCard({ title, value, button, figure, icon }) {
  return (
    <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-5 flex flex-col">

<div className="flex items-center gap-2 mb-2">
        {icon && <span className="text-[#005823]">{icon}</span>}
        <h3 className="font-semibold text-gray-700">{title}</h3>
      </div>      <p className="border-b border-gray-400"></p>
      <p className="text-2xl text-black font-semibold text-center mb-3 mt-3">{figure}</p>
            <p className="text-xl text-black font-semibold text-center mb-3">{value}</p>

      {button && (
        <button className="bg-[#005823] text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-[#00471d] transition">
          {button}
        </button>
      )}
    </div>
  );
}
