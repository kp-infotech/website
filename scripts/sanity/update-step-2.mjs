// Step 2 only: exact field/value guards plus revision locks; no document replacement.
import {createClient} from '@sanity/client';
import {readFileSync,writeFileSync} from 'node:fs';
const apply=process.argv.includes('--apply');
if(process.argv.slice(2).some(a=>!['--apply','--dry-run'].includes(a)))throw Error('Unsupported argument');
const batch=JSON.parse(readFileSync(new URL('./step-2-batch.json',import.meta.url)));
if(batch.projectId!=='5rux0mv2'||batch.dataset!=='production')throw Error('Unexpected CMS target');
const token=process.env.SANITY_WRITE_TOKEN||process.env.SANITY_API_TOKEN;
if(!token)throw Error('Authenticated Sanity token required');
const c=createClient({projectId:batch.projectId,dataset:batch.dataset,apiVersion:'2024-01-01',perspective:'published',useCdn:false,token});
let tx=c.transaction();const changes=[];
for(const u of batch.updates){
 const allowed=u.type==='service'?['seoTitle','seoDescription']:u.type==='siteSettings'?['siteTagline']:[];
 if(Object.keys(u.fields).some(k=>!allowed.includes(k)))throw Error('Disallowed field');
 const d=await c.getDocument(u.id);if(!d||d._type!==u.type)throw Error('Missing or mismatched document '+u.id);
 const set={};for(const [field,v]of Object.entries(u.fields)){
  if(d[field]===v.after)continue;
  if(d[field]!==v.before||d._rev!==u.revision)throw Error('CMS changed since inventory: '+u.id+'.'+field);
  set[field]=v.after;changes.push({id:u.id,field,before:d[field],after:v.after});
 }
 if(Object.keys(set).length)tx=tx.patch(u.id,p=>p.ifRevisionId(d._rev).set(set));
}
console.log(JSON.stringify({mode:apply?'apply':'dry-run',changes},null,2));
if(apply&&changes.length){const r=await tx.commit({tag:'seo.step2.positioning'});writeFileSync(new URL('../../docs/seo-review/step-2-evidence/cms-apply.json',import.meta.url),JSON.stringify({timestamp:new Date().toISOString(),transactionId:r.transactionId,changes},null,2)+'\n');console.log('Applied guarded transaction '+r.transactionId);}
