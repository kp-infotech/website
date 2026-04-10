/**
 * animations.ts — Centralized GSAP animation system
 *
 * Uses gsap.set() to apply initial hidden state immediately, then gsap.to()
 * with ScrollTrigger to reveal. This avoids the "bounce" issue from gsap.from()
 * and the "empty space" issue from immediateRender.
 *
 * Usage: Add data-reveal="text|stagger|curtain|counter|clip|fade" to elements.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Text Reveal — lines slide up from below */
function initTextReveals() {
  document.querySelectorAll('[data-reveal="text"]').forEach((el) => {
    const lines = el.querySelectorAll('.reveal-line');
    if (lines.length === 0) {
      gsap.set(el, { y: 40, opacity: 0 });
      gsap.to(el, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%' },
      });
      return;
    }
    gsap.set(lines, { y: '100%', opacity: 0 });
    gsap.to(lines, {
      y: 0,
      opacity: 1,
      duration: 1,
      ease: 'power3.out',
      stagger: 0.12,
      scrollTrigger: { trigger: el, start: 'top 80%' },
    });
  });
}

/** Staggered Grid — children fade up in sequence */
function initStaggerGrids() {
  document.querySelectorAll('[data-reveal="stagger"]').forEach((el) => {
    const children = el.children;
    if (children.length === 0) return;
    gsap.set(children, { y: 60, opacity: 0 });
    gsap.to(children, {
      y: 0,
      opacity: 1,
      duration: 0.7,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%' },
    });
  });
}

/** Image Curtain Reveal — overlay wipes away + image zoom settle */
function initCurtainReveals() {
  document.querySelectorAll('[data-reveal="curtain"]').forEach((el) => {
    const overlay = el.querySelector('.curtain-overlay');
    const image = el.querySelector('.curtain-image');
    if (!overlay) return;

    const tl = gsap.timeline({
      scrollTrigger: { trigger: el, start: 'top 80%' },
    });

    tl.to(overlay, {
      scaleX: 0,
      duration: 1.2,
      ease: 'power3.inOut',
    });

    if (image) {
      gsap.set(image, { scale: 1.3 });
      tl.to(image, {
        scale: 1,
        duration: 1.4,
        ease: 'power3.out',
      }, '-=0.8');
    }
  });
}

/** Counter Animation — numbers count up from 0 */
function initCounters() {
  document.querySelectorAll('[data-reveal="counter"]').forEach((el) => {
    const target = parseInt(el.getAttribute('data-counter-target') || '0', 10);
    if (isNaN(target) || target === 0) return;

    const suffix = el.getAttribute('data-counter-suffix') || '';
    el.textContent = '0' + suffix;

    gsap.to(el, {
      textContent: target,
      duration: 2,
      ease: 'power2.out',
      snap: { textContent: 1 },
      scrollTrigger: { trigger: el, start: 'top 85%' },
      onUpdate() {
        el.textContent = Math.round(parseFloat(el.textContent || '0')) + suffix;
      },
    });
  });
}

/** Clip-Path Wipe — content revealed by animated clip */
function initClipReveals() {
  document.querySelectorAll('[data-reveal="clip"]').forEach((el) => {
    gsap.set(el, { clipPath: 'inset(0 100% 0 0)' });
    gsap.to(el, {
      clipPath: 'inset(0 0% 0 0)',
      duration: 1.2,
      ease: 'power3.inOut',
      scrollTrigger: { trigger: el, start: 'top 75%' },
    });
  });
}

/** Fade Up — simple fade + translate for generic elements */
function initFadeUps() {
  document.querySelectorAll('[data-reveal="fade"]').forEach((el) => {
    gsap.set(el, { y: 40, opacity: 0 });
    gsap.to(el, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%' },
    });
  });
}

/** Main init — call all animation initializers */
export function initAnimations() {
  if (prefersReducedMotion()) return;

  // Kill existing ScrollTriggers to prevent duplicates on page transitions
  ScrollTrigger.getAll().forEach((t) => t.kill());

  initTextReveals();
  initStaggerGrids();
  initCurtainReveals();
  initCounters();
  initClipReveals();
  initFadeUps();

  // Refresh ScrollTrigger after all animations are set up
  ScrollTrigger.refresh();
}
