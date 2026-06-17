import { useCallback, useEffect, useRef, useState } from "react";

export function useWebRTCCall(socket) {
  const [callState, setCallState] = useState("idle");
  const [incomingCall, setIncomingCall] = useState(null);
  const [activeCall, setActiveCall] = useState(null);

  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);
  const remoteAudioRef = useRef(new Audio());
  const ringtoneAudioRef = useRef(null);
  const ringtonePlayingRef = useRef(false);

  const stopRingtone = useCallback(() => {
    if (ringtoneAudioRef.current) {
      ringtoneAudioRef.current.pause();
      ringtoneAudioRef.current.currentTime = 0;
    }

    ringtonePlayingRef.current = false;
  }, []);

  const startRingtone = useCallback(async () => {
    if (ringtonePlayingRef.current) return;

    try {
      if (!ringtoneAudioRef.current) {
        ringtoneAudioRef.current = new Audio("/notifyy.mp3");
        ringtoneAudioRef.current.loop = true;
        ringtoneAudioRef.current.preload = "auto";
      }

      ringtonePlayingRef.current = true;
      await ringtoneAudioRef.current.play();
    } catch (error) {
      console.warn("Unable to start ringtone:", error);
      stopRingtone();
    }
  }, [stopRingtone]);

  const getLocalStream = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    localStreamRef.current = stream;
    return stream;
  }, []);

  const cleanup = useCallback(() => {
    stopRingtone();

    if (peerConnectionRef.current) {
      try {
        peerConnectionRef.current.close();
      } catch {
        // ignore close errors
      }
      peerConnectionRef.current = null;
    }

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }

    remoteAudioRef.current.srcObject = null;
    setIncomingCall(null);
    setActiveCall(null);
    setCallState("idle");
  }, [stopRingtone]);

  const createPeerConnection = useCallback(
    (iceServers) => {
      const pc = new RTCPeerConnection({ iceServers });

      pc.onicecandidate = (event) => {
        if (!event.candidate) return;

        const target = activeCall || incomingCall;
        if (!target) return;

        socket.emit("call:ice-candidate", {
          bookingId: target.bookingId,
          targetId: target.targetId || target.callerId,
          targetType: target.targetType || target.callerType,
          candidate: event.candidate,
        });
      };

      pc.ontrack = (event) => {
        remoteAudioRef.current.srcObject = event.streams[0];
        remoteAudioRef.current.play().catch((error) => {
          console.warn("Remote audio playback failed:", error);
        });
      };

      peerConnectionRef.current = pc;
      return pc;
    },
    [socket, activeCall, incomingCall],
  );

  const initiateCall = useCallback(
    async ({ bookingId, receiverId, receiverType, iceServers }) => {
      try {
        setCallState("calling");
        setActiveCall({ bookingId, targetId: receiverId, targetType: receiverType });
        startRingtone();

        const stream = await getLocalStream();
        const pc = createPeerConnection(iceServers);
        stream.getTracks().forEach((track) => pc.addTrack(track, stream));

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        socket.emit("call:initiate", {
          bookingId,
          targetId: receiverId,
          targetType: receiverType,
          offer,
        });
      } catch (error) {
        console.error("Failed to initiate call:", error);
        cleanup();
      }
    },
    [socket, createPeerConnection, getLocalStream, startRingtone, cleanup],
  );

  const answerCall = useCallback(async () => {
    try {
      if (!incomingCall?.offer) {
        console.warn("Answer blocked: offer not ready yet");
        return;
      }

      const { callerId, callerType, bookingId, offer, iceServers } = incomingCall;
      if (!iceServers || !iceServers.length) {
        console.warn("Answer blocked: ICE servers not ready yet");
        return;
      }

      const stream = await getLocalStream();
      const pc = createPeerConnection(iceServers);
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      await pc.setRemoteDescription(new RTCSessionDescription(offer));

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.emit("call:answer", {
        bookingId,
        callerId,
        callerType,
        answer,
      });

      setActiveCall({ bookingId, targetId: callerId, targetType: callerType });
      setCallState("active");
      stopRingtone();
    } catch (error) {
      console.error("Failed to answer call:", error);
      setCallState("incoming");
    }
  }, [incomingCall, createPeerConnection, getLocalStream, socket, stopRingtone]);

  const rejectCall = useCallback(() => {
    if (!incomingCall) return;

    socket.emit("call:reject", {
      bookingId: incomingCall.bookingId,
      callerId: incomingCall.callerId,
      callerType: incomingCall.callerType,
    });
    cleanup();
  }, [incomingCall, socket, cleanup]);

  const endCall = useCallback(() => {
    if (!activeCall) return;

    socket.emit("call:end", {
      bookingId: activeCall.bookingId,
      targetId: activeCall.targetId,
      targetType: activeCall.targetType,
    });
    cleanup();
  }, [activeCall, socket, cleanup]);

  const handleCallAnswered = useCallback(
    async ({ answer, fromId, fromType }) => {
      try {
        stopRingtone();
        setCallState("active");

        if (fromId && fromType) {
          setActiveCall((prev) =>
            prev ?? {
              bookingId: incomingCall?.bookingId,
              targetId: fromId,
              targetType: fromType,
            },
          );
        }

        if (peerConnectionRef.current && answer) {
          await peerConnectionRef.current.setRemoteDescription(
            new RTCSessionDescription(answer),
          );
        }
      } catch (error) {
        console.error("Failed to set remote description:", error);
      }
    },
    [incomingCall?.bookingId, stopRingtone],
  );

  useEffect(() => {
    if (!socket) return;

    const onIncomingCall = (data) => {
      setIncomingCall(data);
      setCallState("incoming");
      startRingtone();
    };

    const onAnswer = (payload) => {
      handleCallAnswered(payload);
    };

    const onIceCandidate = async ({ candidate }) => {
      try {
        await peerConnectionRef.current?.addIceCandidate(
          new RTCIceCandidate(candidate),
        );
      } catch (error) {
        console.error("ICE candidate error:", error);
      }
    };

    socket.on("call:incoming", onIncomingCall);
    socket.on("call:answer", onAnswer);
    socket.on("call:answered", onAnswer);
    socket.on("call:ice-candidate", onIceCandidate);
    socket.on("call:rejected", cleanup);
    socket.on("call:ended", () => {
      cleanup();
      setCallState("ended");
      setTimeout(() => setCallState("idle"), 2000);
    });

    return () => {
      socket.off("call:incoming", onIncomingCall);
      socket.off("call:answer", onAnswer);
      socket.off("call:answered", onAnswer);
      socket.off("call:ice-candidate", onIceCandidate);
      socket.off("call:rejected", cleanup);
      socket.off("call:ended");
    };
  }, [socket, cleanup, handleCallAnswered, startRingtone]);

  return {
    callState,
    incomingCall,
    activeCall,
    initiateCall,
    answerCall,
    rejectCall,
    endCall,
  };
}
