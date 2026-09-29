import DeliveryMap from "../../../../components/dashboard/Map";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
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
  Wallet,
  Wrench,
  X,
} from "lucide-react";
import { FaFacebookF, FaInstagram, FaTelegramPlane, FaWhatsapp } from "react-icons/fa";
import distance from "/distance.png";
import { useBeautyBookingStore } from "../../../../stores/beautyBooking.store";
import { beautyProvider as provider } from "../../data/beautyProvider";
import Modal from "../../../../components/Modal";
import Button from "../../../../components/button";
import ReviewModal from "../../../../components/dashboard/ReviewModal";
import BeautyBookingFlow from "./BeautyBookingFlow";
import { formatMoney } from "./bookingFormat";

const statuses = { pending: "Pending", accepted: "Awaiting Payment", active: "In Progress", review: "Waiting Confirmation", completed: "Completed" };
export default function BeautyRequest({ filter = "all" }) {
  const { booking, cancel, complete } = useBeautyBookingStore();
  const [params, setParams] = useSearchParams();
  const [screen, setScreen] = useState(null);
  const [copied, setCopied] = useState(false);
  const close = () => { setScreen(null); if (params.has("beauty")) { const next = new URLSearchParams(params); next.delete("beauty"); setParams(next, { replace: true }); } };
  if (!booking) return null;
  const visible = filter === "all" || (filter === "pending" && ["pending", "accepted"].includes(booking.status)) || (filter === "active" && ["active", "review"].includes(booking.status)) || (filter === "completed" && booking.status === "completed");
  const requestedView = params.get("beauty");
  const view = screen || (["payment", "review", "track", "details"].includes(requestedView) ? requestedView : null);
  const profileLink = `${window.location.origin}${provider.profilePath}`;
  const shareText = encodeURIComponent(`Book ${provider.fullName} on SabiGUY: ${profileLink}`);
  const encodedProfileLink = encodeURIComponent(profileLink);
  const reviewScore = Math.max(0, Math.min(5, Math.round(Number(booking.review?.score || 0))));
  const reviewText = booking.review?.review || "Excellent work! Very professional and finished ahead of schedule.";
  const shouldShowReadMore = reviewText.length > 120;
  const pickupAddress = "15 Victoria Island, Lagos...";
  const pickupFullAddress = "15 Victoria Island, Lagos";
  const dropoffAddress = booking.address || "24 Palm Avenue, Lekki Phase 1, Lagos";
  const providerArea = provider.city || "Lekki Phase 1";
  const pickupNote = booking.note || "Lorem ipsum elementum scelerisque nullam quis non nibh.";
  const serviceDate = new Date(booking.date).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
  const routePoints = {
    pickup: { latitude: 6.4281, longitude: 3.4219 },
    dropoff: { latitude: 6.4478, longitude: 3.4723 },
  };
  return <>
    {visible && <article className="my-5 rounded-xl bg-white p-5 shadow-sm">
      <div className="flex gap-4">
        <img src={provider.profilePicture} alt={provider.fullName} className="h-12 w-12 rounded-full object-cover" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-lg font-semibold text-[#231F20]">{booking.service}</h3>
            <span className={`rounded-full border px-3 py-1 text-xs font-medium ${booking.status === "completed" ? "border-[#34805A] bg-[#34805A1A] text-[#34805A]" : booking.status === "active" ? "border-blue-200 bg-blue-50 text-blue-600" : "border-amber-200 bg-amber-50 text-amber-700"}`}>
              {statuses[booking.status]}
            </span>
          </div>
          <p className="mt-2 flex items-center gap-2 text-sm text-[#231F20BF]">
            <MapPinned size={16} className="text-[#34805A]" />
            {booking.label}
          </p>
          <p className="mt-3 flex items-center gap-2 text-sm text-[#231F20BF]">
            <MapPin size={18} className="text-[#34805A]" />
            {provider.city || "Lekki Phase 1, Lagos"}
          </p>
          <p className="mt-3 flex items-center gap-2 text-sm text-[#231F20BF]">
            <CalendarDays size={18} className="text-[#34805A]" />
            {new Date(booking.date).toLocaleString("en-NG", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })}
          </p>
          <p className="mt-3 flex items-center gap-2 text-sm text-[#231F20BF]">
            <img src={distance} alt="" className="h-[18px] w-[18px] object-contain" />
            Distance: 10.5 km
          </p>
        </div>
      </div>
      {booking.review && (
        <div className="mt-6 border-t border-gray-200 pt-5">
          <div className="flex items-center gap-3 text-amber-400">
            {Array.from({ length: reviewScore }, (_, index) => (
              <Star key={index} size={24} fill="currentColor" />
            ))}
            <span className="text-sm font-semibold text-[#231F20]">{reviewScore.toFixed(1)}</span>
          </div>
          <p className="mt-3 text-sm text-[#231F20BF]">
            {reviewText}
          </p>
          {shouldShowReadMore && (
            <button type="button" className="mt-2 text-sm text-[#231F20BF] hover:text-[#005823]">
              Read more
            </button>
          )}
        </div>
      )}
      {booking.status !== "completed" && <div className="mt-4 flex flex-wrap gap-3 border-t border-gray-100 pt-4">
        <Button type="button" onClick={() => setScreen("details")}>
          View Details
        </Button>
        {booking.status === "review" && (
          <Button type="button" onClick={() => setScreen("review")}>
            Review
          </Button>
        )}
        {["accepted", "active"].includes(booking.status) && (
          <Button type="button" variant="outline" onClick={() => setScreen("track")}>
            <span className="flex items-center justify-center gap-2">
              <Navigation size={18} />
              Track provider
            </span>
          </Button>
        )}
      </div>}
    </article>}
    {view === "payment" && <BeautyBookingFlow provider={provider} booking={booking} initialStage="payment" onClose={close} />}
    {view === "track" && (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-[#D8D8D8] px-4 py-8">
        <div className="mx-auto min-h-[720px] max-w-6xl bg-white shadow-sm">
          <header className="flex h-[72px] items-center justify-between border-b border-gray-100 px-8">
            <img src="/logo.jpg" alt="SabiGuy" className="h-8 w-auto object-contain" />
            <div className="flex items-center gap-8">
              <button type="button" aria-label="Notifications" className="relative text-[#231F20BF]">
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
                  <div className="relative space-y-7">
                    <span className="absolute left-[9px] top-5 h-11 border-l border-dashed border-[#00582333]" />
                    <div className="flex gap-4">
                      <span className="relative z-10 mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#E6EFE9]">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#005823]" />
                      </span>
                      <div>
                        <p className="text-xs text-[#231F2080]">From</p>
                        <p className="text-base text-[#231F20BF]">{pickupAddress}</p>
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
                </div>

                <div className="mt-5 flex items-center gap-5">
                  <img src={provider.profilePicture} alt={provider.fullName} className="h-[72px] w-[72px] rounded-full object-cover" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-[#231F20]">{provider.fullName}</h3>
                      <BadgeCheck size={15} className="text-[#2F7B4F]" />
                    </div>
                    <p className="mt-1 flex items-center gap-1 text-sm text-[#231F20BF]">
                      <Star size={15} className="fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-[#231F20]">{provider.rating}</span>
                      <span>({provider.reviews} reviews)</span>
                    </p>
                    <p className="mt-1 flex items-center gap-1 text-sm text-[#231F2080]">
                      <MapPin size={15} />
                      {providerArea}
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-[1fr_1fr_auto] items-center gap-4">
                  <button type="button" className="flex h-10 items-center justify-center gap-3 rounded border border-gray-200 text-sm text-[#231F2080]">
                    <Phone size={18} />
                    Call
                  </button>
                  <button type="button" className="flex h-10 items-center justify-center gap-3 rounded border border-gray-200 text-sm text-[#231F2080]">
                    <MessageCircle size={18} />
                    Message
                  </button>
                  <button type="button" onClick={() => { cancel(); close(); }} className="px-3 text-sm font-semibold text-red-500">
                    Cancel Request
                  </button>
                </div>

                <div className="mt-5">
                  <p className="mb-2 text-sm text-[#231F2080]">Pickup note</p>
                  <p className="rounded-lg border border-gray-100 bg-[#F7FAFC] px-4 py-3 text-xs leading-relaxed text-[#231F2080]">
                    {pickupNote}
                  </p>
                </div>

                <div className="mt-5">
                  <p className="text-sm font-semibold text-[#231F20]">Fare</p>
                  <p className="mt-1 flex items-center gap-2 text-lg font-bold text-[#231F20]">
                    <span className="rounded-sm bg-[#8BC53F] px-1.5 py-0.5 text-xs text-white">₦</span>
                    {formatMoney(booking.price)}
                  </p>
                </div>
              </section>

              <section className="min-h-[520px] overflow-hidden rounded-xl bg-gray-100">
                <DeliveryMap pickup={routePoints.pickup} dropoff={routePoints.dropoff} />
              </section>
            </div>
          </main>
        </div>
      </div>
    )}
    {view === "details" && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4 py-4">
        <div className="relative flex max-h-[92vh] w-full max-w-[670px] flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
          <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-6 py-5">
            <h2 className="text-2xl font-semibold text-[#231F20]">Service Details</h2>
            <button type="button" onClick={close} aria-label="Close service details" className="text-[#231F20BF] hover:text-[#231F20]">
              <X size={24} />
            </button>
          </div>

          <div className="overflow-y-auto px-6 py-5">
            <div className="flex items-center gap-5">
              <img src={provider.profilePicture} alt={provider.fullName} className="h-20 w-20 rounded-full object-cover" />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold text-[#231F20]">{provider.fullName}</h3>
                  <BadgeCheck size={18} className="text-[#2F7B4F]" />
                </div>
                <p className="mt-1 flex items-center gap-1 text-sm text-[#231F20BF]">
                  <Star size={16} className="fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold text-[#231F20]">{provider.rating}</span>
                  <span>({provider.reviews} reviews)</span>
                </p>
                <p className="mt-1 flex items-center gap-1 text-sm text-[#231F2080]">
                  <MapPin size={16} />
                  {providerArea}
                </p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-[1fr_1fr_auto] items-center gap-5">
              <button type="button" className="flex h-11 items-center justify-center gap-3 rounded border border-gray-200 text-[#231F2080]">
                <Phone size={20} />
                Call
              </button>
              <button type="button" className="flex h-11 items-center justify-center gap-3 rounded border border-gray-200 text-[#231F2080]">
                <MessageCircle size={20} />
                Message
              </button>
              <button type="button" onClick={() => { cancel(); close(); }} className="px-3 font-semibold text-red-500">
                Cancel Request
              </button>
            </div>

            <div className="mt-6 flex items-start justify-between gap-6">
              <div>
                <h3 className="mb-4 text-xl font-semibold text-[#231F20]">Booking Information</h3>
                <dl className="space-y-5">
                  <div className="flex gap-4">
                    <Wrench size={22} className="mt-1 text-[#2F7B4F]" />
                    <div>
                      <dt className="font-semibold text-[#231F20]">Service</dt>
                      <dd className="mt-1 text-sm text-[#231F20BF]">{booking.service}</dd>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <MapPinned size={22} className="mt-1 text-[#2F7B4F]" />
                    <div>
                      <dt className="font-semibold text-[#231F20]">Service Location</dt>
                      <dd className="mt-1 text-sm text-[#231F20BF]">{booking.label}</dd>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <CalendarDays size={22} className="mt-1 text-[#2F7B4F]" />
                    <div>
                      <dt className="font-semibold text-[#231F20]">Start Date &amp; Time</dt>
                      <dd className="mt-1 text-sm text-[#231F20BF]">{serviceDate}</dd>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Clock size={22} className="mt-1 text-[#2F7B4F]" />
                    <div>
                      <dt className="font-semibold text-[#231F20]">Duration</dt>
                      <dd className="mt-1 text-sm text-[#231F20BF]">{booking.duration} minutes</dd>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <MapPin size={22} className="mt-1 text-[#2F7B4F]" />
                    <div>
                      <dt className="font-semibold text-[#231F20]">Location</dt>
                      <dd className="mt-1 text-sm text-[#231F20BF]">{dropoffAddress}</dd>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Wallet size={22} className="mt-1 text-[#2F7B4F]" />
                    <div>
                      <dt className="font-semibold text-[#231F20]">Service Cost</dt>
                      <dd className="mt-1 text-sm text-[#231F20BF]">{formatMoney(booking.price)}</dd>
                    </div>
                  </div>
                </dl>
                <dl className="hidden">
                  <div className="flex gap-4">
                    <Wrench size={22} className="mt-1 text-[#2F7B4F]" />
                    <div className="[&>dd:last-child]:hidden">
                      <dt className="font-semibold text-[#231F20]">Service Type</dt>
                      <dd className="mt-1 text-sm text-[#231F20BF]">{booking.service}{" · "}{booking.label}</dd>
                      <dd className="mt-1 text-sm text-[#231F20BF]">{booking.service} · {booking.label}</dd>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <CalendarDays size={22} className="mt-1 text-[#2F7B4F]" />
                    <div>
                      <dt className="font-semibold text-[#231F20]">Start Date &amp; Time</dt>
                      <dd className="mt-1 text-sm text-[#231F20BF]">{serviceDate}</dd>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Clock size={22} className="mt-1 text-[#2F7B4F]" />
                    <div>
                      <dt className="font-semibold text-[#231F20]">Duration</dt>
                      <dd className="mt-1 text-sm text-[#231F20BF]">{booking.duration} minutes</dd>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <MapPin size={22} className="mt-1 text-[#2F7B4F]" />
                    <div>
                      <dt className="font-semibold text-[#231F20]">Location</dt>
                      <dd className="mt-1 text-sm text-[#231F20BF]">{dropoffAddress}</dd>
                    </div>
                  </div>
                  <div className="flex gap-4 [&>span]:hidden">
                    <Wallet size={22} className="mt-1 text-[#2F7B4F]" />
                    <span className="mt-1 text-2xl font-bold text-[#2F7B4F]">₦</span>
                    <div>
                      <dt className="font-semibold text-[#231F20]">Service Cost</dt>
                      <dd className="mt-1 text-sm text-[#231F20BF]">{formatMoney(booking.price)}</dd>
                    </div>
                  </div>
                </dl>
              </div>

              <div className="shrink-0 text-right">
                <p className="text-base text-[#231F2080]">Service Starts In:</p>
                <p className="mt-3 text-4xl font-bold tabular-nums text-[#2F7B4F]">01:57:48</p>
              </div>
            </div>

            <div className="mt-5">
              <p className="mb-2 text-sm text-[#231F2080]">Additional note</p>
              <p className="rounded-lg border border-gray-100 bg-[#F7FAFC] px-4 py-3 text-xs leading-relaxed text-[#231F2080]">
                {pickupNote}
              </p>
            </div>
          </div>
        </div>
      </div>
    )}
    {view === "review" && <Modal isOpen onClose={close} title="Review"><p className="mb-5 text-sm text-gray-500">Here’s what your service provider submitted for this task</p><h3 className="mb-3 font-semibold">Work Photos</h3><div className="grid grid-cols-2 gap-3">{provider.gallery.map((image) => <img key={image} src={image} alt="Completed hairstyle" className="h-40 w-full rounded-lg object-cover" />)}</div><p className="mb-2 mt-5 text-sm font-medium">Provider’s note</p><p className="mb-5 rounded-lg bg-gray-50 p-4 text-sm text-gray-500">Your {booking.service.toLowerCase()} service has been completed successfully.</p><Button onClick={() => setScreen("confirm")}>Mark as Completed</Button></Modal>}
    {view === "confirm" && <Modal isOpen onClose={close} title="Complete Service?"><p className="my-6 text-center">Are you sure you want to mark this service as completed?</p><div className="flex justify-center gap-3"><Button variant="outline" onClick={() => setScreen("review")}>Cancel</Button><Button onClick={() => setScreen("rate")}>Confirm</Button></div></Modal>}
    <ReviewModal isOpen={view === "rate"} onClose={close} providerName={provider.fullName} walletBalance={60000} onSubmit={(review) => { complete(review); setScreen("thanks"); }} />
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
  </>;
}
