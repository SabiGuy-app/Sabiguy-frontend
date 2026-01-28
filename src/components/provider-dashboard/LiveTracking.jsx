import { useState, useEffect } from "react";
import { FiBell} from "react-icons/fi";

export default function LiveTrackPage () {
  const [timeRemaining, setTimeRemaining] = useState(7068); // 1:57:48 in seconds
  const [showCancelModal, setShowCancelModal] = useState(false);

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

  useEffect(() => {
    const timer = setInterval(() => {
        setTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000);

    return () => clearInterval(timer);
  }, []);
}

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

    return (
         <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Left Side - Booking Summary */}
      <div className="w-full lg:w-[40%] bg-white p-6 lg:p-8 overflow-y-auto">
        {/* Notification Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-center gap-3">
          <FiBell className="text-blue-600 flex-shrink-0" size={20} />
          <p className="text-sm text-blue-800">
            Estimated arrival in {booking.eta}.
          </p>
        </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Booking Summary</h1>

        </div>
        </div>
    )
  };

