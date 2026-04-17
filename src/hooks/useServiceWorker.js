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
      } catch (error) {
        console.error("❌ Service Worker registration failed:", error);
        // Don't throw - graceful fallback if SW registration fails
      }
    };

    registerServiceWorker();
  }, []);
}
