import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {validateERP,path} from '../scripts/seo/audit-step7a.mjs';
const read=p=>JSON.parse(readFileSync(p));
test('ERP rendered commercial content, metadata, schema, FAQs and links',()=>assert.deepEqual(validateERP(readFileSync('dist/client'+path+'index.html','utf8')).errors,[]));
test('ERP mutation preserves metadata, URL, platform list, modules and Step 4 resources',()=>{
 const b=read('docs/seo-review/step-7a-evidence/erp-before.json'),a=read('docs/seo-review/step-7a-evidence/erp-after.json'),u=read('scripts/sanity/step-7a-erp.json');
 for(const k of Object.keys(b))if(!['_rev','_updatedAt','_system',...Object.keys(u.set)].includes(k))assert.deepEqual(a[k],b[k],k);
 assert.deepEqual(a.content.find(b=>b._key==='step4resources'),b.content.find(b=>b._key==='step4resources'));
 for(const module of b.content.slice(4,11))assert.deepEqual(a.content.find(b=>b._key===module._key),module);
 assert.deepEqual(a.process.map(p=>p.title),b.process.map(p=>p.title));assert(a.process.every(p=>!p.duration&&p.deliverables.length===3));
});
test('AI retains its existing service scope',()=>{
 for(const slug of ['ai-automation-agents']){
 const html=readFileSync('dist/client/services/'+slug+'/index.html','utf8');const schemas=[...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs)].flatMap(m=>{const s=JSON.parse(m[1]);return s['@graph']||[s];});
 assert.deepEqual(schemas.find(s=>s['@type']==='Service').areaServed,{'@type':'Country',name:'India'});
 }
});
test('ERP audit detects FAQ and claim regressions',()=>{
 const html=readFileSync('dist/client'+path+'index.html','utf8');assert(validateERP(html.replace('What happens after go-live?','Unexpected question')).errors.includes('visible FAQ equals schema'));
 assert(validateERP(html.replace('</main>','<p>Official Odoo partner</p></main>')).errors.includes('unsupported claims'));
});
