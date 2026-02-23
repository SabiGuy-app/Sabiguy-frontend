import React, { useState } from "react";
import {
  Phone,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  MapPin,
  Star,
  Shield,
  BadgeCheck,
} from "lucide-react";
import Navbar from "../../../../components/dashboard/Navbar";
import location from "/location.png";
import useBookingStore from "../../../../stores/booking.store";

export default function TrackRider() {
  const [isDeliveryStatusExpanded, setIsDeliveryStatusExpanded] =
    useState(true);

  const booking = useBookingStore((state) => state.booking);
  const bookingDetails = booking?.data?.booking || {};
  const selectedProviderId = useBookingStore(
    (state) => state.selectedProviderId,
  );
  const providerDetails =
    booking?.data?.providers?.find((p) => p._id === selectedProviderId) ||
    booking?.data?.providers?.[0] ||
    {};

  const pickupAddress = bookingDetails?.pickupLocation?.address || "—";
  const dropoffAddress = bookingDetails?.dropoffLocation?.address || "—";
  const serviceCost = bookingDetails?.calculatedPrice || 0;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

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
          <h1 className="text-[28px] font-semibold text-[#231F20] mb-4">
            Arrival in 12 mins
          </h1>

          <div className="mb-6 space-y-3 border-2 border-[#231F201A] px-5 py-3 rounded-[16px]">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-[#E6EFE9] rounded-full flex items-center justify-center flex-shrink-0">
                <div className="w-3 h-3 bg-[#005823] rounded-full"></div>
              </div>
              <div>
                <span className="text-[#231F2080] text-[16px]">Pickup</span>
                <p className="text-[#231F20BF] text-[20px]">{pickupAddress}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-[#E6EFE9] rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin className="w-3 h-3 text-[#005823]" />
              </div>
              <div>
                <span className="text-[#231F2080] text-[16px]">Dropoff</span>
                <p className="text-[#231F20BF] text-[20px]">{dropoffAddress}</p>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center gap-3 mb-4">
              <img
                src={
                  providerDetails?.profilePicture ||
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop"
                }
                alt={providerDetails?.fullName || "Provider"}
                className="w-14 h-14 rounded-full object-cover"
              />
              <div className="flex-grow">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-semibold text-[20px] text-[#231F20]">
                    {providerDetails?.fullName || "Provider"}
                  </span>
                  <span className="text-[#8BC53F]">
                    <BadgeCheck className="w-[20px] h-[20px]" />
                  </span>
                </div>
                <div className="text-[#231F20BF] text-[16px] mb-1">
                  <p>
                    {providerDetails?.services?.[0]?.title?.replace(
                      /_/g,
                      " ",
                    ) ||
                      bookingDetails?.subCategory?.replace(/_/g, " ") ||
                      "—"}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium text-gray-900">
                    {providerDetails?.rating?.average > 0
                      ? providerDetails.rating.average.toFixed(1)
                      : "New"}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({providerDetails?.rating?.count ?? 0} reviews)
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
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
              <button className="text-[#E90000] font-medium text-[16px] px-3 hover:text-red-600 transition-colors">
                Cancel Request
              </button>
            </div>
          </div>

          <h3 className="text-[14px] font-semibold text-[#231F20BF] mb-2">
            Pickup note
          </h3>
          <p className="bg-[#007BFF08] rounded-lg text-[#231F2080] border border-[#231F201A] p-4 mb-4">
            Lorem ipsum elementum scelerisque nullam quis non nibh.
          </p>

          <div className="mb-4">
            <h3 className="text-[16px] font-semibold text-[#231F20]">Fare</h3>
            <div className="flex items-center gap-2">
              <span className="text-[20px] font-bold text-[#231F20]">
                {formatCurrency(serviceCost)}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <button
              onClick={() =>
                setIsDeliveryStatusExpanded(!isDeliveryStatusExpanded)
              }
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <h3 className="text-[16px] font-semibold text-[#231F20]">
                Delivery Status
              </h3>
              {isDeliveryStatusExpanded ? (
                <ChevronUp className="w-5 h-5 text-black" />
              ) : (
                <ChevronDown className="w-5 h-5 text-black" />
              )}
            </button>

            {isDeliveryStatusExpanded && (
              <div className="px-4 pb-4">
                {deliverySteps.map((step, index) => (
                  <div key={step.id} className="flex gap-3">
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
                          <div className="w-2 h-2 bg-[#908E8F] rounded-full"></div>
                        )}
                      </div>
                      {index < deliverySteps.length - 1 && (
                        <div
                          className={`w-0.5 h-12 ${step.completed ? "bg-green-500" : "bg-gray-200"}`}
                        ></div>
                      )}
                    </div>

                    <div className="pb-12 last:pb-0">
                      <div
                        className={`text-[16px] font-medium ${step.completed ? "text-[#005823]" : "text-[#231F20BF] text-[16px]"}`}
                      >
                        {step.title}
                      </div>
                      <div
                        className={`text-[12px] ${step.completed ? "text-gray-500" : "text-[#231F20BF]"}`}
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
