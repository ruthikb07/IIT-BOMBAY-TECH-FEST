/**
 * CYGNUS Background Particles & Grid Subsystem (Refined & Restrained)
 * Subtle starfield, floating dust particles, and persistent 3D spatial grid.
 */

import * as THREE from 'three';
import { qualityManager } from './quality.js';

export class BackgroundEnvironment {
  constructor(scene) {
    this.scene = scene;
    this.starGroup = new THREE.Group();
    this.gridMesh = null;
    this.quality = qualityManager.currentProfile;
    this.init();
  }

  init() {
    this.scene.add(this.starGroup);
    this.createStarfield();
    this.createSpatialGrid();

    qualityManager.onQualityChange((newProfile) => {
      this.quality = newProfile;
      this.rebuild();
    });
  }

  createStarfield() {
    const count = Math.min(this.quality.particleCount, 1200); // Restrained count for atmosphere
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const cyanColor = new THREE.Color(0x00f3ff);
    const amberColor = new THREE.Color(0xffaa00);
    const dimColor = new THREE.Color(0x1a263f);

    for (let i = 0; i < count; i++) {
      const radius = 250 + Math.random() * 650;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      const r = Math.random();
      const col = r > 0.9 ? cyanColor : r > 0.8 ? amberColor : dimColor;
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: this.quality.name === 'LOW' ? 1.0 : 1.4,
      vertexColors: true,
      transparent: true,
      opacity: 0.35, // Restrained subtle background
      blending: THREE.AdditiveBlending
    });

    this.starPoints = new THREE.Points(geo, mat);
    this.starGroup.add(this.starPoints);
  }

  createSpatialGrid() {
    const size = 1200;
    const divisions = 50;
    const gridHelper = new THREE.GridHelper(size, divisions, 0x00f3ff, 0x071529);
    gridHelper.position.y = -180;
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.12;
    this.gridMesh = gridHelper;
    this.starGroup.add(this.gridMesh);
  }

  update(time, reducedMotion = false) {
    if (!reducedMotion && this.starPoints) {
      this.starPoints.rotation.y = time * 0.005; // Slow ambient rotation
    }
  }

  rebuild() {
    while (this.starGroup.children.length > 0) {
      const child = this.starGroup.children[0];
      if (child.geometry) child.geometry.dispose();
      if (child.material) child.material.dispose();
      this.starGroup.remove(child);
    }
    this.createStarfield();
    this.createSpatialGrid();
  }

  dispose() {
    this.rebuild();
    this.scene.remove(this.starGroup);
  }
}
