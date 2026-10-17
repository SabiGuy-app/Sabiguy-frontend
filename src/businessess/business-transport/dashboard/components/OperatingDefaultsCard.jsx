import { useState } from "react";
import SettingsCard, { SettingsRow } from "./SettingsCard";
import EditFieldsModal from "./EditFieldsModal";
import { mockOperatingDefaults } from "../data/mockSettings";

const FIELDS = [
  { key: "city", label: "City" },
  { key: "currency", label: "Currency" },
  { key: "timezone", label: "Timezone" },
  { key: "weekStarts", label: "Week starts" },
];

export default function OperatingDefaultsCard() {
  const [defaults, setDefaults] = useState(mockOperatingDefaults);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <>
      <SettingsCard title="Operating defaults" onEdit={() => setIsEditing(true)}>
        <SettingsRow label="City" value={defaults.city} />
        <SettingsRow label="Currency" value={defaults.currency} />
        <SettingsRow label="Timezone" value={defaults.timezone} />
        <SettingsRow label="Week starts" value={defaults.weekStarts} />
      </SettingsCard>

      <EditFieldsModal
        isOpen={isEditing}
        title="Edit operating defaults"
        fields={FIELDS}
        values={defaults}
        onClose={() => setIsEditing(false)}
        onSave={(values) => {
          setDefaults((current) => ({ ...current, ...values }));
          setIsEditing(false);
        }}
      />
    </>
  );
}
