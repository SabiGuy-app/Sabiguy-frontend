import { getActivityDescription } from "../utils/activity";
import DashboardCard from "./DashboardCard";
import ActivityEntry from "./ActivityEntry";

export default function LiveActivityFeed({ activity, search = "" }) {
  const description = activity ? getActivityDescription(activity) : "";
  const matchesSearch = description.toLowerCase().includes(search.toLowerCase().trim());

  return (
    <DashboardCard title="Live activity" className="beauty-activity-card">
      <div aria-live="polite" aria-atomic="true">
        {activity && matchesSearch ? (
          <ActivityEntry activity={activity} key={activity.id} />
        ) : (
          <p className="beauty-empty">{activity ? "No activity matches your search." : "No activity yet."}</p>
        )}
      </div>
    </DashboardCard>
  );
}
