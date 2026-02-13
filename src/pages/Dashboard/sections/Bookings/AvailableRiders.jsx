import React, { useState } from "react";
import { Check, MapPin, Star } from "lucide-react";
import Navbar from "../../../../components/dashboard/Navbar";
import location from "../../../../../public/location.png";

export default function AvailableRiders() {
  const [providers, setProviders] = useState([
    {
      id: 1,
      name: "Toyota Corolla",
      code: "KSF257NG",
      rating: 4.7,
      reviews: 120,
      distance: 2.3,
      price: 5000,
      image:
        "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&h=300&fit=crop",
      accepted: false,
    },
    {
      id: 2,
      name: "Audi",
      code: "KSF257NG",
      rating: 4.5,
      reviews: 120,
      distance: 3.7,
      price: 5000,
      image:
        "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop",
      accepted: false,
    },
  ]);

  const handleAccept = (id) => {
    setProviders(
      providers.map((p) => (p.id === id ? { ...p, accepted: true } : p)),
    );
  };

  const handleDecline = (id) => {
    setProviders(
      providers.map((p) => (p.id === id ? { ...p, accepted: false } : p)),
    );
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen grid grid-cols-2 gap-10 bg-gray-50 p-4 sm:p-8">
        <div className="">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">
            Available providers
          </h1>

          <div className="space-y-4">
            {providers.map((provider) => (
              <div
                key={provider.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6"
              >
                <div className="grid grid-cols-2 sm:flex-row gap-4">
                  <div className="w-full h-full">
                    <div className="w-full h-full bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={provider.image}
                        alt={provider.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Provider Details */}
                  <div className="flex-grow">
                    <div className="flex flex-col h-full">
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                          {provider.name}{" "}
                          <span className="text-gray-500 font-normal">
                            • {provider.code}
                          </span>
                        </h2>

                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium text-gray-900">
                            {provider.rating}
                          </span>
                          <span className="text-sm text-gray-500">
                            ({provider.reviews} reviews)
                          </span>
                        </div>

                        <div className="flex items-center gap-1 mt-1">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {provider.distance} miles away
                          </span>
                        </div>
                      </div>

                      {/* Price and Actions */}
                      <div className="mt-4">
                        <div className="text-2xl font-bold text-green-700 mb-3">
                          ₦{provider.price.toLocaleString()}
                        </div>

                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => handleAccept(provider.id)}
                            className="flex-1 py-2.5 px-4 rounded-md font-medium transition-colors bg-[#005823CC] hover:bg-green-700"
                            
                          >
                            <span className="flex items-center justify-center gap-2 text-white">
                              <Check className="w-4 h-4" />
                              Accept
                            </span>
                          </button>
                          <button
                            onClick={() => handleDecline(provider.id)}
                            className="flex-1 py-2.5 px-4 rounded-md font-medium bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            Decline
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <img src={location} alt="" className="w-[700px] h-[660px]" />
        </div>
      </div>
    </>
  );
}
