// services/locationDiagnostics.js
export async function runLocationDiagnostics() {
  console.log('🔍 Running Location Diagnostics...\n');

  // 1. Check if geolocation is supported
  if (!navigator.geolocation) {
    console.error('❌ Geolocation NOT supported in this browser');
    return;
  }
  console.log('✅ Geolocation API is supported');

  // 2. Check permission state
  try {
    const permissionStatus = await navigator.permissions.query({ name: 'geolocation' });
    console.log('📋 Permission Status:', permissionStatus.state);
    
    if (permissionStatus.state === 'denied') {
      console.error('❌ Location permission DENIED');
      console.log('   → Go to browser settings and allow location');
    } else if (permissionStatus.state === 'granted') {
      console.log('✅ Location permission GRANTED');
    } else {
      console.log('⏳ Location permission PROMPT (will ask user)');
    }
  } catch (e) {
    console.log('⚠️ Could not check permission status (older browser)');
  }

  // 3. Try to get current position
  console.log('\n🎯 Attempting to get current position...');
  
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy, altitude, heading, speed } = position.coords;
        
        console.log('\n✅ Location Retrieved Successfully!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📍 Latitude:', latitude);
        console.log('📍 Longitude:', longitude);
        console.log('🎯 Accuracy:', Math.round(accuracy), 'meters');
        console.log('🏔️ Altitude:', altitude ? `${altitude}m` : 'N/A');
        console.log('🧭 Heading:', heading ? `${heading}°` : 'N/A');
        console.log('🚗 Speed:', speed ? `${speed} m/s` : 'N/A');
        console.log('⏰ Timestamp:', new Date(position.timestamp).toLocaleString());
        
        // Determine source
        let source;
        if (accuracy < 20) source = '🛰️ GPS (Excellent)';
        else if (accuracy < 100) source = '📶 Wi-Fi (Good)';
        else if (accuracy < 1000) source = '📡 Cell Towers (Fair)';
        else source = '🌐 IP Location (Poor)';
        
        console.log('📡 Source:', source);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        
        if (accuracy > 1000) {
          console.warn('⚠️ WARNING: Using IP-based location (ISP server)');
          console.warn('   → Enable GPS on your device for accurate location');
          console.warn('   → On mobile: Settings → Location → High Accuracy');
          console.warn('   → On desktop: Limited GPS - use mobile for testing');
        }

        resolve(position);
      },
      (error) => {
        console.error('\n❌ Location Error:', error.message);
        console.error('   Error Code:', error.code);
        
        const errorMessages = {
          1: '🚫 PERMISSION_DENIED - User denied location access',
          2: '📍 POSITION_UNAVAILABLE - Location information unavailable',
          3: '⏱️ TIMEOUT - Location request timed out'
        };
        
        console.error('   Meaning:', errorMessages[error.code]);
        
        if (error.code === 1) {
          console.log('\n💡 How to fix:');
          console.log('   1. Click the lock icon in address bar');
          console.log('   2. Go to Site Settings → Location');
          console.log('   3. Change to "Allow"');
          console.log('   4. Refresh the page');
        }
        
        resolve(null);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  });
}