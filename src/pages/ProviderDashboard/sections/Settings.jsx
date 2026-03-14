import ProviderDashboardLayout from "../../../components/layouts/ProviderDashboardLayout";
import StarRating from "../../../components/dashboard/StarRating";
import ProfileInfoTab from "../../../components/dashboard/ProfileInfoTab";
import { useState, useRef } from "react";
import { FiUser, FiEye, FiCamera } from "react-icons/fi";
import ProviderProfileTabs from "../../../components/provider-dashboard/ProfileTabs";
import ProviderProfileInfoTab from "../../../components/provider-dashboard/ProviderProfileInfo";
import ProviderWalletTab from "../../../components/provider-dashboard/ProviderWalletTab";
import PasswordTab from "../../../components/dashboard/PasswordTab";
import ProviderServiceProfileTab from "../../../components/provider-dashboard/ServiceProfile";
import ReferralsTab from "../../../components/provider-dashboard/ReferralsTab";
import SettingsTab from "../../../components/dashboard/SettingsTab";
import { useAuthStore } from "../../../stores/auth.store";
import { updateProviderProfilePic } from "../../../api/provider";
import { getUserByEmail } from "../../../api/auth";
import toast from "react-hot-toast";
import { useEffect } from "react";

export default function ProviderProfilePage() {
  const [activeTab, setActiveTab] = useState("profile");
  const { user, updateUser } = useAuthStore();
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isViewingImage, setIsViewingImage] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState(null);

  // Detect if provider signed up via Google (no password to manage)
  const isGoogleUser = !!(
    user?.data?.googleId ||
    user?.data?.authProvider === "google" ||
    user?.data?.loginType === "google"
  );

  const hasFetchedProfile = useRef(false);

  // Fetch absolutely fresh data from database on mount (once only)
  useEffect(() => {
    if (hasFetchedProfile.current) return;
    const fetchFreshProfile = async () => {
      if (!user?.data?.email) return;
      hasFetchedProfile.current = true;
      try {
        const response = await getUserByEmail(user.data.email);
        if (response && response.data) {
          updateUser({ data: { ...user.data, ...response.data } });
        }
      } catch (error) {
        console.error("Failed to fetch fresh profile from database", error);
        hasFetchedProfile.current = false; // Allow retry on error
      }
    };
    fetchFreshProfile();
  }, [user?.data?.email]);

  const firstJob = user?.data?.job?.[0] || {};
  const profile = {
    name: user?.data?.fullName || "Provider",
    firstName: user?.data?.fullName?.split(" ")[0] || "",
    lastName: user?.data?.fullName?.split(" ").slice(1).join(" ") || "",
    email: user?.data?.email || "",
    phone: user?.data?.phoneNumber || "",
    address: user?.data?.address || "",
    city: user?.data?.city || "",
    state: user?.data?.state || "",
    rating: user?.data?.rating || 0,
    avatar: user?.data?.profilePicture || null,
    workVisuals: user?.data?.workVisuals || [],
    accountName: user?.data?.accountName || "",
    accountNumber: user?.data?.accountNumber || "",
    bankName: user?.data?.bankName || "",
    bankCode: user?.data?.bankCode || "",
    workCategory: firstJob.service || "",
    subCategory: firstJob.title || "",
    tagLine: firstJob.tagLine || "",
  };

  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate size (e.g., max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    try {
      setIsUploading(true);
      const email = user?.data?.email;
      const uploadEndpoint = `${import.meta.env.VITE_BASE_URL}/file/${email}/profile_pictures`;

      // 1. Upload to the file server
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch(uploadEndpoint, {
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadRes.json();

      if (!uploadData?.file?.url) {
        throw new Error("Failed to upload image. No URL returned.");
      }

      const imageUrl = uploadData.file.url;

      // 2. Attach URL to profile
      await updateProviderProfilePic({ imageUrl });

      // 3. Update global store
      updateUser({ data: { ...user.data, profilePicture: imageUrl } });
      setPreviewAvatar(imageUrl);
      toast.success("Profile picture updated successfully!");
    } catch (error) {
      console.error("Avatar upload failed:", error);
      toast.error(error.message || "Failed to update profile picture");
    } finally {
      setIsUploading(false);
      e.target.value = ""; // reset input
    }
  };

  return (
    <ProviderDashboardLayout>
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-gray-200 mb-6">
          <div className="border-b border-gray-300 px-4 sm:px-6 lg:px-9 py-4">
            <h1 className="font-bold text-lg sm:text-[20px]">My Profile</h1>
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 sm:gap-6 px-4 sm:px-6 lg:px-9 py-4 sm:py-6">
            {/* Left Side - Avatar and Info */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Avatar */}
              <div className="w-16 sm:w-20 h-16 sm:h-20 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0 relative group">
                {isUploading ? (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    {(previewAvatar || profile.avatar) && (
                      <button
                        onClick={() => setIsViewingImage(true)}
                        className="text-white hover:text-[#8BC53F] transition-colors"
                        title="View picture"
                      >
                        <FiEye size={18} />
                      </button>
                    )}
                    <button
                      onClick={handleAvatarClick}
                      className="text-white hover:text-[#8BC53F] transition-colors"
                      title="Update picture"
                    >
                      <FiCamera size={18} />
                    </button>
                  </div>
                )}

                {(previewAvatar || profile.avatar) ? (
                  <img
                    src={previewAvatar || profile.avatar}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FiUser size={32} className="text-gray-500" />
                )}

                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {/* User Info */}
              <div>
                <h2 className="text-base sm:text-xl font-semibold text-gray-900 mb-1">
                  {profile.name}
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">{profile.email || <span className="italic text-gray-400">No email set</span>}</p>
                <p className="text-xs sm:text-sm text-gray-600">{profile.phone || <span className="italic text-gray-400">No phone set</span>}</p>
              </div>
            </div>

            {/* Middle - Rating */}
            <div className="flex flex-col items-start md:items-center justify-start md:justify-center w-full md:w-auto">
              <span className="text-xs sm:text-sm text-gray-600 mb-2">Overall Rating</span>
              <StarRating rating={profile.rating} />
            </div>

            {/* Right Side - Edit Button */}
            <button
              onClick={() => setActiveTab('profile')}
              className="w-full md:w-auto p-2 px-4 bg-[#8BC53F] text-white font-medium rounded-lg hover:bg-[#7ab335] transition-colors text-sm sm:text-base"
            >
              Edit Profile
            </button>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 lg:p-8">
          <ProviderProfileTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          {/* Tab Content */}
          {activeTab === "profile" && <ProviderProfileInfoTab user={user} />}
          {activeTab === "wallet" && <ProviderWalletTab profile={profile} />}
          {activeTab === "password" && (
            isGoogleUser ? (
              <div className="max-w-2xl py-8 sm:py-12 text-center">
                <div className="w-14 sm:w-16 h-14 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <img src="/Google.svg" alt="Google" className="w-6 sm:w-8 h-6 sm:h-8" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  Password management is not available
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto px-4">
                  You signed in with Google, so your account doesn't have a password.
                  Your account security is managed through your Google account.
                </p>
              </div>
            ) : (
              <PasswordTab profile={profile} />
            )
          )}
          {activeTab === "service" && (
            <ProviderServiceProfileTab profile={profile} />
          )}
          {activeTab === "preferences" && <SettingsTab profile={profile} />}
          {activeTab === "referrals" && <ReferralsTab profile={profile} />}
        </div>
      </div>

      {/* Full-screen Image Modal */}
      {isViewingImage && (previewAvatar || profile.avatar) && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setIsViewingImage(false)}
        >
          <div className="relative max-w-3xl max-h-[90vh] flex items-center justify-center">
            <button
              onClick={() => setIsViewingImage(false)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 text-3xl font-light"
            >
              &times;
            </button>
            <img
              src={previewAvatar || profile.avatar}
              alt="Profile"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image itself
            />
          </div>
        </div>
      )}
    </ProviderDashboardLayout>
  );
}
