import {createClient} from '@sanity/client';
import {readFileSync,writeFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const apply=process.argv.includes('--apply');
assert(process.argv.slice(2).every(a=>['--apply','--dry-run'].includes(a)));
assert(process.env.SANITY_API_TOKEN,'Authenticated token required');
const c=createClient({projectId:'5rux0mv2',dataset:'production',apiVersion:'2024-01-01',useCdn:false,token:process.env.SANITY_API_TOKEN});
const batch=JSON.parse(readFileSync('scripts/sanity/step-4-links-batch.json'));
assert(process.env.STEP4_SNAPSHOT_PATH,'Local snapshot path required');
const snapshots=JSON.parse(readFileSync(process.env.STEP4_SNAPSHOT_PATH));
let tx=c.transaction();
for(const u of batch){
 const d=await c.getDocument(u.id);assert.equal(d._rev,u.revision,'Concurrent edit: '+u.slug);assert.equal(d.slug.current,u.slug);assert.equal(d._type,u.type);
 assert.deepEqual(d,snapshots.find(x=>x._id===u.id));
 for(const [path,value] of Object.entries(u.set)){
  assert(/^(content\[\d+\]|services|relatedWork|relatedServices)$/.test(path),'Disallowed field');
  const detail=u.details.find(x=>x.path===path);assert(detail);assert.deepEqual(detail.after,value);
  const m=/^content\[(\d+)\]$/.exec(path);assert.deepEqual((m?d.content[+m[1]]:d[path])??null,detail.before);
  if(m){assert.equal(value.children.map(x=>x.text||'').join(''),detail.before.children.map(x=>x.text||'').join(''),'Article prose changed');assert.equal(value._key,detail.before._key);assert.equal(value.style,detail.before.style);}
 }
 tx=tx.patch(u.id,p=>{let patch=p.ifRevisionId(u.revision).set(u.set);if(u.append){assert.equal(d._type,'service');assert(!d.content.some(b=>b._key===u.append._key));patch=patch.insert('after','content[-1]',[u.append]);}return patch;});
}
console.log(JSON.stringify({mode:apply?'apply':'dry-run',documents:batch.length}));
if(apply){const r=await tx.commit({tag:'seo.step4.links'});writeFileSync('docs/seo-review/step-4-evidence/cms-apply.json',JSON.stringify({timestamp:new Date().toISOString(),transactionId:r.transactionId,documentIds:batch.map(u=>u.id)},null,2));}
