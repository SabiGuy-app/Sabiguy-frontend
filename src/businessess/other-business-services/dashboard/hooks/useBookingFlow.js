import { useCallback, useState } from "react";
import { useBeautyDashboardStore } from "../stores/beautyDashboard.store";
import { getBookingDeadline, getBookingTab } from "../utils/bookings";

export default function useBookingFlow(onStatusChange) {
  const { sessions, staffMembers, available, activity, notification, dispatch, now } = useBeautyDashboardStore();
  const [selectedBookingId, setSelectedBookingId] = useState(sessions[0].booking.id);
  const session = sessions.find((item) => item.booking.id === selectedBookingId) ?? sessions[0];
  const [dialog, setDialog] = useState(null);
  const [confirmation, setConfirmation] = useState(null);
  const deadline = Date.parse(getBookingDeadline(session.booking));
  const seconds = Number.isFinite(deadline) ? Math.max(0, Math.ceil((deadline - now) / 1000)) : null;

  const handleAction = useCallback((type, payload = {}) => {
    const next = dispatch({ ...payload, type, bookingId: session.booking.id });
    if (next.booking.status !== session.booking.status) {
      onStatusChange?.(getBookingTab(next.booking.status));
      setDialog(next.booking.status === "payment_pending" ? "payment" : null);
    }
    setConfirmation(null);
    if (type === "assign_staff" && next.booking.assignedStaff?.id === payload.staffId) setDialog(null);
    return next;
  }, [dispatch, session.booking.id, session.booking.status, onStatusChange]);

  return {
    ...session,
    sessions,
    staffMembers,
    available,
    activity,
    notification,
    now,
    seconds,
    dialog,
    confirmation,
    handleAction,
    onView: (bookingId) => {
      const target = sessions.find((item) => item.booking.id === bookingId) ?? session;
      setSelectedBookingId(target.booking.id);
      setDialog(target.booking.status === "payment_pending" ? "payment" : "details");
    },
    onAssign: (bookingId) => {
      const target = sessions.find((item) => item.booking.id === bookingId) ?? session;
      setSelectedBookingId(target.booking.id);
      setDialog("assign");
    },
    onClose: () => setDialog(null),
    onConfirm: (type, bookingId) => {
      if (sessions.some((item) => item.booking.id === bookingId)) setSelectedBookingId(bookingId);
      setDialog(null);
      setConfirmation(type);
    },
    onClearConfirmation: () => setConfirmation(null),
  };
}
