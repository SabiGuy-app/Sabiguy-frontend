import { useEffect, useState } from "react";
import { ArrowRight, MapPin, X } from "lucide-react";
import LocationAutocomplete from "../../../../components/LocationAutocomplete";
import { useAuthStore } from "../../../../stores/auth.store";
import { reverseGeocodeCoordinates } from "../../../../services/reverseGeocode";
import {
  checkoutProductOrder,
  getProductDeliveryQuote,
} from "../../../../api/products";

const formatPrice = (amount, currency = "NGN") => {
  const value = Number(amount);
  if (!Number.isFinite(value)) return "—";
  try {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${currency} ${value.toLocaleString("en-NG")}`;
  }
};

const getResponseData = (response) =>
  response?.data?.data || response?.data || response;

const getProductId = (product) => product?._id || product?.id;

export default function ProductCheckoutModal({
  products,
  sellerName,
  returnPath,
  initialDestination,
  initialQuote,
  initialQuoteError,
  onClose,
}) {
  const user = useAuthStore((state) => state.user);
  const profile = user?.data || user || {};
  const [fulfillmentType, setFulfillmentType] = useState("delivery");
  const [modeOfDelivery, setModeOfDelivery] = useState("Bike");
  const [destination, setDestination] = useState(
    initialDestination || {
      address: localStorage.getItem("currentLocationAddress") || "",
      latitude: null,
      longitude: null,
    },
  );
  const [quote, setQuote] = useState(initialQuote || null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteError, setQuoteError] = useState(initialQuoteError || "");
  const [recipientName, setRecipientName] = useState(profile.fullName || "");
  const [phone, setPhone] = useState(profile.phoneNumber || "");
  const [instructions, setInstructions] = useState("");
  const [pickupNote, setPickupNote] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [now, setNow] = useState(Date.now);

  const selectedProducts = products.filter(
    (item) => getProductId(item.product) && item.quantity > 0,
  );
  const firstProduct = selectedProducts[0]?.product;
  const subtotal = selectedProducts.reduce(
    (total, item) => total + Number(item.product.price || 0) * item.quantity,
    0,
  );
  const platformFee = 200; // Flat platform fee for all product orders
  const quoteExpiresAt = Date.parse(quote?.expiresAt || "");
  const quoteExpired = Number.isFinite(quoteExpiresAt) && quoteExpiresAt <= now;
  const quoteId = quote?.quoteId || quote?._id;

  useEffect(() => {
    if (!quote?.expiresAt) return undefined;
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [quote?.expiresAt]);

  const fetchQuote = async (target = destination, mode = modeOfDelivery) => {
    if (!firstProduct || !target.address.trim()) {
      setQuoteError("Select a delivery address first.");
      return;
    }
    if (!Number.isFinite(target.latitude) || !Number.isFinite(target.longitude)) {
      setQuoteError("Choose an address from the location suggestions to get its coordinates.");
      return;
    }

    setQuote(null);
    setQuoteError("");
    setQuoteLoading(true);
    try {
      const response = await getProductDeliveryQuote({
        productId: getProductId(firstProduct),
        modeOfDelivery: mode,
        destination: {
          latitude: target.latitude,
          longitude: target.longitude,
          address: target.address.trim(),
        },
      });
      const nextQuote = getResponseData(response);
      if (!nextQuote?.quoteId) {
        throw new Error("The delivery quote response did not include a quote ID.");
      }
      setQuote(nextQuote);
    } catch (error) {
      setQuoteError(
        error?.response?.data?.message ||
          error?.message ||
          "Could not calculate delivery. Please try again.",
      );
    } finally {
      setQuoteLoading(false);
    }
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setQuoteError("This browser does not support current location. Choose a delivery address instead.");
      return;
    }
    setQuoteError("");
    setQuoteLoading(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const currentDestination = {
            latitude: coords.latitude,
            longitude: coords.longitude,
            address: await reverseGeocodeCoordinates({
              latitude: coords.latitude,
              longitude: coords.longitude,
            }),
          };
          setDestination(currentDestination);
          await fetchQuote(currentDestination);
        } catch (error) {
          setQuoteError(
            error?.response?.data?.message ||
              error?.message ||
              "Could not determine your current address. Choose another location.",
          );
        } finally {
          setQuoteLoading(false);
        }
      },
      (error) => {
        setQuoteLoading(false);
        setQuoteError(
          error.code === 1
            ? "Location permission was denied. Choose a delivery address instead."
            : "Could not determine your current location. Choose a delivery address instead.",
        );
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 },
    );
  };

  const handleCheckout = async (event) => {
    event.preventDefault();
    if (checkoutLoading) return;
    if (
      fulfillmentType === "delivery" &&
      (!quoteId || quoteExpired || !recipientName.trim() || !phone.trim())
    ) {
      setCheckoutError(
        quoteExpired
          ? "Your delivery quote has expired. Get a new quote before continuing."
          : "Get a delivery quote and enter the recipient's name and phone number.",
      );
      return;
    }

    setCheckoutError("");
    setCheckoutLoading(true);
    try {
      const payload = {
        items: selectedProducts.map(({ product, quantity }) => ({
          productId: getProductId(product),
          quantity,
        })),
        fulfillmentType,
        ...(fulfillmentType === "delivery"
          ? {
              quoteId,
              deliveryDetails: {
                recipientName: recipientName.trim(),
                phone: phone.trim(),
                instructions: instructions.trim(),
              },
            }
          : { pickupNote: pickupNote.trim() }),
      };
      const response = await checkoutProductOrder(payload);
      const result = getResponseData(response);
      const orderId = result?.orderId || result?.order?._id || result?.order?.id;
      const authorizationUrl = result?.authorizationUrl;
      if (!orderId) {
        throw new Error("The checkout response did not include an order ID.");
      }
      if (!authorizationUrl) {
        throw new Error("The checkout response did not include a payment link.");
      }

      localStorage.setItem("pendingProductOrderId", orderId);
      localStorage.setItem(
        "pendingProductOrderReference",
        result.reference || result.order?.paymentReference || "",
      );
      if (returnPath?.startsWith("/") && !returnPath.startsWith("//")) {
        localStorage.setItem("pendingProductOrderReturnPath", returnPath);
      }
      window.location.assign(authorizationUrl);
    } catch (error) {
      setCheckoutError(
        error?.response?.data?.message ||
          error?.message ||
          "Could not create your product order. Please try again.",
      );
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleFulfillmentChange = (nextType) => {
    setFulfillmentType(nextType);
    setCheckoutError("");
    if (nextType === "pickup") {
      setQuote(null);
      setQuoteError("");
    }
  };

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 p-3 sm:p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !checkoutLoading) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-checkout-title"
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
      >
        <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-5 py-4">
          <div>
            <h2 id="product-checkout-title" className="text-lg font-semibold">
              Checkout
            </h2>
            <p className="text-sm text-gray-500">From {sellerName}</p>
          </div>
          <button
            type="button"
            aria-label="Close checkout"
            disabled={checkoutLoading}
            onClick={onClose}
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </header>

        <form onSubmit={handleCheckout} className="space-y-6 p-5">
          <section aria-labelledby="checkout-items">
            <h3 id="checkout-items" className="mb-3 font-semibold text-gray-900">
              Your items
            </h3>
            <ul className="divide-y divide-gray-100 rounded-lg border border-gray-200">
              {selectedProducts.map(({ product, quantity }) => (
                <li
                  key={getProductId(product)}
                  className="flex items-center justify-between gap-4 p-3 text-sm"
                >
                  <span className="min-w-0">
                    <span className="block truncate font-medium">{product.name}</span>
                    <span className="text-gray-500">Qty {quantity}</span>
                  </span>
                  <span className="shrink-0 font-medium">
                    {formatPrice(Number(product.price) * quantity, product.currency)}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <fieldset>
            <legend className="mb-2 font-semibold text-gray-900">
              How would you like to receive it?
            </legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { value: "delivery", label: "Delivery" },
                { value: "pickup", label: "Pickup" },
              ].map((option) => (
                <label
                  key={option.value}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 ${
                    fulfillmentType === option.value
                      ? "border-[#34805A] bg-[#34805A]/5"
                      : "border-gray-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="fulfillmentType"
                    value={option.value}
                    checked={fulfillmentType === option.value}
                    onChange={() => handleFulfillmentChange(option.value)}
                  />
                  <span className="text-sm font-medium">{option.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {fulfillmentType === "delivery" ? (
            <section aria-labelledby="delivery-destination">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 id="delivery-destination" className="font-semibold text-gray-900">
                    Delivery destination
                  </h3>
                  <p className="text-xs text-gray-500">
                    Use your current location or choose another address.
                  </p>
                </div>
                <button
                  type="button"
                  disabled={quoteLoading}
                  onClick={useCurrentLocation}
                  className="inline-flex items-center gap-2 rounded-lg border border-[#34805A] px-3 py-2 text-sm font-medium text-[#005823] disabled:opacity-50"
                >
                  <MapPin size={16} />
                  Use current location
                </button>
              </div>
              <LocationAutocomplete
                name="product-delivery-address"
                label="Or search for a delivery address"
                placeholder="Search for an address"
                value={destination.address}
                onChange={(address) => {
                  setDestination({ address, latitude: null, longitude: null });
                  setQuote(null);
                  setQuoteError("");
                }}
                onSelect={(place) => {
                  setDestination({
                    address: place.address || "",
                    latitude: place.latitude,
                    longitude: place.longitude,
                  });
                  setQuote(null);
                  setQuoteError("");
                }}
              />
              <label className="mt-4 block text-sm font-medium text-gray-700">
                Delivery method
                <select
                  value={modeOfDelivery}
                  onChange={(event) => {
                    setModeOfDelivery(event.target.value);
                    setQuote(null);
                    setQuoteError("");
                  }}
                  className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2"
                >
                  <option value="Bike">Bike</option>
                  <option value="Car">Car</option>
                </select>
              </label>
              <button
                type="button"
                disabled={quoteLoading}
                onClick={() => fetchQuote()}
                className="mt-3 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 disabled:opacity-50"
              >
                {quoteLoading ? "Calculating..." : "Get delivery quote"}
              </button>
              {quoteError && (
                <p role="alert" className="mt-2 text-sm text-red-600">
                  {quoteError}
                </p>
              )}
              {quote && (
                <div className="mt-3 rounded-lg bg-gray-50 p-4 text-sm">
                  <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-center">
                    <div className="min-w-0">
                      <p className="text-xs font-medium uppercase text-gray-500">From</p>
                      <p className="break-words font-medium text-gray-900">
                        {quote.pickup?.address || "Pickup address unavailable"}
                      </p>
                    </div>
                    <ArrowRight
                      aria-hidden="true"
                      size={16}
                      className="rotate-90 text-gray-400 sm:rotate-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-medium uppercase text-gray-500">To</p>
                      <p className="break-words font-medium text-gray-900">
                        {quote.deliveryAddress?.address || destination.address}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 flex flex-wrap justify-between gap-2 text-gray-600">
                    <span>
                      {quote.distance?.value != null
                        ? `${quote.distance.value} ${quote.distance.unit || "km"}`
                        : "Distance unavailable"}
                    </span>
                    <span>
                      {quote.duration?.value != null
                        ? `${quote.duration.value} ${quote.duration.unit || "minutes"}`
                        : "ETA unavailable"}
                    </span>
                    <span className="font-semibold text-[#005823]">
                      Delivery: {formatPrice(quote.deliveryFee, quote.currency)}
                    </span>
                  </div>
                  {quoteExpired && (
                    <p role="alert" className="mt-2 text-sm text-red-600">
                      This quote has expired. Get a new quote to continue.
                    </p>
                  )}
                </div>
              )}
              {quote && !quoteId && (
                <p role="alert" className="mt-2 text-sm text-red-600">
                  The delivery quote is missing its ID. Request a new quote.
                </p>
              )}
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className="text-sm font-medium text-gray-700">
                  Recipient name
                  <input
                    required
                    value={recipientName}
                    onChange={(event) => setRecipientName(event.target.value)}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                  />
                </label>
                <label className="text-sm font-medium text-gray-700">
                  Phone number
                  <input
                    required
                    type="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                  />
                </label>
              </div>
              <label className="mt-3 block text-sm font-medium text-gray-700">
                Delivery instructions (optional)
                <textarea
                  rows={2}
                  value={instructions}
                  onChange={(event) => setInstructions(event.target.value)}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                />
              </label>
            </section>
          ) : (
            <label className="block text-sm font-medium text-gray-700">
              Pickup note (optional)
              <textarea
                rows={2}
                value={pickupNote}
                onChange={(event) => setPickupNote(event.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
              />
            </label>
          )}

          <div className="sticky bottom-0 z-10 -mx-5 bg-white px-5 pb-5 pt-3 shadow-[0_-8px_20px_rgba(0,0,0,0.06)]">
            <section className="space-y-2 border-t pt-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Platform fee</span>
                <span className="font-semibold text-[#005823]">
                  {formatPrice(platformFee)}
                </span>
              </div>
              {fulfillmentType === "delivery" && quote && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery fee</span>
                  <span>{formatPrice(quote.deliveryFee, quote.currency)}</span>
                </div>
              )}
            </section>

            {checkoutError && (
              <p role="alert" className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                {checkoutError}
              </p>
            )}
            <div className="mt-4 flex flex-col-reverse justify-end gap-3 sm:flex-row">
              <button
                type="button"
                disabled={checkoutLoading}
                onClick={onClose}
                className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={
                  checkoutLoading ||
                  quoteLoading ||
                  selectedProducts.length === 0 ||
                  (fulfillmentType === "delivery" && (!quoteId || quoteExpired))
                }
                className="rounded-lg bg-[#34805A] px-5 py-3 text-sm font-semibold text-white hover:bg-[#2d6f4f] disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                {checkoutLoading ? "Preparing payment..." : "Continue to payment"}
              </button>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
}
