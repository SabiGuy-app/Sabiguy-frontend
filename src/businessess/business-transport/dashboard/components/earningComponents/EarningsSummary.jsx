import { earningsSummary } from "../../data/mockEarnings";
import { formatNaira } from "../../utils/format";

const EarningsSummary = () => {
  return (
    <div className="bg-linear-30 flex justify-between from-[#05642B] to-[#0F9444] py-5 px-6 rounded-xl text-white mb-6">
      <div>
        <h3 className="text-xs">Gross earnings · {earningsSummary.period}</h3>
        <h1 className="font-bold text-[44px] sm:text-2xl">
          {formatNaira(earningsSummary.grossEarnings)}
        </h1>
      </div>
      <div className="font-normal text-xs text-right">
        {earningsSummary.trips} trips · {earningsSummary.cancelledTrips}{" "}
        cancelled · avg {formatNaira(earningsSummary.averagePerTrip)}/trip
      </div>
    </div>
  );
};

export default EarningsSummary;
