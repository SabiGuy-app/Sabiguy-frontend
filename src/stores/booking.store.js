import { create } from "zustand";

const useBookingStore = create((set) => ({
  booking: null,
  setBooking: (data) => set({ booking: data }),
  clearBooking: () => set({ booking: null }),
}));

export default useBookingStore;