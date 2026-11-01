import { getStatus } from "../utils/status";

export default function StatusBadge({ statuses, status }) {
  const { label, tone } = getStatus(statuses, status);
  return <span className={`business-status business-status--${tone}`}>{label}</span>;
}
