import { useState } from 'react';
import { isMobile, isIOS, isAndroid } from '../utils/mobileDetection';
import NotificationSoundService from './notificationSoundService';
// import NotificationSoundService from './services/notificationSoundService';

function NotificationTest() {
  const [status, setStatus] = useState('');

  const testSound = async () => {
    setStatus('Testing...');
    try {
      await NotificationSoundService.play();
      setStatus('✅ Sound played successfully!');
    } catch (error) {
      setStatus(`❌ Failed: ${error.message}`);
    }
  };

  const testVibration = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200, 100, 200]);
      setStatus('📳 Vibration triggered');
    } else {
      setStatus('❌ Vibration not supported');
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Notification Test</h2>
      
      <div className="mb-4 p-3 bg-gray-100 rounded">
        <p><strong>Device:</strong> {isMobile() ? 'Mobile' : 'Desktop'}</p>
        <p><strong>iOS:</strong> {isIOS() ? 'Yes' : 'No'}</p>
        <p><strong>Android:</strong> {isAndroid() ? 'Yes' : 'No'}</p>
        <p><strong>Notification Permission:</strong> {Notification.permission}</p>
      </div>

      <div className="space-y-3">
        <button
          onClick={testSound}
          className="w-full bg-blue-500 text-white px-4 py-3 rounded font-bold"
        >
          🔔 Test Sound
        </button>
        
        <button
          onClick={testVibration}
          className="w-full bg-purple-500 text-white px-4 py-3 rounded font-bold"
        >
          📳 Test Vibration
        </button>

        {status && (
          <div className="p-3 bg-yellow-100 rounded text-center">
            {status}
          </div>
        )}
      </div>
    </div>
  );
}

export default NotificationTest;