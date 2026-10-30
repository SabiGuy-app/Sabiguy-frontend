import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  acceptBusinessBooking,
  assignBookingStaff,
  declineBusinessBooking,
  getBookingStaffCandidates,
  getBusinessBookings,
  getBusinessStaff,
} from "../../api/businessess";
import { useBusinessSession } from "../session/businessSessionContext";
import { canAssignStaff, normalizeBusinessBooking } from "../utils/businessBookings";
import { getBookingDeadline, getBookingTab } from "../utils/bookings";

// One page covers every tab and its count; raise this or paginate per tab if
// businesses outgrow it.
const BOOKINGS_LIMIT = 100;
const ROSTER_LIMIT = 100;

const getErrorMessage = (error, fallback) => error?.response?.data?.message || fallback;

// Bookings, staff roster and the dialog/action state shared by the overview
// and bookings pages. onStatusChange(tab) fires when an action moves a booking.
export default function useBusinessBookings({ onStatusChange } = {}) {
  const { business, available } = useBusinessSession();
  const businessId = business?._id;
  const [records, setRecords] = useState([]);
  const [roster, setRoster] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [now, setNow] = useState(() => Date.now());
  const [selectedId, setSelectedId] = useState(null);
  const [dialog, setDialog] = useState(null);
  const [confirmation, setConfirmation] = useState(null);
  const [busyAction, setBusyAction] = useState(null);
  const [candidates, setCandidates] = useState({ bookingId: null, list: [], loading: false, error: "" });

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const load = useCallback(async ({ silent = false } = {}) => {
    if (!businessId) return null;
    if (!silent) setLoading(true);
    try {
      const [bookingResult, staffResult] = await Promise.all([
        getBusinessBookings(businessId, { page: 1, limit: BOOKINGS_LIMIT }),
        getBusinessStaff(businessId, { status: "ACTIVE", limit: ROSTER_LIMIT }).catch(() => null),
      ]);
      setRecords(bookingResult.bookings);
      if (staffResult) setRoster(staffResult.staff ?? []);
      setError("");
      return { records: bookingResult.bookings, roster: staffResult?.staff ?? null };
    } catch (loadError) {
      setError(getErrorMessage(loadError, "Couldn't load bookings."));
      return null;
    } finally {
      setLoading(false);
    }
  }, [businessId]);

  useEffect(() => {
    load();
  }, [load]);

  // BusinessSession fires this when a new booking request arrives.
  useEffect(() => {
    const refresh = () => load({ silent: true });
    window.addEventListener("business:booking-request", refresh);
    return () => window.removeEventListener("business:booking-request", refresh);
  }, [load]);
  const bookings = useMemo(
    () => records.map((record) => normalizeBusinessBooking(record, roster)),
    [records, roster],
  );
  const booking = bookings.find((item) => item.id === selectedId) ?? null;
  const deadline = booking ? Date.parse(getBookingDeadline(booking)) : NaN;
  const seconds = Number.isFinite(deadline) ? Math.max(0, Math.ceil((deadline - now) / 1000)) : null;

  const loadCandidates = useCallback(async (bookingId) => {
    if (!businessId) return;
    setCandidates({ bookingId, list: [], loading: true, error: "" });
    try {
      const data = await getBookingStaffCandidates(businessId, bookingId);
      setCandidates({ bookingId, list: data?.candidates ?? [], loading: false, error: "" });
    } catch (candidateError) {
      setCandidates({ bookingId, list: [], loading: false, error: getErrorMessage(candidateError, "Couldn't load your staff.") });
    }
  }, [businessId]);

  // While the payment modal is open, poll for the customer's payment so the
  // modal can close itself and the business can move on to assigning staff.
  useEffect(() => {
    if (dialog !== "payment" || !booking || !businessId) return undefined;
    const bookingId = booking.id;
    let active = true;
    const poll = async () => {
      try {
        const refreshed = await load({ silent: true });
        const record = refreshed?.records?.find((item) => item._id === bookingId);
        const rawStatus = String(record?.status || "").toLowerCase();
        if (active && (rawStatus === "paid_escrow" || rawStatus === "paid_escrow_scheduled")) {
          toast.success("Payment confirmed. You can now assign a staff member.");
          setDialog("assign");
          loadCandidates(bookingId);
        }
      } catch {
        // Keep polling; a temporary error should not close the flow.
      }
    };
    const intervalId = setInterval(poll, 5000);
    poll();
    return () => {
      active = false;
      clearInterval(intervalId);
    };
  }, [dialog, booking?.id, businessId]); // eslint-disable-line react-hooks/exhaustive-deps


  const open = useCallback((bookingId, nextDialog) => {
    const target = bookings.find((item) => item.id === bookingId);
    if (!target) return;
    const resolvedDialog = nextDialog ?? (target.status === "payment_pending" ? "payment" : "details");
    setSelectedId(bookingId);
    setDialog(resolvedDialog);
    if (resolvedDialog === "assign" || target.requestedStaffCode || canAssignStaff(target)) {
      loadCandidates(bookingId);
    }
  }, [bookings, loadCandidates]);

  const onView = useCallback((bookingId) => open(bookingId), [open]);

  // Runs an API action for the selected booking, then reloads so the UI shows
  // the backend's resulting status. Returns the refreshed booking, or null.
  const runAction = async (name, request, successMessage) => {
    if (!booking || busyAction) return null;
    const bookingId = booking.id;
    setBusyAction(name);
    try {
      await request();
      toast.success(successMessage);
      const refreshed = await load({ silent: true });
      const record = refreshed?.records.find((item) => item._id === bookingId);
      const next = record ? normalizeBusinessBooking(record, refreshed.roster ?? roster) : null;
      if (next && next.status !== booking.status) onStatusChange?.(getBookingTab(next.status));
      return next;
    } catch (actionError) {
      toast.error(getErrorMessage(actionError, "Something went wrong. Please try again."));
      return null;
    } finally {
      setBusyAction(null);
    }
  };

  const accept = async () => {
    const next = await runAction("accept", () => acceptBusinessBooking(businessId, booking.id), "Booking accepted");
    if (!next) return;
    setDialog(next.status === "payment_pending" ? "payment" : "details");
    if (canAssignStaff(next)) loadCandidates(next.id);
  };

  const decline = async () => {
    setConfirmation(null);
    const next = await runAction("decline", () => declineBusinessBooking(booking.id), "Booking declined");
    if (next) setDialog(null);
  };

  const assignStaff = async (staffId) => {
    const next = await runAction("assign", () => assignBookingStaff(businessId, booking.id, staffId), "Staff assigned");
    if (!next) return;
    setDialog("details");
    loadCandidates(next.id);
  };

  return {
    bookings,
    loading,
    error,
    reload: load,
    now,
    available,
    booking,
    seconds,
    dialog,
    confirmation,
    busyAction,
    candidates: booking && candidates.bookingId === booking.id ? candidates : { list: [], loading: false, error: "" },
    onView,
    onAssign: (bookingId) => open(bookingId ?? booking?.id, "assign"),
    onClose: () => setDialog(null),
    onConfirm: (type, bookingId) => {
      if (bookingId) setSelectedId(bookingId);
      setDialog(null);
      setConfirmation(type);
    },
    onClearConfirmation: () => setConfirmation(null),
    onAccept: accept,
    onDecline: decline,
    onAssignStaff: assignStaff,
  };
}
