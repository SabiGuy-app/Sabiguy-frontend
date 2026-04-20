// import { getToken, onMessage } from "firebase/messaging";
// import { messaging } from "./firebase";

// // Helper to check browser capabilities
// function checkBrowserSupport() {
//   const support = {
//     serviceWorker: "serviceWorker" in navigator,
//     notification: "Notification" in window,
//     https:
//       window.location.protocol === "https:" ||
//       window.location.hostname === "localhost",
//   };

//   console.log("🔍 Browser Support Check:", support);

//   if (!support.serviceWorker) {
//     console.error("❌ Service Workers not supported");
//     return false;
//   }
//   if (!support.notification) {
//     console.error("❌ Notifications not supported");
//     return false;
//   }
//   if (!support.https) {
//     console.error(
//       "❌ HTTPS required (or localhost). Current protocol:",
//       window.location.protocol,
//     );
//     return false;
//   }

//   return true;
// }

// // Register Service Worker and wait for it to be ready
// async function ensureServiceWorkerReady() {
//   if (!("serviceWorker" in navigator)) {
//     throw new Error("Service Workers not supported");
//   }

//   try {
//     console.log("📋 Registering Service Worker from /firebase-messaging-sw.js");
//     const registration = await navigator.serviceWorker.register(
//       "/firebase-messaging-sw.js",
//       {
//         scope: "/",
//       },
//     );

//     console.log("✅ Service Worker registered successfully:", registration);

//     // Wait for service worker to be ready
//     await navigator.serviceWorker.ready;
//     console.log("✅ Service Worker is ready");

//     return registration;
//   } catch (error) {
//     console.error("❌ Service Worker registration failed:", error);
//     throw error;
//   }
// }

// export async function requestNotificationPermission() {
//   try {
//     // Check browser support first
//     if (!checkBrowserSupport()) {
//       console.warn("⚠️ Browser does not support all required features for FCM");
//       return null;
//     }

//     console.log("📱 Requesting notification permission...");
//     const permission = await Notification.requestPermission();

//     if (permission !== "granted") {
//       console.warn("⚠️ Notification permission denied or dismissed");
//       return null;
//     }

//     console.log("✅ Notification permission granted");

//     // Ensure Service Worker is registered and ready
//     await ensureServiceWorkerReady();

//     console.log("🔑 Requesting FCM token...");
//     const token = await getToken(messaging, {
//       vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
//     });

//     if (token) {
//       console.log("📱 FCM Token retrieved successfully:", token);
//       return token;
//     } else {
//       console.error("❌ No FCM token returned from getToken()");
//       return null;
//     }
//   } catch (error) {
//     console.error("❌ Error getting FCM token:", {
//       message: error.message,
//       code: error.code,
//       name: error.name,
//       stack: error.stack,
//     });
//     return null;
//   }
// }

// export function listenForMessages(callback) {
//   try {
//     onMessage(messaging, (payload) => {
//       console.log("🔔 Foreground message received:", payload);

//       if (Notification.permission === "granted") {
//         new Notification(payload.notification.title, {
//           body: payload.notification.body,
//           icon: "/logo.png",
//           badge: "/badge.png",
//           tag: payload.data?.bookingId || "notification",
//           data: payload.data,
//         });
//       }

//       // Call custom callback
//       if (callback) {
//         callback(payload);
//       }
//     });
//   } catch (error) {
//     console.error("❌ Error setting up message listener:", error);
//   }
// }

import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "./firebase";
import NotificationSoundService from "./notificationSoundService"; // Import the sound service

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

    // Initialize notification sound during user interaction (this unlocks autoplay)
    console.log("🎵 Initializing audio service during user permission...");
    await NotificationSoundService.init();

    // Test the audio right after init to ensure it's working
    console.log("🔊 Testing audio playback after permission...");
    await NotificationSoundService.play().catch((error) => {
      console.warn("⚠️ Audio test play warning (this is okay):", error);
    });

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
    onMessage(messaging, async (payload) => {
      console.log("🔔 Foreground message received:", payload);

      // Ensure audio service is initialized (safety check)
      if (!NotificationSoundService.initialized) {
        console.log("⚠️ Audio service not initialized, initializing now...");
        await NotificationSoundService.init().catch((err) => {
          console.warn("Could not initialize audio:", err);
        });
      }

      // CRITICAL: Play sound - use fallback HTML5 Audio for reliability
      try {
        console.log("🎵 Playing notification sound...");
        await NotificationSoundService.play();
        console.log("✅ Notification sound played successfully");
      } catch (soundError) {
        console.error("❌ Failed to play notification sound:", soundError);
        // Try fallback: simple HTML5 audio as last resort
        try {
          const fallback = new Audio("/notify.mp3");
          fallback.volume = 1.0;
          fallback
            .play()
            .catch((e) => console.error("Fallback audio also failed:", e));
        } catch (e) {
          console.error("Fallback failed:", e);
        }
      }

      // Then show visual notification
      if (Notification.permission === "granted") {
        try {
          const notification = new Notification(
            payload.notification?.title || "New Notification",
            {
              body: payload.notification?.body || "",
              icon: payload.notification?.icon || "/logo.png",
              badge: "/badge.png",
              tag: payload.data?.bookingId || "notification",
              data: payload.data,
              requireInteraction: false,
              silent: true, // IMPORTANT: Set to true since we're playing custom sound
              vibrate: [200, 100, 200], // Vibration pattern
            },
          );

          console.log("✅ Notification shown:", notification);
        } catch (notifError) {
          console.error("❌ Failed to show notification:", notifError);
        }
      }

      // Call custom callback
      if (callback) {
        callback(payload);
      }
    });

    console.log("✅ Message listener set up successfully");
  } catch (error) {
    console.error("❌ Error setting up message listener:", error);
  }
}
