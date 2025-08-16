// /assets/cs-gate.js
(function () {
  // ======== Read config from <script data-*> ========
  const scriptEl = document.currentScript || (function() {
    const scripts = document.querySelectorAll('script[src*="cs-gate.js"]');
    return scripts[scripts.length - 1] || null;
  })();

  const cfg = (attr, fallback) => {
    if (!scriptEl) return fallback;
    const v = scriptEl.dataset[attr];
    return typeof v === 'string' ? v : fallback;
  };

  const PASSWORD       = cfg('password', '2025');
  const PATH_PREFIX    = cfg('pathPrefix', '/casestudy');
  const STORAGE_MODE   = (cfg('storage', 'session') || 'session').toLowerCase(); // 'session' | 'local'
  const ALWAYS_PROMPT  = String(cfg('alwaysPrompt', 'false')).toLowerCase() === 'true';
  const TITLE_TEXT     = cfg('title', 'Protected Case Study');
  const NOTE_TEXT      = cfg('note', 'Sesi ini akan tetap terbuka sampai lo tutup tab (session-based).');
  const STORAGE_KEY    = 'cs_auth_v1';

  // ======== Storage helpers ========
  const store = {
    get(k) {
      try {
        const bag = STORAGE_MODE === 'local' ? localStorage : sessionStorage;
        return bag.getItem(k);
      } catch { return null; }
    },
    set(k, v) {
      try {
        const bag = STORAGE_MODE === 'local' ? localStorage : sessionStorage;
        bag.setItem(k, v);
      } catch {}
    }
  };

  const isAuthed = () => {
    if (ALWAYS_PROMPT) return false;
    return store.get(STORAGE_KEY) === 'true';
  };
  const setAuthed = () => store.set(STORAGE_KEY, 'true');

  // ======== Utils ========
  function needGateForUrl(url) {
    try {
      const u = new URL(url, location.href);
      return u.origin === location.origin && u.pathname.startsWith(PATH_PREFIX);
    } catch {
      return String(url || '').startsWith(PATH_PREFIX);
    }
  }

  function injectStylesOnce() {
    if (document.getElementById('cs-gate-style')) return;
    const s = document.createElement('style');
    s.id = 'cs-gate-style';
    s.textContent = `
      .cs-gate-overlay{position:fixed;inset:0;display:grid;place-items:center;background:rgba(0,0,0,.6);z-index:99999}
      .cs-gate-card{width:min(92vw,420px);background:#fff;color:#111;border-radius:16px;padding:20px 18px;box-shadow:0 10px 30px rgba(0,0,0,.25);font-family:"Inter-Regular", system-ui,-apple-system,Segoe UI,Roboto,sans-serif}
      .cs-gate-card h2{margin:0 0 6px;font-size:20px;font-weight:700}
      .cs-gate-card p{margin:0 0 16px;font-size:14px;color: rgba(0,0,0,.5)}
      .cs-gate-field{display:grid;gap:10px;margin:12px 0 4px}
      .cs-gate-input{width:100%;padding:12px 14px;border:1px solid #ddd;border-radius:10px;font-size:16px;outline:none}
      .cs-gate-input:focus{border-color:#111}
      .cs-gate-btn{width:100%;padding:.7rem 1.5rem;border:0;border-radius:100px;font-size:16px;font-weight:700;cursor:pointer;background:#111;color:#fff}
      .cs-gate-err{margin-top:8px;color:#c62828;font-size:13px;min-height:16px}
      .cs-gate-card small{display:block;margin-top:10px;color:rgba(0,0,0,.5)}
      @media (prefers-color-scheme:dark){
        .cs-gate-card{background:#111;color:#eee}
        .cs-gate-input{background:#1b1b1b;border-color:#333;color:#eee}
        .cs-gate-input:focus{border-color:#777}
        .cs-gate-btn{background:#fff;color:#111}
      }
    `;
    document.head.appendChild(s);
  }

  function unlockIfAuthed() {
    if (isAuthed()) {
      document.documentElement.classList.remove('cs-locked');
      const ex = document.querySelector('.cs-gate-overlay');
      if (ex) ex.remove();
    }
  }

  function renderGate(onSuccess) {
    if (document.querySelector('.cs-gate-overlay')) return;
    injectStylesOnce();

    const overlay = document.createElement('div');
    overlay.className = 'cs-gate-overlay';
    overlay.innerHTML = `
      <div class="cs-gate-card" role="dialog" aria-modal="true" aria-labelledby="csGateTitle">
        <h2 id="csGateTitle">${escapeHtml(TITLE_TEXT)}</h2>
        <p>Enter your password to unlock the content.</p>
        <form class="cs-gate-field" autocomplete="off">
          <input class="cs-gate-input" type="password" inputmode="numeric" placeholder="Password" aria-label="Password" required />
          <button class="cs-gate-btn" type="submit">Unlock</button>
          <div class="cs-gate-err" aria-live="polite"></div>
          <small>${escapeHtml(NOTE_TEXT)}</small>
        </form>
      </div>
    `;
    document.body.appendChild(overlay);

    const form = overlay.querySelector('form');
    const input = overlay.querySelector('.cs-gate-input');
    const err = overlay.querySelector('.cs-gate-err');

    input.focus();
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = input.value.trim();
      if (val === PASSWORD) {
        if (!ALWAYS_PROMPT) setAuthed();
        overlay.remove();
        document.documentElement.classList.remove('cs-locked');
        if (typeof onSuccess === 'function') onSuccess();
      } else {
        err.textContent = 'Incorrect password. Please try again';
        input.value = '';
        input.focus();
      }
    });

    overlay.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        overlay.remove();
        if (!isAuthed() && location.pathname.startsWith(PATH_PREFIX)) {
          document.documentElement.classList.add('cs-locked');
          renderGate(onSuccess);
        }
      }
    });
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, m => ({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    }[m]));
  }

  // ======== Intercept clicks to /casestudy ========
  document.addEventListener('click', (e) => {
    const a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if (!a) return;

    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    if (needGateForUrl(a.getAttribute('href'))) {
      if (!isAuthed()) {
        e.preventDefault();
        renderGate(() => { location.href = a.href; });
      }
    }
  });

  // ======== Deep link handling ========
  if (location.pathname.startsWith(PATH_PREFIX) && !isAuthed()) {
    // Kalau belum authed & sudah di halaman casestudy, tampilkan gate
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => renderGate());
    } else {
      renderGate();
    }
  } else {
    unlockIfAuthed();
  }

  // ======== BFCache / navigation restore ========
  window.addEventListener('pageshow', () => {
    if (location.pathname.startsWith(PATH_PREFIX) && !isAuthed()) {
      document.documentElement.classList.add('cs-locked');
      renderGate();
    } else {
      unlockIfAuthed();
    }
  });
})();