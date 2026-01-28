import { FiMapPin, FiCheck } from "react-icons/fi";
import { FaStar } from "react-icons/fa";

export default function OfferCard({ 
  provider, 
  offerType = "your", 
  offerAmount,
  onViewProfile,
  onAccept,
  isSelected = false
}) {
return (
    <div className="bg-white w-85 rounded-xl border-2 
        border-gray-200 p-6 hover:border-green-100 shadow-lg transition-all">
        <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
                    {provider.avatar ? (
                        <img 
              src={provider.avatar} 
              alt={provider.name}
              className="w-full h-full object-cover"
            />
                    ) : (
                        <div className="w-full h-full bg-[#8BC53F] flex items-center justify-center text-white font-semibold">
              {provider.name.charAt(0)}
            </div>
                    )}
                    </div>
                    <div className="flex-1 min-w-0">
                         <h3 className="font-semibold text-gray-900 text-base mb-1">
            {provider.name}
          </h3>
          <div className="flex items-center gap-3 text-xs text-gray-600">
<div className="flex items-center gap-1">
              <FaStar className="text-yellow-400 fill-yellow-400" size={12} />
              <span className="font-medium">{provider.rating}</span>
              <span className="text-gray-400">({provider.reviewCount} reviews)</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
            <FiMapPin size={12} />
            <span>{provider.distance} miles away</span>
          </div>
        </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
            {provider.services?.map((service, idx) => (
                 <span
            key={idx}
            className="px-2  bg-[#0058231A] text-[9px] font-semibold rounded-full"
          >
            {service}
          </span>
            ))}
        </div>

        <div className="bg-[#0058231A] rounded-lg p-2 mb-4">
             <p className="text-sm text-gray-600 mb-1">
          {offerType === "your" ? "Your Offer" : "Counter Offer"}
        </p>
        <p className="text-2xl font-bold text-gray-900">
          ₦{offerAmount.toLocaleString()}
        </p>
        </div>

        <div className="space-y-2">
            <button
            OnClick={onViewProfile}
            className="w-full px-4 py-2.5 bg-white border border-gray-300 text-gray-900 font-medium rounded-lg hover:bg-gray-50 transition-colors"
>View Profile</button>
  <button
          onClick={onAccept}
          className="w-full px-4 py-2.5  bg-[#005823CC]  text-white font-medium rounded-lg hover:bg-[#005823] transition-colors flex items-center justify-center gap-2"
        >
          <FiCheck size={18} />
          Accept
        </button>
        </div>
    </div>
)
}