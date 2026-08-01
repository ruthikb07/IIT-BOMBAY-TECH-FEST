/**
 * CYGNUS 2D Canvas Fallback Engine (Phase 2 — Polished)
 * Renders an intentional, cinematic particle network + central rotating wireframe
 * when WebGL is unavailable. Adapts to device performance automatically.
 */

import { perfManager } from '../utils/performance.js';

export class Canvas2DFallback {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.animId = null;
    this.particles = [];
    this.mouseX = 0;
    this.mouseY = 0;
    this.time = 0;

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    });

    const count = perfManager.prefersReducedMotion ? 40 : 100;
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        radius: Math.random() * 2 + 0.8,
        alpha: Math.random() * 0.6 + 0.3
      });
    }

    this.animate();
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = this.canvas.clientWidth || window.innerWidth;
    this.canvas.height = this.canvas.clientHeight || window.innerHeight;
  }

  animate() {
    if (perfManager.prefersReducedMotion) {
      this.drawStatic();
      return;
    }

    this.time += 0.012;
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const cx = w / 2;
    const cy = h / 2;

    ctx.clearRect(0, 0, w, h);

    // Outer pulsing ring
    ctx.strokeStyle = `rgba(0, 243, 255, ${0.15 + Math.sin(this.time) * 0.08})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, 140 + Math.sin(this.time * 0.8) * 10, 0, Math.PI * 2);
    ctx.stroke();

    // Second ring
    ctx.strokeStyle = `rgba(94, 92, 230, ${0.12 + Math.cos(this.time * 0.6) * 0.06})`;
    ctx.beginPath();
    ctx.arc(cx, cy, 165 + Math.cos(this.time * 0.5) * 8, 0, Math.PI * 2);
    ctx.stroke();

    // Inner wireframe hexagon
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(this.time * 0.3);
    ctx.strokeStyle = 'rgba(0, 243, 255, 0.5)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    const sides = 6;
    const r = 80;
    for (let i = 0; i < sides; i++) {
      const angle = (i * 2 * Math.PI) / sides;
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();

    // Inner octagon rotating opposite direction
    ctx.rotate(-this.time * 0.6);
    ctx.strokeStyle = 'rgba(255, 170, 0, 0.25)';
    ctx.beginPath();
    const sides2 = 8;
    const r2 = 105;
    for (let i = 0; i < sides2; i++) {
      const angle = (i * 2 * Math.PI) / sides2;
      const x = Math.cos(angle) * r2;
      const y = Math.sin(angle) * r2;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.restore();

    // Central glow
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 60);
    grad.addColorStop(0, 'rgba(0, 243, 255, 0.12)');
    grad.addColorStop(1, 'rgba(0, 243, 255, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, 60, 0, Math.PI * 2);
    ctx.fill();

    // Draw particles and connection lines
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;

      ctx.fillStyle = `rgba(0, 243, 255, ${p.alpha})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();

      for (let j = i + 1; j < this.particles.length; j++) {
        const p2 = this.particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          ctx.strokeStyle = `rgba(0, 243, 255, ${0.12 * (1 - dist / 110)})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }

    this.animId = requestAnimationFrame(() => this.animate());
  }

  drawStatic() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const cx = w / 2;
    const cy = h / 2;

    ctx.clearRect(0, 0, w, h);

    ctx.strokeStyle = 'rgba(0, 243, 255, 0.25)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, 140, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(0, 243, 255, 0.5)';
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (i * 2 * Math.PI) / 6;
      const x = cx + Math.cos(angle) * 80;
      const y = cy + Math.sin(angle) * 80;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();

    for (const p of this.particles) {
      ctx.fillStyle = `rgba(0, 243, 255, ${p.alpha})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  destroy() {
    if (this.animId) cancelAnimationFrame(this.animId);
  }
}
