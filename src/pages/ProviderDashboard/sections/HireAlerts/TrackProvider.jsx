import { useState, useEffect } from "react";
import {
  FiBell,
  FiCalendar,
  FiMessageSquare,
  FiPhone,
  FiX
} from "react-icons/fi";
import { FaMoneyBillWave, FaFileAlt } from "react-icons/fa";
import Navbar from "../../../../components/dashboard/Navbar";

// Live Tracking Page Component
export default function LiveTrackingPage() {
  const [timeRemaining, setTimeRemaining] = useState(7068); // 1:57:48 in seconds
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Mock booking data - Replace with API data
  const booking = {
    serviceType: "Full house wiring",
    price: "₦50,000",
    startDate: "Oct 10, 2025 - 9 AM",
    endDate: "Oct 10, 2025 - 5 PM",
    providerName: "Sarah Johnson",
    eta: "15 mins",
    providerLocation: { lat: 6.5244, lng: 3.3792 }, // Lagos coordinates
    customerLocation: { lat: 6.5355, lng: 3.3087 },
  };

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format time
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleMessage = () => {
    console.log("Open message modal");
    // TODO: Implement message functionality
  };

  const handleCall = () => {
    console.log("Initiate call");
    // TODO: Implement call functionality
  };

  const handleCancelRequest = () => {
    setShowCancelModal(true);
  };

  const confirmCancel = async () => {
    console.log("Cancelling booking...");
    // TODO: Call API to cancel booking
    // await axios.post(`${API_URL}/bookings/${bookingId}/cancel`);
    setShowCancelModal(false);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row gap-9 p-6">
        {/* Left Side - Booking Summary */}
        <div className="w-full lg:w-[45%] bg-white rounded-2xl p-8 lg:p-12 overflow-y-auto shadow-sm">
          {/* Notification Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 flex items-start gap-3">
            <FiBell className="text-blue-600 flex-shrink-0 mt-0.5" size={18} />
            <p className="text-sm text-blue-800">
              Estimated arrival in {booking.eta}.
            </p>
          </div>
          <div>
            {/* Booking Summary Header */}
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Booking Summary</h1>

            {/* Service Type & Price */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                    <FaFileAlt className="text-[#005823]" size={18} />
                  </div>
                  <span className="text-sm text-gray-600 font-medium">Service Type</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">{booking.serviceType}</p>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                    <FaMoneyBillWave className="text-[#005823]" size={18} />
                  </div>
                  <span className="text-sm text-gray-600 font-medium">Price</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">{booking.price}</p>
              </div>
            </div>

            {/* Start Date & End Date */}
            <div className="grid grid-cols-2 gap-6 mb-10">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                    <FiCalendar className="text-[#005823]" size={18} />
                  </div>
                  <span className="text-sm text-gray-600 font-medium">Start Date</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">{booking.startDate}</p>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                    <FiCalendar className="text-[#005823]" size={18} />
                  </div>
                  <span className="text-sm text-gray-600 font-medium">End Date</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">{booking.endDate}</p>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 my-8"></div>

            {/* Countdown Timer */}
            <div className="mb-10">
              <p className="text-base text-gray-600 mb-3">Service Starts In:</p>
              <p className="text-6xl font-bold text-gray-900 tracking-tight">{formatTime(timeRemaining)}</p>
            </div>
          </div>
          <div className="border-t border-gray-200 my-8"></div>

          {/* Action Buttons */}
          <div className="flex gap-4 mb-4">
            <button
              onClick={handleMessage}
              className="flex-1 px-6 py-3 bg-[#005823] text-white font-semibold rounded-lg hover:bg-[#004019] transition-colors flex items-center justify-center gap-3 text-base"
            >
              <FiMessageSquare size={20} />
              Message
            </button>

            <button
              onClick={handleCall}
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-900 font-semibold rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-3 text-base"
            >
              <FiPhone size={20} />
              Call
            </button>
            <button
              onClick={handleCancelRequest}
              className="w-full px-5 py-3 bg-white text-red-500 font-semibold rounded-lg hover:bg-red-50 transition-colors text-base"
            >
              Cancel Request
            </button>
          </div>


        </div>

        {/* Right Side - Map */}
        <div className="w-full lg:w-[55%] relative h-[500px] lg:h-auto rounded-2xl overflow-hidden shadow-sm">
          {/* Map Placeholder - Replace with actual map integration */}
          <div className="w-full h-full bg-gray-200 relative">
            {/* This is where you'll integrate Google Maps or Mapbox */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
                <p className="text-gray-900 font-semibold mb-3 text-lg">Map Integration Placeholder</p>
                <p className="text-sm text-gray-600 mb-4">
                  Integrate with Google Maps API or Mapbox
                </p>
                <div className="mt-6 text-sm text-gray-500 space-y-1">
                  <p><span className="font-medium">Provider:</span> {booking.providerName}</p>
                  <p><span className="font-medium">ETA:</span> {booking.eta}</p>
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
              <p className="text-sm font-semibold text-gray-900">{booking.providerName}</p>
              <p className="text-xs text-gray-600 mt-0.5">ETA {booking.eta}</p>
            </div>
          </div>
        </div>

        {/* Cancel Confirmation Modal */}
        {showCancelModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Cancel Booking?</h3>
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FiX size={24} />
                </button>
              </div>

              <p className="text-gray-600 mb-6">
                Are you sure you want to cancel this booking? This action cannot be undone.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-900 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Keep Booking
                </button>
                <button
                  onClick={confirmCancel}
                  className="flex-1 px-6 py-3 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors"
                >
                  Yes, Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}