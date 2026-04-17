importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js",
);

// Firebase config passed from the main app
const firebaseConfig = self.firebaseConfig || {
  apiKey: "AIzaSyC2b_3WVfgvhMKt5VZW0MzP1Rz6Z5X3Y8Q",
  authDomain: "sabiguy-e5f8b.firebaseapp.com",
  projectId: "sabiguy-e5f8b",
  storageBucket: "sabiguy-e5f8b.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456",
};

try {
  firebase.initializeApp(firebaseConfig);
  const messaging = firebase.messaging();
  console.log("[SW] Firebase messaging initialized successfully");
} catch (error) {
  console.error("[SW] Failed to initialize Firebase:", error);
}

// Handle background messages
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

// Handle notification click
self.addEventListener("notificationclick", (event) => {
  console.log("Notification clicked:", event);

  event.notification.close();

  // Open app or navigate to specific page
  const bookingId = event.notification.data?.bookingId;
  const url = bookingId ? `/dashboard/bookings/${bookingId}` : "/dashboard";

  event.waitUntil(clients.openWindow(url));
});
