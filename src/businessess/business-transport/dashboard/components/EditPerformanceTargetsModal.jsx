import { useEffect, useState } from "react";
import { X } from "lucide-react";

export default function EditPerformanceTargetsModal({ isOpen, targets, onClose, onSave }) {
  const [values, setValues] = useState({ trips: 150, earnings: 120000, rating: 4.8 });

  useEffect(() => {
    if (!isOpen) return;
    setValues(Object.fromEntries(targets.map((target) => [target.key, target.target])));
  }, [isOpen, targets]);

  if (!isOpen) return null;

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave?.(values);
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose?.();
      }}
    >
      <form onSubmit={handleSubmit} className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
        <button type="button" onClick={onClose} aria-label="Close target editor" className="absolute right-4 top-4 rounded-md p-1 text-gray-500 hover:bg-gray-100">
          <X size={20} />
        </button>
        <h2 className="text-lg font-semibold text-[#302C2D]">Weekly targets</h2>
        <div className="mt-5 space-y-4">
          {[
            ["trips", "Trips target"],
            ["earnings", "Earnings target (₦)"],
            ["rating", "Rating target"],
          ].map(([key, label]) => (
            <label key={key} className="block text-sm font-medium text-[#5E5A5B]">
              {label}
              <input
                type="number"
                min="0"
                step={key === "rating" ? "0.1" : "1"}
                value={values[key]}
                onChange={(event) => setValues((current) => ({ ...current, [key]: Number(event.target.value) }))}
                className="mt-2 w-full rounded-lg border border-[#D5D2D3] px-4 py-3 outline-none focus:border-[#2F7D55] focus:ring-2 focus:ring-[#2F7D55]/10"
              />
            </label>
          ))}
        </div>
        <button type="submit" className="mt-5 w-full rounded-md bg-[#2F7D55] px-4 py-3 text-sm font-medium text-white hover:bg-[#256846]">
          Save targets
        </button>
      </form>
    </div>
  );
}
