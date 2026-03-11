import { useState } from "react";
export default function SettingsTab() {
  const [notifications, setNotifications] = useState({
    bookingsPush: true,
    bookingsEmail: true,
    jobCompletedPush: true,
    jobCompletedEmail: true,
    jobCompleted2Push: true,
    jobCompleted2Email: true,
  });

  const toggleNotification = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="max-w-3xl">
      {/* Email Notifications Section */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Email Notifications</h2>
        <p className="text-sm text-gray-500 mb-8">Choose which update you want to receive via Email</p>

        <div className="space-y-8">
          {/* Bookings */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Bookings</h3>
              <p className="text-sm text-gray-600">Receive an email on Bookings</p>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700 min-w-[60px] text-right">Push</span>
                <button
                  onClick={() => toggleNotification("bookingsPush")}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    notifications.bookingsPush ? "bg-[#005823]" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                      notifications.bookingsPush ? "translate-x-6" : ""
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700 min-w-[60px] text-right">Email</span>
                <button
                  onClick={() => toggleNotification("bookingsEmail")}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    notifications.bookingsEmail ? "bg-[#005823]" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                      notifications.bookingsEmail ? "translate-x-6" : ""
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Job Completed */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Job Completed</h3>
              <p className="text-sm text-gray-600">Notification when the provider marks the job done</p>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700 min-w-[60px] text-right">Push</span>
                <button
                  onClick={() => toggleNotification("jobCompletedPush")}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    notifications.jobCompletedPush ? "bg-[#005823]" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                      notifications.jobCompletedPush ? "translate-x-6" : ""
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700 min-w-[60px] text-right">Email</span>
                <button
                  onClick={() => toggleNotification("jobCompletedEmail")}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    notifications.jobCompletedEmail ? "bg-[#005823]" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                      notifications.jobCompletedEmail ? "translate-x-6" : ""
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Job Completed (duplicate for demo) */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Job Completed</h3>
              <p className="text-sm text-gray-600">Notification when the provider marks the job done</p>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700 min-w-[60px] text-right">Push</span>
                <button
                  onClick={() => toggleNotification("jobCompleted2Push")}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    notifications.jobCompleted2Push ? "bg-[#005823]" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                      notifications.jobCompleted2Push ? "translate-x-6" : ""
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700 min-w-[60px] text-right">Email</span>
                <button
                  onClick={() => toggleNotification("jobCompleted2Email")}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    notifications.jobCompleted2Email ? "bg-[#005823]" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                      notifications.jobCompleted2Email ? "translate-x-6" : ""
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2-Step Authentication Section */}
      {/* <div className="border-t border-gray-200 pt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">2-Step Authentication</h2>
        <p className="text-sm text-gray-600 mb-6">Add additional security to your account with 2-step verification.</p>
        <button className="px-6 py-3 bg-[#005823] text-white font-medium rounded-lg hover:bg-[#004019] transition-colors">
          Get Started
        </button>
      </div> */}
    </div>
  );
}