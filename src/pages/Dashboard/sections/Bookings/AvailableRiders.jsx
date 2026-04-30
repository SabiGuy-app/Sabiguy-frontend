import React, { useState } from "react";
import { Check, MapPin, Star, Loader2 } from "lucide-react";
import DashboardLayout from "../../../../components/layouts/DashboardLayout";
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

  const bookingData = booking?.data || {};
  const bookingDetails = bookingData?.booking || {};
  const bookingId = bookingDetails._id;

  const bookingAmount =
    bookingDetails?.agreedPrice ??
    bookingDetails?.calculatedPrice ??
    bookingDetails?.price ??
    0;

  const getProviderId = (provider) =>
    provider?._id || provider?.id || provider?.userId || provider?.providerId;

  const suggestedProviderIds = (
    bookingDetails?.suggestedProviders ||
    bookingDetails?.notifiedProviders ||
    []
  ).map((providerId) => String(providerId));

  const bookingProviders = Array.isArray(bookingData?.providers)
    ? bookingData.providers
    : [];

  const providerDistances = Array.isArray(bookingData?.providerDistances)
    ? bookingData.providerDistances
    : Array.isArray(bookingDetails?.providerDistances)
      ? bookingDetails.providerDistances
      : [];

  const providerPricingOptions = Array.isArray(
    bookingData?.providerPricingOptions,
  )
    ? bookingData.providerPricingOptions
    : Array.isArray(bookingData?.pricing?.suggestedProviderPricing)
      ? bookingData.pricing.suggestedProviderPricing
      : [];

  const providers = bookingProviders
    .filter((provider) => {
      const providerId = String(getProviderId(provider));
      return (
        suggestedProviderIds.length === 0 ||
        suggestedProviderIds.includes(providerId)
      );
    })
    .map((provider) => {
      const providerId = String(getProviderId(provider));
      const distanceInfo = providerDistances.find(
        (item) => String(item.providerId) === providerId,
      );
      const pricingInfo = providerPricingOptions.find(
        (item) => String(item.providerId) === providerId,
      );

      return {
        ...provider,
        distanceFromPickup:
          provider.distanceFromPickup ?? distanceInfo?.distanceFromPickup,
        providerETA:
          provider.providerETA ??
          (distanceInfo?.providerETAMinutes != null
            ? {
                value: distanceInfo.providerETAMinutes,
                unit: "minutes",
              }
            : null),
        pricing: pricingInfo ?? provider.pricing ?? bookingData?.pricing ?? null,
      };
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

  const formatCurrency = (amount) => {
    const value = Number(amount || 0);
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getProviderDistanceLabel = (provider) => {
    if (provider?.distanceFromPickup == null) return "Distance unavailable";
    return `${Number(provider.distanceFromPickup).toFixed(1)} km away`;
  };

  const getProviderPrice = (provider) =>
    provider?.pricing?.riderPays ??
    provider?.price ??
    provider?.calculatedPrice ??
    provider?.agreedPrice ??
    provider?.amount ??
    provider?.bid ??
    bookingAmount;

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
    (provider) => !declinedIds.includes(String(getProviderId(provider))),
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
              <p className="text-gray-500">No providers available at the moment.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProviders.map((provider) => {
                const providerId = getProviderId(provider);

                return (
                  <div
                    key={providerId}
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

                      <div className="w-full md:w-1/2">
                        <div className="flex flex-col h-full justify-between">
                          <div>
                            <h2 className="text-[20px] font-medium text-[#231F20] capitalize">
                              {provider.fullName}{" "}
                              <span className="text-[#231F2080] font-semibold text-[17px] capitalize">
                                -{" "}
                                {provider.services?.[0]?.title?.replace(
                                  /_/g,
                                  " ",
                                )}
                              </span>
                            </h2>
                            {providerId && (
                              <div className="mt-1 mb-1">
                                <span className="text-[11px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md border border-gray-200 inline-block">
                                  ID: {String(providerId).slice(-6).toUpperCase()}
                                </span>
                              </div>
                            )}

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

                            <div className="flex items-center gap-1 mt-1">
                              <MapPin className="w-4 h-4 text-[#231F20BF]" />
                              <span className="text-[14px] text-[#231F20BF]">
                                {getProviderDistanceLabel(provider)}
                                {provider.providerETA &&
                                  ` - ETA: ${provider.providerETA.value} minutes`}
                              </span>
                            </div>

                            <h2 className="text-2xl sm:text-[25px] text-[#005823] font-semibold mt-4">
                              {formatCurrency(getProviderPrice(provider))}
                            </h2>
                          </div>

                          <div className="space-y-3 sm:flex-row gap-2">
                            <button
                              onClick={() => handleAccept(providerId)}
                              disabled={!!acceptingId}
                              className="w-full py-2.5 px-4 rounded-md text-[16px] font-medium transition-colors bg-[#005823CC] hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                              <span className="flex items-center justify-center gap-2 text-white">
                                {acceptingId === providerId ? (
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
                              onClick={() => handleDecline(providerId)}
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
                );
              })}
            </div>
          )}
        </div>

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
