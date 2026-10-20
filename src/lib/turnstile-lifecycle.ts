const initializedDocuments = new WeakSet<Document>();

type TurnstileApi = {
  render: (container: HTMLElement) => string;
  remove: (container: HTMLElement) => void;
};

/** Mount new form widgets after Astro navigation; preserve already mounted widgets. */
export function initTurnstileLifecycle(doc: Document = document): void {
  if (initializedDocuments.has(doc)) return;
  initializedDocuments.add(doc);

  doc.addEventListener('astro:before-swap', () => {
    const api = (doc.defaultView as (Window & { turnstile?: TurnstileApi }) | null)?.turnstile;
    if (!api) return;
    // Stop SDK work for outgoing iframes before Astro detaches their document body.
    for (const widget of doc.querySelectorAll<HTMLElement>('.cf-turnstile')) {
      if (widget.querySelector('input[name="cf-turnstile-response"]')) api.remove(widget);
    }
  });

  doc.addEventListener('astro:page-load', () => {
    const api = (doc.defaultView as (Window & { turnstile?: TurnstileApi }) | null)?.turnstile;
    if (!api) return; // The initial async SDK load performs its own implicit rendering.

    // The existing async SDK rejects ready(); an available API can render directly.
    for (const widget of doc.querySelectorAll<HTMLElement>('.cf-turnstile')) {
      if (!widget.querySelector('input[name="cf-turnstile-response"]')) api.render(widget);
    }
  });
}
