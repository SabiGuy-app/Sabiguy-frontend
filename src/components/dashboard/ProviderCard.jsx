// components/dashboard/ProviderCard.jsx
import { Star, MapPin } from "lucide-react";
import Button from "./Button";

export default function ProviderCard({ image, name, skill, rating, reviews, price, location }) {
  return (
    <div className="bg-white w-80 rounded-4xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      {/* Image */}
      <img
        src={image}
        alt={name}
        className="w-lg h-50 object-cover"
      />

      {/* Details */}
      <div className="p-2">
<div className="flex flex-col md:flex-row md:items-center md:justify-between">
  <div>
        <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
        <p className="text-sm text-gray-500 mb-1">{skill}</p>
</div>
<div>
   <p className="text-[#005823] font-semibold text-base md:text-lg">
            ₦{price}
          </p>
                  <p className="text-sm text-gray-500">{skill}</p>

</div>
</div>
<p className="text-gray-400">This is where tagline goes</p>
<div className="flex md:flex-row md:items-center md:justify-between text-sm text-gray-600 mb-2">
  {/* Left side: Rating & Location */}
  <div className="flex flex-col">
    {/* Rating */}
    <div className="flex items-center gap-1">
      <Star size={16} className="text-yellow-400 fill-yellow-400" />
      <span>{rating}</span>
      <span className="text-gray-400">({reviews} reviews)</span>
    </div>

    {/* Location (below rating) */}
    <div className="flex items-center gap-1 mt-1 text-gray-600">
      <MapPin size={14} className="text-gray-400" />
      <span>{location}</span>
    </div>
  </div>

  {/* Button (on the right) */}
  <Button>View Profile</Button>
</div>

      </div>
    </div>
  );
}