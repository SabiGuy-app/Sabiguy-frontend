import { AlertTriangle, Check, Clock3, MinusCircle } from "lucide-react";

const STATUS = {
  expired: {
    label: "Expired",
    row: "bg-[#FFF6F6]",
    badge: "bg-[#FFE3E3] text-[#D73535]",
    icon: <MinusCircle size={18} className="fill-[#F10C19] text-white" />,
  },
  expiring: {
    label: "Expiring",
    row: "bg-[#FFFBEA]",
    badge: "bg-[#FFE4E4] text-[#D73535]",
    icon: <AlertTriangle size={19} className="fill-[#FFAB00] text-[#FFAB00]" />,
  },
  review: {
    label: "In review",
    row: "bg-white",
    badge: "bg-[#FFF4D6] text-[#C58600]",
    icon: <Clock3 size={18} className="text-[#8E8A8B]" />,
  },
  active: {
    label: "Active",
    row: "bg-white",
    badge: "border border-[#BCE9C9] bg-[#E9F8ED] text-[#23914A]",
    icon: <Check size={18} className="text-[#2FB765]" />,
  },
};

export default function DocumentsList({ documents, onRenew, onApprove }) {
  if (documents.length === 0) {
    return <div className="rounded-xl border border-[#DDDADB] bg-white px-5 py-14 text-center text-sm text-[#777374]">No documents match this filter.</div>;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-[#DDDADB] bg-white">
      {documents.map((document) => {
        const status = STATUS[document.status] || STATUS.review;
        return (
          <article
            key={document.id}
            className={`flex flex-col gap-3 border-b border-[#E9E7E8] px-5 py-4 last:border-b-0 sm:flex-row sm:items-center ${status.row}`}
          >
            <div className="flex min-w-0 flex-1 items-start gap-3">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white/60">{status.icon}</span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[#353132]">
                  {document.title} <span className="font-normal text-[#5F5B5C]">· {document.owner}</span>
                </p>
                <p className={`mt-1 text-xs ${document.status === "expired" ? "text-[#D73535]" : "text-[#777374]"}`}>{document.detail}</p>
              </div>
            </div>
            <div className="flex shrink-0 items-center justify-end gap-3">
              <span className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${status.badge}`}>{status.label}</span>
              {(document.status === "expired" || document.status === "expiring") && (
                <button type="button" onClick={() => onRenew?.(document)} className="min-w-[76px] rounded-md border border-[#78B48F] bg-white px-3 py-2 text-xs font-semibold text-[#2F7D55] hover:bg-[#F3FAF5]">Renew</button>
              )}
              {document.status === "review" && (
                <button type="button" onClick={() => onApprove?.(document)} className="min-w-[76px] rounded-md border border-[#78B48F] bg-white px-3 py-2 text-xs font-semibold text-[#2F7D55] hover:bg-[#F3FAF5]">Approve</button>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
