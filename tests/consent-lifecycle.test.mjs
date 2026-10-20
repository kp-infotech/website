import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import test from 'node:test';
import vm from 'node:vm';
import { JSDOM } from 'jsdom';
import { initConsentLifecycle } from '../src/lib/consent-lifecycle.ts';

// Resolve Vite's production compile-time flag while running Astro's actual code in Node.
const swapSource = readFileSync(new URL('../node_modules/astro/dist/transitions/swap-functions.js', import.meta.url), 'utf8')
  .replaceAll('import.meta.env.DEV', 'false');
const { swap } = await import(`data:text/javascript;base64,${Buffer.from(swapSource).toString('base64')}`);

const roots = '.cky-overlay, .cky-btn-revisit-wrapper, .cky-consent-container, .cky-modal';

function setup(choice) {
  const dom = new JSDOM('<!doctype html><head><title>Home</title></head><body><main>Home</main></body>', {
    url: 'https://kpinfo.tech/', runScripts: 'dangerously',
  });
  const { document } = dom.window;
  // Exercise the installed Astro swap implementation, rather than a swap imitation.
  globalThis.document = document;
  globalThis.location = dom.window.location;
  globalThis.HTMLElement = dom.window.HTMLElement;
  globalThis.HTMLInputElement = dom.window.HTMLInputElement;
  globalThis.HTMLTextAreaElement = dom.window.HTMLTextAreaElement;
  const updates = [];
  const insertCmp = () => {
    document.head.insertAdjacentHTML('beforeend', '<script id="cookieyes"></script><script id="cookieyes-banner"></script><style id="cky-style">.cky-hide{display:none}</style>');
    document.body.insertAdjacentHTML('beforeend', `
      <div class="cky-overlay cky-hide"></div>
      <div class="cky-btn-revisit-wrapper"><button>Preferences</button></div>
      <div class="cky-consent-container ${choice ? 'cky-hide' : ''}"><button data-choice="yes">Accept</button><button data-choice="no">Reject</button></div>
      <div class="cky-modal"><input id="preference" type="checkbox"></div>`);
    if (choice) document.cookie = `cookieyes-consent=analytics:${choice};path=/`;
    document.querySelector('.cky-btn-revisit-wrapper button').addEventListener('click', () => {
      document.querySelector('.cky-modal').classList.toggle('cky-modal-open');
    });
    for (const button of document.querySelectorAll('[data-choice]')) {
      button.addEventListener('click', () => {
        document.cookie = `cookieyes-consent=analytics:${button.dataset.choice};path=/`;
        updates.push(button.dataset.choice);
        document.querySelector('.cky-consent-container').classList.add('cky-hide');
      });
    }
  };
  const navigate = (title) => {
    const next = new dom.window.DOMParser().parseFromString(`<!doctype html><head><title>${title}</title></head><body><main>${title}</main></body>`, 'text/html');
    const event = new dom.window.Event('astro:before-swap');
    let swaps = 0;
    event.swap = () => { swaps++; swap(next); };
    document.dispatchEvent(event);
    event.swap();
    assert.equal(swaps, 1);
    assert.equal(document.title, title);
  };
  return { dom, document, updates, insertCmp, navigate };
}

for (const choice of [undefined, 'yes', 'no']) {
  test(`real Astro swaps preserve ${choice ?? 'unanswered'} consent and original interactive nodes`, () => {
    const { dom, document, updates, insertCmp, navigate } = setup(choice);
    insertCmp();
    const nodes = [...document.querySelectorAll(roots)];
    const resources = [...document.head.querySelectorAll('#cookieyes, #cookieyes-banner, #cky-style')];
    const cookie = document.cookie;
    initConsentLifecycle(document);
    initConsentLifecycle(document);
    for (const route of ['Service', 'Article', 'Contact', 'Article back', 'Contact forward']) {
      navigate(route);
      assert.deepEqual([...document.querySelectorAll(roots)], nodes);
      assert.deepEqual([...document.head.querySelectorAll('#cookieyes, #cookieyes-banner, #cky-style')], resources);
      assert.equal(document.cookie, cookie);
      assert.deepEqual(updates, [], 'navigation must not grant or rewrite consent');
      assert.equal(document.querySelector('.cky-consent-container').classList.contains('cky-hide'), !!choice);
      document.querySelector('.cky-btn-revisit-wrapper button').click();
      assert.ok(document.querySelector('.cky-modal').classList.contains('cky-modal-open'));
      document.querySelector('.cky-btn-revisit-wrapper button').click();
    }
    document.querySelector('[data-choice="yes"]').click();
    navigate('After accept');
    assert.match(document.cookie, /analytics:yes/);
    document.querySelector('[data-choice="no"]').click();
    navigate('After reject');
    assert.match(document.cookie, /analytics:no/);
    assert.deepEqual(updates, ['yes', 'no'], 'original event handlers remain attached exactly once');
    dom.window.close();
  });
}

test('CMP arriving after an early navigation is preserved, including open preference focus', () => {
  const { dom, document, insertCmp, navigate } = setup();
  initConsentLifecycle(document);
  navigate('Before deferred CMP');
  insertCmp();
  const field = document.getElementById('preference');
  field.checked = true;
  field.focus();
  document.querySelector('.cky-modal').classList.add('cky-modal-open');
  navigate('Deferred CMP ready');
  assert.equal(document.activeElement, field);
  assert.ok(field.checked);
  assert.ok(document.querySelector('.cky-modal').classList.contains('cky-modal-open'));
  assert.equal(document.cookie, '');
  dom.window.close();
});

test('lifecycle repair does not run loaders or enqueue GA consent/config commands', () => {
  const dom = new JSDOM('<body></body>', { url: 'https://kpinfo.tech/', runScripts: 'outside-only' });
  const source = readFileSync(new URL('../src/lib/consent-lifecycle.ts', import.meta.url), 'utf8');
  const js = stripTypeScriptTypes(source.replace(/^import type .*;\n/m, '').replace('export function', 'function'));
  vm.runInContext(js + '\ninitConsentLifecycle(); initConsentLifecycle();', dom.getInternalVMContext());
  assert.equal(dom.window.document.scripts.length, 0);
  assert.equal(dom.window.gtag, undefined);
  assert.equal(dom.window.dataLayer, undefined);
  dom.window.close();
});

test('restoring already executed CMP scripts never executes them or GA configuration again', () => {
  const { dom, document, insertCmp, navigate } = setup('no');
  insertCmp();
  for (const [id, counter] of [['cookieyes', 'cmpLoads'], ['cookieyes-banner', 'bannerLoads'], ['google-tag', 'gaLoads']]) {
    document.getElementById(id)?.remove();
    const script = document.createElement('script');
    script.id = id;
    script.textContent = `window.${counter} = (window.${counter} || 0) + 1;`;
    document.head.appendChild(script);
  }
  initConsentLifecycle(document);
  for (const page of ['Service', 'Article', 'Contact', 'Back', 'Forward']) navigate(page);
  assert.equal(dom.window.cmpLoads, 1);
  assert.equal(dom.window.bannerLoads, 1);
  assert.equal(dom.window.gaLoads, 1);
  dom.window.close();
});
