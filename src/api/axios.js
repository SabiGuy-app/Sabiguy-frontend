import axios from "axios";
import { useAuthStore } from "../stores/auth.store";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Attach token automatically
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto refresh token on 401 or try refresh
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;

    if (err.response?.status === 401 && original && !original._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            original.headers.Authorization = `Bearer ${token}`;
            return api(original);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      original._retry = true;
      isRefreshing = true;

      try {
        const refreshToken =
          useAuthStore.getState().refreshToken ||
          localStorage.getItem("refreshToken");

        if (!refreshToken) {
          const error = new Error("No refresh token available");
          error.code = "NO_REFRESH_TOKEN";
          throw error;
        }

        const { data } = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/auth/refresh`,
          { refreshToken },
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        const refreshed = data?.data?.data || data?.data || data;
        const newAccessToken = refreshed?.accessToken || refreshed?.token;
        const newRefreshToken = refreshed?.refreshToken;
        if (!newAccessToken) {
          throw new Error("Session refresh did not return an access token");
        }

        // Update tokens in store and localStorage
        useAuthStore.getState().setToken(newAccessToken);
        if (newRefreshToken) {
          useAuthStore.getState().setRefreshToken(newRefreshToken);
          localStorage.setItem("refreshToken", newRefreshToken);
        }
        localStorage.setItem("token", newAccessToken);

        original.headers.Authorization = `Bearer ${newAccessToken}`;
        api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);
        isRefreshing = false;

        return api(original);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;

        const refreshRejected = [400, 401, 403].includes(refreshError?.response?.status);
        if (
          original.preserveSessionOnRefreshFailure ||
          (!refreshRejected && refreshError?.code !== "NO_REFRESH_TOKEN")
        ) {
          return Promise.reject(refreshError);
        }

        // Force logout on refresh failure
        useAuthStore.getState().logout();
        localStorage.clear();
        sessionStorage.clear();

        // Redirect to login
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(err);
  },
);

export default api;
