import { useState, useEffect } from "react";
import { Star } from "lucide-react";

export default function ReviewModal({
  isOpen,
  onClose,
  onSubmit,
  loading,
  apiError,
  providerName,
}) {
  const [score, setScore] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [review, setReview] = useState("");
  const [tipAmount, setTipAmount] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isOpen) {
      setScore(0);
      setReview("");
      setTipAmount("");
      setErrors({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!score) newErrors.score = "Please select a rating";
    if (tipAmount && parseFloat(tipAmount) < 0) {
      newErrors.tipAmount = "Tip amount must be a positive number";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({ 
      score, 
      review: review.trim(), 
      tipAmount: tipAmount === "" ? 0 : parseFloat(tipAmount) 
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-xl">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">
          Accept Job Completion
        </h2>
        <p className="text-sm text-gray-500 mb-5">
          Rate your experience with this provider
        </p>
        <div className="mb-5 inline-flex rounded-full bg-[#005823]/5 px-3 py-1 text-xs font-semibold text-[#005823]">
          {providerName ? `Provider: ${providerName}` : "Provider"}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating
          </label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => {
                  setScore(star);
                  if (errors.score) setErrors(prev => ({ ...prev, score: null }));
                }}
                onMouseEnter={() => setHovered(star)}
                onMouseLeave={() => setHovered(0)}
              >
                <Star
                  className={`w-8 h-8 transition-colors ${
                    star <= (hovered || score)
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-gray-200 text-gray-200"
                  }`}
                />
              </button>
            ))}
          </div>
          {errors.score && (
            <p className="mt-1 text-xs text-red-500">{errors.score}</p>
          )}
        </div>

        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Review (optional)
          </label>
          <textarea
            rows={3}
            placeholder="Share your experience..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#005823] resize-none"
          />
        </div>

        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Add a Tip (optional)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
              ₦
            </span>
            <input
              type="number"
              placeholder="0.00"
              value={tipAmount}
              onChange={(e) => {
                setTipAmount(e.target.value);
                if (errors.tipAmount) setErrors(prev => ({ ...prev, tipAmount: null }));
              }}
              className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#005823]"
            />
          </div>
          <p className="mt-1.5 text-[11px] text-gray-400 leading-tight">
            Note: The tip amount will be deducted from your wallet
          </p>
          {errors.tipAmount && (
            <p className="mt-1 text-xs text-red-500">{errors.tipAmount}</p>
          )}
        </div>

        {apiError && (
          <div className="mb-5 p-3 bg-red-50 border border-red-100 rounded-lg text-xs text-red-600">
            {apiError}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 px-4 py-2.5 bg-[#005823] text-white rounded-lg font-medium hover:bg-[#1f4a2a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
