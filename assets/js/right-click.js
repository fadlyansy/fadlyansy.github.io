// /assets/disabled.js
(function () {
  // Ubah ke true kalau mau berlaku di seluruh site, false = hanya di /portfolio/*
  const SITE_WIDE = true;

  const ACTIVE = SITE_WIDE || location.pathname.startsWith('/portfolio');
  if (!ACTIVE) return;

  // 1) Matikan klik kanan (context menu), kecuali di input/textarea/contenteditable
  window.addEventListener('contextmenu', (e) => {
    if (!e.target.closest('input, textarea, [contenteditable="true"]')) {
      e.preventDefault();
    }
  }, true);

  // 2) Blokir middle click (scroll button) pada link (supaya gak open new tab)
  window.addEventListener('auxclick', (e) => {
    if (e.button === 1 && e.target.closest('a[href]')) {
      e.preventDefault();
    }
  }, true);

  // 3) Blokir Ctrl/Cmd + Click pada link
  document.addEventListener('click', (e) => {
    const a = e.target.closest?.('a[href]');
    if (a && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      location.href = a.href; // opsional: tetap buka di tab yang sama
    }
  }, true);

  // 4) (opsional) Nonaktif drag & select text (kurangi copy/save image as)
  document.addEventListener('dragstart', (e) => e.preventDefault(), true);
  document.addEventListener('selectstart', (e) => {
    if (!e.target.closest('input, textarea, [contenteditable="true"]')) {
      e.preventDefault();
    }
  }, true);
})();