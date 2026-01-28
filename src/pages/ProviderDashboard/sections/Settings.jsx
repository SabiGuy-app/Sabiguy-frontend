import ProviderDashboardLayout from "../../../components/layouts/ProviderDashboardLayout";
import StarRating from "../../../components/dashboard/StarRating";
import ProfileInfoTab from "../../../components/dashboard/ProfileInfoTab";
import { useState } from "react";
import { FiUser} from "react-icons/fi";
import ProviderProfileTabs from "../../../components/provider-dashboard/ProfileTabs";
import ProviderProfileInfoTab from "../../../components/provider-dashboard/ProviderProfileInfo";
import ProviderWalletTab from "../../../components/provider-dashboard/ProviderWalletTab";
import PasswordTab from "../../../components/dashboard/PasswordTab";
import ProviderServiceProfileTab from "../../../components/provider-dashboard/ServiceProfile";
import ReferralsTab from "../../../components/provider-dashboard/ReferralsTab";
import SettingsTab from "../../../components/dashboard/SettingsTab";

export default function ProviderProfilePage () {
      const [activeTab, setActiveTab] = useState("profile");

    // Mock profile data
  const profile = {
    name: "Stephen Gerrad",
    firstName: "Gerrad",
    lastName: "Stephen",
    email: "Stephengerrad01@gmail.com",
    phone: "+234 813 772 6280",
    address: "24, Eleyele street",
    city: "Ibadan",
    state: "Oyo",
    rating: 4.6,
    avatar: null, 
  };

  return (
    <ProviderDashboardLayout>
        <div className="w-190">
        
              {/* Profile Card */}
              <div className="bg-white rounded-2xl border border-gray-200 p-9 mb-6">
                 <h1 className="mb-4 font-bold">My Profile</h1>
        <h1 className="border-b border-gray-300"></h1>
                <div className="flex flex-col mt-4 md:flex-row md:items-center md:justify-between gap-6">
                  {/* Left Side - Avatar and Info */}
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                      {profile.avatar ? (
                        <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
                      ) : (
                        <FiUser size={32} className="text-gray-500" />
                      )}
                    </div>
        
                    {/* User Info */}
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-1">
                        {profile.name}
                      </h2>
                      <p className="text-sm text-gray-600 mb-1">{profile.email}</p>
                      <p className="text-sm text-gray-600">{profile.phone}</p>
                    </div>
                  </div>
        
                  {/* Middle - Rating */}
                  <div className="flex flex-col items-start md:items-center">
                    <span className="text-sm text-gray-600 mb-2">Overall Rating</span>
                    <StarRating rating={profile.rating} />
                  </div>
        
                  {/* Right Side - Edit Button */}
                  <button className="p-2 bg-[#8BC53F] text-white font-medium rounded-lg hover:bg-[#7ab335] transition-colors self-start md:self-center">
                    Edit Profile
                  </button>
                </div>
              </div>
               <div className="bg-white rounded-2xl border border-gray-200 p-6">
                      <ProviderProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />
              
                      {/* Tab Content */}
                      {/* {activeTab === "profile" && <ProviderProfileInfoTab profile={profile} />} */}
                      {activeTab === "wallet" && <ProviderWalletTab profile={profile} />}
                      {activeTab === "password" && <PasswordTab profile={profile} />}
                      {activeTab === "service" && <ProviderServiceProfileTab profile={profile} />}
                      {activeTab === "preferences" && <SettingsTab profile={profile} />}
                      {activeTab === "referrals" && <ReferralsTab profile={profile} />}
              </div>
              </div>


    </ProviderDashboardLayout>
  )




}