/**
 * CYGNUS Lighting Subsystem
 * Restrained cinematic lighting: ambient, directional, point lights, fog.
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
    // Fog for depth
    this.scene.fog = new THREE.FogExp2(0x050609, 0.0016);

    // Ambient Light (dim cyan base)
    this.ambientLight = new THREE.AmbientLight(0x0a1424, 1.2);
    this.scene.add(this.ambientLight);

    // Cyan Core Accent Light
    this.cyanPointLight = new THREE.PointLight(0x00f3ff, 2.5, 300, 1.8);
    this.cyanPointLight.position.set(0, 0, 40);
    this.scene.add(this.cyanPointLight);

    // Amber Synthetic Accent Light
    this.amberPointLight = new THREE.PointLight(0xffaa00, 1.8, 280, 2.0);
    this.amberPointLight.position.set(60, 40, -30);
    this.scene.add(this.amberPointLight);

    // Subtle Directional Rim Light
    this.dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
    this.dirLight.position.set(-80, 100, 120);
    this.scene.add(this.dirLight);
  }

  update(time, pulseIntensity = 0) {
    if (this.cyanPointLight) {
      this.cyanPointLight.intensity = 2.5 + Math.sin(time * 2.0) * 0.4 + pulseIntensity * 4.0;
    }
    if (this.amberPointLight) {
      this.amberPointLight.intensity = 1.8 + Math.cos(time * 1.5) * 0.3 + pulseIntensity * 2.0;
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
