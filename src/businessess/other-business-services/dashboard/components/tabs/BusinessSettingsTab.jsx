import { useState } from "react";
import SettingsTabCard, {
  EditableSettingsSection,
  SettingsEditDialog,
  SettingsRow,
} from "./SettingsTabCard";

const INITIAL_PAYOUT = {
  account: "GTBank ****6789",
  bank: "GTBank",
  taxId: "12345678-0001",
  verification: "Verified",
};

export default function BusinessSettingsTab({ business, loading, error }) {
  const [payout, setPayout] = useState(INITIAL_PAYOUT);
  const [payoutOpen, setPayoutOpen] = useState(false);
  const [automaticPayouts, setAutomaticPayouts] = useState(true);
  const [threshold, setThreshold] = useState("5000");
  const [scheduleOpen, setScheduleOpen] = useState(false);

  if (loading) {
    return (
      <div className="space-y-4 p-4 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-xl border border-[#E9E9E9] bg-white p-4"
          >
            <div className="h-4 w-32 bg-gray-200 rounded mb-4" />
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="h-3 w-24 bg-gray-100 rounded" />
                <div className="h-3 w-40 bg-gray-100 rounded" />
              </div>
              <div className="flex justify-between items-center">
                <div className="h-3 w-20 bg-gray-100 rounded" />
                <div className="h-3 w-28 bg-gray-100 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="m-4 rounded-lg border border-red-200 bg-red-50 p-4 text-xs text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="py-1">
      <EditableSettingsSection
        title="Business profile"
        initialValues={{
          businessName: business?.BusinessName || "__",
          owner: business?.fullName || "__",
          city: business?.cityOfOperation || "__",
          address: business?.BusinessAddress || "__",
        }}
        fields={[
          { key: "businessName", label: "Business name" },
          { key: "owner", label: "Owner" },
          { key: "city", label: "City" },
          { key: "address", label: "Business address" },
        ]}
        rows={[
          { key: "businessName", label: "Business name" },
          { key: "owner", label: "Owner" },
          { key: "city", label: "City" },
          { key: "address", label: "Business address" },
        ]}
      />
      <EditableSettingsSection
        title="Operating defaults"
        initialValues={{
          city: business?.cityOfOperation || "__",
          currency: business?.currency || "__",
          timezone: business?.timezone || "__",
          weekStarts: business?.weekStarts || "__",
        }}
        fields={[
          { key: "city", label: "City" },
          {
            key: "currency",
            label: "Currency",
            type: "select",
            options: ["NGN (₦)", "USD ($)", "GBP (£)"],
          },
          {
            key: "timezone",
            label: "Timezone",
            type: "select",
            options: ["WAT (GMT+1)", "UTC (GMT+0)"],
          },
          {
            key: "weekStarts",
            label: "Week starts",
            type: "select",
            options: ["Monday", "Sunday"],
          },
        ]}
        rows={[
          { key: "city", label: "City" },
          { key: "currency", label: "Currency" },
          { key: "timezone", label: "Timezone" },
          { key: "weekStarts", label: "Week starts" },
        ]}
      />

      <SettingsTabCard
        title="Company payout account"
        onEdit={() => setPayoutOpen(true)}
      >
        <SettingsRow label="Account" value={payout.account} />
        <SettingsRow label="Bank" value={payout.bank} />
        <SettingsRow label="Tax ID (TIN)" value={payout.taxId} />
        <SettingsRow
          label="Verification"
          valueNode={
            <span className="rounded-full border border-[#B8DEC2] bg-[#F0FAF2] px-2 py-0.5 text-[9px] font-medium text-[#347B54]">
              {payout.verification}
            </span>
          }
        />
      </SettingsTabCard>
      <SettingsEditDialog
        isOpen={payoutOpen}
        title="Edit company payout account"
        fields={[
          { key: "account", label: "Account" },
          { key: "bank", label: "Bank" },
          { key: "taxId", label: "Tax ID (TIN)" },
        ]}
        values={payout}
        onClose={() => setPayoutOpen(false)}
        onSave={(values) => {
          setPayout((current) => ({ ...current, ...values }));
          setPayoutOpen(false);
        }}
      />

      <SettingsTabCard
        title="Default payout schedule"
        onEdit={() => setScheduleOpen(true)}
      >
        <SettingsRow
          label="Automatic payouts"
          note="Runs every Friday"
          valueNode={
            <button
              type="button"
              role="switch"
              aria-checked={automaticPayouts}
              aria-label="Toggle automatic payouts"
              onClick={() => setAutomaticPayouts((current) => !current)}
              className={`relative h-5 w-10 shrink-0 rounded-full transition-colors ${automaticPayouts ? "bg-[#347B54]" : "bg-[#D4D4D4]"}`}
            >
              <span
                className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${automaticPayouts ? "translate-x-5" : "translate-x-0"}`}
              />
            </button>
          }
        />
        <SettingsRow
          label="Minimum payout threshold"
          value={`₦${Number(threshold).toLocaleString("en-NG")}`}
          note="Balances below the threshold roll over to the next run."
        />
      </SettingsTabCard>
      <SettingsEditDialog
        isOpen={scheduleOpen}
        title="Edit default payout schedule"
        fields={[
          {
            key: "threshold",
            label: "Minimum payout threshold (₦)",
            type: "number",
          },
        ]}
        values={{ threshold }}
        onClose={() => setScheduleOpen(false)}
        onSave={(values) => {
          setThreshold(values.threshold);
          setScheduleOpen(false);
        }}
      />
    </div>
  );
}
