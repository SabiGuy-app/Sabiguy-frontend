import SettingsCard, { SettingsRow } from "./SettingsCard";
import SettingsBadge from "./SettingsBadge";
import { formatNaira } from "../utils/format";
import { mockBilling } from "../data/mockSettings";

export default function BillingSettingsTab() {
  const { plan, platformFeeRate, platformFeeOwed, invoices } = mockBilling;

  return (
    <div>
      <SettingsCard title="Plan & billing" headerRight={<SettingsBadge tone="green">{plan}</SettingsBadge>}>
        <SettingsRow label="Platform fee" value={platformFeeRate} />
        <SettingsRow label="Platform fee owed this period" value={formatNaira(platformFeeOwed)} />

        <p className="pt-2 text-[11px] font-semibold uppercase tracking-wide text-[#918E8F]">
          Recent invoices
        </p>
        <div className="-mx-5 divide-y divide-[#EFEDED] sm:-mx-6">
          {invoices.map((invoice) => (
            <div key={invoice.id} className="flex items-center justify-between gap-4 px-5 py-3 sm:px-6">
              <p className="text-sm text-[#656263]">{invoice.period}</p>
              <div className="flex items-center gap-2.5">
                <p className="text-sm font-semibold text-[#231F20]">{formatNaira(invoice.amount)}</p>
                <SettingsBadge tone="green">{invoice.status}</SettingsBadge>
              </div>
            </div>
          ))}
        </div>
      </SettingsCard>
    </div>
  );
}
