/**
 * CYGNUS WebGL Renderer Module
 * Single persistent WebGLRenderer management with adaptive pixel ratio & cleanup.
 */

import * as THREE from 'three';
import { qualityManager } from './quality.js';

export class SceneRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.renderer = null;
    this.quality = qualityManager.currentProfile;
    this.init();
  }

  init() {
    const width = this.canvas.clientWidth || window.innerWidth;
    const height = this.canvas.clientHeight || window.innerHeight;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: this.quality.antialias,
      alpha: true,
      powerPreference: 'high-performance',
      stencil: false,
      depth: true
    });

    this.renderer.setSize(width, height, false);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.quality.maxPixelRatio));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;

    qualityManager.onQualityChange((newProfile) => {
      this.quality = newProfile;
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, newProfile.maxPixelRatio));
    });
  }

  resize(width, height) {
    if (!this.renderer) return;
    this.renderer.setSize(width, height, false);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.quality.maxPixelRatio));
  }

  render(scene, camera) {
    if (this.renderer && scene && camera) {
      this.renderer.render(scene, camera);
    }
  }

  dispose() {
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer = null;
    }
  }
}
