import {readFileSync,writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {parse} from 'parse5';
import {inspect as metadata} from './audit-step2.mjs';
import {inspect,attr,txt} from './audit-step3.mjs';
export const path='/services/erp-software/';
export function validateERP(html){
 const m=metadata(html),p=inspect(html,'https://kpinfo.tech'+path),errors=[];
 const check=(v,s)=>{if(!v)errors.push(s);};
 check(JSON.stringify(m.titles)===JSON.stringify(['Odoo ERP Implementation Services | KP Infotech']),'approved title');
 check(JSON.stringify(m.descriptions)===JSON.stringify(['Implement, customize, migrate and integrate Odoo ERP across sales, inventory, manufacturing, finance and operations with KP Infotech.']),'approved description');
 check(JSON.stringify(m.canonicals)===JSON.stringify(['https://kpinfo.tech'+path]),'self canonical');
 check(!m.noindex,'indexability');check(JSON.stringify(m.h1)===JSON.stringify(['Odoo ERP Implementation & Customization Services']),'H1');
 const nodes=[];function walk(n){nodes.push(n);for(const c of n.childNodes||[])walk(c);}walk(parse(html));
 const hasClass=(n,k)=>(attr(n,'class')||'').split(' ').includes(k);
 const faq=nodes.filter(n=>hasClass(n,'faq-item')).map(n=>{const all=[];function w(v){all.push(v);for(const c of v.childNodes||[])w(c);}w(n);return{question:txt(all.find(v=>hasClass(v,'faq-item__question'))),answer:txt(all.find(v=>hasClass(v,'faq-item__answer')))};});
 const schemas=m.schemas.flatMap(s=>s['@graph']||[s]);const service=schemas.find(s=>s['@type']==='Service'),f=schemas.find(s=>s['@type']==='FAQPage');
 check(service?.name===m.h1[0]&&service?.url===m.canonicals[0]&&service?.description===m.descriptions[0]&&service?.areaServed==='Worldwide','Service schema');
 check(schemas.some(s=>s['@type']==='Organization')&&schemas.some(s=>s['@type']==='BreadcrumbList'),'entity and breadcrumb');
 check(!schemas.some(s=>['Review','AggregateRating'].includes(s['@type']))&&!service?.aggregateRating,'no unsupported review');
 check(faq.length===9&&new Set(faq.map(f=>f.question)).size===9,'nine unique FAQs');
 check(JSON.stringify(f?.mainEntity.map(q=>({question:q.name,answer:q.acceptedAnswer.text})))===JSON.stringify(faq),'visible FAQ equals schema');
 const body=txt(nodes.find(n=>n.tagName==='main')||nodes.find(n=>n.tagName==='body'));
 check(!/\b(certified|official Odoo|Odoo partner|zero downtime|zero data loss|24\/7|#1 Odoo)\b/i.test(body),'unsupported claims');
 for(const text of ['Who Odoo is a good fit for','Configuration vs customization vs custom software','Data migration and validation','Odoo integration with existing systems','Testing, UAT and go-live','Support after implementation','What your team needs to provide','Implementation cost and deployment choices','reconcile','acceptance criteria'])check(body.includes(text),'buyer coverage: '+text);
 for(const href of ['/insights/erp-implementation-cost/','/insights/how-to-choose-erp-system/','/insights/on-premise-vs-cloud-erp/','/services/custom-software-development/','/contact/'])check(p.links.some(l=>l.href===href),'link '+href);
 check(p.hierarchy.length===0&&p.duplicateIds.length===0&&p.emptyButtons===0&&p.schemaErrors.length===0,'semantics');
 return{errors,faqCount:faq.length,wordCount:body.split(/\s+/).length,h1:m.h1[0],title:m.titles[0]};
}
if(process.argv[1]===fileURLToPath(import.meta.url)){
 const origin=process.argv.find(a=>a.startsWith('--origin='))?.slice(9),output=process.argv.find(a=>a.startsWith('--output='))?.slice(9);let html,status=200,robots='';
 if(origin){const r=await fetch(origin+path,{redirect:'manual'});html=await r.text();status=r.status;robots=r.headers.get('x-robots-tag')||'';}else html=readFileSync('dist/client'+path+'index.html','utf8');
 const result={timestamp:new Date().toISOString(),origin:origin||'build',status,...validateERP(html)};if(status!==200||/noindex/i.test(robots))result.errors.push('HTTP/indexability');
 if(output)writeFileSync(output,JSON.stringify(result,null,2)+'\n');console.log(result);if(result.errors.length)process.exitCode=1;
}
