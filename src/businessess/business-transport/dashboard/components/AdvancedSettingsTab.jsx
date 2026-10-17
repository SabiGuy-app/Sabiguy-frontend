import { FilePenLine } from "lucide-react";
import SettingsCard from "./SettingsCard";
import { mockAuditLog } from "../data/mockSettings";

export default function AdvancedSettingsTab() {
  return (
    <div>
      <SettingsCard
        title="Audit log"
        headerRight={<span className="text-xs text-[#918E8F]">who changed what</span>}
      >
        <div className="-mx-5 divide-y divide-[#EFEDED] sm:-mx-6">
          {mockAuditLog.map((entry) => (
            <div key={entry.id} className="flex items-start gap-3 px-5 py-3 sm:px-6">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#F0F2F1] text-[#5F5C5D]">
                <FilePenLine size={14} />
              </span>
              <div className="min-w-0">
                <p className="text-sm text-[#231F20]">{entry.description}</p>
                <p className="mt-0.5 text-xs text-[#918E8F]">
                  {entry.actor} · {entry.when}
                </p>
              </div>
            </div>
          ))}
        </div>
      </SettingsCard>
    </div>
  );
}
