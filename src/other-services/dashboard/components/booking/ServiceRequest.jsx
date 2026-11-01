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
  Home,
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
import ServiceBookingFlow from "./ServiceBookingFlow";
import { formatMoney } from "../../utils/bookingFormat";
import { getBookingsDetails } from "../../../../api/bookings";
import UserBeautyViewDetailsModal from "../UserBeautyViewDetailsModal";
import BeautyTrackScreen from "../BeautyTrackScreen";
import BeautyThankYouModal from "../BeautyThankYouModal";
import BeautyShareModal from "../BeautyShareModal";

const statuses = {
  pending: "Pending",
  accepted: "Awaiting Payment",
  active: "In Progress",
  review: "Waiting Confirmation",
  completed: "Completed",
  expired: "Expired",
  cancelled: "Cancelled",
};
export default function ServiceRequest({
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
    if (filter === "pending")
      return ["pending", "accepted"].includes(booking.status);
    if (filter === "active")
      return ["active", "review"].includes(booking.status);
    if (filter === "completed") return booking.status === "completed";
    return true;
  });

  if (!sourceBookings && isLoading && bookingsToDisplay.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-gray-500">
        Loading your bookings...
      </div>
    );
  }
  if (!sourceBookings && displayError && bookingsToDisplay.length === 0) {
    return (
      <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {displayError}
      </div>
    );
  }

  return (
    <div className="mb-4 space-y-3">
      {visibleBookings.map((booking) => (
        <ServiceBookingCard
          key={booking.id}
          booking={booking}
          onRefresh={onRefresh}
        />
      ))}
    </div>
  );
}

export function ServiceBookingCard({ booking, onRefresh }) {
  const { cancel, complete, error } = useBeautyBookingStore();
  const [params, setParams] = useSearchParams();
  const [screen, setScreen] = useState(null);
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
    city:
      bookingProvider.city || bookingProvider.currentLocation?.address || "",
    rating:
      typeof bookingProvider.rating === "number"
        ? bookingProvider.rating
        : (bookingProvider.rating?.average ?? 0),
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
        const detail =
          response?.data?.booking ||
          response?.data?.data?.booking ||
          response?.data?.data ||
          response?.data ||
          response?.booking ||
          response;
        setLatestCompletionPhotos(detail?.jobCompletedImages || []);
        setCompletionPhotosError("");
      })
      .catch((err) => {
        if (active)
          setCompletionPhotosError(
            err.response?.data?.message || "Unable to load work photos.",
          );
      })
      .finally(() => {
        if (active) setCompletionPhotosLoading(false);
      });
    setCompletionPhotosLoading(true);
    return () => {
      active = false;
    };
  }, [view, booking.id]);
  
  const reviewText = booking.review?.review || "";
  const shouldShowReadMore = reviewText.length > 120;
  const displayedReviewText =
    isReviewExpanded || !shouldShowReadMore
      ? reviewText
      : `${reviewText.slice(0, 120).trim()}...`;
  const dropoffAddress = booking.address || "";
  const providerAddress =
    bookingProvider.currentLocation?.address?.trim() || "";
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
  const canCancel = ["pending", "accepted", "", "expired"].includes(
    booking.status,
  );
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
      ? {
          latitude: booking.raw.providerId.currentLocation.coordinates[1],
          longitude: booking.raw.providerId.currentLocation.coordinates[0],
        }
      : null,
    dropoff: booking.raw?.location?.coordinates?.coordinates
      ? {
          latitude: booking.raw.location.coordinates.coordinates[1],
          longitude: booking.raw.location.coordinates.coordinates[0],
        }
      : null,
  };

const reviewScore = Math.max(
    0,
    Math.min(5, Math.round(Number(booking.review?.score || 0))),
  );
  // const reviewText = booking.review?.review || "";

  return (
    <>
      <article className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5">
        {(error || actionError) && (
          <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
            {actionError || error}
          </p>
        )}
        <div className="flex items-start gap-3">
          <img
            src={booking.providerImage || "/avatar.png"}
            alt={booking.providerName || provider.fullName}
            className="h-10 w-10 shrink-0 rounded-full object-cover"
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-semibold leading-5 text-[#231F20]">
                {booking.service}
              </h3>
              <span
                className={`rounded-full border px-2 py-0.5 text-xs font-medium ${booking.status === "completed" ? "border-[#34805A] bg-[#34805A1A] text-[#34805A]" : booking.status === "active" ? "border-blue-200 bg-blue-50 text-blue-600" : ["expired", "cancelled"].includes(booking.status) ? "border-gray-200 bg-gray-50 text-gray-500" : "border-amber-200 bg-amber-50 text-amber-700"}`}
              >
                {statuses[booking.status] ||
                  booking.apiStatus ||
                  booking.status}
              </span>
            </div>
            <p className="mt-1 inline-flex items-center gap-1 rounded-sm bg-[#EAF3FF] px-1.5 py-1 text-[11px] text-[#1674E8]">
              <Home size={16} />
              {booking.label}
            </p>
            {booking.address && (
              <p className="mt-1 flex items-center gap-1.5 text-xs text-[#231F20BF] sm:text-sm">
                <MapPin size={16} className="text-[#34805A]" />
                {booking.address}
              </p>
            )}
            {booking.date && (
              <p className="mt-1 flex items-center gap-1.5 text-xs text-[#231F20BF] sm:text-sm">
                <CalendarDays size={16} className="text-[#34805A]" />
                {new Date(booking.date).toLocaleString("en-NG", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </p>
            )}
            {booking.distance?.value != null && (
              <p className="mt-1 flex items-center gap-1.5 text-xs text-[#231F20BF] sm:text-sm">
                <img src={distance} alt="" className="h-4 w-4 object-contain" />
                Distance: {booking.distance.value}{" "}
                {booking.distance.unit || "km"}
              </p>
            )}
          </div>
          <p className="shrink-0 text-base font-bold text-[#005823] sm:text-lg">
            {formatMoney(booking.price)}
          </p>
        </div>
        <div className="mt-3 border-t border-gray-200 pt-2.5">
          {booking.review &&
            (booking.review.review || booking.review.score) && (
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

          <div className="mt-3 flex flex-wrap gap-3 pt-2.5">
            <Button
              size="sm"
              type="button"
              className="inline-flex min-h-10 items-center justify-center rounded-[4px] bg-[#347D53] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#286642]"
              onClick={() => setScreen("details")}
            >
              View Details
            </Button>
            {booking.status === "review" && (
              <Button
                size="sm"
                type="button"
                className="inline-flex min-h-10 items-center justify-center rounded-[4px] bg-[#347D53] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#286642]"
                onClick={() => setScreen("review")}
              >
                Review
              </Button>
            )}
            {booking.status === "accepted" && (
              <Button
                size="sm"
                type="button"
                className="inline-flex min-h-10 items-center justify-center rounded-[4px] bg-[#347D53] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#286642]"
                onClick={() => setScreen("payment")}
              >
                <span className="flex items-center justify-center gap-2">
                  <Wallet size={16} />
                  Make Payment
                </span>
              </Button>
            )}
            {["accepted", "active"].includes(booking.status) && (
              <Button
                size="sm"
                type="button"
                variant="outline"
                className="inline-flex min-h-10 items-center justify-center rounded-[4px] border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                onClick={() => setScreen("track")}
              >
                <span className="flex items-center justify-center gap-2">
                  <Navigation size={16} />
                  Track provider
                </span>
              </Button>
            )}
          </div>
        </div>
      </article>
      {view === "payment" && (
        <ServiceBookingFlow
          provider={provider}
          booking={booking}
          initialStage="payment"
          onClose={close}
        />
      )}
      {view === "track" && (
        <BeautyTrackScreen
          booking={booking}
          provider={provider}
          providerArea={providerArea}
          providerAddress={providerAddress}
          dropoffAddress={dropoffAddress}
          serviceLocationAddress={serviceLocationAddress}
          showRoute={showRoute}
          routePoints={routePoints}
          pickupNote={pickupNote}
          canCancel={canCancel}
          cancel={cancel}
          refreshRequests={refreshRequests}
          onBack={() => setScreen(null)}
          close={close}
        />
      )}

      {view === "details" && (
        <UserBeautyViewDetailsModal
          provider={provider}
          providerArea={providerArea}
          booking={booking}
          serviceDate={serviceDate}
          durationLabel={durationLabel}
          dropoffAddress={dropoffAddress}
          countdownText={countdownText}
          pickupNote={pickupNote}
          canCancel={canCancel}
          cancel={cancel}
          close={close}
          refreshRequests={refreshRequests}
          setActionError={setActionError}
        />
      )}

      <BeautyCompletionReviewModal
        isOpen={view === "review"}
        booking={{
          ...booking,
          jobCompletedImages: latestCompletionPhotos?.length
            ? latestCompletionPhotos
            : booking.jobCompletedImages,
        }}
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
        <BeautyThankYouModal
          providerName={provider.fullName}
          onClose={close}
          onRefer={() => setScreen("share")}
        />
      )}
      {view === "share" && (
        <BeautyShareModal provider={provider} onClose={close} />
      )}
    </>
  );
}
