/* ============================================================
   Lucas Oliveira — Consultor de Planos de Saúde
   JS Principal · Interações e Animações
   ============================================================ */

(function () {
  'use strict';

  /* ── Ano no footer ──────────────────────────────────────── */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ── Header ao rolar ────────────────────────────────────── */
  const header = document.getElementById('header');
  const SCROLL_THRESHOLD = 60;

  function updateHeader() {
    if (window.scrollY > SCROLL_THRESHOLD) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  /* ── Botão flutuante WhatsApp ───────────────────────────── */
  const waFloat = document.getElementById('whatsappFloat');

  function updateWAFloat() {
    if (window.scrollY > 300) {
      waFloat.classList.add('visible');
    } else {
      waFloat.classList.remove('visible');
    }
  }
  window.addEventListener('scroll', updateWAFloat, { passive: true });

  /* ── Menu Mobile ────────────────────────────────────────── */
  const menuToggle = document.getElementById('menuToggle');
  const mainNav    = document.getElementById('mainNav');

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', function () {
      const isOpen = mainNav.classList.toggle('open');
      menuToggle.classList.toggle('active', isOpen);
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Fecha ao clicar num link
    mainNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mainNav.classList.remove('open');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Fecha ao clicar fora
    document.addEventListener('click', function (e) {
      if (!header.contains(e.target) && mainNav.classList.contains('open')) {
        mainNav.classList.remove('open');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  /* ── Animações de entrada via IntersectionObserver ──────── */
  function initAnimations() {
    if (!('IntersectionObserver' in window)) {
      // Fallback: exibe tudo
      document.querySelectorAll('[data-animate],[data-animate-delay]').forEach(function (el) {
        el.classList.add('in-view');
      });
      return;
    }

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('[data-animate],[data-animate-delay]').forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ── Scroll suave para âncoras ──────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const headerH = header ? header.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH - 16;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* ── Stagger nos cards ──────────────────────────────────── */
  function staggerCards(selector, delay) {
    document.querySelectorAll(selector).forEach(function (card, i) {
      card.style.transitionDelay = (i * delay) + 's';
    });
  }

  staggerCards('.service-card',     0.08);
  staggerCards('.diferencial-item', 0.07);
  staggerCards('.depo-card',        0.10);
  staggerCards('.step',             0.10);

  /* ── Init ───────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', initAnimations);

  // Caso o DOM já esteja carregado
  if (document.readyState !== 'loading') {
    initAnimations();
  }

})();
