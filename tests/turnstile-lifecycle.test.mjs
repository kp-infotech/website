import assert from 'node:assert/strict';
import test from 'node:test';
import { JSDOM } from 'jsdom';
import { initTurnstileLifecycle } from '../src/lib/turnstile-lifecycle.ts';

function setup({ responseField = true } = {}) {
  const dom = new JSDOM('<body></body>', { url: 'https://kpinfo.tech/contact/' });
  const doc = dom.window.document;
  const renders = [];
  const removed = [];
  const active = new Map();
  let sequence = 0;

  function mount(node, implicit = false) {
    assert.ok(node instanceof dom.window.HTMLElement);
    assert.ok(![...active.values()].includes(node), 'a mounted container must not render twice');
    const id = `cf-chl-widget-${++sequence}`;
    active.set(id, node);
    if (!implicit) renders.push({ node, id });
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
    render: node => mount(node),
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
    doc.body.innerHTML = '<form><div class="cf-turnstile" data-sitekey="existing-public-key"></div></form>';
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
