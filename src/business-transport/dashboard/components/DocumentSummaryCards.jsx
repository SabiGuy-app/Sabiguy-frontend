const CARDS = [
  { key: "active", label: "Active", valueClass: "text-[#2F8A54]" },
  { key: "expiring", label: "Expiring soon", valueClass: "text-[#231F20]" },
  { key: "expired", label: "Expired", valueClass: "text-[#231F20]" },
  { key: "review", label: "In review", valueClass: "text-[#231F20]" },
];

export default function DocumentSummaryCards({ counts }) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {CARDS.map((card) => (
        <article key={card.key} className="rounded-xl border border-[#E1DEDF] bg-white p-4 sm:p-5">
          <p className="text-[11px] font-semibold uppercase text-[#656263]">{card.label}</p>
          <p className={`mt-3 text-3xl font-medium ${card.valueClass}`}>{counts[card.key] || 0}</p>
        </article>
      ))}
    </div>
  );
}
