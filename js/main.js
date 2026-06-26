import { els } from './ui/dom.js';
import { setupGauge } from './ui/scoreRing.js';
import { renderResult, showInputError, clearInputError } from './ui/render.js';
import { renderSampleChips } from './ui/sampleUrls.js';
import { getHistory, saveToHistory, clearHistory, renderHistory } from './ui/history.js';
import { exportJson, exportPdf } from './ui/exportResult.js';
import { showToast } from './ui/toast.js';
import { analyze } from './core/analyzer.js';

let currentResult = null;
let activeHistoryId = null;

setupGauge(els.gaugeProgress);

function refreshHistoryPanel() {
  const history = getHistory();
  renderHistory(els, history, activeHistoryId, (entry) => {
    activeHistoryId = entry.id;
    currentResult = entry;
    els.input.value = entry.url;
    clearInputError(els);
    renderResult(els, entry);
    refreshHistoryPanel();
  });
}

// Purely cosmetic staging — the rule engine itself runs synchronously and
// instantly. This just paces the reveal so "16 rules ran" reads as
// believable work rather than an instant snap.
const ANALYZE_STEPS = ['Parsing URL…', 'Running 16 rules…', 'Scoring risk…'];
const STEP_DELAY_MS = 220;

async function runAnalysis(rawUrl) {
  clearInputError(els);

  const btnLabel = els.analyzeBtn.querySelector('.btn-label');
  const btnSpinner = els.analyzeBtn.querySelector('.btn-spinner');

  els.inputRow.classList.add('is-scanning');
  els.analyzeBtn.disabled = true;
  btnSpinner.hidden = false;

  for (const step of ANALYZE_STEPS) {
    btnLabel.textContent = step;
    await new Promise((resolve) => setTimeout(resolve, STEP_DELAY_MS));
  }

  const result = analyze(rawUrl);

  els.inputRow.classList.remove('is-scanning');
  els.analyzeBtn.disabled = false;
  btnSpinner.hidden = true;
  btnLabel.textContent = 'Analyze';

  if (!result.ok) {
    showInputError(els, result.error);
    return;
  }

  const entry = saveToHistory(result);
  currentResult = entry;
  activeHistoryId = entry.id;
  renderResult(els, entry);
  refreshHistoryPanel();
}

els.form.addEventListener('submit', (event) => {
  event.preventDefault();
  const value = els.input.value.trim();
  if (!value) {
    showInputError(els, 'Please enter a URL to analyze.');
    return;
  }
  runAnalysis(value);
});

renderSampleChips(els, (url) => {
  els.input.value = url;
  runAnalysis(url);
});

els.clearHistoryBtn.addEventListener('click', () => {
  clearHistory();
  activeHistoryId = null;
  refreshHistoryPanel();
});

els.exportJsonBtn.addEventListener('click', () => {
  if (!currentResult) return;
  exportJson(currentResult);
  showToast(els, 'Scan exported as JSON');
});

els.exportPdfBtn.addEventListener('click', () => {
  if (!currentResult) return;
  exportPdf(els, currentResult);
});

refreshHistoryPanel();
