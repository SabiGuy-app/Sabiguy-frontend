class LocationService {
  constructor() {
    this.watchId = null;
    this.socket = null;
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

    // Options for high accuracy
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    // Start watching position
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
    const { latitude, longitude, accuracy } = position.coords;
// Determine location source based on accuracy
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
    locationSource = 'IP Geolocation (ISP Server)';
    sourceEmoji = '🌐';
  }

  console.log(`${sourceEmoji} Location Source: ${locationSource}`);
  console.log('📍 Coordinates:', { 
    latitude, 
    longitude, 
    accuracy: `${Math.round(accuracy)}m`,
    timestamp: new Date(position.timestamp).toLocaleTimeString()
  });

  // ✅ ADDED: Check if this is your actual location
  if (accuracy > 1000) {
    console.warn('⚠️ WARNING: Very poor accuracy! This is likely IP-based (ISP location, not GPS)');
    console.warn('⚠️ Expected accuracy for GPS: < 20m');
    console.warn('⚠️ Current accuracy:', Math.round(accuracy), 'm');
  }
    console.log('📍 Location updated:', { latitude, longitude, accuracy });

    // Send to backend via Socket.IO (real-time)
    if (this.socket && this.socket.connected) {
      this.socket.emit('update_location', {
        latitude,
        longitude,
        accuracy
      });
    }

    // Also update via HTTP every 30 seconds (backup)
    this.throttledHTTPUpdate(latitude, longitude);
  }

  /**
   * Throttled HTTP update (backup)
   */
  throttledHTTPUpdate = this.throttle((latitude, longitude) => {
    fetch(`${import.meta.env.VITE_BASE_URL}/provider/location`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ latitude, longitude })
    });
  }, 30000); // Update via HTTP every 30 seconds

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
    console.error('Location error:', error.message);
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

export default new LocationService();

// class LocationService {
//   constructor() {
//     this.watchId = null;
//     this.socket = null;
//     this.previousLocations = [];
//     this.locationCount = 0;
//     this.lastSentTime = 0;
//   }

//   /**
//    * Start tracking provider's location
//    */
//   startTracking(socket) {
//     if (!navigator.geolocation) {
//       console.error('Geolocation not supported');
//       return;
//     }

//     this.socket = socket;

//     const options = {
//       enableHighAccuracy: true,
//       timeout: 20000,   // increased
//       maximumAge: 10000 // allow cached GPS
//     };

//     this.watchId = navigator.geolocation.watchPosition(
//       (position) => this.onLocationUpdate(position),
//       (error) => this.onLocationError(error),
//       options
//     );

//     console.log('📍 Location tracking started');
//   }

//   /**
//    * Handle location updates
//    */
//   onLocationUpdate(position) {
//     const { latitude, longitude, accuracy, heading, speed } = position.coords;

//     this.locationCount++;

//     if (this.locationCount < 3) {
//       console.log('⏳ Stabilizing GPS...');
//       return;
//     }

//     if (accuracy > 50) {
//       console.warn('⚠️ Ignoring poor accuracy:', accuracy);
//       return;
//     }

//     this.previousLocations.push({ latitude, longitude });

//     if (this.previousLocations.length > 5) {
//       this.previousLocations.shift();
//     }

//     const avgLat =
//       this.previousLocations.reduce((sum, loc) => sum + loc.latitude, 0) /
//       this.previousLocations.length;

//     const avgLng =
//       this.previousLocations.reduce((sum, loc) => sum + loc.longitude, 0) /
//       this.previousLocations.length;

//     let locationSource;
//     let sourceEmoji;

//     if (accuracy < 20) {
//       locationSource = 'GPS (Satellite)';
//       sourceEmoji = '🛰️';
//     } else if (accuracy < 100) {
//       locationSource = 'Wi-Fi Positioning';
//       sourceEmoji = '📶';
//     } else if (accuracy < 1000) {
//       locationSource = 'Cell Tower Triangulation';
//       sourceEmoji = '📡';
//     } else {
//       locationSource = 'IP Geolocation';
//       sourceEmoji = '🌐';
//     }

//     console.log(`${sourceEmoji} ${locationSource}`);
//     console.log('📍 Smoothed Location:', {
//       latitude: avgLat,
//       longitude: avgLng,
//       accuracy: Math.round(accuracy),
//       heading,
//       speed
//     });

//     // 🚀 Send via WebSocket (Real-time)
//     if (this.socket && this.socket.connected) {
//       this.socket.emit('update_location', {
//         latitude: avgLat,
//         longitude: avgLng,
//         accuracy,
//         heading,
//         speed,
//         timestamp: Date.now()
//       });
//     }

//     this.throttledHTTPUpdate(avgLat, avgLng);
//   }

//   /**
//    * Throttled HTTP update
//    */
//   throttledHTTPUpdate = this.throttle((latitude, longitude) => {
//     fetch(`${import.meta.env.VITE_BASE_URL}/provider/location`, {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${localStorage.getItem('token')}`
//       },
//       body: JSON.stringify({
//         latitude,
//         longitude,
//         timestamp: Date.now()
//       })
//     });
//   }, 30000);

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
//     console.error('❌ Location error:', error.message);

//     switch (error.code) {
//       case error.PERMISSION_DENIED:
//         console.error('User denied location permission');
//         break;
//       case error.POSITION_UNAVAILABLE:
//         console.error('Location unavailable');
//         break;
//       case error.TIMEOUT:
//         console.error('Location timeout');
//         break;
//     }
//   }

//   /**
//    * Stop tracking
//    */
//   stopTracking() {
//     if (this.watchId) {
//       navigator.geolocation.clearWatch(this.watchId);
//       this.watchId = null;
//       console.log('📍 Location tracking stopped');
//     }
//   }
// }

// export default new LocationService();