/**
 * CYGNUS Core — Primary 3D Visual Object
 * 6-Layer Procedural Cybernetic Core with continuous animation, 
 * mouse inertia, hover glow, click pulse, and parameter reactivity.
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
    this.innerSphere = null;
    this.outerWireframe = null;
    this.neuralNodes = null;
    this.neuralLines = null;
    this.orbitalRing1 = null;
    this.orbitalRing2 = null;
    this.particleCloud = null;

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
    // ── Layer 1: Inner Energy Sphere with Custom Shader ──
    const innerGeo = new THREE.IcosahedronGeometry(36, 4);
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
    this.innerSphere = new THREE.Mesh(innerGeo, innerMat);
    this.group.add(this.innerSphere);

    // ── Layer 2: Wireframe Shell ──
    const shellGeo = new THREE.OctahedronGeometry(58, 2);
    const shellMat = new THREE.MeshBasicMaterial({
      color: 0xffaa00,
      wireframe: true,
      transparent: true,
      opacity: 0.22
    });
    this.outerWireframe = new THREE.Mesh(shellGeo, shellMat);
    this.group.add(this.outerWireframe);

    // ── Layer 3 & 4: Neural Nodes & Connection Lines ──
    this.buildNeuralNodesAndLines();

    // ── Layer 5: Counter-Rotating Orbital Rings ──
    const ringGeo1 = new THREE.TorusGeometry(74, 0.7, 16, 120);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0x00f3ff,
      wireframe: true,
      transparent: true,
      opacity: 0.35
    });
    this.orbitalRing1 = new THREE.Mesh(ringGeo1, ringMat1);
    this.orbitalRing1.rotation.x = Math.PI / 3;
    this.group.add(this.orbitalRing1);

    const ringGeo2 = new THREE.TorusGeometry(88, 0.6, 16, 120);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x5e5ce6,
      wireframe: true,
      transparent: true,
      opacity: 0.28
    });
    this.orbitalRing2 = new THREE.Mesh(ringGeo2, ringMat2);
    this.orbitalRing2.rotation.y = Math.PI / 4;
    this.group.add(this.orbitalRing2);

    // ── Layer 6: Outer Floating Particle Cloud ──
    const pCount = 800;
    const pPositions = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * Math.PI * 2;
      const phi = Math.acos(2 * v - 1);
      const r = 50 + Math.random() * 45;

      pPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pPositions[i * 3 + 2] = r * Math.cos(phi);
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0x00f3ff,
      size: 2.0,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });
    this.particleCloud = new THREE.Points(pGeo, pMat);
    this.group.add(this.particleCloud);
  }

  buildNeuralNodesAndLines() {
    const nodeCount = 60;
    const nodePositions = [];
    const radius = 45;

    for (let i = 0; i < nodeCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / nodeCount);
      const theta = Math.sqrt(nodeCount * Math.PI) * phi;
      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);
      nodePositions.push(new THREE.Vector3(x, y, z));
    }

    // Nodes (Points)
    const nodeGeo = new THREE.BufferGeometry().setFromPoints(nodePositions);
    const nodeMat = new THREE.PointsMaterial({
      color: 0x00f3ff,
      size: 4.0,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });
    this.neuralNodes = new THREE.Points(nodeGeo, nodeMat);
    this.group.add(this.neuralNodes);

    // Connecting Lines
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
      opacity: 0.25,
      blending: THREE.AdditiveBlending
    });
    this.neuralLines = new THREE.LineSegments(lineGeo, lineMat);
    this.group.add(this.neuralLines);
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
    this.hoverIntensity += (targetHover - this.hoverIntensity) * 0.08;

    // Handle pulse shockwave decay
    let pulseVal = 0;
    if (this.isPulsing) {
      this.pulseTime += 0.04;
      pulseVal = Math.sin(this.pulseTime * Math.PI) * Math.exp(-this.pulseTime * 2.0);
      if (this.pulseTime >= 1.5) {
        this.isPulsing = false;
      }
    }

    // Update shader uniforms
    if (this.coreShaderUniforms) {
      this.coreShaderUniforms.uTime.value = time;
      this.coreShaderUniforms.uPulse.value = pulseVal + this.hoverIntensity * 0.3;
    }

    // Continuous controlled rotations & orbital movements
    const speedMult = (this.params.autonomy / 50) * (reducedMotion ? 0.2 : 1.0);

    if (this.innerSphere) {
      this.innerSphere.rotation.y = time * 0.12 * speedMult;
      this.innerSphere.rotation.x = Math.sin(time * 0.08) * 0.1;
    }

    if (this.outerWireframe) {
      this.outerWireframe.rotation.y = -time * 0.18 * speedMult;
      this.outerWireframe.rotation.z = time * 0.05 * speedMult;
      const adaptScale = 1.0 + Math.sin(time * 2.0) * (this.params.adaptation / 500) + pulseVal * 0.3;
      this.outerWireframe.scale.set(adaptScale, adaptScale, adaptScale);
    }

    if (this.orbitalRing1) {
      this.orbitalRing1.rotation.z = time * 0.25 * speedMult;
      this.orbitalRing1.rotation.y = time * 0.1 * speedMult;
    }

    if (this.orbitalRing2) {
      this.orbitalRing2.rotation.z = -time * 0.3 * speedMult;
      this.orbitalRing2.rotation.x = time * 0.15 * speedMult;
    }

    if (this.particleCloud) {
      this.particleCloud.rotation.y = time * 0.05 * speedMult;
    }

    if (this.neuralLines) {
      const lineOp = 0.25 + (this.params.bandwidth / 200) + pulseVal * 0.5 + this.hoverIntensity * 0.2;
      this.neuralLines.material.opacity = Math.min(lineOp, 0.9);
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
