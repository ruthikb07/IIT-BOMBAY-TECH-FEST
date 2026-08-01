/**
 * CYGNUS Performance Monitor & Device Capability Detector
 * Detects device hardware profile and dynamically adapts rendering quality.
 */

import { APP_CONFIG } from '../data/config.js';

export class PerformanceManager {
  constructor() {
    this.fps = 60;
    this.frameCount = 0;
    this.lastTime = performance.now();
    this.fpsHistory = [];
    this.qualityProfile = this.detectInitialQuality();
    this.listeners = [];

    this.isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.startMonitoring();
  }

  detectInitialQuality() {
    // Check reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return APP_CONFIG.qualityProfiles.LOW;
    }

    // Hardware heuristic check
    const cores = navigator.hardwareConcurrency || 4;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const screenArea = window.innerWidth * window.innerHeight;

    if (isMobile || cores <= 2 || screenArea < 500000) {
      return APP_CONFIG.qualityProfiles.LOW;
    } else if (cores <= 4 || screenArea < 1500000) {
      return APP_CONFIG.qualityProfiles.MEDIUM;
    } else {
      return APP_CONFIG.qualityProfiles.HIGH;
    }
  }

  startMonitoring() {
    const tick = () => {
      const now = performance.now();
      const delta = now - this.lastTime;
      this.frameCount++;

      if (delta >= 1000) {
        this.fps = Math.round((this.frameCount * 1000) / delta);
        this.frameCount = 0;
        this.lastTime = now;
        
        this.fpsHistory.push(this.fps);
        if (this.fpsHistory.length > 10) this.fpsHistory.shift();

        this.checkAdaptiveAdjustment();
      }

      requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }

  checkAdaptiveAdjustment() {
    if (this.fpsHistory.length < 5) return;
    const avgFps = this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length;

    // Auto-downgrade quality profile if FPS drops significantly
    if (avgFps < 30 && this.qualityProfile.name === 'HIGH') {
      this.setQualityProfile(APP_CONFIG.qualityProfiles.MEDIUM);
    } else if (avgFps < 22 && this.qualityProfile.name === 'MEDIUM') {
      this.setQualityProfile(APP_CONFIG.qualityProfiles.LOW);
    }
  }

  setQualityProfile(profile) {
    if (this.qualityProfile.name !== profile.name) {
      console.log(`[CYGNUS Engine] Quality profile adapted to: ${profile.name}`);
      this.qualityProfile = profile;
      this.listeners.forEach(cb => cb(profile));
    }
  }

  onQualityChange(callback) {
    this.listeners.push(callback);
  }
}

export const perfManager = new PerformanceManager();
