import { Check, X } from "lucide-react";

export default function ReviewSent({ isOpen, onClose, compact = false }) {
  if (!isOpen) return null;
  if (!compact) return <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
    <section role="dialog" aria-modal="true" className="relative w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl">
      <button type="button" onClick={onClose} aria-label="Close" className="absolute right-4 top-4"><X size={18} /></button>
      <img src="/Okay.svg" alt="Success" className="mx-auto mb-6 h-32 w-32" />
      <h2 className="mb-3 text-2xl font-semibold text-gray-900">Review Sent</h2>
      <p className="mx-auto max-w-sm text-sm text-gray-500">Customer needs to review and approve the project before it can be completed</p>
    </section>
  </div>;
  return <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
    <section role="dialog" aria-modal="true" aria-labelledby="review-sent-title" className="relative w-full max-w-[340px] rounded-[7px] bg-white px-6 py-12 text-center shadow-xl">
      <button type="button" onClick={onClose} aria-label="Close" className="absolute right-4 top-4 text-[#333]"><X size={18} /></button>
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#337E52] text-white"><Check size={30} strokeWidth={3} /></span>
      <h2 id="review-sent-title" className="mt-5 text-base font-semibold text-[#303030]">Review Sent</h2>
      <p className="mx-auto mt-2 max-w-[260px] text-xs leading-5 text-[#888]">Customer needs to review and approve the project before it can be completed</p>
    </section>
  </div>;
}
