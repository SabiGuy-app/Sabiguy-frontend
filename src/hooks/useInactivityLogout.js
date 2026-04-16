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
  const activityEventsRef = useRef([
    "mousemove",
    "mousedown",
    "keydown",
    "touchstart",
    "touchmove",
    "touchend",
    "pointerdown",
    "pointermove",
    "scroll",
    "wheel",
    "click",
    "focus",
    "visibilitychange",
    "pageshow",
  ]);
  const listenerOptionsRef = useRef({ capture: true, passive: true });

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
    if (document.visibilityState === "hidden") return;
    startTimers();
  }, [enabled, startTimers]);

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

    const events = activityEventsRef.current;
    const listenerOptions = listenerOptionsRef.current;

    events.forEach((event) => {
      if (event === "visibilitychange" || event === "pageshow") {
        document.addEventListener(event, handleActivity, listenerOptions);
        return;
      }

      window.addEventListener(event, handleActivity, listenerOptions);
    });

    startTimers();

    return () => {
      events.forEach((event) => {
        if (event === "visibilitychange" || event === "pageshow") {
          document.removeEventListener(event, handleActivity, listenerOptions);
          return;
        }

        window.removeEventListener(event, handleActivity, listenerOptions);
      });
      clearTimers();
    };
  }, [clearTimers, enabled, handleActivity, startTimers]);

  return { showWarning, extendSession, logoutNow };
}
