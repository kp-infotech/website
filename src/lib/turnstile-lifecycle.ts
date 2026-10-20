const initializedDocuments = new WeakSet<Document>();

type TurnstileApi = {
  render: (container: HTMLElement) => string | undefined;
  remove: (widgetId: string) => void;
};

/** The implicit SDK puts its widget ID in the generated response field's ID. */
function implicitWidgetId(widget: HTMLElement): string | undefined {
  const field = widget.querySelector<HTMLInputElement>('input[name="cf-turnstile-response"]');
  return field?.id.match(/^(cf-chl-widget-[a-zA-Z0-9_-]+)_response$/)?.[1];
}

/** Mount new form widgets after Astro navigation; preserve already mounted widgets. */
export function initTurnstileLifecycle(doc: Document = document): void {
  if (initializedDocuments.has(doc)) return;
  initializedDocuments.add(doc);
  const widgetIds = new Map<HTMLElement, string>();

  doc.addEventListener('astro:before-swap', () => {
    const api = (doc.defaultView as (Window & { turnstile?: TurnstileApi }) | null)?.turnstile;
    if (!api) {
      widgetIds.clear();
      return;
    }
    // Include tracked containers even if other page code already detached them.
    const widgets = new Set([...widgetIds.keys(), ...doc.querySelectorAll<HTMLElement>('.cf-turnstile')]);
    for (const widget of widgets) {
      const widgetId = widgetIds.get(widget) ?? implicitWidgetId(widget);
      if (widgetId) api.remove(widgetId);
      widgetIds.delete(widget);
    }
  });

  doc.addEventListener('astro:page-load', () => {
    const api = (doc.defaultView as (Window & { turnstile?: TurnstileApi }) | null)?.turnstile;
    if (!api) return; // The initial async SDK load performs its own implicit rendering.

    // The existing async SDK rejects ready(); an available API can render directly.
    for (const widget of doc.querySelectorAll<HTMLElement>('.cf-turnstile')) {
      if (widgetIds.has(widget) || widget.querySelector('input[name="cf-turnstile-response"]')) continue;
      const widgetId = api.render(widget);
      if (widgetId) widgetIds.set(widget, widgetId);
    }
  });
}
