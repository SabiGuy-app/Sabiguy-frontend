importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js",
);

let messaging = null;
let firebaseConfig = null;

// Listen for config from main app
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "INIT_FIREBASE") {
    firebaseConfig = event.data.config;
    console.log("[SW] Received Firebase config from main app");

    try {
      firebase.initializeApp(firebaseConfig);
      messaging = firebase.messaging();
      console.log("[SW] Firebase messaging initialized successfully");
    } catch (error) {
      console.error("[SW] Failed to initialize Firebase:", error);
    }
  }
});

// Handle background messages
if (messaging) {
  messaging.onBackgroundMessage((payload) => {
    console.log("Background message received:", payload);

    const notificationTitle = payload.notification.title;
    const notificationOptions = {
      body: payload.notification.body,
      icon: "/logo.png",
      badge: "/badge.png",
      data: payload.data,
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
  });
} else {
  console.warn("[SW] Firebase messaging not initialized yet");
}

// Handle notification click
self.addEventListener("notificationclick", (event) => {
  console.log("Notification clicked:", event);

  event.notification.close();

  // Open app or navigate to specific page
  const bookingId = event.notification.data?.bookingId;
  const url = bookingId ? `/dashboard/bookings/${bookingId}` : "/dashboard";

  event.waitUntil(clients.openWindow(url));
});
