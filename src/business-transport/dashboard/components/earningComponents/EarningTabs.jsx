import { walletStats } from "../../data/mockEarnings";
import { formatNaira } from "../../utils/format";

const EarningTabs = () => {
  return (
    <div className="w-full border-[0.4px] border-[#231F201A] rounded-xl py-5 px-4 grid grid-cols-2 gap-4">
      {walletStats.map((data) => {
        return (
          <div key={data.label} className="w-full h-[116px] flex flex-col gap-3 bg-[#231F2005] border-[0.5px] border-[#231F2026] p-2.5 rounded-lg">
            <p className="text-[#231F20BF] text-sm uppercase">{data.label}</p>
            <p
              className={`text-[28px] font-bold ${
                data.type === "income" || data.type === "balance"
                  ? "text-[#33794F]"
                  : data.type === "outgoing"
                    ? "text-[#E90000]"
                    : ""
              }
`}
            >
              {data.type === "income" && "+"}
              {data.type === "outgoing" && "-"}
              {data.amount !== undefined
                ? `${formatNaira(data.amount)}`
                : data.number}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default EarningTabs;
