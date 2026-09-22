/**
 * Shared Socket.io Manager
 *
 * Provides a single socket connection shared across the app
 * (Navbar notifications + useChat messaging).
 * Always reads the token from the Zustand auth store (fixes 2.5).
 * Falls back to localhost if VITE_WS_URL is not set (fixes 2.3).
 */
import { io } from "socket.io-client";
import { useAuthStore } from "../stores/auth.store";

const SOCKET_URL = import.meta.env.VITE_WS_URL || "http://localhost:3000";

let socket = null;
let consumerCount = 0;

/**
 * Get or create the shared Socket.io instance.
 * Multiple consumers (Navbar, useChat) share one connection.
 * Each consumer should call releaseSocket() on unmount.
 */
export const getSharedSocket = () => {
  const token = useAuthStore.getState().token;
  if (!token) return null;

  if (!socket || socket.disconnected) {
    socket = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10,
    });
  }

  consumerCount++;
  return socket;
};

/**
 * Release one consumer's hold on the socket.
 * Only disconnects when all consumers have released.
 */
export const releaseSocket = () => {
  consumerCount = Math.max(0, consumerCount - 1);
  if (consumerCount === 0 && socket) {
    socket.disconnect();
    socket = null;
  }
};

/**
 * Force disconnect (e.g. on logout). Resets all consumer counts.
 */
export const disconnectSocket = () => {
  consumerCount = 0;
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

/**
 * Read-only access to the current socket instance (may be null).
 */
export const getSocketInstance = () => socket;
