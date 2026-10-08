import {
  createElement,
  useCallback,
  useEffect,
  useMemo,
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
import { searchServiceProviders } from "../../../api/bookings";
import { getProviderDirectory } from "../../../api/provider";
import {
  extractNearbyProviders,
  normalizeSearchBeautyProvider,
} from "../utils/beautyProviderMapper";
import { getDistanceFromLocation, isWithinRadius } from "../utils/providerDistance";
import {
  isDiscoverableProvider,
  mergeProviderAvailability,
} from "../utils/providerAvailability";
import { BEAUTY_PROVIDER_SEARCH_NAMES } from "../../../constants/beautyServices";

const BEAUTY_PROVIDER_CACHE_KEY = "beauty-search-providers-v8";
const BEAUTY_CATEGORY = "beauty_personal_care";
const DEFAULT_RADIUS_KM = 10;

// This profile matches the documented request that successfully returned a
// beauty provider. The broader profile remains as a fallback for other prices.
const SEARCH_PROFILES = [
  { fixedPrice: 15000, rating: 5 },
  { fixedPrice: 100000, rating: 0 },
];

const SERVICE_NAMES = [
  "Braiding",
  ...BEAUTY_PROVIDER_SEARCH_NAMES.filter((name) => name !== "Braiding"),
];

const getCurrentLocation = () =>
  new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Location access is needed to find providers near you."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) =>
        resolve({
          latitude: coords.latitude,
          longitude: coords.longitude,
        }),
      () => reject(new Error("Allow location access in your browser to see providers near you.")),
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

    const services = [...(existing.services || []), ...(provider.services || [])];
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

const extractDirectoryProviders = (response) =>
  Array.isArray(response?.data) ? response.data : [];

const normalizeAndMergeProviders = (directory, nearby, location) => {
  const normalizedDirectory = directory
    .map(normalizeSearchBeautyProvider)
    .filter((provider) => provider?.id)
    .map((provider) => {
      const distance = getDistanceFromLocation(provider, location);
      return distance === null ? provider : { ...provider, distanceFromPickup: distance };
    });
  const normalizedNearby = nearby
    .map(normalizeSearchBeautyProvider)
    .filter((provider) => provider?.id);

  return mergeProviderResults([...normalizedDirectory, ...normalizedNearby]);
};

const searchProviderBatch = async (location, searchProfile) => {
  const results = await Promise.allSettled(
    SERVICE_NAMES.map((serviceName) =>
      searchServiceProviders({
        serviceName,
        jobService: BEAUTY_CATEGORY,
        fixedPrice: searchProfile.fixedPrice,
        rating: searchProfile.rating,
        location,
      }),
    ),
  );

  const successfulResponses = results.filter(
    (result) => result.status === "fulfilled",
  );

  if (!successfulResponses.length) {
    throw results.find((result) => result.status === "rejected")?.reason;
  }

  return mergeProviderResults(
    successfulResponses.flatMap((result) =>
      extractNearbyProviders(result.value),
    ),
  );
};

const findBeautyProviders = async (currentLocation) => {
  const profileResults = await Promise.allSettled(
    SEARCH_PROFILES.map((profile) => searchProviderBatch(currentLocation, profile)),
  );
  if (profileResults.every((result) => result.status === "rejected")) {
    throw profileResults[0].reason;
  }
  return mergeProviderResults(
    profileResults
      .filter((result) => result.status === "fulfilled")
      .flatMap((result) => result.value),
  );
};

const getServiceSearchNames = (query) => {
  const normalizedQuery = query.trim().toLowerCase();
  const matchingNames = BEAUTY_PROVIDER_SEARCH_NAMES.filter((name) => {
    const normalizedName = name.toLowerCase();
    return (
      normalizedName.includes(normalizedQuery) ||
      normalizedQuery.includes(normalizedName)
    );
  });

  return matchingNames.length ? matchingNames : [query.trim()];
};

const searchProvidersForService = async (location, query) => {
  const names = getServiceSearchNames(query);
  const exactServiceName = BEAUTY_PROVIDER_SEARCH_NAMES.find(
    (name) => name.toLowerCase() === query.trim().toLowerCase(),
  );
  const [directoryResult, nearbyResults] = await Promise.all([
    Promise.resolve(
      getProviderDirectory({
        service: BEAUTY_CATEGORY,
        ...(exactServiceName ? { serviceName: exactServiceName } : {}),
        page: 1,
        limit: 100,
      }),
    ).then((value) => ({ status: "fulfilled", value }), (reason) => ({ status: "rejected", reason })),
    exactServiceName
      ? Promise.allSettled(
          names.flatMap((serviceName) =>
            SEARCH_PROFILES.map((searchProfile) =>
              searchServiceProviders({
                serviceName,
                jobService: BEAUTY_CATEGORY,
                fixedPrice: searchProfile.fixedPrice,
                rating: searchProfile.rating,
                location,
              }),
            ),
          ),
        )
      : Promise.resolve([]),
  ]);

  const fulfilledNearby = nearbyResults.filter(
    (result) => result.status === "fulfilled",
  );
  if (directoryResult.status === "rejected" && !fulfilledNearby.length) {
    throw directoryResult.reason;
  }

  return normalizeAndMergeProviders(
    directoryResult.status === "fulfilled"
      ? extractDirectoryProviders(directoryResult.value)
      : [],
    fulfilledNearby.flatMap((result) => extractNearbyProviders(result.value)),
    location,
  );
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
  location: [
    { value: "10", label: "Within 10 km" },
    { value: "5", label: "Within 5 km" },
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
  const [providers, setProviders] = useState([]);
  const [searchLocation, setSearchLocation] = useState(null);
  const [serviceSearchResults, setServiceSearchResults] = useState(null);
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
  const [locationFilter, setLocationFilter] = useState(String(DEFAULT_RADIUS_KM));

  useEffect(() => {
    setSearchTerm(new URLSearchParams(routeLocation.search).get("service") || "");
  }, [routeLocation.search]);

  const loadProviders = useCallback(async (signal) => {
    setLoading(true);
    setError("");
    setSearchLocation(null);

    try {
      const location = await getCurrentLocation();
      if (!signal.aborted) setSearchLocation(location);
      const [directoryResult, nearbyResult] = await Promise.allSettled([
        getProviderDirectory({ service: BEAUTY_CATEGORY, page: 1, limit: 100 }),
        findBeautyProviders(location),
      ]);
      const directoryProviders =
        directoryResult.status === "fulfilled"
          ? extractDirectoryProviders(directoryResult.value)
          : [];
      const nearbyProviders =
        nearbyResult.status === "fulfilled" ? nearbyResult.value : [];
      if (directoryResult.status === "rejected" && nearbyResult.status === "rejected") {
        throw directoryResult.reason;
      }
      const normalizedProviders = normalizeAndMergeProviders(
        directoryProviders,
        nearbyProviders,
        location,
      );

      if (signal.aborted) return;

      const localProviders = normalizedProviders.filter((provider) =>
        isDiscoverableProvider(provider) &&
        isWithinRadius(provider, DEFAULT_RADIUS_KM),
      );
      setProviders(localProviders);
      sessionStorage.setItem(
        BEAUTY_PROVIDER_CACHE_KEY,
        JSON.stringify(localProviders),
      );
    } catch (requestError) {
      if (signal.aborted) return;
      console.error("Failed to load beauty providers", requestError);
      setProviders([]);
      setError(
        requestError?.response?.data?.message ||
          requestError?.message ||
          "We could not load beauty providers. Please try again.",
      );
    } finally {
      if (!signal.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadProviders(controller.signal);
    return () => controller.abort();
  }, [loadProviders, reloadKey]);

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

    const timeoutId = setTimeout(async () => {
      try {
        const results = (await searchProvidersForService(searchLocation, query))
          .filter((provider) =>
            isDiscoverableProvider(provider) &&
            isWithinRadius(provider, DEFAULT_RADIUS_KM),
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
    }, 400);

    return () => {
      active = false;
      clearTimeout(timeoutId);
    };
  }, [searchLocation, searchTerm]);

  const filteredProviders = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    const sourceProviders =
      query && serviceSearchResults !== null
        ? serviceSearchResults
        : providers;

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
      .filter((provider) => {
        return isWithinRadius(provider, Number(locationFilter));
      })
      .sort((first, second) => {
        if (priceFilter === "low" || priceFilter === "high") {
          const firstPrice = Number(first.price);
          const secondPrice = Number(second.price);
          const firstHasPrice = Number.isFinite(firstPrice) && firstPrice > 0;
          const secondHasPrice = Number.isFinite(secondPrice) && secondPrice > 0;
          if (firstHasPrice !== secondHasPrice) return firstHasPrice ? -1 : 1;
          if (!firstHasPrice) return 0;
          return priceFilter === "low"
            ? firstPrice - secondPrice
            : secondPrice - firstPrice;
        }
        const firstDistance = Number(first.distanceFromPickup);
        const secondDistance = Number(second.distanceFromPickup);
        if (!Number.isFinite(firstDistance) && !Number.isFinite(secondDistance)) {
          return 0;
        }
        if (!Number.isFinite(firstDistance)) return 1;
        if (!Number.isFinite(secondDistance)) return -1;
        return firstDistance - secondDistance;
      });
  }, [
    locationFilter,
    priceFilter,
    providers,
    ratingFilter,
    serviceSearchResults,
    searchTerm,
  ]);

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
          <FilterSelect
            icon={MapPin}
            value={locationFilter}
            onChange={setLocationFilter}
            options={FILTER_OPTIONS.location}
          />
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
              : "No beauty providers are available within 10 km of your location right now."}
          </p>
        )}
      </div>
    </DashboardLayout>
  );
}
