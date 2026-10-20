import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import test from 'node:test';
import vm from 'node:vm';
import { JSDOM } from 'jsdom';
import { createRateLimiter, escapeHtml, getClientIp, json } from '../src/lib/form-utils.ts';

const apiSource = readFileSync(new URL('../src/pages/api/contact.ts', import.meta.url), 'utf8');
const analyticsSource = readFileSync(new URL('../src/lib/analytics.ts', import.meta.url), 'utf8');
const contactSource = readFileSync(new URL('../src/pages/contact.astro', import.meta.url), 'utf8').split('<script>')[1].split('</script>')[0];

function api({ sendFails = false, configured = true, captcha = false, validCaptcha = true } = {}) {
  const sent = [];
  let receipts = 0;
  const env = { EMAIL: configured ? { send: async (message) => {
    if (sendFails) throw new Error('Test send failure');
    sent.push(message);
  } } : undefined, TURNSTILE_SECRET_KEY: captcha ? 'test-secret' : undefined };
  const source = apiSource.replace(/import\s+[\s\S]*?from\s+['"][^'"]+['"];\s*/g, '')
    .replaceAll('export const', 'const').replaceAll('import.meta.env', 'buildEnv');
  const ctx = vm.createContext({ env, buildEnv: {}, getClientIp, createRateLimiter, escapeHtml, json,
    verifyTurnstile: async () => validCaptcha,
    crypto: { randomUUID: () => `00000000-0000-4000-8000-${String(++receipts).padStart(12, '0')}` },
    console: { error() {} },
  });
  vm.runInContext(stripTypeScriptTypes(source) + '\nglobalThis.POST = POST;', ctx);
  const submit = async (data) => ctx.POST({ request: new Request('https://kpinfo.tech/api/contact', {
    method: 'POST', headers: { 'cf-connecting-ip': '192.0.2.1' }, body: new URLSearchParams(data),
  }) });
  return { sent, submit, receipts: () => receipts };
}

const valid = { name: 'Internal unit test', email: 'test@example.invalid', message: 'Automated unit test only', project_type: 'erp', website: '' };

test('API issues a generic receipt only after the send service accepts the enquiry', async () => {
  const service = api();
  const response = await service.submit(valid);
  const body = await response.json();
  assert.equal(response.status, 200);
  assert.equal(body.success, true);
  assert.match(body.submissionId, /^[0-9a-f-]{36}$/);
  assert.equal(service.sent.length, 1);
  assert.equal(service.receipts(), 1);
});

test('honeypot retains the generic success response and never sends or issues a receipt', async () => {
  const service = api();
  for (const website of ['spam.example', '  spam  ']) {
    const response = await service.submit({ ...valid, website });
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { success: true });
  }
  assert.equal(service.sent.length, 0);
  assert.equal(service.receipts(), 0);
});

for (const [name, options, data, status] of [
  ['invalid input', {}, { ...valid, email: 'invalid' }, 400],
  ['send failure', { sendFails: true }, valid, 500],
  ['missing email binding', { configured: false }, valid, 500],
  ['missing CAPTCHA', { captcha: true }, valid, 400],
  ['rejected CAPTCHA', { captcha: true, validCaptcha: false }, { ...valid, 'cf-turnstile-response': 'test-token' }, 400],
]) {
  test(`${name} cannot issue a lead receipt`, async () => {
    const service = api(options);
    const response = await service.submit(data);
    const result = await response.json();
    assert.equal(response.status, status);
    assert.equal(result.success, false);
    assert.equal(result.submissionId, undefined);
    assert.equal(service.receipts(), 0);
    assert.equal(service.sent.length, 0);
  });
}

test('rate-limited submissions cannot issue a receipt', async () => {
  const service = api();
  for (let i = 0; i < 5; i++) assert.equal((await service.submit(valid)).status, 200);
  const response = await service.submit(valid);
  assert.equal(response.status, 429);
  assert.equal((await response.json()).submissionId, undefined);
  assert.equal(service.receipts(), 5);
});

function browser(fetch, hostname = 'kpinfo.tech') {
  const dom = new JSDOM(`<!doctype html><body>
    <form id="contact-form"><input name="name" value="Internal unit test"><input name="email" value="test@example.invalid">
      <textarea name="message">Automated unit test only</textarea><input name="website" value="">
      <select name="project_type" id="project-type"><option value="erp">ERP</option></select>
      <button class="form-submit" type="submit"><span class="form-submit__text">Send Message</span></button>
    </form><p id="contact-status" role="status"></p></body>`, {
    url: `https://${hostname}/contact/`, runScripts: 'outside-only',
  });
  const events = [];
  const timers = [];
  dom.window.gtag = (...args) => events.push(args);
  dom.window.fetch = fetch;
  dom.window.setTimeout = (callback) => { timers.push(callback); };
  vm.runInContext(stripTypeScriptTypes(analyticsSource.replaceAll('export function', 'function')), dom.getInternalVMContext());
  vm.runInContext(stripTypeScriptTypes(contactSource.replace(/^\s*import .*;\s*/m, '')), dom.getInternalVMContext());
  const load = () => dom.window.document.dispatchEvent(new dom.window.Event('astro:page-load'));
  load(); load();
  const submit = () => dom.window.document.getElementById('contact-form').dispatchEvent(new dom.window.Event('submit', { cancelable: true }));
  return { dom, events, timers, load, submit };
}

const settle = () => new Promise((resolve) => setImmediate(resolve));

test('legitimate API acceptance produces one lead despite duplicate submit and page-load events', async () => {
  const service = api();
  let release;
  const blocked = new Promise((resolve) => { release = resolve; });
  let calls = 0;
  const ui = browser(async (_url, { body }) => {
    calls++;
    await blocked;
    return service.submit(Object.fromEntries(body.entries()));
  });
  ui.submit(); ui.submit(); ui.load(); ui.submit();
  assert.equal(calls, 1);
  release(); await settle(); await settle();
  assert.equal(service.sent.length, 1);
  assert.equal(ui.events.length, 1);
  assert.equal(ui.events[0][1], 'generate_lead');
  assert.equal(ui.events[0][2].form_id, 'contact');
  assert.equal(ui.events[0][2].project_type, 'erp');
  ui.submit();
  assert.equal(calls, 1, 'success cooldown still prevents duplicate submit');
  // Replaying the same acknowledgement cannot create a second lead.
  vm.runInContext(`trackContactLead({success:true,submissionId:'00000000-0000-4000-8000-000000000001'},'erp')`, ui.dom.getInternalVMContext());
  assert.equal(ui.events.length, 1);
  // A separate accepted enquiry is allowed after the original success cooldown.
  for (const callback of ui.timers) callback();
  ui.submit(); await settle(); await settle();
  assert.equal(calls, 2);
  assert.equal(service.sent.length, 2);
  assert.equal(ui.events.length, 2);
  ui.dom.window.close();
});

test('browser executes honeypot success UX without recording a lead', async () => {
  const service = api();
  const ui = browser((_url, { body }) => service.submit(Object.fromEntries(body.entries())));
  ui.dom.window.document.querySelector('[name="website"]').value = 'spam.example';
  ui.submit(); await settle(); await settle();
  assert.equal(service.sent.length, 0);
  assert.equal(ui.events.length, 0);
  assert.match(ui.dom.window.document.getElementById('contact-status').textContent, /received/);
  ui.dom.window.close();
});

for (const [name, response] of [
  ['rejected response', () => new Response(JSON.stringify({ success: false }), { status: 500 })],
  ['malformed response', () => new Response('not JSON', { status: 200 })],
  ['network rejection', () => { throw new Error('Network failure'); }],
]) {
  test(`browser ${name} cannot record a lead and allows retry`, async () => {
    const ui = browser(async () => response());
    ui.submit(); await settle(); await settle();
    assert.equal(ui.events.length, 0);
    assert.equal(ui.dom.window.document.querySelector('button').disabled, false);
    ui.dom.window.close();
  });
}

test('preview hosts stay excluded and malformed or unacknowledged success cannot become a lead', () => {
  for (const host of ['kpinfo.tech', 'preview.workers.dev']) {
    const ui = browser(async () => { throw new Error('unused'); }, host);
    vm.runInContext(`for (const result of [null, {}, {success:true}, {success:true,submissionId:''}, {success:false,submissionId:'receipt'}, {success:true,submissionId:42}]) trackContactLead(result);`, ui.dom.getInternalVMContext());
    assert.equal(ui.events.length, 0);
    vm.runInContext(`trackContactLead({success:true,submissionId:'real-acknowledgement'});`, ui.dom.getInternalVMContext());
    assert.equal(ui.events.length, host === 'kpinfo.tech' ? 1 : 0);
    ui.dom.window.close();
  }
});
