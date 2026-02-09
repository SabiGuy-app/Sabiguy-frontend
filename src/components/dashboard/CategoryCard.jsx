// components/dashboard/CategoryCard.jsx
import React from "react";
import { ArrowRight } from "lucide-react";

export default function CategoryCard({
  image,
  title,
  description,
  onClick,
  bgColor,
}) {
  return (
    <div
      onClick={onClick}
      className="relative cursor-pointer w-full h-48 rounded-xl overflow-hidden group"
    >
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />

      {/* Overlay */}
      <div
        className="absolute inset-0  group-hover:bg-black/50 transition-colors"
        style={{ backgroundColor: bgColor }}
      ></div>

      {/* Text */}
      <div className="absolute p-4 inset-0 flex flex-col items-start justify-center">
        <p className="text-white text-lg sm:text-xl font-bold drop-shadow-md text-center">
          {title}
        </p>
        <p className="text-sm mt-1 text-white">{description}</p>
        <div className="flex">
          <button
            className="bg-gray/5 mt-2 text-white rounded-2xl px-2 py-1 text-xs flex items-center gap-1  backdrop-blur-md
    border border-white/10"
          >
            <span>Book now</span>
            <ArrowRight size={10} />
          </button>
        </div>
      </div>
    </div>
  );
}
