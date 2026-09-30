import StarRating from "../../../components/dashboard/StarRating";
import TabNavigation from "../../../components/dashboard/TabNav";
import { useState } from "react";
import { FiUser } from "react-icons/fi";
import { useAuthStore } from "../../../stores/auth.store";
import BeautyDashboardLayout from "../layout/BeautyDashboardLayout";
import BeautyProfileInfoTab from "../components/ProfileInfoTab";
import BeautySettingsTab from "../components/SettingsTab";
import BeautyWalletTab from "../components/WalletTab";
import BeautyPasswordTab from "../components/PasswordTab";
import BeautyProfileTabs from "../components/ProfileTabs";

export default function BeautyProfilePage() {
  const [activeTab, setActiveTab] = useState("profile");
  const user = useAuthStore((state) => state.user);

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

  //   if (!user) {
  //     return (
  //       <DashboardLayout>
  //         <div className="flex items-center justify-center py-20">
  //           <div className="h-8 w-8 border-4 border-[#005823] border-t-transparent rounded-full animate-spin"></div>
  //         </div>
  //       </DashboardLayout>
  //     );
  //   }

  return (
    <BeautyDashboardLayout>
      <div className="w-full py-4">
        <div className="bg-white rounded-2xl border border-gray-200 mb-6">
          <div className="border-b border-gray-300 px-4 sm:px-6 lg:px-9 py-4">
            <h1 className="font-bold text-lg sm:text-[20px]">My Profile</h1>
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 sm:gap-6 px-4 sm:px-6 lg:px-9 py-4 sm:py-6">
            <div className="flex items-center gap-4">
              <div className="w-16 sm:w-20 h-16 sm:h-20 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                {user?.data?.profilePicture ? (
                  <img
                    src={user?.data?.profilePicture}
                    alt={user?.data?.fullName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/avatar.png";
                    }}
                  />
                ) : (
                  <img
                    src="/avatar.png"
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              <div>
                <h2 className="text-base sm:text-xl font-semibold text-gray-900 mb-1">
                  {user?.data?.fullName}
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 mb-1 break-words">
                  {user?.data?.email}
                </p>
                <p className="text-xs sm:text-sm text-gray-600 break-words">
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

        <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 lg:p-8">
          <BeautyProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

          {activeTab === "profile" && <BeautyProfileInfoTab />}
          {activeTab === "wallet" && <BeautyWalletTab />}
          {activeTab === "password" && <BeautyPasswordTab />}
          {activeTab === "settings" && <BeautySettingsTab />}
        </div>
      </div>
    </BeautyDashboardLayout>
  );
}
