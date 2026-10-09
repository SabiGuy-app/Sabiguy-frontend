import DeliveryMap from "../../../../components/dashboard/Map";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Banknote,
  BadgeCheck,
  Bell,
  CalendarDays,
  Clock,
  Copy,
  MapPin,
  MapPinned,
  MessageCircle,
  Navigation,
  Phone,
  Star,
  Check,
  MapPinHouse,
  Wallet,
  Wrench,
  X,
} from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaTelegramPlane,
  FaWhatsapp,
} from "react-icons/fa";
import distance from "/distance.png";
import {
  normalizeBeautyBooking,
  useBeautyBookingStore,
} from "../../../../stores/beautyBooking.store";
import { beautyProvider as defaultProvider } from "../../data/beautyProvider";
import Modal from "../../../../components/Modal";
import Button from "../../../../components/button";
import ReviewModal from "../../../../components/dashboard/ReviewModal";
import BeautyCompletionReviewModal from "../../../../components/dashboard/BeautyCompletionReviewModal";
import BeautyBookingFlow from "./BeautyBookingFlow";
import { formatMoney } from "../../utils/bookingFormat";
import { getBookingsDetails } from "../../../../api/bookings";

const statuses = {
  pending: "Pending",
  accepted: "Awaiting Payment",
  active: "In Progress",
  review: "Waiting Confirmation",
  completed: "Completed",
  expired: "Expired",
  cancelled: "Cancelled",
};
export default function BeautyRequest({
  filter = "all",
  sourceBookings,
  loading: sourceLoading,
  loadError,
  onRefresh,
}) {
  const { bookings, fetchBookings, loading, error } = useBeautyBookingStore();
  useEffect(() => {
    if (sourceBookings) return;
    fetchBookings().catch(() => {});
  }, [fetchBookings, sourceBookings]);

  const bookingsToDisplay = sourceBookings
    ? sourceBookings
        .filter(
          (booking) =>
            String(booking?.serviceType || "")
              .trim()
              .toLowerCase()
              .replace(/-/g, "_") === "beauty_personal_care",
        )
        .map(normalizeBeautyBooking)
    : bookings;
  const isLoading = sourceLoading ?? loading;
  const displayError = loadError || error;

  const visibleBookings = bookingsToDisplay.filter((booking) => {
    if (filter === "pending") return ["pending", "accepted"].includes(booking.status);
    if (filter === "active") return ["active", "review"].includes(booking.status);
    if (filter === "completed") return booking.status === "completed";
    return true;
  });

  if (!sourceBookings && isLoading && bookingsToDisplay.length === 0) {
    return <div className="py-8 text-center text-sm text-gray-500">Loading your bookings...</div>;
  }
  if (!sourceBookings && displayError && bookingsToDisplay.length === 0) {
    return <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{displayError}</div>;
  }

  return (
    <div className="mb-4 space-y-3">
      {visibleBookings.map((booking) => (
        <BeautyBookingCard key={booking.id} booking={booking} onRefresh={onRefresh} />
      ))}
    </div>
  );
}

function BeautyBookingCard({ booking, onRefresh }) {
  const { cancel, complete, error } = useBeautyBookingStore();
  const [params, setParams] = useSearchParams();
  const [screen, setScreen] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isReviewExpanded, setIsReviewExpanded] = useState(false);
  const [actionError, setActionError] = useState("");
  const [latestCompletionPhotos, setLatestCompletionPhotos] = useState(null);
  const [completionPhotosLoading, setCompletionPhotosLoading] = useState(false);
  const [completionPhotosError, setCompletionPhotosError] = useState("");
  const [secondsToStart, setSecondsToStart] = useState(null);
  const bookingProvider = booking.provider || {};
  const provider = {
    ...defaultProvider,
    ...bookingProvider,
    fullName: bookingProvider.fullName || booking.providerName || "Provider",
    profilePicture: bookingProvider.profilePicture || "/avatar.png",
    city: bookingProvider.city || bookingProvider.currentLocation?.address || "",
    rating:
      typeof bookingProvider.rating === "number"
        ? bookingProvider.rating
        : bookingProvider.rating?.average ?? 0,
    reviews: bookingProvider.rating?.count ?? 0,
  };
  const close = () => {
    setScreen(null);
    if (params.has("beauty")) {
      const next = new URLSearchParams(params);
      next.delete("beauty");
      setParams(next, { replace: true });
    }
  };
  const refreshRequests = async () => {
    try {
      await onRefresh?.();
    } catch {
      // The booking action already succeeded; a refresh failure should not undo it.
    }
  };
  const requestedView = params.get("beauty");
  const view =
    screen ||
    (["payment", "review", "track", "details"].includes(requestedView)
      ? requestedView
      : null);
  useEffect(() => {
    if (view !== "review" || !booking.id) return undefined;
    let active = true;
    getBookingsDetails(booking.id)
      .then((response) => {
        if (!active) return;
        const detail = response?.data?.booking || response?.data?.data?.booking || response?.data?.data || response?.data || response?.booking || response;
        setLatestCompletionPhotos(detail?.jobCompletedImages || []);
        setCompletionPhotosError("");
      })
      .catch((err) => { if (active) setCompletionPhotosError(err.response?.data?.message || "Unable to load work photos."); })
      .finally(() => { if (active) setCompletionPhotosLoading(false); });
    setCompletionPhotosLoading(true);
    return () => { active = false; };
  }, [view, booking.id]);
  const profileLink = `${window.location.origin}${provider.profilePath}`;
  const shareText = encodeURIComponent(
    `Book ${provider.fullName} on SabiGUY: ${profileLink}`,
  );
  const encodedProfileLink = encodeURIComponent(profileLink);
  const reviewScore = Math.max(
    0,
    Math.min(5, Math.round(Number(booking.review?.score || 0))),
  );
  const reviewText = booking.review?.review || "";
  const shouldShowReadMore = reviewText.length > 120;
  const displayedReviewText =
    isReviewExpanded || !shouldShowReadMore
      ? reviewText
      : `${reviewText.slice(0, 120).trim()}...`;
  const dropoffAddress = booking.address || "";
  const providerAddress = bookingProvider.currentLocation?.address?.trim() || "";
  const showRoute =
    booking.pricingOption === "customer_address" &&
    providerAddress &&
    dropoffAddress.trim() &&
    providerAddress.toLowerCase() !== dropoffAddress.trim().toLowerCase();
  const serviceLocationAddress =
    booking.pricingOption === "customer_address"
      ? dropoffAddress
      : providerAddress || dropoffAddress;
  const providerArea = provider.currentLocation?.address || provider.city || "";
  const canCancel = ["pending", "accepted"].includes(booking.status);
  const pickupNote = booking.note || "";
  const serviceDateValue = new Date(booking.date);
  const serviceDate = Number.isNaN(serviceDateValue.getTime())
    ? "Not scheduled"
    : `${serviceDateValue.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })} - ${serviceDateValue.toLocaleTimeString("en-US", {
        hour: "numeric",
        ...(serviceDateValue.getMinutes() ? { minute: "2-digit" } : {}),
      })}`;
  const durationLabel =
    booking.raw?.serviceDetails?.duration ||
    (Number(booking.duration) >= 60
      ? `${Number(booking.duration) / 60} hours`
      : `${booking.duration} minutes`);

  useEffect(() => {
    const startAt = Date.parse(booking.date || "");
    if (!Number.isFinite(startAt)) {
      setSecondsToStart(null);
      return undefined;
    }

    const updateCountdown = () =>
      Math.max(0, Math.floor((startAt - Date.now()) / 1000));
    const initialSeconds = updateCountdown();
    setSecondsToStart(initialSeconds);
    if (initialSeconds === 0) return undefined;

    const intervalId = window.setInterval(() => {
      const remaining = updateCountdown();
      setSecondsToStart(remaining);
      if (remaining === 0) window.clearInterval(intervalId);
    }, 1000);
    return () => window.clearInterval(intervalId);
  }, [booking.date]);

  const countdownText =
    secondsToStart == null
      ? "--:--:--"
      : [
          Math.floor(secondsToStart / 3600),
          Math.floor((secondsToStart % 3600) / 60),
          secondsToStart % 60,
        ]
          .map((value) => String(value).padStart(2, "0"))
          .join(":");
  const routePoints = {
    pickup: booking.raw?.providerId?.currentLocation?.coordinates
      ? { latitude: booking.raw.providerId.currentLocation.coordinates[1], longitude: booking.raw.providerId.currentLocation.coordinates[0] }
      : null,
    dropoff: booking.raw?.location?.coordinates?.coordinates
      ? { latitude: booking.raw.location.coordinates.coordinates[1], longitude: booking.raw.location.coordinates.coordinates[0] }
      : null,
  };

  return (
    <>
      <article className="rounded-md bg-white px-4 py-4 shadow-sm sm:px-5">
          {(error || actionError) && (
            <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
              {actionError || error}
            </p>
          )}
          <div className="flex items-start gap-3">
            <img
              src={booking.providerImage || "/avatar.png"}
              alt={booking.providerName || provider.fullName}
              className="h-9 w-9 shrink-0 rounded-full object-cover"
            />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-semibold text-[#231F20]">
                  {booking.service}
                </h3>
                <span
                  className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${booking.status === "completed" ? "border-[#34805A] bg-[#34805A1A] text-[#34805A]" : booking.status === "active" ? "border-blue-200 bg-blue-50 text-blue-600" : ["expired", "cancelled"].includes(booking.status) ? "border-gray-200 bg-gray-50 text-gray-500" : "border-amber-200 bg-amber-50 text-amber-700"}`}
                >
                  {statuses[booking.status] || booking.apiStatus || booking.status}
                </span>
              </div>
              <p className="mt-1 inline-flex items-center gap-1 rounded-sm bg-[#34805A1A] px-1.5 py-0.5 text-[10px] text-[#34805A]">
                <MapPinned size={11} />
                {booking.label}
              </p>
              {booking.address && <p className="mt-1 flex items-center gap-1.5 text-xs text-[#231F20BF]">
                <MapPin size={14} className="text-[#34805A]" />
                {booking.address}
              </p>}
              {booking.date && <p className="mt-1 flex items-center gap-1.5 text-xs text-[#231F20BF]">
                <CalendarDays size={14} className="text-[#34805A]" />
                {new Date(booking.date).toLocaleString("en-NG", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </p>}
              {booking.distance?.value != null && <p className="mt-1 flex items-center gap-1.5 text-xs text-[#231F20BF]">
                <img
                  src={distance}
                  alt=""
                  className="h-3.5 w-3.5 object-contain"
                />
                Distance: {booking.distance.value} {booking.distance.unit || "km"}
              </p>}
            </div>
            <p className="shrink-0 text-sm font-semibold text-[#005823]">{formatMoney(booking.price)}</p>
          </div>
          <div className="mt-3 border-t border-gray-200 pt-2.5">
            {booking.review && (booking.review.review || booking.review.score) && (
            <div className="rounded-sm bg-gray-50 px-2 py-2">
              <div className="flex items-center gap-1 text-amber-400">
                {Array.from({ length: reviewScore }, (_, index) => (
                  <Star key={index} size={16} fill="currentColor" />
                ))}
                <span className="text-sm font-semibold text-[#231F20]">
                  {Number(booking.review.score || 0).toFixed(1)}
                </span>
              </div>
              <p className="mt-1 text-xs text-[#231F20BF]">
                {displayedReviewText}
              </p>
              {shouldShowReadMore && (
                <button
                  type="button"
                  className="mt-1 text-xs text-[#231F20BF] hover:text-[#005823]"
                  onClick={() => setIsReviewExpanded((expanded) => !expanded)}
                >
                  {isReviewExpanded ? "Show less" : "Read more"}
                </button>
              )}
            </div>
          )}
          {!["completed", "expired", "cancelled"].includes(booking.status) && (
            <div className="mt-4 flex flex-wrap gap-3 border-t border-gray-100 pt-4">
              <Button size="sm" type="button" onClick={() => setScreen("details")}>
                View Details
              </Button>
              {booking.status === "review" && (
                <Button size="sm" type="button" onClick={() => setScreen("review")}>
                  Review
                </Button>
              )}
              {booking.status === "accepted" && (
                <Button size="sm" type="button" onClick={() => setScreen("payment")}>
                  <span className="flex items-center justify-center gap-2">
                  <Wallet size={14} />
                    Make Payment
                  </span>
                </Button>
              )}
              {["accepted", "active"].includes(booking.status) && (
                <Button
                  size="sm"
                  type="button"
                  variant="outline"
                  onClick={() => setScreen("track")}
                >
                  <span className="flex items-center justify-center gap-2">
                    <Navigation size={14} />
                    Track provider
                  </span>
                </Button>
              )}
            </div>
          )}
          </div>
      </article>
      {view === "payment" && (
        <BeautyBookingFlow
          provider={provider}
          booking={booking}
          initialStage="payment"
          onClose={close}
        />
      )}
      {view === "track" && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#D8D8D8] px-4 py-8">
          <div className="mx-auto min-h-[720px] max-w-6xl bg-white shadow-sm">
            <header className="flex h-[72px] items-center justify-between border-b border-gray-100 px-8">
              <img
                src="/logo.jpg"
                alt="SabiGuy"
                className="h-8 w-auto object-contain"
              />
              <div className="flex items-center gap-8">
                <button
                  type="button"
                  aria-label="Notifications"
                  className="relative text-[#231F20BF]"
                >
                  <Bell size={22} />
                  <span className="absolute -right-1 top-0 h-2 w-2 rounded-full bg-red-500" />
                </button>
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#8BC53F] bg-[#8BC53F33] text-[#78B936]">
                  <span className="h-5 w-5 rounded-full bg-[#78B936]" />
                </span>
              </div>
            </header>

            <main className="px-8 py-9">
              <button
                type="button"
                onClick={() => setScreen(null)}
                className="mb-5 inline-flex items-center gap-4 text-2xl font-semibold text-[#231F20]"
              >
                <ArrowLeft size={28} />
                {booking.service}
              </button>

              <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                <section>
                  <div className="rounded-xl border border-gray-200 bg-white px-8 py-5">
                    {showRoute ? (
                      <div className="relative space-y-7">
                        <span className="absolute left-[9px] top-5 h-11 border-l border-dashed border-[#00582333]" />
                        <div className="flex gap-4">
                          <span className="relative z-10 mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#E6EFE9]">
                            <span className="h-2.5 w-2.5 rounded-full bg-[#005823]" />
                          </span>
                          <div>
                            <p className="text-xs text-[#231F2080]">From</p>
                            <p className="text-base text-[#231F20BF]">{providerAddress}</p>
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <span className="relative z-10 mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#E6EFE9] text-[#005823]">
                            <MapPin size={14} fill="currentColor" />
                          </span>
                          <div>
                            <p className="text-xs text-[#231F2080]">To</p>
                            <p className="text-base text-[#231F20BF]">{dropoffAddress}</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-4">
                        <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#E6EFE9] text-[#005823]">
                          <MapPin size={14} fill="currentColor" />
                        </span>
                        <div>
                          <p className="text-xs text-[#231F2080]">Service location</p>
                          <p className="text-base text-[#231F20BF]">
                            {serviceLocationAddress || "Location unavailable"}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-5 flex items-center gap-5">
                    <img
                      src={provider.profilePicture}
                      alt={provider.fullName}
                      className="h-[72px] w-[72px] rounded-full object-cover"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-[#231F20]">
                          {provider.fullName}
                        </h3>
                        <BadgeCheck size={15} className="text-[#2F7B4F]" />
                      </div>
                      <p className="mt-1 flex items-center gap-1 text-sm text-[#231F20BF]">
                        <Star
                          size={15}
                          className="fill-yellow-400 text-yellow-400"
                        />
                        <span className="font-semibold text-[#231F20]">
                          {provider.rating}
                        </span>
                        <span>({provider.reviews} reviews)</span>
                      </p>
                      <p className="mt-1 flex items-center gap-1 text-sm text-[#231F2080]">
                        <MapPin size={15} />
                        {providerArea}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-[1fr_1fr_auto] items-center gap-4">
                    <button
                      type="button"
                      className="flex h-10 items-center justify-center gap-3 rounded border border-gray-200 text-sm text-[#231F2080]"
                    >
                      <Phone size={18} />
                      Call
                    </button>
                    <button
                      type="button"
                      className="flex h-10 items-center justify-center gap-3 rounded border border-gray-200 text-sm text-[#231F2080]"
                    >
                      <MessageCircle size={18} />
                      Message
                    </button>
                    {canCancel && <button
                      type="button"
                      onClick={async () => {
                        setActionError("");
                        try {
                          await cancel(booking.id);
                          await refreshRequests();
                          close();
                        } catch (error) {
                          setActionError(
                            error?.response?.data?.message ||
                              "Booking could not be cancelled.",
                          );
                        }
                      }}
                      className="px-3 text-sm font-semibold text-red-500"
                    >
                      Cancel Request
                    </button>}
                  </div>

                  <div className="mt-5">
                    <p className="mb-2 text-sm text-[#231F2080]">Pickup note</p>
                    <p className="rounded-lg border border-gray-100 bg-[#F7FAFC] px-4 py-3 text-xs leading-relaxed text-[#231F2080]">
                      {pickupNote}
                    </p>
                  </div>

                  <div className="mt-5">
                    <p className="text-sm font-semibold text-[#231F20]">Service Fee</p>
                    <p className="mt-1 flex items-center gap-2 text-lg font-bold text-[#231F20]">
                      <span className="rounded-sm bg-[#8BC53F] px-1.5 py-0.5 text-xs text-white">
                        ₦
                      </span>
                      {formatMoney(booking.price)}
                    </p>
                  </div>
                </section>

                <section className="min-h-[520px] overflow-hidden rounded-xl bg-gray-100">
                  <DeliveryMap
                    pickup={routePoints.pickup}
                    dropoff={routePoints.dropoff}
                  />
                </section>
              </div>
            </main>
          </div>
        </div>
      )}
      {view === "details" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4 py-4">
          <div className="relative flex max-h-[92vh] w-full max-w-[670px] flex-col overflow-hidden rounded-xl bg-white shadow-xl">
            <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-5 py-4">
              <h2 className="text-lg font-semibold text-[#231F20]">
                Service Details
              </h2>
              <button
                type="button"
                onClick={close}
                aria-label="Close service details"
                className="text-[#231F20BF] hover:text-[#231F20]"
              >
                <X size={24} />
              </button>
            </div>

            <div className="overflow-y-auto px-5 py-4">
              <div className="flex items-center gap-5">
                <img
                  src={provider.profilePicture}
                  alt={provider.fullName}
                  className="h-20 w-20 rounded-full object-cover"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-[#231F20]">
                      {provider.fullName}
                    </h3>
                    <BadgeCheck size={18} className="text-[#2F7B4F]" />
                  </div>
                  <p className="mt-1 flex items-center gap-1 text-sm text-[#231F20BF]">
                    <Star
                      size={16}
                      className="fill-yellow-400 text-yellow-400"
                    />
                    <span className="font-semibold text-[#231F20]">
                      {provider.rating}
                    </span>
                    <span>({provider.reviews} reviews)</span>
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-sm text-[#231F2080]">
                    <MapPin size={16} />
                    {providerArea}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-[1fr_1fr_auto] items-center gap-5">
                <button
                  type="button"
                  className="flex h-10 items-center justify-center gap-3 rounded border border-gray-200 text-[#231F2080]"
                >
                  <Phone size={20} />
                  Call
                </button>
                <button
                  type="button"
                  className="flex h-11 items-center justify-center gap-3 rounded border border-gray-200 text-[#231F2080]"
                >
                  <MessageCircle size={20} />
                  Message
                </button>
                {canCancel && <button
                  type="button"
                  onClick={async () => {
                    setActionError("");
                    try {
                      await cancel(booking.id);
                      await refreshRequests();
                      close();
                    } catch (error) {
                      setActionError(
                        error?.response?.data?.message ||
                          "Booking could not be cancelled.",
                      );
                    }
                  }}
                  className="px-3 font-semibold text-red-500"
                >
                  Cancel Request
                </button>}
              </div>

              <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                <div>
                  <h3 className="mb-4 text-base font-semibold text-[#231F20]">
                    Booking Information
                  </h3>
                  <dl className="space-y-3.5">
                    <div className="flex gap-4">
                      <Wrench size={22} className="mt-1 text-[#2F7B4F]" />
                      <div>
                        <dt className="text-sm font-semibold text-[#231F20]">
                          Service
                        </dt>
                        <dd className="mt-1 text-sm text-[#231F20BF]">
                          {booking.service}
                        </dd>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <MapPinHouse size={22} className="mt-1 text-[#2F7B4F]" />
                      <div>
                        <dt className="text-sm font-semibold text-[#231F20]">
                          Service Location
                        </dt>
                        <dd className="mt-1 text-sm text-[#231F20BF]">
                          {booking.label}
                        </dd>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <CalendarDays size={22} className="mt-1 text-[#2F7B4F]" />
                      <div>
                        <dt className="text-sm font-semibold text-[#231F20]">
                          Start Date &amp; Time
                        </dt>
                        <dd className="mt-1 text-sm text-[#231F20BF]">
                          {serviceDate}
                        </dd>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <Clock size={22} className="mt-1 text-[#2F7B4F]" />
                      <div>
                        <dt className="text-sm font-semibold text-[#231F20]">
                          Duration
                        </dt>
                        <dd className="mt-1 text-sm text-[#231F20BF]">
                          {durationLabel}
                        </dd>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <MapPin size={22} className="mt-1 text-[#2F7B4F]" />
                      <div>
                        <dt className="text-sm font-semibold text-[#231F20]">
                          Location
                        </dt>
                        <dd className="mt-1 text-sm text-[#231F20BF]">
                          {dropoffAddress}
                        </dd>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <Banknote size={22} className="mt-1 text-[#2F7B4F]" />
                      <div>
                        <dt className="text-sm font-semibold text-[#231F20]">
                          Service Cost
                        </dt>
                        <dd className="mt-1 text-sm text-[#231F20BF]">
                          {formatMoney(booking.price)}
                        </dd>
                      </div>
                    </div>
                  </dl>
                  <dl className="hidden">
                    <div className="flex gap-4">
                      <Wrench size={22} className="mt-1 text-[#2F7B4F]" />
                      <div className="[&>dd:last-child]:hidden">
                        <dt className="font-semibold text-[#231F20]">
                          Service Type
                        </dt>
                        <dd className="mt-1 text-sm text-[#231F20BF]">
                          {booking.service}
                          {" · "}
                          {booking.label}
                        </dd>
                        <dd className="mt-1 text-sm text-[#231F20BF]">
                          {booking.service} · {booking.label}
                        </dd>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <CalendarDays size={22} className="mt-1 text-[#2F7B4F]" />
                      <div>
                        <dt className="font-semibold text-[#231F20]">
                          Start Date &amp; Time
                        </dt>
                        <dd className="mt-1 text-sm text-[#231F20BF]">
                          {serviceDate}
                        </dd>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <Clock size={22} className="mt-1 text-[#2F7B4F]" />
                      <div>
                        <dt className="font-semibold text-[#231F20]">
                          Duration
                        </dt>
                        <dd className="mt-1 text-sm text-[#231F20BF]">
                          {durationLabel}
                        </dd>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <MapPin size={22} className="mt-1 text-[#2F7B4F]" />
                      <div>
                        <dt className="font-semibold text-[#231F20]">
                          Location
                        </dt>
                        <dd className="mt-1 text-sm text-[#231F20BF]">
                          {dropoffAddress}
                        </dd>
                      </div>
                    </div>
                    <div className="flex gap-4 [&>span]:hidden">
                      <Banknote size={22} className="mt-1 text-[#2F7B4F]" />
                      <span className="mt-1 text-2xl font-bold text-[#2F7B4F]">
                        ₦
                      </span>
                      <div>
                        <dt className="font-semibold text-[#231F20]">
                          Service Cost
                        </dt>
                        <dd className="mt-1 text-sm text-[#231F20BF]">
                          {formatMoney(booking.price)}
                        </dd>
                      </div>
                    </div>
                  </dl>
                </div>

                <div className="shrink-0 text-left sm:text-right">
                  <p className="text-sm text-[#231F2080]">
                    Service Starts In:
                  </p>
                <p className="mt-2 text-4xl font-bold tabular-nums text-[#2F7B4F]">
                    {countdownText}
                  </p>
                </div>
              </div>

              <div className="mt-5">
                <p className="mb-2 text-xs text-[#231F2080]">Additional note</p>
                <p className="min-h-[54px] rounded-lg border border-gray-100 bg-[#F7FAFC] px-4 py-3 text-xs leading-relaxed text-[#231F2080]">
                  {pickupNote}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      <BeautyCompletionReviewModal
        isOpen={view === "review"}
        booking={{ ...booking, jobCompletedImages: latestCompletionPhotos?.length ? latestCompletionPhotos : booking.jobCompletedImages }}
        loading={completionPhotosLoading}
        error={completionPhotosError}
        onClose={close}
        onConfirm={() => setScreen("rate")}
      />
      <ReviewModal
        isOpen={view === "rate"}
        onClose={close}
        providerName={provider.fullName}
        walletBalance={60000}
        onSubmit={async (review) => {
          setActionError("");
          try {
            await complete(booking.id, review);
            await refreshRequests();
            setScreen("thanks");
          } catch (error) {
            setActionError(
              error?.response?.data?.message ||
                "Review could not be submitted.",
            );
          }
        }}
      />
      {view === "thanks" && (
        <Modal
          isOpen
          onClose={close}
          showCloseButton={false}
          overlayClassName="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4"
          panelClassName="relative w-full max-w-[520px] rounded-2xl bg-white px-6 py-10 shadow-xl sm:px-10"
          contentClassName="text-[#231F20]"
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close thank you modal"
            className="absolute right-6 top-5 text-2xl leading-none text-[#231F20BF] hover:text-[#231F20]"
          >
            <X size={20} />
          </button>
          <div className="flex flex-col items-center text-center">
            <span className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#2F7B4F] text-white">
              <Check size={42} strokeWidth={4} />
            </span>
            <h2 className="text-2xl font-bold text-[#231F20]">Thank you!</h2>
            <p className="mt-3 text-base text-[#231F20A6]">
              Your service with {provider.fullName} is now complete.
            </p>
            <p className="mt-8 text-sm italic text-[#231F2080]">
              Help a friend get started
            </p>
            <button
              type="button"
              onClick={() => {
                setCopied(false);
                setScreen("share");
              }}
              className="mt-1 inline-flex items-center gap-2 text-sm font-medium text-[#2F7B4F] hover:text-[#005823]"
            >
              Refer &amp; Earn
              <Navigation size={15} />
            </button>
          </div>
        </Modal>
      )}
      {view === "share" && (
        <Modal
          isOpen
          onClose={close}
          showCloseButton={false}
          overlayClassName="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4"
          panelClassName="relative w-full max-w-[520px] rounded-2xl bg-white px-6 py-7 shadow-xl sm:px-8"
          contentClassName="text-[#231F20]"
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close share modal"
            className="absolute right-6 top-5 text-2xl leading-none text-[#231F20BF] hover:text-[#231F20]"
          >
            <X size={20} />
          </button>
          <h2 className="text-2xl font-medium text-[#231F20]">Send via</h2>
          <div className="mt-10 flex items-center justify-center gap-9 sm:gap-14">
            <a
              href={`https://wa.me/?text=${shareText}`}
              target="_blank"
              rel="noreferrer"
              aria-label="Share on WhatsApp"
              className="flex h-14 w-14 items-center justify-center rounded-full bg-[#22D549] text-white transition-transform hover:scale-105"
            >
              <FaWhatsapp size={38} />
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodedProfileLink}`}
              target="_blank"
              rel="noreferrer"
              aria-label="Share on Facebook"
              className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1877F2] text-white transition-transform hover:scale-105"
            >
              <FaFacebookF size={36} />
            </a>
            <a
              href={`https://www.instagram.com/`}
              target="_blank"
              rel="noreferrer"
              aria-label="Open Instagram"
              className="flex h-14 w-14 items-center justify-center rounded-[16px] bg-gradient-to-tr from-[#FEDA75] via-[#D62976] to-[#4F5BD5] text-white transition-transform hover:scale-105"
            >
              <FaInstagram size={38} />
            </a>
            <a
              href={`https://t.me/share/url?url=${encodedProfileLink}&text=${shareText}`}
              target="_blank"
              rel="noreferrer"
              aria-label="Share on Telegram"
              className="flex h-14 w-14 items-center justify-center rounded-full bg-[#2AA7DF] text-white transition-transform hover:scale-105"
            >
              <FaTelegramPlane size={34} />
            </a>
          </div>
          <div className="my-5 text-center text-sm text-[#231F2080]">OR</div>
          <button
            type="button"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(profileLink);
                setCopied(true);
              } catch {
                setCopied(false);
              }
            }}
            className="mx-auto flex items-center gap-2 text-sm font-medium text-[#2F7B4F] hover:text-[#005823]"
          >
            {copied ? "Invite link copied" : "Copy Invite link"}
            <Copy size={16} />
          </button>
        </Modal>
      )}
    </>
  );
}
