import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BadgeCheck,
  Bell,
  MapPin,
  MessageCircle,
  Phone,
  Star,
} from "lucide-react";
import DeliveryMap from "../../../components/dashboard/Map";
import CancelBookingButton from "../../../components/CancelBookingButton";
import { useCallContext } from "../../../components/shared/CallContext";
import { formatMoney } from "../utils/bookingFormat";

export default function BeautyTrackScreen({
  booking,
  provider,
  providerArea,
  providerAddress,
  dropoffAddress,
  serviceLocationAddress,
  showRoute,
  routePoints,
  pickupNote,
  canCancel,
  cancel,
  refreshRequests,
  onBack,
  close,
}) {
  const navigate = useNavigate();
  const callContext = useCallContext();
  const bookingId = booking?.raw?._id || booking?.id || booking?._id;
  const providerId =
    provider?._id ||
    provider?.backendId ||
    provider?.id ||
    booking?.provider?._id ||
    booking?.raw?.providerId?._id ||
    booking?.raw?.providerId;

  const handleCallProvider = () => {
    if (!bookingId || !providerId) return;

    callContext?.openCall?.({
      booking: booking.raw || booking,
      targetOverride: {
        targetId: providerId,
        targetType: "provider",
        targetName: provider?.fullName || "Provider",
      },
    });
  };

  const handleMessageProvider = () => {
    if (!bookingId) return;

    navigate(`/dashboard/chat?bookingId=${bookingId}`, {
      state: { booking: booking.raw || booking, provider },
    });
  };

  return (
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
              <Bell size={20} />
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
            onClick={onBack}
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
                        <p className="text-base text-[#231F20BF]">
                          {providerAddress}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <span className="relative z-10 mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#E6EFE9] text-[#005823]">
                        <MapPin size={14} fill="currentColor" />
                      </span>
                      <div>
                        <p className="text-xs text-[#231F2080]">To</p>
                        <p className="text-base text-[#231F20BF]">
                          {dropoffAddress}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-4">
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#E6EFE9] text-[#005823]">
                      <MapPin size={14} fill="currentColor" />
                    </span>
                    <div>
                      <p className="text-xs text-[#231F2080]">
                        Service location
                      </p>
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
                  onClick={handleCallProvider}
                  disabled={!bookingId || !providerId}
                  className="flex h-10 items-center justify-center gap-3 rounded border border-gray-200 text-sm text-[#231F2080] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Phone size={18} /> Call
                </button>
                <button
                  type="button"
                  onClick={handleMessageProvider}
                  disabled={!bookingId}
                  className="flex h-10 items-center justify-center gap-3 rounded border border-gray-200 text-sm text-[#231F2080] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <MessageCircle size={18} />
                  Message
                </button>
                {canCancel && (
                  <CancelBookingButton
                    bookingId={booking.id}
                    status={booking.status}
                    cancelRequest={(id) => cancel(id)}
                    role="user"
                    onSuccess={async () => {
                      await refreshRequests();
                      close();
                    }}
                    className="px-3 text-sm font-semibold text-red-500"
                  />
                )}
              </div>

              <div className="mt-5">
                <p className="mb-2 text-sm text-[#231F2080]">Pickup note</p>
                <p className="rounded-lg border border-gray-100 bg-[#F7FAFC] px-4 py-3 text-xs leading-relaxed text-[#231F2080]">
                  {pickupNote}
                </p>
              </div>

              <div className="mt-5">
                <p className="text-sm font-semibold text-[#231F20]">
                  Service Fee
                </p>
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
  );
}
