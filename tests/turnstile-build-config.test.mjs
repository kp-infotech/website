import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

const configUrl = new URL('../astro.config.mjs', import.meta.url).href;
const expectedIds = {
  PUBLIC_GA_MEASUREMENT_ID: 'G-C7WVQ3DEWF',
  PUBLIC_CLARITY_ID: 'pqpi438d1f',
  PUBLIC_TURNSTILE_SITE_KEY: '0x4AAAAAADqzKn4tiPyk5S8v',
};

function configDefines(t, { environment = {}, local = {} } = {}) {
  const cwd = mkdtempSync(join(tmpdir(), 'kp-public-build-'));
  t.after(() => rmSync(cwd, { recursive: true, force: true }));
  if (Object.keys(local).length) {
    writeFileSync(join(cwd, '.env'), Object.entries(local).map(([k, v]) => `${k}=${v}`).join('\n') + '\n');
  }
  const env = { ...process.env, PUBLIC_SANITY_PROJECT_ID: '5rux0mv2' };
  for (const name of Object.keys(expectedIds)) delete env[name];
  Object.assign(env, {
    TURNSTILE_SECRET_KEY: 'turnstile-private-test-sentinel',
    SANITY_API_TOKEN: 'sanity-private-test-sentinel',
    EMAIL_API_KEY: 'email-private-test-sentinel',
    UNRELATED_PRIVATE_BINDING: 'other-private-test-sentinel',
  }, environment);
  const result = spawnSync(process.execPath, ['--input-type=module', '-e', `
    const config = (await import(${JSON.stringify(configUrl)})).default;
    console.log('BUILD_DEFINES=' + JSON.stringify(config.vite.define));
  `], { cwd, env, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  const line = result.stdout.split('\n').find(line => line.startsWith('BUILD_DEFINES='));
  assert.ok(line, result.stdout);
  return JSON.parse(line.slice('BUILD_DEFINES='.length));
}

for (const [name, expected] of Object.entries(expectedIds)) {
  test(`${name} uses its committed public default without exported IDs or a local env file`, t => {
    const defines = configDefines(t);
    assert.equal(JSON.parse(defines[`import.meta.env.${name}`]), expected);
  });
  test(`${name} hosting process environment wins over local values and committed defaults`, t => {
    const defines = configDefines(t, { environment: { [name]: 'hosting-public-value' }, local: { [name]: 'local-public-value' } });
    assert.equal(JSON.parse(defines[`import.meta.env.${name}`]), 'hosting-public-value');
  });
  test(`${name} local loadEnv wins when process environment is absent`, t => {
    const defines = configDefines(t, { local: { [name]: 'local-public-value' } });
    assert.equal(JSON.parse(defines[`import.meta.env.${name}`]), 'local-public-value');
  });
  test(`${name} preserves intentional empty process and local overrides`, t => {
    const hosting = configDefines(t, { environment: { [name]: '' }, local: { [name]: 'local-public-value' } });
    assert.equal(JSON.parse(hosting[`import.meta.env.${name}`]), '');
    const local = configDefines(t, { local: { [name]: '' } });
    assert.equal(JSON.parse(local[`import.meta.env.${name}`]), '');
  });
}

test('only the three allowlisted public IDs are inlined and private bindings never enter Vite defines', t => {
  const defines = configDefines(t);
  assert.deepEqual(Object.keys(defines).sort(), Object.keys(expectedIds).map(name => `import.meta.env.${name}`).sort());
  assert.ok(!JSON.stringify(defines).includes('private-test-sentinel'));
  assert.ok(!JSON.stringify(defines).includes('G-7K17R4CWQ7'));
});
