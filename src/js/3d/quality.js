/**
 * CYGNUS Adaptive Performance & Quality System
 * Dynamically adjusts particle counts, DPR, antialiasing, and effects.
 */

export class QualityManager {
  constructor() {
    this.profiles = {
      HIGH: {
        name: 'HIGH',
        maxPixelRatio: Math.min(window.devicePixelRatio, 2),
        antialias: true,
        particleCount: 2500,
        neuralNodeCount: 120,
        connectionLimit: 3,
        shadows: true,
        glowIntensity: 1.0
      },
      MEDIUM: {
        name: 'MEDIUM',
        maxPixelRatio: Math.min(window.devicePixelRatio, 1.5),
        antialias: true,
        particleCount: 1400,
        neuralNodeCount: 70,
        connectionLimit: 2,
        shadows: false,
        glowIntensity: 0.7
      },
      LOW: {
        name: 'LOW',
        maxPixelRatio: 1.0,
        antialias: false,
        particleCount: 600,
        neuralNodeCount: 35,
        connectionLimit: 2,
        shadows: false,
        glowIntensity: 0.4
      }
    };

    this.currentProfile = this.detectInitialProfile();
    this.fpsHistory = [];
    this.lastFrameTime = performance.now();
    this.listeners = [];
  }

  detectInitialProfile() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
    const hardwareConcurrency = navigator.hardwareConcurrency || 4;
    
    if (isMobile || hardwareConcurrency <= 2) {
      return this.profiles.LOW;
    } else if (hardwareConcurrency <= 4) {
      return this.profiles.MEDIUM;
    }
    return this.profiles.HIGH;
  }

  onQualityChange(fn) {
    this.listeners.push(fn);
  }

  notifyListeners() {
    this.listeners.forEach(fn => fn(this.currentProfile));
  }

  updateFrameRate(timestamp) {
    const delta = timestamp - this.lastFrameTime;
    this.lastFrameTime = timestamp;
    if (delta <= 0) return;

    const fps = 1000 / delta;
    this.fpsHistory.push(fps);
    if (this.fpsHistory.length > 90) this.fpsHistory.shift();

    // Check every ~90 frames for auto downgrade/upgrade if needed
    if (this.fpsHistory.length === 90) {
      const avgFps = this.fpsHistory.reduce((a, b) => a + b, 0) / 90;
      if (avgFps < 28 && this.currentProfile.name !== 'LOW') {
        this.setProfile(this.currentProfile.name === 'HIGH' ? 'MEDIUM' : 'LOW');
      } else if (avgFps > 55 && this.currentProfile.name === 'LOW' && !/Android|iPhone|iPad/i.test(navigator.userAgent)) {
        this.setProfile('MEDIUM');
      }
    }
  }

  setProfile(profileName) {
    if (this.profiles[profileName] && this.currentProfile.name !== profileName) {
      this.currentProfile = this.profiles[profileName];
      console.log(`[CYGNUS QualityManager] Adaptive profile switched to: ${profileName}`);
      this.notifyListeners();
    }
  }
}

export const qualityManager = new QualityManager();
