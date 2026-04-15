import {
  Phone,
  MessageCircle,
  Star,
  MapPin,
  Navigation,
  Award,
  Clock,
  BadgeCheck,
} from "lucide-react";
import { FiChevronLeft } from "react-icons/fi";
import distance from "/distance.png";
import { useNavigate } from "react-router-dom";

export default function ServiceDetailsModal({ isOpen, onClose, request }) {
  const navigate = useNavigate();
  if (!isOpen) return null;
  console.log(request);
  const bookingId = request?.id;
  console.log(bookingId);

  const handleMessageProvider = () => {
    if (!bookingId) return;
    navigate(`/dashboard/chat?bookingId=${bookingId}`);
  };

  return (
    <div className="fixed inset-0 bg-gray-50 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-5 rounded-2xl max-w-6xl w-full h-[95vh] overflow-y-auto">
        <div className="border-b border-gray-200 px-2 py-4 flex items-center gap-3 mb-6">
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900"
          >
            <FiChevronLeft size={24} />
          </button>
          <h2 className="text-xl font-semibold text-gray-900">
            Service Details
          </h2>
          {request.orderId && (
            <span className="text-[12px] font-mono text-[#005823] bg-[#0058231A] px-2 py-1 rounded-md border border-[#0058234D] w-fit">
              {request.orderId}
            </span>
          )}
        </div>

        <div className="md:grid md:grid-cols-2 gap-8 space-y-4 md:space-y-0">
          <div className="space-y-6">
            <div className="shadow-sm p-6 rounded-[16px] space-y-6">
             <div className="flex flex-col lg:flex-row lg:items-start gap-4 lg:gap-6">
                <img
                  src={
                    request.providerImage ||
                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop"
                  }
                  alt={request.providerName}
                  className="w-16 h-16 rounded-full object-cover flex-shrink-0 self-center lg:self-start"
              />
               <div className="flex-grow w-full text-center lg:text-left">
                  <div className="flex items-center justify-center lg:justify-start gap-2 mb-1">
                    <h2 className="text-lg font-semibold text-gray-900 capitalize">
                      {request.providerName ?? "Provider"}
                    </h2>
                    <span className="text-[#8BC53F]">
                      <BadgeCheck className="w-[20px] h-[20px]" />
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1 capitalize">
                    {request.title?.replace(/_/g, " ") || "—"}
                  </p>
                  {request.providerIdDisplay &&
                    request.providerIdDisplay !== "—" && (
                      <div className="mb-1">
                        <span className="text-[10px] font-medium text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200 inline-block">
                          ID: {request.providerIdDisplay}
                        </span>
                      </div>
                    )}
                  <div className="flex justify-center lg:justify-start items-center gap-1 text-[14px] text-gray-600">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium text-gray-900">
                      {request.providerRating ?? "New"}
                    </span>
                    <span className="text-gray-500 ">
                      ({request.providerReviews ?? 0} reviews)
                    </span>
                  </div>
                  {request.providerDistance && (
                    <div className="flex items-center gap-1 text-[14px] text-[#231F20BF] mt-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{request.providerDistance} miles away</span>
                    </div>
                  )}
                </div>

                {/* Stats */}
               <div className="flex justify-between lg:justify-start gap-4 lg:gap-6 w-full lg:w-auto mt-3 lg:mt-0">
                  <div className="flex flex-col items-center flex-1 md:flex-none">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full">
                      <Award className="w-[24px] h-[24px] text-[#005823]" />
                    </div>
                    <div className="text-[18px] font-semibold text-[#231F20]">
                      {request.jobsDone ?? 0}
                    </div>
                    <div className="text-[12px] text-[#231F2080] text-center">
                      Jobs Done
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center w-10 h-10">
                      <Clock className="w-[24px] h-[24px] text-[#231F20BF]" />
                    </div>
                    <div className="text-[18px] font-semibold text-[#231F20]">
                      {"< 3 Mins"}
                    </div>
                    <div className="text-[12px] text-[#231F2080] text-center">
                      Response Time
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button className="flex-1 flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Phone className="w-4 h-4 text-gray-600" />
                  <span className="font-medium text-gray-700">Call</span>
                </button>
                <button
                  onClick={handleMessageProvider}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-gray-600" />
                  <span className="font-medium text-gray-700">Message</span>
                </button>
                {/* <button
                  onClick={onClose}
                  className="text-red-500 font-medium px-4 hover:text-red-600 transition-colors whitespace-nowrap"
                >
                  Cancel Request
                </button> */}
              </div>
            </div>

            {request.providerVehicleImage && (
              <img
                src={request.providerVehicleImage}
                alt="Vehicle"
                className="w-full h-auto object-contain rounded-[16px] bg-gray-50"
              />
            )}
          </div>

          <div>
            <div className="border border-[#231F201A] px-6 py-6 rounded-[16px] space-y-6">
              <h3 className="text-[22px] font-bold text-[#231F20]">
                Job Summary
              </h3>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-[#E6EFE9] rounded-full flex items-center justify-center flex-shrink-0">
                    <div className="w-3 h-3 bg-[#005823] rounded-full" />
                  </div>
                  <div>
                    <div className="font-semibold text-[15px] text-[#231F20]">
                      Pickup Location
                    </div>
                    <div className="text-[15px] text-[#231F20BF]">
                      {request.pickupAddress || "—"}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-[#E6EFE9] rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-[#005823]" />
                  </div>
                  <div>
                    <div className="font-semibold text-[15px] text-[#231F20]">
                      Dropoff Location
                    </div>
                    <div className="text-[15px] text-[#231F20BF]">
                      {request.dropoffAddress || "—"}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-10 h-10  rounded-full flex items-center justify-center flex-shrink-0">
                    <img src={distance} alt="" />
                  </div>
                  <div>
                    <div className="font-semibold text-[15px] text-[#231F20]">
                      Distance
                    </div>
                    <div className="text-[15px] text-[#231F20BF]">
                      {request.distance || "—"}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-[#005823]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-[15px] text-[#231F20]">
                      Fare
                    </div>
                    <div className="text-[15px] text-[#231F20BF]">
                      {(request.totalAmount ??
                      request.total_amount ??
                      request.amount ??
                      request.total ??
                      request.finalPrice)
                        ? `₦${(request.totalAmount ?? request.total_amount ?? request.amount ?? request.total ?? request.finalPrice).toLocaleString()}`
                        : request.price != null
                          ? `₦${request.price.toLocaleString()}`
                          : "—"}
                    </div>
                  </div>
                </div>

                {/* Service Fee */}
                {(() => {
                  const baseFare =
                    request.agreedPrice ??
                    request.calculatedPrice ??
                    request.price ??
                    0;
                  const fee =
                    request.serviceFee ??
                    request.service_fee ??
                    request.fee ??
                    request.serviceCharge ??
                    Math.round(baseFare * 0.1);

                  if (fee > 0) {
                    return (
                      <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" />
                        <div>
                          <div className="font-semibold text-[15px] text-[#231F20]">
                            Service Charge (10%)
                          </div>
                          <div className="text-[15px] text-[#231F20BF]">
                            ₦{fee.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>

              {/* Description */}
              {request.description && (
                <div className="mt-4">
                  <h4 className="text-[18px] font-semibold text-[#231F20] mb-2">
                    Description
                  </h4>
                  <p className="text-[15px] text-[#231F20BF] leading-relaxed bg-gray-50 rounded-lg p-4 border border-gray-100">
                    {request.description}
                  </p>
                </div>
              )}

              <div>
                <h4 className="text-[18px] font-semibold text-[#231F20] mb-3">
                  Pickup notes{" "}
                  <span className="text-[14px] text-[#231F20BF]"></span>
                </h4>
                <p className="text-[15px] text-[#231F20BF] leading-relaxed bg-gray-50 rounded-lg p-4 border border-gray-100">
                  {request.pickupNotes || "No pickup notes provided."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
