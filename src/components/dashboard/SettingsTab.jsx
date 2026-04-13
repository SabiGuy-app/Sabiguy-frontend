import { useState, useEffect, useCallback } from "react";
import { notificationService } from "../../api/notifications";

const DEFAULT_PREFERENCES = {
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

// Reusable toggle component
const Toggle = ({ enabled, onChange, disabled }) => (
  <button
    onClick={onChange}
    disabled={disabled}
    className={`relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${
      enabled ? "bg-[#005823]" : "bg-gray-300"
    }`}
  >
    <span
      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
        enabled ? "translate-x-6" : "translate-x-0"
      }`}
    />
  </button>
);

export default function SettingsTab() {
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [savedKeys, setSavedKeys] = useState([]); // tracks which keys just saved for feedback

  // Fetch preferences on mount
  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        setLoading(true);
        const res = await notificationService.getNotificationPreferences();
        if (res.success) {
          setPreferences({
            ...DEFAULT_PREFERENCES,
            ...res.data.notificationPreferences,
          });
        }
      } catch (err) {
        console.error("Failed to fetch notification preferences:", err);
        setError("Failed to load preferences. Using defaults.");
      } finally {
        setLoading(false);
      }
    };

    fetchPreferences();
  }, []);

  // Debounced save — fires 800ms after last toggle
  const savePreferences = useCallback(
    debounce(async (updated, changedKey) => {
      try {
        setSaving(true);
        await notificationService.updateNotificationPreferences({
          notificationPreferences: updated,
        });
        // Show brief "saved" indicator on the row
        setSavedKeys((prev) => [...prev, changedKey]);
        setTimeout(() => {
          setSavedKeys((prev) => prev.filter((k) => k !== changedKey));
        }, 2000);
      } catch (err) {
        console.error("Failed to save preferences:", err);
        setError("Failed to save. Please try again.");
      } finally {
        setSaving(false);
      }
    }, 800),
    [],
  );

  const handleToggle = (categoryKey, channel) => {
    const updated = {
      ...preferences,
      [categoryKey]: {
        ...preferences[categoryKey],
        [channel]: !preferences[categoryKey][channel],
      },
    };
    setPreferences(updated);
    savePreferences(updated, categoryKey);
  };

  if (loading) {
    return (
      <div className="max-w-3xl">
        <div className="animate-pulse space-y-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex justify-between items-center">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-32" />
                <div className="h-3 bg-gray-100 rounded w-56" />
              </div>
              <div className="flex gap-4">
                <div className="h-6 w-12 bg-gray-200 rounded-full" />
                <div className="h-6 w-12 bg-gray-200 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm flex justify-between items-center">
          {error}
          <button
            onClick={() => setError(null)}
            className="text-red-400 hover:text-red-600 ml-4"
          >
            ✕
          </button>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
            Notification Preferences
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Choose how you want to be notified for each activity
          </p>
        </div>
        {saving && (
          <span className="text-xs text-gray-400 animate-pulse">Saving...</span>
        )}
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
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                    {label}
                  </h3>
                  {savedKeys.includes(key) && (
                    <span className="text-xs text-[#005823] font-medium">
                      ✓ Saved
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                  {description}
                </p>
              </div>

              <div className="flex items-center gap-6 flex-shrink-0">
                <Toggle
                  enabled={preferences[key]?.push ?? true}
                  onChange={() => handleToggle(key, "push")}
                  disabled={saving}
                />
                <Toggle
                  enabled={preferences[key]?.email ?? true}
                  onChange={() => handleToggle(key, "email")}
                  disabled={saving}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
