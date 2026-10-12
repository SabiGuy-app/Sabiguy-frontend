import { useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  Clock3,
  House,
  MapPin,
  Plus,
  Store,
  Trash2,
  X,
} from "lucide-react";
import Modal from "../../components/Modal";
import Button from "../../components/Button";

const LOCATION_OPTIONS = [
  { key: "walk_in", label: "Walk-in salon", Icon: Store },
  { key: "customer_address", label: "Customer's address", Icon: MapPin },
  { key: "provider_address", label: "Provider's address", Icon: House },
];

const DURATION_OPTIONS = [
  "30 minutes",
  "45 minutes",
  "1 hour",
  "1.5 hours",
  "2 hours",
];

const createEmptyService = () => ({
  serviceName: "",
  duration: "",
  pricingModel: {
    walk_in: "",
    provider_address: "",
    customer_address: "",
  },
});

const toNumberOrEmpty = (value) =>
  value === "" || value === null || value === undefined ? "" : Number(value);

const normalizeService = (service) => ({
  serviceName: service?.serviceName || service?.name || "",
  duration: service?.duration || "",
  pricingModel: {
    walk_in: toNumberOrEmpty(
      service?.pricingModel?.walk_in ?? service?.price,
    ),
    provider_address: toNumberOrEmpty(service?.pricingModel?.provider_address),
    customer_address: toNumberOrEmpty(service?.pricingModel?.customer_address),
  },
});

export default function AddService({ isOpen, onClose, onSave, editingService }) {
  const [service, setService] = useState(createEmptyService);
  const [visibleLocations, setVisibleLocations] = useState([
    "walk_in",
    "customer_address",
  ]);
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    const nextService = editingService
      ? normalizeService(editingService)
      : createEmptyService();
    const populatedLocations = LOCATION_OPTIONS.filter(
      ({ key }) => nextService.pricingModel[key] !== "",
    ).map(({ key }) => key);
    setService(nextService);
    setVisibleLocations(
      populatedLocations.length > 0
        ? populatedLocations
        : ["walk_in", "customer_address"],
    );
    setValidationError("");
  }, [isOpen, editingService]);

  const availableLocations = useMemo(
    () => LOCATION_OPTIONS.filter(({ key }) => !visibleLocations.includes(key)),
    [visibleLocations],
  );

  const updateService = (field, value) => {
    setService((previous) => ({ ...previous, [field]: value }));
    setValidationError("");
  };

  const handlePriceChange = (location, value) => {
    setService((previous) => ({
      ...previous,
      pricingModel: {
        ...previous.pricingModel,
        [location]: value,
      },
    }));
    setValidationError("");
  };

  const removeLocation = (location) => {
    if (visibleLocations.length === 1) return;
    setVisibleLocations((previous) => previous.filter((key) => key !== location));
    handlePriceChange(location, "");
  };

  const handleSave = async (event) => {
    event.preventDefault();
    const hasPrice = visibleLocations.some((location) => {
      const value = service.pricingModel[location];
      return value !== "" && !Number.isNaN(Number(value)) && Number(value) >= 0;
    });

    if (!service.serviceName.trim() || !service.duration || !hasPrice) {
      setValidationError(
        "Add a service name, choose a duration, and enter at least one price.",
      );
      return;
    }

    const saveSucceeded = await onSave?.({
      serviceName: service.serviceName.trim(),
      duration: service.duration,
      pricingModel: Object.fromEntries(
        visibleLocations
          .map((location) => [location, service.pricingModel[location]])
          .filter(([, price]) => price !== "")
          .map(([location, price]) => [location, Number(price)]),
      ),
    });
    if (saveSucceeded !== false) onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      showCloseButton={false}
      overlayClassName="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]"
      panelClassName="relative max-h-[calc(100vh-2rem)] w-full max-w-[700px] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-7"
      contentClassName="text-gray-700"
    >
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <h2 className="text-xl font-semibold text-[#231F20]">Service Details</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close service details"
          className="rounded-md p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
        >
          <X size={22} />
        </button>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-5 pt-5">
        <div>
          <label
            htmlFor="serviceName"
            className="mb-2 block text-sm font-medium text-[#231F20]"
          >
            Service name
          </label>
          <input
            id="serviceName"
            name="serviceName"
            value={service.serviceName}
            onChange={(event) => updateService("serviceName", event.target.value)}
            placeholder="e.g. Hair Cut"
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#388659] focus:ring-2 focus:ring-[#388659]/15"
          />
        </div>

        <div>
          <label
            htmlFor="serviceDuration"
            className="mb-2 block text-sm font-medium text-[#231F20]"
          >
            Duration
          </label>
          <div className="relative">
            <Clock3
              size={20}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <select
              id="serviceDuration"
              value={service.duration}
              onChange={(event) => updateService("duration", event.target.value)}
              className="w-full appearance-none rounded-lg border border-gray-300 bg-white py-3 pl-12 pr-10 text-sm text-gray-700 outline-none transition focus:border-[#388659] focus:ring-2 focus:ring-[#388659]/15"
            >
              <option value="">Select duration</option>
              {DURATION_OPTIONS.map((duration) => (
                <option key={duration} value={duration}>
                  {duration}
                </option>
              ))}
            </select>
            <ChevronDown
              size={18}
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-[#231F20]">
            Service Location &amp; Prices
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Select where you offer this service and set a price for each location.
          </p>
        </div>

        <div className="space-y-3">
          {visibleLocations.map((location) => {
            const locationOption = LOCATION_OPTIONS.find(
              ({ key }) => key === location,
            );
            const LocationIcon = locationOption.Icon;
            return (
              <div
                key={location}
                className="grid grid-cols-[minmax(0,1fr)_minmax(120px,190px)_auto] items-center gap-3"
              >
                <span className="inline-flex min-w-0 items-center gap-2 text-sm text-gray-600">
                  <LocationIcon size={18} className="shrink-0 text-gray-500" />
                  <span className="truncate">{locationOption.label}</span>
                </span>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                    NGN
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={service.pricingModel[location]}
                    onChange={(event) =>
                      handlePriceChange(location, event.target.value)
                    }
                    placeholder="0"
                    aria-label={`${locationOption.label} price`}
                    className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-12 pr-3 text-sm text-gray-900 outline-none transition focus:border-[#388659] focus:ring-2 focus:ring-[#388659]/15"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeLocation(location)}
                  disabled={visibleLocations.length === 1}
                  aria-label={`Remove ${locationOption.label}`}
                  className="rounded-md p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Trash2 size={17} />
                </button>
              </div>
            );
          })}
        </div>

        {availableLocations.length > 0 && (
          <button
            type="button"
            onClick={() =>
              setVisibleLocations((previous) => [
                ...previous,
                availableLocations[0].key,
              ])
            }
            className="inline-flex w-fit items-center gap-2 rounded-lg border border-[#388659] px-4 py-2 text-sm font-medium text-[#267348] transition-colors hover:bg-[#E8F4EC]"
          >
            <Plus size={17} />
            Add location
          </button>
        )}

        {validationError && (
          <p role="alert" className="text-sm text-red-600">
            {validationError}
          </p>
        )}

        <p className="text-xs italic leading-relaxed text-gray-400">
          Prices are sent to the backend by service location. Platform fees are
          applied to completed transactions.
        </p>

        <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-between">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button type="submit" size="md" className="w-full sm:w-auto">
            {editingService ? "Update" : "Save"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
