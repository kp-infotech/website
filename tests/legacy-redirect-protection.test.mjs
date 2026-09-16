import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import vm from 'node:vm';
import * as migration from '../src/worker/migration-redirects.js';

const baseline = JSON.parse(readFileSync(new URL('./fixtures/legacy-redirects.json', import.meta.url)));
const decisions = JSON.parse(readFileSync(new URL('./fixtures/step-1c-case-study-decisions.json', import.meta.url)));
const removedSources = new Set(decisions.removedCaseStudySlugs.map(slug => `/casestudy/${slug}/`));
const retainedWorker = baseline.worker.filter(rule => !removedSources.has(rule.source));
const rules = readFileSync(new URL('../public/_redirects', import.meta.url), 'utf8')
  .split('\n').filter(line => line.trim() && !line.startsWith('#')).map(line => {
    const [source, target, status] = line.trim().split(/\s+/);
    return { source, target, status: Number(status) };
  });
const origin = 'https://kpinfo.tech';
const resolve = path => migration.getMigrationRedirectLocation(origin + path);

test('all 96 retained historical Worker migrations retain their destinations, queries and 301 status', () => {
  assert.equal(migration.PERMANENT_REDIRECT_STATUS, 301);
  for (const { source, target } of retainedWorker) {
    for (const path of [source, source.replace(/\/$/, '')]) {
      assert.equal(resolve(path), origin + target, path);
      assert.equal(resolve(path + '?utm_source=legacy&x=a%2Fb&x=2'), origin + target + '?utm_source=legacy&x=a%2Fb&x=2', path);
    }
    assert.equal(resolve(target), null, `Worker chain: ${source} -> ${target}`);
  }
});

test('every non-wildcard legacy static source is retained as a 301 and overlapping targets agree with Worker', () => {
  assert.equal(new Set(rules.map(r => r.source)).size, rules.length, 'duplicate static sources');
  for (const old of baseline.staticRules) {
    if (old.source === "/casestudy/*") continue; // Explicit Step 1C scope correction.
    const current = rules.find(rule => rule.source === old.source);
    assert.ok(current, `removed legacy source ${old.source}`);
    assert.equal(current.status, 301);
    const worker = old.source.includes('*') ? null : resolve(old.source);
    assert.equal(current.target, worker ? new URL(worker).pathname : old.target, old.source);
    if (worker) {
      assert.equal(resolve(current.target), null);
      assert.equal(rules.some(rule => rule.source === current.target), false, `static chain at ${current.target}`);
    }
  }
});

test('unknown case studies have no Worker or static wildcard migration', () => {
  assert.equal(rules.some(r => r.source.startsWith('/casestudy/') && r.source.includes('*')), false);
  for (const path of ['/casestudy/unknown-slug/', '/casestudy/nested/slug/', '/blogs/unknown-slug/', '/blogs/nested/slug/', '/unmapped-legacy/']) {
    assert.equal(resolve(path), null, path);
  }
});

test('existing routing precedence is retained without the unapproved sample-marketing override', () => {
  const config = readFileSync(new URL('../wrangler.toml', import.meta.url), 'utf8');
  assert.match(config, /main\s*=\s*"src\/worker.js"/);
  const patterns = [...config.split('run_worker_first = [')[1].split(']')[0].matchAll(/"([^"]+)"/g)].map(m => m[1]);
  const matches = path => patterns.some(p => p.endsWith('*') ? path.startsWith(p.slice(0, -1)) : path === p);
  for (const {source} of rules) {
    if (source.startsWith('/services/') || source.startsWith('/hire-') || ['/career/', '/blogs/', '/casestudy/', '/kp-infotech-faqs/'].includes(source)) {
      assert.ok(matches(source), source);
      if (!source.includes('*')) assert.ok(matches(source.slice(0,-1)), source);
    }
  }
  for (const path of ['/sample-digital-marketing-strategy', '/sample-digital-marketing-strategy/']) assert.equal(matches(path), false, path);
});

// Execute the real Worker wrapper with only the Astro dependency stubbed.
// This verifies HTTP responses/order; it does not simulate Cloudflare asset routing.
const code = readFileSync(new URL('../src/worker.js', import.meta.url), 'utf8')
  .replace(/import\s+[\s\S]*?from\s+['"][^'"]+['"];\s*/g, '')
  .replace('export default', 'globalThis.worker =');
const calls = [];
const sandbox = { ...migration, Response, handle: (...args) => { calls.push(args); return new Response('Astro fallback', { status: 404 }); } };
vm.runInNewContext(code, sandbox);

test('Worker emits 301 with Location before Astro for GET and HEAD across the retained baseline', async () => {
  calls.length = 0;
  for (const {source, target} of retainedWorker) {
    for (const method of ['GET', 'HEAD']) {
      const response = await sandbox.worker.fetch(new Request(origin + source + '?ref=legacy', {method}), {}, {});
      assert.equal(response.status, 301, source);
      assert.equal(response.headers.get('location'), origin + target + '?ref=legacy');
    }
  }
  assert.equal(calls.length, 0);
});

test('SEO-pending sample marketing keeps normal 404 semantics without a redirect or 410', async () => {
  for (const path of ['/sample-digital-marketing-strategy', '/sample-digital-marketing-strategy/', '/sample-digital-marketing-strategy/?ref=legacy']) {
    assert.equal(resolve(path), null);
    assert.equal(rules.some(rule => rule.source === path), false);
    for (const method of ['GET', 'HEAD']) {
      const response = await sandbox.worker.fetch(new Request(origin + path, {method}), {}, {});
      assert.equal(response.status, 404);
      assert.equal(response.headers.get('location'), null);
    }
  }
});

test('Step 1C removes exactly the 21 unsupported project migrations, without adding Gone responses', async () => {
  assert.equal(removedSources.size, 21);
  assert.equal(retainedWorker.length, 96);
  for (const source of removedSources) {
    for (const path of [source, source.slice(0, -1), source + '?ref=legacy']) {
      assert.equal(resolve(path), null, path);
      assert.equal(rules.some(rule => rule.source === path), false, path);
      const response = await sandbox.worker.fetch(new Request(origin + path), {}, {});
      assert.equal(response.status, 404, path);
      assert.equal(response.headers.get('location'), null, path);
    }
  }
  for (const rule of rules.filter(rule => rule.source.startsWith('/casestudy/') && rule.source !== '/casestudy/')) {
    assert.equal(resolve(rule.source), origin + rule.target);
    assert.equal(rule.status, 301);
    assert.ok(decisions.activePublishedSlugs.includes(rule.target.split('/')[2]));
  }
});
