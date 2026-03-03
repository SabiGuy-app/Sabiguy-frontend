import { FaStar, FaStarHalfAlt } from "react-icons/fa";

export default function StarRating({ rating = 0 }) {
  const safeRating = Number(rating) || 0;
  const fullStars = Math.max(0, Math.floor(safeRating));
  const hasHalfStar = safeRating % 1 >= 0.5;

  return (
    <div className="flex items-center gap-1">
      {[...Array(fullStars)].map((_, i) => (
        <FaStar key={i} className="text-[#8BC53F]" size={16} />
      ))}
      {hasHalfStar && <FaStarHalfAlt className="text-[#8BC53F]" size={16} />}
      <span className="ml-2 text-sm font-medium text-gray-700">
        {safeRating > 0 ? safeRating.toFixed(1) : "No rating"}
      </span>
    </div>
  );
}
