import {parse} from 'parse5';
import {readFileSync,writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
export const attr=(n,k)=>n.attrs?.find(a=>a.name===k)?.value;
export const txt=n=>n.nodeName==='#text'?n.value:(n.childNodes||[]).filter(c=>!['script','style'].includes(c.tagName)).map(txt).join(' ').replace(/\s+/g,' ').trim();
export function inspect(html,url){
 const tree=parse(html,{sourceCodeLocationInfo:true});const all=[];function walk(n){if(n.tagName)all.push(n);for(const c of n.childNodes||[])walk(c);}walk(tree);
 const inBody=n=>{for(let p=n;p;p=p.parentNode)if((attr(p,'class')||'').includes('blog-content__body'))return true;return false;};
 const headings=all.filter(n=>/^h[1-6]$/.test(n.tagName)).map(n=>({level:+n.tagName[1],text:txt(n),source:inBody(n)?'CMS body':'template',hidden:attr(n,'hidden')!==undefined||/display:\s*none|visibility:\s*hidden/.test(attr(n,'style')||'')||/sr-only|visually-hidden/.test(attr(n,'class')||'')}));
 const hierarchy=headings.flatMap((h,i)=>i&&h.level>headings[i-1].level+1?[{previous:headings[i-1],heading:h}]:[]);
 const images=all.filter(n=>n.tagName==='img').map(n=>{const alt=attr(n,'alt');let context=attr(n,'class')||'';for(let p=n.parentNode;p&&context.length<300;p=p.parentNode)context+=' '+(attr(p,'class')||'');const category=/page-hero__bg|hero__bg|background|rsg-card__content|industry-card__icon|accordion-item__bg|value-card/.test(context)?'A':/logo|brand/i.test(context+' '+alt)?'C':/author|team|testimonial|t-avatar/i.test(context)?'D':/blog-card__image|featured-post__image/.test(context)||inBody(n)?'E':'B';return {src:attr(n,'src'),alt:alt??null,category,context:context.trim()};});
 const ids=all.map(n=>attr(n,'id')).filter(Boolean);const duplicateIds=[...new Set(ids.filter((id,i)=>ids.indexOf(id)!==i))];
 const accessible=n=>txt(n)||attr(n,'aria-label')||attr(n,'aria-labelledby')||(n.childNodes||[]).some(c=>c.tagName==='img'&&attr(c,'alt'))||(n.childNodes||[]).some(c=>c.tagName==='svg'&&txt(c));
 const links=all.filter(n=>n.tagName==='a').map(n=>({href:attr(n,'href')??null,text:txt(n),body:inBody(n),accessible:!!accessible(n)}));
 const schemas=[];const schemaErrors=[];for(const n of all.filter(n=>n.tagName==='script'&&attr(n,'type')==='application/ld+json'))try{schemas.push(JSON.parse((n.childNodes||[]).map(c=>c.value||'').join('')));}catch(e){schemaErrors.push(e.message);}
 const titles=all.filter(n=>n.tagName==='title'&&n.parentNode?.tagName==='head').map(txt),canonicals=all.filter(n=>n.tagName==='link'&&attr(n,'rel')==='canonical').map(n=>attr(n,'href'));
 return{url,tables:all.filter(n=>n.tagName==='table').length,columnHeaders:all.filter(n=>n.tagName==='th'&&attr(n,'scope')==='col').length,h1:headings.filter(h=>h.level===1),h2:headings.filter(h=>h.level===2).length,h3:headings.filter(h=>h.level===3).length,headings,hierarchy,images,duplicateIds,links,emptyButtons:all.filter(n=>n.tagName==='button'&&!accessible(n)).length,titles,canonicals,noindex:all.some(n=>n.tagName==='meta'&&['robots','googlebot'].includes(attr(n,'name'))&&/noindex|none/.test(attr(n,'content')||'')),schemas,schemaErrors,emptyBodyElements:all.filter(n=>inBody(n)&&['p','h1','h2','h3','h4','li'].includes(n.tagName)&&!txt(n)&&!n.childNodes?.some(c=>c.tagName==='img')).map(n=>n.tagName),bodyText:all.filter(n=>(attr(n,'class')||'').split(' ').includes('blog-content__body')).map(txt).join(' '),proof:all.filter(n=>['p','li','h2','h3','span'].includes(n.tagName)).map(txt).filter(t=>t.length<600&&/\b(certified|certification|official partner|award|ARR|funding|savings|countries|satisfaction|projects delivered)\b|\d[\d,.]*\s*%|\$\d/i.test(t))};
}
if(process.argv[1]===fileURLToPath(import.meta.url)){
 const input=process.argv[2],output=process.argv[3];let pages;
 if(input==='build'){const sm=readFileSync('dist/client/sitemap-0.xml','utf8');pages=[...sm.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>({url:m[1],html:readFileSync('dist/client'+new URL(m[1]).pathname+'index.html','utf8'),status:null}));}else pages=JSON.parse(readFileSync(input));
 const results=pages.map(p=>({...inspect(p.html,p.url),status:p.status}));
 writeFileSync(output,JSON.stringify({timestamp:new Date().toISOString(),pages:results},null,2)+'\n');
 console.log(JSON.stringify({pages:results.length,h1Problems:results.filter(p=>p.h1.length!==1||p.h1.some(h=>!h.text||h.hidden)).map(p=>[p.url,p.h1.length]),images:results.flatMap(p=>p.images).length,missingAlt:results.flatMap(p=>p.images).filter(i=>i.alt===null).length,hierarchy:results.filter(p=>p.hierarchy.length).map(p=>[p.url,p.hierarchy.length]),duplicateIds:results.filter(p=>p.duplicateIds.length).map(p=>[p.url,p.duplicateIds]),emptyButtons:results.filter(p=>p.emptyButtons),emptyBody:results.filter(p=>p.emptyBodyElements.length).map(p=>[p.url,p.emptyBodyElements])},null,2));
}
