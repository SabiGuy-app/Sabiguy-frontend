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
import { getProviderReviews } from "../../../api/provider";
import { beautyProvider as fallbackProvider } from "../data/beautyProvider";

import ServiceBookingOptions from "../components/booking/ServiceBookingOptions";
import BeautyBookingFlow from "..//components/booking/BeautyBookingFlow";

const BEAUTY_PROVIDER_CACHE_KEY = "beauty-search-providers-v8";

const extractReviews = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.reviews)) return response.data.reviews;
  if (Array.isArray(response?.reviews)) return response.reviews;
  return [];
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
  const { providerId } = useParams();
  const [provider, setProvider] = useState(fallbackProvider);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const [booking, setBooking] = useState(null);
  const [reviewsList, setReviewsList] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState("");

  useEffect(() => {
    let active = true;

    const loadProvider = async () => {
      setNotFound(false);
      setActiveImage(0);

      if (providerId === fallbackProvider.id) {
        setProvider(fallbackProvider);
        return;
      }

      setLoading(true);
      try {
        const cachedProviders = JSON.parse(
          sessionStorage.getItem(BEAUTY_PROVIDER_CACHE_KEY) || "[]",
        );
        const provider = cachedProviders.find(
          (item) => item.id === providerId || item.backendId === providerId,
        );

        if (active && provider) {
          setProvider(provider);
        } else if (active) {
          setNotFound(true);
        }
      } catch (error) {
        console.error("Failed to load beauty provider", error);
        if (active) setNotFound(true);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadProvider();

    return () => {
      active = false;
    };
  }, [providerId]);

  useEffect(() => {
    if (!providerId || providerId === fallbackProvider.id) {
      setReviewsList([]);
      return;
    }

    let active = true;
    setReviewsLoading(true);
    setReviewsError("");

    getProviderReviews(providerId)
      .then((response) => {
        if (!active) return;
        setReviewsList(extractReviews(response));
      })
      .catch((error) => {
        console.error("Failed to fetch beauty provider reviews", error);
        if (!active) return;
        if (error?.response?.data?.message === "Provider not found") {
          setReviewsList([]);
          setReviewsError("");
          return;
        }
        setReviewsError("Unable to load reviews");
      })
      .finally(() => {
        if (active) setReviewsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [providerId]);

  if (notFound)
    return (
      <DashboardLayout showSidebar={false}>
        <p className="py-8">
          Provider not found.{" "}
          <Link
            to="/dashboard/categories/beauty-personal-care"
            className="text-[#005823] underline"
          >
            Back to beauty services
          </Link>
        </p>
      </DashboardLayout>
    );

  const services = showAll ? provider.services : provider.services.slice(0, 3);
  const hasMoreServices = provider.services.length > 3;
  return (
    <DashboardLayout showSidebar={false}>
      <div className="mx-auto max-w-7xl text-[#231F20]">
        <Link
          to="/dashboard/categories/beauty-personal-care"
          className="mb-6 inline-flex items-center gap-5 py-2 text-sm font-semibold"
        >
          <ArrowLeft size={20} />
          {loading ? "Loading..." : provider.fullName}
        </Link>
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,2.15fr)_minmax(280px,1fr)]">
          <main className="min-w-0 rounded-2xl bg-white p-5 sm:p-8">
            <section aria-labelledby="work-gallery">
              <h1 id="work-gallery" className="mb-5 text-xl font-bold">
                Work Gallery
              </h1>
              <WorkPhoto
                key={provider.gallery[activeImage]}
                src={provider.gallery[activeImage]}
                alt={`Hair styling work ${activeImage + 1} by ${provider.fullName}`}
                className="aspect-[814/453] w-full rounded-xl border border-gray-200 object-cover"
              />
              <div className="mt-4 grid grid-cols-3 gap-3 sm:gap-5">
                {provider.gallery.slice(1).map((image, index) => (
                  <button
                    type="button"
                    key={image}
                    onClick={() => setActiveImage(index + 1)}
                    aria-label={`View hairstyle ${index + 2}`}
                    aria-pressed={activeImage === index + 1}
                    className={`overflow-hidden rounded-xl border-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#005823] ${activeImage === index + 1 ? "border-[#005823]" : "border-transparent"}`}
                  >
                    <WorkPhoto
                      src={image}
                      alt={`Hairstyle ${index + 2}`}
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
            </section>
            <section className="mt-10" aria-labelledby="about-provider">
              <h2 id="about-provider" className="mb-4 text-xl font-bold">
                About
              </h2>
              <p className="text-sm leading-relaxed text-gray-500 sm:text-base">
                {provider.about}
              </p>
            </section>
            <section className="mt-10" aria-labelledby="service-prices">
              <h2 id="service-prices" className="mb-4 text-xl font-bold">
                Services &amp; Pricing
              </h2>
              <div className="space-y-3">
                {services.map((service, index) => (
                  <ServiceBookingOptions
                    key={service.name}
                    service={service}
                    defaultOpen={index === 0}
                    onBook={setBooking}
                  />
                ))}
                {provider.services.length === 0 && (
                  <p className="rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
                    Service and pricing details are not available yet, so booking cannot be started.
                  </p>
                )}
              </div>
              {hasMoreServices && (
                <button
                  type="button"
                  onClick={() => setShowAll(!showAll)}
                  aria-expanded={showAll}
                  className="mt-3 w-full rounded border border-gray-200 py-2.5 text-xs hover:bg-gray-50"
                >
                  {showAll ? "View less" : "View all"}
                </button>
              )}
            </section>
            <section className="mb-12 mt-12" aria-labelledby="recent-reviews">
              <h2 id="recent-reviews" className="mb-5 text-xl font-bold">
                Recent Reviews
              </h2>
              <div className="divide-y divide-gray-200">
                {reviewsLoading ? (
                  <p className="py-6 text-sm text-gray-500">
                    Loading reviews...
                  </p>
                ) : reviewsError ? (
                  <p className="py-6 text-sm text-red-500">{reviewsError}</p>
                ) : reviewsList.length === 0 ? (
                  <p className="py-6 text-sm italic text-gray-500">
                    No reviews yet
                  </p>
                ) : (
                  reviewsList.map((review, index) => {
                    const reviewer = review.user || review.userId || {};
                    const reviewerName =
                      reviewer.fullName || review.userName || "Anonymous";
                    const reviewerAvatar =
                      reviewer.profilePicture || review.userAvatar || "/avatar.png";
                    const score = Number(review.score || review.rating || 0);
                    const reviewDate = review.ratedAt || review.createdAt;
                    const createdAt = reviewDate
                      ? new Date(reviewDate).toLocaleDateString(
                          undefined,
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        )
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
                          <p className="mt-3 text-sm leading-relaxed text-gray-500">
                            {review.review || "No feedback provided."}
                          </p>
                          {createdAt && (
                            <p className="mt-4 text-xs text-gray-500">
                              {createdAt}
                            </p>
                          )}
                        </div>
                      </article>
                    );
                  })
                )}
              </div>
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
                  <BadgeCheck
                    size={14}
                    className="text-[#005823]"
                    aria-label="Verified"
                  />
                </h3>
                <p className="mt-1 text-xs text-gray-400">
                  Hair Stylist &amp; Beauty Therapist
                </p>
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
                [Award, "25", "Jobs Done"],
                [Clock, "< 10 Mins", "Response Time"],
                [Star, "4.9", "Ratings"],
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
                ["Experience", BriefcaseBusiness, "2-5 Years"],
                ["Languages", Globe, "English, Yoruba"],
                [
                  "Specialties",
                  Image,
                  "Barbing, Hair Dresser, Spa, Lash Tech.",
                ],
                ["Availability", Clock, "Mon-Sat, 8 AM - 6 PM"],
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
          onClose={() => setBooking(null)}
        />
      )}
    </DashboardLayout>
  );
}
