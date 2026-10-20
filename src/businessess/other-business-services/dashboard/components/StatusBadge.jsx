import { getStatus } from "../utils/status";

export default function StatusBadge({ statuses, status }) {
  const { label, tone } = getStatus(statuses, status);
  return <span className={`beauty-status beauty-status--${tone}`}>{label}</span>;
}
