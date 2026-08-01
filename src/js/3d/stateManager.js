/**
 * CYGNUS 3D State Manager & Camera Choreography System
 * Manages transitions across 5 camera states: HERO, CONVERGENCE, PARAMETERS, SCANNER, FINAL.
 */

import * as THREE from 'three';

const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 768;

export const CAMERA_STATES = {
  HERO: {
    name: 'HERO',
    cameraPos: new THREE.Vector3(isDesktop ? -30 : 0, 0, 180),
    cameraTarget: new THREE.Vector3(isDesktop ? -30 : 0, 0, 0),
    coreScale: 1.0,
    coreOpacity: 1.0,
    convergenceOpacity: 0.15,
    scannerOpacity: 0.0
  },
  CONVERGENCE: {
    name: 'CONVERGENCE',
    cameraPos: new THREE.Vector3(0, 0, 140),
    cameraTarget: new THREE.Vector3(0, 0, 0),
    coreScale: 0.85,
    coreOpacity: 0.5,
    convergenceOpacity: 1.0,
    scannerOpacity: 0.0
  },
  PARAMETERS: {
    name: 'PARAMETERS',
    cameraPos: new THREE.Vector3(0, 10, 95),
    cameraTarget: new THREE.Vector3(0, 0, 0),
    coreScale: 0.5,
    coreOpacity: 0.3,
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
    coreScale: 1.1,
    coreOpacity: 1.0,
    convergenceOpacity: 0.5,
    scannerOpacity: 0.15
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
