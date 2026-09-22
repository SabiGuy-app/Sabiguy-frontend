import BusinessProfileCard from "./BusinessProfileCard";
import OperatingDefaultsCard from "./OperatingDefaultsCard";
import PayoutAccountCard from "./PayoutAccountCard";
import PayoutScheduleCard from "./PayoutScheduleCard";

export default function BusinessSettingsTab() {
  return (
    <div>
      <BusinessProfileCard />
      <OperatingDefaultsCard />
      <PayoutAccountCard />
      <PayoutScheduleCard />
    </div>
  );
}
