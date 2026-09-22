import { useState } from "react";
import SettingsCard, { SettingsRow } from "./SettingsCard";
import EditFieldsModal from "./EditFieldsModal";
import ToggleSwitch from "./ToggleSwitch";
import { formatNaira } from "../utils/format";
import { mockPayoutSchedule } from "../data/mockSettings";

const FIELDS = [{ key: "minimumThreshold", label: "Minimum payout threshold (₦)", type: "number" }];

export default function PayoutScheduleCard() {
  const [schedule, setSchedule] = useState(mockPayoutSchedule);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <>
      <SettingsCard title="Default payout schedule" onEdit={() => setIsEditing(true)}>
        <SettingsRow
          label="Automatic payouts"
          note={schedule.automaticPayoutsNote}
          valueNode={
            <ToggleSwitch
              checked={schedule.automaticPayouts}
              onChange={(checked) =>
                setSchedule((current) => ({ ...current, automaticPayouts: checked }))
              }
              label="Toggle automatic payouts"
            />
          }
        />
        <SettingsRow
          label="Minimum payout threshold"
          note={schedule.minimumThresholdNote}
          value={formatNaira(schedule.minimumThreshold)}
        />
      </SettingsCard>

      <EditFieldsModal
        isOpen={isEditing}
        title="Edit default payout schedule"
        fields={FIELDS}
        values={schedule}
        onClose={() => setIsEditing(false)}
        onSave={(values) => {
          setSchedule((current) => ({ ...current, ...values }));
          setIsEditing(false);
        }}
      />
    </>
  );
}
