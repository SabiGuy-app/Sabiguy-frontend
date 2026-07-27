import { Info } from "lucide-react";
import { TickIcon, CancelIcon, ErrorIcon, WarningIcon } from "../icons/FleetIcons";

const TYPE_CONFIG = {
  info: { bgColor: "bg-blue-100", Icon: Info, iconColor: "text-blue-600" },
  completed: { bgColor: "bg-green-100", Icon: TickIcon },
  cancelled: { bgColor: "bg-red-100", Icon: CancelIcon },
  policy: { bgColor: "bg-red-100", Icon: ErrorIcon },
  warning: { bgColor: "bg-amber-100", Icon: WarningIcon },
};

const defaultConfig = { bgColor: "bg-gray-100", Icon: Info, iconColor: "text-gray-600" };

export default function LiveActivityFeed({ activities = [] }) {
  return (
    <div className="flex h-full flex-col rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
      <h3 className="text-base font-semibold text-gray-900 sm:text-lg">Live activity</h3>

      {activities.length === 0 ? (
        <p className="mt-6 text-center text-sm text-gray-500">No activity yet</p>
      ) : (
        <div className="mt-3 max-h-72 space-y-1 overflow-y-auto">
          {activities.map((activity) => {
            const config = TYPE_CONFIG[activity.type] || defaultConfig;
            const { Icon } = config;
            return (
              <div
                key={activity.id}
                className="flex items-start gap-3 rounded-lg px-1 py-2.5 hover:bg-gray-50"
              >
                <span
                  className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${config.bgColor}`}
                >
                  <Icon size={14} className={config.iconColor} />
                </span>
                <div className="min-w-0">
                  <p className="text-sm text-gray-800">{activity.message}</p>
                  <p className="mt-0.5 text-xs text-gray-400">{activity.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
