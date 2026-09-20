import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {validateAI,path} from '../scripts/seo/audit-step7e.mjs';import {inspect as metadata} from '../scripts/seo/audit-step2.mjs';
const read=p=>JSON.parse(readFileSync(p));
test('AI fit, bounded actions, evaluation, failure handling, metadata, proof and FAQs',()=>assert.deepEqual(validateAI(readFileSync('dist/client'+path+'index.html','utf8')).errors,[]));
test('AI mutation preserves metadata, references, technology list and process stage identities',()=>{
 const b=read('docs/seo-review/step-7e-evidence/ai-before.json'),a=read('docs/seo-review/step-7e-evidence/ai-after.json'),u=read('scripts/sanity/step-7e-ai.json');
 assert.equal(u.id,b._id);assert.equal(u.revision,b._rev);
 assert.deepEqual(Object.keys(u.set).sort(),['title','excerpt','contentHeading','content','process','faqs','serviceArea','workHeading'].sort());
 for(const k of Object.keys(b))if(!['_rev','_updatedAt','_system',...Object.keys(u.set)].includes(k))assert.deepEqual(a[k],b[k],k);
 assert.deepEqual(a.content.find(b=>b._key==='step4resources'),b.content.find(b=>b._key==='step4resources'));
 assert.deepEqual(a.process.map(p=>[p._key,p.title,p.stepNumber]),b.process.map(p=>[p._key,p.title,p.stepNumber]));assert(a.process.every(p=>!p.duration&&p.deliverables.length===3));
});
test('All five service pillars have authorized Worldwide scope',()=>{
 for(const slug of ['erp-software','business-automation','cloud-devops','custom-software-development','ai-automation-agents']){
 const m=metadata(readFileSync('dist/client/services/'+slug+'/index.html','utf8'));const service=m.schemas.flatMap(s=>s['@graph']||[s]).find(s=>s['@type']==='Service');
 assert.deepEqual(service.areaServed,'Worldwide');
 }
});
test('AI audit rejects FAQ mismatch, autonomy and accuracy guarantees, certifications and generalized metrics',()=>{
 const html=readFileSync('dist/client'+path+'index.html','utf8');
 assert(validateAI(html.replace('What is an AI agent?','Unexpected question')).errors.includes('FAQ equality'));
 for(const claim of ['Unrestricted autonomy','100% extraction accuracy','ISO certified'])assert(validateAI(html.replace('</main>','<p>'+claim+'</p></main>')).errors.includes('unsupported claims'));
 assert(validateAI(html.replace('KP Infotech designs AI-assisted workflows','Save 80%. KP Infotech designs AI-assisted workflows')).errors.includes('no generalized case metrics'));
});
