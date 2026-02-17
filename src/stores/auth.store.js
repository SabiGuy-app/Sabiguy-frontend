import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export const useAuthStore = create(
  devtools(
    persist(
      (set) => ({
        user: null,
        token: null,
        isAuthenticated: false,

        setUser: (user) => set({ user, isAuthenticated: true }),
        updateUser: (updater) =>
          set((state) => ({
            user:
              typeof updater === "function"
                ? updater(state.user)
                : { ...state.user, ...updater },
          })),
        setToken: (token) => set({ token }),
        setId: (id) => set({ currentUserId: id }),
        logout: () =>
          set({ user: null, token: null, id: null, isAuthenticated: false }),
      }),

      {
        name: "sabiguy-auth", // localStorage key
      },
    ),
  ),
);
