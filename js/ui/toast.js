const CHECK_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`;

let hideTimeout = null;

export function showToast(els, message) {
  if (hideTimeout) clearTimeout(hideTimeout);
  els.toast.innerHTML = `${CHECK_ICON}<span>${message}</span>`;
  els.toast.classList.add('is-visible');
  hideTimeout = setTimeout(() => els.toast.classList.remove('is-visible'), 2600);
}
