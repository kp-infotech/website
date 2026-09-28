import {readFileSync,writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {parse} from 'parse5';
import {inspect as metadata} from './audit-step2.mjs';
import {attr,txt} from './audit-step3.mjs';
import {overviewDescriptors} from '../../src/lib/proof-governance.js';
export function governanceOutputErrors(html,path){
 const errors=[];const check=(ok,message)=>{if(!ok)errors.push(path+': '+message)};
 const nodes=[];function walk(n){nodes.push(n);for(const c of n.childNodes||[])walk(c)}walk(parse(html));
 const has=(n,c)=>(attr(n,'class')||'').split(' ').includes(c);
 const m=metadata(html);const text=txt(nodes.find(n=>n.tagName==='body'));
 check(!/publicProofType|evidenceStatus|publicationPermission|projectDateReviewed|testimonialReviewed|resultsSummaryReviewed|"reviewStatus"/.test(html),'no governance properties leaked');
 const slug=path.split('/')[2];
 if(path.startsWith('/work/')&&overviewDescriptors[slug]){
  const cw=m.schemas.flatMap(s=>s['@graph']||[s]).find(s=>s['@type']==='CreativeWork');
  check(text.includes('TECHNICAL OVERVIEW')||text.includes('Technical Overview'),'Technical Overview label');
  check(!nodes.some(n=>has(n,'results-strip')||has(n,'project-testimonial')),'no result/quote section');
  const meta=nodes.filter(n=>has(n,'case-hero__meta')).map(txt).join(' ');
  check(!/\b\d{4}\b/.test(meta),'no delivery year');check(meta===overviewDescriptors[slug],'approved anonymous descriptor');
  check(cw&&!cw.client&&!cw.dateCreated&&!cw.datePublished&&!cw.award&&!cw.review&&!cw.aggregateRating,'no client/date/result attestation schema');
  check(!m.schemas.flatMap(s=>s['@graph']||[s]).some(s=>['Review','AggregateRating'].includes(s['@type'])),'no review/rating schema');
 }
 return errors;
}
export async function auditGovernance(origin){
 const sm=origin?await fetch(origin+'/sitemap-0.xml').then(r=>r.text()):readFileSync('dist/client/sitemap-0.xml','utf8');const paths=[...sm.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>new URL(m[1]).pathname);const errors=[];if(paths.length!==56)errors.push('56 sitemap paths required');const pages=[];
 for(const path of paths){let html,status=200;if(origin){const r=await fetch(origin+path,{redirect:'manual'});html=await r.text();status=r.status;}else html=readFileSync('dist/client'+path+'index.html','utf8');const issues=governanceOutputErrors(html,path);if(status!==200)issues.push('HTTP '+status);errors.push(...issues);pages.push({path,status,errors:issues});}return{timestamp:new Date().toISOString(),origin:origin||'build',pages,errors};
}
if(process.argv[1]===fileURLToPath(import.meta.url)){const origin=process.argv.find(x=>x.startsWith('--origin='))?.slice(9);const output=process.argv.find(x=>x.startsWith('--output='))?.slice(9);const r=await auditGovernance(origin);if(output)writeFileSync(output,JSON.stringify(r,null,2));console.log(JSON.stringify({pages:r.pages.length,errors:r.errors}));if(r.errors.length)process.exitCode=1;}
