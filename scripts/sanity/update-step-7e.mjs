import {createClient} from '@sanity/client';
import {readFileSync,writeFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const apply=process.argv.includes('--apply');
assert(process.argv.slice(2).every(a=>['--apply','--dry-run'].includes(a)));
assert(process.env.SANITY_API_TOKEN,'Authenticated token required');
const c=createClient({projectId:'5rux0mv2',dataset:'production',apiVersion:'2024-01-01',useCdn:false,token:process.env.SANITY_API_TOKEN});
const batch=JSON.parse(readFileSync('scripts/sanity/step-7e-ai.json'));
const before=JSON.parse(readFileSync('docs/seo-review/step-7e-evidence/ai-before.json'));
const current=await c.getDocument(batch.id);
assert.deepEqual(current,before,'CMS changed since snapshot; stop and re-audit');
assert.equal(current._rev,batch.revision);assert.equal(current.slug.current,'ai-automation-agents');
assert.deepEqual(Object.keys(batch.set).sort(),['title','excerpt','contentHeading','content','process','faqs','serviceArea','workHeading'].sort());
assert.deepEqual(batch.set.content.find(b=>b._key==='step4resources'),before.content.find(b=>b._key==='step4resources'));
console.log({mode:apply?'apply':'dry-run',documents:1,fields:Object.keys(batch.set)});
if(apply){
 const after=await c.patch(batch.id).ifRevisionId(batch.revision).set(batch.set).commit({tag:'seo.step7e.ai'});
 const expected={...before,...batch.set};
 for(const k of ['_rev','_updatedAt','_system']){delete expected[k];}
 const actual=structuredClone(after);for(const k of ['_rev','_updatedAt','_system'])delete actual[k];
 assert.deepEqual(actual,expected,'Unexpected CMS change');
 writeFileSync('docs/seo-review/step-7e-evidence/ai-after.json',JSON.stringify(after,null,2)+'\n');
 console.log({verified:true,revision:after._rev,timestamp:after._updatedAt});
}
