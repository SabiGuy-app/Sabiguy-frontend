import { Check, Plus } from "lucide-react";

export default function SelectionChip({ children, selected, showIcon = true, ...props }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={`inline-flex items-center justify-center gap-1 rounded-full border ${showIcon ? "px-4 py-1" : "px-3 py-0.5"} text-sm leading-5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#005823] disabled:opacity-50 ${
        selected
          ? "border-[#005823BF] bg-[#005823BF] text-white"
          : "border-[#231F2026] bg-white text-[#231F20BF] hover:border-[#005823]"
      }`}
      {...props}
    >
      {showIcon && (selected ? <Check size={14} /> : <Plus size={14} />)}
      {children}
    </button>
  );
}
