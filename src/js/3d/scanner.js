/**
 * CYGNUS 3D Cyborg & System Scanner Subsystem
 * Procedural cybernetic humanoid representation, vertical holographic scan plane,
 * interactive 3D hotspots (NEURAL, OPTICAL, COGNITIVE, MOTOR, CORE), diagnostic HUD updates.
 */

import * as THREE from 'three';
import { ScanPlaneShader } from './shaders.js';
import { audioEngine } from '../audio.js';

export class CyborgScanner {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.scene.add(this.group);

    // Reposition for SCANNER camera state
    this.group.position.set(0, -10, 0);

    this.humanoidGroup = new THREE.Group();
    this.scanPlaneMesh = null;
    this.scanUniforms = null;
    this.hotspotObjects = [];
    this.activeHotspot = null;

    // Hotspot locations in 3D relative to humanoid center
    this.hotspots = [
      { id: 'NEURAL', name: 'NEURAL SYSTEM', pos: new THREE.Vector3(0, 38, 5), status: 'OPTIMAL // SYNAPSE LATENCY 0.4ms' },
      { id: 'OPTICAL', name: 'OPTICAL SENSORS', pos: new THREE.Vector3(0, 48, 12), status: 'SPECTRAL RESOLUTION 8K HDR' },
      { id: 'COGNITIVE', name: 'COGNITIVE ENGINE', pos: new THREE.Vector3(0, 20, 8), status: 'FLOATING POINT SPEED 128 TFLOPS' },
      { id: 'MOTOR', name: 'MOTOR ACTUATORS', pos: new THREE.Vector3(22, 10, 0), status: 'SUB-MILLIMETER PRECISION' },
      { id: 'CORE', name: 'CYGNUS CORE LINK', pos: new THREE.Vector3(0, 0, 15), status: 'QUANTUM ENCRYPTION ACTIVE' }
    ];

    this.init();
  }

  init() {
    this.group.add(this.humanoidGroup);

    // ── 1. Cybernetic Head & Face Grid ──
    const headGeo = new THREE.IcosahedronGeometry(14, 2);
    const headMat = new THREE.MeshBasicMaterial({
      color: 0x00f3ff,
      wireframe: true,
      transparent: true,
      opacity: 0.45
    });
    const headMesh = new THREE.Mesh(headGeo, headMat);
    headMesh.position.set(0, 42, 0);
    this.humanoidGroup.add(headMesh);

    // Optical Sensor Visor
    const visorGeo = new THREE.BoxGeometry(16, 3, 8);
    const visorMat = new THREE.MeshBasicMaterial({
      color: 0xffaa00,
      transparent: true,
      opacity: 0.8
    });
    const visorMesh = new THREE.Mesh(visorGeo, visorMat);
    visorMesh.position.set(0, 44, 8);
    this.humanoidGroup.add(visorMesh);

    // ── 2. Torso Structure ──
    const torsoGeo = new THREE.CylinderGeometry(16, 8, 38, 8, 4, true);
    const torsoMat = new THREE.MeshBasicMaterial({
      color: 0x00f3ff,
      wireframe: true,
      transparent: true,
      opacity: 0.3
    });
    const torsoMesh = new THREE.Mesh(torsoGeo, torsoMat);
    torsoMesh.position.set(0, 15, 0);
    this.humanoidGroup.add(torsoMesh);

    // Core Heart Orb
    const heartGeo = new THREE.SphereGeometry(6, 16, 16);
    const heartMat = new THREE.MeshBasicMaterial({
      color: 0x00f3ff,
      wireframe: true,
      transparent: true,
      opacity: 0.85
    });
    const heartMesh = new THREE.Mesh(heartGeo, heartMat);
    heartMesh.position.set(0, 18, 5);
    this.humanoidGroup.add(heartMesh);

    // ── 3. Arms & Limbs Wireframe ──
    const armGeo = new THREE.CylinderGeometry(3, 2, 35, 6, 2, true);
    const armMat = new THREE.MeshBasicMaterial({
      color: 0x2a364f,
      wireframe: true,
      transparent: true,
      opacity: 0.4
    });
    const armL = new THREE.Mesh(armGeo, armMat);
    armL.position.set(-22, 12, 0);
    armL.rotation.z = 0.15;
    this.humanoidGroup.add(armL);

    const armR = new THREE.Mesh(armGeo, armMat);
    armR.position.set(22, 12, 0);
    armR.rotation.z = -0.15;
    this.humanoidGroup.add(armR);

    // ── 4. Holographic Scan Plane ──
    const planeGeo = new THREE.PlaneGeometry(80, 100);
    this.scanUniforms = THREE.UniformsUtils.clone(ScanPlaneShader.uniforms);
    this.scanUniforms.uColor.value = new THREE.Color(0x00f3ff);

    const planeMat = new THREE.ShaderMaterial({
      uniforms: this.scanUniforms,
      vertexShader: ScanPlaneShader.vertexShader,
      fragmentShader: ScanPlaneShader.fragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });
    this.scanPlaneMesh = new THREE.Mesh(planeGeo, planeMat);
    this.scanPlaneMesh.position.set(0, 20, 0);
    this.group.add(this.scanPlaneMesh);

    // ── 5. Build Interactive Hotspots ──
    this.buildHotspots();
  }

  buildHotspots() {
    this.hotspots.forEach(hp => {
      const geo = new THREE.SphereGeometry(2.5, 12, 12);
      const mat = new THREE.MeshBasicMaterial({
        color: 0xffaa00,
        transparent: true,
        opacity: 0.9,
        wireframe: true
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.copy(hp.pos);
      mesh.userData = hp;
      this.humanoidGroup.add(mesh);
      this.hotspotObjects.push(mesh);
    });
  }

  selectHotspot(id) {
    const hp = this.hotspots.find(h => h.id === id);
    if (!hp) return null;

    this.activeHotspot = hp;
    audioEngine.playScanPulseSound();

    this.hotspotObjects.forEach(obj => {
      if (obj.userData.id === id) {
        obj.material.color.setHex(0x00f3ff);
        obj.scale.set(1.8, 1.8, 1.8);
      } else {
        obj.material.color.setHex(0xffaa00);
        obj.scale.set(1.0, 1.0, 1.0);
      }
    });

    return hp;
  }

  update(time, reducedMotion = false) {
    if (this.scanUniforms) {
      this.scanUniforms.uTime.value = time;
    }

    // Oscillate scan plane vertically
    if (this.scanPlaneMesh) {
      this.scanPlaneMesh.position.y = 20 + Math.sin(time * 1.8) * 32;
    }

    if (!reducedMotion && this.humanoidGroup) {
      this.humanoidGroup.rotation.y = Math.sin(time * 0.4) * 0.15;
    }
  }

  dispose() {
    this.group.traverse((obj) => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) obj.material.dispose();
    });
    this.scene.remove(this.group);
  }
}
