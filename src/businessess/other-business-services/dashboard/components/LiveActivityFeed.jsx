import { useState } from "react";
import { getActivityDescription } from "../utils/activity";
import DashboardCard from "./DashboardCard";
import ActivityEntry from "./ActivityEntry";

const INITIAL_ACTIVITY_COUNT = 4;

export default function LiveActivityFeed({ activity, search = "" }) {
  const [showAll, setShowAll] = useState(false);
  const query = search.toLowerCase().trim();
  const matchingActivities = activity.filter((item) =>
    getActivityDescription(item).toLowerCase().includes(query),
  );
  const visibleActivities = showAll
    ? matchingActivities
    : matchingActivities.slice(0, INITIAL_ACTIVITY_COUNT);

  return (
    <DashboardCard title="Live activity" className="business-activity-card">
      <div aria-live="polite" aria-atomic="true">
        {visibleActivities.length ? visibleActivities.map((item) => (
          <ActivityEntry activity={item} key={item.id} />
        )) : (
          <p className="business-empty">{activity.length ? "No activity matches your search." : "No activity yet."}</p>
        )}
      </div>
      {matchingActivities.length > INITIAL_ACTIVITY_COUNT && (
        <button type="button" className="business-activity-more" onClick={() => setShowAll((current) => !current)}>
          {showAll ? "View less" : "View more"}
        </button>
      )}
    </DashboardCard>
  );
}
