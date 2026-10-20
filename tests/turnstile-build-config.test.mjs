import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

const configUrl = new URL('../astro.config.mjs', import.meta.url).href;
const expectedKey = '0x4AAAAAADqzKn4tiPyk5S8v';

function configDefines(t, { environmentKey, localKey } = {}) {
  const cwd = mkdtempSync(join(tmpdir(), 'kp-turnstile-build-'));
  t.after(() => rmSync(cwd, { recursive: true, force: true }));
  if (localKey) writeFileSync(join(cwd, '.env'), `PUBLIC_TURNSTILE_SITE_KEY=${localKey}\n`);
  const env = { ...process.env, PUBLIC_SANITY_PROJECT_ID: '5rux0mv2' };
  delete env.PUBLIC_TURNSTILE_SITE_KEY;
  delete env.SANITY_API_TOKEN;
  env.TURNSTILE_SECRET_KEY = 'server-secret-test-sentinel';
  if (environmentKey) env.PUBLIC_TURNSTILE_SITE_KEY = environmentKey;
  const result = spawnSync(process.execPath, ['--input-type=module', '-e', `
    const config = (await import(${JSON.stringify(configUrl)})).default;
    console.log('BUILD_DEFINES=' + JSON.stringify(config.vite.define));
  `], { cwd, env, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  const line = result.stdout.split('\n').find(line => line.startsWith('BUILD_DEFINES='));
  assert.ok(line, result.stdout);
  return JSON.parse(line.slice('BUILD_DEFINES='.length));
}

test('a clean build gets the committed public Turnstile key without a local env file', t => {
  const defines = configDefines(t);
  assert.equal(JSON.parse(defines['import.meta.env.PUBLIC_TURNSTILE_SITE_KEY']), expectedKey);
  assert.deepEqual(Object.keys(defines), ['import.meta.env.PUBLIC_TURNSTILE_SITE_KEY']);
  assert.ok(!JSON.stringify(defines).includes('server-secret-test-sentinel'));
});

test('hosting build variables retain precedence over local env and committed defaults', t => {
  const defines = configDefines(t, { environmentKey: 'hosting-public-key', localKey: 'local-public-key' });
  assert.equal(JSON.parse(defines['import.meta.env.PUBLIC_TURNSTILE_SITE_KEY']), 'hosting-public-key');
});

test('the established local loadEnv override remains available', t => {
  const defines = configDefines(t, { localKey: 'local-public-key' });
  assert.equal(JSON.parse(defines['import.meta.env.PUBLIC_TURNSTILE_SITE_KEY']), 'local-public-key');
});
