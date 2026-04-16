class LocationService {
  constructor() {
    this.watchId = null;
    this.socket = null;
  }

  startTracking(socket) {
    if (!navigator.geolocation) {
      console.error("Geolocation not supported");
      return;
    }

    if (socket !== undefined) {
      this.socket = socket;
    }

    if (this.watchId) {
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };

    this.watchId = navigator.geolocation.watchPosition(
      (position) => this.onLocationUpdate(position),
      (error) => this.onLocationError(error),
      options,
    );

    console.log("📍 Location tracking started");
  }

  onLocationUpdate(position) {
    const { latitude, longitude, accuracy } = position.coords;

    let locationSource;
    let sourceEmoji;

    if (accuracy < 20) {
      locationSource = "GPS (Satellite)";
      sourceEmoji = "🛰️";
    } else if (accuracy < 100) {
      locationSource = "Wi-Fi Positioning";
      sourceEmoji = "📶";
    } else if (accuracy < 1000) {
      locationSource = "Cell Tower Triangulation";
      sourceEmoji = "📡";
    } else {
      locationSource = "IP Geolocation (ISP Server)";
      sourceEmoji = "🌐";
    }

    console.log(`${sourceEmoji} Location Source: ${locationSource}`);
    console.log("📍 Coordinates:", {
      latitude,
      longitude,
      accuracy: `${Math.round(accuracy)}m`,
      timestamp: new Date(position.timestamp).toLocaleTimeString(),
    });

    if (accuracy > 1000) {
      console.warn("⚠️ Very poor accuracy — likely IP-based, not GPS");
    }

    this.sendLocation(latitude, longitude, accuracy);
  }

  sendLocation(latitude, longitude, accuracy) {
    if (this.socket && this.socket.connected) {
      this.socket.emit("update_location", {
        latitude,
        longitude,
        accuracy,
      });
    }

    this.throttledHTTPUpdate(latitude, longitude);
  }

  throttledHTTPUpdate = this.throttle((latitude, longitude) => {
    this.httpUpdate(latitude, longitude);
  }, 30000);

  httpUpdate(latitude, longitude) {
    fetch(`${import.meta.env.VITE_BASE_URL}/provider/location`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        latitude,
        longitude,
        timestamp: Date.now(),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        const address = data.data?.currentLocation?.address;
        if (address) {
          localStorage.setItem("currentLocationAddress", address);
          console.log("📍 Address saved:", address);
        }
      })
      .catch((error) => console.error("Error updating location:", error));
  }

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

  stopTracking() {
    if (this.watchId) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
      console.log("📍 Location tracking stopped");
    }
  }
}

export default new LocationService();
