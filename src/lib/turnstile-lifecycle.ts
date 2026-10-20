const initializedDocuments = new WeakSet<Document>();

type TurnstileCallback = (...args: unknown[]) => unknown;
type TurnstileOptions = {
  sitekey: string;
  [name: string]: string | number | boolean | TurnstileCallback;
};

type TurnstileApi = {
  render: (container: HTMLElement, options: TurnstileOptions) => string | undefined;
  remove: (widgetId: string) => void;
};

/** Translate existing markup into documented render options, without inventing defaults. */
function renderOptions(widget: HTMLElement): TurnstileOptions | undefined {
  const sitekey = widget.getAttribute('data-sitekey')?.trim();
  if (!sitekey) return;
  const options: TurnstileOptions = { sitekey };
  const strings = [
    'theme', 'size', 'action', 'language', 'appearance', 'execution', 'retry',
    'refresh-expired', 'refresh-timeout', 'response-field-name',
  ];
  for (const name of strings) {
    const value = widget.getAttribute(`data-${name}`);
    if (value !== null) options[name] = value;
  }
  const cData = widget.getAttribute('data-cdata');
  if (cData !== null) options.cData = cData;
  for (const name of ['tabindex', 'retry-interval']) {
    const value = widget.getAttribute(`data-${name}`);
    if (value !== null && value.trim() !== '' && Number.isFinite(Number(value))) {
      options[name] = Number(value);
    }
  }
  for (const name of ['response-field', 'feedback-enabled', 'offlabel-show-privacy', 'offlabel-show-help']) {
    const value = widget.getAttribute(`data-${name}`);
    if (value === 'true' || value === 'false') options[name] = value === 'true';
  }
  for (const name of [
    'callback', 'error-callback', 'expired-callback', 'timeout-callback',
    'before-interactive-callback', 'after-interactive-callback', 'unsupported-callback',
  ]) {
    const callbackName = widget.getAttribute(`data-${name}`);
    const view = widget.ownerDocument.defaultView;
    const callback = callbackName && view
      ? (view as unknown as Record<string, unknown>)[callbackName]
      : undefined;
    if (typeof callback === 'function') options[name] = callback.bind(view) as TurnstileCallback;
  }
  return options;
}

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
      const options = renderOptions(widget);
      if (!options) continue;
      const widgetId = api.render(widget, options);
      if (widgetId) widgetIds.set(widget, widgetId);
    }
  });
}
