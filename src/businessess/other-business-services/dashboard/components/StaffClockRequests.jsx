import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import DashboardCard from "./DashboardCard";
import { getBusinessClockRequests, respondToStaffClockRequest } from "../../api/businessess";

const formatRequestedAt = (value) => {
  if (!value) return "Request time unavailable";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Request time unavailable"
    : `Requested ${date.toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" })}`;
};

export default function StaffClockRequests({ businessId }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyStaffId, setBusyStaffId] = useState(null);
  const [rejectingStaffId, setRejectingStaffId] = useState(null);
  const [reason, setReason] = useState("");

  const loadRequests = useCallback(async () => {
    if (!businessId) {
      setRequests([]);
      setLoading(false);
      return;
    }
    try {
      const result = await getBusinessClockRequests(businessId);
      const list = Array.isArray(result) ? result : result?.requests || [];
      setRequests(list.filter((item) => item?.clockRequest?.status?.toLowerCase() === "pending"));
    } catch (error) {
      console.error("Could not load staff clock requests:", error);
    } finally {
      setLoading(false);
    }
  }, [businessId]);

  useEffect(() => {
    loadRequests();
    const timer = window.setInterval(loadRequests, 30000);
    const handleClockRequestNotification = () => loadRequests();
    window.addEventListener("business:staff-clock-request", handleClockRequestNotification);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("business:staff-clock-request", handleClockRequestNotification);
    };
  }, [loadRequests]);

  const respond = async (request, action) => {
    if (!businessId || !request?.staffId || busyStaffId) return;
    setBusyStaffId(request.staffId);
    try {
      const payload = { action };
      if (action === "reject" && reason.trim()) payload.reason = reason.trim();
      await respondToStaffClockRequest(businessId, request.staffId, payload);
      toast.success(action === "approve" ? "Staff clock request approved." : "Staff clock request rejected.");
      setRejectingStaffId(null);
      setReason("");
      await loadRequests();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Could not update the clock request.");
    } finally {
      setBusyStaffId(null);
    }
  };

  if (!loading && requests.length === 0) return null;

  return (
    <DashboardCard title="Staff clock requests" count={requests.length} className="business-clock-requests-card">
      <div className="business-clock-requests-list" aria-live="polite">
        {loading && requests.length === 0 ? <p className="business-empty">Loading clock requests…</p> : requests.map((request) => {
          const staffId = request.staffId;
          const actionLabel = request.clockRequest?.action?.toLowerCase() === "clock_out" ? "clock out" : "clock in";
          const isBusy = busyStaffId === staffId;
          return (
            <article className="business-clock-request" key={staffId}>
              <div className="business-clock-request-person">
                <img className="business-clock-request-avatar" src={request.profilePicture || "/avatar.png"} alt="" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = "/avatar.png"; }} />
                <div className="business-clock-request-details">
                  <h3>{request.fullName || "Staff member"}</h3>
                  <p>{request.role || "Staff"}{request.staffCode ? ` · ${request.staffCode}` : ""}</p>
                  <p>{request.email || ""}</p>
                </div>
                <span className="business-clock-request-type">Wants to {actionLabel}</span>
              </div>
              <p className="business-clock-request-time">{formatRequestedAt(request.clockRequest?.requestedAt)}</p>
              {rejectingStaffId === staffId ? (
                <div className="business-clock-reject-form">
                  <label htmlFor={`clock-reason-${staffId}`}>Reason (optional)</label>
                  <input id={`clock-reason-${staffId}`} value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Add a reason for rejecting" maxLength={300} />
                  <div className="business-clock-request-actions">
                    <button type="button" className="business-clock-button business-clock-button-muted" disabled={isBusy} onClick={() => { setRejectingStaffId(null); setReason(""); }}>Cancel</button>
                    <button type="button" className="business-clock-button business-clock-button-reject" disabled={isBusy} onClick={() => respond(request, "reject")}>{isBusy ? "Rejecting…" : "Confirm rejection"}</button>
                  </div>
                </div>
              ) : (
                <div className="business-clock-request-actions">
                  <button type="button" className="business-clock-button business-clock-button-muted" disabled={Boolean(busyStaffId)} onClick={() => { setRejectingStaffId(staffId); setReason(""); }}>Reject</button>
                  <button type="button" className="business-clock-button business-clock-button-approve" disabled={Boolean(busyStaffId)} onClick={() => respond(request, "approve")}>{isBusy ? "Approving…" : "Approve"}</button>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </DashboardCard>
  );
}
