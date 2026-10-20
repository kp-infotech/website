import assert from 'node:assert/strict';
import test from 'node:test';
import { JSDOM } from 'jsdom';
import { initTurnstileLifecycle } from '../src/lib/turnstile-lifecycle.ts';

const expectedKey = '0x4AAAAAADqzKn4tiPyk5S8v';

function setup({ responseField = true } = {}) {
  const dom = new JSDOM('<body></body>', { url: 'https://kpinfo.tech/contact/' });
  const doc = dom.window.document;
  const renders = [];
  const removed = [];
  const active = new Map();
  let sequence = 0;

  function mount(node, implicit = false, options) {
    assert.ok(node instanceof dom.window.HTMLElement);
    assert.ok(![...active.values()].includes(node), 'a mounted container must not render twice');
    const id = `cf-chl-widget-${++sequence}`;
    active.set(id, node);
    if (!implicit) renders.push({ node, id, options });
    if (responseField || implicit) {
      const field = doc.createElement('input');
      field.type = 'hidden';
      field.name = 'cf-turnstile-response';
      field.id = `${id}_response`;
      node.appendChild(field);
    }
    return id;
  }

  const sdk = {
    ready() { throw new Error('The async Turnstile SDK rejects ready()'); },
    render(node, options) {
      assert.ok(options && typeof options === 'object', 'render requires an explicit options object');
      assert.equal(options.sitekey, expectedKey, 'render requires the expected public site key');
      assert.equal(options.sitekey, node.getAttribute('data-sitekey'));
      return mount(node, false, options);
    },
    remove(id) {
      assert.equal(typeof id, 'string', 'remove requires a widget ID, never an element');
      assert.ok(active.has(id), `unknown or already removed widget ${id}`);
      const node = active.get(id);
      removed.push({ id, connectedBeforeRemoval: node.isConnected });
      node.replaceChildren();
      active.delete(id);
    },
  };
  const load = () => doc.dispatchEvent(new dom.window.Event('astro:page-load'));
  const beforeSwap = () => doc.dispatchEvent(new dom.window.Event('astro:before-swap'));
  function form() {
    doc.body.innerHTML = `<form><div class="cf-turnstile" data-sitekey="${expectedKey}" data-theme="dark"></div></form>`;
    return doc.querySelector('.cf-turnstile');
  }
  return { dom, doc, sdk, renders, removed, active, mount, load, beforeSwap, form };
}

test('initial asynchronous SDK loading remains owned by the implicit renderer', t => {
  const x = setup(); t.after(() => x.dom.window.close());
  const widget = x.form();
  initTurnstileLifecycle(x.doc);
  x.load();
  assert.equal(x.renders.length, 0);
  x.dom.window.turnstile = x.sdk;
  const id = x.mount(widget, true); // The async SDK performs its initial implicit pass.
  x.load();
  assert.equal(x.renders.length, 0);
  x.beforeSwap();
  assert.deepEqual(x.removed, [{ id, connectedBeforeRemoval: true }]);
  assert.equal(x.active.size, 0);
  assert.equal(x.doc.scripts.length, 0);
});

test('mounted implicit widget and response survive repeated page-load events', t => {
  const x = setup(); t.after(() => x.dom.window.close());
  x.dom.window.turnstile = x.sdk;
  const widget = x.form();
  x.mount(widget, true);
  const response = widget.firstElementChild;
  response.value = 'existing-response';
  initTurnstileLifecycle(x.doc);
  initTurnstileLifecycle(x.doc);
  x.load(); x.load();
  assert.equal(x.renders.length, 0);
  assert.equal(widget.firstElementChild, response);
  assert.equal(response.value, 'existing-response');
});

test('explicit cleanup uses the returned widget ID even when the response field ID changes', t => {
  const x = setup(); t.after(() => x.dom.window.close());
  x.dom.window.turnstile = x.sdk;
  const widget = x.form();
  initTurnstileLifecycle(x.doc);
  x.load(); x.load();
  const { id } = x.renders[0];
  widget.firstElementChild.id = 'not-the-rendered-widget-id';
  x.beforeSwap();
  assert.deepEqual(x.removed, [{ id, connectedBeforeRemoval: true }]);
  assert.equal(x.renders.length, 1);
  assert.equal(x.active.size, 0);
});

test('retained IDs prevent duplicate rendering before the SDK creates its response field', t => {
  const x = setup({ responseField: false }); t.after(() => x.dom.window.close());
  x.dom.window.turnstile = x.sdk;
  x.form();
  initTurnstileLifecycle(x.doc);
  x.load(); x.load();
  assert.equal(x.renders.length, 1);
  x.beforeSwap();
  assert.equal(x.removed[0].id, x.renders[0].id);
  assert.equal(x.active.size, 0);
});

test('multiple widgets and repeated route transitions remove each ID before DOM detachment', t => {
  const x = setup(); t.after(() => x.dom.window.close());
  x.dom.window.turnstile = x.sdk;
  initTurnstileLifecycle(x.doc);
  for (let route = 0; route < 4; route++) {
    x.form();
    x.doc.body.appendChild(x.doc.querySelector('.cf-turnstile').cloneNode());
    x.load(); x.load();
    assert.equal(x.active.size, 2);
    x.beforeSwap();
    assert.equal(x.active.size, 0, 'no SDK widget IDs may leak into the next route');
    x.doc.body.replaceChildren();
  }
  assert.equal(x.renders.length, 8);
  assert.equal(x.removed.length, 8);
  assert.ok(x.removed.every(item => item.connectedBeforeRemoval));
  assert.equal(new Set(x.removed.map(item => item.id)).size, 8);
});

test('cleanup deletes container mappings so the same container can mount a fresh widget', t => {
  const x = setup(); t.after(() => x.dom.window.close());
  x.dom.window.turnstile = x.sdk;
  x.form();
  initTurnstileLifecycle(x.doc);
  x.load(); x.beforeSwap(); x.beforeSwap(); x.load(); x.beforeSwap();
  assert.equal(x.renders.length, 2);
  assert.equal(x.removed.length, 2);
  assert.notEqual(x.removed[0].id, x.removed[1].id);
  assert.equal(x.active.size, 0);
});

test('tracked widgets are still cleaned up if other page code detached their container', t => {
  const x = setup(); t.after(() => x.dom.window.close());
  x.dom.window.turnstile = x.sdk;
  const widget = x.form();
  initTurnstileLifecycle(x.doc);
  x.load(); widget.remove(); x.beforeSwap();
  assert.equal(x.removed[0].id, x.renders[0].id);
  assert.equal(x.active.size, 0);
});

test('late SDK availability renders only the current route without calling ready', t => {
  const x = setup(); t.after(() => x.dom.window.close());
  initTurnstileLifecycle(x.doc);
  const old = x.form(); x.load(); x.beforeSwap();
  const current = x.form();
  x.dom.window.turnstile = x.sdk;
  x.load(); x.load();
  assert.deepEqual(x.renders.map(item => item.node), [current]);
  assert.equal(old.querySelector('[name="cf-turnstile-response"]'), null);
  x.beforeSwap();
  assert.equal(x.active.size, 0);
});

test('an unrecognized mounted response field is preserved without guessing a removal target', t => {
  const x = setup(); t.after(() => x.dom.window.close());
  x.dom.window.turnstile = x.sdk;
  const widget = x.form();
  widget.innerHTML = '<input name="cf-turnstile-response" id="unrelated-field">';
  initTurnstileLifecycle(x.doc);
  x.load(); x.beforeSwap();
  assert.equal(x.renders.length, 0);
  assert.equal(x.removed.length, 0);
});

test('pages without widgets and swaps before SDK loading have no side effects', t => {
  const x = setup(); t.after(() => x.dom.window.close());
  initTurnstileLifecycle(x.doc);
  x.form(); x.beforeSwap();
  x.doc.body.replaceChildren(); x.dom.window.turnstile = x.sdk;
  x.load(); x.beforeSwap();
  assert.equal(x.renders.length, 0);
  assert.equal(x.removed.length, 0);
  assert.equal(x.doc.scripts.length, 0);
  assert.equal(x.doc.cookie, '');
  assert.equal(x.dom.window.gtag, undefined);
});

test('explicit rendering preserves existing theme and supported attribute types and callback semantics', t => {
  const x = setup(); t.after(() => x.dom.window.close());
  x.dom.window.turnstile = x.sdk;
  const widget = x.form();
  const attributes = {
    size: 'compact', action: 'contact', cdata: 'internal-label', language: 'en',
    appearance: 'interaction-only', execution: 'execute', retry: 'never',
    'refresh-expired': 'manual', 'refresh-timeout': 'never', 'response-field-name': 'custom-response',
    tabindex: '2', 'retry-interval': '12000', 'response-field': 'false', 'feedback-enabled': 'false',
    'offlabel-show-privacy': 'true', 'offlabel-show-help': 'false',
  };
  for (const [name, value] of Object.entries(attributes)) widget.setAttribute(`data-${name}`, value);
  const callbacks = [
    'callback', 'error-callback', 'expired-callback', 'timeout-callback',
    'before-interactive-callback', 'after-interactive-callback', 'unsupported-callback',
  ];
  const calls = [];
  for (const name of callbacks) {
    const globalName = name.replaceAll('-', '_');
    widget.setAttribute(`data-${name}`, globalName);
    x.dom.window[globalName] = function (...args) { calls.push({ name, args, receiver: this }); };
  }
  initTurnstileLifecycle(x.doc); x.load();
  assert.equal(calls.length, 0, 'configuration must not execute callbacks');
  const options = x.renders[0].options;
  assert.deepEqual(Object.fromEntries(Object.entries(options).filter(([, v]) => typeof v !== 'function')), {
    sitekey: expectedKey, theme: 'dark', size: 'compact', action: 'contact', cData: 'internal-label',
    language: 'en', appearance: 'interaction-only', execution: 'execute', retry: 'never',
    'refresh-expired': 'manual', 'refresh-timeout': 'never', 'response-field-name': 'custom-response',
    tabindex: 2, 'retry-interval': 12000, 'response-field': false, 'feedback-enabled': false,
    'offlabel-show-privacy': true, 'offlabel-show-help': false,
  });
  for (const name of callbacks) options[name]('sdk-value');
  assert.deepEqual(calls.map(c => [c.name, c.args]), callbacks.map(name => [name, ['sdk-value']]));
  assert.ok(calls.every(c => c.receiver === x.dom.window));
  x.beforeSwap(); assert.equal(x.active.size, 0);
});

test('each widget retains its own explicit configuration and returned ID', t => {
  const x = setup(); t.after(() => x.dom.window.close());
  x.dom.window.turnstile = x.sdk;
  const first = x.form();
  const second = first.cloneNode(); second.setAttribute('data-theme', 'light');
  second.setAttribute('data-action', 'careers'); x.doc.body.appendChild(second);
  initTurnstileLifecycle(x.doc); x.load(); x.load();
  assert.deepEqual(x.renders.map(r => r.options), [
    { sitekey: expectedKey, theme: 'dark' },
    { sitekey: expectedKey, theme: 'light', action: 'careers' },
  ]);
  assert.notEqual(x.renders[0].id, x.renders[1].id);
  x.beforeSwap(); assert.deepEqual(x.removed.map(r => r.id), x.renders.map(r => r.id));
});

test('missing site keys do not trigger an unconfigured render or analytics and consent side effects', t => {
  const x = setup(); t.after(() => x.dom.window.close());
  x.dom.window.turnstile = x.sdk;
  const widget = x.form(); widget.removeAttribute('data-sitekey');
  const analyticsCalls = [];
  x.dom.window.gtag = (...args) => analyticsCalls.push(args);
  x.doc.cookie = 'existing-consent=denied';
  const cookie = x.doc.cookie;
  initTurnstileLifecycle(x.doc); x.load(); x.beforeSwap();
  assert.equal(x.renders.length, 0); assert.equal(x.removed.length, 0);
  assert.deepEqual(analyticsCalls, []); assert.equal(x.doc.cookie, cookie);
  assert.equal(x.doc.scripts.length, 0);
  widget.setAttribute('data-sitekey', expectedKey); x.load(); x.beforeSwap();
  assert.equal(x.renders.length, 1); assert.equal(x.active.size, 0);
  assert.deepEqual(analyticsCalls, []); assert.equal(x.doc.cookie, cookie);
});
