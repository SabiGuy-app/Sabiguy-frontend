importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyB-SSb4TI5lmP7tepmY_Q3NmB-bcO8Vob4",
  authDomain: "sabiguy-5.firebaseapp.com",
  projectId: "sabiguy-5",
  storageBucket: "sabiguy-5.firebasestorage.app",
  messagingSenderId: "654565219442",
  appId: "1:654565219442:web:fb142c3e4240a4141a36eb"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Background message received:', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo.png',
    badge: '/badge.png',
    data: payload.data
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  
  event.notification.close();
  
  // Open app or navigate to specific page
  const bookingId = event.notification.data?.bookingId;
  const url = bookingId 
    ? `/dashboard/bookings/${bookingId}` 
    : '/dashboard';
  
  event.waitUntil(
    clients.openWindow(url)
  );
});

