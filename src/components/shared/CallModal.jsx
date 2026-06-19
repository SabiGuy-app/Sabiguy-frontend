import { X, Phone, PhoneOff, Mic } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useWebRTCCall } from "../../hooks/useWebRTCCall";

export function CallModal({ isOpen, onClose, socket, booking, currentUser, targetOverride }) {
  const {
    callState,
    incomingCall,
    initiateCall,
    answerCall,
    rejectCall,
    endCall,
  } = useWebRTCCall(socket);

  const [iceServers, setIceServers] = useState(null);
  const bookingData = booking?.data?.booking || booking?.originalData || booking || {};
  const userData = currentUser?.data || currentUser || {};

  const isProvider = userData.role === "provider";
  const derivedTargetId = isProvider
    ? bookingData?.userId?._id ||
      bookingData?.userId ||
      bookingData?.buyerId?._id ||
      bookingData?.buyerId ||
      bookingData?.customerId?._id ||
      bookingData?.customerId
    : bookingData?.providerId?._id || bookingData?.providerId;
  const targetId = targetOverride?.targetId || derivedTargetId;
  const targetType =
    targetOverride?.targetType || (isProvider ? "buyer" : "provider");
  const targetName =
    targetOverride?.targetName ||
    (isProvider
      ? bookingData?.userId?.fullName ||
        bookingData?.buyerId?.fullName ||
        bookingData?.customerId?.fullName ||
        "Customer"
      : bookingData?.providerId?.fullName ||
        bookingData?.providerName ||
        "Provider");
  const bookingId = bookingData?._id || bookingData?.id;
  const modalOpen =
    isOpen ||
    callState === "incoming" ||
    callState === "calling" ||
    callState === "active" ||
    callState === "ended";

  useEffect(() => {
    const loadIceServers = async () => {
      if (!modalOpen || iceServers) return;

      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const apiBase = import.meta.env.VITE_BASE_URL;
        console.log("[CallModal] loading ICE servers from:", `${apiBase}/api/v1/call/ice-servers`);
        const response = await fetch(
          `${apiBase}/api/v1/call/ice-servers`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const data = await response.json();
        console.log("ICE response:", data);
        console.log(
          "TURN present:",
          data?.iceServers?.some((s) => String(s.urls).includes("turn:")),
        );
        setIceServers(data?.iceServers || []);
        console.log("[CallModal] ICE servers stored");
      } catch (error) {
        console.error("Failed to load ICE servers:", error);
        setIceServers([]);
      }
    };

    loadIceServers();
  }, [modalOpen, iceServers]);

  const startCall = async () => {
    await initiateCall({
      bookingId,
      receiverId: targetId,
      receiverType: targetType,
      iceServers,
    });
  };

  const modalTitle = useMemo(() => {
    if (callState === "incoming") return "Incoming call";
    if (callState === "calling") return `Calling ${targetName}`;
    if (callState === "active") return `Live call with ${targetName}`;
    if (callState === "ended") return "Call ended";
    return `Call ${targetName}`;
  }, [callState, targetName]);

  const canAnswer = !!incomingCall?.offer && !!incomingCall?.iceServers?.length;

  if (!modalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-gray-900">{modalTitle}</p>
            <p className="text-xs text-gray-500">
              Booking {bookingId ? bookingId.slice(-6).toUpperCase() : "—"}
            </p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full p-2 hover:bg-gray-100">
            <X className="h-4 w-4 text-gray-600" />
          </button>
        </div>

        <div className="space-y-4 px-4 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#005823]/10">
              <Mic className="h-5 w-5 text-[#005823]" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">{targetName}</p>
              <p className="text-sm text-gray-500">
                {callState === "idle" && "Ready to start a call"}
                {callState === "calling" && "Ringing..."}
                {callState === "incoming" && "Someone is calling you"}
                {callState === "active" && "Connected"}
                {callState === "ended" && "The call has ended"}
              </p>
            </div>
          </div>

          {callState === "idle" && (
            <button
              type="button"
              onClick={startCall}
              disabled={!iceServers}
              className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white ${
                iceServers ? "bg-[#005823] hover:opacity-95" : "cursor-not-allowed bg-gray-300"
              }`}
            >
              <Phone className="h-4 w-4" />
              Start Call
            </button>
          )}

          {callState === "calling" && (
            <button
              type="button"
              onClick={endCall}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              <PhoneOff className="h-4 w-4" />
              Cancel Call
            </button>
          )}

          {callState === "incoming" && (
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={answerCall}
                disabled={!canAnswer}
                className={`rounded-xl px-4 py-3 text-sm font-semibold text-white ${
                  canAnswer ? "bg-[#005823]" : "cursor-not-allowed bg-gray-300"
                }`}
              >
                {canAnswer ? "Answer" : "Waiting for call setup..."}
              </button>
              <button
                type="button"
                onClick={rejectCall}
                className="rounded-xl border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700"
              >
                Reject
              </button>
            </div>
          )}

          {callState === "active" && (
            <button
              type="button"
              onClick={endCall}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              <PhoneOff className="h-4 w-4" />
              End Call
            </button>
          )}

          {callState === "ended" && (
            <button
              type="button"
              onClick={onClose}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Close
            </button>
          )}

          {!iceServers && callState === "idle" && (
            <p className="text-xs text-gray-500">Loading call servers...</p>
          )}
        </div>
      </div>
    </div>
  );
}
