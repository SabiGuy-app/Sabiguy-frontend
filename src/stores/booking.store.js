import { create } from "zustand";
import { persist } from "zustand/middleware";

const useBookingStore = create(
  persist(
    (set, get) => ({
      booking: null,
      selectedProviderId: null,

      setBooking: (newBooking) => {
        set({ booking: newBooking });
      },

      appendProviders: (providers) => {
        set((state) => ({
          booking: {
            ...state.booking,
            data: {
              ...state.booking?.data,
              providers,
            },
          },
        }));
      },

      clearBooking: () => set({ booking: null, selectedProviderId: null }),

      setSelectedProviderId: (id) => set({ selectedProviderId: id }),
      clearProviders: () =>
        set((state) => ({
          booking: {
            ...state.booking,
            data: {
              ...state.booking?.data,
              providers: [],
            },
          },
        })),
    }),
    {
      name: "booking-storage",
    },
  ),
);

export default useBookingStore;
