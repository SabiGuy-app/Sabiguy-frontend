import { useEffect, useState } from "react";
import { CreditCard, Star, Wallet } from "lucide-react";

export default function ReviewModal({
  isOpen,
  onSubmit,
  loading,
  apiError,
  providerName,
  walletBalance,
  walletLoading,
  walletError,
}) {
  const [score, setScore] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [review, setReview] = useState("");
  const [tipAmount, setTipAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("wallet");
  const [errors, setErrors] = useState({});

  const isTipDisabled =
    walletLoading ||
    walletError ||
    walletBalance === null ||
    walletBalance <= 0;

  useEffect(() => {
    if (!isOpen) {
      setScore(0);
      setReview("");
      setTipAmount("");
      setPaymentMethod("wallet");
      setErrors({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!score) newErrors.score = "Please select a rating";
    if (tipAmount && parseFloat(tipAmount) < 100) {
      newErrors.tipAmount = "Minimum tip amount is ₦100";
    }
    if (
      tipAmount &&
      walletBalance !== null &&
      parseFloat(tipAmount) > walletBalance
    ) {
      newErrors.tipAmount = "Tip amount exceeds your wallet balance";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const parsedTipAmount = Number(tipAmount);
    onSubmit({
      score,
      review: review.trim(),
      ...(Number.isFinite(parsedTipAmount) && parsedTipAmount > 0
        ? { tipAmount: parsedTipAmount }
        : {}),
    });
  };

  const tipOptions = [500, 1000, 2000];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4 py-4">
      <div className="max-h-[88vh] w-full max-w-[520px] overflow-y-auto rounded-2xl bg-white px-4 py-5 shadow-xl sm:px-6 md:px-7 md:py-6">
        <h2 className="text-center text-lg font-semibold text-[#231F20] md:text-xl">
          Rate your experience with {providerName || "your provider"}
        </h2>

        <div className="mt-3">
          <div className="flex justify-center gap-2 sm:gap-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => {
                  setScore(star);
                  if (errors.score)
                    setErrors((prev) => ({ ...prev, score: null }));
                }}
                onMouseEnter={() => setHovered(star)}
                onMouseLeave={() => setHovered(0)}
                aria-label={`Rate ${star} star${star === 1 ? "" : "s"}`}
              >
                <Star
                  strokeWidth={1.6}
                  className={`h-7 w-7 transition-colors sm:h-8 sm:w-8 md:h-9 md:w-9 ${
                    star <= (hovered || score)
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-transparent text-[#BDBDBD]"
                  }`}
                />
              </button>
            ))}
          </div>
          {errors.score && (
            <p className="mt-2 text-center text-xs text-red-500">
              {errors.score}
            </p>
          )}
        </div>

        <div className="mt-4 md:mt-5">
          <label className="block text-sm font-normal text-[#231F20] md:text-lg">
            Tell us how it went{" "}
            <span className="text-[#231F2080]">(optional)</span>
          </label>
          <textarea
            rows={4}
            placeholder="Share your experience"
            value={review}
            onChange={(event) => setReview(event.target.value)}
            className="mt-2 h-16 w-full resize-none rounded-xl border border-[#231F2026] bg-[#FAFAFA] px-4 py-3 text-sm text-[#231F20] outline-none transition placeholder:text-[#231F2040] focus:border-[#34805A] md:h-20"
          />
        </div>

        <div className="mt-4 md:mt-5">
          <label
            className={`block text-sm font-normal md:text-lg ${
              isTipDisabled ? "text-gray-400" : "text-[#231F20]"
            }`}
          >
            Add a Tip <span className="text-[#231F2080]">(optional)</span>
          </label>
          <div
            className={`mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4 md:gap-3 ${
              isTipDisabled ? "opacity-50" : ""
            }`}
          >
            {tipOptions.map((amount) => (
              <button
                key={amount}
                type="button"
                disabled={isTipDisabled}
                aria-pressed={Number(tipAmount) === amount}
                onClick={() => {
                  setTipAmount((current) =>
                    Number(current) === amount ? "" : String(amount),
                  );
                  if (errors.tipAmount)
                    setErrors((prev) => ({ ...prev, tipAmount: null }));
                }}
                className={`h-10 rounded-xl text-sm transition-colors disabled:cursor-not-allowed md:h-11 ${
                  Number(tipAmount) === amount
                    ? "bg-[#635BFF] text-white"
                    : "bg-[#F5F5F5] text-[#231F20]"
                }`}
              >
                ₦{amount.toLocaleString("en-NG")}
              </button>
            ))}
            <button
              type="button"
              disabled={isTipDisabled}
              onClick={() => setTipAmount("")}
              className="h-10 rounded-xl bg-[#F5F5F5] text-sm text-[#231F20] transition-colors disabled:cursor-not-allowed md:h-11"
            >
              Custom
            </button>
          </div>
          {isTipDisabled && !walletLoading ? (
            <p className="mt-2 text-xs text-red-400">
              {walletError
                ? "Could not load balance - tip unavailable"
                : "Insufficient wallet balance to add a tip"}
            </p>
          ) : null}
          {errors.tipAmount && (
            <p className="mt-1 text-xs text-red-500">{errors.tipAmount}</p>
          )}
        </div>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row md:mt-5 md:gap-4">
          <button
            type="button"
            onClick={() => setPaymentMethod("wallet")}
            className={`flex h-10 w-full items-center justify-center gap-2 rounded-xl text-sm transition-colors sm:w-[132px] md:h-11 ${
              paymentMethod === "wallet"
                ? "bg-[#635BFF] text-white"
                : "bg-[#F5F5F5] text-[#231F20]"
            }`}
          >
            <Wallet size={18} />
            Wallet
          </button>
          <button
            type="button"
            onClick={() => setPaymentMethod("card")}
            className={`flex h-10 w-full items-center justify-center gap-2 rounded-xl text-sm transition-colors sm:w-[132px] md:h-11 ${
              paymentMethod === "card"
                ? "bg-[#635BFF] text-white"
                : "bg-[#F5F5F5] text-[#231F20]"
            }`}
          >
            <CreditCard size={18} />
            Card
          </button>
        </div>

        {apiError && (
          <div className="mt-6 rounded-lg border border-red-100 bg-red-50 p-3 text-xs text-red-600">
            {apiError}
          </div>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="mt-5 flex h-11 w-full items-center justify-center rounded-xl bg-[#34805A] text-base font-semibold text-white transition-colors hover:bg-[#2b6c4b] disabled:cursor-not-allowed disabled:opacity-50 md:mt-6 md:h-12"
        >
          {loading ? "Submitting..." : "Done"}
        </button>
      </div>
    </div>
  );
}
