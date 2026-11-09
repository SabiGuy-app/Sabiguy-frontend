import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../../../../api/axios";
import { handleLogout } from "../../../../../api/auth";
import { useAuthStore } from "../../../../../stores/auth.store";
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

const initialPasswordForm = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export default function AccountSettingsTab() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const [preferences, setPreferences] = useState(initialPreferences);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState(initialPasswordForm);
  const [passwordError, setPasswordError] = useState("");
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleSignOut = async () => {
    try {
      await handleLogout();
    } finally {
      navigate("/login", { replace: true });
    }
  };

  const togglePreference = (id, channel) => {
    setPreferences((current) =>
      current.map((preference) =>
        preference.id === id
          ? { ...preference, [channel]: !preference[channel] }
          : preference,
      ),
    );
  };

  const handlePasswordChange = async (event) => {
    event.preventDefault();

    const { currentPassword, newPassword, confirmPassword } = passwordForm;

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Please fill in all password fields.");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    if (currentPassword === newPassword) {
      setPasswordError("New password must be different from the current password.");
      return;
    }

    setPasswordError("");
    setIsSubmittingPassword(true);

    try {
      await api.put("/business/auth/change-password", {
        oldPassword: currentPassword,
        newPassword,
      });

      toast.success("Password changed successfully. Please sign in again.");
      setPasswordForm(initialPasswordForm);
      setPasswordModalOpen(false);
      setTimeout(() => {
        logout();
        navigate("/login", { replace: true });
      }, 1200);
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to change password. Please try again.";

      if (error?.response?.status === 401) {
        setPasswordError("Current password is incorrect.");
      } else {
        setPasswordError(message);
      }
    } finally {
      setIsSubmittingPassword(false);
    }
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
              Password
            </span>
            <button
              type="button"
              onClick={() => {
                setPasswordError("");
                setPasswordForm(initialPasswordForm);
                setShowPassword({ current: false, new: false, confirm: false });
                setPasswordModalOpen(true);
              }}
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
              onClick={handleSignOut}
              className="h-9 rounded-md border border-[#BFD8C7] px-3 text-xs font-medium text-[#347B54] hover:bg-[#F3F8F4]"
            >
              Sign out
            </button>
          </div>
        </div>
      </SettingsTabCard>

      {passwordModalOpen && (
        <div
          className="fixed inset-0 z-80 flex items-center justify-center bg-black/40 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setPasswordModalOpen(false);
              setPasswordError("");
              setShowPassword({ current: false, new: false, confirm: false });
            }
          }}
        >
          <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-2xl sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-[#242424]">
                  Change password
                </h2>
                <p className="mt-1 text-[11px] text-[#666666]">
                  Choose a strong password you have not used before.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setPasswordModalOpen(false);
                  setPasswordError("");
                  setShowPassword({ current: false, new: false, confirm: false });
                }}
                className="text-lg text-[#666666] hover:text-[#222222]"
                aria-label="Close change password modal"
              >
                ×
              </button>
            </div>

            <form onSubmit={handlePasswordChange} className="mt-5 space-y-4">
              <div className="space-y-4">
                {[
                  {
                    key: "current",
                    label: "Current password",
                    value: passwordForm.currentPassword,
                    placeholder: "Enter current password",
                    setter: (value) =>
                      setPasswordForm((current) => ({
                        ...current,
                        currentPassword: value,
                      })),
                  },
                  {
                    key: "new",
                    label: "New password",
                    value: passwordForm.newPassword,
                    placeholder: "Enter new password",
                    setter: (value) =>
                      setPasswordForm((current) => ({
                        ...current,
                        newPassword: value,
                      })),
                  },
                  {
                    key: "confirm",
                    label: "Confirm new password",
                    value: passwordForm.confirmPassword,
                    placeholder: "Re-enter new password",
                    setter: (value) =>
                      setPasswordForm((current) => ({
                        ...current,
                        confirmPassword: value,
                      })),
                  },
                ].map(({ key, label, value, placeholder, setter }) => {
                  const isVisible = showPassword[key];

                  return (
                    <label
                      key={key}
                      className="block text-xs font-medium text-[#555555]"
                    >
                      {label}
                      <div className="relative mt-1.5">
                        <input
                          type={isVisible ? "text" : "password"}
                          value={value}
                          onChange={(event) => setter(event.target.value)}
                          className="h-10 w-full rounded-md border border-[#D8D8D8] bg-white px-3 pr-10 text-sm outline-none focus:border-[#347B54]"
                          placeholder={placeholder}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowPassword((current) => ({
                              ...current,
                              [key]: !current[key],
                            }))
                          }
                          className="absolute inset-y-0 right-3 flex items-center text-[#666666] hover:text-[#222222]"
                          aria-label={isVisible ? `Hide ${label}` : `Show ${label}`}
                        >
                          {isVisible ? (
                            <EyeOff size={15} className="stroke-[2.2]" />
                          ) : (
                            <Eye size={15} className="stroke-[2.2]" />
                          )}
                        </button>
                      </div>
                    </label>
                  );
                })}
              </div>

              {passwordError && (
                <p role="alert" className="text-xs text-red-600">
                  {passwordError}
                </p>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setPasswordModalOpen(false);
                    setPasswordError("");
                    setPasswordForm(initialPasswordForm);
                    setShowPassword({ current: false, new: false, confirm: false });
                  }}
                  className="h-9 rounded-md border border-[#D8D8D8] px-3 text-xs text-[#555555] hover:bg-[#F7F7F7]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingPassword}
                  className="h-9 rounded-md bg-[#347B54] px-4 text-xs font-medium text-white hover:bg-[#286642] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmittingPassword ? "Saving..." : "Save password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
