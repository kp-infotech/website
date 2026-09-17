import {createClient} from '@sanity/client';import {readFileSync,writeFileSync} from 'node:fs';
const apply=process.argv.includes('--apply');if(process.argv.slice(2).some(a=>!['--apply','--dry-run'].includes(a)))throw Error('Unsupported argument');
const token=process.env.SANITY_API_TOKEN;if(!token)throw Error('Authenticated token required');
const c=createClient({projectId:'5rux0mv2',dataset:'production',apiVersion:'2024-01-01',perspective:'published',useCdn:false,token});
const changes=JSON.parse(readFileSync(new URL('./step-3-links-batch.json',import.meta.url)));let tx=c.transaction();
for(const u of changes){const d=await c.getDocument(u.id);if(d?._type!=='blogPost'||d._rev!==u.revision||d.slug.current!==u.slug)throw Error('CMS revision changed');for(const x of u.details){const m=/^content\[(\d+)\](?:\.children\[(\d+)\]\.text)?$/.exec(x.path);if(!m)throw Error('Disallowed path');const value=m[2]===undefined?d.content[+m[1]]:d.content[+m[1]].children[+m[2]].text;if(JSON.stringify(value)!==JSON.stringify(x.before))throw Error('Before value mismatch');}tx=tx.patch(u.id,p=>p.ifRevisionId(u.revision).set(u.set).unset(u.unset));}
console.log({mode:apply?'apply':'dry-run',documents:changes.length,changes:changes.reduce((n,u)=>n+u.details.length,0)});
if(apply){const r=await tx.commit({tag:'seo.step3.links'});writeFileSync(new URL('../../docs/seo-review/step-3-evidence/cms-links-apply.json',import.meta.url),JSON.stringify({timestamp:new Date().toISOString(),transactionId:r.transactionId,changes},null,2));}
