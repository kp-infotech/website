// Client-side analytics helpers.
//
// Tracking only runs on the production host (kpinfo.tech) so preview /
// *.workers.dev / localhost builds stay out of GA4 and Clarity. The tags
// themselves are loaded and consent-gated in BaseLayout.astro (GA4 via Google
// Consent Mode v2, Clarity via the CookieYes "analytics" category). These
// helpers are intentionally no-ops until gtag exists and consent has loaded.

const PRODUCTION_HOST = 'kpinfo.tech';

/** True only on the live production host with gtag available. */
export function analyticsEnabled(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.location.hostname === PRODUCTION_HOST &&
    typeof (window as any).gtag === 'function'
  );
}

/** Fire a GA4 event. Safe to call anywhere — silently does nothing off-prod. */
export function trackEvent(name: string, params: Record<string, unknown> = {}): void {
  if (!analyticsEnabled()) return;
  (window as any).gtag('event', name, params);
}

/**
 * Manual page_view — GA4 is configured with send_page_view:false, so we emit
 * one here on initial load and after every Astro view-transition swap. Bound to
 * `astro:page-load`, which fires on the first load AND each client-side
 * navigation, giving exactly one page_view per route with no duplicates.
 */
export function trackPageView(): void {
  trackEvent('page_view', {
    page_location: window.location.href,
    page_path: window.location.pathname + window.location.search,
    page_title: document.title,
  });
}

/** Derive a coarse CTA/link location when one isn't explicitly annotated. */
function locationFromContext(el: Element): string {
  if (el.closest('header, nav')) return 'nav';
  if (el.closest('footer')) return 'footer';
  if (el.closest('.contact-info')) return 'contact_info';
  return 'page';
}

/**
 * One document-level, capture-phase delegated click listener for all CTA /
 * contact-link tracking. Registered once (the BaseLayout body script runs once
 * and persists across view transitions), so it also catches clicks on
 * swapped-in content with no duplicate listeners. Off-prod, trackEvent no-ops.
 *
 * mailto/tel/WhatsApp links are matched by href/class (no per-component markup
 * needed); CTAs opt in via data-cta + data-* attributes forwarded by Button.astro.
 */
export function initClickTracking(): void {
  if (typeof document === 'undefined') return;
  document.addEventListener(
    'click',
    (e) => {
      const start = e.target as Element | null;
      const el = start && start.closest ? start.closest('a, button') : null;
      if (!el) return;

      const href = el.getAttribute('href') || '';
      const data = (el as HTMLElement).dataset;

      if (href.startsWith('mailto:')) {
        trackEvent('click_email', { link_url: href, location: data.location || locationFromContext(el) });
      } else if (href.startsWith('tel:')) {
        trackEvent('click_phone', { link_url: href, location: data.location || locationFromContext(el) });
      } else if (el.matches('.whatsapp-btn') || /wa\.me|api\.whatsapp\.com/.test(href)) {
        trackEvent('click_whatsapp', { link_url: href, location: data.location || 'whatsapp_float' });
      } else if (data.cta) {
        const name =
          data.cta === 'service_cta'
            ? 'service_cta_click'
            : data.cta === 'case_study_cta'
              ? 'case_study_cta_click'
              : data.cta === 'nav_contact'
                ? 'nav_contact_click'
                : 'cta_click';
        const params: Record<string, unknown> = {
          cta_label: data.label || el.textContent?.trim().slice(0, 100) || '',
          cta_location: data.location || '',
        };
        if (data.service) params.service_slug = data.service;
        if (data.caseStudy) params.case_study_slug = data.caseStudy;
        if (href) params.link_url = href;
        trackEvent(name, params);
      }
    },
    { capture: true }
  );
}
