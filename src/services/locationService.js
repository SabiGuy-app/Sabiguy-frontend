class LocationService {
  constructor() {
    this.watchId = null;
    this.socket = null;
    this.lastGeocodedCoords = null;
    this.geocodeThresholdKm = 0.5; // only re-geocode if moved 500m
  }

  // ── Start tracking ────────────────────────────────────────────────────────
  startTracking(socket) {
    if (!navigator.geolocation) {
      console.error("Geolocation not supported");
      return;
    }

    this.socket = socket;

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

  // ── Handle location updates ───────────────────────────────────────────────
  async onLocationUpdate(position) {
    const { latitude, longitude, accuracy } = position.coords;

    // Accuracy logging
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

    // Resolve address on device (free, no API key)
    const address = await this.resolveAddress(latitude, longitude);

    // Send to backend via Socket.IO (real-time)
    if (this.socket && this.socket.connected) {
      this.socket.emit("update_location", {
        latitude,
        longitude,
        accuracy,
        address, // ✅ send resolved address with coords
      });
    }

    // HTTP backup every 30 seconds
    this.throttledHTTPUpdate(latitude, longitude, address);
  }

  // ── Resolve address using Nominatim (OpenStreetMap) ───────────────────────
  // Free, no API key, decent Nigerian street data
  async resolveAddress(latitude, longitude) {
    try {
      // Skip geocoding if we haven't moved significantly
      if (this.lastGeocodedCoords) {
        const distance = this.calculateDistance(
          this.lastGeocodedCoords.lat,
          this.lastGeocodedCoords.lng,
          latitude,
          longitude,
        );

        if (distance < this.geocodeThresholdKm) {
          console.log(
            `📌 Using cached address (moved ${distance.toFixed(3)}km)`,
          );
          return this.lastGeocodedCoords.address;
        }
      }

      console.log("🔄 Resolving address via Nominatim...");

      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`,
        {
          headers: {
            // Nominatim requires a User-Agent — use your app name
            "User-Agent": "SabiguyApp/1.0",
            "Accept-Language": "en",
          },
        },
      );

      if (!response.ok) throw new Error("Nominatim request failed");

      const data = await response.json();

      if (data && data.display_name) {
        // Use display_name and remove postal code
        const addr = data.address || {};
        let resolvedAddress = data.display_name;

        // Remove postal code from display_name if present
        if (addr.postcode) {
          resolvedAddress = resolvedAddress
            .replace(`, ${addr.postcode},`, ",")
            .replace(`, ${addr.postcode}`, "")
            .trim();
        }

        console.log(`✅ Address resolved: ${resolvedAddress}`);

        // Cache it
        this.lastGeocodedCoords = {
          lat: latitude,
          lng: longitude,
          address: resolvedAddress,
        };

        return resolvedAddress;
      }

      throw new Error("No address data returned");
    } catch (error) {
      console.warn("⚠️ Address resolution failed:", error.message);
      // Return null — backend will handle fallback
      return null;
    }
  }

  // ── Throttled HTTP update ─────────────────────────────────────────────────
  throttledHTTPUpdate = this.throttle((latitude, longitude, address) => {
    fetch(`${import.meta.env.VITE_BASE_URL}/provider/location`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ latitude, longitude, address }), // ✅ include address
    }).catch((err) =>
      console.warn("HTTP location update failed:", err.message),
    );
  }, 30000);

  // ── Haversine distance (km) ───────────────────────────────────────────────
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  // ── Throttle helper ───────────────────────────────────────────────────────
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
