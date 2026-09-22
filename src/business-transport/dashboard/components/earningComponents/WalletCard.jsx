import { Wallet, Plus, ArrowUpRight } from "lucide-react";
import { walletData } from "../../data/mockEarnings";
import { formatNaira } from "../../utils/format";
import TopUpModal from "./TopUpModal";
import WithdrawModal from "./WithdrawModal";
import { useState } from "react";

const WalletCard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);

  return (
    <div className="w-full rounded-xl border-[0.4px] px-4 py-5 border-[#231F201A] flex flex-col gap-3">
      <h3 className="font-semibold text-[#231F20]">Wallet</h3>

      <div className="border-[0.5px] border-[#231F2026] rounded-lg  p-5 flex flex-col gap-2.5">
        <div className="flex justify-between">
          <div>
            <h4 className="uppercase text-[#231F20BF] text-[14px] font-normal">
              Company Wallet
            </h4>

            <p className="font-bold text-[26px] text-[#231F20E5]">
              {formatNaira(walletData.companyWallet)}
            </p>
          </div>

          <div className="w-6 h-6 flex justify-center items-center rounded-sm bg-[#231F200D] ">
            <Wallet className="text-[#231F20] size-4" />
          </div>
        </div>

        <div className="flex justify-center gap-3 items-center text-white cursor-pointer">
          <button
            onClick={() => setIsOpen(true)}
            className="w-full flex justify-center items-center font-semibold text-[14px] bg-[#005823CC] rounded-lg p-2.5 cursor-pointer"
          >
            <Plus className="size-5" /> Top up
          </button>
          <TopUpModal isOpen={isOpen} setIsOpen={setIsOpen} />
          <button
            onClick={() => setShowWithdraw(true)}
            className="w-full flex justify-center items-center font-semibold text-[14px] text-[#005823CC] border border-[#00582380] rounded-lg p-2.5 cursor-pointer"
          >
            <ArrowUpRight className="size-5" /> Withdraw
          </button>
          <WithdrawModal isOpen={showWithdraw} setIsOpen={setShowWithdraw} />
        </div>
      </div>

      <div className="flex justify-center items-center gap-5">
        <div className="w-full rounded-lg border-[0.5px] border-[#231F2026] p-2.5 flex flex-col gap-1.5 bg-[#231F2005]">
          <p className="uppercase text-[#231F20BF] text-[10px] min-sm:text-sm">
            Owed to drivers
          </p>

          <p className="text-[#E90000] font-bold text-[22px]">
            {formatNaira(walletData.owedToDrivers)}
          </p>
        </div>
        <div className="w-full bg-[#231F2005] rounded-lg border-[0.5px] border-[#231F2026] p-2.5 flex flex-col gap-1.5">
          <p className="uppercase text-[#231F20BF] text-[10px] min-sm:text-sm">
            Processing
          </p>

          <p className="text-[#7C3AED] font-bold text-[22px]">
            {formatNaira(walletData.processing)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WalletCard;
