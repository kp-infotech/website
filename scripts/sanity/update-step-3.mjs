import {createClient} from '@sanity/client';
import {readFileSync,writeFileSync} from 'node:fs';
const apply=process.argv.includes('--apply');
if(process.argv.slice(2).some(a=>!['--apply','--dry-run'].includes(a)))throw Error('Unsupported argument');
const batch=JSON.parse(readFileSync(new URL('./step-3-batch.json',import.meta.url)));
if(batch.projectId!=='5rux0mv2'||batch.dataset!=='production')throw Error('Unexpected CMS target');
const token=process.env.SANITY_WRITE_TOKEN||process.env.SANITY_API_TOKEN;
if(!token)throw Error('Authenticated token required');
const c=createClient({...batch,updates:undefined,apiVersion:'2024-01-01',perspective:'published',useCdn:false,token});
let tx=c.transaction();const changes=[];
for(const u of batch.updates){
 const d=await c.getDocument(u.id);
 if(!d||d._type!=='blogPost'||d.slug.current!==u.slug||d._rev!==u.revision)throw Error('CMS changed since inventory: '+u.id);
 for(const r of u.remove)if(JSON.stringify(d.content[r.index])!==JSON.stringify(r.block))throw Error('Block changed');
 // Descending positional unsets also support legacy blocks without _key; revision locks prevent index drift.
 const paths=u.remove.map(r=>r.index).sort((a,b)=>b-a).map(i=>`content[${i}]`);
 tx=tx.patch(u.id,p=>p.ifRevisionId(u.revision).unset(paths));
 changes.push({id:u.id,slug:u.slug,revision:u.revision,removed:u.remove});
}
console.log(JSON.stringify({mode:apply?'apply':'dry-run',documents:changes.length,blocks:changes.reduce((n,c)=>n+c.removed.length,0)}));
if(apply){const r=await tx.commit({tag:'seo.step3.editorial'});writeFileSync(new URL('../../docs/seo-review/step-3-evidence/cms-apply.json',import.meta.url),JSON.stringify({timestamp:new Date().toISOString(),transactionId:r.transactionId,changes},null,2)+'\n');}
