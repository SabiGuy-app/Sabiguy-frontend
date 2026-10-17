import { useState } from "react";
import SettingsCard, { SettingsRow } from "./SettingsCard";
import EditFieldsModal from "./EditFieldsModal";
import SettingsBadge from "./SettingsBadge";
import { mockPayoutAccount } from "../data/mockSettings";

const FIELDS = [
  { key: "account", label: "Account" },
  { key: "bank", label: "Bank" },
  { key: "taxId", label: "Tax ID (TIN)" },
];

export default function PayoutAccountCard() {
  const [account, setAccount] = useState(mockPayoutAccount);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <>
      <SettingsCard title="Company payout account" onEdit={() => setIsEditing(true)}>
        <SettingsRow label="Account" value={account.account} />
        <SettingsRow label="Bank" value={account.bank} />
        <SettingsRow label="Tax ID (TIN)" value={account.taxId} />
        <SettingsRow
          label="Verification"
          valueNode={<SettingsBadge tone="green">{account.verification}</SettingsBadge>}
        />
      </SettingsCard>

      <EditFieldsModal
        isOpen={isEditing}
        title="Edit company payout account"
        fields={FIELDS}
        values={account}
        onClose={() => setIsEditing(false)}
        onSave={(values) => {
          setAccount((current) => ({ ...current, ...values }));
          setIsEditing(false);
        }}
      />
    </>
  );
}
