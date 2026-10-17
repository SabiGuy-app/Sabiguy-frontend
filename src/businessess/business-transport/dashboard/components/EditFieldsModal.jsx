import { useEffect, useState } from "react";
import { X } from "lucide-react";

export default function EditFieldsModal({ isOpen, title, fields, values, onClose, onSave }) {
  const [draft, setDraft] = useState({});

  useEffect(() => {
    if (!isOpen) return;
    setDraft(values || {});
  }, [isOpen, values]);

  if (!isOpen) return null;

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave?.(draft);
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose?.();
      }}
    >
      <form onSubmit={handleSubmit} className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close editor"
          className="absolute right-4 top-4 rounded-md p-1 text-gray-500 hover:bg-gray-100"
        >
          <X size={20} />
        </button>
        <h2 className="text-lg font-semibold text-[#302C2D]">{title}</h2>
        <div className="mt-5 space-y-4">
          {fields.map(({ key, label, type = "text" }) => (
            <label key={key} className="block text-sm font-medium text-[#5E5A5B]">
              {label}
              <input
                type={type}
                value={draft[key] ?? ""}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, [key]: event.target.value }))
                }
                className="mt-2 w-full rounded-lg border border-[#D5D2D3] px-4 py-3 outline-none focus:border-[#2F7D55] focus:ring-2 focus:ring-[#2F7D55]/10"
              />
            </label>
          ))}
        </div>
        <button
          type="submit"
          className="mt-5 w-full rounded-md bg-[#2F7D55] px-4 py-3 text-sm font-medium text-white hover:bg-[#256846]"
        >
          Save changes
        </button>
      </form>
    </div>
  );
}
