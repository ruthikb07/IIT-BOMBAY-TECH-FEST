/**
 * CYGNUS 3D Human × Machine Convergence System
 * Controls physical 3D position, opacity, scale, and crossing connections 
 * between Human and Machine networks based on the Convergence Slider (0% to 100%).
 */

import * as THREE from 'three';
import { HumanNetwork } from './humanNetwork.js';
import { MachineNetwork } from './machineNetwork.js';

export class ConvergenceSystem {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.scene.add(this.group);

    this.humanNet = new HumanNetwork();
    this.machineNet = new MachineNetwork();

    this.group.add(this.humanNet.group);
    this.group.add(this.machineNet.group);

    // Dynamic crossing lines between Human & Machine networks
    this.crossingLines = null;
    this.buildCrossingLines();

    // 0 = Human, 50 = Convergence, 100 = Machine
    this.convergenceValue = 50; 
  }

  buildCrossingLines() {
    const lineCoords = [];
    const hPos = this.humanNet.nodePositions;
    const mPos = this.machineNet.nodePositions;

    // Connect nearest nodes between human and machine networks
    for (let i = 0; i < Math.min(hPos.length, 30); i += 2) {
      for (let j = 0; j < Math.min(mPos.length, 30); j += 3) {
        if (Math.random() > 0.6) {
          lineCoords.push(hPos[i].x, hPos[i].y, hPos[i].z);
          lineCoords.push(mPos[j].x, mPos[j].y, mPos[j].z);
        }
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(lineCoords, 3));

    const mat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    });

    this.crossingLines = new THREE.LineSegments(geo, mat);
    this.group.add(this.crossingLines);
  }

  setConvergence(val) {
    this.convergenceValue = Math.max(0, Math.min(100, val));
  }

  update(time, reducedMotion = false) {
    // 0 = 100% Human, 100 = 100% Machine
    const factor = this.convergenceValue / 100;

    // Physical positions: at 50% they meet at center (0), at 0% separated (-90 vs +90)
    const offsetDist = (1 - Math.sin(Math.PI * Math.min(1, factor * 2 < 1 ? factor * 2 : (1 - factor) * 2))) * 90;
    
    // Lerp positions
    const targetHumanX = -offsetDist;
    const targetMachineX = offsetDist;

    this.humanNet.group.position.x += (targetHumanX - this.humanNet.group.position.x) * 0.08;
    this.machineNet.group.position.x += (targetMachineX - this.machineNet.group.position.x) * 0.08;

    // Scale & Opacity shifts
    const humanOp = 1.0 - factor * 0.5;
    const machineOp = 0.5 + factor * 0.5;

    if (this.humanNet.nodeMesh) this.humanNet.nodeMesh.material.opacity = humanOp * 0.85;
    if (this.humanNet.lineSegments) this.humanNet.lineSegments.material.opacity = humanOp * 0.35;

    if (this.machineNet.nodeMesh) this.machineNet.nodeMesh.material.opacity = machineOp * 0.9;
    if (this.machineNet.lineSegments) this.machineNet.lineSegments.material.opacity = machineOp * 0.4;

    // Crossing lines visibility peaks near 50% convergence
    const convergenceBlend = 1.0 - Math.abs(this.convergenceValue - 50) / 50;
    if (this.crossingLines) {
      this.crossingLines.material.opacity = convergenceBlend * 0.6;
    }

    this.humanNet.update(time, reducedMotion);
    this.machineNet.update(time, reducedMotion);
  }

  dispose() {
    this.humanNet.dispose();
    this.machineNet.dispose();
    if (this.crossingLines) {
      this.crossingLines.geometry.dispose();
      this.crossingLines.material.dispose();
    }
    this.scene.remove(this.group);
  }
}
