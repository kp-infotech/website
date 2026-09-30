import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createClient} from '@sanity/client';
const dir='docs/seo-review/step-11c-evidence/';
const before=JSON.parse(fs.readFileSync(dir+'cms-before.json'));
const proposed=JSON.parse(fs.readFileSync(dir+'cms-proposed.json'));
const allowed=['blogPost.business-process-improvement-methods','blogPost.how-to-choose-erp-system'];
assert.deepEqual(before.map(d=>d._id).sort(),allowed.toSorted());
assert.deepEqual(proposed.map(d=>d._id).sort(),allowed.toSorted());
for(const old of before){const next=proposed.find(d=>d._id===old._id);assert.deepEqual({...next,content:null},{...old,content:null});assert.notDeepEqual(next.content,old.content);}
if(process.argv[2]!=='--apply') {console.log('Validated: exactly two content-only patches; no mutation.');}
else {
 assert(process.env.SANITY_API_TOKEN,'Authenticated token required');
 const client=createClient({projectId:'5rux0mv2',dataset:'production',apiVersion:'2026-09-28',useCdn:false,token:process.env.SANITY_API_TOKEN});
 let transaction=client.transaction();
 for(const old of before) transaction=transaction.patch(old._id,p=>p.ifRevisionId(old._rev).set({content:proposed.find(d=>d._id===old._id).content}));
 const result=await transaction.commit();
 fs.writeFileSync(dir+'mutation.json',JSON.stringify({timestamp:new Date().toISOString(),transactionId:result.transactionId,documents:allowed,fields:['content'],revisionGuards:before.map(d=>({id:d._id,revision:d._rev}))},null,2)+'\n');
 console.log('Committed two revision-guarded content patches.');
}
