import CategoryCard from "./CategoryCard";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useState } from "react";

export default function ({categories}) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const itemsPerPage = 3;
    const maxIndex = Math.max(0, categories.length - itemsPerPage);

    const handlePrevious = () => {
        setCurrentIndex((prev) => Math.max(0, prev -1));
    };

    const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

   const visibleCategories = categories.slice(
    currentIndex,
    currentIndex + itemsPerPage
  );

  return (
    <div className="mb-6 mt-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">What do you need today?</h3>

        {/* Navigation Arrows */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="w-7 h-7 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <FiChevronLeft size={20} className="text-gray-700" />
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex >= maxIndex}
            className="w-7 h-7 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <FiChevronRight size={20} className="text-gray-700" />
          </button>
        </div>
      </div>

      {/* Categories Grid */}
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {visibleCategories.map((cat, idx) => (
          <CategoryCard
            key={currentIndex + idx} */}
             <div className="overflow-hidden">
        <div
          className="flex gap-6 transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)`
          }}
        >
          {categories.map((cat, idx) => (
            <div
              key={idx}
              className="min-w-[100%] md:min-w-[calc(33.333%-16px)] flex-shrink-0"
            >
                <CategoryCard
            image={cat.image}
            title={cat.title}
            description={cat.description}
            bgColor={cat.bgColor}
          />
          </div>
        ))}
      </div>

      {/* Page Indicator Dots (Optional) */}
      {/* <div className="flex justify-center gap-2 mt-6">
        {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-2 h-2 rounded-full transition-all ${
              currentIndex === idx
                ? "bg-[#005823] w-6"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
          />
        ))}
      </div> */}
      </div>
    </div>
  )
}

