import React from "react";
import { ArrowRight } from "lucide-react";

export default function ServicesCard({ logo, title, onClick }) {
  return (
    <div
      className=" bg-white relative cursor-pointer w-full h-50  rounded-xl overflow-hidden group"
    >
     

      {/* Overlay */}

      {/* Text */}
      <div className="absolute p-4 inset-0 flex flex-col items-center justify-center">
  <div className="transition-transform duration-300 ease-out group-hover:scale-105 group-hover:-translate-y-1">
        {logo}
       </div>
        <p className="text-lg font-semibold mt-3 text-black">
          {title}
           </p>
          
      </div>
    </div>
  );
}
