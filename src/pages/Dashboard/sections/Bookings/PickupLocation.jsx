import React from "react";
import Button from "../../../../components/dashboard/Button";

export default function PickupLocation() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row gap-9 p-6">
      <div className="w-full lg:w-[45%] h-[220px] bg-white rounded-2xl p-5 lg:p-6 overflow-y-auto shadow-sm">
        <div className="flex flex-col">
          <p className="font-semibold text-xl mb-8">Choose your pickup spot</p>

          <Button variant="lg">Confirm Pickup Location</Button>

          <button className="mt-5 mb-5">Cancel</button>
        </div>
      </div>
      <div className="w-full lg:w-[55%] relative h-[500px] lg:h-auto rounded-2xl overflow-hidden shadow-sm">
        <div className="w-full h-full bg-gray-200 relative">
          {/* This is where you'll integrate Google Maps or Mapbox */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
              <p className="text-gray-900 font-semibold mb-3 text-lg">
                Map Integration Placeholder
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Integrate with Google Maps API or Mapbox
              </p>
              <div className="mt-6 text-sm text-gray-500 space-y-1">
                <p>
                  <span className="font-medium">Provider:</span>
                </p>
                <p>
                  <span className="font-medium">ETA:</span>{" "}
                </p>
              </div>
            </div>
          </div>

          {/* Map Controls */}
          <div className="absolute bottom-8 right-8 flex flex-col gap-2">
            <button className="w-12 h-12 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200">
              <span className="text-2xl font-light text-gray-700">+</span>
            </button>
            <button className="w-12 h-12 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200">
              <span className="text-2xl font-light text-gray-700">−</span>
            </button>
          </div>

          {/* Provider Location Marker */}
          <div className="absolute top-1/3 left-1/3 bg-white rounded-lg shadow-xl p-3 border border-gray-200 transform -translate-x-1/2">
            <p className="text-sm font-semibold text-gray-900"></p>
            <p className="text-xs text-gray-600 mt-0.5">ETA</p>
          </div>
        </div>
      </div>
    </div>
  );
}
