import { storage } from '../utils/storage.js';
import { generateId } from '../utils/idGen.js';
import { formatTimestamp, truncate, escapeHTML } from '../utils/format.js';

const HISTORY_KEY = 'scanHistory';
const MAX_HISTORY = 30;

export function getHistory() {
  return storage.get(HISTORY_KEY, []);
}

/** Stores a full, self-contained result so clicking it later needs no re-analysis. */
export function saveToHistory(result) {
  const history = getHistory();
  const entry = { ...result, id: generateId() };
  history.unshift(entry);
  if (history.length > MAX_HISTORY) history.length = MAX_HISTORY;
  storage.set(HISTORY_KEY, history);
  return entry;
}

export function clearHistory() {
  storage.set(HISTORY_KEY, []);
}

export function renderHistory(els, history, activeId, onSelect) {
  if (!history || history.length === 0) {
    els.historyList.innerHTML = '<p class="history-empty">No scans yet.</p>';
    return;
  }

  els.historyList.innerHTML = history
    .map(
      (entry) => `
    <button class="history-item ${entry.id === activeId ? 'is-active' : ''}" data-id="${entry.id}" data-level="${entry.level}" type="button">
      <span class="history-score-dot" aria-hidden="true"></span>
      <span class="history-text">
        <span class="history-url">${escapeHTML(truncate(entry.url, 42))}</span>
        <span class="history-meta">${formatTimestamp(entry.timestamp)}</span>
      </span>
      <span class="history-score">${entry.score}</span>
    </button>`
    )
    .join('');

  els.historyList.querySelectorAll('.history-item').forEach((btn) => {
    btn.addEventListener('click', () => {
      const entry = history.find((h) => h.id === btn.dataset.id);
      if (entry) onSelect(entry);
    });
  });
}
