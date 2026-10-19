export function getResponseWindow(booking, now) {
  const deadline = Date.parse(booking.expiresAt);
  const duration = (booking.responseWindowSeconds || 180) * 1000;
  const remaining = Number.isFinite(deadline) && Number.isFinite(now) ? Math.max(0, deadline - now) : null;
  return {
    seconds: remaining === null ? null : Math.ceil(remaining / 1000),
    percent: remaining === null ? 0 : Math.min(100, remaining / duration * 100),
  };
}

export function isRequestExpired(booking, occurredAt) {
  const { seconds } = getResponseWindow(booking, Date.parse(occurredAt));
  return booking.status === "pending" && seconds === 0;
}
