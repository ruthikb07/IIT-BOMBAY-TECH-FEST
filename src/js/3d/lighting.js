/**
 * CYGNUS Lighting Subsystem (Refined & Cinematic)
 * Restrained dark cinematic lighting: ambient, directional, point lights, fog.
 */

import * as THREE from 'three';

export class SceneLighting {
  constructor(scene) {
    this.scene = scene;
    this.ambientLight = null;
    this.cyanPointLight = null;
    this.amberPointLight = null;
    this.dirLight = null;
    this.init();
  }

  init() {
    // Atmospheric fog for depth
    this.scene.fog = new THREE.FogExp2(0x050609, 0.0016);

    // Ambient Light (subtle cyan/indigo base)
    this.ambientLight = new THREE.AmbientLight(0x08101d, 1.0);
    this.scene.add(this.ambientLight);

    // Cyan Core Accent Light
    this.cyanPointLight = new THREE.PointLight(0x00f3ff, 1.8, 250, 2.0);
    this.cyanPointLight.position.set(0, 0, 40);
    this.scene.add(this.cyanPointLight);

    // Amber Synthetic Accent Light
    this.amberPointLight = new THREE.PointLight(0xffaa00, 1.2, 220, 2.0);
    this.amberPointLight.position.set(60, 40, -30);
    this.scene.add(this.amberPointLight);

    // Subtle Directional Rim Light
    this.dirLight = new THREE.DirectionalLight(0xffffff, 0.4);
    this.dirLight.position.set(-80, 100, 120);
    this.scene.add(this.dirLight);
  }

  update(time, pulseIntensity = 0) {
    if (this.cyanPointLight) {
      this.cyanPointLight.intensity = 1.8 + Math.sin(time * 0.8) * 0.15 + pulseIntensity * 1.5;
    }
    if (this.amberPointLight) {
      this.amberPointLight.intensity = 1.2 + Math.cos(time * 0.6) * 0.1 + pulseIntensity * 0.8;
    }
  }

  dispose() {
    [this.ambientLight, this.cyanPointLight, this.amberPointLight, this.dirLight].forEach(light => {
      if (light) {
        this.scene.remove(light);
        light.dispose();
      }
    });
  }
}
