import React, { useState } from "react";
import Navbar from "../../../../components/dashboard/Navbar";
import location from "../../../../../public/location.png";
import motorbike from "../../../../../public/motorbike.png";
import corolla from "../../../../../public/corolla.png";

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
      image: corolla,
    },
    {
      id: 2,
      name: "Motorbike",
      time: "15 mins",
      capacity: "2",
      package: "Small to medium package",
      price: "₦2,700",
      priceValue: 2700,
      image: motorbike,
    },
  ];

  return (
    <>
      <Navbar />
      <div className=" bg-gray-50 grid grid-cols-2 gap-10 p-6">
        <div>
          <h1 className="text-[28px] font-semibold text-[#231F20] mb-6">
            Choose a ride
          </h1>

          <div className="mb-6 space-y-3 border-2 border-[#231F201A] px-5 py-3 rounded-[16px]">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-gray-900 mt-3 flex-shrink-0"></div>
              <div>
                <span className="text-[#231F2080]/50 text-[16px]">Pickup</span>
                <p className="text-[#231F20BF]/[.75] text-[20px]">
                  15 Victoria Island, Lagos
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-gray-900 mt-3 flex-shrink-0"></div>
              <div>
                <span className="text-[#231F2080]/50 text-[16px]">Dropoff</span>
                <p className="text-[#231F20BF]/[.75] text-[20px]">
                  24 Palm Avenue, Lekki Phase 1, Lagos
                </p>
              </div>
            </div>
          </div>

          <h2 className="text-[20px] font-medium text-[##231F20] mb-3">
            Available options
          </h2>

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
                    <div className="text-3xl">
                      <img
                        src={vehicle.image}
                        alt=""
                        className="w-[71px] h-[43px]"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#231F20] text-[20px]">
                        {vehicle.name}
                      </h3>
                      <p className="text-[16px] text-[#231F2080]/[.75]">
                        {vehicle.time} • {vehicle.capacity}
                      </p>
                      <p className="text-[16px] text-gray-400 mt-0.5">
                        {vehicle.delivery || vehicle.package}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-[#005823] text-[20px]">
                      {vehicle.price}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <button className="w-full bg-[#005823] hover:bg-green-900 text-[16px] text-white font-medium py-4 rounded-lg transition-colors">
            Continue
          </button>
        </div>
        <div>
          <img src={location} alt="" className="w-[700px] h-[660px]" />
        </div>
      </div>
    </>
  );
}
