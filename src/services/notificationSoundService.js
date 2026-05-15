import { isMobile, isIOS, isAndroid } from '../utils/mobileDetection';

class NotificationSoundService {
  constructor() {
    this.audioContext = null;
    this.buffer = null;
    this.initialized = false;
    this.initPromise = null;
    this.htmlAudio = null; // Pre-created audio element
    this.isMobile = isMobile();
    this.isIOS = isIOS();
  }

  // Initialize audio context
  async init() {
    if (this.initPromise) {
      return this.initPromise;
    }

    if (this.initialized) {
      console.log("🎵 Audio already initialized");
      return;
    }

    this.initPromise = (async () => {
      try {
        console.log("🎵 Initializing NotificationSoundService...");
        console.log("📱 Is Mobile:", this.isMobile);
        console.log("🍎 Is iOS:", this.isIOS);

        // For mobile, prioritize HTML5 Audio which works better
        if (this.isMobile) {
          console.log("📱 Using mobile-optimized audio setup");
          
          // Pre-create and load audio element
          this.htmlAudio = new Audio("/notifyy.mp3");
          this.htmlAudio.preload = "auto";
          this.htmlAudio.volume = 1.0; // Max volume for mobile
          
          // Load the audio file
          await new Promise((resolve, reject) => {
            this.htmlAudio.addEventListener('canplaythrough', resolve, { once: true });
            this.htmlAudio.addEventListener('error', reject, { once: true });
            this.htmlAudio.load();
          });

          console.log("✅ Mobile audio pre-loaded");
        }

        // Also try Web Audio API for desktop fallback
        if (!this.isMobile || !this.isIOS) {
          try {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            this.audioContext = new AudioContextClass();

            console.log("🎵 AudioContext state:", this.audioContext.state);

            if (this.audioContext.state === "suspended") {
              console.log("🎵 Resuming suspended audio context...");
              await this.audioContext.resume();
            }

            // Preload the sound
            console.log("🎵 Fetching audio file for Web Audio API...");
            const response = await fetch("/notifyy.mp3");
            
            if (!response.ok) {
              throw new Error(`Failed to fetch audio: ${response.status}`);
            }

            const arrayBuffer = await response.arrayBuffer();
            console.log("🎵 Decoding audio data...");
            this.buffer = await this.audioContext.decodeAudioData(arrayBuffer);
            console.log("✅ Web Audio API buffer ready");
          } catch (webAudioError) {
            console.warn("⚠️ Web Audio API setup failed:", webAudioError);
          }
        }
        
        this.initialized = true;
        console.log("✅ NotificationSoundService initialized successfully");
      } catch (error) {
        console.error("❌ Failed to initialize audio:", error);
        this.initialized = false;
      } finally {
        this.initPromise = null;
      }
    })();

    return this.initPromise;
  }

  // Play notification sound
  async play() {
    try {
      console.log("🎵 play() called");
      console.log("📱 Mobile:", this.isMobile);
      console.log("🎵 Initialized:", this.initialized);

      if (!this.initialized) {
        console.log("⚠️ Audio not initialized, attempting to initialize...");
        await this.init();
      }

      // MOBILE: Use HTML5 Audio (most reliable on mobile)
      if (this.isMobile && this.htmlAudio) {
        try {
          console.log("📱 Using mobile HTML5 Audio");
          
          // Reset to start
          this.htmlAudio.currentTime = 0;
          
          // Unlock audio on iOS if needed
          if (this.isIOS && this.htmlAudio.paused) {
            console.log("🍎 Unlocking iOS audio...");
          }
          
          const playPromise = this.htmlAudio.play();
          
          if (playPromise !== undefined) {
            await playPromise;
            console.log("✅ Mobile audio playback started");
          }
          
          // Vibrate on mobile
          if ('vibrate' in navigator) {
            navigator.vibrate([200, 100, 200, 100, 200]);
            console.log("📳 Vibration triggered");
          }
          
          return;
        } catch (mobileError) {
          console.error("❌ Mobile audio playback failed:", mobileError);
        }
      }

      // DESKTOP: Try Web Audio API
      if (this.audioContext && this.buffer) {
        try {
          console.log("💻 Using Web Audio API");

          if (this.audioContext.state === "suspended") {
            console.log("🎵 Resuming audio context...");
            await this.audioContext.resume();
          }

          const source = this.audioContext.createBufferSource();
          const gainNode = this.audioContext.createGain();
          
          gainNode.gain.value = 0.8;
          
          source.buffer = this.buffer;
          source.connect(gainNode);
          gainNode.connect(this.audioContext.destination);
          
          source.start(0);
          console.log("✅ Web Audio API playback started");
          
          return;
        } catch (error) {
          console.error("❌ Web Audio API playback failed:", error);
        }
      }

      // FALLBACK: Fresh HTML5 Audio element
      console.log("🔄 Using fallback HTML5 Audio");
      const fallbackAudio = new Audio("/notifyy.mp3");
      fallbackAudio.volume = 1.0;
      
      const playPromise = fallbackAudio.play();
      if (playPromise !== undefined) {
        await playPromise;
        console.log("✅ Fallback audio played");
        
        // Vibrate
        if ('vibrate' in navigator) {
          navigator.vibrate([200, 100, 200, 100, 200]);
        }
      }
    } catch (error) {
      console.error("❌ All audio playback methods failed:", error);
      
      // Last resort: just vibrate
      if ('vibrate' in navigator) {
        console.log("📳 Using vibration only as last resort");
        navigator.vibrate([200, 100, 200, 100, 200, 100, 200]);
      }
    }
  }

  // Set volume (0.0 to 1.0)
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    if (this.htmlAudio) {
      this.htmlAudio.volume = this.volume;
    }
    console.log(`🔊 Volume set to: ${this.volume}`);
  }

  // Unlock audio context (call on user gesture to enable autoplay)
  async unlock() {
    try {
      console.log("🔓 Unlocking audio context...");
      
      // Resume Web Audio Context
      if (this.audioContext && this.audioContext.state === "suspended") {
        console.log("🔓 Resuming suspended Web Audio context...");
        await this.audioContext.resume();
        console.log("✅ Web Audio context resumed");
      }
      
      // For HTML5 audio, play and immediately pause to "unlock" it
      if (this.htmlAudio) {
        console.log("🔓 Unlocking HTML5 audio...");
        try {
          const playPromise = this.htmlAudio.play();
          if (playPromise !== undefined) {
            await playPromise;
            this.htmlAudio.pause();
            this.htmlAudio.currentTime = 0;
            console.log("✅ HTML5 audio unlocked");
          }
        } catch (e) {
          console.warn("⚠️ Could not unlock HTML5 audio:", e);
        }
      }
    } catch (error) {
      console.warn("⚠️ Error unlocking audio:", error);
    }
  }
}


export default new NotificationSoundService();