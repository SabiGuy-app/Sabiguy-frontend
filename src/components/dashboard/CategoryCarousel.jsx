import CategoryCard from "./CategoryCard";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useState, useEffect } from "react";

export default function ({ categories, onCategoryClick }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(2);

  // ✅ Mobile = 1, Tablet & Desktop = 2
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerPage(1); // mobile
      } else {
        setItemsPerPage(2); // tablet + desktop
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = Math.max(0, categories.length - itemsPerPage);

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[20px] font-semibold">
          What do you need today?
        </h3>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="w-7 h-7 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 disabled:opacity-40"
          >
            <FiChevronLeft size={20} />
          </button>

          <button
            onClick={handleNext}
            disabled={currentIndex >= maxIndex}
            className="w-7 h-7 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 disabled:opacity-40"
          >
            <FiChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Carousel */}
      <div className="overflow-hidden">
        <div
          className="flex -mx-3 transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)`,
          }}
        >
          {categories.map((cat) => (
            <div
              key={cat.title}
              className="w-full md:w-1/2 flex-shrink-0 px-3"
            >
              <CategoryCard
                image={cat.image}
                title={cat.title}
                description={cat.description}
                bgColor={cat.bgColor}
                comingSoon={cat.comingSoon}
                onClick={() => onCategoryClick(cat)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}