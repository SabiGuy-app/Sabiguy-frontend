import { beautyProvider } from "../data/beautyProvider";

const BEAUTY_CATEGORY = "beauty & personal care";

const toNumber = (value, fallback = 0) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
};

const compactImages = (...groups) =>
  groups
    .flat()
    .filter((image) => typeof image === "string" && image.trim())
    .filter((image) => image !== "string");

const getServicePrice = (service = {}) => {
  const pricing = service.pricingModel;
  if (pricing && typeof pricing === "object") {
    const prices = [
      pricing.walk_in,
      pricing.customer_address,
      pricing.provider_address,
    ]
      .map((price) => toNumber(price))
      .filter((price) => price > 0);

    if (prices.length) return Math.min(...prices);
  }

  const price = Number(service.fixedPrice ?? service.price);
  return Number.isFinite(price) && price > 0 ? price : null;
};

export const isBeautyBusiness = (business = {}) => {
  const category = String(
    business.businessCategory || business.category || business.serviceType || "",
  )
    .replaceAll("_", " ")
    .toLowerCase();

  return category === BEAUTY_CATEGORY || category.includes("beauty");
};

export const extractBusinesses = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.businesses)) return response.data.businesses;
  if (Array.isArray(response?.businesses)) return response.businesses;
  return [];
};

export const extractNearbyProviders = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.nearbyProviders)) return response.nearbyProviders;
  if (Array.isArray(response?.data?.nearbyProviders)) {
    return response.data.nearbyProviders;
  }
  return [];
};

export const normalizeSearchBeautyProvider = (provider) => {
  if (!provider) return null;

  const sourceServices = Array.isArray(provider.service)
    ? provider.service
    : Array.isArray(provider.services)
      ? provider.services
      : [];
  const services = sourceServices
    .map((service) => {
      const name = service.serviceName || service.name;
      const price = getServicePrice(service);
      if (!name) return null;

      return {
        ...service,
        name,
        price,
        description:
          service.description ||
          `${name} service${service.duration ? ` lasting ${service.duration}` : ""}.`,
      };
    })
    .filter(Boolean);

  const prices = services
    .map((service) => toNumber(service.price))
    .filter((price) => price > 0);
  const firstService = services[0];
  const id = provider.id || provider._id;
  const ratingAverage = provider.rating?.average ?? provider.rating;
  const recentReviews = Array.isArray(provider.reviews)
    ? provider.reviews
    : Array.isArray(provider.recentReviews)
      ? provider.recentReviews
      : [];
  const ratingCount =
    provider.rating?.count ??
    (Array.isArray(provider.reviews) ? provider.reviews.length : provider.reviews);
  const gallery = compactImages(
    provider.workVisuals?.flatMap((item) => item.pictures || []),
    provider.studioImages?.flatMap((item) => item.pictures || []),
    provider.profilePicture,
  );

  return {
    ...provider,
    _id: id,
    id,
    backendId: id,
    fullName:
      provider.fullName ||
      provider.businessName ||
      provider.BusinessName ||
      "Beauty provider",
    profilePicture: provider.profilePicture || gallery[0] || "/avatar.png",
    rating: toNumber(ratingAverage),
    reviews: toNumber(ratingCount),
    price: prices.length ? Math.min(...prices) : null,
    city:
      provider.city ||
      provider.currentLocation?.address ||
      provider.location?.address ||
      (Number.isFinite(Number(provider.distanceFromPickup))
        ? `${provider.distanceFromPickup} km away`
        : "Location unavailable"),
    job: [{ service: firstService?.name || "Beauty & Personal Care" }],
    profilePath: `/dashboard/beauty/${id}`,
    gallery: gallery.length ? gallery : ["/avatar.png"],
    about:
      provider.about ||
      `${provider.fullName || "This provider"} offers beauty and personal care services.`,
    services,
    recentReviews,
    completedJobs: toNumber(provider.completedJobs),
    providerETA: provider.providerETA,
    distanceFromPickup: provider.distanceFromPickup,
    isAvailable:
      provider.availability?.isAvailable ?? provider.locationFresh !== false,
    isUnavailable:
      provider.availability?.isAvailable === false ||
      provider.locationFresh === false,
  };
};

export const normalizeBeautyProvider = (business, fallback = beautyProvider) => {
  if (!business) return fallback;

  const rawServices = Array.isArray(business.service) ? business.service : [];
  const services = rawServices
    .map((service) => {
      const name = service.serviceName || service.name;
      const price = getServicePrice(service);

      if (!name) return null;

      return {
        ...service,
        name,
        price,
        description:
          service.description ||
          `${name} service${service.duration ? ` lasting ${service.duration}` : ""}.`,
      };
    })
    .filter(Boolean);

  const gallery = compactImages(
    business.studioImages?.flatMap((item) => item.pictures || []),
    business.workVisuals?.flatMap((item) => item.pictures || []),
    business.businessPhotos,
    business.profilePicture,
  );

  const prices = services
    .map((service) => toNumber(service.price))
    .filter((price) => price > 0);
  const firstService = services[0] || fallback.services?.[0];
  const providerId =
    business.providerId?._id ||
    business.providerId ||
    business.userId?._id ||
    business.userId ||
    business._id ||
    fallback.backendId;

  return {
    ...fallback,
    ...business,
    _id: business._id || fallback._id,
    id: business._id || fallback.id,
    backendId: providerId,
    fullName:
      business.BusinessName ||
      business.businessName ||
      business.fullName ||
      fallback.fullName,
    profilePicture:
      business.profilePicture ||
      business.businessPhotos?.[0] ||
      fallback.profilePicture,
    rating: toNumber(
      business.rating?.average ?? business.rating,
      fallback.rating,
    ),
    reviews: toNumber(
      business.rating?.count ?? business.reviews,
      fallback.reviews,
    ),
    price: prices.length ? Math.min(...prices) : fallback.price,
    city:
      business.cityOfOperation ||
      business.BusinessAddress ||
      business.businessAddress ||
      fallback.city,
    job: [
      {
        service:
          firstService?.name ||
          firstService?.serviceName ||
          fallback.job?.[0]?.service,
      },
    ],
    profilePath: `/dashboard/beauty/${business._id || fallback.id}`,
    gallery: gallery.length ? gallery : fallback.gallery,
    about:
      business.about ||
      `${business.BusinessName || business.businessName || business.fullName || fallback.fullName} offers beauty and personal care services.`,
    services: services.length ? services : fallback.services,
    recentReviews: business.recentReviews || fallback.recentReviews,
  };
};
