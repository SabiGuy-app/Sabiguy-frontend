import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Check,
  MapPin,
  Star,
  Loader2,
  Clock,
  X,
  AlertCircle,
} from "lucide-react";
import DashboardLayout from "../../../../components/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import useBookingStore from "../../../../stores/booking.store";
import { selectProvider, getBookingsDetails } from "../../../../api/bookings";
import DeliveryMap from "../../../../components/dashboard/Map";

const WAIT_DURATION_MS = 60_000; // 1 minute
const POLL_INTERVAL_MS = 3_000; // poll every 3 s

const ACCEPTED_STATUSES = new Set([
  "provider_accepted",
  "accepted",
  "confirmed",
  "in_progress",
  "enroute_to_pickup",
  "enroute to pickup",
  "provider selected",
  "provider_selected",
]);

function WaitingForProvider({ provider, onTimeout, onCancel }) {
  const [elapsed, setElapsed] = useState(0);
  const totalSeconds = WAIT_DURATION_MS / 1000;
  const remaining = totalSeconds - elapsed;
  const progress = elapsed / totalSeconds;

  useEffect(() => {
    const tick = setInterval(() => {
      setElapsed((prev) => {
        const next = prev + 1;
        if (next >= totalSeconds) {
          clearInterval(tick);
          onTimeout();
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(tick);
  }, [totalSeconds, onTimeout]);

  const size = 160;
  const stroke = 8;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dashOffset = circ * progress;

  const minutes = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const timeLabel = `${minutes}:${String(secs).padStart(2, "0")}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative bg-white rounded-2xl shadow-2xl w-[90vw] max-w-sm mx-4 overflow-hidden">
        <div className="h-1.5 bg-[#005823]" />

        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Cancel waiting"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="px-6 pt-8 pb-8 flex flex-col items-center gap-5">
          <div className="relative">
            <img
              src={provider?.profilePicture}
              alt={provider?.fullName}
              className="w-16 h-16 rounded-full object-cover border-2 border-[#005823]/20"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(provider?.fullName ?? "P")}&background=e5e7eb&color=374151`;
              }}
            />
            <span className="absolute inset-0 rounded-full border-2 border-[#005823]/30 animate-ping" />
          </div>

          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-900">
              Waiting for confirmation
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              <span className="font-medium text-gray-700 capitalize">
                {provider?.fullName}
              </span>{" "}
              has been notified. Please hold on…
            </p>
          </div>

          <div className="relative flex items-center justify-center">
            <svg
              width={size}
              height={size}
              style={{ transform: "rotate(-90deg)" }}
            >
              <circle
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill="none"
                stroke="#e5e7eb"
                strokeWidth={stroke}
              />
              <circle
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill="none"
                stroke="#005823"
                strokeWidth={stroke}
                strokeLinecap="round"
                strokeDasharray={circ}
                strokeDashoffset={dashOffset}
                style={{ transition: "stroke-dashoffset 1s linear" }}
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-2xl font-bold text-gray-900 tabular-nums">
                {timeLabel}
              </span>
              <span className="text-xs text-gray-400 mt-0.5">remaining</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="w-2 h-2 rounded-full bg-[#005823]"
                style={{
                  animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                }}
              />
            ))}
          </div>

          <button
            onClick={onCancel}
            className="text-sm text-gray-400 hover:text-gray-600 underline transition-colors"
          >
            Choose a different provider
          </button>
        </div>

        <style>{`
          @keyframes bounce {
            0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
            40% { transform: translateY(-6px); opacity: 1; }
          }
        `}</style>
      </div>
    </div>
  );
}

// Timeout
function TimeoutBanner({ providerName, onDismiss }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 8000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm mb-4 animate-fadeIn">
      <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="font-semibold text-amber-800">Provider didn't respond</p>
        <p className="text-amber-700 mt-0.5">
          <span className="font-medium capitalize">{providerName}</span> didn't
          confirm within 1 minute. Please choose another provider.
        </p>
      </div>
      <button
        onClick={onDismiss}
        className="text-amber-400 hover:text-amber-600"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

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
            ? { value: distanceInfo.providerETAMinutes, unit: "minutes" }
            : null),
        pricing:
          pricingInfo ?? provider.pricing ?? bookingData?.pricing ?? null,
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

  const [waitingProvider, setWaitingProvider] = useState(null); // provider object
  const [timedOutProvider, setTimedOutProvider] = useState(null); // {name}
  const pollRef = useRef(null);

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(Number(amount || 0));

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

  const startPolling = useCallback(
    (selectedProviderId) => {
      stopPolling();

      pollRef.current = setInterval(async () => {
        try {
          const data = await getBookingsDetails(bookingId);
          const status = (
            data?.data?.booking?.status ||
            data?.booking?.status ||
            ""
          ).toLowerCase();

          if (ACCEPTED_STATUSES.has(status)) {
            stopPolling();
            setWaitingProvider(null);
            navigate("/bookings/summary");
          }
        } catch (err) {
          console.error("Poll error:", err);
        }
      }, POLL_INTERVAL_MS);
    },
    [bookingId, navigate, stopPolling],
  );

  useEffect(() => () => stopPolling(), [stopPolling]);

  const handleAccept = async (provider) => {
    const providerId = getProviderId(provider);
    setAcceptingId(providerId);
    setError("");

    try {
      await selectProvider(bookingId, providerId);
      setSelectedProviderId(providerId);

      setWaitingProvider(provider);
      startPolling(providerId);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Failed to contact provider. Try again.",
      );
    } finally {
      setAcceptingId(null);
    }
  };

  const handleTimeout = useCallback(() => {
    stopPolling();
    const name = waitingProvider?.fullName ?? "The provider";
    setWaitingProvider(null);
    setTimedOutProvider({ name });
  }, [waitingProvider, stopPolling]);

  const handleCancelWait = useCallback(() => {
    stopPolling();
    setWaitingProvider(null);
  }, [stopPolling]);

  const handleDecline = (providerId) => {
    setDeclinedIds((prev) => [...prev, providerId]);
  };

  const filteredProviders = providers.filter(
    (provider) => !declinedIds.includes(String(getProviderId(provider))),
  );

  return (
    <DashboardLayout>
      {/* ── Waiting overlay ── */}
      {waitingProvider && (
        <WaitingForProvider
          provider={waitingProvider}
          onTimeout={handleTimeout}
          onCancel={handleCancelWait}
        />
      )}

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

          {/* Timeout banner */}
          {timedOutProvider && (
            <TimeoutBanner
              providerName={timedOutProvider.name}
              onDismiss={() => setTimedOutProvider(null)}
            />
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
                                  ID:{" "}
                                  {String(providerId).slice(-6).toUpperCase()}
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

                          <div className="space-y-3 sm:flex-row gap-2 mt-4">
                            <button
                              onClick={() => handleAccept(provider)}
                              disabled={!!acceptingId}
                              className="w-full py-2.5 px-4 rounded-md text-[16px] font-medium transition-colors bg-[#005823CC] hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                              <span className="flex items-center justify-center gap-2 text-white">
                                {acceptingId === providerId ? (
                                  <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Notifying…
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
