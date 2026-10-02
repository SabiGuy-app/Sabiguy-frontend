import { useNavigate } from "react-router-dom";
import { useBeautyBookingStore } from "../../../../stores/beautyBooking.store";
import { useEffect, useState } from "react";
import {
  BadgeCheck,
  CalendarDays,
  Check,
  Clock,
  Globe,
  MapPin,
  MapPinned,
  MessageCircle,
  Phone,
  Star,
  Wallet,
  Wrench,
} from "lucide-react";
import Modal from "../../../../components/Modal";
import Button from "../../../../components/button";
import InputField from "../../../../components/InputField";
import { formatMoney } from "../../utils/bookingFormat";

const countdown = (seconds) =>
  [Math.floor(seconds / 3600), Math.floor(seconds / 60) % 60, seconds % 60]
    .map((part) => String(part).padStart(2, "0"))
    .join(":");
const localDateTime = (date) =>
  new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);

function ProviderSummary({ provider }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-5">
      <div className="flex items-center gap-3">
        <img
          src={provider.profilePicture}
          alt={provider.fullName}
          className="h-16 w-16 rounded-full object-cover"
        />
        <div>
          <h3 className="flex items-center gap-2 font-semibold">
            {provider.fullName}
            <BadgeCheck size={15} className="text-[#005823]" />
          </h3>
          <p className="mt-1 flex items-center text-sm text-gray-500">
            <Star size={15} className="fill-amber-400 text-amber-400" />
            {provider.rating} ({provider.reviews} reviews)
          </p>
          <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
            <MapPin size={14} />
            Lekki Phase 1
          </p>
        </div>
      </div>
      <div className="flex divide-x divide-gray-200 text-center text-xs">
        {[
          ["2 - 5 yrs", "Experience"],
          ["25", "Jobs Done"],
          ["< 10 Mins", "Response Time"],
        ].map(([value, label]) => (
          <div key={label} className="px-3">
            <strong>{value}</strong>
            <p className="mt-1 text-gray-400">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function BookingInformation({ booking, date, address }) {
  const rows = [
    { label: "Service", value: booking.service, icon: Wrench },
    { label: "Service Location", value: booking.label, icon: MapPinned },
    {
      label: "Start Date & Time",
      value: date
        ? new Date(date).toLocaleString("en-NG", {
            dateStyle: "medium",
            timeStyle: "short",
          })
        : "Choose a date and time",
      icon: CalendarDays,
    },
    { label: "Duration", value: `${booking.duration} minutes`, icon: Clock },
    { label: "Location", value: address || "Enter your address", icon: MapPin },
    { label: "Service Cost", value: formatMoney(booking.price), icon: Wallet },
  ];
  return (
    <dl className="space-y-5">
      {rows.map((row) => (
        <div key={row.label} className="flex gap-3">
          <row.icon size={20} className="mt-0.5 shrink-0 text-[#34805A]" />
          <div>
            <dt className="text-sm font-medium">{row.label}</dt>
            <dd className="mt-1 text-sm text-gray-500">{row.value}</dd>
          </div>
        </div>
      ))}
    </dl>
  );
}

export default function BeautyBookingFlow({
  provider,
  booking,
  onClose,
  initialStage = "details",
}) {
  const navigate = useNavigate();
  const store = useBeautyBookingStore();
  const [stage, setStage] = useState(initialStage);
  const [date, setDate] = useState(
    () =>
      booking.date ||
      (booking.mode === "now"
        ? localDateTime(new Date(Date.now() + 3600000))
        : ""),
  );
  const [address, setAddress] = useState(
    booking.address ||
      (booking.id === "home" ? "" : "24 Palm Avenue, Lekki Phase 1, Lagos"),
  );
  const [note, setNote] = useState(booking.note || "");
  const [method, setMethod] = useState("wallet");
  const [expiresAt, setExpiresAt] = useState(
    initialStage === "payment" ? Date.now() + 300000 : null,
  );
  const [now, setNow] = useState(Date.now);
  const [message, setMessage] = useState("");
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  const startsIn = date
    ? Math.max(0, Math.ceil((new Date(date).getTime() - now) / 1000))
    : 0;
  const remaining = expiresAt
    ? Math.max(0, Math.ceil((expiresAt - now) / 1000))
    : 300;
  const total = booking.price + 100;
  const canContinue = Boolean(
    address.trim() && date && new Date(date).getTime() > now,
  );
  const openPayment = () => {
    setExpiresAt(Date.now() + 300000);
    setNow(Date.now());
    setStage("payment");
  };

  if (stage === "details")
    return (
      <Modal
        isOpen
        onClose={onClose}
        title="Service Details"
        titleClassName="mb-6 border-b border-gray-200 pb-5 pr-6 text-xl font-semibold text-left"
        panelClassName="relative max-h-[92vh] w-[94%] max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl sm:p-8"
      >
        <ProviderSummary provider={provider} />
        <div className="mb-6 mt-8 flex flex-wrap items-start justify-between gap-4">
          <h2 className="text-lg font-semibold">Booking Information</h2>
          <div className="text-right">
            <p className="text-sm text-gray-500">Service Starts In:</p>
            <p className="text-3xl font-semibold tabular-nums text-[#34805A]">
              {countdown(startsIn)}
            </p>
          </div>
        </div>
        <BookingInformation booking={booking} date={date} address={address} />
        {booking.mode === "later" && (
          <div className="mt-5">
            <InputField
              name="beauty-booking-date"
              type="datetime-local"
              label="Choose date & time"
              value={date}
              min={localDateTime(new Date(now))}
              onChange={(event) => setDate(event.target.value)}
            />
          </div>
        )}
        {booking.id === "home" && (
          <div className="mt-5">
            <InputField
              name="beauty-booking-address"
              label="Your address"
              placeholder="Enter the full service address"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
            />
          </div>
        )}
        <label className="mt-6 block text-sm text-gray-500">
          Additional note (optional)
          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            className="mt-2 min-h-20 w-full rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm"
            placeholder="Anything the provider should know?"
          />
        </label>
        <div className="mt-6 grid">
          <Button
            disabled={!canContinue}
            onClick={() => {
              if (canContinue) {
                store.submit({ ...booking, date, address, note });
                setStage("received");
              }
            }}
          >
            Continue
          </Button>
        </div>
      </Modal>
    );

  if (stage === "received")
    return (
      <Modal
        isOpen
        onClose={onClose}
        panelClassName="relative w-[94%] max-w-2xl rounded-2xl bg-white px-6 py-16 shadow-xl"
      >
        <div className="text-center">
          <img
            src="/favicon.png"
            alt="SabiGuy"
            className="mx-auto mb-8 h-20 w-20 object-contain"
          />
          <h2 className="text-2xl font-bold">Request Received</h2>
          <p className="mx-auto mt-4 max-w-sm text-gray-500">
            This provider is reviewing your booking.
            <br />
            You’ll be notified shortly.
          </p>
        </div>
      </Modal>
    );

  return (
    <Modal
      isOpen
      onClose={onClose}
      showCloseButton={stage !== "success"}
      panelClassName="relative max-h-[94vh] w-[96%] max-w-6xl overflow-y-auto rounded-2xl bg-white p-5 shadow-xl sm:p-8"
    >
      {stage === "success" ? (
        <div className="mx-auto max-w-lg py-10 text-center">
          <span className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-[#34805A] text-white">
            <Check size={54} strokeWidth={4} />
          </span>
          <h2 className="text-2xl font-bold">Payment Successful!</h2>
          <p className="mb-5 mt-5 text-gray-500">
            Your booking with {provider.fullName} has been confirmed.
          </p>
          <div className="grid">
            <Button
              onClick={() => {
                onClose();
                navigate("/bookings?tab=requests");
              }}
            >
              Continue
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="grid gap-8 lg:grid-cols-2">
            <section>
              <div className="rounded-2xl border border-gray-200 p-5">
                <ProviderSummary provider={provider} />
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <button
                    disabled
                    className="flex items-center gap-2 rounded-lg border border-gray-200 px-5 py-2 text-sm text-gray-400"
                  >
                    <Phone size={16} />
                    Call
                  </button>
                  <button
                    disabled
                    className="flex items-center gap-2 rounded-lg border border-gray-200 px-5 py-2 text-sm text-gray-400"
                  >
                    <MessageCircle size={16} />
                    Message
                  </button>
                  <button
                    onClick={() => {
                      store.cancel();
                      onClose();
                    }}
                    className="ml-auto text-sm text-red-600"
                  >
                    Cancel Request
                  </button>
                </div>
              </div>
              <h2 className="mb-5 mt-8 text-lg font-semibold">
                Booking Details
              </h2>
              <BookingInformation
                booking={booking}
                date={date}
                address={address}
              />
            </section>
            <section className="rounded-2xl border border-gray-200 p-5">
              <div
                role="status"
                className="mb-6 rounded-lg border border-amber-100 bg-amber-50 p-3 text-xs text-gray-600"
              >
                {remaining
                  ? "Complete your payment before the countdown expires"
                  : "This payment session has expired."}
                <strong className="mt-1 block text-sm tabular-nums">
                  {countdown(remaining)}
                </strong>
              </div>
              <h2 className="mb-4 font-semibold">Cost</h2>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt>Service Cost</dt>
                  <dd>{formatMoney(booking.price)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Service Charge</dt>
                  <dd>{formatMoney(100)}</dd>
                </div>
                <div className="flex justify-between font-semibold text-[#005823]">
                  <dt>Total Amount</dt>
                  <dd>{formatMoney(total)}</dd>
                </div>
              </dl>
              <fieldset className="mt-6 space-y-3 border-t border-gray-200 pt-5">
                <legend className="sr-only">Payment Method</legend>
                <h2 className="font-semibold">Payment Method</h2>
                {[
                  { id: "wallet", label: "Wallet", icon: Wallet },
                  { id: "online", label: "Pay Online", icon: Globe },
                ].map((item) => (
                  <label
                    key={item.id}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 ${method === item.id ? "border-[#34805A] bg-gray-50" : "border-gray-200"}`}
                  >
                    <input
                      type="radio"
                      name="beauty-payment-method"
                      checked={method === item.id}
                      onChange={() => setMethod(item.id)}
                      className="accent-[#005823]"
                    />
                    <item.icon size={22} className="text-gray-500" />
                    <span className="text-sm">
                      {item.label}
                      {item.id === "wallet" && (
                        <small className="block text-gray-500">
                          Balance: {formatMoney(60000)}
                        </small>
                      )}
                    </span>
                  </label>
                ))}
              </fieldset>
              <button
                onClick={() =>
                  setMessage(
                    "Adding payment methods will be available when payments are connected.",
                  )
                }
                className="mt-3 w-full rounded border border-gray-100 bg-gray-50 py-2 text-xs"
              >
                + Add Payment Method
              </button>
              {message && (
                <p role="status" className="mt-2 text-xs text-gray-500">
                  {message}
                </p>
              )}
              <label className="mt-6 block text-sm">
                Additional notes (optional)
                <textarea
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  className="mt-2 min-h-20 w-full rounded-lg border border-gray-200 bg-gray-50 p-3"
                  placeholder="Please arrive 5 minutes early. Call upon arrival."
                />
              </label>
              <div className="mt-5 grid">
                <Button
                  disabled={
                    !remaining || (method === "wallet" && total > 60000)
                  }
                  onClick={() => {
                    if (remaining > 0) {
                      store.pay();
                      setStage("success");
                    }
                  }}
                >
                  Confirm &amp; Pay {formatMoney(total)}
                </Button>
              </div>
              {!remaining && (
                <button
                  onClick={openPayment}
                  className="mt-3 w-full text-sm text-[#005823] underline"
                >
                  Restart payment
                </button>
              )}
            </section>
          </div>
          <p className="mt-7 text-right text-xs italic text-gray-400">
            Provider will only proceed with your booking once payment is
            confirmed.
          </p>
        </>
      )}
    </Modal>
  );
}
