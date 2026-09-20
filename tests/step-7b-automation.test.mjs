import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {validateAutomation,path} from '../scripts/seo/audit-step7b.mjs';import {inspect as metadata} from '../scripts/seo/audit-step2.mjs';
const read=p=>JSON.parse(readFileSync(p));
test('Business Automation buyer content, exact metadata, schema, FAQs and links',()=>assert.deepEqual(validateAutomation(readFileSync('dist/client'+path+'index.html','utf8')).errors,[]));
test('Business Automation mutation preserves other fields, categories, process stages and educational references',()=>{
 const b=read('docs/seo-review/step-7b-evidence/automation-before.json'),a=read('docs/seo-review/step-7b-evidence/automation-after.json'),u=read('scripts/sanity/step-7b-automation.json');
 for(const k of Object.keys(b))if(!['_rev','_updatedAt','_system',...Object.keys(u.set)].includes(k))assert.deepEqual(a[k],b[k],k);
 assert.deepEqual(a.content.find(b=>b._key==='step4resources'),b.content.find(b=>b._key==='step4resources'));
 for(const category of b.content.slice(3,8))assert.deepEqual(a.content.find(b=>b._key===category._key),category);
 assert.deepEqual(a.process.map(p=>[p._key,p.title,p.stepNumber]),b.process.map(p=>[p._key,p.title,p.stepNumber]));assert(a.process.every(p=>!p.duration&&p.deliverables.length===3));
});
test('CMS service-area override preserves ERP and all other existing service coverage',()=>{
 for(const slug of ['erp-software','custom-software-development','ai-automation-agents','cloud-devops']){
 const m=metadata(readFileSync('dist/client/services/'+slug+'/index.html','utf8'));const service=m.schemas.flatMap(s=>s['@graph']||[s]).find(s=>s['@type']==='Service');
 assert.deepEqual(service.areaServed,'Worldwide');
 }
});
test('Business Automation audit catches FAQ mismatches and unsupported claims',()=>{
 const html=readFileSync('dist/client'+path+'index.html','utf8');assert(validateAutomation(html.replace('Does workflow automation require AI?','Unexpected question')).errors.includes('FAQ equality'));
 assert(validateAutomation(html.replace('</main>','<p>Guaranteed savings</p></main>')).errors.includes('unsupported claims'));
});
