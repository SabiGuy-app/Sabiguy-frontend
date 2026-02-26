import { create } from "zustand";
import { persist } from "zustand/middleware";

const useBookingStore = create(
  persist(
    (set, get) => ({
      booking: null,
      selectedProviderId: null,

      setBooking: (newBooking) => {
        const existingProviders = get().booking?.data?.providers;
        const incomingProviders = newBooking?.data?.providers;

        set({
          booking: {
            ...newBooking,
            data: {
              ...newBooking?.data,
              // ✅ Keep existing providers if new data doesn't have them
              providers: incomingProviders?.length ? incomingProviders : existingProviders,
            },
          },
        });
      },

      setSelectedProviderId: (id) => set({ selectedProviderId: id }),
    }),
    {
      name: "booking-storage",
    }
  )
);

export default useBookingStore;