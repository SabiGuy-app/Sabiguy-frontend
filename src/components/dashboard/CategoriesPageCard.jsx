// components/dashboard/ProviderCard.jsx
import React from "react";

export default function Card({ image, title, tasks = [] }) {
  return (
    <div className="max-w-fit rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">

      {/* Image container */}
      <div className="relative w-full h-48 overflow-hidden">

        {/* Dimmed Image */}
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover brightness-50 group-hover:brightness-100 transition-all duration-300"
        />

        {/* Centered Title */}
        <h3 className="absolute inset-0 flex items-center justify-center text-white text-xl font-semibold drop-shadow-lg">
          {title}
        </h3>

      </div>

      {/* Bottom Details */}
      <div className="p-4">
        <h4 className="font-semibold text-lg text-gray-800 border-b border-gray-200 pb-1 mb-2">
          Featured Tasks
        </h4>

        {/* Render tasks list */}
        <ul className="list-disc list-inside text-gray-500 text-lg space-y-1">
          {tasks.length > 0 ? (
            tasks.map((task, idx) => (
              <ul key={idx}>{task}</ul>
            ))
          ) : (
            <p className="text-gray-400 italic">No tasks available</p>
          )}
        </ul>
      </div>
    </div>
  );
}
