import { create } from "zustand";
import { mockBeautyBookingSamples } from "../data/mockBeautyBookings";
import { bookingsReducer, createBookingsState } from "../utils/bookingsReducer";
import { getBookingDeadline } from "../utils/bookings";
import { createStaffRoster, syncStaffRoster } from "../utils/staffRoster";

function snapshot(sessions, shared, staffMembers) {
  const updated = sessions.map((session) => ({
    ...session,
    staff: staffMembers.find((member) => member.id === (session.booking.assignedStaff?.id ?? session.staff.id)) ?? session.staff,
  }));
  return { sessions: updated, staffMembers, ...shared, session: { ...updated[0], ...shared } };
}

function reconcileDeadlines(current, occurredAt) {
  let shared = { available: current.available, activity: current.activity, notification: current.notification };
  let staffMembers = current.staffMembers;
  const sessions = current.sessions.map((session) => {
    const deadline = Date.parse(getBookingDeadline(session.booking));
    if (!Number.isFinite(deadline) || Date.parse(occurredAt) < deadline) return session;
    const type = session.booking.status === "pending"
      ? "expire_booking"
      : session.booking.status === "payment_pending" ? "payment_expired" : "scheduled_ready";
    const next = bookingsReducer({ ...session, ...shared }, { type, occurredAt });
    staffMembers = syncStaffRoster(staffMembers, session, next);
    shared = { available: next.available, activity: next.activity, notification: next.notification };
    return next;
  });
  return snapshot(sessions, shared, staffMembers);
}

// Shared in-memory samples. Row actions target booking IDs; a reload resets them.
export function createBeautyDashboardStore(data, occurredAt) {
  const sessions = (Array.isArray(data) ? data : [data]).map((sample) => createBookingsState(sample, occurredAt));
  const initial = snapshot(sessions, {
    available: true,
    activity: sessions[0].activity,
    notification: null,
  }, createStaffRoster(sessions));
  return create((set, get) => ({
    ...initial,
    now: Date.parse(occurredAt),
    dispatch: (action) => {
      const timestamp = action.occurredAt ?? new Date().toISOString();
      const bookingId = action.bookingId ?? get().sessions[0].booking.id;
      if (!Number.isFinite(Date.parse(timestamp))) return get().sessions.find((item) => item.booking.id === bookingId) ?? get().session;
      const current = reconcileDeadlines(get(), timestamp);
      const index = current.sessions.findIndex((item) => item.booking.id === bookingId);
      if (index < 0) return current.session;
      let shared = { available: current.available, activity: current.activity, notification: current.notification };
      if (action.type === "set_availability") shared.available = action.available;
      else if (action.type === "read_notification") {
        if (shared.notification) shared.notification = { ...shared.notification, unread: false };
      } else {
        const previous = current.sessions[index];
        const candidate = action.type === "assign_staff"
          ? current.staffMembers.find((member) => member.id === action.staffId)
          : previous.staff;
        if (!candidate) return { ...previous, ...shared };
        const next = bookingsReducer({ ...previous, staff: candidate, ...shared }, { ...action, occurredAt: timestamp });
        current.staffMembers = syncStaffRoster(current.staffMembers, previous, next);
        current.sessions[index] = next.booking === previous.booking ? previous : next;
        shared = { available: next.available, activity: next.activity, notification: next.notification };
      }
      set({ ...snapshot(current.sessions, shared, current.staffMembers), now: Date.parse(timestamp) });
      return { ...get().sessions[index], ...shared };
    },
    tick: (timestamp = new Date().toISOString()) => {
      if (!Number.isFinite(Date.parse(timestamp))) return;
      set({ ...reconcileDeadlines(get(), timestamp), now: Date.parse(timestamp) });
    },
  }));
}

export const useBeautyDashboardStore = createBeautyDashboardStore(mockBeautyBookingSamples, new Date().toISOString());
