/**
 * CYGNUS Organic Human Neural Network
 * Irregular node clustering, organic curved connection paths, flowing biological pulses.
 */

import * as THREE from 'three';

export class HumanNetwork {
  constructor() {
    this.group = new THREE.Group();
    this.nodeMesh = null;
    this.lineSegments = null;
    this.nodePositions = [];
    this.init();
  }

  init() {
    const nodeCount = 55;
    const radius = 60;
    const positions = new Float32Array(nodeCount * 3);
    const sizes = new Float32Array(nodeCount);

    for (let i = 0; i < nodeCount; i++) {
      // Irregular organic distribution
      const u = Math.random();
      const v = Math.random();
      const theta = u * Math.PI * 2;
      const phi = Math.acos(2 * v - 1);
      const r = (0.5 + 0.5 * Math.sin(i * 3.5)) * radius;

      const x = r * Math.sin(phi) * Math.cos(theta) - 90; // Positioned left of center initially
      const y = r * Math.sin(phi) * Math.sin(theta) + (Math.random() - 0.5) * 30;
      const z = r * Math.cos(phi) + (Math.random() - 0.5) * 40;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      sizes[i] = 3.0 + Math.random() * 5.0; // Variable node sizes
      this.nodePositions.push(new THREE.Vector3(x, y, z));
    }

    const nodeGeo = new THREE.BufferGeometry();
    nodeGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const nodeMat = new THREE.PointsMaterial({
      color: 0x00f3ff,
      size: 4.5,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });
    this.nodeMesh = new THREE.Points(nodeGeo, nodeMat);
    this.group.add(this.nodeMesh);

    // Organic connection lines
    const lineCoords = [];
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        if (this.nodePositions[i].distanceTo(this.nodePositions[j]) < 38) {
          lineCoords.push(this.nodePositions[i].x, this.nodePositions[i].y, this.nodePositions[i].z);
          lineCoords.push(this.nodePositions[j].x, this.nodePositions[j].y, this.nodePositions[j].z);
        }
      }
    }

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(lineCoords, 3));
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x00c8ff,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending
    });
    this.lineSegments = new THREE.LineSegments(lineGeo, lineMat);
    this.group.add(this.lineSegments);
  }

  update(time, reducedMotion = false) {
    if (reducedMotion) return;
    this.group.rotation.y = Math.sin(time * 0.2) * 0.08;
    this.group.rotation.z = Math.cos(time * 0.15) * 0.05;
  }

  dispose() {
    this.group.traverse((obj) => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) obj.material.dispose();
    });
  }
}
