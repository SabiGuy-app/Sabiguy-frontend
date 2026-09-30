import { create } from "zustand";

// Isolated frontend fixture. Replace these transitions with booking socket events
// when the beauty endpoints are integrated; never send sample IDs to the API.
let transitionTimer;
export const useBeautyBookingStore = create((set, get) => ({
  booking: null,
  notifications: [],
  notify: (message, target = "details") => set({ notifications: [{ _id: "sample-beauty-booking", type: "beauty_sample", title: "Bookings", message, data: { target }, createdAt: new Date().toISOString(), isRead: false }] }),
  markRead: () => set({ notifications: get().notifications.map((item) => ({ ...item, isRead: true })) }),
  clearNotifications: () => set({ notifications: [] }),
  submit: (booking) => {
    clearTimeout(transitionTimer);
    set({ booking: { ...booking, status: "pending" }, notifications: [] });
    transitionTimer = setTimeout(() => {
      set({ booking: { ...get().booking, status: "accepted" } });
      get().notify("Phil Crook has accepted your booking. Continue to payment.", "payment");
    }, 4000);
  },
  pay: () => {
    set({ booking: { ...get().booking, status: "active" } });
    get().notify("Your booking with Phil Crook has been confirmed.", "details");
    transitionTimer = setTimeout(() => {
      set({ booking: { ...get().booking, status: "review" } });
      get().notify("Phil Crook has submitted work photos. Review your service.", "review");
    }, 45000);
  },
  cancel: () => { clearTimeout(transitionTimer); set({ booking: null, notifications: [] }); },
  complete: (review) => { clearTimeout(transitionTimer); set({ booking: { ...get().booking, status: "completed", review } }); get().notify("Your service with Phil Crook is complete. Thank you!"); },
}));
