import {
  createElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLocation } from "react-router-dom";
import {
  ChevronDown,
  Home,
  MapPin,
  RefreshCw,
  Star,
  WalletCards,
} from "lucide-react";
import DashboardLayout from "../../../components/layouts/DashboardLayout";
import Breadcrumbs from "../../../components/dashboard/BreadCrumbs";
import ProviderCard from "../../../components/dashboard/ProviderCard";
import LocationAutocomplete from "../../../components/LocationAutocomplete";
import { searchServiceProviders } from "../../../api/bookings";
import { getProviderById } from "../../../api/provider";
import {
  extractNearbyProviders,
  mergeBeautyServices,
  normalizeSearchBeautyProvider,
} from "../utils/beautyProviderMapper";
import { mergeProviderAvailability } from "../utils/providerAvailability";
import { BEAUTY_PROVIDER_SEARCH_NAMES } from "../../../constants/beautyServices";

const BEAUTY_PROVIDER_CACHE_KEY = "beauty-search-providers-v9";

const getCurrentLocation = () =>
  new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(
        new Error("Location access is needed to find providers near you."),
      );
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) =>
        resolve({
          latitude: coords.latitude,
          longitude: coords.longitude,
        }),
      () =>
        reject(
          new Error(
            "Allow location access in your browser to see providers near you.",
          ),
        ),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    );
  });

const mergeProviderResults = (providers) => {
  const providersById = new Map();

  providers.forEach((provider) => {
    const id = provider?.id || provider?._id;
    if (!id) return;

    const existing = providersById.get(id);
    if (!existing) {
      providersById.set(id, provider);
      return;
    }

    const services = [
      ...(existing.services || []),
      ...(provider.services || []),
    ];
    const uniqueServices = Array.from(
      new Map(
        services.map((service) => [
          String(service.serviceName || service.name || service._id),
          service,
        ]),
      ).values(),
    );

    providersById.set(id, {
      ...existing,
      ...provider,
      price: provider.price ?? existing.price,
      distanceFromPickup:
        provider.distanceFromPickup ?? existing.distanceFromPickup,
      ...mergeProviderAvailability(existing, provider),
      services: uniqueServices,
      recentReviews: provider.recentReviews?.length
        ? provider.recentReviews
        : existing.recentReviews || [],
    });
  });

  return Array.from(providersById.values());
};

const searchProvidersForService = async (location, query, searchResponse = null) => {
  const serviceName = query.trim();
  if (!serviceName) return [];

  const response = searchResponse ||
    await searchServiceProviders({ location, serviceName });

  const providers = extractNearbyProviders(response);

  return Promise.all(
    providers.map(async (provider) => {
      const id = provider.id || provider._id;
      if (!id) return null;

      let details = {};
      try {
        const response = await getProviderById(id);
        const entry = response?.data?.provider || response?.data?.data ||
          response?.data || response?.provider || response || {};
        const profile = entry.providerProfile || entry.profile || entry.userId?.data || {};
        details = { ...profile, ...entry };
      } catch (error) {
        console.warn(`Could not load details for provider ${id}`, error);
      }

      const normalized = normalizeSearchBeautyProvider({
        ...provider,
        ...details,
        id,
        availability: provider.availability ?? details.availability,
        locationFresh: provider.locationFresh ?? details.locationFresh,
        distanceFromPickup: provider.distanceFromPickup,
        providerETA: provider.providerETA,
        service: mergeBeautyServices(
          Array.isArray(details.service) && details.service.length
            ? details.service
            : details.services,
          Array.isArray(provider.service) && provider.service.length
            ? provider.service
            : provider.services,
        ),
      });
      return normalized && { ...normalized, buyerSearchLocation: location };
    }),
  ).then((results) => results.filter(Boolean));
};

const FILTER_OPTIONS = {
  price: [
    { value: "default", label: "Price" },
    { value: "low", label: "Lowest price" },
    { value: "high", label: "Highest price" },
  ],
  rating: [
    { value: "default", label: "Rating" },
    { value: "4", label: "4+ stars" },
    { value: "4.5", label: "4.5+ stars" },
    { value: "5", label: "5 stars" },
  ],
};

function FilterSelect({ icon, value, onChange, options }) {
  return (
    <label className="relative inline-flex h-10 min-w-[132px] items-center gap-2 rounded-md border border-gray-200 bg-white px-3 text-sm text-[#231F20]">
      {createElement(icon, {
        size: 16,
        className: "shrink-0 text-[#34805A]",
      })}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-w-0 flex-1 appearance-none bg-transparent pr-5 outline-none"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={14}
        aria-hidden="true"
        className="pointer-events-none absolute right-3 text-gray-500"
      />
    </label>
  );
}

function ProviderCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-md">
      <div className="h-56 animate-pulse bg-gray-200" />
      <div className="space-y-3 p-3">
        <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
        <div className="h-9 animate-pulse rounded bg-gray-100" />
      </div>
    </div>
  );
}

export default function BeautyServices() {
  const routeLocation = useLocation();
  const initialBeautySearch = useRef(routeLocation.state?.beautySearch || null);
  const [providers, setProviders] = useState([]);
  const [searchLocation, setSearchLocation] = useState(null);
  const [serviceSearchResults, setServiceSearchResults] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationAddress, setLocationAddress] = useState("");
  const [locationDraft, setLocationDraft] = useState("");
  const [locationPickerOpen, setLocationPickerOpen] = useState(false);
  const [locationPickerError, setLocationPickerError] = useState("");
  const [serviceSearchLoading, setServiceSearchLoading] = useState(false);
  const [serviceSearchError, setServiceSearchError] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [searchTerm, setSearchTerm] = useState(
    () => new URLSearchParams(routeLocation.search).get("service") || "",
  );
  const [priceFilter, setPriceFilter] = useState("default");
  const [ratingFilter, setRatingFilter] = useState("default");

  useEffect(() => {
    setSearchTerm(
      new URLSearchParams(routeLocation.search).get("service") || "",
    );
  }, [routeLocation.search]);

  const loadProviders = useCallback(async (signal, requestedSearch) => {
    const requestedLocation = requestedSearch?.location;
    const hasRequestedLocation =
      Number.isFinite(Number(requestedLocation?.latitude)) &&
      Number.isFinite(Number(requestedLocation?.longitude));
    if (hasRequestedLocation) {
      const location = {
        latitude: Number(requestedLocation.latitude),
        longitude: Number(requestedLocation.longitude),
      };
      setSearchLocation(location);
      setLocationAddress(requestedSearch.address || "Selected location");
      setLocationDraft(requestedSearch.address || "");
      setLoading(false);
    } else {
      setLoading(true);
    }
    setError("");
    setProviders([]);

    try {
      const location = await getCurrentLocation();
      if (!signal.aborted) {
        setCurrentLocation(location);
        if (!hasRequestedLocation) {
          setSearchLocation(location);
          setLocationAddress("Current location");
        }
      }
    } catch (requestError) {
      if (signal.aborted) return;
      console.warn("Could not load current location shortcut", requestError);
      if (!hasRequestedLocation) {
        setError(
          requestError?.response?.data?.message ||
            requestError?.message ||
            "We could not load beauty providers. Please try again.",
        );
      }
    } finally {
      if (!signal.aborted && !hasRequestedLocation) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadProviders(controller.signal, initialBeautySearch.current);
    return () => controller.abort();
  }, [loadProviders, reloadKey, routeLocation.key]);

  useEffect(() => {
    const query = searchTerm.trim();
    if (!searchLocation) return undefined;
    if (query.length < 2) {
      setServiceSearchResults(null);
      setServiceSearchLoading(false);
      setServiceSearchError("");
      return undefined;
    }

    let active = true;
    setServiceSearchLoading(true);
    setServiceSearchError("");
    const pendingSearch = initialBeautySearch.current;
    const matchesPendingSearch =
      pendingSearch &&
      String(pendingSearch.serviceName || "").trim().toLowerCase() === query.toLowerCase();
    initialBeautySearch.current = null;

    const timeoutId = setTimeout(async () => {
      try {
        const results = await searchProvidersForService(
          searchLocation,
          query,
          matchesPendingSearch ? pendingSearch.response : null,
        );
        if (active) {
          setServiceSearchResults(results);
          try {
            const cachedProviders = JSON.parse(
              sessionStorage.getItem(BEAUTY_PROVIDER_CACHE_KEY) || "[]",
            );
            sessionStorage.setItem(
              BEAUTY_PROVIDER_CACHE_KEY,
              JSON.stringify(
                mergeProviderResults([
                  ...(Array.isArray(cachedProviders) ? cachedProviders : []),
                  ...results,
                ]),
              ),
            );
          } catch (cacheError) {
            console.warn("Could not cache beauty search results", cacheError);
          }
        }
      } catch (requestError) {
        if (!active) return;
        console.error("Failed to search beauty services", requestError);
        setServiceSearchResults([]);
        setServiceSearchError(
          requestError?.response?.data?.message ||
            "Service search failed. Please try again.",
        );
      } finally {
        if (active) setServiceSearchLoading(false);
      }
    }, matchesPendingSearch ? 0 : 400);

    return () => {
      active = false;
      clearTimeout(timeoutId);
    };
  }, [searchLocation, searchTerm]);

  const filteredProviders = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    const sourceProviders =
      query && serviceSearchResults !== null ? serviceSearchResults : providers;

    return sourceProviders
      .filter((provider) => {
        if (!query) return true;

        const searchableText = [
          provider.fullName,
          provider.email,
          provider.city,
          ...provider.services.flatMap((service) => [
            service.name,
            service.serviceName,
          ]),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return searchableText.includes(query);
      })
      .filter((provider) => {
        if (ratingFilter === "default") return true;
        return provider.rating >= Number(ratingFilter);
      })
      .sort((first, second) => {
        if (priceFilter === "low" || priceFilter === "high") {
          const firstPrice = Number(first.price);
          const secondPrice = Number(second.price);
          const firstHasPrice = Number.isFinite(firstPrice) && firstPrice > 0;
          const secondHasPrice =
            Number.isFinite(secondPrice) && secondPrice > 0;
          if (firstHasPrice !== secondHasPrice) return firstHasPrice ? -1 : 1;
          if (!firstHasPrice) return 0;
          return priceFilter === "low"
            ? firstPrice - secondPrice
            : secondPrice - firstPrice;
        }
        const firstDistance = Number(first.distanceFromPickup);
        const secondDistance = Number(second.distanceFromPickup);
        if (
          !Number.isFinite(firstDistance) &&
          !Number.isFinite(secondDistance)
        ) {
          return 0;
        }
        if (!Number.isFinite(firstDistance)) return 1;
        if (!Number.isFinite(secondDistance)) return -1;
        return firstDistance - secondDistance;
      });
  }, [
    priceFilter,
    providers,
    ratingFilter,
    serviceSearchResults,
    searchTerm,
  ]);

  const selectSearchLocation = (place) => {
    const latitude = Number(place?.latitude);
    const longitude = Number(place?.longitude);
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      setLocationPickerError("Choose an address suggestion with a valid location.");
      return;
    }

    setError("");
    setServiceSearchError("");
    setLocationPickerError("");
    setSearchLocation({ latitude, longitude });
    setLocationAddress(place.displayAddress || place.address || "Selected location");
    setLocationDraft(place.displayAddress || place.address || "");
    setLocationPickerOpen(false);
  };

  const selectCurrentLocation = () => {
    if (!currentLocation) return;
    setError("");
    setServiceSearchError("");
    setLocationPickerError("");
    setSearchLocation(currentLocation);
    setLocationAddress("Current location");
    setLocationDraft("");
    setLocationPickerOpen(false);
  };

  const isSearching = loading || serviceSearchLoading;

  return (
    <DashboardLayout
      showSidebar={false}
      searchValue={searchTerm}
      onSearchChange={setSearchTerm}
      searchPlaceholder="Search providers or services"
    >
      <div className="mx-auto w-full max-w-6xl py-4">
        <Breadcrumbs
          paths={[
            { label: "", to: "/dashboard", icon: Home },
            { label: "Categories", to: "/dashboard/categories" },
            { label: "Beauty & Personal Care" },
          ]}
        />

        <h1 className="text-2xl font-semibold text-[#231F20]">
          Beauty &amp; Personal Care
        </h1>
        <p className="mt-2 text-sm text-gray-500 sm:text-base">
          Beauty, grooming, and personal care services tailored to your needs.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3 sm:gap-4">
          <span className="w-full text-sm text-[#231F20] sm:w-auto">
            Filter by:
          </span>
          <FilterSelect
            icon={WalletCards}
            value={priceFilter}
            onChange={setPriceFilter}
            options={FILTER_OPTIONS.price}
          />
          <FilterSelect
            icon={Star}
            value={ratingFilter}
            onChange={setRatingFilter}
            options={FILTER_OPTIONS.rating}
          />
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setLocationPickerOpen((open) => !open);
                setLocationPickerError("");
              }}
              aria-expanded={locationPickerOpen}
              className="inline-flex h-10 max-w-[240px] items-center gap-2 rounded-md border border-gray-200 bg-white px-3 text-sm text-[#231F20]"
            >
              <MapPin size={16} className="shrink-0 text-[#34805A]" />
              <span className="truncate">{locationAddress || "Location"}</span>
              <ChevronDown size={14} className="shrink-0 text-gray-500" />
            </button>
            {locationPickerOpen && (
              <div className="absolute left-0 top-full z-30 mt-2 w-[min(22rem,calc(100vw-2rem))] rounded-md border border-gray-200 bg-white p-4 shadow-lg">
                <LocationAutocomplete
                  name="beauty-provider-search-location"
                  label="Location"
                  placeholder="Enter an address"
                  value={locationDraft}
                  onChange={(value) => {
                    setLocationDraft(value);
                    setLocationPickerError("");
                  }}
                  onSelect={selectSearchLocation}
                />
                {locationPickerError && (
                  <p role="alert" className="mt-2 text-sm text-red-600">
                    {locationPickerError}
                  </p>
                )}
                <button
                  type="button"
                  onClick={selectCurrentLocation}
                  disabled={!currentLocation}
                  className="mt-3 w-full rounded-md border border-gray-200 px-3 py-2 text-left text-sm font-medium text-[#005823] hover:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-400"
                >
                  Use current location
                </button>
              </div>
            )}
          </div>
        </div>

        <h2 className="mb-4 mt-7 text-base font-semibold text-[#231F20]">
          Recommended for you
        </h2>

        {isSearching ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }, (_, index) => (
              <ProviderCardSkeleton key={index} />
            ))}
          </div>
        ) : error || serviceSearchError ? (
          <div className="rounded-md border border-red-100 bg-red-50 px-4 py-5 text-sm text-red-700">
            <p>{serviceSearchError || error}</p>
            <button
              type="button"
              onClick={() => setReloadKey((value) => value + 1)}
              className="mt-3 inline-flex items-center gap-2 font-semibold text-[#005823]"
            >
              <RefreshCw size={16} />
              Try again
            </button>
          </div>
        ) : filteredProviders.length ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProviders.map((provider) => (
              <ProviderCard
                key={provider.id}
                {...provider}
                showFavoriteButton={false}
                className="w-full"
              />
            ))}
          </div>
        ) : (
          <p className="rounded-md border border-gray-200 bg-white px-4 py-5 text-sm text-gray-500">
            {searchTerm.trim()
              ? "No nearby providers match your search."
              : "No beauty providers are available for this location right now."}
          </p>
        )}
      </div>
    </DashboardLayout>
  );
}
