import React from "react";
import { ArrowRight } from "lucide-react";

export default function ServicesCard({ logo, title, onClick, image }) {
  return (
    <div className=" bg-white relative cursor-pointer w-full h-50  rounded-xl overflow-hidden group">
      {/* Overlay */}

      {/* Text */}
      <div className="absolute p-4 inset-0 flex flex-col items-center justify-center">
        <div className="transition-transform duration-300 ease-out group-hover:scale-105 group-hover:-translate-y-1 bg-[#f7faf8] p-4 rounded-full">
          {/* {logo} */}
          <img src={image} alt="" className="w-[50px] h-[50px]"/>
        </div>
        <p className="text-[20px] font-semibold mt-3 text-[#231F20]">{title}</p>
      </div>
    </div>
  );
}
