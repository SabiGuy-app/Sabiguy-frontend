import api from "./axios";

export  async function registerUserFCMToken(fcmToken) {
  try {
    const deviceType = /iPhone|iPad|iPod/.test(navigator.userAgent) 
      ? 'ios' 
      : /Android/.test(navigator.userAgent) 
        ? 'android' 
        : 'web';
 
 const response = await api.post('/fcm/register', {
      fcmToken,
      deviceType,
      deviceId: getDeviceId()
    });

    return response.data;
  } catch (error) {
    console.error('Failed to register FCM token:', error);
    throw error;
  }
}

export async function removeFCMToken() {
  try {
    const response = await api.delete('/fcm/token');
    return response.data;
  } catch (error) {
    console.error('Failed to remove FCM token:', error);
    throw error;
  }
}

/**
 * Send test notification
 */
export async function sendTestNotification(title, message) {
  try {
    const response = await api.post('/fcm/test', {
      title,
      message
    });
    return response.data;
  } catch (error) {
    console.error('Failed to send test notification:', error);
    throw error;
  }
}

/**
 * Get or create device ID
 */
function getDeviceId() {
  let deviceId = localStorage.getItem('deviceId');
  
  if (!deviceId) {
    deviceId = 'web_' + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('deviceId', deviceId);
  }
  
  return deviceId;
}

