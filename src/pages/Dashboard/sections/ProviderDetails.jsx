import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProviderStore } from "../../../stores/provider.store";
import { 
  ArrowLeft, 
  CheckCircle, 
  Briefcase, 
  Clock, 
  Star, 
  MapPin,
  Globe
} from "lucide-react";

export default function ProviderDetails() {
  const { providerId } = useParams();
  const navigate = useNavigate();
  const { providers } = useProviderStore();
  const [selectedService, setSelectedService] = useState(null);
  const [yourOffer, setYourOffer] = useState("");
  const [showBookingSummary, setShowBookingSummary] = useState(false);

  // Find the provider by ID
  const provider = providers.find(p => p._id === providerId || p.id === providerId);

  if (!provider) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Provider not found</p>
          <button
            onClick={() => navigate("/dashboard/categories")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Categories
          </button>
        </div>
      </div>
    );
  }

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setShowBookingSummary(true);
  };

  const handleAcceptAndPay = () => {
    // Handle payment logic here
    console.log("Payment initiated for:", selectedService);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Provider Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start gap-4">
                <img
                  src={provider.image}
                  alt={provider.name}
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-2xl font-semibold">{provider.name}</h1>
                    <CheckCircle className="w-5 h-5 text-green-500 fill-green-500" />
                  </div>
                  <p className="text-gray-600 mb-2">{provider.job?.[0]?.title || provider.skill}</p>
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{provider.rating}</span>
                    <span className="text-gray-500">({provider.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{provider.location}</span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
                <div className="text-center">
                  <Briefcase className="w-5 h-5 mx-auto mb-1 text-gray-600" />
                  <p className="text-2xl font-semibold">{provider.jobsCompleted || 25}</p>
                  <p className="text-sm text-gray-600">Jobs Done</p>
                </div>
                <div className="text-center">
                  <Clock className="w-5 h-5 mx-auto mb-1 text-gray-600" />
                  <p className="text-2xl font-semibold">&lt; 2 hours</p>
                  <p className="text-sm text-gray-600">Response Time</p>
                </div>
                <div className="text-center">
                  <Star className="w-5 h-5 mx-auto mb-1 text-yellow-400 fill-yellow-400" />
                  <p className="text-2xl font-semibold">{provider.rating}</p>
                  <p className="text-sm text-gray-600">Rating</p>
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">About</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                {provider.bio || "Lorem ipsum tellus dolor nulla consequat quis elementum sollicitudin cum amet dis eget sociis magna auctor quisque sit rhoncus vulputate cursus ac consectetur sit consectetur."}
              </p>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Experience</h3>
                  <p className="text-gray-600">{provider.experience || "5+ Years"}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Specialties</h3>
                  <p className="text-gray-600">
                    {provider.specialties || "Wiring, Lighting, Maintenance"}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Languages</h3>
                  <div className="flex items-center gap-1 text-gray-600">
                    <Globe className="w-4 h-4" />
                    <span>{provider.languages || "English, Yoruba"}</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Availability</h3>
                  <div className="flex items-center gap-1 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{provider.availability || "Mon-Sat, 8 AM - 6 PM"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Services & Pricing */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Services & Pricing</h2>
              <div className="space-y-3">
                {provider.job && provider.job.length > 0 ? (
                  provider.job.map((service, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div>
                        <h3 className="font-medium">{service.title}</h3>
                        <p className="text-sm text-gray-600">
                            price
                          {/* ₦{service.price.toLocaleString()} • {service.unit || "Per service"} */}
                        </p>
                      </div>
                      <button
                        onClick={() => handleServiceSelect(service)}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                      >
                        Book
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    No services available
                  </div>
                )}
                <button className="w-full text-center text-blue-600 hover:text-blue-700 font-medium py-2">
                  View all
                </button>
              </div>
            </div>

            {/* Recent Reviews */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Recent Reviews</h2>
              <div className="space-y-4">
                {[1, 2].map((review, idx) => (
                  <div key={idx} className="flex gap-4 pb-4 border-b last:border-b-0">
                    <div className="w-12 h-12 rounded-full bg-pink-500 flex items-center justify-center text-white font-semibold">
                      JW
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">John Waton</h3>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        Lorem ipsum tellus dolor nulla consequat quis elementum sollicitudin cum amet praesent eget sociis magna auctor quisque sit rhoncus vulputate cursus consectetur sit nulla scelerisque.
                      </p>
                      <p className="text-xs text-gray-500 mt-2">2 days ago</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-6">
              <h2 className="text-xl font-semibold mb-4">Booking summary</h2>
              
              {showBookingSummary && selectedService ? (
                <>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Your Offer</span>
                      <input
                        type="text"
                        value={yourOffer}
                        onChange={(e) => setYourOffer(e.target.value)}
                        placeholder="₦40,000"
                        className="text-right border-b border-gray-300 focus:border-blue-600 outline-none w-24"
                      />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Provider's Offer</span>
                      <span className="font-medium">₦{selectedService.price.toLocaleString()}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleAcceptAndPay}
                    className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-medium"
                  >
                    Accept offer & Pay
                  </button>
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>Select a service to view booking summary</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}