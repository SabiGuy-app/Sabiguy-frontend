import { createElement, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BadgeCheck,
  Award,
  Clock,
  Star,
  MapPin,
  Globe,
  BriefcaseBusiness,
  Image,
} from "lucide-react";
import DashboardLayout from "../../../components/layouts/DashboardLayout";
import { getUserById } from "../../../api/user";
import { mergeBeautyServices, normalizeSearchBeautyProvider } from "../utils/beautyProviderMapper";

import ServiceBookingOptions from "../components/booking/ServiceBookingOptions";
import BeautyBookingFlow from "..//components/booking/BeautyBookingFlow";
import {
  getExploreCategoryBySlug,
  getProviderProfilePath,
} from "../data/exploreCategories";

const BEAUTY_PROVIDER_CACHE_KEY = "beauty-search-providers-v9";
const PRICING_OPTIONS = [
  { value: "walk_in", label: "Walk in" },
  { value: "customer_address", label: "My Address" },
  { value: "provider_address", label: "Provider's Address" },
];

const getServiceId = (service) =>
  service._id || service.id || service.name || service.serviceName;

const getServicePrice = (service, pricingOption) => {
  const rawPrice =
    service.pricingModel?.[pricingOption] ??
    (!service.pricingModel ? service.price : null);
  const price = Number(rawPrice);
  return Number.isFinite(price) && price > 0 ? price : null;
};

const getDurationMinutes = (duration) => {
  const match = String(duration || "").match(
    /(\d+(?:\.\d+)?)\s*(hour|hr|min)/i,
  );
  if (!match) return 45;
  const amount = Number(match[1]);
  return /hour|hr/i.test(match[2]) ? amount * 60 : amount;
};

function WorkPhoto({ src, alt, className }) {
  const [failed, setFailed] = useState(false);
  return failed ? (
    <div
      role="img"
      aria-label={alt}
      className={`${className} flex items-center justify-center bg-gray-100 text-gray-400`}
    >
      <Image size={32} aria-hidden="true" />
    </div>
  ) : (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}

export default function BeautyProviderProfile() {
  const { providerId, categorySlug = "beauty-personal-care" } = useParams();
  const category = getExploreCategoryBySlug(categorySlug);
  const pricingOptions = PRICING_OPTIONS.map((option) =>
    option.value === "walk_in" && category?.id === "beauty"
      ? { ...option, label: "Walk in Salon" }
      : option,
  );
  const [providerState, setProviderState] = useState(null);
  const [missingProviderId, setMissingProviderId] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [booking, setBooking] = useState(null);
  const [pricingOption, setPricingOption] = useState("walk_in");
  const [selectedServiceIds, setSelectedServiceIds] = useState([]);
  const [reviewState, setReviewState] = useState(null);
  const provider =
    providerState?.requestedId === providerId ? providerState.data : null;

  useEffect(() => {
    let active = true;

    const loadProvider = async () => {
      setMissingProviderId(null);
      setActiveImage(0);
      setShowAllReviews(false);
      setReviewState({ providerId, reviews: null, loading: true, error: "" });
      let cachedProvider = null;
      try {
        const cachedProviders = JSON.parse(
          sessionStorage.getItem(BEAUTY_PROVIDER_CACHE_KEY) || "[]",
        );
        cachedProvider = cachedProviders.find(
          (item) => item.id === providerId || item.backendId === providerId,
        );
      } catch (error) {
        console.warn("Could not read cached beauty provider", error);
      }
      if (active) {
        setProviderState({ requestedId: providerId, data: cachedProvider });
      }

      try {
        const response = await getUserById(providerId);
        if (!active) return;
        const entry =
          response?.data?.provider ||
          response?.data?.data ||
          response?.data ||
          response?.provider ||
          response;
        const profile = entry?.providerProfile || entry?.profile || entry?.userId?.data || {};
        const fullEntry = { ...profile, ...entry };
        if (!fullEntry._id && !fullEntry.id) {
          setMissingProviderId(providerId);
          return;
        }
        const details = normalizeSearchBeautyProvider({
          ...cachedProvider,
          ...fullEntry,
          service: mergeBeautyServices(
            Array.isArray(fullEntry.service) && fullEntry.service.length
              ? fullEntry.service
              : fullEntry.services,
            cachedProvider?.services,
          ),
          workVisuals: fullEntry.workVisuals ?? cachedProvider?.workVisuals,
          businessAddress: fullEntry.businessAddress ?? cachedProvider?.businessAddress,
          BusinessAddress: fullEntry.BusinessAddress ?? cachedProvider?.BusinessAddress,
        }, category && {
          categoryLabel: category.label,
          getProfilePath: (id) => getProviderProfilePath(category, id),
        });
        setActiveImage(0);
        setProviderState({ requestedId: providerId, data: details });
        setReviewState({
          providerId,
          reviews: Array.isArray(entry?.reviews) ? entry.reviews : null,
          loading: false,
          error: !entry
            ? "Reviews are unavailable for this provider."
            : !Array.isArray(entry.reviews) ||
                (entry.reviews.length === 0 && Number(entry.rating?.count) > 0)
              ? "Review details are not included in the provider directory yet."
              : "",
        });
      } catch (error) {
        if (!active) return;
        console.error("Failed to refresh beauty provider reviews", error);
        if (!cachedProvider) setMissingProviderId(providerId);
        setReviewState({
          providerId,
          reviews: null,
          loading: false,
          error: "Unable to load reviews",
        });
      }
    };

    loadProvider();

    return () => {
      active = false;
    };
  }, [category, providerId]);

  const categoryPath = category?.to || "/dashboard/categories";

  if (!category || missingProviderId === providerId)
    return (
      <DashboardLayout showSidebar={false}>
        <p className="py-8">
          Provider not found.{" "}
          <Link
            to={categoryPath}
            className="text-[#005823] underline"
          >
            Back to {category ? category.title : "categories"}
          </Link>
        </p>
      </DashboardLayout>
    );

  if (!provider)
    return (
      <DashboardLayout showSidebar={false}>
        <div
          className="mx-auto max-w-7xl animate-pulse"
          aria-label="Loading provider profile"
        >
          <div className="mb-6 h-6 w-48 rounded bg-gray-200" />
          <div className="grid gap-6 lg:grid-cols-[minmax(0,2.15fr)_minmax(280px,1fr)]">
            <div className="aspect-[814/453] rounded-xl bg-gray-200" />
            <div className="h-48 rounded-xl bg-gray-200" />
          </div>
        </div>
      </DashboardLayout>
    );

  const services = provider.services || [];
  const availablePricingOptions = pricingOptions.filter((option) =>
    services.some((service) => getServicePrice(service, option.value) !== null),
  );
  const selectedServices = services.filter((service) =>
    selectedServiceIds.includes(getServiceId(service)),
  );
  const selectedTotal = selectedServices.reduce(
    (total, service) => total + (getServicePrice(service, pricingOption) || 0),
    0,
  );
  const selectedDuration = selectedServices.reduce(
    (total, service) => total + getDurationMinutes(service.duration),
    0,
  );
  const toggleService = (service) => {
    const serviceId = getServiceId(service);
    setSelectedServiceIds((current) =>
      current.includes(serviceId)
        ? current.filter((id) => id !== serviceId)
        : [...current, serviceId],
    );
  };
  const startSelectedBooking = () => {
    if (!selectedServices.length) return;
    const option = pricingOptions.find((item) => item.value === pricingOption);
    setBooking({
      service: selectedServices.map((service) => service.name).join(", "),
      services: selectedServices.map((service) => ({
        serviceName: service.name || service.serviceName,
      })),
      id: pricingOption,
      label: option?.label || "Service location",
      price: selectedTotal,
      duration: selectedDuration,
      pricingOption,
      mode: "later",
    });
  };
  const currentReviewState =
    reviewState?.providerId === providerId ? reviewState : null;
  const reviewsLoading = !currentReviewState || currentReviewState.loading;
  const reviewsList = [
    ...(currentReviewState?.reviews ?? provider.recentReviews ?? []),
  ].sort(
    (first, second) =>
      (Date.parse(second.ratedAt || second.createdAt) || 0) -
      (Date.parse(first.ratedAt || first.createdAt) || 0),
  );
  const specialties = services
    .map((service) => service.name || service.serviceName)
    .filter(Boolean)
    .join(", ");
  const years = Number(provider.yearsOfExperience);
  const experience = provider.yearsOfExperience != null &&
    Number.isFinite(years)
    ? `${years} ${years === 1 ? "year" : "years"}`
    : "Not provided";
  const languages = Array.isArray(provider.languages)
    ? provider.languages.filter(Boolean).join(", ")
    : provider.languages || "";
  const availableDays = Array.isArray(provider.availableDays)
    ? [...new Set(provider.availableDays
        .filter(Boolean)
        .filter((day) => !["string", "str"].includes(String(day).trim().toLowerCase()))
        .map((day) => String(day).slice(0, 3)))]
        .join(", ")
    : "";
  const businessHours = [provider.businessHours?.start, provider.businessHours?.end]
    .filter(Boolean)
    .join(" - ");
  const availability = [availableDays, businessHours].filter(Boolean).join(", ");
  const jobsDone = provider.completedJobs == null
    ? "Not available"
    : Number(provider.completedJobs).toLocaleString();
  const responseTime = typeof provider.responseTime === "string" &&
    provider.responseTime.trim()
    ? provider.responseTime
    : "Not available";
  return (
    <DashboardLayout showSidebar={false}>
      <div className="mx-auto max-w-7xl text-[#231F20]">
        <Link
          to={categoryPath}
          className="mb-6 inline-flex items-center gap-5 py-2 text-sm font-semibold"
        >
          <ArrowLeft size={20} />
          {provider.fullName}
        </Link>
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,2.15fr)_minmax(280px,1fr)]">
          <main className="min-w-0 rounded-2xl bg-white p-5 sm:p-8">
            <section aria-labelledby="work-gallery">
              <h1 id="work-gallery" className="mb-5 text-xl font-bold">
                Work Gallery
              </h1>
              {provider.gallery.length ? (
                <>
                  <WorkPhoto
                    key={provider.gallery[activeImage]}
                    src={provider.gallery[activeImage]}
                    alt={`Work photo ${activeImage + 1} by ${provider.fullName}`}
                    className="aspect-[814/453] w-full rounded-xl border border-gray-200 object-cover"
                  />
                  <div className="mt-4 grid grid-cols-3 gap-3 sm:gap-5">
                    {provider.gallery.slice(1).map((image, index) => (
                      <button
                        type="button"
                        key={image}
                        onClick={() => setActiveImage(index + 1)}
                        aria-label={`View work photo ${index + 2}`}
                        aria-pressed={activeImage === index + 1}
                        className={`overflow-hidden rounded-xl border-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#005823] ${activeImage === index + 1 ? "border-[#005823]" : "border-transparent"}`}
                      >
                        <WorkPhoto
                          src={image}
                          alt={`Work photo ${index + 2}`}
                          className="aspect-[255/174] w-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                  {activeImage !== 0 && (
                    <button
                      type="button"
                      onClick={() => setActiveImage(0)}
                      className="mt-3 text-sm text-[#005823] underline"
                    >
                      Back to featured photo
                    </button>
                  )}
                </>
              ) : (
                <p className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-8 text-sm text-gray-500">
                  No work photos provided yet.
                </p>
              )}
            </section>
            <section className="mt-10" aria-labelledby="about-provider">
              <h2 id="about-provider" className="mb-4 text-xl font-bold">
                About
              </h2>
              <p className="text-sm leading-relaxed text-gray-500 sm:text-base">
                {provider.about || "No description provided yet."}
              </p>
            </section>
            <section className="mt-10" aria-labelledby="service-prices">
              <h2 id="service-prices" className="mb-4 text-xl font-bold">
                Services &amp; Pricing
              </h2>
              <fieldset className="mb-4">
                <legend className="mb-2 text-sm font-medium text-gray-700">
                  Choose where the service will take place
                </legend>
                <div className="flex flex-wrap gap-2">
                  {pricingOptions.map((option) => {
                    const available = availablePricingOptions.some(
                      (item) => item.value === option.value,
                    );
                    return (
                      <button
                        key={option.value}
                        type="button"
                        disabled={!available}
                        aria-pressed={pricingOption === option.value}
                        onClick={() => {
                          setPricingOption(option.value);
                          setSelectedServiceIds((current) =>
                            current.filter((id) => {
                              const service = services.find(
                                (item) => getServiceId(item) === id,
                              );
                              return (
                                service &&
                                getServicePrice(service, option.value) !== null
                              );
                            }),
                          );
                        }}
                        className={`rounded-md border px-3 py-2 text-sm ${
                          pricingOption === option.value
                            ? "border-[#34805A] bg-[#34805A] text-white"
                            : "border-gray-200 text-gray-700"
                        } disabled:cursor-not-allowed disabled:opacity-40`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
              <div className="space-y-3">
                {services.map((service) => (
                  <ServiceBookingOptions
                    key={getServiceId(service)}
                    service={service}
                    pricingOption={pricingOption}
                    selected={selectedServiceIds.includes(
                      getServiceId(service),
                    )}
                    onToggle={toggleService}
                  />
                ))}
                {provider.services.length === 0 && (
                  <p className="rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
                    Service and pricing details are not available yet, so
                    booking cannot be started.
                  </p>
                )}
              </div>
              {services.length > 0 && (
                <button
                  type="button"
                  disabled={!selectedServices.length}
                  onClick={startSelectedBooking}
                  className="mt-4 flex w-full items-center justify-between rounded-md bg-[#34805A] px-4 py-3 text-sm font-semibold text-white hover:bg-[#2d6f4f] disabled:cursor-not-allowed disabled:bg-gray-300"
                >
                  <span>
                    Book {selectedServices.length || "selected"} service
                    {selectedServices.length === 1 ? "" : "s"}
                  </span>
                  <span>
                    {selectedTotal > 0
                      ? `₦${selectedTotal.toLocaleString("en-NG")}`
                      : ""}
                  </span>
                </button>
              )}
            </section>
            <section className="mb-12 mt-12" aria-labelledby="recent-reviews">
              <h2 id="recent-reviews" className="mb-5 text-xl font-bold">
                Recent Reviews
              </h2>
              <div className="divide-y divide-gray-200">
                {reviewsLoading && reviewsList.length === 0 ? (
                  <p className="py-6 text-sm text-gray-500">
                    Loading reviews...
                  </p>
                ) : currentReviewState?.error && reviewsList.length === 0 ? (
                  <p className="py-6 text-sm text-gray-500">
                    {currentReviewState.error}
                  </p>
                ) : reviewsList.length === 0 ? (
                  <p className="py-6 text-sm italic text-gray-500">
                    No reviews yet
                  </p>
                ) : (
                  (showAllReviews ? reviewsList : reviewsList.slice(0, 3)).map(
                    (review, index) => {
                      const reviewer = review.user || review.userId || {};
                      const reviewerName =
                        reviewer.fullName || review.userName || "Anonymous";
                      const reviewerAvatar =
                        reviewer.profilePicture ||
                        review.userAvatar ||
                        "/avatar.png";
                      const score = Number(review.score || review.rating || 0);
                      const reviewDate = review.ratedAt || review.createdAt;
                      const createdAt = reviewDate
                        ? new Date(reviewDate).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "";

                      return (
                        <article
                          key={review._id || review.id || index}
                          className="flex gap-3 py-6 first:pt-0"
                        >
                          <img
                            src={reviewerAvatar}
                            alt={reviewerName}
                            className="h-11 w-11 shrink-0 rounded-full object-cover"
                            onError={(event) => {
                              event.currentTarget.onerror = null;
                              event.currentTarget.src = "/avatar.png";
                            }}
                          />
                          <div>
                            <div className="flex flex-wrap items-center gap-3">
                              <h3 className="font-medium">{reviewerName}</h3>
                              <span
                                aria-label={`${score} out of 5 stars`}
                                className="flex gap-1 text-amber-400"
                              >
                                {Array.from({ length: 5 }, (_, i) => (
                                  <Star
                                    key={i}
                                    size={15}
                                    fill={i < score ? "currentColor" : "none"}
                                  />
                                ))}
                              </span>
                            </div>
                            {review.review?.trim() && (
                              <p className="mt-3 text-sm leading-relaxed text-gray-500">
                                {review.review}
                              </p>
                            )}
                            {createdAt && (
                              <p className="mt-4 text-xs text-gray-500">
                                {createdAt}
                              </p>
                            )}
                          </div>
                        </article>
                      );
                    },
                  )
                )}
              </div>
              {reviewsList.length > 3 &&
                !reviewsLoading &&
                !currentReviewState?.error && (
                  <button
                    type="button"
                    onClick={() => setShowAllReviews((value) => !value)}
                    aria-expanded={showAllReviews}
                    className="mt-3 w-full rounded border border-gray-200 py-2.5 text-xs hover:bg-gray-50"
                  >
                    {showAllReviews ? "View less" : "View more"}
                  </button>
                )}
            </section>
          </main>
          <aside className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm lg:sticky lg:top-24">
            <h2 className="mb-5 font-semibold">Service provider</h2>
            <div className="flex items-center gap-3">
              <WorkPhoto
                src={provider.profilePicture}
                alt={provider.fullName}
                className="h-16 w-16 shrink-0 rounded-full object-cover"
              />
              <div>
                <h3 className="flex items-center gap-1 text-sm font-semibold">
                  {provider.fullName}
                  {provider.kycVerified && <BadgeCheck
                    size={14}
                    className="text-[#005823]"
                    aria-label="Verified"
                  />}
                </h3>
                {provider.job?.[0]?.tagLine && <p className="mt-1 text-xs text-gray-400">
                  {provider.job[0].tagLine}
                </p>}
                <p className="mt-1 flex items-center text-xs text-gray-500">
                  <Star size={14} className="fill-amber-400 text-amber-400" />
                  {provider.rating} ({provider.reviews} reviews)
                </p>
                <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                  <MapPin size={12} />
                  {provider.city}
                </p>
              </div>
            </div>
            <div className="my-6 grid grid-cols-3 border-y border-gray-200 py-5 text-center">
              {[
                [Award, jobsDone, "Jobs Done"],
                [Clock, responseTime, "Response Time"],
                [Star, provider.rating, "Ratings"],
              ].map(([Icon, value, label], index) => (
                <div
                  key={label}
                  className="flex flex-col items-center border-r border-gray-100 last:border-0"
                >
                  {createElement(Icon, {
                    size: 20,
                    className:
                      index === 0
                        ? "text-[#005823]"
                        : index === 2
                          ? "text-amber-400"
                          : "text-gray-500",
                  })}
                  <strong className="mt-1 text-xs">{value}</strong>
                  <span className="mt-1 text-[10px] text-gray-400">
                    {label}
                  </span>
                </div>
              ))}
            </div>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-5 text-xs">
              {[
                ["Experience", BriefcaseBusiness, experience],
                ["Languages", Globe, languages || "Not provided"],
                ["Specialties", Image, specialties || "Not provided"],
                ["Availability", Clock, availability || "Not provided"],
              ].map(([label, Icon, value]) => (
                <div key={label}>
                  <dt className="mb-2 font-semibold">{label}</dt>
                  <dd className="flex items-start gap-1 leading-relaxed text-gray-500">
                    {createElement(Icon, {
                      size: 13,
                      className: "mt-0.5 shrink-0",
                    })}
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </div>
      {booking && (
        <BeautyBookingFlow
          provider={provider}
          booking={booking}
          category={category}
          onClose={() => setBooking(null)}
        />
      )}
    </DashboardLayout>
  );
}
