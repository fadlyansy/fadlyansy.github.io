document.addEventListener('DOMContentLoaded', function () {
  // --- Theme Toggle ---
  var toggleButton = document.getElementById('theme-toggle');
  var themeMeta = document.querySelector('meta[name="theme-color"]');

  const moonIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-moon"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
  const sunIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-sun"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;

  function updateThemeButton(isDark) {
    if (toggleButton) {
      toggleButton.innerHTML = isDark ? sunIcon : moonIcon;
      toggleButton.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    }
  }

  var isDark = document.body.classList.contains('dark-mode');
  updateThemeButton(isDark);

  function executeToggle() {
    document.body.classList.toggle('dark-mode');
    var isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    if (themeMeta) {
      themeMeta.setAttribute('content', isDark ? '#121212' : '#ffffff');
    }
    updateThemeButton(isDark);
  }

  function toggleDarkMode(event) {
    const isViewTransition = document.startViewTransition &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!isViewTransition) {
      executeToggle();
      return;
    }

    document.documentElement.classList.add('theme-transitioning');

    const transition = document.startViewTransition(() => {
      executeToggle();
    });

    transition.finished.then(() => {
      document.documentElement.classList.remove('theme-transitioning');
    });
  }

  if (toggleButton) {
    toggleButton.addEventListener('click', toggleDarkMode);
  }

  // --- Contact Copy Email ---
  var contactButton = document.getElementById('contact-button');
  if (contactButton) {
    const mailIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-mail"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>`;
    const checkIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-check"><polyline points="20 6 9 17 4 12"></polyline></svg>`;

    contactButton.addEventListener('click', function () {
      navigator.clipboard.writeText('fadlyansy@gmail.com').then(function () {
        var iconSpan = contactButton.querySelector('.contact-icon');
        var textSpan = contactButton.querySelector('.contact-text');
        var originalText = textSpan.textContent;

        iconSpan.innerHTML = checkIconSvg;
        textSpan.textContent = 'Email copied!';
        contactButton.classList.add('copied');

        setTimeout(function () {
          iconSpan.innerHTML = mailIconSvg;
          textSpan.textContent = originalText;
          contactButton.classList.remove('copied');
        }, 2000);
      });
    });
  }

  // --- Smart Header Scroll ---
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    let lastScrollY = window.scrollY;

    if (window.scrollY > 10) {
      navbar.classList.add('navbar-scrolled');
    }

    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > 10) {
        navbar.classList.add('navbar-scrolled');
      } else {
        navbar.classList.remove('navbar-scrolled');
      }

      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        navbar.classList.add('navbar-hidden');
      } else {
        navbar.classList.remove('navbar-hidden');
      }
      
      lastScrollY = currentScrollY;
    }, { passive: true });
  }

  // --- Scroll Reveal Observer ---
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.05
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  revealElements.forEach(el => observer.observe(el));
});
