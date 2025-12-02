import axios from "axios";
import { useAuthStore } from "../stores/auth.store";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

// Attach token automatically
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto logout on 401 or try refresh
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;

    // If unauthorized AND retry isn't attempted yet
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;

      try {
        const refreshToken = useAuthStore.getState().user?.refreshToken;

        const { data } = await api.post("/auth/refresh", {
          refreshToken,
        });

        useAuthStore.getState().setToken(data.accessToken);

        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(original);
      } catch (refreshError) {
        useAuthStore.getState().logout();
      }
    }

    return Promise.reject(err);
  }
);

export default api;
