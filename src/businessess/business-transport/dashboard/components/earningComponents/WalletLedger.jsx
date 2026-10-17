import { walletLedger } from "../../data/mockEarnings";
import { formatNaira } from "../../utils/format";

const WalletLedger = () => {
  return (
    <div className="w-full flex flex-col gap-5 rounded-xl border-[0.39px] border-[#231F201A] py-5">
      <h3 className="font-semibold text-[#231F20] px-4">
        Company wallet ledger — newest first
      </h3>

      <div className="">
        {walletLedger.map((data) => (
          <div key={data.id} className="w-full h-full flex justify-between items-center border-t-[0.3px] border-[#231F2026] py-2.5 px-4">
            <div className="flex items-center text-[12px]  gap-2">
              <img src={data.icon} className="w-4 h-4" alt={data.id} />
              <div className="flex flex-col gap-0.5 ">
                <h3 className="flex items-center text-[#231F20] font-semibold">
                  {data.type}{" "}
                  {data.method
                    ? `(${data.method}) — ${data.name} → ${data.driverTo}`
                    : `to ${data.name}`}
                </h3>
                <p className="text-[#231F20BF] ">
                  {data.reference} • {data.time}
                </p>
              </div>
            </div>
            <div className="text-end">
              <p className={`text-sm font-bold ${data.direction  === "in" ? "text-[#33794F]" : "text-[#E90000]"}`}>
                {data.direction === "in" && "+"}
                {data.direction === "out" && "–"}{formatNaira(data.amount)}
              </p>
              <p className="text-[#231F2080]">bal {formatNaira(data.balanceAfter)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WalletLedger;
