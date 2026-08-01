/**
 * CYGNUS Holographic Badge Pass Generator (Phase 2 Upgrade)
 * Renders sharp high-resolution (800x1120) downloadable 2D Canvas demo passes.
 */

export class BadgeGenerator {
  constructor(canvasElement, formInputs, downloadBtn) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');
    this.formInputs = formInputs;
    this.downloadBtn = downloadBtn;

    this.state = {
      name: 'ALEX R. VANCE',
      college: 'IIT BOMBAY (CONCEPT)',
      domain: 'AI & NEURAL ROBOTICS',
      passId: this.generatePassId()
    };

    this.init();
  }

  generatePassId() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `CYG-2026-${code}`;
  }

  init() {
    this.renderBadge();
    this.setupListeners();
  }

  setupListeners() {
    if (this.formInputs.name) {
      this.formInputs.name.addEventListener('input', (e) => {
        this.state.name = this.sanitizeInput(e.target.value).toUpperCase() || 'ANONYMOUS RECRUIT';
        this.renderBadge();
      });
    }

    if (this.formInputs.college) {
      this.formInputs.college.addEventListener('input', (e) => {
        this.state.college = this.sanitizeInput(e.target.value).toUpperCase() || 'INSTITUTE TBD';
        this.renderBadge();
      });
    }

    if (this.formInputs.domain) {
      this.formInputs.domain.addEventListener('change', (e) => {
        this.state.domain = e.target.value.toUpperCase();
        this.renderBadge();
      });
    }

    if (this.downloadBtn) {
      this.downloadBtn.addEventListener('click', () => this.downloadPNG());
    }
  }

  sanitizeInput(str) {
    return str.replace(/[^\w\s\-\.]/gi, '').slice(0, 32);
  }

  renderBadge() {
    const ctx = this.ctx;
    // High-resolution canvas for crisp Retina rendering
    const w = 800;
    const h = 1120;
    this.canvas.width = w;
    this.canvas.height = h;

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#0a0d14');
    grad.addColorStop(1, '#030406');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Subtle scanlines
    ctx.fillStyle = 'rgba(0, 243, 255, 0.03)';
    for (let i = 0; i < h; i += 6) {
      ctx.fillRect(0, i, w, 2);
    }

    // Outer HUD Border
    ctx.strokeStyle = 'rgba(0, 243, 255, 0.45)';
    ctx.lineWidth = 4;
    ctx.strokeRect(32, 32, w - 64, h - 64);

    // Corner tech notches
    ctx.fillStyle = '#00f3ff';
    ctx.fillRect(28, 28, 24, 8);
    ctx.fillRect(28, 28, 8, 24);
    ctx.fillRect(w - 52, 28, 24, 8);
    ctx.fillRect(w - 36, 28, 8, 24);

    ctx.fillRect(28, h - 36, 24, 8);
    ctx.fillRect(28, h - 52, 8, 24);
    ctx.fillRect(w - 52, h - 36, 24, 8);
    ctx.fillRect(w - 36, h - 52, 8, 24);

    // Header Title
    ctx.fillStyle = '#00f3ff';
    ctx.font = 'bold 36px Orbitron, sans-serif';
    ctx.fillText('CYGNUS — HUMAN × MACHINE', 72, 104);

    // Subheader context
    ctx.fillStyle = '#ffaa00';
    ctx.font = '20px JetBrains Mono, monospace';
    ctx.fillText('IIT BOMBAY TECHFEST — DEMO PASS', 72, 140);

    ctx.strokeStyle = 'rgba(0, 243, 255, 0.25)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(72, 164);
    ctx.lineTo(w - 72, 164);
    ctx.stroke();

    // Cyber Avatar Wireframe Box
    ctx.strokeStyle = 'rgba(0, 243, 255, 0.6)';
    ctx.lineWidth = 2;
    ctx.strokeRect(72, 200, 240, 280);
    ctx.fillStyle = 'rgba(0, 243, 255, 0.05)';
    ctx.fillRect(72, 200, 240, 280);

    ctx.strokeStyle = '#00f3ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(192, 300, 56, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(192, 390, 90, Math.PI, Math.PI * 2);
    ctx.stroke();

    // Metadata Details
    ctx.fillStyle = '#94a3b8';
    ctx.font = '18px JetBrains Mono, monospace';
    ctx.fillText('PASS ID:', 344, 230);
    ctx.fillStyle = '#00f3ff';
    ctx.font = 'bold 24px JetBrains Mono, monospace';
    ctx.fillText(this.state.passId, 344, 264);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '18px JetBrains Mono, monospace';
    ctx.fillText('TRACK DOMAIN:', 344, 320);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 22px JetBrains Mono, monospace';
    ctx.fillText(this.state.domain, 344, 354);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '18px JetBrains Mono, monospace';
    ctx.fillText('STATUS:', 344, 410);
    ctx.fillStyle = '#ffaa00';
    ctx.font = 'bold 22px JetBrains Mono, monospace';
    ctx.fillText('VERIFIED DEMO PASS', 344, 444);

    // Full Name Section
    ctx.fillStyle = '#94a3b8';
    ctx.font = '18px JetBrains Mono, monospace';
    ctx.fillText('ATTENDEE / COMPETITOR NAME:', 72, 550);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 36px Orbitron, sans-serif';
    ctx.fillText(this.state.name, 72, 600);

    // College / Institution
    ctx.fillStyle = '#94a3b8';
    ctx.font = '18px JetBrains Mono, monospace';
    ctx.fillText('AFFILIATION / INSTITUTION:', 72, 660);
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '24px JetBrains Mono, monospace';
    ctx.fillText(this.state.college, 72, 700);

    // Barcode Simulation Graphics
    ctx.fillStyle = '#00f3ff';
    for (let x = 72; x < w - 72; x += Math.random() * 12 + 4) {
      const bw = Math.random() * 6 + 2;
      ctx.fillRect(x, 800, bw, 80);
    }

    // Disclaimer footer
    ctx.fillStyle = '#64748b';
    ctx.font = '16px JetBrains Mono, monospace';
    ctx.fillText('UNOFFICIAL CONCEPT PASS — NOT VALID FOR OFFICIAL IITB ENTRY', 72, 940);
    ctx.fillText('GENERATED FOR COMPETITION SHOWCASE PURPOSES ONLY', 72, 970);
  }

  downloadPNG() {
    const cleanName = this.state.name.replace(/[^a-zA-Z0-9]/g, '_') || 'ATTENDEE';
    const link = document.createElement('a');
    link.download = `CYGNUS-DEMO-PASS-${cleanName}.png`;
    link.href = this.canvas.toDataURL('image/png');
    link.click();
  }
}
