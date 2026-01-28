import { Star, MapPin, Heart } from "lucide-react";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function ProviderCard({ 
  _id,
  id,
  fullName, 
  rating, 
  reviews, 
  price, 
  city, 
  job, 
  profilePicture,
  onFavorite,
  isFavorited = false,
  showFavoriteButton = true,
  isUnavailable = false,
  isAvailable = !isUnavailable

}) {
    const [favorited, setFavorited] = useState(isFavorited);

  const navigate = useNavigate();
  const firstJob = job?.[0];

 const providerId = _id || id;

  const handleFavoriteClick = () => {
    setFavorited(!favorited);
    if (onFavorite) {
      onFavorite(!favorited);
    }
  };
  const handleViewProfile = () => {
    navigate(`/dashboard/provider/${providerId}`);
  };

  return (
    
    <div className="bg-white w-70 rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all">
      {/* Provider Image */}
      <div className="relative h-56 bg-gray-200 overflow-hidden">
        {profilePicture ? (
          <img
            src={profilePicture}
            alt={fullName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400" />
        )}
        
        {/* Favorite Button */}
        {showFavoriteButton && (
          <button
            onClick={handleFavoriteClick}
            className="absolute top-4 right-4 w-10 h-10 bg-black/60  rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all"
          >
            <Heart
              size={20}
              className={favorited ? "fill-white text-white" : "text-white"}
            />
          </button>
        )}
      </div>

      {/* Details */}
      <div className="p-2">
        {/* <div className="flex flex-col md:flex-row md:items-center md:justify-between"> */}
                <div className="flex items-start justify-between">

          <div className="flex-1">
                        <div className="flex items-center gap-2">

            <h3 className="text-xs text-gray-800">{fullName}</h3>
            {isAvailable  && (
              <span className="inline-flex bg-green-100 rounded-lg px-2 items-center gap-1 text-[9px] text-green-400 font-medium">
                <span className="w-0.5 h-0.5 bg-green-600 rounded-full"></span>
                Available
              </span>
            )}
          </div>
                              <p className="text-sm font-semibold mb-1 capitalize">{firstJob?.service}</p>

          </div>
          
           <div className="text-right">
            <p className="text-xl font-bold text-gray-900">
              ₦{price?.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500">Starting</p>
          </div>
        </div> 
        {/* <p className= "text-sm text-gray-400 line-clamp-2">{firstJob?.tagLine}</p> */}
        
        <div className="flex md:flex-row md:items-center md:justify-between text-sm text-gray-600 mb-2 mt-4">
          {/* Left side: Rating & Location */}
          <div className="flex flex-col">
            {/* Rating */}
            <div className="flex items-center gap-1">
              <Star size={16} className="text-yellow-400 fill-yellow-400" />
              <span>{rating}</span>
              <span className="text-gray-400">({reviews} reviews)</span>
            </div>

            {/* Location (below rating) */}
            <div className="flex items-center gap-1 text-gray-600">
              <MapPin size={14} className="text-gray-400" />
              <span>{city}</span>
            </div>
          </div>

          {/* <Button onClick={handleViewProfile}>View Profile</Button> */}
           <button
          onClick={handleViewProfile}
          // disabled={isUnavailable}
          className={`w-1/2 px-3 py-2 font-medium rounded-lg transition-colors ${
            isUnavailable
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-[#005823] text-white hover:bg-[#004019]'
          }`}
        >
          View Profile
        </button>
        </div>
      </div>
    </div>
  );
}