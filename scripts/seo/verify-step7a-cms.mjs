import {createClient} from '@sanity/client';import {readFileSync,writeFileSync} from 'node:fs';import assert from 'node:assert/strict';
const c=createClient({projectId:'5rux0mv2',dataset:'production',apiVersion:'2024-01-01',useCdn:false,token:process.env.SANITY_API_TOKEN});
const before=JSON.parse(readFileSync('/private/tmp/kp-step7a-cms-before.json')).filter(d=>['service','blogPost','caseStudy','industry','siteSettings','aboutPage'].includes(d._type));
const batch=JSON.parse(readFileSync('scripts/sanity/step-7a-erp.json'));const after=await c.getDocuments(before.map(d=>d._id));
for(const b of before){const a=after.find(d=>d?._id===b._id),e=structuredClone(b);if(b._id===batch.id)Object.assign(e,batch.set);for(const k of ['_rev','_updatedAt','_system']){delete e[k];delete a[k];}assert.deepEqual(a,e,'Unexpected CMS edit '+b._id);}
const r={timestamp:new Date().toISOString(),documents:after.length,changedDocuments:1,errors:[]};writeFileSync('docs/seo-review/step-7a-evidence/cms-verification.json',JSON.stringify(r,null,2));console.log(r);
