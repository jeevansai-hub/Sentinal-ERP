/**
 * Sentinel ERP — Landing Page
 * Interactions: Nav scroll, mobile menu, scroll reveal, chart animations, card glow
 */

'use strict';

/* ── NAV SCROLL BEHAVIOUR ─────────────────────────────────── */
(function initNav() {
  const nav = document.getElementById('main-nav');
  if (!nav) return;

  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
})();

/* ── MOBILE MENU ──────────────────────────────────────────── */
(function initMobileMenu() {
  const btn  = document.getElementById('hamburger');
  const menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;

  const links = menu.querySelectorAll('.mobile-nav-link, .mobile-actions a, .mobile-actions button');

  const open = () => {
    btn.classList.add('open');
    menu.classList.add('open');
    menu.setAttribute('aria-hidden', 'false');
    btn.setAttribute('aria-expanded', 'true');
    links.forEach(l => l.setAttribute('tabindex', '0'));
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    btn.classList.remove('open');
    menu.classList.remove('open');
    menu.setAttribute('aria-hidden', 'true');
    btn.setAttribute('aria-expanded', 'false');
    links.forEach(l => l.setAttribute('tabindex', '-1'));
    document.body.style.overflow = '';
  };

  btn.addEventListener('click', () => {
    btn.classList.contains('open') ? close() : open();
  });

  // Close on link click
  links.forEach(l => l.addEventListener('click', close));

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menu.classList.contains('open')) close();
  });
})();

/* ── SCROLL REVEAL ────────────────────────────────────────── */
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => observer.observe(el));
})();

/* ── CARD RADIAL GLOW (mouse tracking) ────────────────────── */
(function initCardGlow() {
  const cards = document.querySelectorAll('.pillar-card, .analytics-card, .story-card, .changelog-item');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1);
      const y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
      card.style.setProperty('--mouse-x', `${x}%`);
      card.style.setProperty('--mouse-y', `${y}%`);
    });
  });
})();

/* ── CHART BAR ANIMATION ──────────────────────────────────── */
(function initChartAnimation() {
  const chartBars = document.querySelectorAll('.chart-bar, .spark-bar');
  if (!chartBars.length) return;

  // Store intended heights and reset to 0 initially
  chartBars.forEach(bar => {
    const h = bar.style.height || '60%';
    bar.dataset.targetHeight = h;
    bar.style.height = '0%';
    bar.style.transition = 'height 1s cubic-bezier(0.16,1,0.3,1)';
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bars = entry.target.querySelectorAll('.chart-bar, .spark-bar');
        bars.forEach((bar, i) => {
          setTimeout(() => {
            bar.style.height = bar.dataset.targetHeight || '60%';
          }, i * 80);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  // Observe parent sections
  document.querySelectorAll('.dash-chart, .mini-sparkline, .analytics-card').forEach(el => {
    observer.observe(el);
  });
})();

/* ── CYCLE BAR ANIMATION ──────────────────────────────────── */
(function initCycleBars() {
  document.querySelectorAll('.cycle-bar-fill').forEach(bar => {
    const target = bar.dataset.width || bar.style.width || '60%';
    bar.style.width = '0%';
    bar.style.transition = 'width 1.2s cubic-bezier(0.16,1,0.3,1)';
    bar.dataset.target = target;
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.cycle-bar-fill').forEach(bar => {
          bar.style.width = bar.dataset.target;
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  document.querySelectorAll('.cycle-bar-wrapper').forEach(el => observer.observe(el));
})();

/* ── DASHBOARD TAB SWITCHING ──────────────────────────────── */
(function initDashTabs() {
  document.querySelectorAll('.dash-tabs').forEach(tabGroup => {
    tabGroup.querySelectorAll('.dash-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        tabGroup.querySelectorAll('.dash-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
      });
    });
  });
})();

/* ── AI SUGGESTION CLICK (demo) ───────────────────────────── */
(function initAiSuggestions() {
  document.querySelectorAll('.ai-suggestion').forEach(chip => {
    chip.addEventListener('click', () => {
      chip.style.background = 'rgba(6,182,212,0.2)';
      chip.style.transform = 'scale(0.97)';
      setTimeout(() => {
        chip.style.background = '';
        chip.style.transform = '';
      }, 300);
    });
  });
})();

/* ── SMOOTH ANCHOR SCROLL ─────────────────────────────────── */
(function initSmoothScroll() {
  const NAV_H = 60;
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - NAV_H - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ── SIDEBAR ITEM INTERACTION ─────────────────────────────── */
(function initSidebarItems() {
  document.querySelectorAll('.sidebar-item').forEach(item => {
    item.addEventListener('click', () => {
      item.closest('.erp-sidebar')
          ?.querySelectorAll('.sidebar-item')
          .forEach(i => i.classList.remove('active'));
      item.classList.add('active');
    });
  });
})();

/* ── WORKFLOW ROW INTERACTION ─────────────────────────────── */
(function initWorkflowRows() {
  document.querySelectorAll('.workflow-row, .wf-item').forEach(row => {
    row.addEventListener('click', () => {
      row.style.borderColor = 'rgba(94,106,210,0.3)';
      row.style.background = 'rgba(94,106,210,0.06)';
      setTimeout(() => {
        row.style.borderColor = '';
        row.style.background = '';
      }, 600);
    });
  });
})();

/* ── PERFORMANCE: Reduce animations for users who prefer reduced motion ── */
(function respectMotionPreference() {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  const applyReduced = () => {
    if (mq.matches) {
      document.documentElement.style.setProperty('--t-fast', '0ms');
      document.documentElement.style.setProperty('--t-norm', '0ms');
      document.documentElement.style.setProperty('--t-slow', '0ms');
      // Immediately reveal all elements
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
    }
  };
  applyReduced();
  mq.addEventListener('change', applyReduced);
})();

/* ── COUNTER ANIMATION ────────────────────────────────────── */
(function initCounters() {
  const counters = document.querySelectorAll('.story-metric');
  if (!counters.length) return;

  const animateCounter = (el) => {
    const text = el.textContent.trim();
    const numMatch = text.match(/[\d.]+/);
    if (!numMatch) return;
    const target = parseFloat(numMatch[0]);
    const suffix = text.replace(numMatch[0], '');
    const duration = 1200;
    const start = performance.now();

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4);
      const current = (target * ease).toFixed(target % 1 === 0 ? 0 : 1);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });

  counters.forEach(el => observer.observe(el));
})();
