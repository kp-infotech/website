import {readFileSync,writeFileSync} from 'node:fs';import {fileURLToPath} from 'node:url';import {parse} from 'parse5';
import {inspect as metadata} from './audit-step2.mjs';import {inspect,attr,txt} from './audit-step3.mjs';
export const path='/services/business-automation/';
export function validateAutomation(html){
 const m=metadata(html),p=inspect(html,'https://kpinfo.tech'+path),errors=[];const check=(v,s)=>{if(!v)errors.push(s);};
 check(JSON.stringify(m.titles)===JSON.stringify(['Business Process Automation Services | KP Infotech']),'approved title');
 check(JSON.stringify(m.descriptions)===JSON.stringify(['Automate workflows, approvals, reporting, documents and system handoffs with practical business automation built around your operations.']),'approved description');
 check(JSON.stringify(m.canonicals)===JSON.stringify(['https://kpinfo.tech'+path]),'canonical');check(!m.noindex,'indexability');
 check(JSON.stringify(m.h1)===JSON.stringify(['Business Process Automation Services']),'H1');
 const nodes=[];function walk(n){nodes.push(n);for(const c of n.childNodes||[])walk(c);}walk(parse(html));const has=(n,k)=>(attr(n,'class')||'').split(' ').includes(k);
 const faqs=nodes.filter(n=>has(n,'faq-item')).map(n=>{const a=[];function w(n){a.push(n);for(const c of n.childNodes||[])w(c);}w(n);return{question:txt(a.find(n=>has(n,'faq-item__question'))),answer:txt(a.find(n=>has(n,'faq-item__answer')))};});
 const schemas=m.schemas.flatMap(s=>s['@graph']||[s]),service=schemas.find(s=>s['@type']==='Service'),faq=schemas.find(s=>s['@type']==='FAQPage');
 check(service?.name===m.h1[0]&&service?.description===m.descriptions[0]&&service?.url===m.canonicals[0]&&service?.areaServed==='Worldwide','Service schema');
 check(schemas.some(s=>s['@type']==='Organization')&&schemas.some(s=>s['@type']==='BreadcrumbList'),'Organization/Breadcrumb');
 check(!schemas.some(s=>['Review','AggregateRating'].includes(s['@type']))&&!service?.aggregateRating,'no invented review');
 check(faqs.length===9&&new Set(faqs.map(f=>f.question)).size===9,'nine unique FAQs');
 check(JSON.stringify(faq?.mainEntity.map(q=>({question:q.name,answer:q.acceptedAnswer.text})))===JSON.stringify(faqs),'FAQ equality');
 const body=txt(nodes.find(n=>n.tagName==='main')||nodes.find(n=>n.tagName==='body'));
 for(const text of ['When business automation is a good fit','What our business process automation services include','Operational workflows we automate','How a cross-system workflow works','Connecting your existing systems','Human approvals, access and exception handling','Automation, custom software, Odoo or AI?','Testing, rollout and handover','What your team needs to provide','Measuring value and planning cost','Support after launch','acceptance criteria','illustrative workflow'])check(body.includes(text),'coverage '+text);
 check(!/\b(best automation company|#1 workflow automation|leading BPA provider|certified|guaranteed savings|zero errors|zero downtime)\b/i.test(body),'unsupported claims');
 for(const href of ['/insights/business-process-improvement-methods/','/insights/business-process-automation-tools/','/contact/'])check(p.links.some(l=>l.href===href),'link '+href);
 check(!p.links.some(l=>l.href?.startsWith('/work/')&&l.href!=='/work/'),'no unrelated proof links');
 check(p.hierarchy.length===0&&p.duplicateIds.length===0&&p.emptyButtons===0&&p.schemaErrors.length===0,'semantics');
 return{errors,faqCount:faqs.length,h1:m.h1[0],title:m.titles[0],wordCount:body.split(/\s+/).length};
}
if(process.argv[1]===fileURLToPath(import.meta.url)){
 const origin=process.argv.find(a=>a.startsWith('--origin='))?.slice(9),output=process.argv.find(a=>a.startsWith('--output='))?.slice(9);let html,status=200,robots='';
 if(origin){const r=await fetch(origin+path,{redirect:'manual'});html=await r.text();status=r.status;robots=r.headers.get('x-robots-tag')||'';}else html=readFileSync('dist/client'+path+'index.html','utf8');
 const r={timestamp:new Date().toISOString(),origin:origin||'build',status,...validateAutomation(html)};if(status!==200||/noindex/i.test(robots))r.errors.push('HTTP/indexability');if(output)writeFileSync(output,JSON.stringify(r,null,2)+'\n');console.log(r);if(r.errors.length)process.exitCode=1;
}
