import { ArrowRight } from "lucide-react";
import { reconciliationData } from "../../data/mockEarnings";
import { formatNaira } from "../../utils/format";

const Reconciliation = () => {
  return (
    <div className="w-full border-[0.4px] border-[#231F201A] rounded-xl py-5 px-4 flex flex-col gap-3">
      <h3 className="font-semibold text-[#231F20]">Reconciliation</h3>

      <div className="flex flex-col gap-3 text-sm">
        <div className="border-b-[0.5px] border-[#00000026] pb-4">
          <div className="flex justify-between w-full">
            <p className="text-[#231F20BF]">Sum of driver balances</p>
            <p className="font-semibold text-[#231F20]">
              {formatNaira(reconciliationData.sumOfDriverBalances)}
            </p>
          </div>
          <div className="flex justify-between w-full">
            <p className="text-[#231F20BF]">+ In processing</p>
            <p className="font-semibold text-[#231F20]">
              {formatNaira(reconciliationData.processing)}
            </p>
          </div>
        </div>
        <div className="border-b-[0.5px] border-[#00000026] pb-4">
          <div className="flex justify-between w-full">
            <p className="text-[#231F20BF]">Total liability to drivers</p>
            <p className="font-semibold text-[#E90000]">
              {formatNaira(reconciliationData.totalLiabilityToDrivers)}
            </p>
          </div>
          <div className="flex justify-between w-full">
            <p className="text-[#231F20BF]">Company wallet balance</p>
            <p className="font-semibold text-[#33794F]">
              {formatNaira(reconciliationData.companyWalletBalance)}
            </p>
          </div>
        </div>
        <div className="flex justify-between w-full">
          <p className="text-[#231F20] font-semibold">
            Company funds (yours to withdraw)
          </p>
          <p className="font-semibold text-[#33794F]">
            {formatNaira(reconciliationData.companyFundsAvailableToWithdraw)}
          </p>
        </div>
      </div>
      <button className="flex justify-center gap-3 items-center text-white bg-[#33794F] font-semibold rounded-md py-2.5 px-4 cursor-pointer">
        Withdraw <ArrowRight className="size-4" />
      </button>
    </div>
  );
};

export default Reconciliation;
