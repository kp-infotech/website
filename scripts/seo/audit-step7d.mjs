import {readFileSync,writeFileSync} from 'node:fs';import {fileURLToPath} from 'node:url';import {parse} from 'parse5';
import {inspect as metadata} from './audit-step2.mjs';import {inspect,attr,txt} from './audit-step3.mjs';
export const path='/services/custom-software-development/';
export function validateSoftware(html){
 const m=metadata(html),p=inspect(html,'https://kpinfo.tech'+path),errors=[];const check=(v,s)=>{if(!v)errors.push(s);};
 check(JSON.stringify(m.titles)===JSON.stringify(['Custom Software Development Company | KP Infotech']),'approved title');
 check(JSON.stringify(m.descriptions)===JSON.stringify(['Build custom business software, internal tools, portals, SaaS products and integrations that replace manual work and improve operational visibility.']),'approved description');
 check(JSON.stringify(m.canonicals)===JSON.stringify(['https://kpinfo.tech'+path]),'canonical');check(!m.noindex,'indexability');
 check(JSON.stringify(m.h1)===JSON.stringify(['Custom Software Development Services']),'H1');
 const nodes=[];function walk(n){nodes.push(n);for(const c of n.childNodes||[])walk(c);}walk(parse(html));const has=(n,k)=>(attr(n,'class')||'').split(' ').includes(k);
 const faqs=nodes.filter(n=>has(n,'faq-item')).map(n=>{const a=[];function w(n){a.push(n);for(const c of n.childNodes||[])w(c);}w(n);return{question:txt(a.find(n=>has(n,'faq-item__question'))),answer:txt(a.find(n=>has(n,'faq-item__answer')))};});
 const schemas=m.schemas.flatMap(s=>s['@graph']||[s]),service=schemas.find(s=>s['@type']==='Service'),faq=schemas.find(s=>s['@type']==='FAQPage');
 check(service?.name===m.h1[0]&&service?.description===m.descriptions[0]&&service?.url===m.canonicals[0]&&service?.areaServed==='Worldwide','Service schema');
 check(schemas.some(s=>s['@type']==='Organization')&&schemas.some(s=>s['@type']==='BreadcrumbList'),'Organization/Breadcrumb');
 check(!schemas.some(s=>['Review','AggregateRating'].includes(s['@type']))&&!service?.aggregateRating,'no invented review');
 check(faqs.length===10&&new Set(faqs.map(f=>f.question)).size===10,'ten unique FAQs');
 check(JSON.stringify(faq?.mainEntity.map(q=>({question:q.name,answer:q.acceptedAnswer.text})))===JSON.stringify(faqs),'FAQ equality');
 const body=txt(nodes.find(n=>n.tagName==='main')||nodes.find(n=>n.tagName==='body'));
 for(const text of ['When custom software is the right fit','Build, buy, configure or automate?','Types of software we build','Discovery and requirements','Architecture and maintainability','Data and system integrations','Testing and user acceptance','Practical security responsibilities','What your team provides','Scope, cost and delivery planning','Ownership and handover','Support after release','acceptance criteria','system of record','Intellectual-property rights depend on the agreement'])check(body.includes(text),'coverage '+text);
 const hero=txt(nodes.find(n=>has(n,'page-hero__description')));
 check(hero.startsWith('KP Infotech designs and builds custom business software'),'direct answer');
 check(!/\b(best custom software company|top software developers|world.s leading development company|you own (?:100%\s+of\s+)?all source code|guaranteed ROI|100% test coverage|zero defects|SOC 2|HIPAA compliant|PCI compliance|ISO certified|lifetime support|unlimited changes)\b/i.test(body),'unsupported claims');
 for(const text of ['Internal tools and admin systems.','Business applications and operational systems.','Customer, partner and vendor portals.','SaaS products and MVPs.','Application and API integrations.','Web and mobile-friendly interfaces.','Odoo-specific connections','Business Automation','Cloud & DevOps','AI interpretation'])check(body.includes(text),'scope '+text);
 for(const href of ['/insights/what-is-custom-software/','/insights/database-design-best-practices/','/contact/'])check(p.links.some(l=>l.href===href),'link '+href);
 const proofs=['/work/collaboration-platform-distributed-teams/','/work/digital-banking-platform/','/work/omnichannel-ecommerce-platform/'];
 for(const proof of proofs){
 check(p.links.filter(l=>l.href===proof).length===1,'one proof link '+proof);
 check(nodes.some(n=>n.tagName==='a'&&has(n,'work-card')&&attr(n,'href')===proof),'proof card '+proof);
 }
 check(!p.links.some(l=>l.href?.startsWith('/work/')&&!['/work/',...proofs].includes(l.href)),'no unrelated proof');
 const newCopy=[txt(nodes.find(n=>has(n,'service-content'))),hero,...faqs.map(f=>f.question+' '+f.answer)].join(' ');
 check(!/\$\s*[\d,.]+|\b\d+(?:\.\d+)?\s*%/.test(newCopy),'no generalized case metrics');
 check(p.h1.length===1,'one H1');
 check(p.hierarchy.length===0&&p.duplicateIds.length===0&&p.emptyButtons===0&&p.schemaErrors.length===0,'semantics');
 return{errors,faqCount:faqs.length,h1:m.h1[0],title:m.titles[0],wordCount:body.split(/\s+/).length};
}
if(process.argv[1]===fileURLToPath(import.meta.url)){
 const origin=process.argv.find(a=>a.startsWith('--origin='))?.slice(9),output=process.argv.find(a=>a.startsWith('--output='))?.slice(9);let html,status=200,robots='';
 if(origin){const r=await fetch(origin+path,{redirect:'manual'});html=await r.text();status=r.status;robots=r.headers.get('x-robots-tag')||'';}else html=readFileSync('dist/client'+path+'index.html','utf8');
 const r={timestamp:new Date().toISOString(),origin:origin||'build',status,...validateSoftware(html)};if(status!==200||/noindex/i.test(robots))r.errors.push('HTTP/indexability');if(output)writeFileSync(output,JSON.stringify(r,null,2)+'\n');console.log(r);if(r.errors.length)process.exitCode=1;
}
