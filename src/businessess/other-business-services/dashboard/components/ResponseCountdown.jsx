import { getResponseWindow } from "../utils/responseTimer";

export default function ResponseCountdown({ booking, now }) {
  const { seconds, percent } = getResponseWindow(booking, now);
  const label = seconds === null
    ? "Awaiting response"
    : `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")} to respond`;

  return (
    <div className="beauty-response-row">
      <span className="beauty-response-track" role="progressbar" aria-label="Time remaining to respond" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(percent)} aria-valuetext={label}>
        <span style={{ width: `${percent}%` }} />
      </span>
      <span>{label}</span>
    </div>
  );
}
