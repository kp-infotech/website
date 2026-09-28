import {readFileSync,writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {inspect as metadata} from './audit-step2.mjs';
import {inspect as semantics} from './audit-step3.mjs';
const plan=JSON.parse(readFileSync(new URL('../../docs/seo-review/step-9b-evidence/patch-plan.json',import.meta.url)));
const removed=JSON.parse(readFileSync(new URL('../../tests/fixtures/step-9b-removed-proof.json',import.meta.url)));
const ledger=JSON.parse(readFileSync(new URL('../../docs/seo-review/step-9b-evidence/claim-remediation.json',import.meta.url)));
export const cases=plan.filter(p=>p.set.presentationType==='technicalOverview');
export function validateProof(html,path){
 const errors=[];const check=(ok,m)=>{if(!ok)errors.push(path+': '+m)};const m=metadata(html.replace(/<style\b[^]*?<\/style>/gi,''));const s=semantics(html,'https://kpinfo.tech'+path);
 // Certification concepts in educational articles are not client attestations.
 if(!path.startsWith('/insights/')) for(const pattern of [/SOC 2 Type II certification/i,/PCI DSS Level 1/i,/Best Digital Banking Experience/i,/\$12M Series A/i,/instant transfers to any U\.S\. bank/i])check(!pattern.test(html),'removed proof assertion '+pattern.source);
 for(const pattern of [/\$(?:17K|2\.8K|14\.2K|204K|33\.6K|17,000|2,800)\b/i,/WorkFlow \(SaaS Startup\)/,/Community Trust Credit Union/,/TrendStyle/,/LuxeHomes/,/Mark L\b/,/Grace O\b/,/Daniel T\b/,/Lucas M\b/,/Ahmed K\b/,/Herve F\b/])check(!pattern.test(html),'removed claim '+pattern.source);
 check(!html.includes(removed.oldCloudImageHash),'claim-bearing cloud image');
 for(const quote of removed.quotes)check(!m.body.includes(quote),'unverified testimonial text');
 const normalized=(m.body+' '+JSON.stringify(m.schemas)+' '+JSON.stringify(m.meta)).replace(/\s+/g,' ');
 for(const row of ledger.filter(r=>new URL(r.url).pathname===path&&r.action==='REMOVE / REPLACE'))check(!normalized.includes(row.old_wording.replace(/\s+/g,' ')),'removed occurrence '+row.claim_id);
 const c=cases.find(c=>path==='/work/'+c.slug+'/');
 if(c){check(m.titles[0]===c.set.seoTitle,'clean title');check(m.descriptions[0]===c.set.seoDescription,'clean description');check(m.h1.length===1&&m.h1[0]===c.set.title,'one correct H1');check(m.canonicals.length===1&&m.canonicals[0]==='https://kpinfo.tech'+path,'canonical');check(!m.noindex,'indexable');check(m.body.includes('Technical Overview'),'classification');check(!/\$\s*\d|\b\d[\d,.]*\s*%|\b(?:25K|85K|420%|340%|462\.5%|45M|180M|3\.2M|98%|99\.97%)\b/.test(m.body),'no hard outcome metrics');check(!/class="(?:results-strip|project-testimonial)(?:[ "])/.test(html),'no result/testimonial strips');check(!/case-hero__meta[^]*?\b20(?:23|24|25)\b[^]*?<\/div>/.test(html.split('case-hero__tags')[0]),'no delivery year');const cw=m.schemas.flatMap(n=>n['@graph']||[n]).find(n=>n['@type']==='CreativeWork');check(cw?.description===c.set.seoDescription&&cw?.headline===c.set.title,'matching CreativeWork');check(cw&&!cw.client&&!cw.dateCreated&&!cw.datePublished&&!cw.award&&!cw.aggregateRating,'no unsupported entity/date/attestation');for(const k of ['og','twitter'])check(m.meta[k+':description']===c.set.seoDescription,'social description '+k);check(!s.hierarchy.length&&!s.schemaErrors.length&&!s.duplicateIds.length&&!s.emptyButtons,'semantics');}
 if(path==='/'){check(!/class="(?:stats-section|testimonials)/.test(html),'no public proof sections');for(const t of ['Projects Delivered','Countries Served','Years Combined Experience','Client Satisfaction'])check(!m.body.includes(t),'removed homepage stat '+t);}
 if(path==='/industries/finance/')check(!/PCI DSS compliant|SOC 2 ready|compliance-ready|highest standards/i.test(m.body),'finance assurances');
 if(path==='/industries/healthcare/')check(!/HIPAA-aware|HIPAA-ready|Compliant Data Architecture/i.test(m.body),'healthcare assurances');
 if(path==='/industries/startups/')check(!/Launch in 6[–-]8 weeks/i.test(m.body),'fixed launch promise');
 return errors;
}
export async function audit(origin){const sm=origin?await fetch(origin+'/sitemap-0.xml').then(r=>r.text()):readFileSync('dist/client/sitemap-0.xml','utf8');const urls=[...sm.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);const errors=[];if(urls.length!==56)errors.push('Expected 56 sitemap URLs');const pages=[];for(const url of urls){const path=new URL(url).pathname;let html,status=200,robots='';if(origin){const r=await fetch(origin+path,{redirect:'manual'});html=await r.text();status=r.status;robots=r.headers.get('x-robots-tag')||'';}else html=readFileSync('dist/client'+path+'index.html','utf8');const issues=validateProof(html,path);if(status!==200||/noindex/i.test(robots))issues.push(path+': HTTP/indexability');errors.push(...issues);pages.push({url,status,errors:issues});}return{timestamp:new Date().toISOString(),origin:origin||'build',pages,errors};}
if(process.argv[1]===fileURLToPath(import.meta.url)){const origin=process.argv.find(a=>a.startsWith('--origin='))?.slice(9),output=process.argv.find(a=>a.startsWith('--output='))?.slice(9);const r=await audit(origin);if(output)writeFileSync(output,JSON.stringify(r,null,2)+'\n');console.log(JSON.stringify({pages:r.pages.length,errors:r.errors}));if(r.errors.length)process.exitCode=1;}
