import { formatNaira } from "../../utils/format";
import { useEffect, useState } from "react";
import { getWalletBalance } from "../../../../../api/provider";

const EarningsSummary = () => {
  const [grossEarnings, setGrossEarnings] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getWalletBalance({ bustCache: true })
      .then((response) => {
        if (!active) return;
        const data = response?.data?.data || response?.data || response || {};
        setGrossEarnings(
          data.available ??
          data.walletBalance?.available ??
          data.balance ??
          data.walletBalance?.balance ??
          0,
        );
      })
      .catch(() => {
        if (active) setGrossEarnings(0);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  return (
    <div className="bg-linear-30 flex justify-between from-[#05642B] to-[#0F9444] py-5 px-6 rounded-xl text-white mb-6">
      <div>
        <h3 className="text-xs">Gross earnings</h3>
        <h1 className="font-bold text-[44px] sm:text-2xl">
          {loading ? "Loading..." : formatNaira(grossEarnings)}
        </h1>
      </div>
    </div>
  );
};

export default EarningsSummary;
