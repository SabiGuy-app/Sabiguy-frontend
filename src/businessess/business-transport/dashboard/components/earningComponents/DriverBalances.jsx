import { DotIcon } from "lucide-react";
import { driverBalances } from "../../data/mockEarnings";
import { formatNaira } from "../../utils/format";
import ConfirmPayoutModal from "./ConfirmPayoutModal";
import { useState } from "react";

const DriverBalances = () => {
  const payoutAvailable = driverBalances.filter(
    (data) => data.payoutAvailable === true,
  ).length;

  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="w-full border-[0.5px] border-[#231F201A] rounded-xl py-5">
      <div className="flex justify-between items-center px-4 py-3">
        <div>
          <h3 className="font-semibold text-[#231F20]">Driver Balances</h3>
          <p className="text-sm text-[#231F20BF]">
            Tap a driver for their statement
          </p>
        </div>
        <button className="w-full max-w-[117px] bg-[#005823CC] text-white py-2.5 px-4 text-sm font-semibold rounded-md cursor-pointer">
          Pay all ({payoutAvailable})
        </button>
      </div>

      <div className="w-full relative">
        {driverBalances.map((data) => (
          <div
            key={data.id}
            className="border-t-[0.3px] border-[#231F2026] py-3 flex justify-between items-center px-4"
          >
            <div className="flex items-center gap-2">
              <img
                className="w-9 h-9 rounded-full"
                src={data.img}
                alt={data.name}
              />
              <div>
                <h4 className="font-semibold text-xs">{data.name}</h4>
                {data.payoutAvailable === true ? (
                  <p className="flex justify-center items-center text-[#231F20BF] text-xs">
                    {data.bank} {data.accountNumber} • earns {data.earningsPercentage}%
                  </p>
                ) : (
                  <p className="flex justify-center items-center text-[#E90000] text-xs">
                    No payout destination • earns {data.earningsPercentage}%
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-3 items-center max-sm:flex-col">
              <div className="text-end">
                <p className="text-[#E90000] text-sm font-semibold">
                  {formatNaira(data.balance)}
                </p>
                <p className="text-[#231F2080] text-xs">unpaid balance</p>
              </div>

              <button
                onClick={() => setShowConfirm(true)}
                className={`flex justify-center items-center text-sm font-semibold py-2.5 px-4 ${data.payoutAvailable === true ? "text-white bg-[#005823CC] cursor-pointer" : "text-[#231F204D] bg-[#231F200D] cursor-not-allowed"} rounded-md`}
              >
                {data.payoutAvailable === true
                  ? "Pay now"
                  : "No payout destination"}
              </button>
            </div>
          </div>
        ))}
        <div className="w-full flex justify-center items-center">
          <ConfirmPayoutModal
            isOpen={showConfirm}
            setIsOpen={setShowConfirm}
            onConfirm={() => {
              setShowConfirm(false);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default DriverBalances;
