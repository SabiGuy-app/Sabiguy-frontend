import { Calendar, MapPin, ChevronLeft, Star } from "lucide-react";
import Navbar from "../../../components/dashboard/Navbar";

export default function ServiceDetailsModal({ isOpen, onClose, request }) {
  if (!isOpen) return null;
  console.log(request);

  return (
    <div className="fixed inset-0 bg-gray-50  bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-5 rounded-2xl max-w-3xl w-full max-h-[95vh] overflow-y-auto">
        <div className=" top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-semibold">Service Details</h2>
            {request.orderId && (
              <span className="text-xl font-bold text-gray-901">
                {request.orderId}
              </span>
            )}
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={
                    request.providerImage || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop"
                  }
                  alt={request.providerName}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">
                      {request.providerName ?? "Provider"}
                    </span>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">
                        {request.providerReviews}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-500 capitalize">{request.title.replace(/_/g, ' ')}</p>
                    {request.providerIdDisplay && request.providerIdDisplay !== "—" && (
                      <span className="text-[10px] font-medium text-gray-400 bg-gray-50 border border-gray-100 px-1.5 py-0.5 rounded">
                        ID: {request.providerIdDisplay}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <span className="px-3 py-1 bg-green-100 text-sm font-medium rounded-full border border-green-200">
                Active Booking
              </span>
            </div>
          </div>

          <div className="border-t border-gray-200">
            <h4 className="font-semibold mb-3 mt-2">Booking Information</h4>
            <div className="space-y-3">
              {/* Booking ID */}
              {request.orderId && request.orderId !== "—" && (
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-[#E6EFE9] rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-[#005823] text-[10px] font-bold">#</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Booking ID</p>
                    <p className="text-sm text-gray-600 font-mono">{request.orderId}</p>
                  </div>
                </div>
              )}

              {/* Start Date & Time */}
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-[#2D6A3E] mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Scheduled Date
                  </p>
                  <p className="text-sm text-gray-600">
                    {request.scheduledDate}
                  </p>
                </div>
              </div>

              {/* End Date */}
              {/* <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-[#2D6A3E] mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-700">End Date</p>
                  <p className="text-sm text-gray-600">{request.deliveryDate}</p>
                </div>
              </div> */}

              {/* Location */}
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-[#E6EFE9] rounded-full flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 bg-[#005823] rounded-full" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Pickup Location
                  </p>
                  <p className="text-sm text-gray-600">
                    {request.pickupAddress}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#2D6A3E] mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Dropoff Location
                  </p>
                  <p className="text-sm text-gray-600">
                    {request.dropoffAddress}
                  </p>
                </div>
              </div>

              {/* Service Cost */}
              <div className="flex items-start  gap-3 border-b border-gray-200">
                <svg
                  className="w-5 h-5 text-[#2D6A3E] mt-0.5"
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
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Service Cost
                  </p>
                  <p className="text-sm m mb-3 text-gray-600">
                    ₦{request.price.toLocaleString() ?? "0"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Project Description */}
          {/* <div>
            <h4 className="font-semibold mb-3">Project Description</h4>
            <p className="text-sm text-gray-700 leading-relaxed">
              Need a licensed electrician to install new wiring for a home office setup. This includes 
              installation of 4 new outlets, 2 overhead lights, and an ethernet cable run. The office is on 
              the second floor. All materials will be provided, but please bring standard tools and safety 
              equipment.
            </p>
          </div> */}

          {/* Additional Notes */}
          <div>
            <h4 className="font-semibold mb-3">Pickup notes</h4>
            <div className="bg-blue-50 border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-600 italic">
                Please park in the driveway. The side door will be unlocked.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
