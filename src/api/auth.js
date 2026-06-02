import api from "./axios";
import { useAuthStore } from "../stores/auth.store";
import useNotificationStore from "../stores/notification.store";
import { useUIStore } from "../stores/ui.store";
import { useProviderStore } from "../stores/provider.store";
import { removeFCMToken } from "./fcm";
import { useNavigate } from "react-router-dom";
import { trackEvent } from "../services/analytics";

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
    // ✅ Save tour keys before clearing
    const tourKeys = Object.keys(localStorage).filter(
      (key) =>
        key.startsWith("tourSeen_") || key.startsWith("bookingTourSeen_"),
    );
    const savedTours = tourKeys.map((key) => [key, localStorage.getItem(key)]);

    // Clear everything
    localStorage.clear();
    sessionStorage.clear();

    // ✅ Restore tour keys
    savedTours.forEach(([key, value]) => localStorage.setItem(key, value));

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
