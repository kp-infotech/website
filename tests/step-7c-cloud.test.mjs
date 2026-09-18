import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {validateCloud,path} from '../scripts/seo/audit-step7c.mjs';import {inspect as metadata} from '../scripts/seo/audit-step2.mjs';
const read=p=>JSON.parse(readFileSync(p));
test('Cloud buyer scope, cost measurement, exact metadata, proof component and FAQ schema',()=>assert.deepEqual(validateCloud(readFileSync('dist/client'+path+'index.html','utf8')).errors,[]));
test('Cloud update preserves unrelated fields, technology list, stage identities and Step 4 references',()=>{
 const b=read('docs/seo-review/step-7c-evidence/cloud-before.json'),a=read('docs/seo-review/step-7c-evidence/cloud-after.json'),u=read('scripts/sanity/step-7c-cloud.json');
 assert.equal(u.id,b._id);assert.equal(u.revision,b._rev);
 assert.deepEqual(Object.keys(u.set).sort(),['title','excerpt','contentHeading','content','process','faqs','workHeading','serviceArea'].sort());
 for(const k of Object.keys(b))if(!['_rev','_updatedAt','_system',...Object.keys(u.set)].includes(k))assert.deepEqual(a[k],b[k],k);
 assert.deepEqual(a.content.find(b=>b._key==='step4resources'),b.content.find(b=>b._key==='step4resources'));
 assert.deepEqual(a.process.map(p=>[p._key,p.title,p.stepNumber]),b.process.map(p=>[p._key,p.title,p.stepNumber]));
 assert(a.process.every(p=>!p.duration&&p.deliverables.length===3));
});
test('Cloud global scope preserves ERP, Automation, Custom Software and AI coverage',()=>{
 for(const slug of ['erp-software','business-automation','cloud-devops','custom-software-development','ai-automation-agents']){
 const m=metadata(readFileSync('dist/client/services/'+slug+'/index.html','utf8'));const service=m.schemas.flatMap(s=>s['@graph']||[s]).find(s=>s['@type']==='Service');
 assert.deepEqual(service.areaServed,['erp-software','business-automation','cloud-devops'].includes(slug)?'Worldwide':{'@type':'Country',name:'India'});
 }
});
test('Cloud audit rejects FAQ mismatches, invented partner claims, generalized savings and lost proof',()=>{
 const html=readFileSync('dist/client'+path+'index.html','utf8');
 assert(validateCloud(html.replace('How do you measure cloud savings?','Unexpected question')).errors.includes('FAQ equality'));
 assert(validateCloud(html.replace('</main>','<p>AWS Partner</p></main>')).errors.includes('unsupported claims'));
 assert(validateCloud(html.replace('KP Infotech designs, deploys','Save 80%. KP Infotech designs, deploys')).errors.includes('no generalized case metrics'));
 assert(validateCloud(html.replace('href="/work/cloud-cost-optimization-industrial-sme/"','href="/work/"')).errors.includes('one existing proof link'));
});
