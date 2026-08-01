/**
 * CYGNUS Application Coordinator (Phase 3 Full 3D Transformation)
 * IIT BOMBAY TECHFEST COMPETITION SUBMISSION
 *
 * Coordinates: 3D scene, 5 camera states, convergence slider, parameter matrix,
 * cyborg 3D scanner, audio, mobile menu, countdown, competition matrix,
 * timeline, CLI terminal, holographic badge generator, and accessibility.
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { APP_CONFIG } from '../data/config.js';
import { perfManager } from '../utils/performance.js';
import { Scene3DManager } from './scene3d.js';
import { audioEngine } from './audio.js';
import { TerminalEmulator } from './terminal.js';
import { BadgeGenerator } from './badge.js';
import { CustomCursor } from './cursor.js';
import { EventsManager } from './eventsModal.js';
import { TimelineManager } from './timeline.js';
import { PARTNER_GRID } from '../data/partners.js';

gsap.registerPlugin(ScrollTrigger);

class CygnusApp {
  constructor() {
    this.scene3d = null;
    this.init();
  }

  init() {
    document.addEventListener('DOMContentLoaded', () => {
      this.setupHUD();
      this.init3DScene();
      this.initAudioToggle();
      this.initMobileMenu();
      this.initCountdown();
      this.initNeuralVisualizer();
      this.initScannerHUD();
      this.initEventsMatrix();
      this.initTimeline();
      this.initTerminal();
      this.initBadgeGenerator();
      this.initPartnersGrid();
      this.initCursor();
      this.initKeyboardAccessibility();
      this.initScrollAnimations();
      this.initVisibilityOptimization();
    });
  }

  /* ─── HUD Clock ─── */
  setupHUD() {
    const clockEl = document.getElementById('hud-utc-clock');
    if (clockEl) {
      const updateClock = () => {
        const now = new Date();
        clockEl.textContent = now.toISOString().slice(11, 19) + ' UTC';
      };
      updateClock();
      setInterval(updateClock, 1000);
    }
  }

  /* ─── 3D Scene Initialization ─── */
  init3DScene() {
    const canvas3d = document.getElementById('hero-3d-canvas');
    const canvas2d = document.getElementById('hero-2d-fallback');
    if (canvas3d) {
      this.scene3d = new Scene3DManager(canvas3d, canvas2d);
    }
  }

  /* ─── Audio Toggle ─── */
  initAudioToggle() {
    const audioBtn = document.getElementById('audio-toggle-btn');
    if (audioBtn) {
      audioBtn.addEventListener('click', () => {
        const isMuted = audioEngine.toggleMute();
        audioBtn.classList.toggle('active', !isMuted);
        const label = audioBtn.querySelector('.audio-lbl');
        if (label) label.textContent = isMuted ? 'MUTED' : 'AUDIO ON';
      });
    }
  }

  /* ─── Mobile Menu ─── */
  initMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const menuClose = document.getElementById('mobile-menu-close');
    const overlay = document.getElementById('mobile-menu-overlay');
    const links = document.querySelectorAll('.mobile-nav-link');

    const openMenu = () => {
      if (!overlay) return;
      audioEngine.playModalOpenSound();
      overlay.classList.add('open');
      if (menuClose) menuClose.focus();
    };

    const closeMenu = () => {
      if (!overlay) return;
      overlay.classList.remove('open');
      if (menuBtn) menuBtn.focus();
    };

    if (menuBtn) menuBtn.addEventListener('click', openMenu);
    if (menuClose) menuClose.addEventListener('click', closeMenu);
    links.forEach((link) => link.addEventListener('click', closeMenu));
  }

  /* ─── Countdown ─── */
  initCountdown() {
    const box = document.getElementById('countdown-container');
    if (!box) return;

    const targetStr = APP_CONFIG.eventDate;
    if (!targetStr) {
      const fallback = document.createElement('div');
      fallback.style.cssText = 'font-family: var(--font-mono); color: var(--accent-amber); font-size: 0.85rem;';
      fallback.textContent = APP_CONFIG.eventDateFallbackText;
      box.innerHTML = '';
      box.appendChild(fallback);
      return;
    }

    const targetDate = new Date(targetStr).getTime();
    const pad = (n) => String(n).padStart(2, '0');

    const updateTimer = () => {
      const now = Date.now();
      const diff = targetDate - now;

      if (diff <= 0) {
        box.textContent = '';
        const live = document.createElement('div');
        live.style.cssText = 'font-family: var(--font-mono); color: var(--accent-cyan); font-size: 0.85rem;';
        live.textContent = 'EVENT LIVE';
        box.appendChild(live);
        return;
      }

      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);

      let units = box.querySelectorAll('.countdown-val');
      if (units.length === 4) {
        units[0].textContent = pad(days);
        units[1].textContent = pad(hours);
        units[2].textContent = pad(minutes);
        units[3].textContent = pad(seconds);
      } else {
        box.innerHTML = `
          <div class="countdown-unit"><div class="countdown-val">${pad(days)}</div><div class="countdown-lbl">DAYS</div></div>
          <div style="font-family:var(--font-mono);color:var(--border);">:</div>
          <div class="countdown-unit"><div class="countdown-val">${pad(hours)}</div><div class="countdown-lbl">HRS</div></div>
          <div style="font-family:var(--font-mono);color:var(--border);">:</div>
          <div class="countdown-unit"><div class="countdown-val">${pad(minutes)}</div><div class="countdown-lbl">MIN</div></div>
          <div style="font-family:var(--font-mono);color:var(--border);">:</div>
          <div class="countdown-unit"><div class="countdown-val">${pad(seconds)}</div><div class="countdown-lbl">SEC</div></div>
        `;
      }
    };

    updateTimer();
    setInterval(updateTimer, 1000);
  }

  /* ─── 3D Neural Parameters & Convergence Slider ─── */
  initNeuralVisualizer() {
    const bind = (sliderId, labelId, paramKey) => {
      const slider = document.getElementById(sliderId);
      const label = document.getElementById(labelId);
      if (slider) {
        slider.addEventListener('input', (e) => {
          const val = parseInt(e.target.value, 10);
          if (label) label.textContent = `${val}%`;
          if (this.scene3d) this.scene3d.updateParameters({ [paramKey]: val });
        });
      }
    };

    bind('slider-bandwidth', 'lbl-bandwidth', 'bandwidth');
    bind('slider-autonomy', 'lbl-autonomy', 'autonomy');
    bind('slider-adaptation', 'lbl-adaptation', 'adaptation');

    const sliderConvergence = document.getElementById('slider-convergence');
    const convergenceLbl = document.getElementById('convergence-state-lbl');
    if (sliderConvergence && convergenceLbl) {
      sliderConvergence.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        if (val < 35) convergenceLbl.textContent = 'BIOLOGICAL SYNAPSE';
        else if (val > 65) convergenceLbl.textContent = 'SYNTHETIC CORE';
        else convergenceLbl.textContent = 'HUMAN × MACHINE CONVERGENCE';

        if (this.scene3d) this.scene3d.setConvergence(val);
      });
    }
  }

  /* ─── 3D Cyborg Scanner HUD ─── */
  initScannerHUD() {
    const btns = document.querySelectorAll('#scanner-hotspot-btns .scanner-btn');
    const titleEl = document.getElementById('scanner-target-title');
    const statusEl = document.getElementById('scanner-target-status');

    btns.forEach((btn) => {
      btn.addEventListener('click', () => {
        btns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const hotspotId = btn.getAttribute('data-hotspot');
        if (this.scene3d && this.scene3d.scanner) {
          const hpData = this.scene3d.scanner.selectHotspot(hotspotId);
          if (hpData) {
            if (titleEl) titleEl.textContent = hpData.name;
            if (statusEl) statusEl.textContent = hpData.status;
          }
        }
      });
    });
  }

  /* ─── Events Matrix ─── */
  initEventsMatrix() {
    const grid = document.getElementById('events-grid');
    const catContainer = document.getElementById('events-categories');
    const searchInput = document.getElementById('events-search');
    const modal = document.getElementById('event-modal');
    if (grid) new EventsManager(grid, catContainer, searchInput, modal);
  }

  /* ─── Timeline ─── */
  initTimeline() {
    const tabs = document.getElementById('timeline-tabs');
    const list = document.getElementById('timeline-list');
    if (tabs && list) new TimelineManager(tabs, list);
  }

  /* ─── Terminal ─── */
  initTerminal() {
    const output = document.getElementById('terminal-output');
    const input = document.getElementById('terminal-input');
    if (output && input) new TerminalEmulator(output, input);
  }

  /* ─── Badge Generator ─── */
  initBadgeGenerator() {
    const canvas = document.getElementById('badge-canvas');
    const formInputs = {
      name: document.getElementById('badge-input-name'),
      college: document.getElementById('badge-input-college'),
      domain: document.getElementById('badge-select-domain')
    };
    const downloadBtn = document.getElementById('badge-download-btn');
    if (canvas) new BadgeGenerator(canvas, formInputs, downloadBtn);
  }

  /* ─── Partners Grid ─── */
  initPartnersGrid() {
    const grid = document.getElementById('partners-grid');
    if (!grid) return;

    grid.innerHTML = '';
    PARTNER_GRID.forEach((p) => {
      const card = document.createElement('div');
      card.className = 'hud-box partner-card';

      const icon = document.createElement('div');
      icon.className = 'partner-shape-icon';
      icon.textContent = `[ ${p.shape.toUpperCase()} ]`;

      const code = document.createElement('div');
      code.className = 'partner-code';
      code.textContent = p.code;

      const cat = document.createElement('div');
      cat.style.cssText = 'font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-muted); margin-top: 4px;';
      cat.textContent = p.category;

      const label = document.createElement('div');
      label.className = 'partner-label';
      label.textContent = p.label;

      card.appendChild(icon);
      card.appendChild(code);
      card.appendChild(cat);
      card.appendChild(label);
      grid.appendChild(card);
    });
  }

  /* ─── Custom Cursor ─── */
  initCursor() {
    const dot = document.getElementById('custom-cursor');
    const ring = document.getElementById('cursor-ring');
    if (dot && ring) new CustomCursor(dot, ring);
  }

  /* ─── Keyboard Accessibility & CTA actions ─── */
  initKeyboardAccessibility() {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const modal = document.getElementById('event-modal');
        const overlay = document.getElementById('mobile-menu-overlay');
        if (modal && modal.classList.contains('open')) {
          modal.classList.remove('open');
        }
        if (overlay && overlay.classList.contains('open')) {
          overlay.classList.remove('open');
        }
      }
    });

    document.querySelectorAll('.btn-tech, .nav-link, .cat-btn, .tab-btn').forEach((el) => {
      el.addEventListener('mouseenter', () => audioEngine.playHoverSound());
    });
  }

  /* ─── 3D Camera State Scroll Choreography ─── */
  initScrollAnimations() {
    if (perfManager.prefersReducedMotion) return;

    // Synchronize page scroll to 3D Camera States
    const mapState = (triggerId, stateKey) => {
      const section = document.getElementById(triggerId);
      if (section && this.scene3d) {
        ScrollTrigger.create({
          trigger: section,
          start: 'top 60%',
          end: 'bottom 40%',
          onEnter: () => this.scene3d.setCameraState(stateKey),
          onEnterBack: () => this.scene3d.setCameraState(stateKey)
        });
      }
    };

    mapState('hero', 'HERO');
    mapState('concept', 'CONVERGENCE');
    mapState('scanner', 'SCANNER');
    mapState('events', 'FINAL');
    mapState('schedule', 'FINAL');
    mapState('terminal', 'FINAL');
    mapState('badge', 'FINAL');
    mapState('partners', 'FINAL');

    // Section headers reveal
    gsap.utils.toArray('.section-header').forEach((el) => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 35,
        duration: 0.8,
        ease: 'power3.out'
      });
    });

    // HUD boxes reveal
    gsap.utils.toArray('.section').forEach((section) => {
      const boxes = section.querySelectorAll('.hud-box');
      if (boxes.length) {
        gsap.from(boxes, {
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none none'
          },
          opacity: 0,
          y: 25,
          stagger: 0.1,
          duration: 0.6,
          ease: 'power2.out'
        });
      }
    });

    // Hero entrance
    const heroOverlay = document.querySelector('.hero-interactive-overlay');
    if (heroOverlay) {
      gsap.from(heroOverlay.children, {
        opacity: 0,
        y: 30,
        stagger: 0.12,
        duration: 0.8,
        delay: 0.2,
        ease: 'power3.out'
      });
    }
  }

  /* ─── Visibility Optimization ─── */
  initVisibilityOptimization() {
    if (typeof IntersectionObserver === 'undefined') return;

    const mainEl = document.querySelector('main');
    if (mainEl && this.scene3d) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              if (this.scene3d.animId === null && this.scene3d.isWebGLAvailable) {
                this.scene3d.animate();
              }
            } else {
              if (this.scene3d.animId !== null) {
                cancelAnimationFrame(this.scene3d.animId);
                this.scene3d.animId = null;
              }
            }
          });
        },
        { threshold: 0.01 }
      );
      observer.observe(mainEl);
    }
  }
}

new CygnusApp();
