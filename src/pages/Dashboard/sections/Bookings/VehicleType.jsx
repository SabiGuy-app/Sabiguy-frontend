import React, { useState } from "react";
import Navbar from "../../../../components/dashboard/Navbar";
import location from "../../../../../public/location.png"

export default function VehicleType() {
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const vehicles = [
    {
      id: 1,
      name: "Toyota Corolla",
      time: "21 mins",
      capacity: "4",
      delivery: "Medium-sized delivery",
      price: "₦5,000",
      priceValue: 5000,
      icon: "🚗",
    },
    {
      id: 2,
      name: "Motorbike",
      time: "15 mins",
      capacity: "2",
      package: "Small to medium package",
      price: "₦2,700",
      priceValue: 2700,
      icon: "🏍️",
    },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 grid grid-cols-2 gap-10 p-6 font-sans">
        <div className="">
          {/* Header */}
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">
            Choose a ride
          </h1>

          {/* Locations */}
          <div className="mb-6 space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-gray-900 mt-2 flex-shrink-0"></div>
              <p className="text-gray-700 text-sm">
                15 Victoria Island, Lagos...
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-gray-900 mt-2 flex-shrink-0"></div>
              <p className="text-gray-700 text-sm">
                24 Palm Avenue, Lekki Phase 1, Lagos
              </p>
            </div>
          </div>

          {/* Available options */}
          <h2 className="text-sm font-medium text-gray-900 mb-3">
            Available options
          </h2>

          {/* Vehicle Cards */}
          <div className="space-y-3 mb-6">
            {vehicles.map((vehicle) => (
              <button
                key={vehicle.id}
                onClick={() => setSelectedVehicle(vehicle.id)}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                  selectedVehicle === vehicle.id
                    ? "border-green-700 bg-white"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{vehicle.icon}</div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-base">
                        {vehicle.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {vehicle.time} • {vehicle.capacity}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {vehicle.delivery || vehicle.package}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 text-base">
                      {vehicle.price}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Continue Button */}
          <button className="w-full bg-green-800 hover:bg-green-900 text-white font-medium py-4 rounded-lg transition-colors">
            Continue
          </button>
        </div>
        <div>
            <img src={location} alt="" />
        </div>
      </div>
    </>
  );
}
