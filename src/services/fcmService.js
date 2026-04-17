import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "./firebase";

// Helper to check browser capabilities
function checkBrowserSupport() {
  const support = {
    serviceWorker: "serviceWorker" in navigator,
    notification: "Notification" in window,
    https:
      window.location.protocol === "https:" ||
      window.location.hostname === "localhost",
  };

  console.log("🔍 Browser Support Check:", support);

  if (!support.serviceWorker) {
    console.error("❌ Service Workers not supported");
    return false;
  }
  if (!support.notification) {
    console.error("❌ Notifications not supported");
    return false;
  }
  if (!support.https) {
    console.error(
      "❌ HTTPS required (or localhost). Current protocol:",
      window.location.protocol,
    );
    return false;
  }

  return true;
}

// Register Service Worker and wait for it to be ready
async function ensureServiceWorkerReady() {
  if (!("serviceWorker" in navigator)) {
    throw new Error("Service Workers not supported");
  }

  try {
    console.log("📋 Registering Service Worker from /firebase-messaging-sw.js");
    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js",
      {
        scope: "/",
      },
    );

    console.log("✅ Service Worker registered successfully:", registration);

    // Wait for service worker to be ready
    await navigator.serviceWorker.ready;
    console.log("✅ Service Worker is ready");

    return registration;
  } catch (error) {
    console.error("❌ Service Worker registration failed:", error);
    throw error;
  }
}

export async function requestNotificationPermission() {
  try {
    // Check browser support first
    if (!checkBrowserSupport()) {
      console.warn("⚠️ Browser does not support all required features for FCM");
      return null;
    }

    console.log("📱 Requesting notification permission...");
    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      console.warn("⚠️ Notification permission denied or dismissed");
      return null;
    }

    console.log("✅ Notification permission granted");

    // Ensure Service Worker is registered and ready
    await ensureServiceWorkerReady();

    console.log("🔑 Requesting FCM token...");
    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    });

    if (token) {
      console.log("📱 FCM Token retrieved successfully:", token);
      return token;
    } else {
      console.error("❌ No FCM token returned from getToken()");
      return null;
    }
  } catch (error) {
    console.error("❌ Error getting FCM token:", {
      message: error.message,
      code: error.code,
      name: error.name,
      stack: error.stack,
    });
    return null;
  }
}

export function listenForMessages(callback) {
  try {
    onMessage(messaging, (payload) => {
      console.log("🔔 Foreground message received:", payload);

      if (Notification.permission === "granted") {
        new Notification(payload.notification.title, {
          body: payload.notification.body,
          icon: "/logo.png",
          badge: "/badge.png",
          tag: payload.data?.bookingId || "notification",
          data: payload.data,
        });
      }

      // Call custom callback
      if (callback) {
        callback(payload);
      }
    });
  } catch (error) {
    console.error("❌ Error setting up message listener:", error);
  }
}
