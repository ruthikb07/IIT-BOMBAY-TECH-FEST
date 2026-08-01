/**
 * CYGNUS 3D Rotating Cyber Globe (Primary Visual Hero Object)
 * Interactive 3D globe with latitude/longitude tech grid, continent neural nodes,
 * inner energy glow, orbital rings, atmosphere particles, mouse inertia, and click reaction.
 */

import * as THREE from 'three';
import { CoreEnergyShader } from './shaders.js';
import { audioEngine } from '../audio.js';

export class CygnusCore {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.scene.add(this.group);

    // Layer references
    this.globeWireframe = null;
    this.innerGlowSphere = null;
    this.continentNodes = null;
    this.connectionLines = null;
    this.orbitalRing1 = null;
    this.orbitalRing2 = null;
    this.atmosphereParticles = null;

    // Shader uniforms
    this.coreShaderUniforms = null;

    // Interaction & Animation State
    this.pulseTime = 0;
    this.isPulsing = false;
    this.isHovered = false;
    this.hoverIntensity = 0;

    // Parameter values
    this.params = {
      bandwidth: 50,
      autonomy: 50,
      adaptation: 50
    };

    this.init();
  }

  init() {
    // ── Layer 1: Inner Glowing Core Sphere ──
    const innerGeo = new THREE.SphereGeometry(32, 32, 32);
    this.coreShaderUniforms = THREE.UniformsUtils.clone(CoreEnergyShader.uniforms);
    this.coreShaderUniforms.uColor.value = new THREE.Color(0x00f3ff);

    const innerMat = new THREE.ShaderMaterial({
      uniforms: this.coreShaderUniforms,
      vertexShader: CoreEnergyShader.vertexShader,
      fragmentShader: CoreEnergyShader.fragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });
    this.innerGlowSphere = new THREE.Mesh(innerGeo, innerMat);
    this.group.add(this.innerGlowSphere);

    // ── Layer 2: Cyber Globe Wireframe (Latitude & Longitude Tech Grid) ──
    const globeGeo = new THREE.SphereGeometry(46, 24, 24);
    const globeMat = new THREE.MeshBasicMaterial({
      color: 0x00f3ff,
      wireframe: true,
      transparent: true,
      opacity: 0.35
    });
    this.globeWireframe = new THREE.Mesh(globeGeo, globeMat);
    this.group.add(this.globeWireframe);

    // ── Layer 3: Continent Data Nodes & Connection Arcs ──
    this.buildGlobeNodes();

    // ── Layer 4: Orbital Satellite Rings ──
    const ringGeo1 = new THREE.TorusGeometry(65, 0.5, 16, 120);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0x00f3ff,
      wireframe: true,
      transparent: true,
      opacity: 0.3
    });
    this.orbitalRing1 = new THREE.Mesh(ringGeo1, ringMat1);
    this.orbitalRing1.rotation.x = Math.PI / 3;
    this.group.add(this.orbitalRing1);

    const ringGeo2 = new THREE.TorusGeometry(78, 0.4, 16, 120);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x5e5ce6,
      wireframe: true,
      transparent: true,
      opacity: 0.22
    });
    this.orbitalRing2 = new THREE.Mesh(ringGeo2, ringMat2);
    this.orbitalRing2.rotation.y = Math.PI / 4;
    this.group.add(this.orbitalRing2);

    // ── Layer 5: Atmosphere Particle Dust ──
    const pCount = 450;
    const pPositions = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * Math.PI * 2;
      const phi = Math.acos(2 * v - 1);
      const r = 52 + Math.random() * 30;

      pPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pPositions[i * 3 + 2] = r * Math.cos(phi);
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0x00f3ff,
      size: 1.8,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    this.atmosphereParticles = new THREE.Points(pGeo, pMat);
    this.group.add(this.atmosphereParticles);
  }

  buildGlobeNodes() {
    const nodeCount = 50;
    const nodePositions = [];
    const radius = 46.5;

    // Fibonacci sphere distribution for global continent node points
    for (let i = 0; i < nodeCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / nodeCount);
      const theta = Math.sqrt(nodeCount * Math.PI) * phi;
      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);
      nodePositions.push(new THREE.Vector3(x, y, z));
    }

    // Nodes (Glow Points)
    const nodeGeo = new THREE.BufferGeometry().setFromPoints(nodePositions);
    const nodeMat = new THREE.PointsMaterial({
      color: 0xffaa00,
      size: 3.8,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });
    this.continentNodes = new THREE.Points(nodeGeo, nodeMat);
    this.group.add(this.continentNodes);

    // Connection Arcs across Globe Surface
    const linePositions = [];
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        if (nodePositions[i].distanceTo(nodePositions[j]) < 28) {
          linePositions.push(nodePositions[i].x, nodePositions[i].y, nodePositions[i].z);
          linePositions.push(nodePositions[j].x, nodePositions[j].y, nodePositions[j].z);
        }
      }
    }
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x00f3ff,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending
    });
    this.connectionLines = new THREE.LineSegments(lineGeo, lineMat);
    this.group.add(this.connectionLines);
  }

  setHover(hovered) {
    this.isHovered = hovered;
  }

  triggerPulse() {
    this.isPulsing = true;
    this.pulseTime = 0;
    audioEngine.playCorePulseSound();
  }

  updateParameters(params) {
    Object.assign(this.params, params);
  }

  update(time, reducedMotion = false) {
    // Lerp hover intensity
    const targetHover = this.isHovered ? 1 : 0;
    this.hoverIntensity += (targetHover - this.hoverIntensity) * 0.05;

    // Pulse shockwave decay
    let pulseVal = 0;
    if (this.isPulsing) {
      this.pulseTime += 0.03;
      pulseVal = Math.sin(this.pulseTime * Math.PI) * Math.exp(-this.pulseTime * 2.5);
      if (this.pulseTime >= 1.2) {
        this.isPulsing = false;
      }
    }

    // Update shader uniforms
    if (this.coreShaderUniforms) {
      this.coreShaderUniforms.uTime.value = time;
      this.coreShaderUniforms.uPulse.value = pulseVal + this.hoverIntensity * 0.2;
    }

    // Continuous smooth Globe rotation (Earth axis tilt)
    const speedMult = (this.params.autonomy / 50) * (reducedMotion ? 0.15 : 0.6);

    // Globe Y-axis rotation (Rotating Globe)
    this.group.rotation.y = time * 0.08 * speedMult;
    this.group.rotation.x = 0.25; // Subtle 15-degree axial tilt

    if (this.innerGlowSphere) {
      this.innerGlowSphere.rotation.y = -time * 0.04 * speedMult;
    }

    if (this.globeWireframe) {
      const adaptScale = 1.0 + Math.sin(time * 1.2) * (this.params.adaptation / 900) + pulseVal * 0.12;
      this.globeWireframe.scale.set(adaptScale, adaptScale, adaptScale);
    }

    if (this.orbitalRing1) {
      this.orbitalRing1.rotation.z = time * 0.12 * speedMult;
    }

    if (this.orbitalRing2) {
      this.orbitalRing2.rotation.z = -time * 0.15 * speedMult;
    }

    if (this.atmosphereParticles) {
      this.atmosphereParticles.rotation.y = -time * 0.02 * speedMult;
    }

    if (this.connectionLines) {
      const lineOp = 0.35 + (this.params.bandwidth / 300) + pulseVal * 0.3;
      this.connectionLines.material.opacity = Math.min(lineOp, 0.85);
    }
  }

  dispose() {
    this.group.traverse((obj) => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
        else obj.material.dispose();
      }
    });
    this.scene.remove(this.group);
  }
}
