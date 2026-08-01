/**
 * CYGNUS 3D WebGL Scene Engine (Phase 2 Upgrade)
 * Three.js scene featuring layered particle core, orbital energy rings, 
 * interactive 3D parameters, click pulse reaction, and adaptive quality.
 */

import * as THREE from 'three';
import { perfManager } from '../utils/performance.js';
import { audioEngine } from './audio.js';
import { Canvas2DFallback } from './scene2dFallback.js';

export class Scene3DManager {
  constructor(canvasElement, fallbackCanvasElement) {
    this.canvas = canvasElement;
    this.fallbackCanvas = fallbackCanvasElement;
    this.isWebGLAvailable = false;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.particles = null;
    this.coreMesh = null;
    this.outerWireframe = null;
    this.orbitalRing1 = null;
    this.orbitalRing2 = null;
    this.neuralLines = null;
    this.animId = null;

    this.targetMouse = new THREE.Vector2(0, 0);
    this.currentMouse = new THREE.Vector2(0, 0);
    this.raycaster = new THREE.Raycaster();
    this.mouseVec = new THREE.Vector2(-10, -10);

    this.time = 0;
    this.pulseTime = 0;
    this.isPulsing = false;
    this.quality = perfManager.qualityProfile;

    // Interactive Parameter State
    this.params = {
      speed: 1.0,
      expansion: 1.0,
      bandwidth: 50,  // 0 - 100
      autonomy: 50,   // 0 - 100
      adaptation: 50  // 0 - 100
    };

    this.init();
  }

  init() {
    try {
      this.initWebGL();
      this.isWebGLAvailable = true;
      if (this.fallbackCanvas) this.fallbackCanvas.style.display = 'none';
    } catch (err) {
      console.warn('[CYGNUS WebGL Engine] WebGL fallback activated:', err);
      this.isWebGLAvailable = false;
      if (this.canvas) this.canvas.style.display = 'none';
      if (this.fallbackCanvas) {
        this.fallbackCanvas.style.display = 'block';
        new Canvas2DFallback(this.fallbackCanvas);
      }
      return;
    }

    this.createCoreGeometry();
    this.setupEventListeners();
    this.animate();

    perfManager.onQualityChange((newProfile) => {
      this.quality = newProfile;
      this.rebuildSceneForQuality();
    });
  }

  initWebGL() {
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x050609, 0.0018);

    const width = this.canvas.clientWidth || window.innerWidth;
    const height = this.canvas.clientHeight || window.innerHeight;

    this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    this.camera.position.z = 180;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: this.quality.name !== 'LOW',
      alpha: true,
      powerPreference: 'high-performance'
    });

    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.quality.maxPixelRatio));
  }

  createCoreGeometry() {
    if (!this.isWebGLAvailable) return;

    while (this.scene.children.length > 0) {
      const obj = this.scene.children[0];
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
        else obj.material.dispose();
      }
      this.scene.remove(obj);
    }

    // 1. Inner Core Wireframe Mesh
    const coreGeo = new THREE.IcosahedronGeometry(35, 3);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x00f3ff,
      wireframe: true,
      transparent: true,
      opacity: 0.4
    });
    this.coreMesh = new THREE.Mesh(coreGeo, coreMat);
    this.scene.add(this.coreMesh);

    // 2. Outer Wireframe Shell
    const outerGeo = new THREE.OctahedronGeometry(58, 2);
    const outerMat = new THREE.MeshBasicMaterial({
      color: 0xffaa00,
      wireframe: true,
      transparent: true,
      opacity: 0.18
    });
    this.outerWireframe = new THREE.Mesh(outerGeo, outerMat);
    this.scene.add(this.outerWireframe);

    // 3. Orbital Rings
    const ringGeo1 = new THREE.TorusGeometry(72, 0.6, 16, 100);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0x00f3ff,
      transparent: true,
      opacity: 0.25,
      wireframe: true
    });
    this.orbitalRing1 = new THREE.Mesh(ringGeo1, ringMat1);
    this.orbitalRing1.rotation.x = Math.PI / 3;
    this.scene.add(this.orbitalRing1);

    const ringGeo2 = new THREE.TorusGeometry(84, 0.5, 16, 100);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x5e5ce6,
      transparent: true,
      opacity: 0.2,
      wireframe: true
    });
    this.orbitalRing2 = new THREE.Mesh(ringGeo2, ringMat2);
    this.orbitalRing2.rotation.y = Math.PI / 4;
    this.scene.add(this.orbitalRing2);

    // 4. Particle Sphere
    const particleCount = this.quality.particleCount;
    const positions = new Float32Array(particleCount * 3);
    const basePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 48 + Math.random() * 45;

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      basePositions[i * 3] = x;
      basePositions[i * 3 + 1] = y;
      basePositions[i * 3 + 2] = z;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.basePositions = basePositions;

    const particleMat = new THREE.PointsMaterial({
      color: 0x00f3ff,
      size: this.quality.name === 'LOW' ? 1.5 : 2.2,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });

    this.particles = new THREE.Points(particleGeo, particleMat);
    this.scene.add(this.particles);

    // 5. Neural Connection Lines
    this.createNeuralLines();
  }

  createNeuralLines() {
    const lineCount = Math.floor(this.quality.neuralConnections * (this.params.bandwidth / 50));
    const linePositions = new Float32Array(lineCount * 6);

    for (let i = 0; i < lineCount; i++) {
      const idx1 = Math.floor(Math.random() * (this.quality.particleCount / 2)) * 3;
      const idx2 = Math.floor(Math.random() * (this.quality.particleCount / 2)) * 3;

      linePositions[i * 6] = this.basePositions[idx1];
      linePositions[i * 6 + 1] = this.basePositions[idx1 + 1];
      linePositions[i * 6 + 2] = this.basePositions[idx1 + 2];

      linePositions[i * 6 + 3] = this.basePositions[idx2];
      linePositions[i * 6 + 4] = this.basePositions[idx2 + 1];
      linePositions[i * 6 + 5] = this.basePositions[idx2 + 2];
    }

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));

    const lineMat = new THREE.LineBasicMaterial({
      color: 0x00f3ff,
      transparent: true,
      opacity: 0.15 * (this.params.bandwidth / 50),
      blending: THREE.AdditiveBlending
    });

    if (this.neuralLines) this.scene.remove(this.neuralLines);
    this.neuralLines = new THREE.LineSegments(lineGeo, lineMat);
    this.scene.add(this.neuralLines);
  }

  rebuildSceneForQuality() {
    if (!this.isWebGLAvailable) return;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.quality.maxPixelRatio));
    this.createCoreGeometry();
  }

  setupEventListeners() {
    window.addEventListener('mousemove', (e) => {
      this.targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.targetMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      this.mouseVec.x = this.targetMouse.x;
      this.mouseVec.y = this.targetMouse.y;
    });

    this.canvas.addEventListener('click', (e) => {
      this.checkCoreClick(e);
    });

    window.addEventListener('resize', () => this.onResize());
  }

  checkCoreClick(e) {
    if (!this.isWebGLAvailable || !this.coreMesh) return;
    this.raycaster.setFromCamera(this.mouseVec, this.camera);
    const intersects = this.raycaster.intersectObject(this.coreMesh);

    if (intersects.length > 0 || Math.hypot(this.targetMouse.x, this.targetMouse.y) < 0.4) {
      this.triggerCorePulse();
    }
  }

  triggerCorePulse() {
    this.isPulsing = true;
    this.pulseTime = 0;
    audioEngine.playCorePulseSound();

    // Trigger visual toast notification
    const toast = document.createElement('div');
    toast.className = 'hud-toast';
    toast.textContent = 'CYGNUS CORE // SYNC INITIALIZED';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
  }

  onResize() {
    if (!this.isWebGLAvailable || !this.renderer || !this.camera) return;
    const width = this.canvas.clientWidth || window.innerWidth;
    const height = this.canvas.clientHeight || window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  updateParameters(params) {
    this.params = { ...this.params, ...params };
    if (params.bandwidth !== undefined && this.isWebGLAvailable) {
      this.createNeuralLines();
    }
  }

  animate() {
    if (!this.isWebGLAvailable) return;

    const speedMult = (this.params.autonomy / 50) * this.params.speed;
    this.time += 0.01 * speedMult;

    this.currentMouse.x += (this.targetMouse.x - this.currentMouse.x) * 0.05;
    this.currentMouse.y += (this.targetMouse.y - this.currentMouse.y) * 0.05;

    // Pulse animation handling
    let pulseScale = 1;
    if (this.isPulsing) {
      this.pulseTime += 0.05;
      pulseScale = 1 + Math.sin(this.pulseTime * Math.PI) * 0.25;
      if (this.pulseTime >= 1) {
        this.isPulsing = false;
      }
    }

    // Rotate & Deform Meshes
    if (this.coreMesh) {
      this.coreMesh.rotation.x = this.time * 0.4;
      this.coreMesh.rotation.y = this.time * 0.6;
      const baseScale = (1 + Math.sin(this.time * 2) * 0.04 * (this.params.adaptation / 50)) * pulseScale;
      this.coreMesh.scale.set(baseScale, baseScale, baseScale);
    }

    if (this.outerWireframe) {
      this.outerWireframe.rotation.x = -this.time * 0.2;
      this.outerWireframe.rotation.y = -this.time * 0.3;
    }

    if (this.orbitalRing1) {
      this.orbitalRing1.rotation.z = this.time * 0.5;
      this.orbitalRing1.rotation.x = Math.PI / 3 + Math.sin(this.time) * 0.1;
    }

    if (this.orbitalRing2) {
      this.orbitalRing2.rotation.z = -this.time * 0.4;
    }

    // Force-field particle perturbation
    if (this.particles && this.basePositions) {
      const posAttr = this.particles.geometry.attributes.position;
      const posArr = posAttr.array;

      const mx = this.currentMouse.x * 60;
      const my = this.currentMouse.y * 60;

      for (let i = 0; i < posArr.length / 3; i++) {
        const bx = this.basePositions[i * 3];
        const by = this.basePositions[i * 3 + 1];
        const bz = this.basePositions[i * 3 + 2];

        const dx = bx - mx;
        const dy = by - my;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let force = 0;
        if (dist < 50) {
          force = (1 - dist / 50) * 15 * (this.params.adaptation / 50);
        }

        const wave = Math.sin(this.time * 2 + i) * 2;
        const pulseForce = this.isPulsing ? Math.sin(this.pulseTime * Math.PI) * 12 : 0;

        posArr[i * 3] = bx + (dx / (dist || 1)) * (force + pulseForce) + wave;
        posArr[i * 3 + 1] = by + (dy / (dist || 1)) * (force + pulseForce) + wave;
        posArr[i * 3 + 2] = bz + Math.cos(this.time + i) * 2;
      }

      posAttr.needsUpdate = true;
    }

    this.camera.position.x = this.currentMouse.x * 14;
    this.camera.position.y = this.currentMouse.y * 14;
    this.camera.lookAt(0, 0, 0);

    this.renderer.render(this.scene, this.camera);
    this.animId = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    if (this.animId) cancelAnimationFrame(this.animId);
  }
}
