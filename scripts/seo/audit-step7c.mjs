import {readFileSync,writeFileSync} from 'node:fs';import {fileURLToPath} from 'node:url';import {parse} from 'parse5';
import {inspect as metadata} from './audit-step2.mjs';import {inspect,attr,txt} from './audit-step3.mjs';
export const path='/services/cloud-devops/';
export function validateCloud(html){
 const m=metadata(html),p=inspect(html,'https://kpinfo.tech'+path),errors=[];const check=(v,s)=>{if(!v)errors.push(s);};
 check(JSON.stringify(m.titles)===JSON.stringify(['Cloud & DevOps Services | KP Infotech']),'approved title');
 check(JSON.stringify(m.descriptions)===JSON.stringify(['Design reliable cloud infrastructure, CI/CD, monitoring and cost optimization for business systems that need to scale securely and efficiently.']),'approved description');
 check(JSON.stringify(m.canonicals)===JSON.stringify(['https://kpinfo.tech'+path]),'canonical');check(!m.noindex,'indexability');
 check(JSON.stringify(m.h1)===JSON.stringify(['Cloud & DevOps Services']),'H1');
 const nodes=[];function walk(n){nodes.push(n);for(const c of n.childNodes||[])walk(c);}walk(parse(html));const has=(n,k)=>(attr(n,'class')||'').split(' ').includes(k);
 const faqs=nodes.filter(n=>has(n,'faq-item')).map(n=>{const a=[];function w(n){a.push(n);for(const c of n.childNodes||[])w(c);}w(n);return{question:txt(a.find(n=>has(n,'faq-item__question'))),answer:txt(a.find(n=>has(n,'faq-item__answer')))};});
 const schemas=m.schemas.flatMap(s=>s['@graph']||[s]),service=schemas.find(s=>s['@type']==='Service'),faq=schemas.find(s=>s['@type']==='FAQPage');
 check(service?.name===m.h1[0]&&service?.description===m.descriptions[0]&&service?.url===m.canonicals[0]&&service?.areaServed==='Worldwide','Service schema');
 check(schemas.some(s=>s['@type']==='Organization')&&schemas.some(s=>s['@type']==='BreadcrumbList'),'Organization/Breadcrumb');
 check(!schemas.some(s=>['Review','AggregateRating'].includes(s['@type']))&&!service?.aggregateRating,'no invented review');
 check(faqs.length===9&&new Set(faqs.map(f=>f.question)).size===9,'nine unique FAQs');
 check(JSON.stringify(faq?.mainEntity.map(q=>({question:q.name,answer:q.acceptedAnswer.text})))===JSON.stringify(faqs),'FAQ equality');
 const body=txt(nodes.find(n=>n.tagName==='main')||nodes.find(n=>n.tagName==='body'));
 for(const text of ['Who this service is for','Cloud infrastructure and deployment','Cloud migration','CI/CD and infrastructure automation','Monitoring, backups and recovery','Cloud cost optimization','How cost changes are measured','Access and client responsibilities','Support after deployment','Cloud, hosting and application development','acceptance criteria','Restore validation','representative post-change billing period','Cloud Cost Optimization Example'])check(body.includes(text),'coverage '+text);
 const hero=txt(nodes.find(n=>has(n,'page-hero__description')));
 check(hero.startsWith('KP Infotech designs, deploys and improves cloud infrastructure and DevOps workflows'),'direct answer');
 check(!/\b(best DevOps company|certified cloud partner|top AWS company|AWS partner|Azure partner|GCP partner|certified AWS architects|guaranteed savings|zero downtime|no data loss|SOC 2|ISO 27001|FinOps consultancy)\b/i.test(body),'unsupported claims');
 for(const href of ['/insights/devops-best-practices/','/insights/cloud-deployment-models-diagram/','/contact/'])check(p.links.some(l=>l.href===href),'link '+href);
 const proof='/work/cloud-cost-optimization-industrial-sme/';
 check(p.links.filter(l=>l.href===proof).length===1,'one existing proof link');
 check(nodes.some(n=>n.tagName==='a'&&has(n,'work-card')&&attr(n,'href')===proof),'proof uses related-work card');
 check(!p.links.some(l=>l.href?.startsWith('/work/')&&!['/work/',proof].includes(l.href)),'no unrelated proof');
 const newCopy=[txt(nodes.find(n=>has(n,'service-content'))),hero,...faqs.map(f=>f.question+' '+f.answer)].join(' ');
 check(!/\$\s*[\d,.]+|\b\d+(?:\.\d+)?\s*%/.test(newCopy),'no generalized case metrics');
 check(!p.links.some(l=>l.href==='/services/cloud-cost-optimization/'),'no specialist page');
 check(p.hierarchy.length===0&&p.duplicateIds.length===0&&p.emptyButtons===0&&p.schemaErrors.length===0,'semantics');
 return{errors,faqCount:faqs.length,h1:m.h1[0],title:m.titles[0],wordCount:body.split(/\s+/).length};
}
if(process.argv[1]===fileURLToPath(import.meta.url)){
 const origin=process.argv.find(a=>a.startsWith('--origin='))?.slice(9),output=process.argv.find(a=>a.startsWith('--output='))?.slice(9);let html,status=200,robots='';
 if(origin){const r=await fetch(origin+path,{redirect:'manual'});html=await r.text();status=r.status;robots=r.headers.get('x-robots-tag')||'';}else html=readFileSync('dist/client'+path+'index.html','utf8');
 const r={timestamp:new Date().toISOString(),origin:origin||'build',status,...validateCloud(html)};if(status!==200||/noindex/i.test(robots))r.errors.push('HTTP/indexability');if(output)writeFileSync(output,JSON.stringify(r,null,2)+'\n');console.log(r);if(r.errors.length)process.exitCode=1;
}
