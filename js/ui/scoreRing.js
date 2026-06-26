const RADIUS = 84; // must match the <circle r="84"> in index.html
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

let activeFrame = null;

/** Call once on load to put the ring in its empty (0%) state. */
export function setupGauge(gaugeEl) {
  gaugeEl.style.strokeDasharray = `${CIRCUMFERENCE}`;
  gaugeEl.style.strokeDashoffset = `${CIRCUMFERENCE}`;
}

export function animateScore({ gaugeEl, numberEl, score, duration = 900 }) {
  if (activeFrame) cancelAnimationFrame(activeFrame);

  const target = Math.max(0, Math.min(100, score));
  let startTime = null;

  function tick(now) {
    if (startTime === null) startTime = now; // anchor to the first frame, not a pre-schedule timestamp
    const elapsed = now - startTime;
    const progress = Math.min(1, elapsed / duration);
    const eased = easeOutCubic(progress);
    const value = eased * target;

    numberEl.textContent = String(Math.round(value));
    gaugeEl.style.strokeDashoffset = `${CIRCUMFERENCE * (1 - value / 100)}`;

    if (progress < 1) {
      activeFrame = requestAnimationFrame(tick);
    } else {
      activeFrame = null;
    }
  }

  activeFrame = requestAnimationFrame(tick);
}
