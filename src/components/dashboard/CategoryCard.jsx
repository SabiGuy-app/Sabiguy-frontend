import React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function CategoryCard({
  image,
  title,
  description,
  onClick,
  bgColor,
  comingSoon = false, // 👈 Add this prop
}) {
  return (
    <div
      onClick={comingSoon ? undefined : onClick}
      className={`relative w-full h-48 rounded-xl overflow-hidden group`}
    >
      <img
        src={image}
        alt={title}
        className={`w-full h-full object-cover transition-transform duration-500 `}
      />

      {/* Overlay */}
      <div
        className={`absolute inset-0 transition-colors ${
          comingSoon ? "bg-black/60" : "group-hover:bg-black/20"
        }`}
        style={{ backgroundColor: comingSoon ? undefined : bgColor }}
      ></div>

      {/* Coming Soon Badge */}
      {/* {comingSoon && (
        <div className="absolute top-4 right-4 bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full">
          Coming Soon
        </div>
      )} */}

      {/* Text */}
      <div className="absolute p-3 inset-0 flex flex-col items-start justify-center">
        <p className="text-white text-[16px] font-bold drop-shadow-md w-[50%]">
          {title}
        </p>
    <p className="text-sm mt-1 text-white w-[50%] md:hidden lg:block">
  {description}
</p>
        {!comingSoon && (
          <div className="flex">
            <button className="bg-gray/5 mt-2 text-white rounded-full px-2 py-0.5 shadow-lg text-[15px] bg-[#FFFFFF4D]/70 flex items-center gap-1 backdrop-blur-md border border-white/10">
              <Link to={"/bookings"}>Book now</Link>
              <ArrowRight size={10} />
            </button>
          </div>
        )}
        {comingSoon && (
          <div className="flex">
            <button className="bg-gray/5 mt-2 text-white rounded-full px-2 py-1 text-[15px] md:text-[13px] flex items-center gap-1 backdrop-blur-md border border-white/10">
              <span to={"/bookings"}>Coming Soon</span>
              <ArrowRight size={10} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
