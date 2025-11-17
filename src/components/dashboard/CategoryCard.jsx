// components/dashboard/CategoryCard.jsx
import React from "react";

export default function CategoryCard({ image, title, onClick }) {
  return (
    <div
      onClick={onClick}
      className="relative cursor-pointer w-full h-15  rounded-xl overflow-hidden group"
    >
      {/* Background Image */}
      <img
        src={image}
        alt={title}
        className="w-full h-15 object-cover transition-transform duration-500 group-hover:scale-105"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-500"></div>

      {/* Text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <p className="text-white text-lg sm:text-xl font-semibold drop-shadow-md text-center">
          {title}
        </p>
      </div>
    </div>
  );
}
