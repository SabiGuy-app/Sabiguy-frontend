import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";

export default function BeautyCompletionReviewModal({ isOpen, booking, loading, error, onClose, onConfirm }) {
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (!isOpen) setConfirming(false);
  }, [isOpen]);

  if (!isOpen) return null;

  const photos = (booking?.jobCompletedImages || []).flatMap((entry) =>
    (entry?.pictures || []).filter((url) => typeof url === "string" && /^https?:\/\//i.test(url)),
  );
  const serviceName = booking?.serviceDetails?.serviceName || booking?.subCategory || "service";
  const note = booking?.additionalNote || booking?.completionNote || booking?.providerNote ||
    `Your ${serviceName.toLowerCase()} service has been completed successfully.`;

  return <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/35 p-3 sm:p-5">
    {!confirming ? (
      <section role="dialog" aria-modal="true" aria-labelledby="beauty-completion-review-title" className="flex max-h-[94dvh] w-full max-w-[540px] flex-col overflow-hidden rounded-[8px] bg-white shadow-xl">
        <header className="flex shrink-0 items-start justify-between border-b border-[#E8E8E8] px-5 py-4">
          <div><h2 id="beauty-completion-review-title" className="text-[16px] font-semibold text-[#252525]">Review</h2><p className="mt-0.5 text-[12px] text-[#777]">Here's what your service provider submitted for this task</p></div>
          <button type="button" onClick={onClose} aria-label="Close review" className="ml-3 shrink-0 text-[#333]"><X size={18} /></button>
        </header>
        <div className="overflow-y-auto px-5 pt-4">
          <h3 className="mb-3 text-[14px] font-semibold text-[#303030]">Work Photos</h3>
          {loading && <p className="py-8 text-center text-sm text-gray-500">Loading work photos...</p>}
          {!loading && error && <p role="alert" className="py-5 text-sm text-red-600">{error}</p>}
          {!loading && !error && photos.length === 0 && <p className="py-8 text-center text-sm text-gray-500">No work photos were attached to this booking.</p>}
          {!loading && !error && photos.length > 0 && <div className="grid grid-cols-2 gap-3">
            {photos.map((url, index) => <img key={`${url}-${index}`} src={url} alt={`Completed ${serviceName} work ${index + 1}`} className="aspect-square w-full rounded-[7px] bg-gray-100 object-cover" />)}
          </div>}
          <div className="mt-5 border-t border-[#E8E8E8] pt-4"><h3 className="text-[13px] font-semibold text-[#303030]">Provider's note</h3><p className="mt-2 min-h-[68px] rounded-[4px] bg-[#F5F5F5] p-3 text-[12px] leading-5 text-[#888]">{note}</p></div>
        </div>
        <div className="shrink-0 px-5 py-4"><button type="button" onClick={() => setConfirming(true)} disabled={loading || !!error || photos.length === 0} className="flex h-10 w-full items-center justify-center gap-2 rounded-[4px] bg-[#337E52] text-[13px] font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"><Check size={16} />Mark as Completed</button></div>
      </section>
    ) : (
      <section role="dialog" aria-modal="true" aria-labelledby="beauty-completion-confirm-title" className="relative w-full max-w-[390px] rounded-[8px] bg-white px-8 pb-9 pt-12 text-center shadow-xl">
        <button type="button" onClick={onClose} aria-label="Close confirmation" className="absolute right-4 top-4 text-[#777]"><X size={18} /></button>
        <h2 id="beauty-completion-confirm-title" className="text-[18px] font-semibold text-[#303030]">Complete Service?</h2>
        <p className="mx-auto mt-4 max-w-[270px] text-[13px] leading-5 text-[#888]">Are you sure you want to mark this service as completed?</p>
        <div className="mt-7 grid grid-cols-2 gap-2"><button type="button" onClick={() => setConfirming(false)} className="h-10 rounded-[4px] border border-[#E5E5E5] bg-[#FAFAFA] text-[12px] font-medium text-[#555]">Cancel</button><button type="button" onClick={onConfirm} className="h-10 rounded-[4px] bg-[#337E52] text-[12px] font-medium text-white">Confirm</button></div>
      </section>
    )}
  </div>;
}
