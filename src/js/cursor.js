/**
 * CYGNUS Custom Magnetic Cursor (Phase 2 — Multi-State)
 * States: normal, text, link, CTA, core-hover
 * Auto-disabled on touch devices and reduced-motion environments.
 */

import { perfManager } from '../utils/performance.js';

export class CustomCursor {
  constructor(dotElement, ringElement) {
    this.dot = dotElement;
    this.ring = ringElement;

    this.mouse = { x: -100, y: -100 };
    this.ringPos = { x: -100, y: -100 };
    this.animId = null;
    this.currentState = 'normal';

    this.init();
  }

  init() {
    if (perfManager.isTouch || perfManager.prefersReducedMotion) {
      if (this.dot) this.dot.style.display = 'none';
      if (this.ring) this.ring.style.display = 'none';
      return;
    }

    // Hide default system cursor globally
    document.documentElement.style.cursor = 'none';

    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      if (this.dot) {
        this.dot.style.transform = `translate(${this.mouse.x}px, ${this.mouse.y}px)`;
      }
    });

    this.bindInteractables();
    this.animate();
  }

  bindInteractables() {
    // CTA buttons — big magnetic ring
    document.querySelectorAll('.btn-tech, .btn-tech-primary').forEach((el) => {
      el.style.cursor = 'none';
      el.addEventListener('mouseenter', () => this.setState('cta'));
      el.addEventListener('mouseleave', () => this.setState('normal'));
    });

    // Links and nav items — target reticle
    document.querySelectorAll('a, .nav-link, .mobile-nav-link, .tab-btn, .cat-btn').forEach((el) => {
      el.style.cursor = 'none';
      el.addEventListener('mouseenter', () => this.setState('link'));
      el.addEventListener('mouseleave', () => this.setState('normal'));
    });

    // Text inputs — text cursor
    document.querySelectorAll('input[type="text"], select, textarea').forEach((el) => {
      el.style.cursor = 'none';
      el.addEventListener('mouseenter', () => this.setState('text'));
      el.addEventListener('mouseleave', () => this.setState('normal'));
    });

    // 3D Core canvas — energy field
    const coreCanvas = document.getElementById('hero-3d-canvas');
    if (coreCanvas) {
      coreCanvas.style.cursor = 'none';
      coreCanvas.addEventListener('mouseenter', () => this.setState('core'));
      coreCanvas.addEventListener('mouseleave', () => this.setState('normal'));
    }

    // HUD boxes — subtle ring
    document.querySelectorAll('.hud-box, .audio-toggle-btn, .modal-close-btn, .mobile-menu-btn').forEach((el) => {
      el.style.cursor = 'none';
      el.addEventListener('mouseenter', () => {
        if (this.currentState === 'normal') this.setState('link');
      });
      el.addEventListener('mouseleave', () => this.setState('normal'));
    });
  }

  setState(state) {
    this.currentState = state;
    if (!this.dot || !this.ring) return;

    switch (state) {
      case 'normal':
        this.dot.style.width = '10px';
        this.dot.style.height = '10px';
        this.dot.style.background = 'var(--accent-cyan)';
        this.ring.style.width = '36px';
        this.ring.style.height = '36px';
        this.ring.style.borderColor = 'rgba(0, 243, 255, 0.4)';
        this.ring.style.backgroundColor = 'transparent';
        this.ring.style.borderStyle = 'solid';
        break;

      case 'text':
        this.dot.style.width = '2px';
        this.dot.style.height = '20px';
        this.dot.style.background = 'var(--accent-cyan)';
        this.dot.style.borderRadius = '1px';
        this.ring.style.width = '28px';
        this.ring.style.height = '28px';
        this.ring.style.borderColor = 'rgba(0, 243, 255, 0.2)';
        this.ring.style.backgroundColor = 'transparent';
        this.ring.style.borderStyle = 'solid';
        break;

      case 'link':
        this.dot.style.width = '6px';
        this.dot.style.height = '6px';
        this.dot.style.background = 'var(--accent-cyan)';
        this.dot.style.borderRadius = '50%';
        this.ring.style.width = '44px';
        this.ring.style.height = '44px';
        this.ring.style.borderColor = 'rgba(0, 243, 255, 0.7)';
        this.ring.style.backgroundColor = 'transparent';
        this.ring.style.borderStyle = 'dashed';
        break;

      case 'cta':
        this.dot.style.width = '8px';
        this.dot.style.height = '8px';
        this.dot.style.background = '#fff';
        this.dot.style.borderRadius = '50%';
        this.ring.style.width = '58px';
        this.ring.style.height = '58px';
        this.ring.style.borderColor = 'rgba(0, 243, 255, 0.9)';
        this.ring.style.backgroundColor = 'rgba(0, 243, 255, 0.06)';
        this.ring.style.borderStyle = 'solid';
        break;

      case 'core':
        this.dot.style.width = '4px';
        this.dot.style.height = '4px';
        this.dot.style.background = 'var(--accent-cyan)';
        this.dot.style.borderRadius = '50%';
        this.ring.style.width = '48px';
        this.ring.style.height = '48px';
        this.ring.style.borderColor = 'rgba(0, 243, 255, 0.6)';
        this.ring.style.backgroundColor = 'rgba(0, 243, 255, 0.04)';
        this.ring.style.borderStyle = 'dotted';
        break;
    }

    // Reset border-radius for non-text states
    if (state !== 'text') {
      this.dot.style.borderRadius = '50%';
    }
  }

  animate() {
    this.ringPos.x += (this.mouse.x - this.ringPos.x) * 0.15;
    this.ringPos.y += (this.mouse.y - this.ringPos.y) * 0.15;

    if (this.ring) {
      this.ring.style.transform = `translate(${this.ringPos.x}px, ${this.ringPos.y}px)`;
    }

    this.animId = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    if (this.animId) cancelAnimationFrame(this.animId);
  }
}
