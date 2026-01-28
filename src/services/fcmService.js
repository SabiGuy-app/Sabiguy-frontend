import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "./firebase";


export async function requestNotificationPermission () {
    try {
        const permission = await Notification.requestPermission();

        if(permission === 'granted') {
          console.log('✅ Notification permission granted');

          const token = await getToken(messaging, {
            vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY
          });
          if (token) {
        console.log('📱 FCM Token:', token);
        return token;
      } else {
        console.warn('⚠️ No registration token available');
        return null;
      }
    } else {
      console.warn('⚠️ Notification permission denied');
      return null;
    }
  } catch (error) {
    console.error('❌ Error getting FCM token:', error);
    return null;
  }
}

export function listenForMessages(callback) {
    onMessage(messaging, (payload) => {
     console.log('🔔 Message received:', payload);

     if  (Notification.permission === 'granted') {
      new Notification(payload.notification.title, {
        body: payload.notification.body,
        icon: '/logo.png', // Your app icon
        badge: '/badge.png',
        tag: payload.data?.bookingId || 'notification',
        data: payload.data
      });
    }
    
    // Call custom callback
    if (callback) {
      callback(payload);
    }
  });
}
