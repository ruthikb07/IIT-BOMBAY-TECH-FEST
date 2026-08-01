/**
 * CYGNUS Geometric Machine Network
 * Structured grid nodes, straight laser connections, precise synthetic alignment.
 */

import * as THREE from 'three';

export class MachineNetwork {
  constructor() {
    this.group = new THREE.Group();
    this.nodeMesh = null;
    this.lineSegments = null;
    this.nodePositions = [];
    this.init();
  }

  init() {
    const gridSize = 4;
    const spacing = 28;
    const positions = [];

    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        for (let z = 0; z < gridSize; z++) {
          const posX = 90 + (x - gridSize / 2) * spacing; // Positioned right of center initially
          const posY = (y - gridSize / 2) * spacing;
          const posZ = (z - gridSize / 2) * spacing;

          positions.push(posX, posY, posZ);
          this.nodePositions.push(new THREE.Vector3(posX, posY, posZ));
        }
      }
    }

    const nodeGeo = new THREE.BufferGeometry();
    nodeGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

    const nodeMat = new THREE.PointsMaterial({
      color: 0xffaa00,
      size: 4.0,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });
    this.nodeMesh = new THREE.Points(nodeGeo, nodeMat);
    this.group.add(this.nodeMesh);

    // Geometric grid connections
    const lineCoords = [];
    const count = this.nodePositions.length;
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const d = this.nodePositions[i].distanceTo(this.nodePositions[j]);
        if (Math.abs(d - spacing) < 1.0) {
          lineCoords.push(this.nodePositions[i].x, this.nodePositions[i].y, this.nodePositions[i].z);
          lineCoords.push(this.nodePositions[j].x, this.nodePositions[j].y, this.nodePositions[j].z);
        }
      }
    }

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(lineCoords, 3));
    const lineMat = new THREE.LineBasicMaterial({
      color: 0xff8800,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending
    });
    this.lineSegments = new THREE.LineSegments(lineGeo, lineMat);
    this.group.add(this.lineSegments);
  }

  update(time, reducedMotion = false) {
    if (reducedMotion) return;
    this.group.rotation.x = time * 0.1;
    this.group.rotation.y = time * 0.15;
  }

  dispose() {
    this.group.traverse((obj) => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) obj.material.dispose();
    });
  }
}
