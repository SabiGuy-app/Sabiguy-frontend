class UserLocationService {
  constructor() {
    this.watchId = null;
    this.socket = null;
  }

  setSocket(socket) {
    this.socket = socket;
  }

  /**
   * Start tracking user's location
   */
  startTracking(socket) {
    if (!navigator.geolocation) {
      console.error("Geolocation not supported");
      return;
    }

    if (socket !== undefined) {
      this.socket = socket;
    }

    // If already tracking, just update socket
    if (this.watchId) {
      return;
    }

    // Options for high accuracy
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };

    // Start watching position
    this.watchId = navigator.geolocation.watchPosition(
      (position) => this.onLocationUpdate(position),
      (error) => this.onLocationError(error),
      options,
    );

    console.log("📍 Location tracking started (user)");
  }

  /**
   * Handle location updates
   */
  onLocationUpdate(position) {
    const { latitude, longitude, accuracy } = position.coords;

    this.sendLocation(latitude, longitude, accuracy);
  }

  /**
   * Throttled HTTP update (backup)
   */
  throttledHTTPUpdate = this.throttle((latitude, longitude) => {
    this.httpUpdate(latitude, longitude);
  }, 30000); // Update via HTTP every 30 seconds

  httpUpdate(latitude, longitude) {
    fetch(`${import.meta.env.VITE_BASE_URL}/users/location`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ latitude, longitude }),
    });
  }

  sendLocation(latitude, longitude, accuracy) {
    // Send to backend via Socket.IO (real-time)
    if (this.socket && this.socket.connected) {
      this.socket.emit("update_location", {
        latitude,
        longitude,
        accuracy,
      });
    }

    // Also update via HTTP every 30 seconds (backup)
    this.throttledHTTPUpdate(latitude, longitude);
  }

  /**
   * Throttle helper
   */
  throttle(func, delay) {
    let lastCall = 0;
    return (...args) => {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        func(...args);
      }
    };
  }

  onLocationError(error) {
    console.error("Location error:", error.message);
  }

  /**
   * Stop tracking
   */
  stopTracking() {
    if (this.watchId) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
      console.log("📍 Location tracking stopped (user)");
    }
  }
}

export default new UserLocationService();
