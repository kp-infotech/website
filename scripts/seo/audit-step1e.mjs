// Step 1E read-only verification. Run after a fresh authenticated published build.
// Optional --origin checks a local Worker; --inventory uses a published CMS snapshot.
import {readFileSync, readdirSync, existsSync, writeFileSync} from 'node:fs';
import {join, resolve} from 'node:path';
const root=resolve(new URL('../../',import.meta.url).pathname);
const dist=join(root,'dist/client');
const arg=name=>process.argv.find(a=>a.startsWith(`--${name}=`))?.slice(name.length+3);
const origin=arg('origin');
const slugs=['business-process-automation-tools','business-process-improvement-methods','devops-best-practices','how-to-choose-erp-system','on-premise-vs-cloud-erp','what-is-custom-software'];
const canonicalOrigin='https://kpinfo.tech';
const errors=[]; const report={errors,articles:[],redirects:[],deadInternalLinks:[],checkedAt:new Date().toISOString()};
const check=(v,m)=>{if(!v)errors.push(m);};
const read=p=>readFileSync(p,'utf8');
const files=d=>readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(join(d,e.name)):[join(d,e.name)]);
const htmlPath=p=>join(dist,p,'index.html');
const attrs=tag=>Object.fromEntries([...tag.matchAll(/([^\s=<>/"']+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)].map(m=>[m[1].toLowerCase(),m[2]??m[3]??m[4]]));
const tags=(h,n)=>[...h.matchAll(new RegExp(`<${n}\\b[^>]*>`,'gi'))].map(m=>attrs(m[0]));
const sitemap=[...read(join(dist,'sitemap-index.xml')).matchAll(/<loc>([^<]+)<\/loc>/g)].flatMap(m=>[...read(join(dist,new URL(m[1]).pathname)).matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]));
const walk=(v,out=[])=>{if(Array.isArray(v))v.forEach(x=>walk(x,out));else if(v&&typeof v==='object'){out.push(v);Object.values(v).forEach(x=>walk(x,out));}return out;};
function validateArticle(html,path){
 const canonicals=tags(html,'link').filter(t=>t.rel==='canonical').map(t=>t.href);
 check(canonicals.length===1&&canonicals[0]===canonicalOrigin+path,'canonical '+path);
 check(!tags(html,'meta').some(t=>/^(robots|googlebot)$/i.test(t.name??'')&&/\b(noindex|none)\b/i.test(t.content??'')),'indexability '+path);
 const schemas=[...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].flatMap(m=>{try{return walk(JSON.parse(m[1]));}catch{errors.push('invalid JSON-LD '+path);return [];}});
 const blog=schemas.filter(s=>s['@type']==='BlogPosting');
 check(blog.length===1&&blog[0].url===canonicalOrigin+path,'single BlogPosting '+path);
 check(schemas.some(s=>s['@type']==='BreadcrumbList'),'breadcrumbs '+path);
 check(tags(html,'article').length===1,'single article body '+path);
 const body=html.match(/<article\b[^>]*>([\s\S]*?)<\/article>/i)?.[1]??'';
 check(body.replace(/<[^>]*>/g,' ').trim().length>1000,'substantial rendered article '+path);
 return {canonical:canonicals[0],blogPosting:blog.length,breadcrumbs:schemas.some(s=>s['@type']==='BreadcrumbList'),articleElements:tags(html,'article').length,h1Count:tags(html,'h1').length};
}
for(const slug of slugs){const path=`/insights/${slug}/`;check(existsSync(htmlPath(path)),'missing '+path);check(sitemap.includes(canonicalOrigin+path),'sitemap missing '+path);if(existsSync(htmlPath(path))){const result=validateArticle(read(htmlPath(path)),path);report.articles.push({path,...result,inSitemap:true});}}
const htmlFiles=files(dist).filter(f=>f.endsWith('.html'));
for(const file of htmlFiles){const page='/'+file.slice(dist.length+1).replace(/index\.html$/,'');for(const a of tags(read(file),'a')){if(!a.href)continue;let u;try{u=new URL(a.href,canonicalOrigin+page);}catch{continue;}if(u.origin!==canonicalOrigin||!/^\/(work|insights)(\/|$)/.test(u.pathname))continue;if(!existsSync(htmlPath(u.pathname)))report.deadInternalLinks.push({page,href:a.href});}}
check(report.deadInternalLinks.length===0,'dead work/insight links');report.htmlFilesScanned=htmlFiles.length;report.sitemapPageCount=sitemap.length;
if(arg('inventory')){
 const inv=JSON.parse(read(arg('inventory')));
 const expected=inv.blogs.map(d=>`/insights/${d.slug.current}/`).sort();
 const actual=htmlFiles.map(f=>'/'+f.slice(dist.length+1).replace(/index\.html$/,'')).filter(p=>/^\/insights\/[^/]+\/$/.test(p)&&!/^\/insights\/\d+\/$/.test(p)).sort();
 check(JSON.stringify(actual)===JSON.stringify(expected),'generated insight routes differ from published query');
 check(!inv.records.some(d=>/^(drafts|versions)\./.test(d._id)),'published inventory exposes draft/release');
 const privateBlogs=inv.records.filter(d=>d._type==='blogPost'&&d._id.includes('.'));
 check(privateBlogs.every(d=>slugs.includes(d.slug)),'unexpected private blog in published inventory');
 report.publishedBlogRoutes=actual;report.approvedPrivateBlogIds=privateBlogs.map(d=>d._id);
}
if(origin){
 check(['localhost','127.0.0.1'].includes(new URL(origin).hostname),'HTTP origin must be local');
 if(!errors.length){
 for(const article of report.articles){const r=await fetch(origin+article.path,{redirect:'manual'});const html=await r.text();check(r.status===200,'article HTTP '+article.path);check(!/\b(noindex|none)\b/i.test(r.headers.get('x-robots-tag')??''),'noindex header '+article.path);validateArticle(html,article.path);article.httpStatus=r.status;}
 for(const slug of slugs){const destination=`/insights/${slug}/`;const sources=[`/blogs/${slug}/`,...(['devops-best-practices','what-is-custom-software'].includes(slug)?[`/${slug}/`]:[])];for(const source of sources)for(const path of [source,source.slice(0,-1)])for(const method of ['GET','HEAD']){
 const r=await fetch(origin+path,{method,redirect:'manual'});const location=r.headers.get('location');const u=location?new URL(location,origin):null;
 check(r.status===301&&u?.pathname===destination,'legacy migration '+method+' '+path);
 check(u?.origin===origin||u?.origin===canonicalOrigin,'unexpected destination host '+path);
 const final=u?await fetch(origin+u.pathname+u.search,{method,redirect:'manual'}):null;
 check(final?.status===200&&!final.headers.get('location'),'legacy final '+method+' '+path);
 report.redirects.push({source:path,method,status:r.status,location,finalStatus:final?.status});
 }
 }
 }
}
if(arg('output'))writeFileSync(arg('output'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));if(errors.length)process.exitCode=1;
