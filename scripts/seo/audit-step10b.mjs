import {readFileSync,writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {isDeepStrictEqual} from 'node:util';
import {parse} from 'parse5';
import {inspect as metadata} from './audit-step2.mjs';
import {attr,txt} from './audit-step3.mjs';
export const ORG='https://kpinfo.tech/#organization';
export const COMPANY='https://www.linkedin.com/company/kp-info';
export const POOJAN='https://www.linkedin.com/in/poojan-patel34/';
const forbidden=['alternateName','founder','foundingDate','legalName','brand','knowsAbout','award','numberOfEmployees','taxID','vatID','identifier'];
const krupaPaths=['best-hr-software-for-startups','erp-for-retail-stores','kp-infotech-new-website-custom-software-automation-ai'].map(s=>`/insights/${s}/`);
export function pageFacts(html,url){
 const m=metadata(html.replace(/<style\b[^]*?<\/style>/gi,''));const nodes=[];function walk(n){nodes.push(n);for(const c of n.childNodes||[])walk(c);}walk(parse(html));
 const has=(n,c)=>(attr(n,'class')||'').split(' ').includes(c);
 const sections=nodes.filter(n=>has(n,'author-bio'));
 const links=nodes.filter(n=>n.tagName==='a').map(n=>({href:attr(n,'href'),text:txt(n)}));
 return{url,meta:Object.fromEntries(Object.entries(m.meta).filter(([,value])=>value!==undefined)),titles:m.titles,descriptions:m.descriptions,canonicals:m.canonicals,h1:m.h1,noindex:m.noindex,schemas:m.schemas,body:m.body,links,authorText:sections.map(txt).join(' '),authorLinks:sections.flatMap(n=>{const a=[];function w(v){if(v.tagName==='a')a.push(attr(v,'href'));for(const c of v.childNodes||[])w(c);}w(n);return a;}),hero: nodes.filter(n=>has(n,'blog-hero__meta')).map(txt).join(' '),intro:nodes.filter(n=>has(n,'page-hero__description')).map(txt).join(' '),iframes:nodes.filter(n=>n.tagName==='iframe').map(n=>({src:attr(n,'src'),title:attr(n,'title')})),forms:nodes.filter(n=>n.tagName==='form').map(txt)};
}
export function validateFacts(f,before){
 const errors=[];const check=(yes,label)=>{if(!yes)errors.push(label)};const path=new URL(f.url).pathname;
 const nodes=f.schemas.flatMap(s=>s['@graph']||[s]);const orgs=[];function scan(v){if(Array.isArray(v))v.forEach(scan);else if(v&&typeof v==='object'){if(['Organization','LocalBusiness','ProfessionalService','Corporation','Brand'].includes(v['@type']))orgs.push(v);Object.values(v).forEach(scan);}}scan(nodes);
 check(orgs.length===1,'exactly one Organization and no duplicate entity types');const org=orgs[0];check(org?.['@type']==='Organization'&&org?.['@id']===ORG&&org?.name==='KP Infotech'&&org?.url==='https://kpinfo.tech','canonical Organization identity');check(isDeepStrictEqual(org?.sameAs,[COMPANY]),'strict company sameAs');check(!forbidden.some(k=>org?.[k]!==undefined),'no unverified Organization fields');check(isDeepStrictEqual(f.canonicals,[f.url]),'self canonical');check(!f.noindex,'indexable');
 const article=nodes.find(n=>n['@type']==='BlogPosting');
 if(article){check(isDeepStrictEqual(article.mainEntityOfPage,{'@type':'WebPage','@id':f.url}),'article mainEntityOfPage');check(isDeepStrictEqual(article.publisher,{'@id':ORG}),'article publisher');const a=article.author;
 if(krupaPaths.includes(path)){check(a?.['@type']==='Person'&&a.name==='Krupa Joshi','Krupa author preserved');check(!a?.sameAs?.length&&!f.authorLinks.length,'Krupa has no guessed social profile');check(!JSON.stringify(a).includes(POOJAN)&&!f.authorLinks.includes(POOJAN),'Krupa never points to Poojan');}
 else if(a?.name==='Poojan Patel'){check(isDeepStrictEqual(a.sameAs,[POOJAN])&&f.authorLinks.includes(POOJAN),'Poojan LinkedIn retained');}
 else check(isDeepStrictEqual(a,{'@id':ORG})&&!f.authorText,'Organization fallback unchanged');
 }
 if(path==='/contact/'){
 check(!/visit our office|our Ahmedabad office|headquarters|registered office|visit us at|get directions/i.test(f.body+' '+JSON.stringify(f.iframes)),'no visitor office implication');check(f.body.includes('General city map')&&f.body.includes('Ahmedabad, Gujarat, India'),'coarse general location');
 for(const href of ['mailto:info@kpinfo.tech','tel:+918618279004','https://wa.me/918618279004','https://www.instagram.com/kp.infotech/'])check(f.links.some(l=>l.href===href),'contact path retained '+href);
 check(f.forms.length===1&&f.forms[0].includes('Send Message'),'contact form retained');check(!f.links.some(l=>/google.com\/maps/.test(l.href||'')),'no office directions CTA');
 }
 if(/^\/insights\/(?:[23]\/)?$/.test(path)){check(/evaluating, designing and operating business systems/.test(f.intro)&&['custom software','ERP & Odoo','business automation','AI agents','cloud & DevOps'].every(t=>f.intro.includes(t)),'operations Insights introduction');check(!/real-world projects|our experience|expert perspectives|digital innovation|agency/i.test(f.intro),'no unsupported experience in hub intro');}
 if(before){
 for(const k of ['meta','titles','descriptions','canonicals','h1','hero'])check(isDeepStrictEqual(f[k],before[k]),'preserved '+k);
 const expected=structuredClone(before.schemas);function update(v){if(Array.isArray(v))v.forEach(update);else if(v&&typeof v==='object'){if(v['@type']==='Organization')v.sameAs=[COMPANY];if(v['@type']==='BlogPosting'){v.mainEntityOfPage={'@type':'WebPage','@id':f.url};if(v.author?.name==='Krupa Joshi')delete v.author.sameAs;}Object.values(v).forEach(update);}}update(expected);check(isDeepStrictEqual(f.schemas,expected),'only authorized schema changes');
 if(path==='/contact/'){check(isDeepStrictEqual(f.forms,before.forms),'contact form unchanged');check(isDeepStrictEqual(f.iframes.map(i=>i.src),before.iframes.map(i=>i.src)),'map coordinates unchanged');check(f.body.includes('Mon – Fri: 9AM – 6PM IST Sat: 10AM – 2PM IST'),'business hours unchanged');}
 else if(/^\/insights\/(?:[23]\/)?$/.test(path)){const old='Expert perspectives on design, technology, and digital innovation. Practical insights from real-world projects.';check(f.body===before.body.replace(old,f.intro),'only hub introduction changed');}
 else check(f.body===before.body,'visible text preserved');
 }
 return errors;
}
export function auditPages(pages,before=[]){
 const errors=[];const rows=pages.map(p=>{const f=pageFacts(p.html,p.url);const issues=validateFacts(f,before.find(b=>b.url===p.url));if(p.status!==200)issues.push('HTTP '+p.status);if(/noindex/i.test(p.headers?.['x-robots-tag']||''))issues.push('noindex header');errors.push(...issues.map(e=>p.url+': '+e));return{url:p.url,errors:issues,author:f.schemas.flatMap(s=>s['@graph']||[s]).find(s=>s['@type']==='BlogPosting')?.author};});
 const counts={pages:pages.length,articles:rows.filter(r=>r.author).length,krupa:rows.filter(r=>r.author?.name==='Krupa Joshi').length,poojan:rows.filter(r=>r.author?.name==='Poojan Patel').length,organization:rows.filter(r=>r.author?.['@id']===ORG).length};if(!isDeepStrictEqual(counts,{pages:56,articles:21,krupa:3,poojan:12,organization:6}))errors.push('URL/author counts');if(before.length&& !isDeepStrictEqual(pages.map(p=>p.url).sort(),before.map(p=>p.url).sort()))errors.push('sitemap set changed');return{timestamp:new Date().toISOString(),counts,pages:rows,errors};
}
if(process.argv[1]===fileURLToPath(import.meta.url)){
 const [input,output,baseline]=process.argv.slice(2);const pages=input==='build'?[...readFileSync('dist/client/sitemap-0.xml','utf8').matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>({url:m[1],status:200,html:readFileSync('dist/client'+new URL(m[1]).pathname+'index.html','utf8')})):JSON.parse(readFileSync(input));const r=auditPages(pages,baseline?JSON.parse(readFileSync(baseline)):[]);writeFileSync(output,JSON.stringify(r,null,2));console.log(JSON.stringify({counts:r.counts,errors:r.errors}));if(r.errors.length)process.exitCode=1;
}
