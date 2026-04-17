import { useEffect } from "react";

export function useServiceWorker() {
  useEffect(() => {
    // Register Service Worker for FCM notifications
    const registerServiceWorker = async () => {
      if (!("serviceWorker" in navigator)) {
        console.warn("⚠️ Service Workers not supported in this browser");
        return;
      }

      try {
        console.log("🚀 Attempting to register Service Worker...");
        const registration = await navigator.serviceWorker.register(
          "/firebase-messaging-sw.js",
          { scope: "/" },
        );
        console.log("✅ Service Worker registered successfully:", registration);

        // Pass Firebase config to service worker via postMessage
        if (navigator.serviceWorker.controller) {
          sendConfigToServiceWorker();
        } else {
          // If controller not ready, wait for it
          navigator.serviceWorker.addEventListener("controllerchange", () => {
            sendConfigToServiceWorker();
          });
        }
      } catch (error) {
        console.error("❌ Service Worker registration failed:", error);
        // Don't throw - graceful fallback if SW registration fails
      }
    };

    const sendConfigToServiceWorker = () => {
      const firebaseConfig = {
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
        storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
        appId: import.meta.env.VITE_FIREBASE_APP_ID,
      };

      navigator.serviceWorker.controller?.postMessage({
        type: "INIT_FIREBASE",
        config: firebaseConfig,
      });

      console.log("📨 Firebase config sent to Service Worker");
    };

    registerServiceWorker();
  }, []);
}
