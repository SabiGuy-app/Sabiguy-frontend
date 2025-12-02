import { create } from "zustand";
import { devtools, persist } from "zustand/middleware"

export const useAuthStore = create(
    devtools(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setUser: (user) => set({ user, isAuthenticated: true }),
      setToken: (token) => set({ token }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),

    {
      name: "sabiguy-auth", // localStorage key
    }
  )
)
);