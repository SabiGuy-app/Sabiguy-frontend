import api from "./axios";
import { useAuthStore } from "../stores/auth.store";
import useNotificationStore from "../stores/notification.store";
import { useUIStore } from "../stores/ui.store";
import { useProviderStore } from "../stores/provider.store";
import { removeFCMToken } from "./fcm";
import { trackEvent } from "../services/analytics";
import { clearStoragePreservingTours } from "../utils/tourStorage";
import { getUserById } from "./user";

// Password reset uses the shared auth endpoints for every account type.
export const requestPasswordReset = async (email) => {
  const { data } = await api.post("/auth/password", { email });
  return data;
};

export const resendPasswordResetOtp = async (email) => {
  const { data } = await api.post("/auth/resend-forgot-password-otp", { email });
  return data;
};

export const verifyPasswordResetOtp = async ({ email, otp }) => {
  const { data } = await api.post("/auth/verify-reset-otp", { email, otp });
  return data;
};

export const resetPassword = async ({ email, otp, newPassword }) => {
  const { data } = await api.post("/auth/reset", { email, otp, newPassword });
  return data;
};

// Switch an authenticated provider/business owner into their buyer profile.
export const switchToBuyer = async () => {
  const { data } = await api.post("/auth/switch-to-buyer");
  return data;
};

export const getAuthProfiles = async () => {
  const { data } = await api.get("/auth/profiles");
  return data;
};

// Resolve the profile selected by the authenticated session, then fetch that
// exact profile. Email is shared by linked profiles and is not a safe key.
export const getAuthenticatedProfile = async () => {
  const response = await getAuthProfiles();
  const result = response?.data?.data || response?.data || response;
  const activeProfile = result?.activeProfile;
  if (!activeProfile?.profileId) {
    throw new Error("The authenticated session did not identify an active profile.");
  }

  const profileResponse = await getUserById(activeProfile.profileId);
  const profile = profileResponse?.data?.data || profileResponse?.data || profileResponse;
  const role = activeProfile.role || profile?.role || profile?.data?.role;
  if (!profile || typeof profile !== "object") {
    throw new Error("Could not load the authenticated profile.");
  }

  return {
    ...profile,
    ...(role ? { role } : {}),
    data: {
      ...(profile.data || profile),
      ...(role ? { role } : {}),
    },
  };
};

export const switchProfile = async (payload) => {
  const { data } = await api.post("/auth/switch-profile", payload);
  return data;
};

// LOGIN (email + password)
export const login = async (payload) => {
  try {
    const { data } = await api.post("/auth", payload);
    useAuthStore.getState().setId(data.id);

    // Store tokens in both store and localStorage
    if (data.token) {
      localStorage.setItem("token", data.token);
      useAuthStore.getState().setToken(data.token);
    }
    if (data.refreshToken) {
      localStorage.setItem("refreshToken", data.refreshToken);
      useAuthStore.getState().setRefreshToken(data.refreshToken);
    }

    trackEvent("login_success", {
      method: "password",
      role: data.role || data.user?.role,
    });

    return data;
  } catch (error) {
    trackEvent("login_failed", {
      method: "password",
      status: error?.response?.status,
    });
    throw error;
  }
};

// LOGIN (business account — separate endpoint from the buyer/provider one above)
export const businessLogin = async (payload) => {
  try {
    const { data } = await api.post("/business/auth/login", payload);
localStorage.getItem("token")
    if (data.token) {
      localStorage.setItem("token", data.token);
      useAuthStore.getState().setToken(data.token);
    }
    if (data.refreshToken) {
      localStorage.setItem("refreshToken", data.refreshToken);
      useAuthStore.getState().setRefreshToken(data.refreshToken);
    }

    trackEvent("login_success", { method: "password", role: "business" });

    return data;
  } catch (error) {
    trackEvent("login_failed", {
      method: "password",
      role: "business",
      status: error?.response?.status,
    });
    throw error;
  }
};

// GOOGLE LOGIN (business account)
export const businessGoogleLogin = async (accessToken) => {
  try {
    const { data } = await api.post("/business/auth/google-login", {
      token: accessToken,
    });

    if (data.token) {
      localStorage.setItem("token", data.token);
      useAuthStore.getState().setToken(data.token);
    }
    if (data.refreshToken) {
      localStorage.setItem("refreshToken", data.refreshToken);
      useAuthStore.getState().setRefreshToken(data.refreshToken);
    }

    trackEvent("login_success", { method: "google", role: "business" });

    return data;
  } catch (error) {
    trackEvent("login_failed", {
      method: "google",
      role: "business",
      status: error?.response?.status,
    });
    throw error;
  }
};

// GET AUTHENTICATED BUSINESS PROFILE
// Used on login to restore the saved business category so onboarding can
// resume on the correct step from any device (not just the browser that
// holds the local draft).
export const getBusinessProfile = async () => {
  const token = localStorage.getItem("token");
  const { data } = await api.get("/business/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data?.data || data;
};

// GET USER BY EMAIL
export const getUserByEmail = async (email) => {
  const token = localStorage.getItem("token");

  const { data } = await api.get(`/users/email/${email}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
};

// The email lookup can return a different linked profile than the one used to
// authenticate. Merge its fresh fields without changing the active role.
export const mergeProfilePreservingActiveRole = (currentUser, profileResponse, activeRole) => {
  const freshRoot = profileResponse?.data || profileResponse || {};
  const freshData = freshRoot?.data || freshRoot;
  const currentData = currentUser?.data || {};
  const role = activeRole || currentData.role || currentUser?.role;

  return {
    ...(currentUser || {}),
    ...(freshRoot && typeof freshRoot === "object" ? freshRoot : {}),
    ...(role ? { role } : {}),
    data: {
      ...currentData,
      ...(freshData && typeof freshData === "object" ? freshData : {}),
      ...(role ? { role } : {}),
    },
  };
};

// GOOGLE LOGIN
export const googleLogin = async (accessToken) => {
  try {
    const { data } = await api.post(`/auth/google-login`, {
      token: accessToken,
    });

    // Store tokens in both store and localStorage
    if (data.token) {
      localStorage.setItem("token", data.token);
      useAuthStore.getState().setToken(data.token);
    }
    if (data.refreshToken) {
      localStorage.setItem("refreshToken", data.refreshToken);
      useAuthStore.getState().setRefreshToken(data.refreshToken);
    }

    trackEvent("login_success", {
      method: "google",
      role: data.role || data.user?.role,
    });

    return data;
  } catch (error) {
    trackEvent("login_failed", {
      method: "google",
      status: error?.response?.status,
    });
    throw error;
  }
};

export async function handleLogout() {
  try {
    await removeFCMToken();
  } catch (error) {
    console.error("FCM token removal error:", error);
  }

  try {
    clearStoragePreservingTours(localStorage);
    sessionStorage.clear();

    // Reset all Zustand stores
    useAuthStore.getState().logout();
    useNotificationStore.getState().reset();
    useUIStore.getState().reset();
    useProviderStore.getState().reset();

    if (window.caches) {
      const cacheNames = await window.caches.keys();
      cacheNames.forEach((cache) => window.caches.delete(cache));
    }
  } catch (error) {
    console.error("Logout error:", error);
  }
}
