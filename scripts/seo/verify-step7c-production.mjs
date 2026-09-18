import fs from 'node:fs';import {inspect} from './audit-step3.mjs';import {inspect as metadata} from './audit-step2.mjs';
const dir='docs/seo-review/step-7c-evidence/';const baseline=JSON.parse(fs.readFileSync('docs/seo-review/step-3-evidence/metadata-baseline.json'));const built=baseline.map(b=>inspect(fs.readFileSync('dist/client'+new URL(b.url).pathname+'index.html','utf8'),b.url));const pages=[];const raw=[];const errors=[];let cursor=0;
await Promise.all(Array.from({length:5},async()=>{while(cursor<baseline.length){const b=baseline[cursor++];const r=await fetch(b.url,{redirect:'manual',signal:AbortSignal.timeout(25000)});const html=await r.text();raw.push({url:b.url,status:r.status,html});const p={...inspect(html,b.url),status:r.status,robotsHeader:r.headers.get('x-robots-tag')};const m=metadata(html),expected=built.find(p=>p.url===b.url);
if(r.status!==200||p.noindex||/noindex/i.test(p.robotsHeader||''))errors.push(b.url+' HTTP/indexability');
for(const key of ['titles','descriptions','canonicals','meta'])if(JSON.stringify(m[key])!==JSON.stringify(b[key]))errors.push(b.url+' metadata '+key);
for(const key of ['headings','images','tables','columnHeaders','links'])if(JSON.stringify(p[key])!==JSON.stringify(expected[key]))errors.push(b.url+' build mismatch '+key);
if(p.h1.length!==1||p.hierarchy.length||p.images.some(i=>i.alt===null)||p.duplicateIds.length||p.emptyButtons||p.schemaErrors.length)errors.push(b.url+' semantic checks');
if(/cleaned-up version of your article|SEO-ready version of your article|Here is the rewritten section/.test(p.bodyText))errors.push(b.url+' artifact');
if(b.url.endsWith('/about/')&&(!html.includes('Odoo ERP Services')||/Official Odoo implementation|certified expertise/.test(html)))errors.push('Odoo wording');pages.push(p);
}}));pages.sort((a,b)=>a.url.localeCompare(b.url));fs.writeFileSync(dir+'production.json',JSON.stringify({timestamp:new Date().toISOString(),pages,errors},null,2));console.log({pages:pages.length,errors});if(errors.length)process.exitCode=1;

fs.writeFileSync('/private/tmp/kp-step7c-live-after.json',JSON.stringify(raw));
