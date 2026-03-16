import React from "react";
import { Link } from "react-router-dom";

export default function ServicesCard({ logo, title, onClick, image, disabled }) {
  const handleClick = (e) => {
    if (disabled) {
      e.preventDefault();
      if (onClick) {
        onClick();
      }
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <div 
      className={`bg-white relative w-full h-50 rounded-xl overflow-hidden group ${disabled ? 'cursor-pointer opacity-60' : 'cursor-pointer'}`}
    >
      {disabled && (
        <div className="absolute top-3 right-3 bg-[#F6821F1A] text-[#F6821F] text-xs px-3 py-1 rounded-full z-10 font-medium">
          Coming Soon
        </div>
      )}

      {disabled ? (
        <div 
          onClick={handleClick}
          className="absolute p-4 inset-0 flex flex-col items-center justify-center"
        >
          <div className="transition-transform duration-300 ease-out bg-[#f7faf8] p-4 rounded-full">
            <img src={image} alt="" className="w-[50px] h-[50px]"/>
          </div>
          <p className="text-[20px] font-semibold mt-3 text-[#231F20]">{title}</p>
        </div>
      ) : (
        <div 
          // to="/bookings" 
          className="absolute p-4 inset-0 flex flex-col items-center justify-center"
          onClick={handleClick}
        >
          <div className="transition-transform duration-300 ease-out group-hover:scale-105 group-hover:-translate-y-1 bg-[#f7faf8] p-4 rounded-full">
            <img src={image} alt="" className="w-[50px] h-[50px]"/>
          </div>
          <p className="text-[20px] font-semibold mt-3 text-[#231F20]">{title}</p>
        </div>
      )}
    </div>
  );
}