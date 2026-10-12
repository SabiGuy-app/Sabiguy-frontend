import { useNavigate } from "react-router-dom";
import { useBeautyBookingStore } from "../../../../stores/beautyBooking.store";
import { useEffect, useState } from "react";
import { initializePayment, payWithWallet } from "../../../../api/payment";
import { getWalletBalance } from "../../../../api/provider";
import {
  BadgeCheck,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Globe,
  MapPin,
  MapPinned,
  MessageCircle,
  Phone,
  Star,
  Wallet,
  Wrench,
  X,
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

const formatBookingDate = (value) => value?.slice(0, 10);

const formatBookingTime = (value) => {
  const rawTime = value?.slice(11, 16);
  if (!rawTime) return "";

  const [hourValue, minute] = rawTime.split(":");
  const hour = Number(hourValue);
  const period = hour >= 12 ? "PM" : "AM";
  const twelveHour = hour % 12 || 12;

  return `${twelveHour}:${minute} ${period}`;
};

const parseTimeToDate = (day, timeLabel) => {
  const [time, period] = timeLabel.split(" ");
  const [hourValue, minuteValue] = time.split(":");
  let hour = Number(hourValue);

  if (period === "PM" && hour !== 12) hour += 12;
  if (period === "AM" && hour === 12) hour = 0;

  const date = new Date(2026, 9, day, hour, Number(minuteValue));
  return localDateTime(date);
};

const responseCountdown = (seconds) =>
  [Math.floor(seconds / 60), seconds % 60]
    .map((part) => String(part).padStart(2, "0"))
    .join(" : ");

const getDurationLabel = (duration) =>
  typeof duration === "string"
    ? duration
    : Number(duration) === 60
      ? "1 hr"
      : `${Number(duration || 45)} mins`;

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
  initialStage = "schedule",
}) {
  const navigate = useNavigate();
  const store = useBeautyBookingStore();
  const fetchBookings = store.fetchBookings;
  const [stage, setStage] = useState(initialStage);
  const [createdBookingId, setCreatedBookingId] = useState(null);
  const [bookingRecord, setBookingRecord] = useState(null);
  const [selectedDay, setSelectedDay] = useState(8);
  const [selectedTime, setSelectedTime] = useState("11:00 AM");
  const [date, setDate] = useState(
    () =>
      booking.date ||
      (booking.mode === "now"
        ? localDateTime(new Date(Date.now() + 3600000))
        : parseTimeToDate(8, "11:00 AM")),
  );
  const [address, setAddress] = useState(
    booking.address ||
      (booking.id === "home" ? "" : "24 Palm Avenue, Lekki Phase 1, Lagos"),
  );
  const [note, setNote] = useState(booking.note || "");
  const [method, setMethod] = useState("wallet");
  const [expiresAt, setExpiresAt] = useState(
    initialStage === "payment"
      ? Date.parse(booking.paymentDeadlineAt || "") || Date.now() + 300000
      : null,
  );
  const [receivedExpiresAt, setReceivedExpiresAt] = useState(null);
  const [now, setNow] = useState(Date.now);
  const [message, setMessage] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [walletBalance, setWalletBalance] = useState(null);
  const [walletLoading, setWalletLoading] = useState(false);
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    if (stage !== "received" || !createdBookingId) return undefined;

    let active = true;
    let timeoutId;
    const pollBooking = async () => {
      try {
        const bookings = await fetchBookings();
        const currentBooking = bookings.find(
          (item) => item.id === createdBookingId,
        );
        if (!active || !currentBooking) return;

        if (currentBooking.status === "accepted") {
          setBookingRecord(currentBooking);
          setExpiresAt(
            Date.parse(currentBooking.paymentDeadlineAt || "") ||
              Date.now() + 300000,
          );
          setStage("payment");
          return;
        }

        if (["expired", "cancelled"].includes(currentBooking.status)) {
          setBookingRecord(currentBooking);
          setStage("expired");
          return;
        }
      } catch {
        // Keep checking; a temporary polling error should not close the request.
      }

      if (active) timeoutId = setTimeout(pollBooking, 4000);
    };

    pollBooking();
    return () => {
      active = false;
      clearTimeout(timeoutId);
    };
  }, [createdBookingId, fetchBookings, stage]);
  useEffect(() => {
    if (stage !== "payment") return;

    const fetchBalance = async () => {
      setWalletLoading(true);
      try {
        const response = await getWalletBalance({ bustCache: true });
        const available =
          response?.data?.walletBalance?.available ??
          response?.data?.available ??
          response?.available ??
          0;
        setWalletBalance(Number(available || 0));
      } catch {
        setWalletBalance(null);
      } finally {
        setWalletLoading(false);
      }
    };

    fetchBalance();
  }, [stage]);
  const startsIn = date
    ? Math.max(0, Math.ceil((new Date(date).getTime() - now) / 1000))
    : 0;
  const remaining = expiresAt
    ? Math.max(0, Math.ceil((expiresAt - now) / 1000))
    : 300;
  const responseRemaining = receivedExpiresAt
    ? Math.max(0, Math.ceil((receivedExpiresAt - now) / 1000))
    : 300;
  const paymentBooking = bookingRecord || booking;
  const total = Number(
    paymentBooking.totalAmount || paymentBooking.price + 100 || 0,
  );
  const serviceCharge = Math.max(0, total - Number(booking.price || 0));
  const canContinue = Boolean(
    address.trim() && date && new Date(date).getTime() > now,
  );
  const openPayment = () => {
    setExpiresAt(Date.now() + 300000);
    setNow(Date.now());
    setStage("payment");
  };
  const createBooking = async () => {
    if (!canContinue || store.loading) return;

    setSubmitError("");
    try {
      const providerId =
        provider.backendId ||
        provider.providerId?._id ||
        provider.providerId ||
        provider.id;

      if (!providerId || providerId === "phil-crook") {
        throw new Error(
          "This provider profile is not connected to a bookable provider account yet.",
        );
      }

      const response = await store.submit({
        category: "beauty_personal_care",
        service: [
          {
            serviceName: booking.service,
          },
        ],
        pricingOption: booking.pricingOption || "walk_in",
        date: formatBookingDate(date),
        time: formatBookingTime(date),
        location: address.trim(),
        providerId,
      });
      const createdBooking = useBeautyBookingStore.getState().booking;
      const bookingId =
        createdBooking?.id ||
        response?.data?._id ||
        response?.booking?._id ||
        response?._id;
      if (!bookingId) {
        throw new Error("Booking was created, but its ID was not returned.");
      }
      setCreatedBookingId(bookingId);
      setBookingRecord(createdBooking);
      setReceivedExpiresAt(Date.now() + 300000);
      setStage("received");
    } catch (error) {
      setSubmitError(
        error?.response?.data?.message ||
          "Booking creation failed. Please try again.",
      );
    }
  };
  const selectSchedule = (day, timeLabel = selectedTime) => {
    setSelectedDay(day);
    setSelectedTime(timeLabel);
    setDate(parseTimeToDate(day, timeLabel));
  };
  const handlePayment = async () => {
    if (!remaining || paymentLoading) return;

    const bookingId = paymentBooking.id || paymentBooking._id;
    if (!bookingId) {
      setPaymentError("Booking ID not found. Please refresh your bookings.");
      return;
    }

    setPaymentError("");
    setPaymentLoading(true);

    try {
      const pickupNote = note.trim() || undefined;

      if (method === "wallet") {
        await payWithWallet(bookingId, pickupNote);
        await store.fetchBookings();
        setStage("success");
        return;
      }

      const response = await initializePayment(bookingId, pickupNote);
      const authorizationUrl =
        response?.data?.authorizationUrl || response?.authorizationUrl;

      if (!authorizationUrl) {
        throw new Error("Payment gateway did not return a checkout link.");
      }

      localStorage.setItem("pendingBookingPaymentId", bookingId);
      localStorage.setItem(`pendingBookingPaymentKind:${bookingId}`, "beauty");
      window.location.href = authorizationUrl;
    } catch (error) {
      setPaymentError(
        error?.response?.data?.message ||
          error?.message ||
          "Payment processing failed. Please try again.",
      );
    } finally {
      setPaymentLoading(false);
    }
  };

  if (stage === "schedule") {
    const days = Array.from({ length: 31 }, (_, index) => index + 1);
    const timeOptions = [
      "9:00 AM",
      "9:30 AM",
      "11:00 AM",
      "11:30 AM",
      "12:00 PM",
      "12:30 PM",
      "02:00 AM",
      "3:30 AM",
      "4:30 PM",
      "5:00 PM",
      "5:30 PM",
      "06:00 PM",
    ];

    return (
      <Modal
        isOpen
        onClose={onClose}
        showCloseButton={false}
        overlayClassName="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/35 px-3 py-4 sm:items-center sm:px-4 sm:py-6"
        panelClassName="relative w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-xl max-h-[calc(100vh-2rem)] overflow-y-auto"
        contentClassName="text-gray-700"
      >
        <div className="flex items-start justify-between gap-4 border-b border-gray-200 px-4 py-3 sm:px-5 sm:py-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Select Date & Time
            </h2>
            <p className="text-sm text-gray-500">
              Times shown are based on the provider's availability.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-full p-1 text-gray-700 hover:bg-gray-100"
          >
            <X size={22} />
          </button>
        </div>

        <div className="grid divide-y divide-gray-200 md:grid-cols-[1fr_0.95fr] md:divide-x md:divide-y-0">
          <section className="px-4 py-4 sm:px-5 sm:py-5">
            <div className="mb-4 flex items-center justify-between sm:mb-6">
              <button
                type="button"
                aria-label="Previous month"
                className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-100 text-gray-500"
              >
                <ChevronLeft size={17} />
              </button>
              <h3 className="text-sm font-semibold text-gray-700">
                October 2026
              </h3>
              <button
                type="button"
                aria-label="Next month"
                className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-100 text-gray-500"
              >
                <ChevronRight size={17} />
              </button>
            </div>
            <div className="grid grid-cols-7 gap-y-2 text-center text-sm sm:gap-y-5">
              {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((day) => (
                <span key={day} className="font-medium text-gray-700">
                  {day}
                </span>
              ))}
              <span />
              <span />
              <span />
              {days.map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => selectSchedule(day)}
                  className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full text-sm sm:h-9 sm:w-9 ${
                    selectedDay === day
                      ? "bg-[#34805A] font-semibold text-white"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </section>

          <section className="px-4 py-4 sm:px-5 sm:py-5">
            <h3 className="mb-3 text-base font-semibold text-gray-800 sm:mb-5">
              Select time
            </h3>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {timeOptions.map((timeOption) => (
                <button
                  key={timeOption}
                  type="button"
                  onClick={() => selectSchedule(selectedDay, timeOption)}
                  className={`rounded-md border px-2 py-2 text-xs font-medium sm:px-3 sm:text-sm ${
                    selectedTime === timeOption
                      ? "border-[#34805A] bg-[#34805A] text-white"
                      : "border-gray-200 text-gray-700 hover:border-[#34805A]"
                  }`}
                >
                  {timeOption}
                </button>
              ))}
            </div>
          </section>
        </div>

        <div className="flex flex-col gap-3 border-t border-gray-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <p className="flex items-center gap-2 text-sm text-gray-600">
            <Clock size={18} className="text-[#34805A]" />
            This service takes {getDurationLabel(booking.duration)}
          </p>
          <button
            type="button"
            disabled={!canContinue || store.loading}
            onClick={createBooking}
            className="w-full rounded-md bg-[#34805A] px-8 py-2.5 text-sm font-semibold text-white hover:bg-[#2d6f4f] disabled:cursor-not-allowed disabled:bg-gray-300 sm:w-auto"
          >
            {store.loading ? "Creating..." : "Continue"}
          </button>
        </div>

        {submitError && (
          <p className="mx-5 mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {submitError}
          </p>
        )}
      </Modal>
    );
  }

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
          {submitError && (
            <p className="mb-3 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {submitError}
            </p>
          )}
          <Button
            disabled={!canContinue || store.loading}
            onClick={createBooking}
          >
            {store.loading ? "Creating Booking..." : "Continue"}
          </Button>
        </div>
      </Modal>
    );

  if (stage === "expired")
    return (
      <Modal
        isOpen
        onClose={onClose}
        title="Booking Update"
        panelClassName="relative w-[94%] max-w-md rounded-xl bg-white p-6 shadow-xl"
      >
        <p className="py-5 text-center text-sm text-gray-600">
          This booking request was {bookingRecord?.status || "closed"}. You can
          return to your bookings to review its status.
        </p>
        <Button
          onClick={() => {
            onClose();
            navigate("/bookings?tab=requests");
          }}
        >
          View bookings
        </Button>
      </Modal>
    );

  if (stage === "received")
    return (
      <Modal
        isOpen
        onClose={onClose}
        showCloseButton={false}
        overlayClassName="fixed inset-0 z-50 flex items-center justify-center bg-[#D8D8D8] px-4 py-8"
        panelClassName="relative flex min-h-[62vh] w-full max-w-4xl items-center justify-center bg-white px-6 py-16"
      >
        <span className="absolute left-0 top-[-34px] text-lg font-medium uppercase tracking-wide text-gray-500">
          Searching
        </span>
        <div className="text-center">
          <img
            src="/favicon.png"
            alt="SabiGuy"
            className="mx-auto mb-6 h-20 w-20 object-contain"
          />
          <h2 className="text-2xl font-bold text-gray-800">
            Request Received
          </h2>
          <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-gray-500">
            This provider is reviewing your booking.
            <br />
            You'll be notified shortly
          </p>
          <p className="mt-8 text-2xl font-bold tabular-nums text-[#34805A]">
            {responseCountdown(responseRemaining)}
          </p>
          <p className="mt-1 text-xs text-gray-400">
            Response time remaining
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
                  <dd>{formatMoney(serviceCharge)}</dd>
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
                          Balance:{" "}
                          {walletLoading
                            ? "Checking..."
                            : walletBalance == null
                              ? "Unavailable"
                              : formatMoney(walletBalance)}
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
                {paymentError && (
                  <p className="mb-3 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                    {paymentError}
                  </p>
                )}
                <Button
                  disabled={!remaining || paymentLoading}
                  onClick={handlePayment}
                >
                  {paymentLoading
                    ? "Processing..."
                    : `Confirm & Pay ${formatMoney(total)}`}
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
