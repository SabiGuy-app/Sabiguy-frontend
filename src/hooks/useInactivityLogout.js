import { useCallback, useEffect, useRef, useState } from "react";

const DEFAULT_INACTIVITY_MS = 10 * 60 * 1000;
const DEFAULT_WARNING_GRACE_MS = 5 * 60 * 1000;

export default function useInactivityLogout({
  enabled = true,
  inactivityMs = DEFAULT_INACTIVITY_MS,
  warningGraceMs = DEFAULT_WARNING_GRACE_MS,
  onTimeout,
}) {
  const [showWarning, setShowWarning] = useState(false);
  const warningTimeoutRef = useRef(null);
  const logoutTimeoutRef = useRef(null);

  const clearTimers = useCallback(() => {
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
      warningTimeoutRef.current = null;
    }
    if (logoutTimeoutRef.current) {
      clearTimeout(logoutTimeoutRef.current);
      logoutTimeoutRef.current = null;
    }
  }, []);

  const startTimers = useCallback(() => {
    clearTimers();
    warningTimeoutRef.current = setTimeout(() => {
      setShowWarning(true);
      logoutTimeoutRef.current = setTimeout(() => {
        setShowWarning(false);
        onTimeout?.();
      }, warningGraceMs);
    }, inactivityMs);
  }, [clearTimers, inactivityMs, onTimeout, warningGraceMs]);

  const handleActivity = useCallback(() => {
    if (!enabled) return;
    if (showWarning) return;
    startTimers();
  }, [enabled, showWarning, startTimers]);

  const extendSession = useCallback(() => {
    if (!enabled) return;
    if (showWarning) setShowWarning(false);
    startTimers();
  }, [enabled, showWarning, startTimers]);

  const logoutNow = useCallback(() => {
    clearTimers();
    setShowWarning(false);
    onTimeout?.();
  }, [clearTimers, onTimeout]);

  useEffect(() => {
    if (!enabled) {
      clearTimers();
      setShowWarning(false);
      return undefined;
    }

    const events = [
      "mousemove",
      "mousedown",
      "keydown",
      "touchstart",
      "scroll",
      "click",
      "focus",
    ];

    events.forEach((event) => window.addEventListener(event, handleActivity));
    startTimers();

    return () => {
      events.forEach((event) => window.removeEventListener(event, handleActivity));
      clearTimers();
    };
  }, [clearTimers, enabled, handleActivity, startTimers]);

  return { showWarning, extendSession, logoutNow };
}
