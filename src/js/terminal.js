/**
 * CYGNUS Terminal CLI (Phase 2 Upgrade)
 * Interactive terminal emulator with command history navigation (Up/Down arrows),
 * sanitized DOM node generation, and advanced system commands.
 */

import { DEMO_EVENTS } from '../data/events.js';

export class TerminalEmulator {
  constructor(outputElement, inputElement) {
    this.output = outputElement;
    this.input = inputElement;
    this.history = [];
    this.historyIndex = -1;

    this.init();
  }

  init() {
    if (!this.input || !this.output) return;

    this.printWelcome();
    this.setupKeyListeners();
  }

  printWelcome() {
    this.appendLine(`CYGNUS OS v2.0.0 — ADVANCED HUMAN × MACHINE INTERFACE`);
    this.appendLine(`IIT BOMBAY TECHFEST — COMPETITION SUBMISSION SHOWCASE`);
    this.appendLine(`Type 'help' to list available system commands.\n`);
  }

  appendLine(text, className = '') {
    const line = document.createElement('div');
    line.className = `terminal-line ${className}`;
    line.textContent = text;
    this.output.appendChild(line);
    this.output.scrollTop = this.output.scrollHeight;
  }

  setupKeyListeners() {
    this.input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const cmd = this.input.value.trim();
        if (cmd) {
          this.history.push(cmd);
          this.historyIndex = this.history.length;
          this.executeCommand(cmd);
        }
        this.input.value = '';
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (this.history.length > 0 && this.historyIndex > 0) {
          this.historyIndex--;
          this.input.value = this.history[this.historyIndex];
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (this.historyIndex < this.history.length - 1) {
          this.historyIndex++;
          this.input.value = this.history[this.historyIndex];
        } else {
          this.historyIndex = this.history.length;
          this.input.value = '';
        }
      } else if (e.key === 'Escape') {
        this.input.blur();
      }
    });
  }

  executeCommand(rawCmd) {
    const cmd = rawCmd.toLowerCase();
    this.appendLine(`CYGNUS:// ${rawCmd}`, 'terminal-prompt-line');

    switch (cmd) {
      case 'help':
        this.appendLine(`AVAILABLE SYSTEM COMMANDS:`);
        this.appendLine(`  help       - Display system command manual`);
        this.appendLine(`  status     - Execute full system diagnostic check`);
        this.appendLine(`  about      - Display CYGNUS architecture & context`);
        this.appendLine(`  events     - List active competition tracks`);
        this.appendLine(`  matrix     - Re-calibrate 3D particle core force field`);
        this.appendLine(`  scan       - Perform environment security scan`);
        this.appendLine(`  core       - Inspect 3D WebGL core telemetry`);
        this.appendLine(`  protocol   - View Human x Machine interaction protocol`);
        this.appendLine(`  register   - Access competition registration portal`);
        this.appendLine(`  clear      - Clear terminal screen history`);
        break;

      case 'status':
        this.appendLine(`CYGNUS CORE ........ ONLINE`);
        this.appendLine(`NEURAL LINK ........ 99.8% STABLE`);
        this.appendLine(`WEBGL ENGINE ....... READY (ADAPTIVE)`);
        this.appendLine(`AUDIO SYNTH ........ STANDBY / READY`);
        this.appendLine(`SYSTEM MODE ........ CONCEPT SUBMISSION DEMO`);
        break;

      case 'about':
        this.appendLine(`CYGNUS: The Next Evolution of Interaction.`);
        this.appendLine(`An immersive WebGL platform designed as an original concept submission for IIT Bombay Techfest.`);
        break;

      case 'events':
        this.appendLine(`ACTIVE COMPETITION TRACKS:`);
        DEMO_EVENTS.forEach((evt, idx) => {
          this.appendLine(`  [0${idx + 1}] ${evt.title} (${evt.tag})`);
        });
        break;

      case 'matrix':
        this.appendLine(`MATRIX CALIBRATED: Particle force vectors synchronized.`);
        break;

      case 'scan':
        this.appendLine(`SCANNING ENVIRONMENT...`);
        this.appendLine(`[✓] WebGL Context Detected`);
        this.appendLine(`[✓] Web Audio Context Ready`);
        this.appendLine(`[✓] No Critical Faults Found`);
        break;

      case 'core':
        this.appendLine(`CORE TELEMETRY:`);
        this.appendLine(`  Geometry: Icosahedron + Torus Orbital Rings`);
        this.appendLine(`  Physics: Dynamic Force-Field Perturbation`);
        break;

      case 'protocol':
        this.appendLine(`HUMAN × MACHINE PROTOCOL:`);
        this.appendLine(`  Biological Synapses (Abstract Reasoning) + Synthetic Nodes (Micro-Latency Execution)`);
        break;

      case 'register':
        this.appendLine(`[NOTICE] REGISTRATION MODULE — DEMO ONLY`, 'amber');
        this.appendLine(`This website is an unofficial competition concept for IIT Bombay Techfest.`);
        this.appendLine(`No live registration requests are processed or submitted.`);
        break;

      case 'clear':
        this.output.textContent = '';
        break;

      default:
        this.appendLine(`COMMAND NOT RECOGNIZED: '${rawCmd}'. TYPE 'HELP' FOR AVAILABLE COMMANDS.`);
        break;
    }

    this.appendLine('');
  }
}
