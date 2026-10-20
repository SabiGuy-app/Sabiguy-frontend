import { createOverviewState, overviewReducer } from "./overviewReducer";
import { createBookingActivity } from "./activity";
import { getStaffEligibility } from "./bookings";
import { isRequestExpired } from "./responseTimer";

const assignedStatuses = ["assigned", "en_route", "in_service", "scheduled", "completed"];

export function createBookingsState(data, occurredAt) {
  const state = createOverviewState(data, occurredAt);
  const { booking, staff } = state;
  const assigned = assignedStatuses.includes(booking.status);
  const paid = ["accepted", ...assignedStatuses].includes(booking.status);
  const startOffset = booking.status === "completed"
    ? -((booking.durationMinutes || 180) + 60) * 60
    : ["assigned", "en_route", "in_service"].includes(booking.status)
      ? -3600
      : booking.startOffsetSeconds ?? 7200;
  return {
    ...state,
    booking: {
      ...booking,
      startsAt: booking.startsAt ?? new Date(Date.parse(occurredAt) + startOffset * 1000).toISOString(),
      paymentStatus: booking.paymentStatus ?? (paid ? "paid" : booking.status === "payment_pending" ? "pending" : booking.status === "payment_expired" ? "expired" : "unpaid"),
      paymentExpiresAt: booking.paymentExpiresAt ?? new Date(Date.parse(occurredAt) + (booking.paymentWindowSeconds || 300) * 1000).toISOString(),
      assignedStaff: booking.assignedStaff ?? (assigned ? { id: staff.id, name: staff.name } : null),
    },
    staff: assigned && booking.status !== "completed"
      ? { ...staff, status: ["scheduled", "assigned"].includes(booking.status) ? "assigned" : booking.status }
      : staff,
  };
}

function withActivity(state, booking, type, occurredAt, staff = state.staff) {
  const activity = createBookingActivity(type, booking, staff, occurredAt);
  return { ...state, booking, staff, activity, notification: { ...activity, unread: true } };
}

export function bookingsReducer(state, action) {
  const { booking, staff } = state;
  const now = Date.parse(action.occurredAt);
  const paymentExpired = booking.status === "payment_pending" && now >= Date.parse(booking.paymentExpiresAt);
  if (["accept_booking", "confirm_payment", "payment_expired", "assign_staff", "scheduled_ready"].includes(action.type) && !Number.isFinite(now)) return state;

  switch (action.type) {
    case "accept_booking": {
      if (isRequestExpired(booking, action.occurredAt)) return overviewReducer(state, action);
      if (booking.status !== "pending" || !state.available) return state;
      const next = overviewReducer(state, action);
      return {
        ...next,
        booking: {
          ...next.booking,
          status: "payment_pending",
          paymentStatus: "pending",
          paymentExpiresAt: new Date(now + (booking.paymentWindowSeconds || 300) * 1000).toISOString(),
        },
      };
    }
    case "confirm_payment":
      // The future payment callback must explicitly confirm this booking.
      if (booking.status !== "payment_pending" || action.bookingId !== booking.id || action.paymentStatus !== "paid") return state;
      if (paymentExpired) return withActivity(state, { ...booking, status: "payment_expired", paymentStatus: "expired" }, "payment_expired", action.occurredAt);
      return withActivity(state, { ...booking, status: "accepted", paymentStatus: "paid" }, "payment_confirmed", action.occurredAt);
    case "payment_expired":
      if (!paymentExpired) return state;
      return withActivity(state, { ...booking, status: "payment_expired", paymentStatus: "expired" }, "payment_expired", action.occurredAt);
    case "assign_staff": {
      if (booking.paymentStatus !== "paid" || action.staffId !== staff.id || getStaffEligibility(booking, staff)) return state;
      if (booking.status !== "accepted" && booking.status !== "scheduled") return state;
      const future = Date.parse(booking.startsAt) > now;
      const updated = { ...booking, status: future ? "scheduled" : "assigned", assignedStaff: { id: staff.id, name: staff.name } };
      return withActivity(state, updated, "staff_assigned", action.occurredAt, { ...staff, status: "assigned", service: booking.service, customer: booking.customer });
    }
    case "scheduled_ready":
      if (booking.status !== "scheduled" || now < Date.parse(booking.startsAt)) return state;
      return { ...state, booking: { ...booking, status: booking.assignedStaff ? "assigned" : "accepted" } };
    case "cancel_booking":
      if (["payment_pending", "scheduled"].includes(booking.status)) {
        return withActivity(state, { ...booking, status: "cancelled" }, "booking_cancelled", action.occurredAt,
          booking.assignedStaff?.id === staff.id ? { ...staff, status: "available", service: null, customer: null } : staff);
      }
      return overviewReducer(state, action);
    case "staff_en_route":
    case "start_service":
    case "complete_service":
      if (booking.paymentStatus !== "paid") return state;
      return overviewReducer(state, action);
    default:
      return overviewReducer(state, action);
  }
}
