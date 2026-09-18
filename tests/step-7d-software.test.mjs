import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {validateSoftware,path} from '../scripts/seo/audit-step7d.mjs';import {inspect as metadata} from '../scripts/seo/audit-step2.mjs';
const read=p=>JSON.parse(readFileSync(p));
test('Custom Software buyer guidance, requirements, UAT, handover, metadata, proof and FAQs',()=>assert.deepEqual(validateSoftware(readFileSync('dist/client'+path+'index.html','utf8')).errors,[]));
test('Custom Software mutation preserves metadata, references, technology list and process stage identities',()=>{
 const b=read('docs/seo-review/step-7d-evidence/software-before.json'),a=read('docs/seo-review/step-7d-evidence/software-after.json'),u=read('scripts/sanity/step-7d-software.json');
 assert.equal(u.id,b._id);assert.equal(u.revision,b._rev);
 assert.deepEqual(Object.keys(u.set).sort(),['title','excerpt','contentHeading','content','process','faqs','serviceArea'].sort());
 for(const k of Object.keys(b))if(!['_rev','_updatedAt','_system',...Object.keys(u.set)].includes(k))assert.deepEqual(a[k],b[k],k);
 assert.deepEqual(a.content.find(b=>b._key==='step4resources'),b.content.find(b=>b._key==='step4resources'));
 assert.deepEqual(a.process.map(p=>[p._key,p.title,p.stepNumber]),b.process.map(p=>[p._key,p.title,p.stepNumber]));assert(a.process.every(p=>!p.duration&&p.deliverables.length===3));
});
test('Custom Software global scope preserves ERP, Automation and Cloud while leaving AI unchanged',()=>{
 for(const slug of ['erp-software','business-automation','cloud-devops','custom-software-development','ai-automation-agents']){
 const m=metadata(readFileSync('dist/client/services/'+slug+'/index.html','utf8'));const service=m.schemas.flatMap(s=>s['@graph']||[s]).find(s=>s['@type']==='Service');
 assert.deepEqual(service.areaServed,slug==='ai-automation-agents'?{'@type':'Country',name:'India'}:'Worldwide');
 }
});
test('Custom Software audit rejects FAQ mismatch, IP guarantees, certifications and generalized metrics',()=>{
 const html=readFileSync('dist/client'+path+'index.html','utf8');
 assert(validateSoftware(html.replace('How are ownership and handover handled?','Unexpected question')).errors.includes('FAQ equality'));
 for(const claim of ['You own 100% of all source code','ISO certified'])assert(validateSoftware(html.replace('</main>','<p>'+claim+'</p></main>')).errors.includes('unsupported claims'));
 assert(validateSoftware(html.replace('KP Infotech designs and builds','Save 80%. KP Infotech designs and builds')).errors.includes('no generalized case metrics'));
});
