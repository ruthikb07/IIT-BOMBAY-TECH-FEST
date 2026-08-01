/**
 * CYGNUS Schedule Timeline Component (Phase 2 — Final)
 * Manages tabbed schedule views with demo event data and DOM-safe rendering.
 */

import { DEMO_SCHEDULE } from '../data/schedule.js';
import { audioEngine } from './audio.js';

export class TimelineManager {
  constructor(tabContainer, listElement) {
    this.tabContainer = tabContainer;
    this.listElement = listElement;
    this.activeDayIndex = 0;

    this.init();
  }

  init() {
    this.renderTabs();
    this.renderSchedule();
  }

  renderTabs() {
    if (!this.tabContainer) return;
    this.tabContainer.innerHTML = '';

    DEMO_SCHEDULE.forEach((dayData, idx) => {
      const btn = document.createElement('button');
      btn.className = `tab-btn ${idx === this.activeDayIndex ? 'active' : ''}`;
      btn.dataset.idx = idx;
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', idx === this.activeDayIndex ? 'true' : 'false');
      btn.textContent = `${dayData.day} — ${dayData.phase.split('—')[0].trim()}`;
      btn.addEventListener('click', () => {
        audioEngine.playClickSound();
        this.activeDayIndex = idx;
        this.renderTabs();
        this.renderSchedule();
      });
      this.tabContainer.appendChild(btn);
    });
  }

  renderSchedule() {
    if (!this.listElement) return;

    const dayData = DEMO_SCHEDULE[this.activeDayIndex];
    if (!dayData) return;

    this.listElement.innerHTML = '';

    // Phase header
    const phaseHeader = document.createElement('div');
    phaseHeader.style.cssText = 'margin-bottom: 20px; font-family: var(--font-mono); font-size: 0.8rem; color: var(--accent-amber);';
    phaseHeader.textContent = `PHASE: ${dayData.phase} | ${dayData.date}`;
    this.listElement.appendChild(phaseHeader);

    dayData.events.forEach((evt) => {
      const item = document.createElement('div');
      item.className = 'hud-box timeline-item';

      const time = document.createElement('div');
      time.className = 'timeline-time';
      time.textContent = evt.time;

      const details = document.createElement('div');

      const titleRow = document.createElement('div');
      titleRow.style.cssText = 'display: flex; align-items: center; gap: 12px; margin-bottom: 4px; flex-wrap: wrap;';
      const title = document.createElement('h4');
      title.style.cssText = 'font-family: var(--font-display); font-size: 1rem; color: var(--text-primary);';
      title.textContent = evt.title;
      titleRow.appendChild(title);

      if (evt.isKeynote) {
        const keynoteTag = document.createElement('span');
        keynoteTag.className = 'event-tag';
        keynoteTag.style.cssText = 'background: rgba(255, 170, 0, 0.15); border-color: rgba(255, 170, 0, 0.4); color: var(--accent-amber);';
        keynoteTag.textContent = 'KEYNOTE';
        titleRow.appendChild(keynoteTag);
      }

      const speakerInfo = document.createElement('div');
      speakerInfo.style.cssText = 'font-family: var(--font-mono); font-size: 0.75rem; color: var(--accent-cyan); margin-bottom: 8px;';
      speakerInfo.textContent = `${evt.speaker} — ${evt.location}`;

      const desc = document.createElement('p');
      desc.style.cssText = 'font-size: 0.85rem; color: var(--text-secondary);';
      desc.textContent = evt.description;

      details.appendChild(titleRow);
      details.appendChild(speakerInfo);
      details.appendChild(desc);

      item.appendChild(time);
      item.appendChild(details);
      this.listElement.appendChild(item);
    });
  }
}
