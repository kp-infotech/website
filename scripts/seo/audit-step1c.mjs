// Read-only artifact/HTTP checks for the explicitly reviewed Step 1C case-study set.
import {readFileSync, readdirSync, existsSync, writeFileSync} from 'node:fs';
import {join, resolve} from 'node:path';
import {getMigrationRedirectLocation} from '../../src/worker/migration-redirects.js';
const root=resolve(new URL('../../',import.meta.url).pathname);
const dist=join(root,'dist/client');
const decisions=JSON.parse(readFileSync(join(root,'tests/fixtures/step-1c-case-study-decisions.json')));
const originArg=process.argv.find(a=>a.startsWith('--origin='));
const origin=originArg?.slice(9).replace(/\/$/,'');
const output=process.argv.find(a=>a.startsWith('--output='))?.slice(9);
const canonicalOrigin='https://kpinfo.tech';
const errors=[];
const report={checkedAt:new Date().toISOString(),origin:origin??null,errors};
const check=(condition,message)=>{if(!condition) errors.push(message);};
const attrs=tag=>Object.fromEntries([...tag.matchAll(/([^\s=<>/"']+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)].map(m=>[m[1].toLowerCase(),m[2]??m[3]??m[4]]));
const tags=(html,name)=>[...html.matchAll(new RegExp(`<${name}\\b[^>]*>`,'gi'))].map(m=>attrs(m[0]));
const links=html=>tags(html,'a').filter(a=>a.href).map(a=>a.href);
const locs=xml=>[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1].replaceAll('&amp;','&'));
const read=path=>readFileSync(path,'utf8');
const htmlPath=path=>join(dist,path.replace(/^\//,''),'index.html');
const expected=decisions.activePublishedSlugs.map(s=>`/work/${s}/`).sort();
const removed=decisions.removedCaseStudySlugs.map(s=>`/work/${s}/`);
const index=read(join(dist,'sitemap-index.xml'));
const sitemapFiles=locs(index);
check(sitemapFiles.length>0,'sitemap index has no children');
const urls=sitemapFiles.flatMap(url=>{
 const u=new URL(url);check(u.origin===canonicalOrigin,'noncanonical sitemap child '+url);
 const file=join(dist,u.pathname.replace(/^\//,''));check(existsSync(file),'missing sitemap child '+url);
 return existsSync(file)?locs(read(file)):[];
});
check(new Set(urls).size===urls.length,'duplicate sitemap URLs');
function validateHtml(html,path,label){
 const canonical=tags(html,'link').filter(t=>t.rel?.toLowerCase()==='canonical').map(t=>t.href);
 check(canonical.length===1&&canonical[0]===canonicalOrigin+path,`${label}: incorrect canonical ${JSON.stringify(canonical)}`);
 for(const meta of tags(html,'meta')) if(/^(robots|googlebot)$/i.test(meta.name??'')) check(!/\b(noindex|none)\b/i.test(meta.content??''),label+': noindex meta');
}
for(const url of urls){
 const u=new URL(url);check(u.origin===canonicalOrigin,'noncanonical sitemap origin '+url);
 check(!getMigrationRedirectLocation(url)&&u.pathname!=='/sample-digital-marketing-strategy/','redirect/Gone in sitemap '+url);
 check(!removed.includes(u.pathname),'removed work destination in sitemap '+url);
 const file=htmlPath(u.pathname);check(existsSync(file),'missing HTML for sitemap '+url);
 if(existsSync(file))validateHtml(read(file),u.pathname,'built '+url);
}
const workUrls=urls.map(u=>new URL(u).pathname).filter(p=>p.startsWith('/work/')&&p!=='/work/').sort();
check(JSON.stringify(workUrls)===JSON.stringify(expected),'sitemap work set differs from reviewed published set');
report.sitemapIndex=sitemapFiles;report.sitemapPageCount=urls.length;report.sitemapCaseStudies=workUrls;
function files(dir){return readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(join(dir,e.name)):[join(dir,e.name)]);}
const deadLinks=[];const legacyLinks=[];const allHtml=files(dist).filter(f=>f.endsWith('.html'));
for(const file of allHtml){for(const href of links(read(file))){
 let u;try{u=new URL(href,canonicalOrigin);}catch{continue;}
 if(u.origin!==canonicalOrigin)continue;
 if(u.pathname.startsWith('/work/')&&u.pathname!=='/work/'&&!existsSync(htmlPath(u.pathname)))deadLinks.push({file:file.slice(dist.length),href});
 if(u.pathname.startsWith('/casestudy/'))legacyLinks.push({file:file.slice(dist.length),href});
}}
check(deadLinks.length===0,'dead rendered work links');check(legacyLinks.length===0,'rendered legacy case-study links');
report.htmlFilesScanned=allHtml.length;report.deadInternalLinks=deadLinks;report.legacyInternalLinks=legacyLinks;
const hub=read(htmlPath('/work/'));
const cards=tags(hub,'a').filter(a=>(a.class??'').split(/\s+/).includes('work-card')).map(a=>a.href).sort();
check(JSON.stringify(cards)===JSON.stringify(expected),'work hub cards differ from published projects');
check(!tags(hub,'div').some(a=>(a.class??'').split(/\s+/).includes('work-card__placeholder')),'work hub contains missing-image placeholders');
report.hubCards=cards;
if(origin){
 const requests=[...urls.map(u=>({path:new URL(u).pathname,status:200})),{path:'/sitemap-index.xml',status:200},...sitemapFiles.map(u=>({path:new URL(u).pathname,status:200}))];
 // Only a local preview is expected to contain the un-deployed redirect removals.
 if(new URL(origin).hostname==='127.0.0.1'||new URL(origin).hostname==='localhost'){
  for(const path of ['/casestudy','/casestudy/'])requests.push({path,status:301,target:'/work/'});
  requests.push({path:'/casestudy/unknown-release-probe/',status:404});
  for(const path of ['/sample-digital-marketing-strategy','/sample-digital-marketing-strategy/','/sample-digital-marketing-strategy/?ref=legacy'])requests.push({path,status:404});
  for(const slug of decisions.removedCaseStudySlugs)for(const path of [`/casestudy/${slug}`,`/casestudy/${slug}/`,`/work/${slug}/`])requests.push({path,status:404});
  for(const slug of decisions.activePublishedSlugs.filter(s=>s!=='cloud-cost-optimization-industrial-sme'))for(const path of [`/casestudy/${slug}`,`/casestudy/${slug}/`])requests.push({path,status:301,target:`/work/${slug}/`});
 }
 let cursor=0;const responses=[];
 await Promise.all(Array.from({length:6},async()=>{while(cursor<requests.length){const request=requests[cursor++];try{
  const response=await fetch(origin+request.path,{redirect:'manual',signal:AbortSignal.timeout(20000)});
  const html=await response.text();const location=response.headers.get('location');
  check(response.status===request.status,`${origin+request.path}: expected ${request.status}, got ${response.status}`);
  if(request.status===200){check(!/\b(noindex|none)\b/i.test(response.headers.get('x-robots-tag')??''),'noindex header '+request.path);
   if(!request.path.endsWith('.xml')){
    validateHtml(html,request.path,'HTTP '+origin+request.path);
    for(const href of links(html)){
     let u;try{u=new URL(href,canonicalOrigin);}catch{continue;}
     if(u.origin===canonicalOrigin&&u.pathname.startsWith('/work/')&&u.pathname!=='/work/')check(expected.includes(u.pathname),`HTTP dead/unreviewed work link ${request.path} -> ${href}`);
     if(u.origin===canonicalOrigin)check(!u.pathname.startsWith('/casestudy/'),`HTTP legacy work link ${request.path} -> ${href}`);
    }
    if(request.path==='/work/'){
     const liveCards=tags(html,'a').filter(a=>(a.class??'').split(/\s+/).includes('work-card')).map(a=>a.href).sort();
     check(JSON.stringify(liveCards)===JSON.stringify(expected),'HTTP work hub differs from reviewed projects');
     check(!tags(html,'div').some(a=>(a.class??'').split(/\s+/).includes('work-card__placeholder')),'HTTP work hub has placeholder image');
    }
   }
   else check(JSON.stringify(locs(html))===JSON.stringify(locs(read(join(dist,request.path)))),'served sitemap differs from generated '+request.path);
  }
  if(request.target)check(new URL(location,origin).pathname===request.target,'wrong retained redirect '+request.path);
  if(request.status===404){
   check(!location,'unexpected redirect on removed source '+request.path);
   check(/text\/html/i.test(response.headers.get('content-type')??'')&&/Page Not Found/i.test(html),'not the normal site 404 page '+request.path);
  }
  responses.push({path:request.path,status:response.status,location});
 }catch(error){errors.push(request.path+': '+error.message);}}}));
 report.http=responses.sort((a,b)=>a.path.localeCompare(b.path));
}
if(output)writeFileSync(output,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({...report,http:report.http?`${report.http.length} HTTP responses (see output file)`:undefined},null,2));
if(errors.length)process.exitCode=1;
