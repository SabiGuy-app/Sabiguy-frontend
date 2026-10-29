import { Bell, Check, Route, Scissors, UsersRound, X } from "../icons";
import { formatActivityTime, getActivityDescription } from "../utils/activity";

const eventAppearance = {
  booking_requested: { icon: Bell, tone: "info" },
  booking_accepted: { icon: Check, tone: "success" },
  booking_declined: { icon: X, tone: "declined" },
  staff_assigned: { icon: UsersRound, tone: "assigned" },
  staff_en_route: { icon: Route, tone: "info" },
  service_started: { icon: Scissors, tone: "success" },
  service_completed: { icon: Check, tone: "completed" },
  booking_cancelled: { icon: X, tone: "cancelled" },
  booking_expired: { icon: X, tone: "cancelled" },
  payment_confirmed: { icon: Check, tone: "success" },
  payment_expired: { icon: X, tone: "cancelled" },
};

export default function ActivityEntry({ activity }) {
  const appearance = Object.hasOwn(eventAppearance, activity.type)
    ? eventAppearance[activity.type]
    : { icon: Bell, tone: "info" };
  const Icon = appearance.icon;
  const timestamp = formatActivityTime(activity.occurredAt);

  return (
    <div className="business-activity-row">
      <span className={`business-activity-check business-activity-check--${appearance.tone}`}>
        <Icon size={12} aria-hidden="true" />
      </span>
      <div>
        <p>{getActivityDescription(activity)}</p>
        {timestamp ? (
          <time dateTime={timestamp.dateTime} title={`${timestamp.fullDate} (Lagos)`}>{timestamp.time}</time>
        ) : <span className="business-activity-time">Time unavailable</span>}
      </div>
    </div>
  );
}
