import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const homepageHtml = readFileSync(
  new URL('../dist/client/index.html', import.meta.url),
  'utf8',
);

test('the built homepage has no render-blocking stylesheet requests', () => {
  assert.doesNotMatch(homepageHtml, /<link\s+rel=["']stylesheet["']/i);
});

test('production utility and analytics scripts wait until after initial render', () => {
  const insertedScripts = [];
  const loadCallbacks = [];
  const idleCallbacks = [];
  const timers = [];

  const document = {
    readyState: 'loading',
    createElement: (tagName) => ({
      tagName,
      attributes: {},
      setAttribute(name, value) {
        this.attributes[name] = value;
      },
    }),
    querySelector: (selector) => {
      if (!selector.includes('static.cloudflareinsights.com/beacon.min.js')) return null;
      return insertedScripts.find((script) =>
        script.src?.includes('static.cloudflareinsights.com/beacon.min.js')) || null;
    },
    head: {
      appendChild: (element) => insertedScripts.push(element),
    },
    getElementsByTagName: () => [{
      parentNode: {
        insertBefore: (element) => insertedScripts.push(element),
      },
    }],
  };

  const window = {
    location: { hostname: 'kpinfo.tech' },
    addEventListener: (type, callback) => {
      if (type === 'load') loadCallbacks.push(callback);
    },
    dataLayer: [],
  };

  const context = vm.createContext({
    document,
    window,
    requestIdleCallback: (callback) => idleCallbacks.push(callback),
    setTimeout: (callback, delay) => timers.push({ callback, delay }),
  });

  const executableScripts = [...homepageHtml.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)]
    .map((match) => match[1])
    .filter((source) =>
      source.includes('loadAfterInitialRender')
      || source.includes('googletagmanager.com')
      || source.includes('cdn-cookieyes.com')
      || source.includes('www.clarity.ms')
      || source.includes('static.cloudflareinsights.com'));

  for (const source of executableScripts) {
    vm.runInContext(source, context);
  }

  assert.equal(
    insertedScripts.length,
    0,
    'no third-party script should be inserted during HTML parsing',
  );

  for (const callback of loadCallbacks) callback();
  assert.equal(
    insertedScripts.length,
    0,
    'load alone should not start third-party downloads',
  );
  assert.ok(
    timers.every(({ delay }) => delay >= 5000),
    'passive loads should keep third parties outside the initial performance window',
  );

  for (const callback of idleCallbacks) callback();
  for (const { callback } of timers) callback();

  const insertedSources = insertedScripts.map((script) => script.src);
  assert.ok(insertedSources.some((src) => src?.includes('googletagmanager.com')));
  assert.ok(insertedSources.some((src) => src?.includes('cdn-cookieyes.com')));
  assert.ok(insertedSources.some((src) => src?.includes('clarity.ms')));

  const cloudflareBeacon = insertedScripts.find((script) =>
    script.src?.includes('static.cloudflareinsights.com/beacon.min.js'));
  assert.ok(cloudflareBeacon, 'the manual Cloudflare beacon should be inserted');
  assert.equal(cloudflareBeacon.type, 'module');
  assert.equal(
    cloudflareBeacon.attributes['data-cf-beacon'],
    '{"token":"a9661ca4f3144990acf6e29d46d2af50"}',
  );
});
