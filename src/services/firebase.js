import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

console.log("🔥 Initializing Firebase...");

export const app = initializeApp(firebaseConfig);

let messaging = null;

try {
  messaging = getMessaging(app);
  console.log("✅ Firebase messaging initialized");
} catch (error) {
  console.error("❌ Firebase messaging initialization failed:", error);
  console.error("   This might be expected in non-secure contexts");
}

export { messaging };
