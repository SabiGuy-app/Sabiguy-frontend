import { useState } from "react";
import SettingsCard, { SettingsRow } from "./SettingsCard";
import EditFieldsModal from "./EditFieldsModal";
import { mockBusinessProfile } from "../data/mockSettings";

const FIELDS = [
  { key: "businessName", label: "Business name" },
  { key: "owner", label: "Owner" },
  { key: "city", label: "City" },
];

export default function BusinessProfileCard() {
  const [profile, setProfile] = useState(mockBusinessProfile);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <>
      <SettingsCard title="Business profile" onEdit={() => setIsEditing(true)}>
        <SettingsRow label="Business name" value={profile.businessName} />
        <SettingsRow label="Owner" value={profile.owner} />
        <SettingsRow label="City" value={profile.city} />
      </SettingsCard>

      <EditFieldsModal
        isOpen={isEditing}
        title="Edit business profile"
        fields={FIELDS}
        values={profile}
        onClose={() => setIsEditing(false)}
        onSave={(values) => {
          setProfile((current) => ({ ...current, ...values }));
          setIsEditing(false);
        }}
      />
    </>
  );
}
