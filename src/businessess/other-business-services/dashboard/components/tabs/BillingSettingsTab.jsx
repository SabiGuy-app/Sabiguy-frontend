const initialInvoices = [
  { id: "invoice-may", period: "May 2026", amount: "₦28,400", status: "Paid" },
  { id: "invoice-apr", period: "Apr 2026", amount: "₦24,100", status: "Paid" },
  { id: "invoice-mar", period: "Mar 2026", amount: "₦19,800", status: "Paid" },
];

export default function BillingSettingsTab() {
  return (
    <div className="py-1">
      <section className="mx-2 my-2 overflow-hidden rounded-lg border border-[#E9E9E9] bg-white sm:mx-3">
        <header className="flex items-center justify-between gap-4 border-b border-[#E9E9E9] px-4 py-4">
          <h2 className="text-sm font-semibold text-[#242424]">
            Plan &amp; billing
          </h2>
          <span className="rounded-full border border-[#B8DEC2] bg-[#F0FAF2] px-2 py-0.5 text-[10px] font-semibold text-[#16A34A]">
            Growth plan
          </span>
        </header>
        <div className="px-4 pt-4">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between gap-4 text-xs">
              <span className="text-[#656565]">Platform fee</span>
              <span className="font-medium text-[#242424]">10% of fares</span>
            </div>
            <div className="flex items-center justify-between gap-4 text-xs">
              <span className="text-[#656565]">
                Platform fee owed this period
              </span>
              <span className="font-semibold text-[#347B54]">₦2,377</span>
            </div>
          </div>

          <h3 className="mb-1 mt-5 text-[9px] font-semibold uppercase tracking-wide text-[#929292]">
            Recent invoices
          </h3>
          <div className="divide-y divide-[#EAEAEA]">
            {initialInvoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex min-h-9.5 items-center justify-between gap-3 py-2 text-xs"
              >
                <span className="text-[#656565]">{invoice.period}</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[#347B54]">
                    {invoice.amount}
                  </span>
                  <span className="rounded-full border border-[#B8DEC2] bg-[#F0FAF2] px-2 py-0.5 text-[10px] text-[#16A34A]">
                    {invoice.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="h-2" />
      </section>
    </div>
  );
}
