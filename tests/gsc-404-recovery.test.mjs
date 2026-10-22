import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import vm from 'node:vm';
import * as migration from '../src/worker/migration-redirects.js';

const origin = 'https://kpinfo.tech';
const replacements = [
  ['/erp-software-odoo', '/insights/odoo-erp-complete-guide/'],
  ['/best-framework-for-web-application', '/insights/best-web-application-frameworks/'],
];
const staticRules = readFileSync(new URL('../public/_redirects', import.meta.url), 'utf8')
  .split('\n').filter(line => line.trim() && !line.startsWith('#'))
  .map(line => line.trim().split(/\s+/));
const workerCode = readFileSync(new URL('../src/worker.js', import.meta.url), 'utf8')
  .replace(/import\s+[\s\S]*?from\s+['"][^'"]+['"];\s*/g, '')
  .replace('export default', 'globalThis.worker =');
const fallback = [];
const sandbox = { ...migration, Response, handle: request => {
  fallback.push(request.url);
  return new Response('Normal missing page', { status: 404 });
} };
vm.runInNewContext(workerCode, sandbox);

test('reviewed article replacements produce direct 301s for GET and HEAD with query preservation', async () => {
  fallback.length = 0;
  for (const [source, target] of replacements) {
    for (const suffix of ['', '/', '?utm_source=legacy&x=a%2Fb&x=2', '/?utm_source=legacy&x=a%2Fb&x=2']) {
      for (const method of ['GET', 'HEAD']) {
        const request = new Request(origin + source + suffix, { method });
        const response = await sandbox.worker.fetch(request, {}, {});
        assert.equal(response.status, 301, request.url);
        assert.equal(response.headers.get('location'), origin + target + new URL(request.url).search);
      }
    }
    assert.equal(migration.getMigrationRedirectLocation(origin + target), null, 'no redirect chain');
  }
  assert.deepEqual(fallback, []);
});

test('static redirects agree with the Worker for both slash forms without duplicate rules', () => {
  for (const [source, target] of replacements) {
    for (const path of [source, source + '/']) {
      const matches = staticRules.filter(rule => rule[0] === path);
      assert.deepEqual(matches, [[path, target, '301']], path);
    }
    assert.equal(staticRules.some(rule => rule[0] === target), false, 'no static redirect chain');
  }
});

test('different AngularJS topics and unrelated WordPress or marketing routes retain normal 404 semantics', async () => {
  for (const path of [
    '/angularjs-vs-reactjs/', '/react-vs-angular-js/',
    '/best-framework-for-web-application/another-post/',
    '/erp-software-odoo/feed/', '/wp-admin/admin-ajax.php',
    '/wp-content/uploads/*', '/search/{search_term_string}/',
    '/sample-digital-marketing-strategy/', '/services/marketing/',
  ]) {
    const response = await sandbox.worker.fetch(new Request(origin + path), {}, {});
    assert.equal(response.status, 404, path);
    assert.equal(response.headers.get('location'), null, path);
  }
});
