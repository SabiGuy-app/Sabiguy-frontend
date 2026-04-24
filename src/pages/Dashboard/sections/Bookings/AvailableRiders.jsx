import React, { useEffect, useState } from "react";
import { Check, MapPin, Star, Loader2 } from "lucide-react";
import DashboardLayout from "../../../../components/layouts/DashboardLayout";
import location from "/location.png";
import { useNavigate } from "react-router-dom";
import useBookingStore from "../../../../stores/booking.store";
import { selectProvider } from "../../../../api/bookings";
import DeliveryMap from "../../../../components/dashboard/Map";

export default function AvailableRiders() {
  const navigate = useNavigate();
  const booking = useBookingStore((state) => state.booking);
  const setSelectedProviderId = useBookingStore(
    (state) => state.setSelectedProviderId,
  );

  const bookingDetails = booking?.data?.booking || {};
  const bookingId = bookingDetails._id;
  const bookingAmount =
    bookingDetails?.agreedPrice ??
    bookingDetails?.calculatedPrice ??
    bookingDetails?.price ??
    0;
    const getProviderId = (provider) =>
    provider._id || provider.id || provider.userId || provider.providerId;
  const notifiedProviderIds = bookingDetails?.notifiedProviders || [];

  const providers = (booking?.data?.providers || []).filter((p) => {
    const id = getProviderId(p);
    return notifiedProviderIds.length === 0 || notifiedProviderIds.includes(id);
  });

  const pickupCoords = {
    latitude: bookingDetails?.pickupLocation?.coordinates?.coordinates?.[1],
    longitude: bookingDetails?.pickupLocation?.coordinates?.coordinates?.[0],
  };

  const dropoffCoords = {
    latitude: bookingDetails?.dropoffLocation?.coordinates?.coordinates?.[1],
    longitude: bookingDetails?.dropoffLocation?.coordinates?.coordinates?.[0],
  };


  const [acceptingId, setAcceptingId] = useState(null);
  const [declinedIds, setDeclinedIds] = useState([]);
  const [error, setError] = useState("");
  const clearProviders = useBookingStore((state) => state.clearProviders);

  useEffect(() => {
    return () => clearProviders();
  }, []);

  const handleAccept = async (providerId) => {
    setAcceptingId(providerId);
    setError("");

    try {
      await selectProvider(bookingId, providerId);
      setSelectedProviderId(providerId);
      navigate("/bookings/summary");
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to accept provider. Try again.",
      );
    } finally {
      setAcceptingId(null);
    }
  };

  const handleDecline = (providerId) => {
    setDeclinedIds((prev) => [...prev, providerId]);
  };

  const filteredProviders = providers.filter(
    (p) => !declinedIds.includes(getProviderId(p)),
  );

  return (
    <DashboardLayout>
      <div className="min-h-screen md:grid md:grid-cols-2 space-y-4 gap-10 bg-gray-50 p-4 sm:p-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Available providers
          </h1>
          {bookingId && (
            <div className="mb-6">
              <span className="text-[12px] font-mono text-gray-500 bg-white px-2 py-1 rounded-md border border-gray-200">
                Booking #{bookingId.slice(-6).toUpperCase()}
              </span>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {filteredProviders.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <p className="text-gray-500">
                No providers available at the moment.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProviders.map((provider) => (
                <div
                  key={getProviderId(provider)}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6"
                >
                  <div className="flex flex-col md:flex-row gap-6 md:gap-4">
                    <div className="w-full md:w-1/2">
                      <div className="w-full h-[200px] sm:h-[250px] bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={provider.profilePicture}
                          alt={provider.fullName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(provider.fullName)}&background=e5e7eb&color=374151`;
                          }}
                        />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="w-full md:w-1/2">
                      <div className="flex flex-col h-full justify-between">
                        <div>
                          <h2 className="text-[20px] font-medium text-[#231F20] capitalize">
                            {provider.fullName}{" "}
                            <span className="text-[#231F2080] font-semibold text-[17px] capitalize">
                              •{" "}
                              {provider.services?.[0]?.title?.replace(
                                /_/g,
                                " ",
                              )}
                            </span>
                          </h2>
                          {getProviderId(provider) && (
                            <div className="mt-1 mb-1">
                              <span className="text-[11px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md border border-gray-200 inline-block">
                                ID:{" "}
                                {getProviderId(provider)
                                  .slice(-6)
                                  .toUpperCase()}
                              </span>
                            </div>
                          )}

                          {/* Rating */}
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium text-gray-900">
                              {provider.rating?.average > 0
                                ? provider.rating.average.toFixed(1)
                                : "New"}
                            </span>
                            <span className="text-[14px] text-[#231F2080]">
                              ({provider.rating?.count} reviews)
                            </span>
                          </div>

                          {/* Distance & ETA */}
                          <div className="flex items-center gap-1 mt-1">
                            <MapPin className="w-4 h-4 text-[#231F20BF]" />
                            <span className="text-[14px] text-[#231F20BF]">
                              {provider.distanceFromPickup?.toFixed(1)} miles
                              away
                              {provider.providerETA &&
                                ` • ETA: ${provider.providerETA.value} minutes`}
                            </span>
                          </div>

                          {/* Completed jobs */}
                          {/* <div className="mt-1">
                            <span className="text-sm text-gray-500">
                              {provider.completedJobs} job
                              {provider.completedJobs !== 1 ? "s" : ""}{" "}
                              completed
                            </span>
                          </div> */}

                          {/* Price */}
                          <h2 className="text-2xl sm:text-[25px] text-[#005823] font-semibold mt-4">
                            ₦
                            {Number(
                              provider?.pricing?.riderPays ??
                                provider?.price ??
                                provider?.calculatedPrice ??
                                provider?.agreedPrice ??
                                provider?.amount ??
                                provider?.bid ??
                                bookingAmount,
                            ).toLocaleString()}
                          </h2>
                        </div>

                        {/* Actions */}
                        <div className="space-y-3 sm:flex-row gap-2">
                          <button
                            onClick={() =>
                              handleAccept(getProviderId(provider))
                            }
                            disabled={!!acceptingId}
                            className="w-full py-2.5 px-4 rounded-md text-[16px] font-medium transition-colors bg-[#005823CC] hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            <span className="flex items-center justify-center gap-2 text-white">
                              {acceptingId === getProviderId(provider) ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  Accepting...
                                </>
                              ) : (
                                <>
                                  <Check className="w-[24px] h-[24px]" />
                                  Accept
                                </>
                              )}
                            </span>
                          </button>

                          <button
                            onClick={() =>
                              handleDecline(getProviderId(provider))
                            }
                            disabled={!!acceptingId}
                            className="w-full py-2.5 px-4 text-[16px] rounded-md font-medium bg-white border border-[#231F2040] text-[#231F20] hover:bg-gray-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            Decline
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Map */}
        {/* <div>
          <img src={location} alt="" className="w-[700px] h-[660px]" />
        </div> */}
        <div className="h-[660px]">
          <DeliveryMap
            pickup={pickupCoords}
            dropoff={dropoffCoords}
            bookingDetails={bookingDetails}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
