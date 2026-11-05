import React from "react";
import { Check, Loader2, MapPin, Star } from "lucide-react";

export default function AvailableRiderCard({
  provider,
  providerId,
  acceptingId,
  hasFirstRideDiscount,
  onAccept,
  onDecline,
  formatCurrency,
  getProviderDistanceLabel,
  getProviderPrice,
}) {
  const safeProviderId = providerId ?? provider?._id ?? provider?.id;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-5 lg:p-6">
      <div className="flex flex-col gap-5 md:flex-row md:gap-4">
        <div className="w-full md:w-[46%] lg:w-1/2">
          <div className="h-48 w-full overflow-hidden rounded-lg bg-gray-100 sm:h-56 md:h-full md:min-h-[220px] lg:h-[260px]">
            <img
              src={provider?.profilePicture || "/avatar.png"}
              alt={provider?.fullName || "Provider"}
              className="h-full w-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/avatar.png";
              }}
            />
          </div>
        </div>

        <div className="w-full md:w-[54%] lg:w-1/2">
          <div className="flex h-full flex-col justify-between gap-4">
            <div className="space-y-3">
              <h2 className="text-lg font-medium capitalize text-[#231F20] sm:text-xl lg:text-[20px]">
                {provider?.fullName || "Provider"}{" "}
                <span className="text-sm font-semibold capitalize text-[#231F2080] sm:text-[17px]">
                  -{" "}
                  {provider?.services?.[0]?.title?.replace(/_/g, " ") ||
                    "Service"}
                </span>
              </h2>

              {safeProviderId && (
                <div>
                  <span className="inline-block rounded-md border border-gray-200 bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-500">
                    ID: {String(safeProviderId).slice(-6).toUpperCase()}
                  </span>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium text-gray-900">
                  {provider?.rating?.average > 0
                    ? provider.rating.average.toFixed(1)
                    : "New"}
                </span>
                <span className="text-[14px] text-[#231F2080]">
                  ({provider?.rating?.count || 0} reviews)
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-1">
                <MapPin className="h-4 w-4 text-[#231F20BF]" />
                <span className="text-[14px] text-[#231F20BF]">
                  {getProviderDistanceLabel(provider)}
                  {provider?.providerETA &&
                    ` - ETA: ${provider.providerETA.value} minutes`}
                </span>
              </div>

              <div className="rounded-2xl border border-[#005823]/10 bg-white/80 px-4 py-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Normal price
                    </p>
                    <h2
                      className={`text-2xl font-semibold sm:text-[25px] ${
                        hasFirstRideDiscount
                          ? "text-gray-400 line-through"
                          : "text-[#005823]"
                      }`}
                    >
                      {formatCurrency(getProviderPrice(provider))}
                    </h2>
                  </div>

                  {hasFirstRideDiscount && (
                    <div className="sm:text-right">
                      <p className="text-sm font-semibold text-[#005823]">
                        Discount available
                      </p>
                      <p className="mt-1 max-w-[180px] text-xs text-[#231F2080] sm:max-w-none">
                        Select a provider to see your discounted price.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-1 flex flex-col gap-2 sm:flex-row">
              <button
                onClick={() => onAccept(provider)}
                disabled={!!acceptingId}
                className="w-full rounded-md bg-[#005823CC] px-4 py-2.5 text-[16px] font-medium text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="flex items-center justify-center gap-2">
                  {acceptingId === safeProviderId ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Notifying…
                    </>
                  ) : (
                    <>
                      <Check className="h-6 w-6" />
                      Accept
                    </>
                  )}
                </span>
              </button>

              <button
                onClick={() => onDecline(safeProviderId)}
                disabled={!!acceptingId}
                className="w-full rounded-md border border-[#231F2040] bg-white px-4 py-2.5 text-[16px] font-medium text-[#231F20] transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Decline
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
