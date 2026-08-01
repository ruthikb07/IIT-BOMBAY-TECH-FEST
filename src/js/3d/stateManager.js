/**
 * CYGNUS 3D State Manager & Camera Choreography System
 * Manages transitions across 5 camera states: HERO, CONVERGENCE, PARAMETERS, SCANNER, FINAL.
 */

import * as THREE from 'three';

export const CAMERA_STATES = {
  HERO: {
    name: 'HERO',
    cameraPos: new THREE.Vector3(0, 0, 180),
    cameraTarget: new THREE.Vector3(0, 0, 0),
    coreScale: 1.0,
    coreOpacity: 1.0,
    convergenceOpacity: 0.2,
    scannerOpacity: 0.0
  },
  CONVERGENCE: {
    name: 'CONVERGENCE',
    cameraPos: new THREE.Vector3(0, 0, 140),
    cameraTarget: new THREE.Vector3(0, 0, 0),
    coreScale: 0.85,
    coreOpacity: 0.6,
    convergenceOpacity: 1.0,
    scannerOpacity: 0.0
  },
  PARAMETERS: {
    name: 'PARAMETERS',
    cameraPos: new THREE.Vector3(0, 10, 95),
    cameraTarget: new THREE.Vector3(0, 0, 0),
    coreScale: 0.6,
    coreOpacity: 0.4,
    convergenceOpacity: 0.9,
    scannerOpacity: 0.0
  },
  SCANNER: {
    name: 'SCANNER',
    cameraPos: new THREE.Vector3(0, -10, 75),
    cameraTarget: new THREE.Vector3(0, -10, 0),
    coreScale: 0.0,
    coreOpacity: 0.0,
    convergenceOpacity: 0.0,
    scannerOpacity: 1.0
  },
  FINAL: {
    name: 'FINAL',
    cameraPos: new THREE.Vector3(0, 0, 230),
    cameraTarget: new THREE.Vector3(0, 0, 0),
    coreScale: 1.2,
    coreOpacity: 1.0,
    convergenceOpacity: 0.6,
    scannerOpacity: 0.2
  }
};

export class StateManager {
  constructor(sceneCamera) {
    this.camera = sceneCamera;
    this.currentState = CAMERA_STATES.HERO;
    this.listeners = [];
  }

  onStateChange(fn) {
    this.listeners.push(fn);
  }

  setState(stateKey) {
    const targetState = CAMERA_STATES[stateKey.toUpperCase()];
    if (!targetState || this.currentState.name === targetState.name) return;

    this.currentState = targetState;
    this.camera.setTargetState(targetState.cameraPos, targetState.cameraTarget);

    this.listeners.forEach(fn => fn(targetState));
  }
}
