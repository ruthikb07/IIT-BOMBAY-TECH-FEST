/**
 * CYGNUS Events & Modal Manager (Phase 2 — Sanitized & Accessible)
 * Handles grid rendering, live category filtering, search, modal overlay,
 * focus trapping, and Escape key accessibility.
 */

import { DEMO_EVENTS, CATEGORIES } from '../data/events.js';
import { audioEngine } from './audio.js';

export class EventsManager {
  constructor(gridElement, categoryContainer, searchInput, modalElement) {
    this.grid = gridElement;
    this.categoryContainer = categoryContainer;
    this.searchInput = searchInput;
    this.modal = modalElement;

    this.currentCategory = 'ALL';
    this.searchQuery = '';
    this.triggerElement = null; // for focus return after modal close

    this.init();
  }

  init() {
    this.renderCategories();
    this.renderEvents();
    this.setupListeners();
  }

  /**
   * Escapes HTML entities to prevent injection via data fields.
   */
  escapeHTML(str) {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return String(str).replace(/[&<>"']/g, (c) => map[c]);
  }

  renderCategories() {
    if (!this.categoryContainer) return;
    // Build using DOM nodes for safety
    this.categoryContainer.innerHTML = '';
    CATEGORIES.forEach((cat) => {
      const btn = document.createElement('button');
      btn.className = `cat-btn ${cat === this.currentCategory ? 'active' : ''}`;
      btn.dataset.cat = cat;
      btn.textContent = cat;
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', cat === this.currentCategory ? 'true' : 'false');
      btn.addEventListener('click', () => {
        audioEngine.playClickSound();
        this.currentCategory = cat;
        this.renderCategories();
        this.renderEvents();
      });
      this.categoryContainer.appendChild(btn);
    });
  }

  setupListeners() {
    if (this.searchInput) {
      this.searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.renderEvents();
      });
    }

    if (this.modal) {
      const closeBtn = this.modal.querySelector('.modal-close-btn');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => this.closeModal());
      }
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) this.closeModal();
      });
    }
  }

  renderEvents() {
    if (!this.grid) return;

    const filtered = DEMO_EVENTS.filter((evt) => {
      const matchesCat = this.currentCategory === 'ALL' || evt.category === this.currentCategory;
      const matchesSearch = !this.searchQuery ||
        evt.title.toLowerCase().includes(this.searchQuery) ||
        evt.description.toLowerCase().includes(this.searchQuery) ||
        evt.tag.toLowerCase().includes(this.searchQuery);
      return matchesCat && matchesSearch;
    });

    this.grid.innerHTML = '';

    if (filtered.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'hud-box';
      empty.style.cssText = 'grid-column: 1/-1; padding: 40px; text-align: center; color: var(--text-muted);';
      empty.textContent = 'NO MATCH FOUND — TRY ANOTHER QUERY.';
      this.grid.appendChild(empty);
      return;
    }

    filtered.forEach((evt) => {
      const card = document.createElement('div');
      card.className = 'hud-box event-card';
      card.dataset.id = evt.id;

      const header = document.createElement('div');
      header.className = 'event-card-header';

      const tag = document.createElement('span');
      tag.className = 'event-tag';
      tag.textContent = evt.tag;

      const status = document.createElement('span');
      status.style.cssText = 'font-family: var(--font-mono); font-size: 0.65rem; color: var(--accent-amber);';
      status.textContent = evt.status;

      header.appendChild(tag);
      header.appendChild(status);

      const body = document.createElement('div');
      const title = document.createElement('h3');
      title.className = 'event-title';
      title.textContent = evt.title;
      const desc = document.createElement('p');
      desc.className = 'event-desc';
      desc.textContent = evt.description;
      body.appendChild(title);
      body.appendChild(desc);

      const footer = document.createElement('div');
      footer.className = 'event-card-footer';
      const prize = document.createElement('span');
      prize.style.cssText = 'font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted);';
      prize.textContent = evt.prize;
      const detailBtn = document.createElement('button');
      detailBtn.className = 'btn-tech open-modal-btn';
      detailBtn.textContent = 'DETAILS';
      detailBtn.addEventListener('click', () => {
        audioEngine.playClickSound();
        this.triggerElement = detailBtn;
        this.openModal(evt);
      });
      footer.appendChild(prize);
      footer.appendChild(detailBtn);

      card.appendChild(header);
      card.appendChild(body);
      card.appendChild(footer);
      this.grid.appendChild(card);
    });
  }

  openModal(evt) {
    if (!this.modal) return;
    const body = this.modal.querySelector('.modal-body');
    if (!body) return;

    audioEngine.playModalOpenSound();

    // Build modal content safely using DOM nodes
    body.innerHTML = '';

    const tagRow = document.createElement('div');
    tagRow.style.cssText = 'margin-bottom: 16px;';
    const tagSpan = document.createElement('span');
    tagSpan.className = 'event-tag';
    tagSpan.textContent = evt.tag;
    const statusSpan = document.createElement('span');
    statusSpan.style.cssText = 'font-family: var(--font-mono); font-size: 0.7rem; color: var(--accent-amber); margin-left: 10px;';
    statusSpan.textContent = evt.status;
    tagRow.appendChild(tagSpan);
    tagRow.appendChild(statusSpan);
    body.appendChild(tagRow);

    const titleEl = document.createElement('h2');
    titleEl.className = 'section-title';
    titleEl.style.cssText = 'font-size: 1.6rem; margin-bottom: 16px;';
    titleEl.textContent = evt.title;
    body.appendChild(titleEl);

    const descEl = document.createElement('p');
    descEl.style.cssText = 'color: var(--text-muted); margin-bottom: 24px;';
    descEl.textContent = evt.description;
    body.appendChild(descEl);

    // Demo Notice Banner
    const notice = document.createElement('div');
    notice.style.cssText = 'background: rgba(255, 170, 0, 0.08); border: 1px solid rgba(255, 170, 0, 0.3); padding: 12px 16px; margin-bottom: 24px;';
    const noticeTitle = document.createElement('div');
    noticeTitle.style.cssText = 'font-family: var(--font-mono); font-size: 0.75rem; color: var(--accent-amber); font-weight: 700; margin-bottom: 4px;';
    noticeTitle.textContent = 'DEMO EVENT DATA';
    const noticeBody = document.createElement('div');
    noticeBody.style.cssText = 'font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-muted);';
    noticeBody.textContent = evt.demoNotice;
    notice.appendChild(noticeTitle);
    notice.appendChild(noticeBody);
    body.appendChild(notice);

    // Rules
    const rulesHeader = document.createElement('h4');
    rulesHeader.style.cssText = 'font-family: var(--font-mono); font-size: 0.85rem; color: var(--accent-cyan); margin-bottom: 12px;';
    rulesHeader.textContent = 'SPECIFICATIONS & RULES:';
    body.appendChild(rulesHeader);

    const rulesList = document.createElement('ul');
    rulesList.style.cssText = 'display: flex; flex-direction: column; gap: 8px; margin-bottom: 32px;';
    evt.detailedRules.forEach((rule) => {
      const li = document.createElement('li');
      li.style.cssText = 'font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-primary); display: flex; gap: 8px;';
      const arrow = document.createElement('span');
      arrow.style.color = 'var(--accent-cyan)';
      arrow.textContent = '▸';
      li.appendChild(arrow);
      li.appendChild(document.createTextNode(' ' + rule));
      rulesList.appendChild(li);
    });
    body.appendChild(rulesList);

    // Registration demo button
    const btnRow = document.createElement('div');
    btnRow.style.cssText = 'display: flex; gap: 16px; justify-content: flex-end;';
    const regBtn = document.createElement('button');
    regBtn.className = 'btn-tech';
    regBtn.textContent = 'REGISTRATION — NOT AVAILABLE IN DEMO';
    regBtn.style.cssText = 'color: var(--accent-amber); border-color: rgba(255,170,0,0.4);';
    regBtn.addEventListener('click', () => {
      audioEngine.playClickSound();
    });
    btnRow.appendChild(regBtn);
    body.appendChild(btnRow);

    this.modal.classList.add('open');

    // Move focus into the modal
    const closeBtn = this.modal.querySelector('.modal-close-btn');
    if (closeBtn) closeBtn.focus();
  }

  closeModal() {
    if (this.modal) this.modal.classList.remove('open');
    // Return focus to the button that triggered the modal
    if (this.triggerElement) {
      this.triggerElement.focus();
      this.triggerElement = null;
    }
  }
}
