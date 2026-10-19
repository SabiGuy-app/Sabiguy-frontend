import { useState } from "react";
import SettingsTabCard from "./SettingsTabCard";

const initialPreferences = [
  {
    id: "payout-failed",
    label: "Payout failed",
    detail: "A transfer to a staff member didn’t go through",
    inApp: true,
    sms: true,
    email: false,
  },
  {
    id: "document-expiring",
    label: "Document expiring",
    detail: "A licence, insurance or permit is near expiry",
    inApp: true,
    sms: true,
    email: false,
  },
  {
    id: "staff-suspended",
    label: "Staff suspended",
    detail: "A policy automatically suspended a staff member",
    inApp: true,
    sms: false,
    email: false,
  },
  {
    id: "low-rating",
    label: "Low rating received",
    detail: "A staff member received a 1–2★ service rating",
    inApp: true,
    sms: false,
    email: false,
  },
  {
    id: "demand-surge",
    label: "Demand surge",
    detail: "A nearby area is seeing increased booking demand",
    inApp: true,
    sms: false,
    email: false,
  },
  {
    id: "daily-summary",
    label: "Daily summary",
    detail: "End-of-day bookings and activity recap",
    inApp: false,
    sms: false,
    email: true,
  },
];

const channels = [
  { key: "inApp", label: "In-app" },
  { key: "sms", label: "SMS" },
  { key: "email", label: "Email" },
];

export default function AccountSettingsTab() {
  const [preferences, setPreferences] = useState(initialPreferences);
  const [language, setLanguage] = useState("English");

  const togglePreference = (id, channel) => {
    setPreferences((current) =>
      current.map((preference) =>
        preference.id === id
          ? { ...preference, [channel]: !preference[channel] }
          : preference,
      ),
    );
  };

  return (
    <div className="py-1">
      <SettingsTabCard
        title="Notifications"
        headerRight={
          <div className="grid grid-cols-[repeat(3,40px)] gap-2 text-center text-[9px] font-semibold uppercase text-[#656565] sm:gap-2.5">
            {channels.map((channel) => (
              <span key={channel.key}>{channel.label}</span>
            ))}
          </div>
        }
      >
        <div className="divide-y divide-[#EFEFEF]">
          {preferences.map((preference) => (
            <div
              key={preference.id}
              className="flex min-h-11 items-center justify-between gap-3 py-2.5"
            >
              <div className="min-w-0">
                <p className="text-[10px] font-medium text-[#303030] sm:text-[11px]">
                  {preference.label}
                </p>
                <p className="mt-0.5 text-[9px] text-[#888888] sm:text-[10px]">
                  {preference.detail}
                </p>
              </div>
              <div className="grid shrink-0 grid-cols-[repeat(3,40px)] gap-2 sm:gap-2.5">
                {channels.map(({ key, label }) => (
                  <button
                    key={key}
                    type="button"
                    role="switch"
                    aria-checked={preference[key]}
                    aria-label={`${label} notifications for ${preference.label}`}
                    onClick={() => togglePreference(preference.id, key)}
                    className={`relative h-5 w-10 justify-self-center rounded-full transition-colors ${preference[key] ? "bg-[#00652F]" : "bg-[#E5E5E5]"}`}
                  >
                    <span
                      className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full border border-[#E3E3E3] bg-white shadow-sm transition-transform ${preference[key] ? "translate-x-5" : "translate-x-0"}`}
                    />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </SettingsTabCard>
      <SettingsTabCard title="Account & security">
        <div className="divide-y divide-[#EFEFEF]">
          <div className="flex min-h-11 items-center justify-between gap-4 py-2.5">
            <span className="text-[10px] text-[#333333] sm:text-[11px]">
              Language
            </span>
            <select
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
              className="h-9 rounded-md border border-[#D1D1D1] bg-white px-2.5 text-xs text-[#555555] outline-none focus:border-[#347B54]"
            >
              <option>English</option>
              <option>French</option>
              <option>Yoruba</option>
              <option>Igbo</option>
            </select>
          </div>
          <div className="flex min-h-11 items-center justify-between gap-4 py-2.5">
            <span className="text-[10px] text-[#333333] sm:text-[11px]">
              Password
            </span>
            <button
              type="button"
              className="h-9 rounded-md border border-[#BFD8C7] px-3 text-xs font-medium text-[#347B54] hover:bg-[#F3F8F4]"
            >
              Change Password
            </button>
          </div>
          <div className="flex min-h-11 items-center justify-between gap-4 py-2.5">
            <span className="text-[10px] text-[#333333] sm:text-[11px]">
              Session
            </span>
            <button
              type="button"
              className="h-9 rounded-md border border-[#BFD8C7] px-3 text-xs font-medium text-[#347B54] hover:bg-[#F3F8F4]"
            >
              Sign out
            </button>
          </div>
        </div>
      </SettingsTabCard>
    </div>
  );
}
