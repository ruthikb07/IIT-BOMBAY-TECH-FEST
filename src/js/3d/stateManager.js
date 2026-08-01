/**
 * CYGNUS 3D State Manager & Camera Choreography System
 * Manages smooth camera transitions across 9 continuous 3D states:
 * HERO, CONVERGENCE, PARAMETERS, SCANNER, COMPETITIONS, TIMELINE, TERMINAL, PASS, FINAL.
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
    coreOpacity: 0.4,
    convergenceOpacity: 1.0,
    scannerOpacity: 0.0
  },
  PARAMETERS: {
    name: 'PARAMETERS',
    cameraPos: new THREE.Vector3(0, 10, 95),
    cameraTarget: new THREE.Vector3(0, 0, 0),
    coreScale: 0.5,
    coreOpacity: 0.25,
    convergenceOpacity: 0.8,
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
  COMPETITIONS: {
    name: 'COMPETITIONS',
    cameraPos: new THREE.Vector3(-20, -5, 210),
    cameraTarget: new THREE.Vector3(-20, -5, 0),
    coreScale: 0.55,
    coreOpacity: 0.2,
    convergenceOpacity: 0.15,
    scannerOpacity: 0.0
  },
  TIMELINE: {
    name: 'TIMELINE',
    cameraPos: new THREE.Vector3(20, 5, 220),
    cameraTarget: new THREE.Vector3(20, 5, 0),
    coreScale: 0.55,
    coreOpacity: 0.2,
    convergenceOpacity: 0.15,
    scannerOpacity: 0.0
  },
  TERMINAL: {
    name: 'TERMINAL',
    cameraPos: new THREE.Vector3(0, 15, 200),
    cameraTarget: new THREE.Vector3(0, 0, 0),
    coreScale: 0.5,
    coreOpacity: 0.18,
    convergenceOpacity: 0.2,
    scannerOpacity: 0.0
  },
  PASS: {
    name: 'PASS',
    cameraPos: new THREE.Vector3(0, -5, 225),
    cameraTarget: new THREE.Vector3(0, -5, 0),
    coreScale: 0.45,
    coreOpacity: 0.15,
    convergenceOpacity: 0.1,
    scannerOpacity: 0.0
  },
  FINAL: {
    name: 'FINAL',
    cameraPos: new THREE.Vector3(0, 0, 240),
    cameraTarget: new THREE.Vector3(0, 0, 0),
    coreScale: 0.7,
    coreOpacity: 0.35,
    convergenceOpacity: 0.2,
    scannerOpacity: 0.0
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
