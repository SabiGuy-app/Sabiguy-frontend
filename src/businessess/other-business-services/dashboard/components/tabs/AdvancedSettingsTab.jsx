import { FilePenLine } from "lucide-react";
import SettingsTabCard from "./SettingsTabCard";

const auditEntries = [
  {
    id: 1,
    action: "Changed default income split to 63/27/10 (%)",
    actor: "Adewale Okonkwo",
    when: "Today · 9:02 AM",
  },
  {
    id: 2,
    action: "Reinstated staff member Emeka Obi",
    actor: "Bisi Adeyemi",
    when: "Yesterday · 4:30 PM",
  },
  {
    id: 3,
    action: "Set Standard salon policy as active",
    actor: "Adewale Okonkwo",
    when: "Jun 9 · 11:15 AM",
  },
];

export default function AdvancedSettingsTab() {
  return (
    <div className="py-1">
      <SettingsTabCard
        title="Audit log"
        headerRight={
          <span className="text-[9px] text-[#777777]">who changed what</span>
        }
      >
        <div>
          {auditEntries.map((entry) => (
            <div key={entry.id} className="flex items-start gap-2.5 py-1.5">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center text-[#222222]">
                <FilePenLine size={16} />
              </span>
              <div>
                <p className="text-[10px] font-medium text-[#333333]">
                  {entry.action}
                </p>
                <p className="mt-0.5 text-[9px] text-[#999999]">
                  {entry.actor} · {entry.when}
                </p>
              </div>
            </div>
          ))}
        </div>
      </SettingsTabCard>

      <section className="mx-2 my-4 rounded-lg border border-[#FF7777] bg-white sm:mx-3">
        <header className="border-b border-[#F0E4E4] px-3.5 py-3.5 sm:px-4">
          <h2 className="text-sm font-medium text-red-600">Danger zone</h2>
        </header>
        <div className="divide-y divide-[#EEEEEE] px-3.5 sm:px-4">
          <div className="flex items-center justify-between gap-4 py-3">
            <div>
              <p className="text-[10px] font-medium text-[#333333]">
                Export all data
              </p>
              <p className="mt-0.5 text-[9px] text-[#999999]">
                Download staff, services and business records as a backup
              </p>
            </div>
            <button
              type="button"
              className="h-9 shrink-0 rounded-md border border-[#BFD8C7] px-3 text-xs font-medium text-[#347B54] hover:bg-[#F3F8F4]"
            >
              Export
            </button>
          </div>
          <div className="flex items-center justify-between gap-4 py-3">
            <div>
              <p className="text-[10px] font-medium text-red-600">
                Close business account
              </p>
              <p className="mt-0.5 text-[9px] text-[#999999]">
                Permanently closes your business and removes access
              </p>
            </div>
            <button
              type="button"
              className="h-9 shrink-0 rounded-md bg-red-600 px-3 text-xs font-medium text-white hover:bg-red-700"
            >
              Close account
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
