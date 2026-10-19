import { createBookingActivity } from "./activity";
import { isRequestExpired } from "./responseTimer";

export function createOverviewState(data, occurredAt) {
  return {
    booking: {
      ...data.booking,
      expiresAt: data.booking.expiresAt ?? new Date(
        Date.parse(occurredAt) + (data.booking.responseWindowSeconds || 180) * 1000,
      ).toISOString(),
    },
    staff: data.staff,
    activity: data.activity,
    available: true,
    notification: null,
  };
}

export function overviewReducer(state, action) {
  if (action.type === "set_availability") return { ...state, available: action.available };
  if (action.type === "read_notification") {
    return state.notification?.unread
      ? { ...state, notification: { ...state.notification, unread: false } }
      : state;
  }
  const next = reduceBookingState(state, action);
  return next.activity !== state.activity
    ? { ...next, notification: { ...next.activity, unread: true } }
    : next;
}

// Preview state only. API requests can replace these transitions when connected.
function reduceBookingState(state, action) {
  const { booking, staff } = state;

  if (["accept_booking", "decline_booking", "expire_booking"].includes(action.type) && isRequestExpired(booking, action.occurredAt)) {
    return {
      ...state,
      booking: { ...booking, status: "expired" },
      activity: createBookingActivity("booking_expired", booking, staff, action.occurredAt),
    };
  }

  switch (action.type) {
    case "accept_booking":
      if (booking.status !== "pending" || state.available === false) return state;
      return {
        ...state,
        booking: { ...booking, status: "accepted" },
        activity: createBookingActivity("booking_accepted", booking, staff, action.occurredAt),
      };
    case "decline_booking":
      if (booking.status !== "pending") return state;
      return {
        ...state,
        booking: { ...booking, status: "declined" },
        activity: createBookingActivity("booking_declined", booking, staff, action.occurredAt),
      };
    case "assign_staff": {
      if (
        booking.status !== "accepted" ||
        booking.assignedStaff ||
        staff.status !== "available" ||
        action.staffId !== staff.id
      ) return state;

      const status = "assigned";
      return {
        ...state,
        booking: {
          ...booking,
          status,
          assignedStaff: { id: staff.id, name: staff.name },
        },
        staff: { ...staff, status, service: booking.service, customer: booking.customer },
        activity: createBookingActivity("staff_assigned", booking, staff, action.occurredAt),
      };
    }
    case "staff_en_route":
      if (
        booking.status !== "assigned" ||
        booking.assignedStaff?.id !== staff.id ||
        booking.serviceLocation !== "customer_address"
      ) return state;
      return {
        ...state,
        booking: { ...booking, status: "en_route" },
        staff: { ...staff, status: "en_route" },
        activity: createBookingActivity("staff_en_route", booking, staff, action.occurredAt),
      };
    case "start_service":
      if (!["assigned", "en_route"].includes(booking.status) || booking.assignedStaff?.id !== staff.id) return state;
      if (booking.serviceLocation === "customer_address" && booking.status !== "en_route") return state;
      return {
        ...state,
        booking: { ...booking, status: "in_service" },
        staff: { ...staff, status: "in_service" },
        activity: createBookingActivity("service_started", booking, staff, action.occurredAt),
      };
    case "complete_service":
      if (booking.status !== "in_service" || booking.assignedStaff?.id !== staff.id) return state;
      return {
        ...state,
        booking: { ...booking, status: "completed" },
        staff: { ...staff, status: "available", service: null, customer: null },
        activity: createBookingActivity("service_completed", booking, staff, action.occurredAt),
      };
    case "cancel_booking":
      if (!["pending", "accepted", "assigned", "en_route", "in_service"].includes(booking.status)) return state;
      return {
        ...state,
        booking: { ...booking, status: "cancelled" },
        staff: booking.assignedStaff?.id === staff.id
          ? { ...staff, status: "available", service: null, customer: null }
          : staff,
        activity: createBookingActivity("booking_cancelled", booking, staff, action.occurredAt),
      };
    default:
      return state;
  }
}
