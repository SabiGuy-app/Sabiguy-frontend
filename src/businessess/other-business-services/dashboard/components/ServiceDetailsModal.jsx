import { useEffect, useState } from "react";
import {
  Clock3,
  House,
  Info,
  Loader2,
  Plus,
  Store,
  Trash2,
  X,
} from "lucide-react";

const durationOptions = [
  "15 mins",
  "30 mins",
  "45 mins",
  "1 hr",
  "2 hrs",
  "3 hrs",
];
const suggestedIncludedItems = [
  "Hair wash",
  "Hair cut & styling",
  "Beard Trim",
  "Scalp massage",
  "Hot towel finish",
  "Beard oil",
];

const locationIcon = (location) => {
  if (location === "Office / Commercial Space") return Store;
  if (location === "My home Address") return House;
  return House;
};

export default function ServiceDetailsModal({
  isOpen,
  service,
  locations,
  onClose,
  onSave,
}) {
  const [draft, setDraft] = useState(service);
  const [itemDraft, setItemDraft] = useState("");
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    setDraft({
      ...service,
      name: service?.name ?? "",
      price: service?.price ?? "",
      duration: service?.duration ?? "45 mins",
      included: service?.included ?? [],
      locationPricing: service?.locationPricing ?? [],
    });
    setItemDraft("");
    setIsAddingItem(false);
    setIsSaving(false);
    setSaveError("");
  }, [isOpen, service]);

  if (!isOpen || !draft) return null;

  const addIncludedItem = (event) => {
    event?.preventDefault();
    const item = itemDraft.trim();
    if (
      !item ||
      draft.included.some(
        (included) => included.toLowerCase() === item.toLowerCase(),
      )
    )
      return;
    setDraft((current) => ({
      ...current,
      included: [...current.included, item],
    }));
    setItemDraft("");
    setIsAddingItem(false);
  };

  const addLocation = () => {
    const nextLocation = locations.find(
      (location) =>
        !draft.locationPricing.some((entry) => entry.location === location),
    );
    if (!nextLocation) return;
    setDraft((current) => ({
      ...current,
      locationPricing: [
        ...current.locationPricing,
        { location: nextLocation, price: "", duration: "45 mins" },
      ],
    }));
  };

  const updateLocation = (index, key, value) => {
    setDraft((current) => ({
      ...current,
      locationPricing: current.locationPricing.map((entry, entryIndex) =>
        entryIndex === index ? { ...entry, [key]: value } : entry,
      ),
    }));
  };

  const save = async (event) => {
    event.preventDefault();
    if (isSaving) return;

    setIsSaving(true);
    setSaveError("");
    try {
      await onSave(draft);
    } catch (error) {
      setSaveError(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to save service details. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-80 flex items-center justify-center bg-black/40 p-4"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <form
        onSubmit={save}
        className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-[#E9E9E9] bg-white p-5 shadow-2xl sm:p-7"
      >
        <button
          type="button"
          onClick={onClose}
          disabled={isSaving}
          aria-label="Close service details"
          className="absolute right-4 top-4 rounded p-1 text-[#777777] hover:bg-[#F3F3F3]"
        >
          <X size={18} />
        </button>
        <h2 className="pr-8 text-base font-semibold text-[#292929]">
          Service Details
        </h2>
        <p className="mt-1 text-[10px] text-[#777777]">
          This endpoint saves the service name and pricing. Duration and
          included items are not saved by this endpoint.
        </p>

        <div className="mt-5 space-y-4" aria-busy={isSaving}>
          <label className="block text-xs font-medium text-[#353535]">
            Service Name
            <input
              required
              autoFocus
              value={draft.name}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  name: event.target.value,
                }))
              }
              placeholder="e.g. Haircut"
              className="mt-1.5 h-11 w-full rounded-md border border-[#DADADA] px-3.5 text-sm font-normal outline-none focus:border-[#347B54]"
            />
          </label>

          <label className="block text-xs font-medium text-[#353535]">
            Duration
            <span className="relative mt-1.5 block">
              <Clock3
                size={17}
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8C8C8C]"
              />
              <select
                value={draft.duration}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    duration: event.target.value,
                  }))
                }
                className="h-11 w-full appearance-none rounded-md border border-[#DADADA] bg-white pl-10 pr-9 text-sm font-normal outline-none focus:border-[#347B54]"
              >
                {durationOptions.map((duration) => (
                  <option key={duration}>{duration}</option>
                ))}
              </select>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#777777]"
              >
                ⌄
              </span>
            </span>
          </label>

          <fieldset>
            <legend className="text-xs font-medium text-[#353535]">
              What’s included{" "}
              <span className="font-normal text-[#929292]">(Optional)</span>
            </legend>
            {/* <div className="mt-2 flex flex-wrap gap-1.5">
              {draft.included.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-1 rounded-full bg-[#F2F2F2] py-1 pl-3 pr-1.5 text-[10px] text-[#626262]"
                >
                  {item}
                  <button
                    type="button"
                    aria-label={`Remove ${item}`}
                    onClick={() =>
                      setDraft((current) => ({
                        ...current,
                        included: current.included.filter(
                          (value) => value !== item,
                        ),
                      }))
                    }
                    className="rounded-full p-0.5 text-[#888888] hover:bg-[#E3E3E3]"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
            {suggestedIncludedItems.some(
              (item) => !draft.included.includes(item),
            ) && (
              <div className="mt-2">
                <div className="flex flex-wrap gap-1.5">
                  {suggestedIncludedItems
                    .filter((item) => !draft.included.includes(item))
                    .map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() =>
                          setDraft((current) => ({
                            ...current,
                            included: [...current.included, item],
                          }))
                        }
                        className="rounded-full border border-[#DADADA] bg-white px-2.5 py-1 text-[10px] text-[#777777] transition-colors hover:border-[#AFCFBA] hover:bg-[#F4F9F5] hover:text-[#347B54]"
                      >
                        {item}
                      </button>
                    ))}
                </div>
              </div>
            )} */}
            {isAddingItem ? (
              <div className="mt-2.5 flex flex-wrap items-center gap-2">
                <input
                  autoFocus
                  value={itemDraft}
                  onChange={(event) => setItemDraft(event.target.value)}
                  onKeyDown={(event) =>
                    event.key === "Enter" && addIncludedItem(event)
                  }
                  placeholder="e.g. face wash"
                  className="h-8 min-w-0 flex-1 rounded-md border border-[#DADADA] px-3 text-xs outline-none placeholder:text-[#A0A0A0] focus:border-[#347B54]"
                />
                <button
                  type="button"
                  onClick={addIncludedItem}
                  className="h-8 rounded-md bg-[#347B54] px-3 text-[10px] font-medium text-white hover:bg-[#286642]"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingItem(false);
                    setItemDraft("");
                  }}
                  className="h-8 rounded-md border border-[#DADADA] px-3 text-[10px] text-[#555555] hover:bg-[#F7F7F7]"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsAddingItem(true)}
                className="mt-2.5 inline-flex h-7 items-center gap-1.5 rounded-full border border-[#AFCFBA] px-3 text-[10px] font-medium text-[#347B54] hover:bg-[#F4F9F5]"
              >
                <Plus size={13} />
                Add item
              </button>
            )}
          </fieldset>

          <label className="block text-xs font-medium text-[#353535]">
            Price (₦)
            <input
              required
              min="0"
              type="number"
              value={draft.price}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  price: event.target.value,
                }))
              }
              placeholder="80,000"
              className="mt-1.5 h-11 w-full rounded-md border border-[#DADADA] px-3.5 text-sm font-normal outline-none focus:border-[#347B54]"
            />
          </label>

          <section>
            <div className="mb-2 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-xs font-medium text-[#353535]">
                  Price by location
                </h3>
                <p className="mt-0.5 text-[10px] text-[#888888]">
                  Set a price and duration for each service location.
                </p>
                <p className="mt-0.5 text-[10px] text-[#888888]">
                  Office / Commercial Space prices are saved as
                  provider_address.
                </p>
              </div>
              <button
                type="button"
                onClick={addLocation}
                disabled={
                  !locations.some(
                    (location) =>
                      !draft.locationPricing.some(
                        (entry) => entry.location === location,
                      ),
                  )
                }
                className="inline-flex h-8 shrink-0 items-center gap-1 rounded-md border border-[#AFCFBA] px-2.5 text-[10px] font-medium text-[#347B54] hover:bg-[#F4F9F5] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Plus size={13} />
                Add Location
              </button>
            </div>
            <div className="space-y-2">
              {draft.locationPricing.map((entry, index) => {
                const Icon = locationIcon(entry.location);
                return (
                  <div
                    key={entry.location}
                    className="grid grid-cols-1 items-center gap-2 sm:grid-cols-[minmax(145px,1fr)_minmax(110px,0.9fr)_minmax(120px,0.95fr)_28px]"
                  >
                    <div className="flex items-center gap-2 text-[10px] font-medium text-[#555555]">
                      <Icon size={15} className="shrink-0 text-[#777777]" />
                      <span>{entry.location}</span>
                    </div>
                    <label className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-[#777777]">
                        ₦
                      </span>
                      <input
                        aria-label={`${entry.location} price`}
                        type="number"
                        min="0"
                        value={entry.price}
                        onChange={(event) =>
                          updateLocation(index, "price", event.target.value)
                        }
                        placeholder="5,000"
                        className="h-10 w-full rounded-md border border-[#DADADA] pl-7 pr-2 text-xs outline-none focus:border-[#347B54]"
                      />
                    </label>
                    <select
                      aria-label={`${entry.location} duration`}
                      value={entry.duration}
                      onChange={(event) =>
                        updateLocation(index, "duration", event.target.value)
                      }
                      className="h-10 w-full rounded-md border border-[#DADADA] bg-white px-2.5 text-xs outline-none focus:border-[#347B54]"
                    >
                      {durationOptions.map((duration) => (
                        <option key={duration}>{duration}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      aria-label={`Remove ${entry.location}`}
                      onClick={() =>
                        setDraft((current) => ({
                          ...current,
                          locationPricing: current.locationPricing.filter(
                            (_, rowIndex) => rowIndex !== index,
                          ),
                        }))
                      }
                      className="flex h-8 w-7 items-center justify-center rounded text-[#777777] hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          </section>

          <div className="flex gap-2 rounded-lg border border-[#DCEAF5] bg-[#F5FAFE] p-3 text-[10px] italic leading-4 text-[#858E97]">
            <Info size={14} className="mt-0.5 shrink-0 text-[#6399C7]" />
            <p>
              Note: A 10% platform fee applies to all completed transactions.
              For example, if you earn ₦10,000, your payout will be ₦9,000.
            </p>
          </div>
        </div>

        {saveError && (
          <p role="alert" className="mt-3 text-xs text-red-600">
            {saveError}
          </p>
        )}
        <footer className="mt-4 flex justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="h-10 rounded-md border border-[#DADADA] px-6 text-xs font-medium text-[#444444] hover:bg-[#F7F7F7] disabled:cursor-wait disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex h-10 min-w-28 items-center justify-center gap-2 rounded-md bg-[#347B54] px-6 text-xs font-medium text-white hover:bg-[#286642] disabled:cursor-wait disabled:opacity-60"
          >
            {isSaving && <Loader2 size={14} className="animate-spin" />}
            {isSaving ? "Saving..." : "Save"}
          </button>
        </footer>
      </form>
    </div>
  );
}
