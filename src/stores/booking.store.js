import { create } from "zustand";

const useBookingStore = create((set) => ({
  booking: null,
  selectedProviderId: null,
  setBooking: (data) => set({ booking: data }),
  setSelectedProviderId: (id) => set({ selectedProviderId: id }),
  clearBooking: () => set({ booking: null }),
}));

export default useBookingStore;