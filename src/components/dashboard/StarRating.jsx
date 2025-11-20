import { FaStar, FaStarHalfAlt } from "react-icons/fa";

export default function StarRating({ rating }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  return (
    <div className="flex items-center gap-1">
      {[...Array(fullStars)].map((_, i) => (
        <FaStar key={i} className="text-[#8BC53F]" size={16} />
      ))}
      {hasHalfStar && <FaStarHalfAlt className="text-[#8BC53F]" size={16} />}
      <span className="ml-2 text-sm font-medium text-gray-700">{rating}</span>
    </div>
  );
}