/**
 * CYGNUS Camera Manager
 * Smooth perspective camera control with mouse/touch inertia and state interpolation.
 */

import * as THREE from 'three';

export class SceneCamera {
  constructor(width, height) {
    this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1500);
    
    // Default position (HERO state)
    this.currentPosition = new THREE.Vector3(0, 0, 180);
    this.targetPosition = new THREE.Vector3(0, 0, 180);
    
    this.currentLookAt = new THREE.Vector3(0, 0, 0);
    this.targetLookAt = new THREE.Vector3(0, 0, 0);

    this.mouseOffset = new THREE.Vector2(0, 0);
    this.targetMouseOffset = new THREE.Vector2(0, 0);

    this.camera.position.copy(this.currentPosition);
    this.camera.lookAt(this.currentLookAt);
  }

  resize(width, height) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  setMousePosition(normalizedX, normalizedY) {
    // Restrained mouse influence (-15 to 15 units)
    this.targetMouseOffset.x = normalizedX * 15;
    this.targetMouseOffset.y = -normalizedY * 15;
  }

  setTargetState(positionVector, lookAtVector) {
    if (positionVector) this.targetPosition.copy(positionVector);
    if (lookAtVector) this.targetLookAt.copy(lookAtVector);
  }

  update(reducedMotion = false) {
    const lerpFactor = reducedMotion ? 0.02 : 0.05;

    // Smoothly lerp mouse offset
    if (!reducedMotion) {
      this.mouseOffset.lerp(this.targetMouseOffset, 0.04);
    } else {
      this.mouseOffset.set(0, 0);
    }

    // Interpolate camera position and target
    this.currentPosition.lerp(this.targetPosition, lerpFactor);
    this.currentLookAt.lerp(this.targetLookAt, lerpFactor);

    // Apply position + subtle mouse inertia
    this.camera.position.x = this.currentPosition.x + this.mouseOffset.x;
    this.camera.position.y = this.currentPosition.y + this.mouseOffset.y;
    this.camera.position.z = this.currentPosition.z;

    this.camera.lookAt(this.currentLookAt);
  }
}
