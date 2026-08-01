/**
 * CYGNUS Master 3D Scene Orchestrator
 * Coordinates Renderer, Camera, Lighting, Background, Core, Convergence,
 * Cyborg Scanner, StateManager, Raycasting, and RAF Loop.
 */

import * as THREE from 'three';
import { SceneRenderer } from './renderer.js';
import { SceneCamera } from './camera.js';
import { SceneLighting } from './lighting.js';
import { BackgroundEnvironment } from './particles.js';
import { CygnusCore } from './core.js';
import { ConvergenceSystem } from './convergence.js';
import { CyborgScanner } from './scanner.js';
import { StateManager } from './stateManager.js';
import { qualityManager } from './quality.js';
import { Canvas2DFallback } from '../scene2dFallback.js';

export class Scene3DManager {
  constructor(canvasElement, fallbackCanvasElement) {
    this.canvas = canvasElement;
    this.fallbackCanvas = fallbackCanvasElement;
    this.isWebGLAvailable = false;

    this.scene = null;
    this.renderer = null;
    this.cameraManager = null;
    this.lighting = null;
    this.background = null;
    this.core = null;
    this.convergence = null;
    this.scanner = null;
    this.stateManager = null;

    this.animId = null;
    this.clock = new THREE.Clock();
    this.raycaster = new THREE.Raycaster();
    this.mouseVec = new THREE.Vector2(-10, -10);

    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.init();
  }

  init() {
    try {
      this.initWebGL();
      this.isWebGLAvailable = true;
      if (this.fallbackCanvas) this.fallbackCanvas.style.display = 'none';
    } catch (err) {
      console.warn('[CYGNUS 3D Engine] WebGL fallback activated:', err);
      this.isWebGLAvailable = false;
      if (this.canvas) this.canvas.style.display = 'none';
      if (this.fallbackCanvas) {
        this.fallbackCanvas.style.display = 'block';
        new Canvas2DFallback(this.fallbackCanvas);
      }
      return;
    }

    this.buildSceneObjects();
    this.setupEventListeners();
    this.animate();
  }

  initWebGL() {
    this.scene = new THREE.Scene();

    const width = this.canvas.clientWidth || window.innerWidth;
    const height = this.canvas.clientHeight || window.innerHeight;

    this.renderer = new SceneRenderer(this.canvas);
    this.cameraManager = new SceneCamera(width, height);
    this.lighting = new SceneLighting(this.scene);
    this.stateManager = new StateManager(this.cameraManager);
  }

  buildSceneObjects() {
    if (!this.isWebGLAvailable) return;

    this.background = new BackgroundEnvironment(this.scene);
    this.core = new CygnusCore(this.scene);
    this.convergence = new ConvergenceSystem(this.scene);
    this.scanner = new CyborgScanner(this.scene);

    // React to state changes
    this.stateManager.onStateChange((state) => {
      if (this.core && this.core.group) {
        const targetScale = state.coreScale;
        this.core.group.scale.set(targetScale, targetScale, targetScale);
        this.core.group.visible = state.coreOpacity > 0;
      }
      if (this.convergence && this.convergence.group) {
        this.convergence.group.visible = state.convergenceOpacity > 0;
      }
      if (this.scanner && this.scanner.group) {
        this.scanner.group.visible = state.scannerOpacity > 0;
      }
    });

    // Default to HERO state
    this.stateManager.setState('HERO');
  }

  setupEventListeners() {
    if (!this.isWebGLAvailable) return;

    // Window Resize
    this.resizeHandler = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      this.renderer.resize(w, h);
      this.cameraManager.resize(w, h);
    };
    window.addEventListener('resize', this.resizeHandler);

    // Mouse Move (Lerped Camera Inertia & Raycasting)
    this.mouseMoveHandler = (e) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = -(e.clientY / window.innerHeight) * 2 + 1;
      this.mouseVec.set(normX, normY);
      this.cameraManager.setMousePosition(normX, normY);

      // Raycast Core Hover
      if (this.core && this.cameraManager) {
        this.raycaster.setFromCamera(this.mouseVec, this.cameraManager.camera);
        const intersects = this.raycaster.intersectObjects(this.core.group.children, true);
        this.core.setHover(intersects.length > 0);
      }
    };
    window.addEventListener('mousemove', this.mouseMoveHandler);

    // Core Click
    this.clickHandler = () => {
      if (this.core && this.cameraManager) {
        this.raycaster.setFromCamera(this.mouseVec, this.cameraManager.camera);
        const intersects = this.raycaster.intersectObjects(this.core.group.children, true);
        if (intersects.length > 0) {
          this.core.triggerPulse();
        }
      }
    };
    window.addEventListener('click', this.clickHandler);

    // Reduced motion media query listener
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.motionHandler = (e) => {
      this.reducedMotion = e.matches;
    };
    if (motionQuery.addEventListener) {
      motionQuery.addEventListener('change', this.motionHandler);
    }
  }

  updateParameters(params) {
    if (this.core) this.core.updateParameters(params);
  }

  setConvergence(val) {
    if (this.convergence) this.convergence.setConvergence(val);
  }

  setCameraState(stateKey) {
    if (this.stateManager) this.stateManager.setState(stateKey);
  }

  animate() {
    this.animId = requestAnimationFrame((t) => {
      qualityManager.updateFrameRate(t);
      this.animate();
    });

    const elapsed = this.clock.getElapsedTime();

    if (this.cameraManager) this.cameraManager.update(this.reducedMotion);
    if (this.lighting) this.lighting.update(elapsed, this.core ? (this.core.isPulsing ? 1 : 0) : 0);
    if (this.background) this.background.update(elapsed, this.reducedMotion);
    if (this.core) this.core.update(elapsed, this.reducedMotion);
    if (this.convergence) this.convergence.update(elapsed, this.reducedMotion);
    if (this.scanner) this.scanner.update(elapsed, this.reducedMotion);

    if (this.renderer && this.scene && this.cameraManager) {
      this.renderer.render(this.scene, this.cameraManager.camera);
    }
  }

  dispose() {
    if (this.animId) cancelAnimationFrame(this.animId);
    window.removeEventListener('resize', this.resizeHandler);
    window.removeEventListener('mousemove', this.mouseMoveHandler);
    window.removeEventListener('click', this.clickHandler);

    if (this.background) this.background.dispose();
    if (this.core) this.core.dispose();
    if (this.convergence) this.convergence.dispose();
    if (this.scanner) this.scanner.dispose();
    if (this.lighting) this.lighting.dispose();
    if (this.renderer) this.renderer.dispose();
  }
}
