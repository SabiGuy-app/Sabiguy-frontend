import { formatNaira } from "../../utils/format";
import { useEffect, useState } from "react";
import { getWalletTransactions } from "../../../../../api/provider";

const WalletLedger = ({ limit = 10 }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewAll, setViewAll] = useState(false);
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    let active = true;
    const pageSize = viewAll ? 10 : 5;
    const requestedPage = viewAll ? page : 1;
    setLoading(true);
    getWalletTransactions(requestedPage, pageSize, filter)
      .then((response) => {
        if (!active) return;
        const nestedData = response?.data?.data || response?.data;
        const data = Array.isArray(nestedData)
          ? nestedData
          : Array.isArray(response?.transactions)
            ? response.transactions
            : Array.isArray(response)
              ? response
              : [];
        setTransactions(data);
        const pages = response?.pagination?.pages
          || response?.data?.pagination?.pages
          || response?.meta?.pages
          || response?.data?.meta?.pages
          || 1;
        setTotalPages(Math.max(1, Number(pages) || 1));
      })
      .catch(() => { if (active) setTransactions([]); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [viewAll, filter, page, limit]);

  const showViewAll = () => {
    setPage(1);
    setViewAll(true);
  };

  return (
    <div className="w-full flex flex-col gap-5 rounded-xl border-[0.39px] border-[#231F201A] py-5">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4">
        <h3 className="font-semibold text-[#231F20]">
          Company wallet ledger — newest first
        </h3>
        {viewAll ? (
          <button
            type="button"
            onClick={() => { setViewAll(false); setPage(1); }}
            className="text-sm font-medium text-[#005823] hover:underline"
          >
            Show recent
          </button>
        ) : null}
      </div>

      <div className="px-4">
        <label htmlFor="wallet-ledger-filter" className="mr-2 text-sm text-[#231F20BF]">
          Filter
        </label>
        <select
          id="wallet-ledger-filter"
          value={filter}
          onChange={(event) => { setPage(1); setFilter(event.target.value); }}
          className="rounded-lg border border-[#231F2026] bg-white px-3 py-2 text-sm text-[#231F20]"
        >
          <option value="">All transactions</option>
          <option value="credit">Credits</option>
          <option value="debit">Debits</option>
          <option value="escrow">Escrow</option>
          <option value="withdrawal">Withdrawals</option>
          <option value="refund">Refunds</option>
        </select>
      </div>

      <div className="">
        {loading && <p className="px-4 py-3 text-sm text-[#231F2080]">Loading transactions...</p>}
        {!loading && transactions.length === 0 && <p className="px-4 py-3 text-sm text-[#231F2080]">No transactions yet</p>}
        {!loading && transactions.slice(0, viewAll ? 10 : Math.min(limit, 5)).map((data) => (
          <div key={data._id || data.id} className="w-full h-full flex justify-between items-center border-t-[0.3px] border-[#231F2026] py-2.5 px-4">
            <div className="flex items-center text-[12px]  gap-2">
              <div className="flex flex-col gap-0.5 ">
                <h3 className="flex items-center text-[#231F20] font-semibold">
                  {data.description || data.type || "Wallet transaction"}
                </h3>
                <p className="text-[#231F20BF] ">
                  {data.reference || data.status || "Transaction"} • {data.createdAt ? new Date(data.createdAt).toLocaleString() : ""}
                </p>
              </div>
            </div>
            <div className="text-end">
              <p className={`text-sm font-bold ${["credit", "refund"].includes(String(data.type).toLowerCase()) ? "text-[#33794F]" : "text-[#E90000]"}`}>
                {["credit", "refund"].includes(String(data.type).toLowerCase()) ? "+" : ""}
                {formatNaira(Math.abs(Number(data.amount) || 0))}
              </p>
              {data.balanceAfter !== undefined && <p className="text-[#231F2080]">bal {formatNaira(data.balanceAfter)}</p>}
            </div>
          </div>
        ))}
      </div>

      {!loading && !viewAll && transactions.length > 0 ? (
        <div className="px-4">
          <button
            type="button"
            onClick={showViewAll}
            className="w-full rounded-lg border border-[#005823] px-4 py-2.5 text-sm font-medium text-[#005823] transition-colors hover:bg-[#005823] hover:text-white"
          >
            View all transactions
          </button>
        </div>
      ) : null}

      {!loading && viewAll && totalPages > 1 ? (
        <div className="flex items-center justify-between border-t border-[#231F201A] px-4 pt-4">
          <button
            type="button"
            disabled={page === 1}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            className="rounded-lg border border-[#231F2026] px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-sm text-[#231F2080]">
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            className="rounded-lg border border-[#231F2026] px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default WalletLedger;
