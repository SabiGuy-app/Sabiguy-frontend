// class UserLocationService {
//   constructor() {
//     this.watchId = null;
//     this.socket = null;
//     this.lastGeocodedCoords = null;
//     this.geocodeThresholdKm = 0.5; // only re-geocode if moved 500m
//   }

//   setSocket(socket) {
//     this.socket = socket;
//   }

//   /**
//    * Start tracking user's location
//    */
//   startTracking(socket) {
//     if (!navigator.geolocation) {
//       console.error("Geolocation not supported");
//       return;
//     }

//     if (socket !== undefined) {
//       this.socket = socket;
//     }

//     // If already tracking, just update socket
//     if (this.watchId) {
//       return;
//     }

//     // Options for high accuracy
//     const options = {
//       enableHighAccuracy: true,
//       timeout: 5000,
//       maximumAge: 0,
//     };

//     // Start watching position
//     this.watchId = navigator.geolocation.watchPosition(
//       (position) => this.onLocationUpdate(position),
//       (error) => this.onLocationError(error),
//       options,
//     );

//     console.log("📍 Location tracking started (user)");
//   }

//   /**
//    * Handle location updates
//    */
//   async onLocationUpdate(position) {
//     const { latitude, longitude, accuracy } = position.coords;

//     // Accuracy logging
//     let locationSource;
//     let sourceEmoji;

//     if (accuracy < 20) {
//       locationSource = "GPS (Satellite)";
//       sourceEmoji = "🛰️";
//     } else if (accuracy < 100) {
//       locationSource = "Wi-Fi Positioning";
//       sourceEmoji = "📶";
//     } else if (accuracy < 1000) {
//       locationSource = "Cell Tower Triangulation";
//       sourceEmoji = "📡";
//     } else {
//       locationSource = "IP Geolocation (ISP Server)";
//       sourceEmoji = "🌐";
//     }

//     console.log(`${sourceEmoji} Location Source: ${locationSource}`);
//     console.log("📍 Coordinates:", {
//       latitude,
//       longitude,
//       accuracy: `${Math.round(accuracy)}m`,
//       timestamp: new Date(position.timestamp).toLocaleTimeString(),
//     });

//     if (accuracy > 1000) {
//       console.warn("⚠️ Very poor accuracy — likely IP-based, not GPS");
//     }

//     // Resolve address on device (free, no API key)
//     const address = await this.resolveAddress(latitude, longitude);

//     this.sendLocation(latitude, longitude, accuracy, address);
//   }

//   /**
//    * Throttled HTTP update (backup)
//    */
//   throttledHTTPUpdate = this.throttle((latitude, longitude, address) => {
//     this.httpUpdate(latitude, longitude, address);
//   }, 30000); // Update via HTTP every 30 seconds

//   // ── Resolve address using Nominatim (OpenStreetMap) ───────────────────────
//   // Free, no API key, decent Nigerian street data
//   async resolveAddress(latitude, longitude) {
//     try {
//       // Skip geocoding if we haven't moved significantly
//       if (this.lastGeocodedCoords) {
//         const distance = this.calculateDistance(
//           this.lastGeocodedCoords.lat,
//           this.lastGeocodedCoords.lng,
//           latitude,
//           longitude,
//         );

//         if (distance < this.geocodeThresholdKm) {
//           console.log(
//             `📌 Using cached address (moved ${distance.toFixed(3)}km)`,
//           );
//           return this.lastGeocodedCoords.address;
//         }
//       }

//       console.log("🔄 Resolving address via Nominatim...");

//       const response = await fetch(
//         `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`,
//         {
//           headers: {
//             // Nominatim requires a User-Agent — use your app name
//             "User-Agent": "SabiguyApp/1.0",
//             "Accept-Language": "en",
//           },
//         },
//       );

//       if (!response.ok) throw new Error("Nominatim request failed");

//       const data = await response.json();

//       if (data && data.display_name) {
//         // Use display_name and remove postal code
//         const addr = data.address || {};
//         let resolvedAddress = data.display_name;

//         // Remove postal code from display_name if present
//         if (addr.postcode) {
//           resolvedAddress = resolvedAddress
//             .replace(`, ${addr.postcode},`, ",")
//             .replace(`, ${addr.postcode}`, "")
//             .trim();
//         }

//         console.log(`✅ Address resolved: ${resolvedAddress}`);

//         // Cache it
//         this.lastGeocodedCoords = {
//           lat: latitude,
//           lng: longitude,
//           address: resolvedAddress,
//         };

//         return resolvedAddress;
//       }

//       throw new Error("No address data returned");
//     } catch (error) {
//       console.warn("⚠️ Address resolution failed:", error.message);
//       // Return null — backend will handle fallback
//       return null;
//     }
//   }

//   httpUpdate(latitude, longitude, address) {
//     fetch(`${import.meta.env.VITE_BASE_URL}/users/location`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${localStorage.getItem("token")}`,
//       },
//       body: JSON.stringify({
//         latitude,
//         longitude,
//         address, // ✅ include resolved address
//         timestamp: Date.now(),
//       }),
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         // Save address to localStorage (client-resolved takes priority)
//         const addressToSave = address || data.data?.currentLocation?.address;
//         if (addressToSave) {
//           localStorage.setItem("currentLocationAddress", addressToSave);
//           console.log("📍 Address saved to localStorage:", addressToSave);
//         }
//       })
//       .catch((error) => console.error("Error updating location:", error));
//   }

//   sendLocation(latitude, longitude, accuracy, address) {
//     // Send to backend via Socket.IO (real-time)
//     if (this.socket && this.socket.connected) {
//       this.socket.emit("update_location", {
//         latitude,
//         longitude,
//         accuracy,
//         address, // ✅ include resolved address
//       });
//     }

//     // Also update via HTTP every 30 seconds (backup)
//     this.throttledHTTPUpdate(latitude, longitude, address);
//   }

//   // ── Haversine distance (km) ───────────────────────────────────────────────
//   calculateDistance(lat1, lon1, lat2, lon2) {
//     const R = 6371;
//     const dLat = ((lat2 - lat1) * Math.PI) / 180;
//     const dLon = ((lon2 - lon1) * Math.PI) / 180;
//     const a =
//       Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//       Math.cos((lat1 * Math.PI) / 180) *
//         Math.cos((lat2 * Math.PI) / 180) *
//         Math.sin(dLon / 2) *
//         Math.sin(dLon / 2);
//     return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   }

//   /**
//    * Throttle helper
//    */
//   throttle(func, delay) {
//     let lastCall = 0;
//     return (...args) => {
//       const now = Date.now();
//       if (now - lastCall >= delay) {
//         lastCall = now;
//         func(...args);
//       }
//     };
//   }

//   onLocationError(error) {
//     console.error("Location error:", error.message);
//   }

//   /**
//    * Stop tracking
//    */
//   stopTracking() {
//     if (this.watchId) {
//       navigator.geolocation.clearWatch(this.watchId);
//       this.watchId = null;
//       console.log("📍 Location tracking stopped (user)");
//     }
//   }
// }

// export default new UserLocationService();

class UserLocationService {
  constructor() {
    this.watchId = null;
    this.socket = null;
  }

  setSocket(socket) {
    this.socket = socket;
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

    console.log("📍 Location tracking started (user)");
  }

  onLocationUpdate(position) {
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

    // Send coordinates only — backend resolves address via Google
    this.sendLocation(latitude, longitude, accuracy);
  }

  sendLocation(latitude, longitude, accuracy) {
    // Real-time via Socket.IO
    if (this.socket && this.socket.connected) {
      this.socket.emit("update_location", {
        latitude,
        longitude,
        accuracy,
      });
    }

    // HTTP backup every 30 seconds
    this.throttledHTTPUpdate(latitude, longitude);
  }

  throttledHTTPUpdate = this.throttle((latitude, longitude) => {
    this.httpUpdate(latitude, longitude);
  }, 30000);

  httpUpdate(latitude, longitude) {
    fetch(`${import.meta.env.VITE_BASE_URL}/users/location`, {
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
        // Save Google-resolved address from backend response
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
      console.log("📍 Location tracking stopped (user)");
    }
  }
}

export default new UserLocationService();

