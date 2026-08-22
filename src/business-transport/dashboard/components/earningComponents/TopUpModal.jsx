import { X } from "lucide-react";
import { useState } from "react";

const TopUpModal = ({ isOpen, setIsOpen, onConfirm }) => {
  const [amount, setAmount] = useState("");

  if (!isOpen) return null;

  const handleAmount = (e) => {
    setAmount(e.target.value);
  };

  const handleTopUp = () => {
    if (!amount || Number(amount) <= 0) return;
    onConfirm?.(Number(amount));
    setAmount("");
    setIsOpen(false);
  };

  return (
    <div
      className="fixed inset-0 bg-black/20 flex justify-center items-center z-50 px-4"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="w-full max-w-[520px] bg-white rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center px-6 py-5 border-b border-[#231F2020]">
          <h2 className="text-2xl font-bold text-[#231F20]">Top up wallet</h2>
          <button onClick={() => setIsOpen(false)}>
            <X className="size-5 text-[#231F20]" />
          </button>
        </div>

        <div className="px-6 py-8 flex flex-col gap-3">
          <p className="text-base text-[#231F20]">Top-up Amount</p>

          <div className="flex items-stretch border border-[#231F2040] rounded-lg overflow-hidden">
            <span className="w-[52px] flex items-center justify-center bg-[#D9D9D9] text-[#231F20BF]">
              ₦
            </span>
            <input
              type="number"
              value={amount}
              onChange={handleAmount}
              placeholder="Enter Amount"
              className="w-full px-4 py-3.5 outline-none text-sm text-[#231F20] placeholder:text-[#231F20BF] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        </div>

        <div className="px-6 pb-6">
          <button
            onClick={handleTopUp}
            disabled={!amount || Number(amount) <= 0}
            className="w-full bg-[#005823] text-white font-semibold text-base rounded-lg py-3.5 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#00461c] transition-colors"
          >
            Top-up
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopUpModal;