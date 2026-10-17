import { useState } from "react";
import { Star } from "lucide-react";

export default function CustomerRatingModal({ isOpen, customerName, onClose, onSubmit }) {
  const [score, setScore] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [review, setReview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  if (!isOpen) return null;

  const close = () => {
    setScore(0);
    setReview("");
    setError("");
    onClose?.();
  };
  const submit = async () => {
    if (!score) { setError("Choose a rating first."); return; }
    setSubmitting(true);
    setError("");
    try {
      await onSubmit?.({ score, review: review.trim() });
      close();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Unable to submit the rating.");
    } finally {
      setSubmitting(false);
    }
  };

  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4">
    <section role="dialog" aria-modal="true" aria-labelledby="customer-rating-title" className="w-full max-w-[340px] rounded-[8px] bg-white px-6 py-7 shadow-xl">
      <h2 id="customer-rating-title" className="text-center text-base font-semibold leading-5 text-[#303030]">Rate your experience with<br />{customerName || "your customer"}</h2>
      <div className="mt-5 flex justify-center gap-2">
        {[1, 2, 3, 4, 5].map((value) => <button key={value} type="button" aria-label={`Rate ${value} stars`} onClick={() => setScore(value)} onMouseEnter={() => setHovered(value)} onMouseLeave={() => setHovered(0)}><Star size={26} strokeWidth={1.3} className={value <= (hovered || score) ? "fill-[#F3B400] text-[#F3B400]" : "text-[#C8C8C8]"} /></button>)}
      </div>
      <label htmlFor="customer-rating-review" className="mt-6 block text-xs text-[#303030]">Tell us how it went <span className="text-[#999]">(optional)</span></label>
      <textarea id="customer-rating-review" value={review} onChange={(event) => setReview(event.target.value)} placeholder="Share your experience" className="mt-1 h-[78px] w-full resize-none rounded-[4px] border border-[#E5E5E5] bg-[#F5F5F5] p-3 text-xs outline-none focus:border-[#337E52]" />
      {error && <p role="alert" className="mt-2 text-xs text-red-600">{error}</p>}
      <div className="mt-5 grid grid-cols-2 gap-2"><button type="button" onClick={close} className="h-9 rounded-[4px] border border-[#E5E5E5] text-xs text-[#555]">Skip</button><button type="button" onClick={submit} disabled={submitting} className="h-9 rounded-[4px] bg-[#337E52] text-xs font-medium text-white disabled:opacity-60">{submitting ? "Submitting..." : "Submit"}</button></div>
    </section>
  </div>;
}
