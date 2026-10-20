import type { TransitionBeforeSwapEvent } from 'astro:transitions/client';

const initializedDocuments = new WeakSet<Document>();
const COOKIEYES_ROOTS = '.cky-overlay, .cky-btn-revisit-wrapper, .cky-consent-container, .cky-modal';

/** Keep the existing CMP, its handlers and its unanswered/saved state across Astro swaps. */
export function initConsentLifecycle(doc: Document = document): void {
  if (initializedDocuments.has(doc)) return;
  initializedDocuments.add(doc);

  doc.addEventListener('astro:before-swap', (event) => {
    const transition = event as TransitionBeforeSwapEvent;
    const originalSwap = transition.swap;

    transition.swap = () => {
      // Capture at swap time: the deferred CMP may finish loading during navigation.
      const controls = Array.from(doc.body.children).filter((node) => node.matches(COOKIEYES_ROOTS));
      const resources = Array.from(doc.head.querySelectorAll(
        'style#cky-style, script#cookieyes, script#cookieyes-banner'
      ));
      const focused = doc.activeElement as HTMLElement | null;
      const restoreFocus = focused && controls.some((node) => node.contains(focused));

      originalSwap();

      // Reuse the original nodes, rather than loading CookieYes or Google again.
      for (const node of resources) {
        const replacement = doc.getElementById(node.id);
        if (replacement && replacement !== node) replacement.remove();
        if (!doc.head.contains(node)) doc.head.appendChild(node);
      }
      for (const node of controls) {
        if (!doc.body.contains(node)) doc.body.appendChild(node);
      }
      if (restoreFocus) focused.focus({ preventScroll: true });
    };
  });
}
