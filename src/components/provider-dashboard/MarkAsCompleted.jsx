import { useState } from "react";
import { Check, Loader2, X } from "lucide-react";
import { toast } from "react-toastify";
import { markAsComplete } from "../../api/bookings";
import { uploadCompletionPhoto } from "../../api/completionPhotos";
import { useAuthStore } from "../../stores/auth.store";
import ReviewSent from "./ReviewSentModal";
import UploadBox from "../uploadBox";

export default function MarkAsCompleted({ isOpen, onClose, job, onRefresh }) {
  const user = useAuthStore((state) => state.user);
  const email = user?.email || user?.data?.email;
  const [photos, setPhotos] = useState([]);
  const [note, setNote] = useState("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [completedWithoutPhotos, setCompletedWithoutPhotos] = useState(false);
  const [error, setError] = useState("");
  const isBeauty = String(job?.originalData?.serviceType || "").toLowerCase().includes("beauty");

  if (!isOpen) return null;

  const submit = async () => {
    if (photos.length < 2) { setError("Upload at least 2 work photos."); return; }
    setSubmitting(true);
    setError("");
    try {
      const response = await markAsComplete(job.id, {
        pictures: photos,
        videos: [],
        ...(note.trim() ? { additionalNote: note.trim() } : {}),
      });
      const savedPictures = (response?.data?.jobCompletedImages || [])
        .flatMap((item) => item?.pictures || []);
      if (!photos.every((url) => savedPictures.includes(url))) {
        setCompletedWithoutPhotos(true);
        setError("The booking was marked complete, but the response did not include the uploaded photos. Please do not submit it again; contact support with this booking ID.");
        return;
      }
      setSent(true);
    } catch (err) {
      const message = err.response?.data?.message || "Failed to mark job as complete.";
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const close = () => {
    setPhotos([]);
    setNote("");
    setError("");
    setSent(false);
    setCompletedWithoutPhotos(false);
    onClose?.();
    if (sent || completedWithoutPhotos) onRefresh?.();
  };

  if (!isBeauty) {
    const completeLegacyJob = async () => {
      setSubmitting(true);
      try {
        await markAsComplete(job.id);
        setSent(true);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to mark job as complete");
      } finally {
        setSubmitting(false);
      }
    };
    if (sent) return <ReviewSent isOpen onClose={close} />;
    return <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-50/50 p-4">
      <section className="max-h-[95vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-5">
        <header className="flex items-center justify-between border-b border-gray-200 px-6 py-4"><h2 className="text-xl font-semibold">Review</h2><button type="button" onClick={close} aria-label="Close"><X size={20} /></button></header>
        <h3 className="mt-4 text-lg font-semibold">Upload Supporting Documents</h3>
        <p className="mt-2 text-gray-500">To mark this project completed, upload some of the work pictures for customer review</p>
        <h3 className="mt-5 text-lg font-semibold">Work Photos</h3>
        <p className="mb-4 mt-2 text-gray-500">Upload 2 - 3 photos of this completed project</p>
        <UploadBox />
        <textarea placeholder="Additional Notes (optional)" rows={4} className="my-5 w-full resize-none rounded-md border border-gray-300 bg-gray-50 px-4 py-3" />
        <button type="button" onClick={completeLegacyJob} disabled={submitting} className="mb-5 w-full rounded-md bg-[#005823BF] p-3 text-white disabled:opacity-50">{submitting ? "Processing..." : "Mark as completed"}</button>
      </section>
    </div>;
  }

  if (sent) return <ReviewSent isOpen compact onClose={close} />;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-3 sm:p-5">
      <section role="dialog" aria-modal="true" aria-labelledby="completion-review-title" className="max-h-[94dvh] w-full max-w-[520px] overflow-y-auto rounded-[8px] bg-white shadow-xl">
        <header className="sticky top-0 z-10 flex items-start justify-between border-b border-[#E8E8E8] bg-white px-5 py-4">
          <div><h2 id="completion-review-title" className="text-base font-semibold text-[#262626]">Review</h2><p className="mt-1 text-xs text-[#777]">To mark this project completed, upload some of the work pictures for review</p></div>
          <button type="button" onClick={close} aria-label="Close review" className="ml-3 shrink-0 text-[#333]"><X size={18} /></button>
        </header>
        <div className="space-y-5 px-5 py-5">
          <div><h3 className="text-sm font-semibold text-[#303030]">Work Photos</h3><p className="mt-1 text-xs text-[#777]">Upload 2 - 3 photos of this completed project</p></div>
          <UploadBox
            accept="image/jpeg,image/png"
            maxSizeMB={10}
            maxFiles={3 - photos.length}
            disabled={!email || uploading || photos.length >= 3}
            uploadFile={(file) => uploadCompletionPhoto(email, file)}
            onUploadStart={() => { setUploading(true); setError(""); }}
            onUploadEnd={() => setUploading(false)}
            onUploadComplete={(urls) => setPhotos((current) => [...current, ...urls].slice(0, 3))}
            onError={setError}
            formatHint="JPEG, PNG format, Max 10 MB"
            className="min-h-[148px] !border-[#C9C9C9] !rounded-[4px] !py-5"
          />
          {photos.length > 0 && <div className="grid grid-cols-3 gap-2">{photos.map((url) => <div key={url} className="relative aspect-square overflow-hidden rounded-[4px]"><img src={url} alt="Completed work" className="h-full w-full object-cover" /><button type="button" onClick={() => setPhotos((current) => current.filter((item) => item !== url))} aria-label="Remove photo" className="absolute right-1 top-1 rounded-full bg-white p-1 text-[#333]"><X size={14} /></button></div>)}</div>}
          <div><label htmlFor="completion-note" className="text-xs font-semibold text-[#303030]">Additional notes <span className="font-normal text-[#888]">(optional)</span></label><textarea id="completion-note" value={note} onChange={(event) => setNote(event.target.value)} className="mt-1 block min-h-[80px] w-full resize-y rounded-[4px] border border-[#E2E2E2] bg-[#FAFAFA] p-3 text-sm outline-none focus:border-[#328251]" /></div>
          {error && <p role="alert" className="text-xs text-red-600">{error}</p>}
          <button type="button" onClick={submit} disabled={uploading || submitting || completedWithoutPhotos} className="flex h-10 w-full items-center justify-center gap-2 rounded-[4px] bg-[#337E52] text-sm font-medium text-white disabled:opacity-60">{submitting ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}{submitting ? "Sending review..." : "Mark as Completed"}</button>
        </div>
      </section>
    </div>
  );
}
