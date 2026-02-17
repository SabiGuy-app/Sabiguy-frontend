class NotificationSoundService {
  constructor() {
    this.audioContext = null;
    this.buffer = null;
  }

  // Initialize audio context
  async init() {
    if (this.audioContext) return;

    try {
      const audioContext = new (
        window.AudioContext || window.webkitAudioContext
      )();

      // Request user interaction if needed
      if (audioContext.state === "suspended") {
        await audioContext.resume();
      }

      this.audioContext = audioContext;

      // Preload the sound
      const response = await fetch("/notify.mp3");
      const arrayBuffer = await response.arrayBuffer();
      this.buffer = await audioContext.decodeAudioData(arrayBuffer);
    } catch (error) {
      console.error("Failed to initialize audio context:", error);
      // Fallback to simple audio element
    }
  }

  // Play notification sound
  async play() {
    try {
      console.log(
        "🎵 play() called, audioContext:",
        this.audioContext,
        "buffer:",
        this.buffer,
      );

      // Try Web Audio API first
      if (this.audioContext && this.buffer) {
        try {
          console.log("🎵 Using Web Audio API");
          if (this.audioContext.state === "suspended") {
            console.log("🎵 Resuming audio context...");
            await this.audioContext.resume();
          }

          const source = this.audioContext.createBufferSource();
          source.buffer = this.buffer;
          source.connect(this.audioContext.destination);
          source.start(0);
          console.log("✅ Web Audio API playback started");
          return;
        } catch (error) {
          console.error("❌ Web Audio API playback failed:", error);
        }
      }

      // Fallback to HTML5 Audio element
      console.log("🎵 Using HTML5 Audio element fallback");
      const audio = new Audio("/notify.mp3");
      audio.volume = 0.8;
      // Enable autoplay by user interaction first
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log("✅ HTML5 Audio playback started");
          })
          .catch((error) => {
            console.error("❌ Audio playback failed:", error);
            // Many browsers require user interaction to play audio
          });
      }
    } catch (error) {
      console.error("❌ Failed to play notification sound:", error);
    }
  }

  // Set volume (0.0 to 1.0)
  setVolume(volume) {
    // Volume would be handled by the audio sources
    console.log(`Volume set to: ${Math.max(0, Math.min(1, volume))}`);
  }
}

export default new NotificationSoundService();
