import DashboardLayout from "../../../components/layouts/DashboardLayout";
import StarRating from "../../../components/dashboard/StarRating";
import TabNavigation from "../../../components/dashboard/TabNav";
import ProfileInfoTab from "../../../components/dashboard/ProfileInfoTab";
import ProfileTabs from "../../../components/dashboard/ProfileTabs";
import { useState } from "react";
import { FiUser } from "react-icons/fi";
import WalletTab from "../../../components/dashboard/WalletTab";
import PasswordTab from "../../../components/dashboard/PasswordTab";
import SettingsTab from "../../../components/dashboard/SettingsTab";
import { useAuthStore } from "../../../stores/auth.store";
import ReferralsTab from "../../../components/provider-dashboard/ReferralsTab";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile");
  const user = useAuthStore((state) => state.user);

  // Detect if user signed up via Google (no password to manage)
  const isGoogleUser = !!(
    user?.data?.googleId ||
    user?.data?.authProvider === "google" ||
    user?.data?.loginType === "google"
  );

  // Mock profile data
  const profile = {
    name: "Stephen Gerrad",
    firstName: "Gerrad",
    lastName: "Sthen",
    email: "Stephengerrad01@gmail.com",
    phone: "+234 813 772 6280",
    address: "24, Eleyele street",
    city: "Ibadan",
    state: "Oyo",
    // rating: 4.6,
    avatar: null,
  };

  if (!user) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 border-4 border-[#005823] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div>
        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-gray-200 mb-6">
          <div className="border-b border-gray-300 px-9 py-4">
            <h1 className="font-bold text-[20px]">
              My Profile
            </h1>
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 px-9 py-9">
            {/* Left Side - Avatar and Info */}
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                {user?.data?.profilePicture ? (
                  <img
                    src={user?.data?.profilePicture}
                    alt={user?.data?.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FiUser size={32} className="text-gray-500" />
                )}
              </div>

              {/* User Info */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                  {user?.data?.fullName}
                </h2>
                <p className="text-sm text-gray-600 mb-1">
                  {user?.data?.email}
                </p>
                <p className="text-sm text-gray-600">
                  {user?.data?.phoneNumber}
                </p>
              </div>
            </div>

            {/* <div className="flex flex-col items-start md:items-center">
              <span className="text-sm text-gray-600 mb-2">Overall Rating</span>
              <StarRating rating={profile.rating} />
            </div>

            <button className="p-2 bg-[#8BC53F] text-white font-medium rounded-lg hover:bg-[#7ab335] transition-colors self-start md:self-center">
              Edit Profile
            </button> */}
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Tab Content */}
          {activeTab === "profile" && <ProfileInfoTab user={user} />}
          {activeTab === "wallet" && <WalletTab />}
          {activeTab === "password" &&
            (isGoogleUser ? (
              <div className="max-w-2xl py-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <img src="/Google.svg" alt="Google" className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Password management is not available
                </h3>
                <p className="text-sm text-gray-600 max-w-md mx-auto">
                  You signed in with Google, so your account doesn't have a
                  password. Your account security is managed through your Google
                  account.
                </p>
              </div>
            ) : (
              <PasswordTab />
            ))}
          {activeTab === "settings" && <SettingsTab />}
          {activeTab === "referrals" && <ReferralsTab profile={profile} />}
        </div>
      </div>
    </DashboardLayout>
  );
}
