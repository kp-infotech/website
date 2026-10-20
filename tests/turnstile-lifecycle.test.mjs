import assert from 'node:assert/strict';
import test from 'node:test';
import { JSDOM } from 'jsdom';
import { initTurnstileLifecycle } from '../src/lib/turnstile-lifecycle.ts';

function setup() {
 const dom=new JSDOM('<body></body>',{url:'https://kpinfo.tech/contact/'});
 const doc=dom.window.document;const renders=[];const removed=[];
 const sdk={ready:()=>{throw new Error("The async Turnstile SDK rejects ready()");},render:node=>{renders.push(node);const field=doc.createElement('input');field.name='cf-turnstile-response';node.appendChild(field);return 'widget-id';},remove:node=>{removed.push(node);node.replaceChildren();}};
 const load=()=>doc.dispatchEvent(new dom.window.Event('astro:page-load'));
 const flush=()=>{};
 const form=mounted=>{doc.body.innerHTML='<form><div class="cf-turnstile" data-sitekey="existing-public-key">'+(mounted?'<input name="cf-turnstile-response">':'')+'</div></form>';return doc.querySelector('.cf-turnstile');};
 const swap=()=>doc.dispatchEvent(new dom.window.Event('astro:before-swap'));
 return {dom,doc,sdk,load,flush,form,renders,removed,swap};
}

test('initial async SDK loading remains owned by its existing implicit renderer',()=>{
 const x=setup();x.form(false);initTurnstileLifecycle(x.doc);x.load();assert.equal(x.renders.length,0);assert.equal(x.doc.scripts.length,0);x.dom.window.close();
});
test('already mounted widget and its response are never replaced or rendered twice',()=>{
 const x=setup();x.dom.window.turnstile=x.sdk;const widget=x.form(true);const response=widget.firstElementChild;response.value='existing-response';initTurnstileLifecycle(x.doc);initTurnstileLifecycle(x.doc);x.load();x.load();x.flush();assert.equal(x.renders.length,0);assert.equal(widget.firstElementChild,response);assert.equal(response.value,'existing-response');x.dom.window.close();
});
test('new contact and application widgets mount once across repeated Astro page-load events',()=>{
 const x=setup();x.dom.window.turnstile=x.sdk;initTurnstileLifecycle(x.doc);
 for(const route of ['contact','careers','contact back','careers forward']) {const widget=x.form(false);x.load();x.load();x.flush();assert.equal(x.renders.at(-1),widget);assert.equal(widget.querySelectorAll('[name="cf-turnstile-response"]').length,1);}
 assert.equal(x.renders.length,4);assert.equal(x.doc.scripts.length,0);x.dom.window.close();
});
test('late SDK availability renders the current page without calling the forbidden async ready API',()=>{
 const x=setup();initTurnstileLifecycle(x.doc);const old=x.form(false);x.load();x.dom.window.turnstile=x.sdk;const current=x.form(false);x.load();x.flush();assert.deepEqual(x.renders,[current]);assert.equal(old.querySelector('[name="cf-turnstile-response"]'),null);x.dom.window.close();
});
test('pages without a form and unanswered forms do not trigger analytics or submit anything',()=>{
 const x=setup();x.dom.window.turnstile=x.sdk;initTurnstileLifecycle(x.doc);x.load();x.flush();assert.equal(x.renders.length,0);x.form(false);x.load();x.flush();assert.equal(x.dom.window.gtag,undefined);assert.equal(x.doc.cookie,'');assert.equal(x.doc.scripts.length,0);x.dom.window.close();
});
test('outgoing implicit and explicit widgets are removed before their DOM is detached',()=>{
 const x=setup();x.dom.window.turnstile=x.sdk;initTurnstileLifecycle(x.doc);initTurnstileLifecycle(x.doc);
 const implicit=x.form(true);x.swap();assert.deepEqual(x.removed,[implicit]);assert.equal(implicit.children.length,0);
 const current=x.form(false);x.load();x.swap();assert.deepEqual(x.removed,[implicit,current]);assert.equal(current.children.length,0);
 x.form(false);x.swap();assert.equal(x.removed.length,2);x.dom.window.close();
});
test('swapping before SDK availability safely leaves initial rendering responsibility unchanged',()=>{
 const x=setup();x.form(false);initTurnstileLifecycle(x.doc);x.swap();assert.equal(x.removed.length,0);assert.equal(x.renders.length,0);x.dom.window.close();
});
