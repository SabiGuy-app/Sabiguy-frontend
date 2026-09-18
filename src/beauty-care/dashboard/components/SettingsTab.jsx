const SAMPLE_PREFERENCES = {
  bookings: { push: true, email: true },
  jobCompleted: { push: true, email: true },
  chatMessages: { push: true, email: false },
  walletPayments: { push: true, email: true },
  promotions: { push: false, email: false },
};

const CATEGORIES = [
  {
    key: "bookings",
    label: "Bookings",
    description: "New booking requests, cancellations and status updates",
  },
  {
    key: "jobCompleted",
    label: "Job Completed",
    description: "Notifications when a job is started or marked as done",
  },
  {
    key: "chatMessages",
    label: "Chat Messages",
    description: "New messages from customers or providers",
  },
  {
    key: "walletPayments",
    label: "Wallet & Payments",
    description: "Payment received, sent, and wallet funding alerts",
  },
  {
    key: "promotions",
    label: "Promotions",
    description: "Platform announcements, offers and updates",
  },
];

const Toggle = ({ enabled }) => (
  <span
    className={`relative w-12 h-6 rounded-full inline-block ${
      enabled ? "bg-[#005823]" : "bg-gray-300"
    }`}
  >
    <span
      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
        enabled ? "translate-x-6" : "translate-x-0"
      }`}
    />
  </span>
);

export default function SettingsTab() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
            Notification Preferences
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Choose how you want to be notified for each activity
          </p>
        </div>
      </div>

      <div className="flex items-center justify-end gap-6 mb-4 pr-1">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider w-12 text-center">
          Push
        </span>
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider w-12 text-center">
          Email
        </span>
      </div>

      <div className="mb-8 sm:mb-12">
        <div className="space-y-1 divide-y divide-gray-100">
          {CATEGORIES.map(({ key, label, description }) => (
            <div
              key={key}
              className="flex items-center justify-between py-4 gap-4"
            >
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                  {label}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                  {description}
                </p>
              </div>

              <div className="flex items-center gap-6 flex-shrink-0">
                <Toggle enabled={SAMPLE_PREFERENCES[key]?.push ?? true} />
                <Toggle enabled={SAMPLE_PREFERENCES[key]?.email ?? true} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
