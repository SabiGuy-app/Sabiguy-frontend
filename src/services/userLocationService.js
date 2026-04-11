// class UserLocationService {
//   constructor() {
//     this.watchId = null;
//     this.socket = null;
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
//   onLocationUpdate(position) {
//     const { latitude, longitude, accuracy } = position.coords;

//     this.sendLocation(latitude, longitude, accuracy);
//   }

//   /**
//    * Throttled HTTP update (backup)
//    */
//   throttledHTTPUpdate = this.throttle((latitude, longitude) => {
//     this.httpUpdate(latitude, longitude);
//   }, 30000); // Update via HTTP every 30 seconds

//   httpUpdate(latitude, longitude) {
//     fetch(`${import.meta.env.VITE_BASE_URL}/users/location`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${localStorage.getItem("token")}`,
//       },
//       body: JSON.stringify({ latitude, longitude }),
//     });
//   }

//   sendLocation(latitude, longitude, accuracy) {
//     // Send to backend via Socket.IO (real-time)
//     if (this.socket && this.socket.connected) {
//       this.socket.emit("update_location", {
//         latitude,
//         longitude,
//         accuracy,
//       });
//     }

//     // Also update via HTTP every 30 seconds (backup)
//     this.throttledHTTPUpdate(latitude, longitude);
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
    this.previousLocations = [];
    this.locationCount = 0;
    this.lastSentTime = 0;
  }

    setSocket(socket) {
    this.socket = socket;
  }
  /**
   * Start tracking provider's location
   */
  startTracking(socket) {
    if (!navigator.geolocation) {
      console.error('Geolocation not supported');
      return;
    }

    this.socket = socket;

    // 🚀 Improved options
    const options = {
      enableHighAccuracy: true,
      timeout: 20000,   // increased
      maximumAge: 10000 // allow cached GPS
    };

    this.watchId = navigator.geolocation.watchPosition(
      (position) => this.onLocationUpdate(position),
      (error) => this.onLocationError(error),
      options
    );

    console.log('📍 Location tracking started');
  }

  /**
   * Handle location updates
   */
  onLocationUpdate(position) {
    const { latitude, longitude, accuracy, heading, speed } = position.coords;

    this.locationCount++;

    // 🚀 Wait for GPS stabilization
    if (this.locationCount < 3) {
      console.log('⏳ Stabilizing GPS...');
      return;
    }

    // 🚀 Ignore poor accuracy
    if (accuracy > 50) {
      console.warn('⚠️ Ignoring poor accuracy:', accuracy);
      return;
    }

    // 🚀 Smooth GPS jitter (Uber technique)
    this.previousLocations.push({ latitude, longitude });

    if (this.previousLocations.length > 5) {
      this.previousLocations.shift();
    }

    const avgLat =
      this.previousLocations.reduce((sum, loc) => sum + loc.latitude, 0) /
      this.previousLocations.length;

    const avgLng =
      this.previousLocations.reduce((sum, loc) => sum + loc.longitude, 0) /
      this.previousLocations.length;

    // 🚀 Determine location source
    let locationSource;
    let sourceEmoji;

    if (accuracy < 20) {
      locationSource = 'GPS (Satellite)';
      sourceEmoji = '🛰️';
    } else if (accuracy < 100) {
      locationSource = 'Wi-Fi Positioning';
      sourceEmoji = '📶';
    } else if (accuracy < 1000) {
      locationSource = 'Cell Tower Triangulation';
      sourceEmoji = '📡';
    } else {
      locationSource = 'IP Geolocation';
      sourceEmoji = '🌐';
    }

    console.log(`${sourceEmoji} ${locationSource}`);
    console.log('📍 Smoothed Location:', {
      latitude: avgLat,
      longitude: avgLng,
      accuracy: Math.round(accuracy),
      heading,
      speed
    });

    // 🚀 Send via WebSocket (Real-time)
    if (this.socket && this.socket.connected) {
      this.socket.emit('update_location', {
        latitude: avgLat,
        longitude: avgLng,
        accuracy,
        heading,
        speed,
        timestamp: Date.now()
      });
    }

    // 🚀 Backup HTTP update
    this.throttledHTTPUpdate(avgLat, avgLng);
  }

  /**
   * Throttled HTTP update
   */
  throttledHTTPUpdate = this.throttle((latitude, longitude) => {
    fetch(`${import.meta.env.VITE_BASE_URL}/users/location`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        latitude,
        longitude,
        timestamp: Date.now()
      })
    })
    .then(response => response.json())
    .then(data => {
      // Save address to localStorage when response is received
      if (data?.currentLocation?.address) {
        localStorage.setItem('currentLocationAddress', data.currentLocation.address);
        console.log('📍 Address saved to localStorage:', data.currentLocation.address);
      }
    })
    .catch(error => console.error('Error updating location:', error));
  }, 30000);

  /**
   * Send location via socket (used if needed)
   */
  sendLocation(latitude, longitude, accuracy) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('update_location', {
        latitude,
        longitude,
        accuracy,
      });
    }
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
    console.error('❌ Location error:', error.message);

    switch (error.code) {
      case error.PERMISSION_DENIED:
        console.error('User denied location permission');
        break;
      case error.POSITION_UNAVAILABLE:
        console.error('Location unavailable');
        break;
      case error.TIMEOUT:
        console.error('Location timeout');
        break;
    }
  }

  /**
   * Stop tracking
   */
  stopTracking() {
    if (this.watchId) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
      console.log('📍 Location tracking stopped');
    }
  }
}

export default new UserLocationService();
