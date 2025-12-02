import { create } from "zustand";
import { devtools } from "zustand/middleware";

export const useUIStore = create(
    devtools((set) => ({
  isSidebarOpen: false,
  isSearchOpen: false,
  isModalOpen: false,

  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),
  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),
}))
);
