import { useEffect, useState } from "react";
import { Upload, X } from "lucide-react";

const INITIAL_FORM = { title: "", owner: "", category: "driver", fileName: "" };

export default function DocumentModal({ isOpen, document, onClose, onSave }) {
  const [form, setForm] = useState(INITIAL_FORM);

  useEffect(() => {
    if (!isOpen) return;
    setForm(
      document
        ? { title: document.title, owner: document.owner, category: document.category, fileName: "" }
        : INITIAL_FORM,
    );
  }, [document, isOpen]);

  if (!isOpen) return null;

  const setField = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const canSubmit = form.title.trim() && form.owner.trim();

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose?.();
      }}
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (canSubmit) onSave?.(form, document);
        }}
        className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-2xl"
      >
        <button type="button" onClick={onClose} aria-label="Close document modal" className="absolute right-4 top-4 rounded-md p-1 text-gray-500 hover:bg-gray-100"><X size={20} /></button>
        <h2 className="text-lg font-semibold text-[#302C2D]">{document ? "Renew Document" : "Add Document"}</h2>
        <p className="mt-2 text-sm text-[#6D696A]">Upload a fleet document and identify who or what it belongs to.</p>

        <div className="mt-5 space-y-4">
          <label className="block text-sm font-medium text-[#5E5A5B]">
            Document name
            <input value={form.title} onChange={(event) => setField("title", event.target.value)} placeholder="e.g. Driver's licence" className="mt-2 w-full rounded-lg border border-[#D5D2D3] px-4 py-3 outline-none focus:border-[#2F7D55]" />
          </label>
          <label className="block text-sm font-medium text-[#5E5A5B]">
            Document type
            <select value={form.category} onChange={(event) => setField("category", event.target.value)} className="mt-2 w-full rounded-lg border border-[#D5D2D3] bg-white px-4 py-3 outline-none focus:border-[#2F7D55]">
              <option value="driver">Driver</option>
              <option value="vehicle">Vehicle</option>
              <option value="business">Business</option>
            </select>
          </label>
          <label className="block text-sm font-medium text-[#5E5A5B]">
            Driver, vehicle, or business
            <input value={form.owner} onChange={(event) => setField("owner", event.target.value)} placeholder="Enter name or registration" className="mt-2 w-full rounded-lg border border-[#D5D2D3] px-4 py-3 outline-none focus:border-[#2F7D55]" />
          </label>
          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-[#9FBEAA] bg-[#F7FBF8] px-4 py-4 text-sm text-[#2F7D55]">
            <Upload size={18} />
            {form.fileName || "Choose document file"}
            <input type="file" className="sr-only" onChange={(event) => setField("fileName", event.target.files?.[0]?.name || "")} />
          </label>
        </div>

        <button type="submit" disabled={!canSubmit} className="mt-5 w-full rounded-md bg-[#2F7D55] px-4 py-3 text-sm font-medium text-white hover:bg-[#256846] disabled:cursor-not-allowed disabled:opacity-50">
          {document ? "Submit renewal" : "Add document"}
        </button>
      </form>
    </div>
  );
}
