import React, { useState } from "react";
import {
  Phone,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  MapPin,
  Star,
  Shield,
} from "lucide-react";
import Navbar from "../../../../components/dashboard/Navbar";
import location from "../../../../../public/location.png";

export default function TrackRider() {
  const [isDeliveryStatusExpanded, setIsDeliveryStatusExpanded] =
    useState(true);

  const deliverySteps = [
    {
      id: 1,
      title: "En route to pickup",
      subtitle: "On the way to pickup",
      completed: true,
      active: false,
    },
    {
      id: 2,
      title: "Arrived at pickup location",
      subtitle: "At pickup point",
      completed: false,
      active: false,
    },
    {
      id: 3,
      title: "En route to delivery",
      subtitle: "Leaving for dropoff location",
      completed: false,
      active: false,
    },
    {
      id: 4,
      title: "Arrived at delivery Location",
      subtitle: "At delivery location",
      completed: false,
      active: false,
    },
    {
      id: 5,
      title: "Delivery completed",
      subtitle: "Package delivered",
      completed: false,
      active: false,
    },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 grid grid-cols-2 gap-10">
        <div className="">
          <h1 className="text-[28px] font-semibold text-gray-900 mb-4">
            Arrival in 12 mins
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

          <div className="mb-4">
            <div className="flex items-center gap-3 mb-4">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop"
                alt="Marcus Johnson"
                className="w-14 h-14 rounded-full object-cover"
              />
              <div className="flex-grow">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-semibold text-[20px] text-gray-900">
                    Marcus Johnson
                  </span>
                  <span className="flex items-center gap-1 px-1.5 py-0.5 bg-green-50 text-[#8BC53F] text-xs font-medium rounded">
                    <Shield /> Verified
                  </span>
                </div>
                <div className="text-[#231F20BF] text-[16px] mb-1">
                  <p>
                    Toyota Corolla{" "}
                    <span className="font-semibold">· KSF257NG</span>
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium text-gray-900">4.9</span>
                  <span className="text-xs text-gray-500">(25 reviews)</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Phone className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Call</span>
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <MessageCircle className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  Message
                </span>
              </button>
              <button className="text-red-500 font-medium text-sm px-3 hover:text-red-600 transition-colors">
                Cancel Request
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">
              Pickup note
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Lorem ipsum elementum scelerisque nullam quis non nibh.
            </p>
          </div>

          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Fare</h3>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">₦5,000</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <button
              onClick={() =>
                setIsDeliveryStatusExpanded(!isDeliveryStatusExpanded)
              }
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <h3 className="text-sm font-semibold text-gray-900">
                Delivery Status
              </h3>
              {isDeliveryStatusExpanded ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {isDeliveryStatusExpanded && (
              <div className="px-4 pb-4">
                {deliverySteps.map((step, index) => (
                  <div key={step.id} className="flex gap-3">
                    {/* Timeline */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          step.completed
                            ? "border-green-500 bg-green-500"
                            : "border-gray-300 bg-white"
                        }`}
                      >
                        {step.completed && (
                          <svg
                            className="w-3 h-3 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                        {!step.completed && (
                          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                        )}
                      </div>
                      {index < deliverySteps.length - 1 && (
                        <div
                          className={`w-0.5 h-12 ${step.completed ? "bg-green-500" : "bg-gray-200"}`}
                        ></div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="pb-12 last:pb-0">
                      <div
                        className={`text-sm font-medium ${step.completed ? "text-gray-900" : "text-gray-400"}`}
                      >
                        {step.title}
                      </div>
                      <div
                        className={`text-xs ${step.completed ? "text-gray-500" : "text-gray-400"}`}
                      >
                        {step.subtitle}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div>
          <img src={location} alt="" className="w-[700px] h-[660px]" />
        </div>
      </div>
    </>
  );
}
