import {readFileSync,writeFileSync} from 'node:fs';import {fileURLToPath} from 'node:url';import {parse} from 'parse5';
import {inspect as metadata} from './audit-step2.mjs';import {inspect,attr,txt} from './audit-step3.mjs';
export const path='/services/ai-automation-agents/';
export function validateAI(html){
 const m=metadata(html),p=inspect(html,'https://kpinfo.tech'+path),errors=[];const check=(v,s)=>{if(!v)errors.push(s);};
 check(JSON.stringify(m.titles)===JSON.stringify(['AI Agent Development & Automation Services | KP Infotech']),'approved title');
 check(JSON.stringify(m.descriptions)===JSON.stringify(['Build AI agents and automation for document processing, operational knowledge, task routing and repetitive workflows with human oversight.']),'approved description');
 check(JSON.stringify(m.canonicals)===JSON.stringify(['https://kpinfo.tech'+path]),'canonical');check(!m.noindex,'indexability');
 check(JSON.stringify(m.h1)===JSON.stringify(['AI Agent Development & Automation Services']),'H1');
 const nodes=[];function walk(n){nodes.push(n);for(const c of n.childNodes||[])walk(c);}walk(parse(html));const has=(n,k)=>(attr(n,'class')||'').split(' ').includes(k);
 const faqs=nodes.filter(n=>has(n,'faq-item')).map(n=>{const a=[];function w(n){a.push(n);for(const c of n.childNodes||[])w(c);}w(n);return{question:txt(a.find(n=>has(n,'faq-item__question'))),answer:txt(a.find(n=>has(n,'faq-item__answer')))};});
 const schemas=m.schemas.flatMap(s=>s['@graph']||[s]),service=schemas.find(s=>s['@type']==='Service'),faq=schemas.find(s=>s['@type']==='FAQPage');
 check(service?.name===m.h1[0]&&service?.description===m.descriptions[0]&&service?.url===m.canonicals[0]&&service?.areaServed==='Worldwide','Service schema');
 check(schemas.some(s=>s['@type']==='Organization')&&schemas.some(s=>s['@type']==='BreadcrumbList'),'Organization/Breadcrumb');
 check(!schemas.some(s=>['Review','AggregateRating'].includes(s['@type']))&&!service?.aggregateRating,'no invented review');
 check(faqs.length===10&&new Set(faqs.map(f=>f.question)).size===10,'ten unique FAQs');
 check(JSON.stringify(faq?.mainEntity.map(q=>({question:q.name,answer:q.acceptedAnswer.text})))===JSON.stringify(faqs),'FAQ equality');
 const body=txt(nodes.find(n=>n.tagName==='main')||nodes.find(n=>n.tagName==='body'));
 for(const text of ['When AI is the right fit','Rules-based automation vs AI agents','AI use cases for business operations','Document processing with validation and review','Knowledge assistants and RAG','Tool access and human approvals','Data sources and access decisions','How we evaluate AI workflows','Failure handling and monitoring','How AI fits with your existing systems','What your team provides','Scope, cost and rollout planning','What the related work demonstrates','AI Feature Examples'])check(body.includes(text),'coverage '+text);
 const hero=txt(nodes.find(n=>has(n,'page-hero__description')));
 check(hero.startsWith('KP Infotech designs AI-assisted workflows and bounded AI agents'),'direct answer');
 check(!/\b(best AI agent company|leading AI agent company|autonomous AI experts|unrestricted autonomy|fully autonomous processing|hallucination-free|perfect factual accuracy|SOC 2|ISO certified|HIPAA compliant|GDPR compliant|zero data retention|24\/7 AI monitoring)\b|100%\s+(?:extraction\s+)?accuracy/i.test(body),'unsupported claims');
 for(const text of ['least-necessary permissions','read-only access or proposed actions','sensitive financial or customer changes','revoke access or stop a workflow','regression checks','errors can still occur','source freshness','a decision not to proceed','ordinary search or filters','defined trigger','Business Automation','Custom Software','Odoo-specific integration','Cloud & DevOps','do not demonstrate an evaluated action-taking business agent','Provider settings, hosting architecture and contract terms'])check(body.includes(text==='defined trigger'?'A known trigger':text),'scope '+text);
 for(const href of ['/insights/business-process-automation-tools/','/contact/'])check(p.links.some(l=>l.href===href),'link '+href);
 const proofs=['/work/virtual-tours-ai-listings/','/work/omnichannel-ecommerce-platform/'];
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
 const r={timestamp:new Date().toISOString(),origin:origin||'build',status,...validateAI(html)};if(status!==200||/noindex/i.test(robots))r.errors.push('HTTP/indexability');if(output)writeFileSync(output,JSON.stringify(r,null,2)+'\n');console.log(r);if(r.errors.length)process.exitCode=1;
}
