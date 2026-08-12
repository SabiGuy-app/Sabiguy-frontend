import { X } from "lucide-react";
import { useState } from "react";
import { withdrawData, destinations } from "../../data/mockEarnings";
import { formatNaira } from "../../utils/format";

const WithdrawModal = ({ isOpen, setIsOpen, onConfirm }) => {
  const [amount, setAmount] = useState("");
  const [selectedDestination, setSelectedDestination] = useState("business");

  const available = withdrawData.availableToWithdraw;

  if (!isOpen) return null;

  const handleWithdrawAll = () => {
    setAmount(String(available));
  };

  const displayAmount = amount ? Number(amount) : available;

  const handleWithdraw = () => {
    if (displayAmount <= 0 || displayAmount > available) return;
    onConfirm?.(displayAmount, selectedDestination);
    setAmount("");
    setIsOpen(false);
  };

  return (
    <div
      className="fixed inset-0 bg-black/20 flex justify-center items-center z-50 px-4"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="w-full max-w-[520px] max-h-[90vh] overflow-y-auto bg-white rounded-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start">
          <h2 className="text-xl font-semibold text-[#231F20]">
            Withdraw to business account
          </h2>
          <button onClick={() => setIsOpen(false)}>
            <X className="size-5 text-[#231F20]" />
          </button>
        </div>

        <p className="text-sm text-[#231F20BF] mt-2">
          Move the company's earnings to GTBank ****6789. You can only withdraw
          funds that aren't owed to drivers.
        </p>

        <div className="bg-[#F5F5F5] rounded-xl p-4 mt-5 flex flex-col gap-2">
          <div className="flex justify-between text-sm">
            <span className="text-[#231F20BF]">Wallet Balance</span>
            <span className="font-semibold text-[#231F20] text-base">
              {formatNaira(withdrawData.walletBalance)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#231F20BF]">Owed to drivers (locked)</span>
            <span className="font-semibold text-[#E90000] text-base">
              −{formatNaira(withdrawData.owedToDrivers)}
            </span>
          </div>
          <hr className="border-[#231F2020] my-1" />
          <div className="flex justify-between text-sm">
            <span className="text-[#231F20BF]">Available to withdraw</span>
            <span className="font-semibold text-[#005823] text-base">
              {formatNaira(available)}
            </span>
          </div>
        </div>

        <div className="mt-5">
          <p className="font-semibold text-[#231F20BF] mb-2">Amount</p>
          <div className="flex border border-[#231F2040] rounded-lg">
            <span className="w-[45px] h-[45px] flex justify-center items-center text-[#231F20BF] rounded-bl-lg rounded-tl-lg p-3 ">₦</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="w-full outline-none text-sm text-[#231F20] placeholder:text-[#231F20BF] [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>

          <button
            onClick={handleWithdrawAll}
            className="mt-3 text-xs font-semibold text-[#33794F] border border-[#33794F] rounded-sm px-3 py-1.5 hover:bg-[#F0FDF4] cursor-pointer"
          >
            Withdraw all ({formatNaira(available)})
          </button>
        </div>

        <div className="mt-6">
          <p className="font-semibold text-[#231F20] mb-2">Destination</p>
          <div className="flex flex-col gap-3">
            {destinations.map((dest) => {
              const isSelected = selectedDestination === dest.id;

              return (
                <button
                  key={dest.id}
                  type="button"
                  onClick={() => setSelectedDestination(dest.id)}
                  className={`w-full flex items-center gap-3 rounded-lg border p-4 text-left transition-colors cursor-pointer ${
                    isSelected
                      ? "border-[#005823] bg-[#F0FDF4]"
                      : "border-[#231F2040] bg-white hover:border-[#231F2080]"
                  }`}
                >
                  <span
                    className={`flex items-center justify-center size-5 rounded-full border-2 shrink-0 ${
                      isSelected ? "border-[#005823]" : "border-[#231F2040]"
                    }`}
                  >
                    {isSelected && (
                      <span className="size-2.5 rounded-full bg-[#005823]" />
                    )}
                  </span>

                  <div className="flex flex-col">
                    <span className="font-semibold text-[#231F20]">
                      {dest.label}
                    </span>
                    <span className="text-xs text-[#231F20BF]">
                      {dest.subtitle}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={handleWithdraw}
          disabled={displayAmount <= 0 || displayAmount > available}
          className="w-full mt-6 bg-[#005823] text-white font-semibold text-sm rounded-lg py-3.5 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#00461c] transition-colors cursor-pointer"
        >
          Withdraw {formatNaira(displayAmount)}
        </button>
      </div>
    </div>
  );
};

export default WithdrawModal;
