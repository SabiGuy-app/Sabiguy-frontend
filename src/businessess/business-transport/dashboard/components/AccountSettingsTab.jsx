import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SettingsCard, { SettingsRow, EditButton } from "./SettingsCard";
import ToggleSwitch from "./ToggleSwitch";
import { mockNotificationPrefs, mockAccountSecurity } from "../data/mockSettings";

const CHANNELS = [
  { key: "inApp", label: "In-app" },
  { key: "sms", label: "SMS" },
  { key: "email", label: "Email" },
];

function ChannelColumns({ children }) {
  return <div className="grid shrink-0 grid-cols-3 gap-4 sm:gap-6">{children}</div>;
}

export default function AccountSettingsTab() {
  const navigate = useNavigate();
  const [prefs, setPrefs] = useState(mockNotificationPrefs);
  const [security, setSecurity] = useState(mockAccountSecurity);

  const toggleChannel = (key, channel, checked) => {
    setPrefs((current) =>
      current.map((pref) => (pref.key === key ? { ...pref, [channel]: checked } : pref)),
    );
  };

  return (
    <div>
      <SettingsCard
        title="Notifications"
        headerRight={
          <ChannelColumns>
            {CHANNELS.map((channel) => (
              <span
                key={channel.key}
                className="w-11 text-center text-[10px] font-semibold uppercase tracking-wide text-[#918E8F]"
              >
                {channel.label}
              </span>
            ))}
          </ChannelColumns>
        }
      >
        <div className="-mx-5 divide-y divide-[#EFEDED] sm:-mx-6">
          {prefs.map((pref) => (
            <div key={pref.key} className="flex items-center justify-between gap-4 px-5 py-3 sm:px-6">
              <div>
                <p className="text-sm font-semibold text-[#231F20]">{pref.title}</p>
                <p className="mt-0.5 text-xs text-[#918E8F]">{pref.description}</p>
              </div>
              <ChannelColumns>
                {CHANNELS.map((channel) => (
                  <div key={channel.key} className="flex w-11 justify-center">
                    <ToggleSwitch
                      checked={pref[channel.key]}
                      onChange={(checked) => toggleChannel(pref.key, channel.key, checked)}
                      label={`Toggle ${channel.label} for ${pref.title}`}
                    />
                  </div>
                ))}
              </ChannelColumns>
            </div>
          ))}
        </div>
      </SettingsCard>

      <SettingsCard title="Account & security">
        <SettingsRow
          label="Language"
          valueNode={
            <select
              value={security.language}
              onChange={(event) =>
                setSecurity((current) => ({ ...current, language: event.target.value }))
              }
              className="appearance-none rounded-md border border-[#CFCBCC] bg-white px-3 py-1.5 text-sm text-[#3D393A] outline-none focus:border-[#2F7D55]"
            >
              {["English", "French", "Hausa", "Yoruba", "Igbo"].map((language) => (
                <option key={language} value={language}>
                  {language}
                </option>
              ))}
            </select>
          }
        />
        <SettingsRow label="Password" valueNode={<EditButton>Change Password</EditButton>} />
        <SettingsRow
          label="Session"
          valueNode={<EditButton onClick={() => navigate("/login")}>Sign out</EditButton>}
        />
      </SettingsCard>
    </div>
  );
}
